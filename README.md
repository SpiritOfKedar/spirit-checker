# spirit-checker: ATS Resume Checker

A microservices-based Applicant Tracking System (ATS) resume analyzer built with Go and Next.js. This tool parses resumes, extracts skills and keywords using NLP techniques, and calculates a compatibility score against job descriptions.

## Overview

Most job applications are filtered by ATS software before reaching human recruiters. This tool helps candidates understand how well their resume matches a specific job posting by:

- Extracting text from PDF and DOCX resumes
- Identifying skills, keywords, and resume sections
- Comparing resume content against job descriptions using TF-IDF similarity
- Generating a weighted compatibility score with actionable feedback

## Architecture

The system follows a microservices architecture with four independent services communicating via REST APIs:

```
                                    +------------------+
                                    |    Frontend      |
                                    |   (Next.js)      |
                                    |   Port 3000      |
                                    +--------+---------+
                                             |
                                             v
                                    +--------+---------+
                                    |   API Gateway    |
                                    |   Port 8080      |
                                    +--------+---------+
                                             |
              +------------------------------+------------------------------+
              |                              |                              |
              v                              v                              v
    +---------+----------+        +----------+---------+        +-----------+--------+
    |   Resume Parser    |        |    NLP Service     |        |    ATS Scorer      |
    |   Port 8081        |        |    Port 8082       |        |    Port 8083       |
    +--------------------+        +--------------------+        +--------------------+
    | - PDF extraction   |        | - Tokenization     |        | - Score calculation|
    | - DOCX extraction  |        | - Skill extraction |        | - Section grading  |
    | - Text cleanup     |        | - TF-IDF analysis  |        | - Feedback gen     |
    +--------------------+        +--------------------+        +--------------------+
```

### Service Responsibilities

| Service | Port | Description |
|---------|------|-------------|
| API Gateway | 8080 | Request routing, CORS handling, service orchestration |
| Resume Parser | 8081 | PDF/DOCX text extraction, section detection, text normalization |
| NLP Service | 8082 | Tokenization, keyword extraction, skill matching, TF-IDF similarity |
| ATS Scorer | 8083 | Weighted scoring algorithm, section evaluation, feedback generation |

## Scoring Algorithm

The final ATS score is calculated using a weighted formula:

```
Score = (SkillMatch × 0.40) + (TextSimilarity × 0.30) + (SectionQuality × 0.30)
```

### Skill Matching (40%)

The system maintains a database of 80+ technical and soft skills. It scans both the resume and job description, then calculates:

```
SkillScore = (MatchedSkills / TotalRequiredSkills) × 100
```

Skills database includes programming languages, frameworks, cloud platforms, databases, DevOps tools, and soft skills.

### Text Similarity (30%)

Uses TF-IDF (Term Frequency-Inverse Document Frequency) vectorization followed by cosine similarity to measure how closely the resume text matches the job description vocabulary.

### Section Quality (30%)

Each resume section is evaluated independently:

| Section | Criteria |
|---------|----------|
| Skills | Number of recognized skills, variety of technologies |
| Experience | Word count, action verbs (developed, implemented, led), quantified metrics |
| Education | Level of detail, relevant coursework |
| Projects | Technical depth, technology mentions, project descriptions |

## Tech Stack

**Backend**
- Go 1.21+
- Fiber v2 (HTTP framework)
- ledongthuc/pdf (PDF parsing)
- nguyenthenguyen/docx (DOCX parsing)

**Frontend**
- Next.js 15
- TypeScript
- Tailwind CSS

**Infrastructure**
- Docker & Docker Compose

## Getting Started

### Prerequisites

- Go 1.21 or higher
- Node.js 20 or higher
- Docker (optional, for containerized deployment)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/SpiritOfKedar/spirit-checker.git
cd spirit-checker
```

2. Start the backend services (run each in a separate terminal):

```bash
# Terminal 1: API Gateway
cd services/api-gateway && go run main.go

# Terminal 2: Resume Parser
cd services/resume-parser && go run main.go

# Terminal 3: NLP Service
cd services/nlp-service && go run main.go

