import type {
  SubScores,
  ScoreWeights,
  AssessmentResult,
  ReadinessTier,
  SubScoreExplanation,
  SourceTag,
} from './types';

export const DEFAULT_WEIGHTS: ScoreWeights = {
  infrastructure: 20,
  dataQuality: 25,
  networkStorage: 15,
  computeCost: 15,
  securityGovernance: 15,
  skillsStrategy: 10,
};

export function validateWeights(weights: ScoreWeights): boolean {
  const sum =
    weights.infrastructure +
    weights.dataQuality +
    weights.networkStorage +
    weights.computeCost +
    weights.securityGovernance +
    weights.skillsStrategy;
  return Math.abs(sum - 100) < 0.001;
}

export function classifyTier(score: number): ReadinessTier {
  if (score >= 80) return 'AI Ready';
  if (score >= 60) return 'Needs Improvement';
  if (score >= 40) return 'Significant Gaps';
  return 'Not Ready';
}

export function calculateReadinessScore(
  subScores: SubScores,
  weights: ScoreWeights = DEFAULT_WEIGHTS
): AssessmentResult {
  const categories: (keyof SubScores)[] = [
    'infrastructure',
    'dataQuality',
    'networkStorage',
    'computeCost',
    'securityGovernance',
    'skillsStrategy',
  ];

  let assessedWeightSum = 0;
  let weightedScoreSum = 0;
  let assessedCount = 0;

  const explanations: Record<keyof SubScores, SubScoreExplanation> = {} as any;

  for (const cat of categories) {
    const rawVal = subScores[cat];
    const catWeight = weights[cat];
    const isAssessed = typeof rawVal === 'number' && !isNaN(rawVal);

    if (isAssessed) {
      const clampedVal = Math.min(100, Math.max(0, rawVal!));
      assessedWeightSum += catWeight;
      weightedScoreSum += clampedVal * catWeight;
      assessedCount++;

      explanations[cat] = generateExplanation(cat, clampedVal, catWeight, true);
    } else {
      explanations[cat] = generateExplanation(cat, 0, catWeight, false);
    }
  }

  // Renormalize based solely on assessed categories
  const overallScore =
    assessedWeightSum > 0
      ? Math.round((weightedScoreSum / assessedWeightSum) * 10) / 10
      : 0;

  const confidenceScore = Math.round((assessedWeightSum / 100) * 100);

  return {
    overallScore,
    tier: classifyTier(overallScore),
    confidenceScore,
    assessedCount,
    totalCategories: categories.length,
    subScores,
    weights,
    explanations,
    calculatedAt: new Date().toISOString(),
  };
}

function generateExplanation(
  category: keyof SubScores,
  score: number,
  weight: number,
  isAssessed: boolean
): SubScoreExplanation {
  if (!isAssessed) {
    return {
      subScore: 0,
      weightAssigned: weight,
      isAssessed: false,
      factors: [
        {
          name: 'Telemetry / Audit Missing',
          impactPts: 0,
          reason: 'No assessment data uploaded or recorded for this dimension.',
          source: 'User-entered' as SourceTag,
        },
      ],
      strengths: [],
      improvements: ['Run diagnostic module to collect baseline data.'],
    };
  }

  const factors: SubScoreExplanation['factors'] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  switch (category) {
    case 'infrastructure':
      if (score >= 75) {
        strengths.push('Modern server fleet with low peak saturation.');
        factors.push({
          name: 'Compute Capacity',
          impactPts: 0,
          reason: 'Sufficient RAM & CPU headroom detected.',
          source: 'Measured',
        });
      } else {
        improvements.push('Replace legacy hardware nodes and upgrade memory to mitigate bottlenecks.');
        factors.push({
          name: 'Legacy Hardware Saturation',
          impactPts: -(100 - score),
          reason: 'High disk or RAM utilization exceeding 85% on critical nodes.',
          source: 'Measured',
        });
      }
      break;

    case 'dataQuality':
      if (score >= 75) {
        strengths.push('High completeness rate (>95%) and standardized column formats.');
        factors.push({
          name: 'Data Hygiene',
          impactPts: 0,
          reason: 'Minimal duplicate records and valid formats.',
          source: 'Uploaded-data',
        });
      } else {
        improvements.push('Resolve duplicate rows, cleanse format errors, and integrate departmental silos.');
        factors.push({
          name: 'Format & Silo Penalties',
          impactPts: -(100 - score),
          reason: 'Missing values and disconnected departmental schemas detected.',
          source: 'Uploaded-data',
        });
      }
      break;

    case 'networkStorage':
      if (score >= 75) {
        strengths.push('Low latency (<35ms) and stable throughput pipeline.');
        factors.push({
          name: 'Network Path Stability',
          impactPts: 0,
          reason: 'Stable jitter and adequate throughput for model transfer.',
          source: 'Measured',
        });
      } else {
        improvements.push('Optimize network routing and migrate slow block storage to high-throughput NVMe tiers.');
        factors.push({
          name: 'Latency & Jitter Degradation',
          impactPts: -(100 - score),
          reason: 'Excessive round-trip time or throughput throttling observed.',
          source: 'Measured',
        });
      }
      break;

    case 'computeCost':
      if (score >= 75) {
        strengths.push('Tight resource right-sizing with low idle instance expenditure.');
        factors.push({
          name: 'Cost Efficiency',
          impactPts: 0,
          reason: 'High utilization per invested cloud dollar.',
          source: 'Simulated',
        });
      } else {
        improvements.push('Decommission idle cloud instances and adopt reserved/spot pricing.');
        factors.push({
          name: 'Idle Compute Waste',
          impactPts: -(100 - score),
          reason: 'Over-provisioned instances running with <15% average CPU load.',
          source: 'Simulated',
        });
      }
      break;

    case 'securityGovernance':
      if (score >= 75) {
        strengths.push('Strict PII sanitization and registered AI governance workflows.');
        factors.push({
          name: 'Framework Alignment',
          impactPts: 0,
          reason: 'Aligned with NIST AI RMF and automated PII scrubbers.',
          source: 'Uploaded-data',
        });
      } else {
        improvements.push('Remediate unmasked PII records and enforce Shadow AI tool approval.');
        factors.push({
          name: 'PII Exposure & Unapproved AI Tools',
          impactPts: -(100 - score),
          reason: 'Sensitive data exposed in datasets or unapproved AI tooling used.',
          source: 'Uploaded-data',
        });
      }
      break;

    case 'skillsStrategy':
      if (score >= 75) {
        strengths.push('Strong executive sponsorship and cross-functional AI proficiency.');
        factors.push({
          name: 'Organizational Readiness',
          impactPts: 0,
          reason: 'Structured AI training and prioritized high-ROI use cases.',
          source: 'User-entered',
        });
      } else {
        improvements.push('Launch department-level AI literacy workshops and formulate an enterprise AI roadmap.');
        factors.push({
          name: 'Skills Deficit',
          impactPts: -(100 - score),
          reason: 'Lack of dedicated AI engineers and formal usage guidelines.',
          source: 'User-entered',
        });
      }
      break;
  }

  return {
    subScore: score,
    weightAssigned: weight,
    isAssessed: true,
    factors,
    strengths,
    improvements,
  };
}
