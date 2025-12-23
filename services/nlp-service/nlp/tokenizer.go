package nlp

import (
	"regexp"
	"strings"
)

// StopWords common English stop words to filter out
var StopWords = map[string]bool{
	"a": true, "an": true, "and": true, "are": true, "as": true, "at": true,
	"be": true, "by": true, "for": true, "from": true, "has": true, "he": true,
	"in": true, "is": true, "it": true, "its": true, "of": true, "on": true,
	"or": true, "that": true, "the": true, "to": true, "was": true, "were": true,
	"will": true, "with": true, "you": true, "your": true, "we": true, "our": true,
	"this": true, "have": true, "had": true, "but": true, "not": true, "can": true,
	"would": true, "could": true, "should": true, "may": true, "might": true,
	"also": true, "more": true, "some": true, "any": true, "all": true, "each": true,
	"most": true, "other": true, "into": true, "over": true, "such": true, "then": true,
	"than": true, "very": true, "just": true, "been": true, "being": true, "do": true,
	"does": true, "did": true, "about": true, "after": true, "before": true, "through": true,
}

// Tokenize breaks text into normalized tokens
func Tokenize(text string) []string {
	// Convert to lowercase
	text = strings.ToLower(text)

	// Replace punctuation with spaces
	reg := regexp.MustCompile(`[^\w\s+#.-]`)
	text = reg.ReplaceAllString(text, " ")

	// Split into words
	words := strings.Fields(text)

	// Filter and normalize
	tokens := make([]string, 0, len(words))
	for _, word := range words {
		word = strings.Trim(word, ".-")
		if len(word) >= 2 && !StopWords[word] {
			tokens = append(tokens, word)
		}
	}

	return tokens
}

// ExtractKeywords extracts significant keywords from text
func ExtractKeywords(text string) []string {
	tokens := Tokenize(text)

	// Count frequency
	freq := make(map[string]int)
	for _, token := range tokens {
		freq[token]++
	}

	// Filter by frequency (appears at least once) and get unique keywords
	keywords := make([]string, 0)
	seen := make(map[string]bool)

	for _, token := range tokens {
		if !seen[token] && freq[token] >= 1 && len(token) >= 3 {
			seen[token] = true
			keywords = append(keywords, token)
		}
	}

	// Limit to top 50 keywords
	if len(keywords) > 50 {
		keywords = keywords[:50]
	}

	return keywords
}
