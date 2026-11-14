import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BM25Ranker } from '@/lib/retrieval';
import { askRagAssistant, askReadinessAdvisor } from '@/lib/gemini';
import { INITIAL_DOCUMENTS_CHUNKS, INITIAL_ASSESSMENT } from '@/lib/demoData';

const ChatRequestSchema = z.object({
  mode: z.enum(['rag', 'advisor']),
  message: z.string().min(1).max(2000),
  documentChunks: z.array(z.any()).optional(),
  assessment: z.any().optional(),
});

// Simple in-memory rate-limiter: 60 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return true;
  }
  if (entry.count >= 60) {
    return false;
  }
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before sending more queries.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = ChatRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid chat request', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { mode, message, documentChunks, assessment } = parsed.data;

    if (mode === 'rag') {
      const chunksToSearch =
        documentChunks && documentChunks.length > 0
          ? documentChunks
          : INITIAL_DOCUMENTS_CHUNKS;

      const ranker = new BM25Ranker(chunksToSearch);
      const topMatches = ranker.search(message, 3, 0.7);

      const passages = topMatches.map((m) => ({
        documentName: m.documentName,
        page: m.page,
        content: m.content,
        relevanceScore: m.relevanceScore,
      }));

      const answer = await askRagAssistant(message, passages);
      return NextResponse.json(answer);
    }

    if (mode === 'advisor') {
      const activeAssessment = assessment || INITIAL_ASSESSMENT;
      const answer = await askReadinessAdvisor(message, activeAssessment);
      return NextResponse.json(answer);
    }

    return NextResponse.json({ error: 'Unknown chat mode' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chat generation error' }, { status: 500 });
  }
}

