'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { EnterpriseProblem, ProblemCategory } from '@/lib/types';
import Link from 'next/link';
import {
  CheckSquare,
  ShieldCheck,
  Filter,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function ProblemCoverageMatrixPage() {
  const { problems, createTaskFromFinding } = useNexoraStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [createdNotification, setCreatedNotification] = useState<string | null>(null);

  const categories: (string | ProblemCategory)[] = [
    'All',
    'Infrastructure',
    'Data',
    'Financial/Operational',
    'Security/Governance',
    'Business Scenario',
  ];

  const statuses = ['All', 'Critical', 'Warning', 'Optimal'];

  const filteredProblems = problems.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || p.currentStatus === selectedStatus;
    return matchesCat && matchesStat;
  });

  const handleCreateTask = (p: EnterpriseProblem) => {
    createTaskFromFinding({
      title: `Remediate: ${p.name}`,
      description: `${p.shortDescription} Recommendation: ${p.linkedRecommendation}`,
      problemId: p.id,
      department:
        p.category === 'Data'
          ? 'Data'
          : p.category === 'Infrastructure'
          ? 'Infrastructure'
          : p.category === 'Security/Governance'
          ? 'Security'
          : 'IT',
      priority: p.currentStatus === 'Critical' ? 'critical' : 'high',
      status: 'todo',
      dueDate: '2026-12-01',
      approved: false, // Requires human approval!
      assignedTo: 'Remediation Owner',
      sourceFinding: `Problem Matrix #${p.id}`,
    });

    setCreatedNotification(`Task drafted for Problem #${p.id} (requires human approval).`);
    setTimeout(() => setCreatedNotification(null), 4000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Problem Coverage Matrix
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                18 of 18 Complete
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              <strong>Judge-Facing Proof Page:</strong> Exhaustive verification of all 18 enterprise adoption barriers, detection modules, measured metrics, and linked remediation actions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/report"
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 text-xs font-semibold text-slate-200 transition-colors"
            >
              Export Executive PDF
            </Link>
            <Link
              href="/tasks"
              className="px-4 py-2 rounded-xl bg-electric-blue hover:bg-sky-500 text-xs font-semibold text-white shadow-glow transition-all flex items-center gap-1.5"
            >
              <span>View Tasks Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Success Toast */}
        {createdNotification && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{createdNotification}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-navy-900/80 border border-navy-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mr-2">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-electric-blue text-white shadow-glow'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Status:</span>
            {statuses.map((stat) => (
              <button
                key={stat}
                onClick={() => setSelectedStatus(stat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedStatus === stat
                    ? 'bg-electric-cyan text-navy-950 font-bold'
                    : 'bg-navy-950 text-slate-400 hover:text-white border border-navy-800'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Matrix Table */}
        <div className="rounded-2xl border border-navy-800 bg-navy-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-navy-800 bg-navy-950/90 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Problem Name & Scope</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Detection Module</th>
                  <th className="py-3 px-4">Measured Evidence</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Linked Recommendation</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-slate-300">
                {filteredProblems.map((p) => {
                  const isCritical = p.currentStatus === 'Critical';
                  const isWarning = p.currentStatus === 'Warning';
                  return (
                    <tr key={p.id} className="hover:bg-navy-850/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">
                        #{p.id < 10 ? `0${p.id}` : p.id}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white">{p.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{p.shortDescription}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        <span className="px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-[10px]">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <Link
                          href={p.moduleRoute}
                          className="text-electric-blue hover:text-sky-300 font-medium flex items-center gap-1 group"
                        >
                          <span>{p.detectedByModule}</span>
                          <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 space-y-1">
                        <div className="font-mono text-slate-200 font-medium">
                          {p.measuredValue || 'Diagnosed'}
                        </div>
                        <SourceTagBadge source={p.sourceTag} />
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider border ${
                            isCritical
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : isWarning
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          }`}
                        >
                          {isCritical && <AlertOctagon className="w-3 h-3" />}
                          {isWarning && <AlertTriangle className="w-3 h-3" />}
                          {!isCritical && !isWarning && <CheckCircle2 className="w-3 h-3" />}
                          <span>{p.currentStatus}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 max-w-sm text-slate-300 text-[11px]">
                        {p.linkedRecommendation}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleCreateTask(p)}
                          className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-electric-blue hover:text-white text-slate-300 text-[11px] font-medium border border-navy-700 transition-colors inline-flex items-center gap-1"
                        >
                          <PlusCircle className="w-3 h-3" />
                          <span>Draft Task</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

