package scorer

import (
	"fmt"
	"strings"
)

// calculateSectionScores evaluates each resume section
func calculateSectionScores(sections map[string]string) map[string]SectionScore {
	scores := make(map[string]SectionScore)

	// Skills section
	if content, exists := sections["skills"]; exists && content != "" {
		score, feedback := evaluateSkillsSection(content)
		scores["skills"] = SectionScore{Score: score, Feedback: feedback}
	} else {
		scores["skills"] = SectionScore{Score: 30, Feedback: "Skills section not found or empty. Add a dedicated skills section."}
	}

	// Experience section
	if content, exists := sections["experience"]; exists && content != "" {
		score, feedback := evaluateExperienceSection(content)
		scores["experience"] = SectionScore{Score: score, Feedback: feedback}
	} else {
		scores["experience"] = SectionScore{Score: 40, Feedback: "Experience section not clearly identified. Ensure work experience is highlighted."}
	}

	// Education section
	if content, exists := sections["education"]; exists && content != "" {
		score, feedback := evaluateEducationSection(content)
		scores["education"] = SectionScore{Score: score, Feedback: feedback}
	} else {
		scores["education"] = SectionScore{Score: 50, Feedback: "Education section not found or brief."}
	}

	// Projects section
	if content, exists := sections["projects"]; exists && content != "" {
		score, feedback := evaluateProjectsSection(content)
		scores["projects"] = SectionScore{Score: score, Feedback: feedback}
	} else {
		scores["projects"] = SectionScore{Score: 40, Feedback: "Consider adding a projects section to showcase practical work."}
	}

	return scores
}

func evaluateSkillsSection(content string) (int, string) {
	wordCount := len(strings.Fields(content))

	if wordCount >= 30 {
		return 90, "Comprehensive skills section with good variety."
	} else if wordCount >= 15 {
		return 75, "Good skills section. Consider adding more relevant technologies."
	} else if wordCount >= 5 {
		return 60, "Skills section present but could be expanded."
	}
	return 40, "Skills section is too brief. Add more details."
}

func evaluateExperienceSection(content string) (int, string) {
	wordCount := len(strings.Fields(content))

	// Check for action verbs (indicates good resume writing)
	actionVerbs := []string{"developed", "implemented", "managed", "led", "created", "designed",
		"improved", "increased", "reduced", "built", "launched", "achieved", "delivered"}

	actionVerbCount := 0
	contentLower := strings.ToLower(content)
	for _, verb := range actionVerbs {
		if strings.Contains(contentLower, verb) {
			actionVerbCount++
		}
	}

	// Check for metrics/numbers
	hasMetrics := strings.ContainsAny(content, "0123456789%")

	baseScore := 50
	if wordCount >= 200 {
		baseScore += 20
	} else if wordCount >= 100 {
		baseScore += 10
	}

	if actionVerbCount >= 5 {
		baseScore += 15
	} else if actionVerbCount >= 2 {
		baseScore += 8
	}

	if hasMetrics {
		baseScore += 10
	}

	if baseScore > 95 {
		baseScore = 95
	}

	var feedback string
	if baseScore >= 80 {
		feedback = "Strong experience section with good use of action verbs and metrics."
	} else if baseScore >= 60 {
		feedback = "Good experience section. Consider adding more quantifiable achievements."
	} else {
		feedback = "Experience section needs improvement. Use action verbs and include metrics."
	}

	return baseScore, feedback
}

func evaluateEducationSection(content string) (int, string) {
	wordCount := len(strings.Fields(content))

	if wordCount >= 50 {
		return 85, "Well-detailed education section."
	} else if wordCount >= 20 {
		return 75, "Good education section with essential details."
	}
	return 60, "Education section is present but brief. Consider adding relevant coursework or achievements."
}

func evaluateProjectsSection(content string) (int, string) {
	wordCount := len(strings.Fields(content))

	// Check for technology mentions
	techTerms := []string{"github", "deployed", "built", "using", "stack", "api", "database"}
	techCount := 0
	contentLower := strings.ToLower(content)
	for _, term := range techTerms {
		if strings.Contains(contentLower, term) {
			techCount++
		}
	}

	baseScore := 50
	if wordCount >= 100 {
		baseScore += 20
	} else if wordCount >= 50 {
		baseScore += 10
	}

	if techCount >= 3 {
		baseScore += 15
	} else if techCount >= 1 {
		baseScore += 8
	}

	if baseScore > 90 {
		baseScore = 90
	}

	var feedback string
	if baseScore >= 75 {
		feedback = "Great projects section showcasing technical abilities."
	} else if baseScore >= 55 {
		feedback = "Good projects section. Add more details about technologies used and project impact."
	} else {
		feedback = "Projects section could use more detail. Describe technologies, your role, and outcomes."
	}

	return baseScore, feedback
}

// calculateOverallScore computes weighted average of all scores
func calculateOverallScore(skillScore, similarityScore float64, sectionScores map[string]SectionScore) int {
	// Average section scores
	var sectionTotal float64
	sectionCount := 0
	for _, section := range sectionScores {
		sectionTotal += float64(section.Score)
		sectionCount++
	}

	avgSectionScore := float64(50)
	if sectionCount > 0 {
		avgSectionScore = sectionTotal / float64(sectionCount)
	}

	// Weighted calculation
	overall := (skillScore * SkillWeight) +
		(similarityScore * SimilarityWeight) +
		(avgSectionScore * SectionWeight)

	// Ensure within bounds
	if overall > 100 {
		overall = 100
	}
	if overall < 0 {
		overall = 0
	}

	return int(overall)
}

// generateOverallFeedback creates summary feedback based on score
func generateOverallFeedback(overallScore int, skillScore float64, missingSkillCount int) string {
	var parts []string

	// Overall assessment
	if overallScore >= 80 {
		parts = append(parts, "Excellent resume with strong alignment to the job requirements.")
	} else if overallScore >= 65 {
		parts = append(parts, "Good resume with reasonable match to the job description.")
	} else if overallScore >= 50 {
		parts = append(parts, "Resume shows some relevance but needs improvements for better ATS performance.")
	} else {
		parts = append(parts, "Resume needs significant improvements to match job requirements.")
	}

	// Skill-specific feedback
	if skillScore >= 80 {
		parts = append(parts, "Your skills strongly match the job requirements.")
	} else if missingSkillCount > 0 {
		parts = append(parts, fmt.Sprintf("Consider adding %d missing skills if you have experience with them.", missingSkillCount))
	}

	// General tips
	if overallScore < 70 {
		parts = append(parts, "Tips: Use keywords from the job description, quantify achievements, and ensure clear section headers.")
	}

	return strings.Join(parts, " ")
}
