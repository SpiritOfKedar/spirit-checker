package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// AnalyzeRequest represents the incoming analysis request
type AnalyzeRequest struct {
	Resume         string `json:"resume"`         // Base64 encoded file
	ResumeFileName string `json:"resumeFileName"` // Original filename
	JobDescription string `json:"jobDescription"` // Job description text
}

// AnalyzeResponse represents the analysis result
type AnalyzeResponse struct {
	Score           int                     `json:"score"`
	MatchedSkills   []string                `json:"matchedSkills"`
	MissingSkills   []string                `json:"missingSkills"`
	Sections        map[string]SectionScore `json:"sections"`
	OverallFeedback string                  `json:"overallFeedback"`
}

// SectionScore represents score for a resume section
type SectionScore struct {
	Score    int    `json:"score"`
	Feedback string `json:"feedback"`
}

// ParseResponse from resume-parser service
type ParseResponse struct {
	Text     string   `json:"text"`
	Sections []string `json:"sections"`
	Error    string   `json:"error,omitempty"`
}

// NLPAnalysisResponse from nlp-service
type NLPAnalysisResponse struct {
	Keywords        []string          `json:"keywords"`
	Skills          []string          `json:"skills"`
	Sections        map[string]string `json:"sections"`
	SimilarityScore float64           `json:"similarityScore"`
	MatchedSkills   []string          `json:"matchedSkills"`
	MissingSkills   []string          `json:"missingSkills"`
	Error           string            `json:"error,omitempty"`
}

// ScoringResponse from ats-scorer service
type ScoringResponse struct {
	Score           int                     `json:"score"`
	Sections        map[string]SectionScore `json:"sections"`
	OverallFeedback string                  `json:"overallFeedback"`
	Error           string                  `json:"error,omitempty"`
}

func getServiceURL(service string) string {
	envKey := strings.ToUpper(service) + "_SERVICE_URL"
	envKey = strings.ReplaceAll(envKey, "-", "_")

	defaultURLs := map[string]string{
		"resume-parser": "https://ats-resume-parser-ykin.onrender.com",
		"nlp-service":   "https://ats-nlp-service.onrender.com",
		"ats-scorer":    "https://ats-ats-scorer.onrender.com",
	}

	if url := os.Getenv(envKey); url != "" {
		log.Printf("[DEBUG] Service %s using URL from env %s: %s", service, envKey, url)
		return url
	}
	log.Printf("[DEBUG] Service %s using default URL: %s", service, defaultURLs[service])
	return defaultURLs[service]
}

// AnalyzeResume handles the main analysis endpoint
func AnalyzeResume(c *fiber.Ctx) error {
	var req AnalyzeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Validate request
	if req.Resume == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Resume file is required",
		})
	}
	if req.JobDescription == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Job description is required",
		})
	}

	// Step 1: Parse resume
	parseResp, err := callParseService(req.Resume, req.ResumeFileName)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to parse resume: %v", err),
		})
	}

	// Step 2: NLP Analysis
	nlpResp, err := callNLPService(parseResp.Text, req.JobDescription)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to analyze resume: %v", err),
		})
	}

	// Step 3: Calculate ATS Score
	scoreResp, err := callScoringService(nlpResp)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": fmt.Sprintf("Failed to calculate score: %v", err),
		})
	}

	// Build response
	response := AnalyzeResponse{
		Score:           scoreResp.Score,
		MatchedSkills:   nlpResp.MatchedSkills,
		MissingSkills:   nlpResp.MissingSkills,
		Sections:        scoreResp.Sections,
		OverallFeedback: scoreResp.OverallFeedback,
	}

	return c.JSON(response)
}

func callParseService(resumeBase64, fileName string) (*ParseResponse, error) {
	url := getServiceURL("resume-parser") + "/parse"

	payload := map[string]string{
		"resume":   resumeBase64,
		"fileName": fileName,
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var parseResp ParseResponse
	if err := json.Unmarshal(body, &parseResp); err != nil {
		return nil, err
	}

	if parseResp.Error != "" {
		return nil, fmt.Errorf(parseResp.Error)
	}

	return &parseResp, nil
}

func callNLPService(resumeText, jobDescription string) (*NLPAnalysisResponse, error) {
	url := getServiceURL("nlp-service") + "/analyze"

	payload := map[string]string{
		"resumeText":     resumeText,
		"jobDescription": jobDescription,
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var nlpResp NLPAnalysisResponse
	if err := json.Unmarshal(body, &nlpResp); err != nil {
		return nil, err
	}

	if nlpResp.Error != "" {
		return nil, fmt.Errorf(nlpResp.Error)
	}

	return &nlpResp, nil
}

func callScoringService(nlpResp *NLPAnalysisResponse) (*ScoringResponse, error) {
	url := getServiceURL("ats-scorer") + "/score"

	payload := map[string]interface{}{
		"skills":          nlpResp.Skills,
		"matchedSkills":   nlpResp.MatchedSkills,
		"missingSkills":   nlpResp.MissingSkills,
		"sections":        nlpResp.Sections,
		"similarityScore": nlpResp.SimilarityScore,
	}

	jsonData, _ := json.Marshal(payload)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	var scoreResp ScoringResponse
	if err := json.Unmarshal(body, &scoreResp); err != nil {
		return nil, err
	}

	if scoreResp.Error != "" {
		return nil, fmt.Errorf(scoreResp.Error)
	}

	return &scoreResp, nil
}
