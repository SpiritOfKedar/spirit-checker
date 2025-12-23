package main

import (
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"

	"github.com/kedar/ats-checker/ats-scorer/scorer"
)

func main() {
	godotenv.Load()

	app := fiber.New()

	app.Use(logger.New())
	app.Use(recover.New())

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "service": "ats-scorer"})
	})

	// Scoring endpoint
	app.Post("/score", scorer.HandleScore)

	port := getEnv("PORT", "8083")
	log.Printf("ATS Scorer service starting on port %s", port)

	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return fallback
}
