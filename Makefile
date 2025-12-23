.PHONY: build up down logs dev test clean git-sync

# Build all services
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Start with logs
up-logs:
	docker-compose up

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Development mode - run services individually
dev-gateway:
	cd services/api-gateway && go run main.go

dev-parser:
	cd services/resume-parser && go run main.go

dev-nlp:
	cd services/nlp-service && go run main.go

dev-scorer:
	cd services/ats-scorer && go run main.go

dev-frontend:
	cd frontend && npm run dev

# Run all Go tests
test:
	cd services/api-gateway && go test ./...
	cd services/resume-parser && go test ./...
	cd services/nlp-service && go test ./...
	cd services/ats-scorer && go test ./...

# Initialize Go modules (run after cloning)
init:
	cd services/api-gateway && go mod tidy
	cd services/resume-parser && go mod tidy
	cd services/nlp-service && go mod tidy
	cd services/ats-scorer && go mod tidy
	cd frontend && npm install

# Clean up
clean:
	docker-compose down -v --rmi local
	find . -name "*.exe" -delete
	find . -name "*.test" -delete

# Git sync
git-sync:
	git pull --rebase
	git push
