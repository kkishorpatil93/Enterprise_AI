import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateReadinessScore,
  classifyTier,
  validateWeights,
  DEFAULT_WEIGHTS,
} from '../lib/scoring.ts';
import type { SubScores, ScoreWeights } from '../lib/types.ts';

test('NEXORA Scoring Engine - Weight validation', () => {
  assert.equal(validateWeights(DEFAULT_WEIGHTS), true);

  const invalidWeights: ScoreWeights = {
    ...DEFAULT_WEIGHTS,
    infrastructure: 30, // sums to 110
  };
  assert.equal(validateWeights(invalidWeights), false);
});

test('NEXORA Scoring Engine - Perfect score 100 & AI Ready tier', () => {
  const perfectScores: SubScores = {
    infrastructure: 100,
    dataQuality: 100,
    networkStorage: 100,
    computeCost: 100,
    securityGovernance: 100,
    skillsStrategy: 100,
  };

  const result = calculateReadinessScore(perfectScores);
  assert.equal(result.overallScore, 100);
  assert.equal(result.tier, 'AI Ready');
  assert.equal(result.confidenceScore, 100);
  assert.equal(result.assessedCount, 6);
});

test('NEXORA Scoring Engine - Poor score & Not Ready tier', () => {
  const poorScores: SubScores = {
    infrastructure: 20,
    dataQuality: 25,
    networkStorage: 30,
    computeCost: 15,
    securityGovernance: 10,
    skillsStrategy: 20,
  };

  const result = calculateReadinessScore(poorScores);
  assert.ok(result.overallScore < 40);
  assert.equal(result.tier, 'Not Ready');
  assert.equal(result.confidenceScore, 100);
});

test('NEXORA Scoring Engine - Partial assessment renormalization', () => {
  const partialScores: SubScores = {
    infrastructure: 80,
    dataQuality: 60,
  };

  const result = calculateReadinessScore(partialScores);
  // (80*20 + 60*25)/45 = 3100/45 = 68.9
  assert.equal(result.overallScore, 68.9);
  assert.equal(result.confidenceScore, 45);
  assert.equal(result.assessedCount, 2);
  assert.equal(result.tier, 'Needs Improvement');
  assert.equal(result.explanations.networkStorage.isAssessed, false);
});

test('NEXORA Scoring Engine - Custom weights', () => {
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
  assert.equal(result.overallScore, 80);
  assert.equal(result.tier, 'AI Ready');
});

test('NEXORA Scoring Engine - Tier boundaries', () => {
  assert.equal(classifyTier(85), 'AI Ready');
  assert.equal(classifyTier(80), 'AI Ready');
  assert.equal(classifyTier(79.9), 'Needs Improvement');
  assert.equal(classifyTier(60), 'Needs Improvement');
  assert.equal(classifyTier(59.9), 'Significant Gaps');
  assert.equal(classifyTier(40), 'Significant Gaps');
  assert.equal(classifyTier(39.9), 'Not Ready');
  assert.equal(classifyTier(0), 'Not Ready');
});
