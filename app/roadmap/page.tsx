'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { RoadmapItem } from '@/lib/types';
import Link from 'next/link';
import {
  Compass,
  Calendar,
  Layers,
  ArrowRight,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  Building2,
  AlertOctagon,
} from 'lucide-react';

export default function RoadmapPage() {
  const { roadmap, createTaskFromFinding } = useNexoraStore();
  const [selectedHorizon, setSelectedHorizon] = useState<string>('All');

  const horizons = [
    'All',
    'Immediate (0-30 Days)',
    'Medium-term (1-6 Months)',
    'Long-term (6-18 Months)',
  ];

  const filteredItems =
    selectedHorizon === 'All'
      ? roadmap
      : roadmap.filter((r) => r.horizon === selectedHorizon);

  const handleLinkTask = (item: RoadmapItem) => {
    createTaskFromFinding({
      title: item.title,
      description: `${item.solution} Expected benefit: ${item.expectedBenefit}`,
      problemId: item.problemId,
      department:
        item.responsibleDepartment === 'Data'
          ? 'Data'
          : item.responsibleDepartment === 'Security'
          ? 'Security'
          : item.responsibleDepartment === 'Infrastructure'
          ? 'Infrastructure'
          : 'IT',
      priority: item.priority,
      status: 'todo',
      dueDate: item.targetDate,
      approved: false, // Requires human approval
      assignedTo: `${item.responsibleDepartment} Lead`,
      sourceFinding: `Roadmap Horizon: ${item.horizon}`,
    });
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30">
                <Compass className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Transformation Roadmap
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Module 10
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Structured 3-horizon executive delivery plan bridging quick wins (0-30 days), data pipelines (1-6 months), and autonomous AI models (6-18 months).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/report"
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Export Executive PDF</span>
            </Link>
          </div>
        </div>

        {/* Horizon Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-navy-800">
          {horizons.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHorizon(h)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap ${
                selectedHorizon === h
                  ? 'bg-electric-blue text-white shadow-glow'
                  : 'text-slate-400 hover:text-white hover:bg-navy-900 border border-navy-800'
              }`}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Roadmap Cards Grid */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isImmediate = item.horizon.includes('Immediate');
            const isMedium = item.horizon.includes('Medium');
            const isCritical = item.priority === 'critical';

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 hover:border-navy-700 transition-all space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-navy-800">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        isImmediate
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : isMedium
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                      }`}
                    >
                      {item.horizon}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Problem #{item.problemId}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">Target: {item.targetDate}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <strong className="text-cyan-400">Remediation Strategy:</strong> {item.solution}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Responsible Unit</span>
                    <div className="text-slate-200 font-bold mt-0.5">
                      {item.responsibleDepartment}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Implementation Effort</span>
                    <div className="text-slate-200 font-bold mt-0.5">{item.effort} Effort</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 uppercase">Expected Enterprise Benefit</span>
                    <div className="text-emerald-400 font-bold mt-0.5 truncate">
                      {item.expectedBenefit}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Expected ROI: High impact on overall readiness score
                  </span>
                  <button
                    onClick={() => handleLinkTask(item)}
                    className="px-3.5 py-1.5 rounded-lg bg-navy-800 hover:bg-electric-blue hover:text-white text-slate-300 font-medium transition-colors flex items-center gap-1.5"
                  >
                    <span>Draft as Kanban Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