# Terminal 4: ATS Scorer
cd services/ats-scorer && go run main.go
```

3. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

4. Open http://localhost:3000 in your browser.

### Docker Deployment

```bash
docker-compose up --build
```

This starts all services and exposes the frontend at http://localhost:3000.

## Project Structure

```
ats-checker/
├── services/
│   ├── api-gateway/
│   │   ├── handlers/
│   │   │   └── analyze.go       # Main analysis orchestration
│   │   ├── middleware/
│   │   │   └── validation.go    # Request validation
│   │   └── main.go
│   ├── resume-parser/
│   │   ├── parser/
│   │   │   ├── pdf.go           # PDF text extraction
│   │   │   ├── docx.go          # DOCX text extraction
│   │   │   └── handler.go       # Parse endpoint
│   │   └── main.go
│   ├── nlp-service/
│   │   ├── nlp/
│   │   │   ├── tokenizer.go     # Text tokenization
│   │   │   ├── keywords.go      # Skill extraction
│   │   │   ├── similarity.go    # TF-IDF implementation
│   │   │   ├── sections.go      # Section classification
│   │   │   └── handler.go       # Analysis endpoint
│   │   └── main.go
│   └── ats-scorer/
│       ├── scorer/
│       │   ├── calculator.go    # Score computation
│       │   ├── rules.go         # Scoring weights
│       │   └── handler.go       # Score endpoint
│       └── main.go
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Upload page
│   │   │   └── results/
│   │   │       └── page.tsx     # Results display
│   │   └── components/
│   │       ├── FileUpload.tsx   # Drag-drop file upload
│   │       ├── ScoreGauge.tsx   # Circular score display
│   │       ├── SectionCard.tsx  # Section feedback cards
│   │       └── SkillsComparison.tsx
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Reference

### POST /api/analyze

Analyzes a resume against a job description.

**Request:**
```json
{
  "resume": "<base64 encoded PDF or DOCX>",
  "resumeFileName": "resume.pdf",
  "jobDescription": "Job posting text..."
}
```

**Response:**
```json
{
  "score": 74,
  "matchedSkills": ["python", "aws", "docker", "kubernetes"],
  "missingSkills": ["terraform", "graphql"],
  "sections": {
    "skills": {
      "score": 85,
      "feedback": "Comprehensive skills section with good variety."
    },
    "experience": {
      "score": 72,
      "feedback": "Good experience section. Consider adding more quantifiable achievements."
    },
    "education": {
      "score": 75,
      "feedback": "Good education section with essential details."
    },
    "projects": {
      "score": 65,
      "feedback": "Projects section present, add more details about technologies used."
    }
  },
  "overallFeedback": "Good resume with reasonable match to the job description. Consider adding 2 missing skills if you have experience with them."
}
```

### GET /health

Health check endpoint available on all services.

```json
{
  "status": "ok",
  "service": "api-gateway"
}
```

## Configuration

Environment variables for customizing service behavior:

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| PORT | All | varies | Service listen port |
| CORS_ORIGINS | Gateway | http://localhost:3000 | Allowed CORS origins |
| RESUME_PARSER_SERVICE_URL | Gateway | http://localhost:8081 | Resume parser endpoint |
| NLP_SERVICE_URL | Gateway | http://localhost:8082 | NLP service endpoint |
| ATS_SCORER_SERVICE_URL | Gateway | http://localhost:8083 | Scorer endpoint |
| SKILL_WEIGHT | Scorer | 0.40 | Weight for skill matching |
| SIMILARITY_WEIGHT | Scorer | 0.30 | Weight for text similarity |
| SECTION_WEIGHT | Scorer | 0.30 | Weight for section scores |
| NEXT_PUBLIC_API_URL | Frontend | http://localhost:8080 | Backend API URL |

## Limitations

- PDF parsing depends on text being selectable (scanned images without OCR won't work)
- Skill detection is based on a predefined list; uncommon or new technologies may not be recognized
- Section detection assumes standard resume formatting with clear headers
- No persistent storage; results are session-based

## Future Improvements

- Redis caching for repeated analyses
- Semantic similarity using word embeddings (Word2Vec, BERT)
- OCR support for scanned documents
- Multi-language resume support
- User accounts with analysis history
- Resume improvement suggestions
- Batch processing for multiple job descriptions

## License

MIT License

---

Built by Spirit
