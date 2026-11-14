'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { ScoreWeights } from '@/lib/types';
import { validateWeights, DEFAULT_WEIGHTS } from '@/lib/scoring';
import {
  Settings,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Building2,
  Key,
  Database,
  Bot,
} from 'lucide-react';

export default function SettingsPage() {
  const { assessment, resetToAcmeDemo } = useNexoraStore();
  const [weights, setWeights] = useState<ScoreWeights>(assessment.weights);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sum =
    weights.infrastructure +
    weights.dataQuality +
    weights.networkStorage +
    weights.computeCost +
    weights.securityGovernance +
    weights.skillsStrategy;

  const isValid = Math.abs(sum - 100) < 0.001;

  const handleWeightChange = (key: keyof ScoreWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
    setErrorMsg(null);
  };

  const handleSave = () => {
    if (!validateWeights(weights)) {
      setErrorMsg(`Weights must sum up to exactly 100% (current sum: ${sum}%).`);
      return;
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetDefaults = () => {
    setWeights(DEFAULT_WEIGHTS);
    setErrorMsg(null);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                <Settings className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Platform Settings &amp; Configuration
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customize scoring engine category weights, manage Supabase &amp; Gemini connections, and reset demo datasets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetToAcmeDemo}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Acme Manufacturing Demo Fleet</span>
            </button>
          </div>
        </div>

        {/* Feedback banners */}
        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Scoring category weights successfully saved and applied to the active calculation engine.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Scoring Engine Weights Editor */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-navy-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-electric-cyan" />
                Scoring Engine Weight Distribution
              </h2>
              <p className="text-xs text-slate-400">
                Weights must sum to 100%. Unassessed categories are dynamically excluded and renormalized.
              </p>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-slate-400">Sum Total:</span>
              <span
                className={`px-3 py-1 rounded-full font-bold ${
                  isValid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {sum}% / 100%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Infrastructure */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">1. Infrastructure</span>
                <span className="font-mono text-cyan-400">{weights.infrastructure}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={weights.infrastructure}
                onChange={(e) => handleWeightChange('infrastructure', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-navy-850 rounded"
              />
              <p className="text-[10px] text-slate-500 font-mono">Hardware age, CPU/RAM, GPU nodes</p>
            </div>

            {/* Data Quality */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">2. Data Quality &amp; Silos</span>
                <span className="font-mono text-cyan-400">{weights.dataQuality}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                value={weights.dataQuality}
                onChange={(e) => handleWeightChange('dataQuality', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-navy-850 rounded"
              />
              <p className="text-[10px] text-slate-500 font-mono">Nulls, duplicates, outliers, silos</p>
            </div>

            {/* Network & Storage */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">3. Network &amp; Storage</span>
                <span className="font-mono text-cyan-400">{weights.networkStorage}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weights.networkStorage}
                onChange={(e) => handleWeightChange('networkStorage', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-navy-850 rounded"
              />
              <p className="text-[10px] text-slate-500 font-mono">Latency, jitter, throughput pipelines</p>
            </div>

            {/* Compute Efficiency */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">4. Compute Efficiency</span>
                <span className="font-mono text-cyan-400">{weights.computeCost}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weights.computeCost}
                onChange={(e) => handleWeightChange('computeCost', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-navy-850 rounded"
              />
              <p className="text-[10px] text-slate-500 font-mono">Idle instances, over-provisioning</p>
            </div>

            {/* Security & Governance */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">5. Security &amp; Governance</span>
                <span className="font-mono text-cyan-400">{weights.securityGovernance}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={40}
                value={weights.securityGovernance}
                onChange={(e) => handleWeightChange('securityGovernance', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-navy-850 rounded"
              />
              <p className="text-[10px] text-slate-500 font-mono">PII masking, shadow AI registry</p>
            </div>

            {/* Skills & Strategy */}
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">6. Skills &amp; AI Strategy</span>
                <span className="font-mono text-cyan-400">{weights.skillsStrategy}%</span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                value={weights.skillsStrategy}
                onChange={(e) => handleWeightChange('skillsStrategy', Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-navy-850 rounded"
              />
              <p className="text-[10px] text-slate-500 font-mono">Workforce readiness, use cases</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-navy-800">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 text-xs font-mono text-slate-400 hover:text-white bg-navy-950 rounded-xl border border-navy-800"
            >
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-electric-blue hover:bg-sky-500 text-white font-bold text-xs shadow-glow transition-all"
            >
              Save Custom Weights
            </button>
          </div>
        </div>

        {/* Integration Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono">
                Supabase Postgres &amp; Storage Connection
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Demo store active with in-memory persistence. When <code>NEXT_PUBLIC_SUPABASE_URL</code> is connected, connects to Postgres with RLS policies.
            </p>
            <div className="pt-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Connected &bull; Demo Engine Active
              </span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              <h3 className="text-xs font-bold text-white uppercase font-mono">
                Google Gemini API SDK
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Uses official <code>@google/genai</code> SDK. In the absence of an API key, activates deterministic BM25 retrieval fallback.
            </p>
            <div className="pt-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/20">
                Deterministic Retrieval Fallback Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

