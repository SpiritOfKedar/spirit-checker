package parser

import (
	"strings"

	"github.com/nguyenthenguyen/docx"
)

// ParseDOCX extracts text from a DOCX file
func ParseDOCX(filePath string) (string, error) {
	r, err := docx.ReadDocxFile(filePath)
	if err != nil {
		return "", err
	}
	defer r.Close()

	doc := r.Editable()
	content := doc.GetContent()

	// Clean XML tags if any remain
	content = cleanDocxContent(content)

	return content, nil
}

// cleanDocxContent removes any residual XML formatting
func cleanDocxContent(content string) string {
	// The library should return clean text, but let's ensure
	var result strings.Builder
	var inTag bool

	for _, char := range content {
		if char == '<' {
			inTag = true
			continue
		}
		if char == '>' {
			inTag = false
			result.WriteRune(' ')
			continue
		}
		if !inTag {
			result.WriteRune(char)
		}
	}

	return strings.TrimSpace(result.String())
}
