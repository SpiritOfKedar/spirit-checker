package scorer

import (
	"github.com/gofiber/fiber/v2"
)

// ScoreRequest represents the scoring request from NLP service
type ScoreRequest struct {
	Skills          []string          `json:"skills"`
	MatchedSkills   []string          `json:"matchedSkills"`
	MissingSkills   []string          `json:"missingSkills"`
	Sections        map[string]string `json:"sections"`
	SimilarityScore float64           `json:"similarityScore"`
}

// SectionScore represents individual section scoring
type SectionScore struct {
	Score    int    `json:"score"`
	Feedback string `json:"feedback"`
}

// ScoreResponse represents the scoring result
type ScoreResponse struct {
	Score           int                     `json:"score"`
	Sections        map[string]SectionScore `json:"sections"`
	OverallFeedback string                  `json:"overallFeedback"`
	Error           string                  `json:"error,omitempty"`
}

// HandleScore processes the scoring request
func HandleScore(c *fiber.Ctx) error {
	var req ScoreRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ScoreResponse{
			Error: "Invalid request body",
		})
	}

	// Calculate skill match score
	skillScore := calculateSkillScore(req.MatchedSkills, req.MissingSkills)

	// Calculate section scores
	sectionScores := calculateSectionScores(req.Sections)

	// Calculate overall score (weighted)
	overallScore := calculateOverallScore(skillScore, req.SimilarityScore, sectionScores)

	// Generate feedback
	feedback := generateOverallFeedback(overallScore, skillScore, len(req.MissingSkills))

	response := ScoreResponse{
		Score:           overallScore,
		Sections:        sectionScores,
		OverallFeedback: feedback,
	}

	return c.JSON(response)
}
