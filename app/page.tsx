import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Activity,
  Layers,
  CheckCircle2,
  Trophy,
  Zap,
} from 'lucide-react';

export default function LandingPage() {
  const problemHighlights = [
    { title: 'Legacy Fleet & Compute Mismatch', desc: 'Detects overloaded CPUs and uncovers $9.1k/mo idle instance waste.' },
    { title: 'Data Quality & Department Silos', desc: 'Scans CSV/XLSX for missing values, duplicates, outliers and unifies schemas.' },
    { title: 'Security Gaps & Shadow AI Sprawl', desc: 'Pinpoints unmasked PII records and registers unapproved consumer AI tools.' },
    { title: 'Actionable 3-Horizon Roadmap', desc: 'Converts diagnostic findings directly into prioritized, human-approved Kanban tasks.' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 selection:bg-electric-blue selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-electric-blue/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Navigation */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-blue via-electric-cyan to-violet-600 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-wider text-white">NEXORA AI</span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-cyan-400">
              Enterprise Readiness
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-electric-blue hover:bg-sky-500 text-white shadow-glow transition-all flex items-center gap-1.5"
          >
            <span>Launch Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-electric-cyan/30 text-xs font-mono text-cyan-300 shadow-glow">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Hackathon-Winning Enterprise AI Platform</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Make every enterprise{' '}
          <span className="bg-gradient-to-r from-electric-cyan via-electric-blue to-violet-400 bg-clip-text text-transparent">
            AI-ready, intelligent
          </span>{' '}
          and efficient.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
          The all-in-one platform that finds, measures, explains and helps remediate the barriers to
          enterprise AI adoption—transforming diagnostics into a prioritized roadmap and assigned tasks.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-electric-blue to-cyan-500 text-white text-sm font-bold shadow-glow hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>Launch Acme Manufacturing Demo (Score 52.4)</span>
          </Link>

          <Link
            href="/coverage"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Problem Coverage Matrix (18/18)</span>
          </Link>
        </div>

        {/* Live Demo Metric Banner */}
        <div className="pt-10">
          <div className="p-6 rounded-2xl bg-navy-900/90 border border-navy-750 backdrop-blur-xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-400">Baseline Score</span>
              <div className="text-3xl font-extrabold font-mono text-amber-400">52.4 / 100</div>
              <span className="text-[11px] text-slate-400">Significant Gaps Detected</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-400">Idle Compute Waste</span>
              <div className="text-3xl font-extrabold font-mono text-rose-400">$9,100 / mo</div>
              <span className="text-[11px] text-slate-400">8 Over-provisioned Instances</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-400">Unmasked PII Records</span>
              <div className="text-3xl font-extrabold font-mono text-violet-400">46 Records</div>
              <span className="text-[11px] text-slate-400">Emails & Phones Flagged</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase font-mono text-slate-400">Problem Coverage</span>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">18 / 18</div>
              <span className="text-[11px] text-slate-400">100% Problems Addressed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Columns */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Honest Diagnostics Across Every Enterprise Layer
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            No hallucinated measurements. Every statistic strictly carries an audited source tag.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problemHighlights.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-navy-900/60 border border-navy-800 hover:border-cyan-500/30 transition-all space-y-3"
            >
              <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-electric-cyan font-mono text-sm font-bold">
                0{idx + 1}
              </div>
              <h3 className="text-base font-semibold text-white">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-navy-800 py-8 text-center text-xs text-slate-500 font-mono">
        <div>NEXORA AI Platform &bull; Built for 2026 Enterprise AI Readiness &bull; Acme Manufacturing Demo</div>
      </footer>
    </div>
  );
}

