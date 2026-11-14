import { describe, it, expect } from 'vitest';
import {
  calculateReadinessScore,
  classifyTier,
  validateWeights,
  DEFAULT_WEIGHTS,
} from '../lib/scoring';
import { SubScores, ScoreWeights } from '../lib/types';

describe('NEXORA Scoring Engine', () => {
  it('correctly validates weight totals', () => {
    expect(validateWeights(DEFAULT_WEIGHTS)).toBe(true);

    const invalidWeights: ScoreWeights = {
      ...DEFAULT_WEIGHTS,
      infrastructure: 30, // sums to 110
    };
    expect(validateWeights(invalidWeights)).toBe(false);
  });

  it('calculates all-perfect score as 100 and classifies as AI Ready', () => {
    const perfectScores: SubScores = {
      infrastructure: 100,
      dataQuality: 100,
      networkStorage: 100,
      computeCost: 100,
      securityGovernance: 100,
      skillsStrategy: 100,
    };

    const result = calculateReadinessScore(perfectScores);
    expect(result.overallScore).toBe(100);
    expect(result.tier).toBe('AI Ready');
    expect(result.confidenceScore).toBe(100);
    expect(result.assessedCount).toBe(6);
  });

  it('calculates all-poor score accurately and classifies as Not Ready', () => {
    const poorScores: SubScores = {
      infrastructure: 20,
      dataQuality: 25,
      networkStorage: 30,
      computeCost: 15,
      securityGovernance: 10,
      skillsStrategy: 20,
    };

    const result = calculateReadinessScore(poorScores);
    expect(result.overallScore).toBeLessThan(40);
    expect(result.tier).toBe('Not Ready');
    expect(result.confidenceScore).toBe(100);
  });

  it('renormalizes partial assessments without treating unassessed categories as 100 or 0', () => {
    // Only Infrastructure (20% wt) and Data Quality (25% wt) are assessed: total 45% assessed weight
    const partialScores: SubScores = {
      infrastructure: 80,
      dataQuality: 60,
      // remaining are undefined
    };

    const result = calculateReadinessScore(partialScores);
    // Weighted sum = (80 * 20 + 60 * 25) = 1600 + 1500 = 3100
    // Renormalized by 45: 3100 / 45 = 68.888... -> 68.9
    expect(result.overallScore).toBeCloseTo(68.9, 1);
    expect(result.confidenceScore).toBe(45);
    expect(result.assessedCount).toBe(2);
    expect(result.tier).toBe('Needs Improvement');
    expect(result.explanations.networkStorage.isAssessed).toBe(false);
  });

  it('supports custom weights sum correctly', () => {
    const customWeights: ScoreWeights = {
      infrastructure: 30,
      dataQuality: 30,
      networkStorage: 10,
      computeCost: 10,
      securityGovernance: 10,
      skillsStrategy: 10,
    };

    const scores: SubScores = {
      infrastructure: 90,
      dataQuality: 70,
      networkStorage: 80,
      computeCost: 80,
      securityGovernance: 80,
      skillsStrategy: 80,
    };

    const result = calculateReadinessScore(scores, customWeights);
    // (90*30 + 70*30 + 80*10*4) / 100 = (2700 + 2100 + 3200) / 100 = 80
    expect(result.overallScore).toBe(80);
    expect(result.tier).toBe('AI Ready');
  });

  it('classifies all tiers properly', () => {
    expect(classifyTier(85)).toBe('AI Ready');
    expect(classifyTier(80)).toBe('AI Ready');
    expect(classifyTier(79.9)).toBe('Needs Improvement');
    expect(classifyTier(60)).toBe('Needs Improvement');
    expect(classifyTier(59.9)).toBe('Significant Gaps');
    expect(classifyTier(40)).toBe('Significant Gaps');
    expect(classifyTier(39.9)).toBe('Not Ready');
    expect(classifyTier(0)).toBe('Not Ready');
  });
});

