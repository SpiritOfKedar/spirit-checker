package parser

import (
	"encoding/base64"
	"os"
	"path/filepath"
	"strings"

	"github.com/gofiber/fiber/v2"
)

// ParseRequest represents incoming parse request
type ParseRequest struct {
	Resume   string `json:"resume"`   // Base64 encoded file
	FileName string `json:"fileName"` // Original filename
}

// ParseResponse represents parsing result
type ParseResponse struct {
	Text     string   `json:"text"`
	Sections []string `json:"sections"`
	Error    string   `json:"error,omitempty"`
}

// HandleParse handles the parse endpoint
func HandleParse(c *fiber.Ctx) error {
	var req ParseRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ParseResponse{
			Error: "Invalid request body",
		})
	}

	if req.Resume == "" {
		return c.Status(fiber.StatusBadRequest).JSON(ParseResponse{
			Error: "Resume file is required",
		})
	}

	// Decode base64
	decoded, err := base64.StdEncoding.DecodeString(req.Resume)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(ParseResponse{
			Error: "Invalid base64 encoding",
		})
	}

	// Create temp file
	ext := strings.ToLower(filepath.Ext(req.FileName))
	tmpFile, err := os.CreateTemp("", "resume-*"+ext)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ParseResponse{
			Error: "Failed to create temp file",
		})
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()

	if _, err := tmpFile.Write(decoded); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ParseResponse{
			Error: "Failed to write temp file",
		})
	}
	tmpFile.Close()

	// Parse based on file type
	var text string
	switch ext {
	case ".pdf":
		text, err = ParsePDF(tmpFile.Name())
	case ".docx":
		text, err = ParseDOCX(tmpFile.Name())
	default:
		return c.Status(fiber.StatusBadRequest).JSON(ParseResponse{
			Error: "Unsupported file type. Only PDF and DOCX are supported.",
		})
	}

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(ParseResponse{
			Error: "Failed to parse file: " + err.Error(),
		})
	}

	// Normalize text
	text = NormalizeText(text)

	// Detect sections
	sections := DetectSections(text)

	return c.JSON(ParseResponse{
		Text:     text,
		Sections: sections,
	})
}
