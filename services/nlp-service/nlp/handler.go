package nlp

import (
	"github.com/gofiber/fiber/v2"
)

// AnalyzeRequest represents the analysis request
type AnalyzeRequest struct {
	ResumeText     string `json:"resumeText"`
	JobDescription string `json:"jobDescription"`
}

// AnalyzeResponse represents the analysis result
type AnalyzeResponse struct {
	Keywords        []string          `json:"keywords"`
	Skills          []string          `json:"skills"`
	Sections        map[string]string `json:"sections"`
	SimilarityScore float64           `json:"similarityScore"`
	MatchedSkills   []string          `json:"matchedSkills"`
	MissingSkills   []string          `json:"missingSkills"`
	Error           string            `json:"error,omitempty"`
}

// HandleAnalyze processes resume and JD analysis
func HandleAnalyze(c *fiber.Ctx) error {
	var req AnalyzeRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(AnalyzeResponse{
			Error: "Invalid request body",
		})
	}

	if req.ResumeText == "" || req.JobDescription == "" {
		return c.Status(fiber.StatusBadRequest).JSON(AnalyzeResponse{
			Error: "Resume text and job description are required",
		})
	}

	// Extract keywords from resume
	resumeKeywords := ExtractKeywords(req.ResumeText)

	// Extract skills from resume
	resumeSkills := ExtractSkills(req.ResumeText)

	// Extract required skills from JD
	jdSkills := ExtractSkills(req.JobDescription)

	// Find matched and missing skills
	matchedSkills, missingSkills := CompareSkills(resumeSkills, jdSkills)

	// Classify resume sections
	sections := ClassifySections(req.ResumeText)

	// Calculate TF-IDF similarity
	similarity := CalculateSimilarity(req.ResumeText, req.JobDescription)

	response := AnalyzeResponse{
		Keywords:        resumeKeywords,
		Skills:          resumeSkills,
		Sections:        sections,
		SimilarityScore: similarity,
		MatchedSkills:   matchedSkills,
		MissingSkills:   missingSkills,
	}

	return c.JSON(response)
}
