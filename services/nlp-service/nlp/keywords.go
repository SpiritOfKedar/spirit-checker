package nlp

import (
	"strings"
)

// TechnicalSkills database of known technical skills
var TechnicalSkills = []string{
	// Programming Languages
	"python", "java", "javascript", "typescript", "golang", "go", "rust", "c++", "c#",
	"ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "perl", "bash", "shell",

	// Web Technologies
	"html", "css", "react", "reactjs", "react.js", "angular", "vue", "vuejs", "vue.js",
	"nextjs", "next.js", "nodejs", "node.js", "express", "fastapi", "django", "flask",
	"spring", "springboot", "spring boot", "rails", "laravel", "asp.net",

	// Databases
	"sql", "mysql", "postgresql", "postgres", "mongodb", "redis", "elasticsearch",
	"cassandra", "dynamodb", "oracle", "sqlite", "mariadb", "neo4j", "graphql",

	// Cloud & DevOps
	"aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "k8s", "terraform",
	"ansible", "jenkins", "circleci", "github actions", "gitlab ci", "ci/cd",
	"linux", "unix", "nginx", "apache",

	// Data & ML
	"machine learning", "ml", "deep learning", "tensorflow", "pytorch", "keras",
	"scikit-learn", "pandas", "numpy", "spark", "hadoop", "kafka", "airflow",
	"data analysis", "data science", "nlp", "computer vision",

	// Tools & Practices
	"git", "github", "gitlab", "bitbucket", "jira", "confluence", "slack",
	"agile", "scrum", "kanban", "tdd", "rest", "restful", "api", "microservices",

	// Other
	"figma", "photoshop", "illustrator", "excel", "powerpoint", "tableau",
	"power bi", "looker", "salesforce", "sap",
}

// SoftSkills database of known soft skills
var SoftSkills = []string{
	"leadership", "communication", "teamwork", "problem solving", "problem-solving",
	"critical thinking", "time management", "project management", "collaboration",
	"creativity", "adaptability", "attention to detail", "analytical", "organization",
	"multitasking", "decision making", "decision-making", "presentation", "mentoring",
}

// ExtractSkills extracts skills mentioned in text
func ExtractSkills(text string) []string {
	textLower := strings.ToLower(text)
	foundSkills := make([]string, 0)
	seen := make(map[string]bool)

	// Check for technical skills
	for _, skill := range TechnicalSkills {
		if strings.Contains(textLower, skill) && !seen[skill] {
			seen[skill] = true
			foundSkills = append(foundSkills, skill)
		}
	}

	// Check for soft skills
	for _, skill := range SoftSkills {
		if strings.Contains(textLower, skill) && !seen[skill] {
			seen[skill] = true
			foundSkills = append(foundSkills, skill)
		}
	}

	return foundSkills
}

// CompareSkills finds matched and missing skills
func CompareSkills(resumeSkills, jdSkills []string) (matched, missing []string) {
	resumeSet := make(map[string]bool)
	for _, skill := range resumeSkills {
		resumeSet[strings.ToLower(skill)] = true
	}

	matched = make([]string, 0)
	missing = make([]string, 0)

	for _, skill := range jdSkills {
		skillLower := strings.ToLower(skill)
		if resumeSet[skillLower] {
			matched = append(matched, skill)
		} else {
			missing = append(missing, skill)
		}
	}

	return matched, missing
}
