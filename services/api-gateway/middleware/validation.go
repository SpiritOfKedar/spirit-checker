package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
)

// ValidateRequest validates incoming API requests
func ValidateRequest(c *fiber.Ctx) error {
	// Check content type for POST requests
	if c.Method() == "POST" {
		contentType := string(c.Request().Header.ContentType())
		if !strings.Contains(contentType, "application/json") {
			return c.Status(fiber.StatusUnsupportedMediaType).JSON(fiber.Map{
				"error": "Content-Type must be application/json",
			})
		}
	}

	return c.Next()
}

// RateLimiter basic rate limiting middleware (placeholder for future implementation)
func RateLimiter(c *fiber.Ctx) error {
	// TODO: Implement rate limiting with Redis
	return c.Next()
}
