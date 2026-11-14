import React from 'react';
import { AssessmentResult, SubScores } from '@/lib/types';
import { SourceTagBadge } from './SourceTagBadge';
import { X, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

interface WhyThisScoreDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentResult;
  initialCategory?: keyof SubScores;
}

export const WhyThisScoreDrawer: React.FC<WhyThisScoreDrawerProps> = ({
  isOpen,
  onClose,
  assessment,
  initialCategory = 'infrastructure',
}) => {
  const [activeCategory, setActiveCategory] = React.useState<keyof SubScores>(initialCategory);

  if (!isOpen) return null;

  const categories: { key: keyof SubScores; label: string; weight: number }[] = [
    { key: 'infrastructure', label: 'Infrastructure', weight: assessment.weights.infrastructure },
    { key: 'dataQuality', label: 'Data Quality & Integration', weight: assessment.weights.dataQuality },
    { key: 'networkStorage', label: 'Network & Storage', weight: assessment.weights.networkStorage },
    { key: 'computeCost', label: 'Compute & Cost Efficiency', weight: assessment.weights.computeCost },
    { key: 'securityGovernance', label: 'Security & AI Governance', weight: assessment.weights.securityGovernance },
    { key: 'skillsStrategy', label: 'Skills & AI Strategy', weight: assessment.weights.skillsStrategy },
  ];

  const currentExplanation = assessment.explanations[activeCategory];
  const currentScore = assessment.subScores[activeCategory];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl h-full bg-navy-900 border-l border-navy-700 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-navy-800">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-electric-cyan" />
                Score Explanation & Audit
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Transparent mathematical factors, measured penalties, and source tags.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-navy-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-3 border-b border-navy-800 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === c.key
                    ? 'bg-electric-blue text-white shadow-glow'
                    : 'text-slate-400 hover:text-white hover:bg-navy-800'
                }`}
              >
                {c.label} ({c.weight}%)
              </button>
            ))}
          </div>

          {/* Score Snapshot */}
          <div className="my-6 p-4 rounded-xl bg-navy-850 border border-navy-750 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase text-slate-400 font-mono tracking-wider">
                Assigned Sub-Score
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold font-mono text-white">
                  {currentExplanation.isAssessed ? currentScore : 'Not Assessed'}
                </span>
                {currentExplanation.isAssessed && (
                  <span className="text-sm text-slate-400 font-mono">/ 100</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase text-slate-400 font-mono tracking-wider">
                Category Weight
              </span>
              <div className="text-xl font-bold text-electric-cyan font-mono mt-1">
                {currentExplanation.weightAssigned}%
              </div>
            </div>
          </div>

          {/* Penalties & Contributing Factors */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Measured Factors & Penalties
            </h3>

            {currentExplanation.factors.map((f, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-navy-950/60 border border-navy-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-100">{f.name}</span>
                  <div className="flex items-center gap-2">
                    <SourceTagBadge source={f.source} />
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        f.impactPts < 0
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {f.impactPts === 0 ? 'Optimal' : `${f.impactPts} pts`}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{f.reason}</p>
              </div>
            ))}

            {/* Strengths */}
            {currentExplanation.strengths.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Key Strengths
                </h4>
                <ul className="space-y-1.5">
                  {currentExplanation.strengths.map((s, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Fixes */}
            {currentExplanation.improvements.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Recommended Fixes
                </h4>
                <ul className="space-y-1.5">
                  {currentExplanation.improvements.map((imp, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-sky-400">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-navy-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Formula: docs/SCORING.md</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors"
          >
            Close Audit
          </button>
        </div>
      </div>
    </div>
  );
};

