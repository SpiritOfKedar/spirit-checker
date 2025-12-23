package nlp

import (
	"regexp"
	"strings"
)

// SectionPatterns regex patterns for section headers
var SectionPatterns = map[string]*regexp.Regexp{
	"skills":         regexp.MustCompile(`(?i)(technical\s+skills?|skills?|core\s+competencies|expertise|proficiencies)`),
	"experience":     regexp.MustCompile(`(?i)(work\s+experience|professional\s+experience|experience|employment\s+history|work\s+history)`),
	"education":      regexp.MustCompile(`(?i)(education|academic|qualifications|degrees?)`),
	"projects":       regexp.MustCompile(`(?i)(projects?|portfolio|personal\s+projects?|academic\s+projects?)`),
	"summary":        regexp.MustCompile(`(?i)(summary|profile|objective|about\s+me|professional\s+summary)`),
	"certifications": regexp.MustCompile(`(?i)(certifications?|certificates?|licenses?|credentials?)`),
	"achievements":   regexp.MustCompile(`(?i)(achievements?|accomplishments?|awards?|honors?)`),
}

// ClassifySections identifies and extracts resume sections
func ClassifySections(text string) map[string]string {
	sections := make(map[string]string)

	// First, try line-by-line detection
	lines := strings.Split(text, "\n")

	// If text has no newlines, try splitting by common section patterns
	if len(lines) <= 1 {
		// Try to find section headers in continuous text
		return classifySectionsFromContinuousText(text)
	}

	currentSection := "unknown"
	var currentContent strings.Builder

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}

		// Check if this line is a section header
		foundSection := false
		for sectionName, pattern := range SectionPatterns {
			// Match if line is short (likely a header) and matches pattern
			if pattern.MatchString(line) && len(line) < 60 {
				// Save previous section
				if currentContent.Len() > 0 {
					sections[currentSection] = strings.TrimSpace(currentContent.String())
				}
				currentSection = sectionName
				currentContent.Reset()
				foundSection = true
				break
			}
		}

		if !foundSection && currentSection != "" {
			currentContent.WriteString(line)
			currentContent.WriteString(" ")
		}
	}

	// Save last section
	if currentContent.Len() > 0 {
		sections[currentSection] = strings.TrimSpace(currentContent.String())
	}

	// If we didn't find many sections, try the continuous text approach as fallback
	if len(sections) <= 1 {
		fallbackSections := classifySectionsFromContinuousText(text)
		for k, v := range fallbackSections {
			if _, exists := sections[k]; !exists {
				sections[k] = v
			}
		}
	}

	return sections
}

// classifySectionsFromContinuousText extracts sections from text without clear line breaks
func classifySectionsFromContinuousText(text string) map[string]string {
	sections := make(map[string]string)
	textLower := strings.ToLower(text)

	// Find positions of section headers
	type sectionPos struct {
		name  string
		start int
		end   int
	}

	var positions []sectionPos

	for sectionName, pattern := range SectionPatterns {
		loc := pattern.FindStringIndex(textLower)
		if loc != nil {
			positions = append(positions, sectionPos{name: sectionName, start: loc[0], end: loc[1]})
		}
	}

	// Sort by position
	for i := 0; i < len(positions); i++ {
		for j := i + 1; j < len(positions); j++ {
			if positions[j].start < positions[i].start {
				positions[i], positions[j] = positions[j], positions[i]
			}
		}
	}

	// Extract content between sections
	for i, pos := range positions {
		start := pos.end
		var end int
		if i+1 < len(positions) {
			end = positions[i+1].start
		} else {
			end = len(text)
		}

		if start < end {
			content := strings.TrimSpace(text[start:end])
			if len(content) > 10 { // Only add if there's meaningful content
				sections[pos.name] = content
			}
		}
	}

	return sections
}

// GetSectionQuality evaluates the quality of a section
func GetSectionQuality(sectionName, content string) (score int, feedback string) {
	if content == "" {
		return 0, "Section not found in resume"
	}

	contentLen := len(content)
	wordCount := len(strings.Fields(content))

	switch sectionName {
	case "skills":
		skills := ExtractSkills(content)
		if len(skills) >= 10 {
			return 90, "Strong skills section with diverse technical skills"
		} else if len(skills) >= 5 {
			return 70, "Good skills section, consider adding more relevant skills"
		}
		return 50, "Limited skills mentioned, expand this section"

	case "experience":
		if wordCount >= 150 {
			return 85, "Detailed experience section"
		} else if wordCount >= 75 {
			return 70, "Good experience section, consider adding more details"
		}
		return 50, "Experience section could use more detail and quantifiable achievements"

	case "education":
		if contentLen >= 100 {
			return 85, "Well-formatted education section"
		}
		return 70, "Education section is present but brief"

	case "projects":
		if wordCount >= 100 {
			return 80, "Good projects section with detailed descriptions"
		} else if wordCount >= 30 {
			return 65, "Projects section present, add more details about technologies used"
		}
		return 50, "Consider expanding projects section"

	default:
		return 60, ""
	}
}
