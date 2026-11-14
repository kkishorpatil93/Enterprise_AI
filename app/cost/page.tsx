'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { ComputeInstance } from '@/lib/types';
import {
  DollarSign,
  TrendingDown,
  Calculator,
  Sliders,
  Server,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export default function CostOptimizerPage() {
  const { updateSubScore } = useNexoraStore();

  // Interactive Right-Sizing Slider (0 to 100% optimization adopted)
  const [optimizationAdoptionPct, setOptimizationAdoptionPct] = useState<number>(65);

  // ROI Calculator Inputs
  const [developerHoursSavedWeekly, setDeveloperHoursSavedWeekly] = useState<number>(45);
  const [developerHourlyRate, setDeveloperHourlyRate] = useState<number>(85);
  const [platformMonthlyCost, setPlatformMonthlyCost] = useState<number>(2400);

  // Simulated Acme Cloud Fleet Instances (Problem #4 & #8)
  const instances: ComputeInstance[] = [
    {
      id: 'i-01',
      name: 'c5.2xlarge (Staging Worker 1)',
      department: 'Engineering',
      vCpu: 8,
      ramGb: 16,
      gpuCount: 0,
      hourlyRate: 0.34,
      currentCpuAvgPct: 3.2,
      currentRamAvgPct: 18.0,
      status: 'Underutilized',
      suggestedInstance: 'c5.large',
      monthlySavings: 182,
    },
    {
      id: 'i-02',
      name: 'c5.2xlarge (Staging Worker 2)',
      department: 'Engineering',
      vCpu: 8,
      ramGb: 16,
      gpuCount: 0,
      hourlyRate: 0.34,
      currentCpuAvgPct: 2.8,
      currentRamAvgPct: 15.0,
      status: 'Underutilized',
      suggestedInstance: 'c5.large',
      monthlySavings: 182,
    },
    {
      id: 'i-03',
      name: 'g4dn.xlarge (Vision Test Node)',
      department: 'Quality',
      vCpu: 4,
      ramGb: 16,
      gpuCount: 1,
      hourlyRate: 0.526,
      currentCpuAvgPct: 78.4,
      currentRamAvgPct: 82.0,
      status: 'Optimal',
      suggestedInstance: 'Keep Current',
      monthlySavings: 0,
    },
    {
      id: 'i-04',
      name: 'r5.4xlarge (Analytics Cluster)',
      department: 'Finance',
      vCpu: 16,
      ramGb: 128,
      gpuCount: 0,
      hourlyRate: 1.008,
      currentCpuAvgPct: 8.5,
      currentRamAvgPct: 22.0,
      status: 'Underutilized',
      suggestedInstance: 'r5.xlarge',
      monthlySavings: 540,
    },
  ];

  const baseMonthlySpend = 28400;
  const maxProjectedSavings = 9100;
  const realizedSavings = Math.round((maxProjectedSavings * (optimizationAdoptionPct / 100)) / 10) * 10;
  const optimizedMonthlySpend = baseMonthlySpend - realizedSavings;

  // ROI Math
  const monthlyLaborSavings = developerHoursSavedWeekly * 4.33 * developerHourlyRate;
  const netMonthlyBenefit = monthlyLaborSavings + realizedSavings - platformMonthlyCost;
  const paybackWeeks = platformMonthlyCost > 0 ? Math.max(0.2, (platformMonthlyCost / (netMonthlyBenefit / 4.33))).toFixed(1) : '0';

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <DollarSign className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Compute & Cost Optimizer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Module 05
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Uncovers idle cloud compute waste, models right-sizing recommendations, and calculates measurable enterprise AI ROI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SourceTagBadge source="Simulated" />
          </div>
        </div>

        {/* Mandatory Honesty Notice: Projections, Not Guaranteed Savings */}
        <div className="p-4 rounded-2xl bg-navy-900 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider font-mono">
              Honesty Rule &bull; Financial Disclaimer
            </span>
            <p className="text-slate-300">
              <strong>All cost savings and ROI calculations are projections based on historical AWS/Azure rate cards and telemetry samples, not guaranteed savings.</strong> Realized savings depend on cloud reservation commitments, egress data volume, and contract discounts.
            </p>
          </div>
        </div>

        {/* Before / After Monthly Spend Scenario Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <span className="text-xs uppercase font-mono text-slate-400">Current Monthly Spend</span>
            <div className="text-3xl font-extrabold font-mono text-white">
              ${baseMonthlySpend.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">42 total cloud & on-prem compute instances</p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <span className="text-xs uppercase font-mono text-electric-cyan">Projected Monthly Savings</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              -${realizedSavings.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-400/90 font-medium">
              {( (realizedSavings / baseMonthlySpend) * 100 ).toFixed(1)}% reduction at {optimizationAdoptionPct}% adoption
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2">
            <span className="text-xs uppercase font-mono text-slate-400">Optimized Projected Spend</span>
            <div className="text-3xl font-extrabold font-mono text-electric-blue">
              ${optimizedMonthlySpend.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">With idle instances decommissioned</p>
          </div>
        </div>

        {/* Interactive Optimization Adoption Slider */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-electric-cyan" />
              Right-Sizing &amp; Idle Decommissioning Scenario Slider
            </span>
            <span className="font-mono text-cyan-400 font-bold">{optimizationAdoptionPct}% Implemented</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={optimizationAdoptionPct}
            onChange={(e) => setOptimizationAdoptionPct(Number(e.target.value))}
            className="w-full accent-electric-blue cursor-pointer h-2 bg-navy-950 rounded-lg"
          />
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0% (Status Quo - High Waste)</span>
            <span>50% (Quick Wins: Idle EC2 Downsizing)</span>
            <span>100% (Aggressive Spot + Hibernation)</span>
          </div>
        </div>

        {/* Right-Sizing Instances Table */}
        <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-slate-400" />
                Over-Provisioned Cloud Compute Audit (Problem #4)
              </h3>
              <p className="text-xs text-slate-400">
                Instances operating with &lt;15% average CPU load across a 30-day monitoring window.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-navy-800 text-slate-400 uppercase text-[11px]">
                  <th className="py-2.5 px-3">Instance Name</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">vCPU / RAM</th>
                  <th className="py-2.5 px-3">Avg CPU</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Right-Sizing Target</th>
                  <th className="py-2.5 px-3 text-right">Est. Monthly Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/60 text-slate-300">
                {instances.map((inst) => (
                  <tr key={inst.id} className="hover:bg-navy-850/50">
                    <td className="py-2.5 px-3 font-semibold text-white">{inst.name}</td>
                    <td className="py-2.5 px-3 text-cyan-400">{inst.department}</td>
                    <td className="py-2.5 px-3">{inst.vCpu} vCPU / {inst.ramGb}GB</td>
                    <td className="py-2.5 px-3">
                      <span className={inst.currentCpuAvgPct < 10 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        {inst.currentCpuAvgPct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          inst.status === 'Underutilized'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {inst.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-electric-blue font-bold">{inst.suggestedInstance}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400">
                      {inst.monthlySavings > 0 ? `+$${inst.monthlySavings}/mo` : 'Optimal'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI ROI Calculator */}
        <div className="p-6 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-electric-cyan" />
                Enterprise AI Business Case &amp; ROI Calculator (Problem #9)
              </h3>
              <p className="text-xs text-slate-400">
                Models measurable dollar returns, engineering hours recovered, and investment payback milestones.
              </p>
            </div>
            <SourceTagBadge source="User-entered" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">Hours Saved Weekly by AI Automation</label>
              <input
                type="number"
                value={developerHoursSavedWeekly}
                onChange={(e) => setDeveloperHoursSavedWeekly(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
              />
              <span className="text-[10px] text-slate-500">Defect checks & manual data entry</span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Fully Loaded Hourly Labor Cost ($)</label>
              <input
                type="number"
                value={developerHourlyRate}
                onChange={(e) => setDeveloperHourlyRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
              />
              <span className="text-[10px] text-slate-500">Average engineer / supervisor rate</span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">NEXORA Platform &amp; Model API Budget ($/mo)</label>
              <input
                type="number"
                value={platformMonthlyCost}
                onChange={(e) => setPlatformMonthlyCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
              />
              <span className="text-[10px] text-slate-500">Estimated monthly enterprise license</span>
            </div>
          </div>

          {/* ROI Output Summary */}
          <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono">
            <div>
              <span className="text-[11px] uppercase text-slate-400">Monthly Labor Value Recovered</span>
              <div className="text-2xl font-bold text-white mt-1">
                ${Math.round(monthlyLaborSavings).toLocaleString()}
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase text-slate-400">Net Monthly Economic Benefit</span>
              <div className="text-2xl font-bold text-emerald-400 mt-1">
                +${Math.round(netMonthlyBenefit).toLocaleString()} / mo
              </div>
            </div>

            <div>
              <span className="text-[11px] uppercase text-slate-400">Investment Payback Period</span>
              <div className="text-2xl font-bold text-cyan-400 mt-1">
                {paybackWeeks} Weeks
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

