import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { calculateReadinessScore, validateWeights, DEFAULT_WEIGHTS } from '@/lib/scoring';

const ScoreRequestSchema = z.object({
  subScores: z.object({
    infrastructure: z.number().min(0).max(100).optional(),
    dataQuality: z.number().min(0).max(100).optional(),
    networkStorage: z.number().min(0).max(100).optional(),
    computeCost: z.number().min(0).max(100).optional(),
    securityGovernance: z.number().min(0).max(100).optional(),
    skillsStrategy: z.number().min(0).max(100).optional(),
  }),
  weights: z
    .object({
      infrastructure: z.number().min(0).max(100),
      dataQuality: z.number().min(0).max(100),
      networkStorage: z.number().min(0).max(100),
      computeCost: z.number().min(0).max(100),
      securityGovernance: z.number().min(0).max(100),
      skillsStrategy: z.number().min(0).max(100),
    })
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = ScoreRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid scoring payload', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { subScores, weights } = parsed.data;
    const finalWeights = weights || DEFAULT_WEIGHTS;

    if (!validateWeights(finalWeights)) {
      return NextResponse.json(
        { error: 'Weights must sum up to exactly 100%' },
        { status: 400 }
      );
    }

    const result = calculateReadinessScore(subScores, finalWeights);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Scoring computation failed' }, { status: 500 });
  }
}

