package scorer

import (
	"os"
	"strconv"
)

// Scoring weights (configurable via environment)
var (
	SkillWeight      = getEnvFloat("SKILL_WEIGHT", 0.40)
	SimilarityWeight = getEnvFloat("SIMILARITY_WEIGHT", 0.30)
	SectionWeight    = getEnvFloat("SECTION_WEIGHT", 0.30)
)

func getEnvFloat(key string, fallback float64) float64 {
	if value := os.Getenv(key); value != "" {
		if f, err := strconv.ParseFloat(value, 64); err == nil {
			return f
		}
	}
	return fallback
}

// calculateSkillScore computes score based on skill matching
func calculateSkillScore(matched, missing []string) float64 {
	totalSkills := len(matched) + len(missing)
	if totalSkills == 0 {
		return 50 // Default if no skills to compare
	}

	matchRatio := float64(len(matched)) / float64(totalSkills)
	return matchRatio * 100
}
