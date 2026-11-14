'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { ReadinessGauge } from '@/components/ReadinessGauge';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { WhyThisScoreDrawer } from '@/components/WhyThisScoreDrawer';
import { SubScores } from '@/lib/types';
import Link from 'next/link';
import {
  Server,
  Database,
  Activity,
  DollarSign,
  Shield,
  GraduationCap,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  Layers,
  Building2,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { assessment, problems, tasks } = useNexoraStore();
  const [whyDrawerOpen, setWhyDrawerOpen] = useState(false);
  const [selectedSubScore, setSelectedSubScore] = useState<keyof SubScores>('infrastructure');

  const openAudit = (category: keyof SubScores) => {
    setSelectedSubScore(category);
    setWhyDrawerOpen(true);
  };

  // Historical assessment score trends
  const scoreHistory = [
    { date: 'Aug 26', score: 38.5 },
    { date: 'Sep 26', score: 44.0 },
    { date: 'Oct 26', score: 49.2 },
    { date: 'Nov 26 (Current)', score: assessment.overallScore },
  ];

  // Department readiness heat-map
  const departmentScores = [
    { dept: 'IT Systems', score: 72, count: 18, status: 'Needs Improvement' },
    { dept: 'Engineering', score: 65, count: 24, status: 'Needs Improvement' },
    { dept: 'Operations', score: 41, count: 32, status: 'Significant Gaps' },
    { dept: 'Finance', score: 58, count: 8, status: 'Significant Gaps' },
    { dept: 'Marketing', score: 79, count: 6, status: 'Needs Improvement' },
  ];

  const subScoreCards = [
    {
      key: 'infrastructure' as keyof SubScores,
      title: 'Infrastructure',
      score: assessment.subScores.infrastructure ?? 0,
      weight: assessment.weights.infrastructure,
      icon: Server,
      source: 'Measured' as const,
      route: '/infrastructure',
      warning: '26 legacy nodes with >85% RAM usage',
    },
    {
      key: 'dataQuality' as keyof SubScores,
      title: 'Data Quality & Silos',
      score: assessment.subScores.dataQuality ?? 0,
      weight: assessment.weights.dataQuality,
      icon: Database,
      source: 'Uploaded-data' as const,
      route: '/data',
      warning: '12.7% missing cells, 46 PII records',
    },
    {
      key: 'networkStorage' as keyof SubScores,
      title: 'Network & Storage',
      score: assessment.subScores.networkStorage ?? 0,
      weight: assessment.weights.networkStorage,
      icon: Activity,
      source: 'Measured' as const,
      route: '/network',
      warning: '48ms median latency, 18ms jitter',
    },
    {
      key: 'computeCost' as keyof SubScores,
      title: 'Compute & Cost',
      score: assessment.subScores.computeCost ?? 0,
      weight: assessment.weights.computeCost,
      icon: DollarSign,
      source: 'Simulated' as const,
      route: '/cost',
      warning: '$9,100/mo idle compute waste',
    },
    {
      key: 'securityGovernance' as keyof SubScores,
      title: 'Security & Governance',
      score: assessment.subScores.securityGovernance ?? 0,
      weight: assessment.weights.securityGovernance,
      icon: Shield,
      source: 'Uploaded-data' as const,
      route: '/governance',
      warning: '7 unapproved consumer AI tools',
    },
    {
      key: 'skillsStrategy' as keyof SubScores,
      title: 'Skills & Strategy',
      score: assessment.subScores.skillsStrategy ?? 0,
      weight: assessment.weights.skillsStrategy,
      icon: GraduationCap,
      source: 'User-entered' as const,
      route: '/advisor',
      warning: '15% trained in enterprise AI safety',
    },
  ];

  const criticalIssuesCount = problems.filter((p) => p.currentStatus === 'Critical').length;
  const warningIssuesCount = problems.filter((p) => p.currentStatus === 'Warning').length;

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Executive AI Readiness Dashboard
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Acme Manufacturing Corp
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic mathematical assessment derived from live host telemetry, parsed datasets, and governance audits.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/coverage"
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-750 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>18/18 Problem Coverage</span>
            </Link>
            <Link
              href="/tasks"
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-electric-blue hover:bg-sky-500 text-white shadow-glow transition-all flex items-center gap-1.5"
            >
              <span>Remediation Tasks ({tasks.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero KPI Grid: Readiness Gauge + High-Level Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main Animated Tachometer Gauge */}
          <div className="lg:col-span-1">
            <ReadinessGauge
              score={assessment.overallScore}
              tier={assessment.tier}
              confidence={assessment.confidenceScore}
              assessedCount={assessment.assessedCount}
              totalCategories={assessment.totalCategories}
              onOpenWhyScore={() => openAudit('infrastructure')}
            />
          </div>

          {/* Key Executive Metrics & Monthly Spend */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Metric 1: Monthly Spend & Waste */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-750 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-slate-400">
                    Est. Cloud AI Compute Spend
                  </span>
                  <SourceTagBadge source="Simulated" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-white mt-2">
                  $28,400 <span className="text-sm font-normal text-slate-400">/ mo</span>
                </div>
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  $9,100/mo preventable idle instance waste (32%)
                </p>
              </div>
              <div className="pt-4 border-t border-navy-800 text-[11px] text-slate-400 flex justify-between">
                <span>Active Instances: 42</span>
                <Link href="/cost" className="text-electric-blue hover:underline">
                  Optimize Spend &rarr;
                </Link>
              </div>
            </div>

            {/* Metric 2: Open Issues & Bottlenecks */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-750 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono text-slate-400">
                    Active Adoption Barriers
                  </span>
                  <SourceTagBadge source="Measured" />
                </div>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-2">
                  {criticalIssuesCount + warningIssuesCount}{' '}
                  <span className="text-sm font-normal text-slate-400">Detected</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  <span className="text-rose-400 font-bold">{criticalIssuesCount} Critical</span> &bull;{' '}
                  <span className="text-amber-400 font-bold">{warningIssuesCount} Warning</span> barriers
                </p>
              </div>
              <div className="pt-4 border-t border-navy-800 text-[11px] text-slate-400 flex justify-between">
                <span>Remediation Tasks: {tasks.filter((t) => t.status !== 'done').length} Pending</span>
                <Link href="/coverage" className="text-cyan-400 hover:underline">
                  View Coverage Matrix &rarr;
                </Link>
              </div>
            </div>

            {/* Metric 3: Historical Trend Sparkline */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-750 backdrop-blur-md sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-xs uppercase font-mono text-slate-400">
                    Readiness Trajectory (Last 4 Assessments)
                  </span>
                  <div className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>+13.9 pts improvement over 90 days</span>
                  </div>
                </div>
                <SourceTagBadge source="Measured" />
              </div>

              <div className="h-28 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={scoreHistory}>
                    <XAxis
                      dataKey="date"
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      domain={[20, 80]}
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#070B1A',
                        borderColor: '#1E2A4A',
                        borderRadius: '0.75rem',
                        fontSize: '12px',
                        color: '#f8fafc',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#0ea5e9"
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', r: 4 }}
                      activeDot={{ r: 6, fill: '#38bdf8' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Dimension Sub-Score Cards */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Six Assessment Sub-Scores</h2>
              <p className="text-xs text-slate-400">
                Click any category to inspect mathematical formulas, raw penalties, and source tags.
              </p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Weights Total: 100%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subScoreCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="p-5 rounded-2xl bg-navy-900/70 border border-navy-800 hover:border-navy-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-xl bg-navy-850 group-hover:bg-electric-blue/20 text-electric-blue transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <SourceTagBadge source={card.source} />
                    </div>

                    <div className="mt-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-sm font-semibold text-white">{card.title}</h3>
                        <span className="text-xs font-mono text-slate-400">
                          Wt: {card.weight}%
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-3xl font-extrabold font-mono text-white">
                          {card.score}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">/ 100</span>
                      </div>

                      <p className="text-xs text-amber-400/90 mt-2 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        {card.warning}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-navy-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => openAudit(card.key)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Why this score?
                    </button>
                    <Link
                      href={card.route}
                      className="text-electric-blue hover:text-sky-400 font-medium flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Readiness Heat-Map */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-750">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-electric-cyan" />
                Department AI Adoption Heat-Map
              </h2>
              <p className="text-xs text-slate-400">
                Identifies operational silos and cross-functional readiness variations across divisions.
              </p>
            </div>
            <SourceTagBadge source="User-entered" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {departmentScores.map((dept, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-2"
              >
                <div className="text-xs font-semibold text-slate-200">{dept.dept}</div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-bold font-mono text-white">{dept.score}</span>
                  <span className="text-[11px] text-slate-500 font-mono">/ 100</span>
                </div>
                <div
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded text-center ${
                    dept.score >= 70
                      ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}
                >
                  {dept.status}
                </div>
                <div className="text-[10px] text-slate-400 pt-1 font-mono">
                  {dept.count} Staff Assessed
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Drawer */}
      <WhyThisScoreDrawer
        isOpen={whyDrawerOpen}
        onClose={() => setWhyDrawerOpen(false)}
        assessment={assessment}
        initialCategory={selectedSubScore}
      />
    </AppShell>
  );
}

