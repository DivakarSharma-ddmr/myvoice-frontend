// Keyword search over the member FAQ. Dependency-free and deliberately pure:
// it takes the items as an argument rather than importing generated content, so
// it can be unit-tested directly and reused for any searchable list.

export type SearchableItem = { id: string; category: string; question: string; answer: string };
export type SearchHit<T> = { item: T; score: number; terms: string[] };

const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'can', 'do', 'does', 'for', 'from',
  'get', 'has', 'have', 'how', 'i', 'if', 'in', 'is', 'it', 'me', 'my', 'not', 'of', 'on', 'or',
  'so', 'that', 'the', 'their', 'them', 'there', 'they', 'this', 'to', 'up', 'was', 'we', 'what',
  'when', 'where', 'which', 'who', 'why', 'will', 'with', 'you', 'your',
]);

// Members type without diacritics far more often than with them, so folding
// them means "parola" finds "parolă" rather than returning nothing.
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

const SCORE = {
  phrase: 100,
  allTerms: 25,
  questionWord: 10,
  questionPrefix: 6,
  categoryWord: 4,
  answerWord: 3,
  answerPrefix: 2,
};

function scoreOne(words: string[], term: string, exact: number, prefix: number) {
  if (words.includes(term)) return exact;
  if (prefix && words.some((w) => w.startsWith(term))) return prefix;
  return 0;
}

export function searchFaq<T extends SearchableItem>(
  items: T[],
  query: string,
  limit = 8
): SearchHit<T>[] {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const phrase = normalize(query);

  const hits: SearchHit<T>[] = [];

  for (const item of items) {
    const nq = normalize(item.question);
    const qWords = nq.split(' ');
    const aWords = normalize(item.answer).split(' ');
    const cWords = normalize(item.category).split(' ');

    let score = 0;
    const matched: string[] = [];

    for (const term of terms) {
      let termScore = scoreOne(qWords, term, SCORE.questionWord, SCORE.questionPrefix);
      if (!termScore) termScore = scoreOne(cWords, term, SCORE.categoryWord, 0);
      if (!termScore) termScore = scoreOne(aWords, term, SCORE.answerWord, SCORE.answerPrefix);
      if (termScore) {
        score += termScore;
        matched.push(term);
      }
    }

    if (!matched.length) continue;
    if (matched.length === terms.length) score += SCORE.allTerms;
    if (phrase.length > 2 && nq.includes(phrase)) score += SCORE.phrase;

    hits.push({ item, score, terms: matched });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.item.id.localeCompare(b.item.id))
    .slice(0, limit);
}
