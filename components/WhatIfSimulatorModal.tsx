'use client';

import React, { useState } from 'react';
import { useNexoraStore } from '@/lib/store';
import { calculateReadinessScore } from '@/lib/scoring';
import { X, Sliders, ArrowRight, Sparkles, Check, RotateCcw } from 'lucide-react';

interface WhatIfSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatIfSimulatorModal: React.FC<WhatIfSimulatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { subScores, assessment, updateSubScore } = useNexoraStore();

  // Simulated slider adjustments
  const [dataCleansePct, setDataCleansePct] = useState<number>(0); // 0 to 100% improvement
  const [ramUpgradeGb, setRamUpgradeGb] = useState<number>(0); // 0 to 128 GB
  const [shadowAiMfa, setShadowAiMfa] = useState<boolean>(false); // Enable MFA & gateway
  const [staffTrainedPct, setStaffTrainedPct] = useState<number>(0); // 0 to 100%

  if (!isOpen) return null;

  // Compute what-if sub-scores
  const simulatedSubScores = {
    ...subScores,
    dataQuality: Math.min(100, (subScores.dataQuality || 42) + Math.round(dataCleansePct * 0.45)),
    infrastructure: Math.min(100, (subScores.infrastructure || 48) + Math.min(35, Math.round(ramUpgradeGb * 0.3))),
    securityGovernance: Math.min(100, (subScores.securityGovernance || 46) + (shadowAiMfa ? 34 : 0)),
    skillsStrategy: Math.min(100, (subScores.skillsStrategy || 54) + Math.round(staffTrainedPct * 0.35)),
  };

  const simulatedAssessment = calculateReadinessScore(simulatedSubScores);
  const scoreDelta = Math.round((simulatedAssessment.overallScore - assessment.overallScore) * 10) / 10;

  const handleApplySimulatedValues = () => {
    Object.entries(simulatedSubScores).forEach(([cat, val]) => {
      updateSubScore(cat as any, val);
    });
    onClose();
  };

  const handleReset = () => {
    setDataCleansePct(0);
    setRamUpgradeGb(0);
    setShadowAiMfa(false);
    setStaffTrainedPct(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-navy-900 border border-electric-cyan/40 rounded-2xl shadow-2xl p-6 text-white space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-electric-cyan/20 border border-electric-cyan/40 rounded-xl text-electric-cyan">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                AI Digital Twin & What-If Simulator
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-slate-400">
                Simulate targeted enterprise remediation actions and preview readiness delta in real-time.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Comparison Display */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-navy-950 border border-navy-800 items-center text-center">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
              Current Baseline
            </span>
            <div className="text-3xl font-extrabold font-mono text-slate-300 mt-1">
              {assessment.overallScore.toFixed(1)}
            </div>
            <span className="text-[11px] text-amber-400">{assessment.tier}</span>
          </div>

          <div className="flex flex-col items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">Predicted Delta</span>
            <div className="flex items-center gap-1.5 my-1">
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span
                className={`text-xl font-bold font-mono px-2 py-0.5 rounded ${
                  scoreDelta > 0
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {scoreDelta > 0 ? `+${scoreDelta}` : '0.0'} pts
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Deterministic Engine</span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-electric-cyan font-mono">
              Simulated Future
            </span>
            <div className="text-3xl font-extrabold font-mono text-electric-cyan mt-1">
              {simulatedAssessment.overallScore.toFixed(1)}
            </div>
            <span className="text-[11px] text-emerald-400 font-medium">
              {simulatedAssessment.tier}
            </span>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-4">
          {/* Slider 1: Data Cleansing */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">
                1. Automated Dataset Deduplication & Imputation
              </span>
              <span className="font-mono text-electric-blue">{dataCleansePct}% Cleansed</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={dataCleansePct}
              onChange={(e) => setDataCleansePct(Number(e.target.value))}
              className="w-full accent-electric-blue cursor-pointer h-1.5 bg-navy-800 rounded-lg"
            />
            <p className="text-[11px] text-slate-500">
              Improves Data Quality sub-score from {subScores.dataQuality} → {simulatedSubScores.dataQuality}.
            </p>
          </div>

          {/* Slider 2: RAM & Infrastructure Upgrades */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">
                2. Server Memory Expansion & Node Refresh
              </span>
              <span className="font-mono text-electric-cyan">+{ramUpgradeGb} GB Fleet RAM</span>
            </div>
            <input
              type="range"
              min={0}
              max={128}
              step={16}
              value={ramUpgradeGb}
              onChange={(e) => setRamUpgradeGb(Number(e.target.value))}
              className="w-full accent-electric-cyan cursor-pointer h-1.5 bg-navy-800 rounded-lg"
            />
            <p className="text-[11px] text-slate-500">
              Lowers memory saturation; moves Infrastructure from {subScores.infrastructure} → {simulatedSubScores.infrastructure}.
            </p>
          </div>

          {/* Slider 3: Governance & AI Gateway */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-navy-950/80 border border-navy-800">
            <div>
              <div className="text-xs font-medium text-slate-200">
                3. Enforce AI Registry & Deploy Audited LLM Gateway
              </div>
              <div className="text-[11px] text-slate-400">
                Blocks unapproved shadow AI tools and mandates automated PII masking.
              </div>
            </div>
            <button
              onClick={() => setShadowAiMfa(!shadowAiMfa)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-colors ${
                shadowAiMfa
                  ? 'bg-emerald-500 text-white'
                  : 'bg-navy-800 text-slate-400 hover:text-white'
              }`}
            >
              {shadowAiMfa ? 'Applied (+34 pts)' : 'Simulate'}
            </button>
          </div>

          {/* Slider 4: Workforce Training */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-medium">
                4. Cross-Functional Staff AI Literacy Program
              </span>
              <span className="font-mono text-violet-400">{staffTrainedPct}% Trained</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={10}
              value={staffTrainedPct}
              onChange={(e) => setStaffTrainedPct(Number(e.target.value))}
              className="w-full accent-violet-500 cursor-pointer h-1.5 bg-navy-800 rounded-lg"
            />
            <p className="text-[11px] text-slate-500">
              Improves Skills & Strategy sub-score from {subScores.skillsStrategy} → {simulatedSubScores.skillsStrategy}.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Sliders
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white bg-navy-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplySimulatedValues}
              className="px-4 py-2 text-xs font-semibold text-white bg-electric-blue hover:bg-sky-500 rounded-lg shadow-glow flex items-center gap-1.5 transition-all"
            >
              <Check className="w-4 h-4" />
              Apply as Active Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

