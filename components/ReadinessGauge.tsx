import React from 'react';
import { ReadinessTier } from '@/lib/types';

interface ReadinessGaugeProps {
  score: number;
  tier: ReadinessTier;
  confidence: number;
  assessedCount: number;
  totalCategories: number;
  size?: number;
  onOpenWhyScore?: () => void;
}

export const ReadinessGauge: React.FC<ReadinessGaugeProps> = ({
  score,
  tier,
  confidence,
  assessedCount,
  totalCategories,
  size = 220,
  onOpenWhyScore,
}) => {
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Use 240 degrees arc for tachometer gauge look
  const arcLength = circumference * 0.75;
  const progress = Math.min(100, Math.max(0, score)) / 100;
  const strokeDashoffset = arcLength - progress * arcLength;

  const getTierColor = () => {
    switch (tier) {
      case 'AI Ready':
        return {
          stroke: '#10b981', // emerald
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        };
      case 'Needs Improvement':
        return {
          stroke: '#0ea5e9', // electric blue
          text: 'text-sky-400',
          bg: 'bg-sky-500/10 text-sky-300 border-sky-500/30',
        };
      case 'Significant Gaps':
        return {
          stroke: '#f59e0b', // amber
          text: 'text-amber-400',
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        };
      case 'Not Ready':
      default:
        return {
          stroke: '#f43f5e', // rose
          text: 'text-rose-400',
          bg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        };
    }
  };

  const colors = getTierColor();

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-navy-900/80 border border-navy-700/60 rounded-2xl backdrop-blur-md relative overflow-hidden group shadow-lg">
      {/* Background glow */}
      <div
        className="absolute -top-12 -left-12 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: colors.stroke }}
      />

      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-135 drop-shadow-[0_0_12px_rgba(14,165,233,0.2)]"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Animated Value Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pt-2">
          <span className="text-5xl font-extrabold tracking-tight font-mono text-white">
            {score.toFixed(1)}
          </span>
          <span className="text-xs uppercase tracking-wider text-slate-400 font-medium mt-1">
            Readiness Score
          </span>
          <div className="mt-2">
            <span
              className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${colors.bg}`}
            >
              {tier}
            </span>
          </div>
        </div>
      </div>

      {/* Confidence & Assessment details */}
      <div className="mt-4 text-center w-full">
        <div className="flex items-center justify-between text-xs text-slate-400 border-t border-navy-800 pt-3">
          <span>Confidence:</span>
          <span className="font-mono text-white font-medium">{confidence}%</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
          <span>Coverage:</span>
          <span className="font-mono text-cyan-400 font-medium">
            {assessedCount} of {totalCategories} categories
          </span>
        </div>

        {assessedCount < totalCategories && (
          <div className="mt-2 text-[11px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
            Partial assessment — unassessed categories excluded from score
          </div>
        )}

        {onOpenWhyScore && (
          <button
            onClick={onOpenWhyScore}
            className="mt-4 w-full py-2 px-3 text-xs font-medium text-electric-blue hover:text-white bg-electric-blue/10 hover:bg-electric-blue/20 border border-electric-blue/30 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Why this score?</span>
            <span className="text-xs">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

