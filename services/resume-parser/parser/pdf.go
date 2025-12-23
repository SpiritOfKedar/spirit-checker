package parser

import (
	"bytes"
	"strings"

	"github.com/ledongthuc/pdf"
)

// ParsePDF extracts text from a PDF file
func ParsePDF(filePath string) (string, error) {
	f, r, err := pdf.Open(filePath)
	if err != nil {
		return "", err
	}
	defer f.Close()

	var buf bytes.Buffer
	totalPages := r.NumPage()

	for pageNum := 1; pageNum <= totalPages; pageNum++ {
		page := r.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		text, err := page.GetPlainText(nil)
		if err != nil {
			continue
		}

		buf.WriteString(text)
		buf.WriteString("\n")
	}

	return buf.String(), nil
}

// NormalizeText cleans and normalizes extracted text while preserving structure
func NormalizeText(text string) string {
	// Replace common problematic characters first
	replacements := map[string]string{
		"\u00a0": " ",  // Non-breaking space
		"\u2022": "-",  // Bullet point
		"\u2013": "-",  // En dash
		"\u2014": "-",  // Em dash
		"\u2018": "'",  // Left single quote
		"\u2019": "'",  // Right single quote
		"\u201c": "\"", // Left double quote
		"\u201d": "\"", // Right double quote
	}

	for old, new := range replacements {
		text = strings.ReplaceAll(text, old, new)
	}

	// Normalize line endings
	text = strings.ReplaceAll(text, "\r\n", "\n")
	text = strings.ReplaceAll(text, "\r", "\n")

	// Process line by line to preserve structure
	lines := strings.Split(text, "\n")
	var result []string

	for _, line := range lines {
		// Clean each line individually (collapse multiple spaces)
		line = strings.Join(strings.Fields(line), " ")
		line = strings.TrimSpace(line)

		// Keep non-empty lines
		if line != "" {
			result = append(result, line)
		}
	}

	// Join with newlines to preserve line structure for section detection
	return strings.Join(result, "\n")
}

// DetectSections identifies resume sections from text
func DetectSections(text string) []string {
	sectionPatterns := []string{
		"experience",
		"education",
		"skills",
		"projects",
		"work history",
		"professional experience",
		"technical skills",
		"certifications",
		"achievements",
		"summary",
		"objective",
		"contact",
	}

	textLower := strings.ToLower(text)
	var foundSections []string

	for _, pattern := range sectionPatterns {
		if strings.Contains(textLower, pattern) {
			foundSections = append(foundSections, pattern)
		}
	}

	return foundSections
}
