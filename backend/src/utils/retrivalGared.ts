export const shouldRetrieve = (query: string): boolean => {
    const text = query.trim().toLowerCase();
  
    // --- Case 1: obvious fillers ---
    const fillerPatterns = [
      "ok", "okay", "yes", "no", "continue", "go on", "thanks", "thank you",
      "great", "cool", "nice", "alright", "hmm", "huh", "right"
    ];
    if (fillerPatterns.includes(text)) return false;
  
    // --- Case 2: too short to need retrieval ---
    const wordCount = text.split(/\s+/).length;
    if (wordCount <= 2 && !/[?]/.test(text)) return false;
  
    // --- Case 3: explicitly knowledge-seeking keywords ---
    const knowledgeKeywords = [
      "what", "why", "how", "when", "where", "explain", "define", "difference",
      "example", "project", "give me", "steps", "concept", "compare", "vs"
    ];
    if (knowledgeKeywords.some((kw) => text.startsWith(kw))) return true;
  
    // --- Case 4: ends with a question mark ---
    if (text.endsWith("?")) return true;
  
    // --- Default: assume retrieval ---
    return true;
  };
  