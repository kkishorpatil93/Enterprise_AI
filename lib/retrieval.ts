import type { DocumentChunk } from './types';

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

export function chunkText(
  text: string,
  docName: string,
  department: string = 'General',
  page: number = 1,
  options: ChunkOptions = {}
): DocumentChunk[] {
  const chunkSize = options.chunkSize || 800;
  const overlap = options.overlap || 100;
  const chunks: DocumentChunk[] = [];

  if (!text || text.trim().length === 0) return [];

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
  let start = 0;
  let chunkIdx = 1;

  while (start < cleanText.length) {
    const end = Math.min(start + chunkSize, cleanText.length);
    let chunkContent = cleanText.substring(start, end);

    // If not at the end of the text, try to break at a sentence or word boundary
    if (end < cleanText.length) {
      const lastPeriod = chunkContent.lastIndexOf('. ');
      if (lastPeriod > chunkSize * 0.6) {
        chunkContent = chunkContent.substring(0, lastPeriod + 1);
      } else {
        const lastSpace = chunkContent.lastIndexOf(' ');
        if (lastSpace > chunkSize * 0.7) {
          chunkContent = chunkContent.substring(0, lastSpace);
        }
      }
    }

    chunks.push({
      id: `${docName}-p${page}-c${chunkIdx++}`,
      documentName: docName,
      page,
      content: chunkContent.trim(),
      department,
    });

    start += Math.max(chunkContent.length - overlap, 100);
  }

  return chunks;
}

// BM25 Ranking Engine in TypeScript
export class BM25Ranker {
  private chunks: DocumentChunk[] = [];
  private docLengths: number[] = [];
  private avgDocLength: number = 0;
  private dfMap: Map<string, number> = new Map();
  private readonly k1: number = 1.5;
  private readonly b: number = 0.75;

  constructor(chunks: DocumentChunk[]) {
    this.chunks = chunks;
    this.buildIndex();
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);
  }

  private buildIndex() {
    let totalLength = 0;
    this.docLengths = [];
    this.dfMap.clear();

    for (const chunk of this.chunks) {
      const tokens = this.tokenize(chunk.content);
      this.docLengths.push(tokens.length);
      totalLength += tokens.length;

      const uniqueTokens = new Set(tokens);
      uniqueTokens.forEach((token) => {
        this.dfMap.set(token, (this.dfMap.get(token) || 0) + 1);
      });
    }

    this.avgDocLength = this.chunks.length > 0 ? totalLength / this.chunks.length : 1;
  }

  public search(query: string, topK: number = 3, minScore: number = 0.8): DocumentChunk[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0 || this.chunks.length === 0) return [];

    const N = this.chunks.length;
    const scores: { chunk: DocumentChunk; score: number }[] = [];

    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i];
      const tokens = this.tokenize(chunk.content);
      const docLen = this.docLengths[i];

      // Term frequencies in this chunk
      const tfMap = new Map<string, number>();
      for (const t of tokens) {
        tfMap.set(t, (tfMap.get(t) || 0) + 1);
      }

      let score = 0;
      for (const qTerm of queryTokens) {
        const tf = tfMap.get(qTerm) || 0;
        if (tf === 0) continue;

        const df = this.dfMap.get(qTerm) || 0;
        // Standard Lucene/BM25 IDF formula
        const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
        const num = tf * (this.k1 + 1);
        const denom = tf + this.k1 * (1 - this.b + (this.b * docLen) / this.avgDocLength);

        score += idf * (num / denom);
      }

      if (score >= minScore) {
        scores.push({
          chunk: { ...chunk, relevanceScore: Math.round(score * 100) / 100 },
          score,
        });
      }
    }

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK).map((s) => s.chunk);
  }
}
