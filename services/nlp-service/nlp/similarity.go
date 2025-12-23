package nlp

import (
	"math"
	"strings"
)

// Document represents a text document for TF-IDF
type Document struct {
	Text   string
	Tokens []string
	TF     map[string]float64
}

// NewDocument creates a document from text
func NewDocument(text string) *Document {
	tokens := Tokenize(text)
	tf := calculateTF(tokens)
	return &Document{
		Text:   text,
		Tokens: tokens,
		TF:     tf,
	}
}

// calculateTF computes term frequency for tokens
func calculateTF(tokens []string) map[string]float64 {
	tf := make(map[string]float64)
	totalTokens := float64(len(tokens))

	for _, token := range tokens {
		tf[token]++
	}

	for term := range tf {
		tf[term] = tf[term] / totalTokens
	}

	return tf
}

// calculateIDF computes inverse document frequency
func calculateIDF(docs []*Document) map[string]float64 {
	docCount := float64(len(docs))
	termDocCount := make(map[string]int)

	// Count documents containing each term
	for _, doc := range docs {
		seen := make(map[string]bool)
		for _, token := range doc.Tokens {
			if !seen[token] {
				seen[token] = true
				termDocCount[token]++
			}
		}
	}

	idf := make(map[string]float64)
	for term, count := range termDocCount {
		idf[term] = math.Log(docCount / float64(count))
	}

	return idf
}

// calculateTFIDF computes TF-IDF vector for a document
func calculateTFIDF(doc *Document, idf map[string]float64) map[string]float64 {
	tfidf := make(map[string]float64)
	for term, tf := range doc.TF {
		if idfVal, exists := idf[term]; exists {
			tfidf[term] = tf * idfVal
		}
	}
	return tfidf
}

// cosineSimilarity calculates cosine similarity between two vectors
func cosineSimilarity(vec1, vec2 map[string]float64) float64 {
	// Get all unique terms
	allTerms := make(map[string]bool)
	for term := range vec1 {
		allTerms[term] = true
	}
	for term := range vec2 {
		allTerms[term] = true
	}

	var dotProduct, norm1, norm2 float64

	for term := range allTerms {
		v1 := vec1[term]
		v2 := vec2[term]
		dotProduct += v1 * v2
		norm1 += v1 * v1
		norm2 += v2 * v2
	}

	if norm1 == 0 || norm2 == 0 {
		return 0
	}

	return dotProduct / (math.Sqrt(norm1) * math.Sqrt(norm2))
}

// CalculateSimilarity computes similarity between resume and job description
func CalculateSimilarity(resumeText, jdText string) float64 {
	resumeDoc := NewDocument(resumeText)
	jdDoc := NewDocument(jdText)

	docs := []*Document{resumeDoc, jdDoc}
	idf := calculateIDF(docs)

	resumeTFIDF := calculateTFIDF(resumeDoc, idf)
	jdTFIDF := calculateTFIDF(jdDoc, idf)

	similarity := cosineSimilarity(resumeTFIDF, jdTFIDF)

	// Scale to 0-100 and round
	return math.Round(similarity * 100)
}

// CalculateKeywordOverlap calculates the percentage of JD keywords found in resume
func CalculateKeywordOverlap(resumeText, jdText string) float64 {
	resumeTokens := Tokenize(resumeText)
	jdTokens := Tokenize(jdText)

	if len(jdTokens) == 0 {
		return 0
	}

	resumeSet := make(map[string]bool)
	for _, token := range resumeTokens {
		resumeSet[strings.ToLower(token)] = true
	}

	matchCount := 0
	jdUnique := make(map[string]bool)
	for _, token := range jdTokens {
		tokenLower := strings.ToLower(token)
		if !jdUnique[tokenLower] {
			jdUnique[tokenLower] = true
			if resumeSet[tokenLower] {
				matchCount++
			}
		}
	}

	return float64(matchCount) / float64(len(jdUnique)) * 100
}
