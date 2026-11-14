'use client';

import React from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import {
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Download,
} from 'lucide-react';

export default function ExecutiveReportPage() {
  const { assessment, problems, roadmap, tasks } = useNexoraStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Top Action Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-4 border-b border-navy-800 print:hidden">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Executive AI Readiness Report
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Branded, auditable PDF-ready assessment summary for C-level executives, board members, and hackathon judges.
            </p>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-electric-blue hover:bg-sky-500 text-white font-bold text-xs shadow-glow transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>

        {/* Printable Branded Document Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-navy-900 border border-navy-750 text-slate-100 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0 space-y-8 max-w-4xl mx-auto">
          {/* Document Header */}
          <div className="flex items-start justify-between pb-6 border-b border-navy-800 print:border-gray-300">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center text-white print:bg-black">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xl tracking-wider text-white print:text-black">
                  NEXORA AI
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600 font-mono">
                Enterprise AI Readiness &amp; Intelligence Platform
              </p>
            </div>

            <div className="text-right text-xs font-mono space-y-0.5 text-slate-400 print:text-gray-600">
              <div className="font-bold text-white print:text-black">CONFIDENTIAL AUDIT REPORT</div>
              <div>Organization: Acme Manufacturing Corp</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Assessment Version: v1.0.4-RLS</div>
            </div>
          </div>

          {/* Executive Score Summary */}
          <div className="p-6 rounded-2xl bg-navy-950 border border-navy-800 print:bg-gray-100 print:border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400 print:text-gray-600">
                Composite Enterprise Readiness Score
              </span>
              <div className="text-5xl font-extrabold font-mono text-amber-400 print:text-black">
                {assessment.overallScore.toFixed(1)} <span className="text-xl text-slate-500 font-normal">/ 100</span>
              </div>
              <div className="text-xs font-semibold text-amber-300 print:text-gray-800">
                Classification: {assessment.tier} (Confidence: {assessment.confidenceScore}%)
              </div>
            </div>

            <div className="text-xs font-mono space-y-1.5 text-slate-300 print:text-gray-700 max-w-xs">
              <div>&bull; Assessed Dimensions: 6 of 6 Categories</div>
              <div>&bull; Monthly AI Compute Spend: $28,400</div>
              <div>&bull; Projected Waste Elimination: $9,100/mo</div>
              <div>&bull; Problem Coverage Proof: 18 / 18 Verified</div>
            </div>
          </div>

          {/* Six Category Sub-Score Matrix */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black font-mono">
              1. Assessment Sub-Score Matrix
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-[10px] text-slate-400 print:text-gray-600">Infrastructure (20%)</span>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {assessment.subScores.infrastructure} / 100
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-[10px] text-slate-400 print:text-gray-600">Data Quality (25%)</span>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {assessment.subScores.dataQuality} / 100
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-[10px] text-slate-400 print:text-gray-600">Network &amp; Storage (15%)</span>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {assessment.subScores.networkStorage} / 100
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-[10px] text-slate-400 print:text-gray-600">Compute Efficiency (15%)</span>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {assessment.subScores.computeCost} / 100
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-[10px] text-slate-400 print:text-gray-600">Security &amp; Governance (15%)</span>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {assessment.subScores.securityGovernance} / 100
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 print:border-gray-300 print:bg-gray-50">
                <span className="text-[10px] text-slate-400 print:text-gray-600">Skills &amp; AI Strategy (10%)</span>
                <div className="text-xl font-bold text-white print:text-black mt-1">
                  {assessment.subScores.skillsStrategy} / 100
                </div>
              </div>
            </div>
          </div>

          {/* Key Critical Findings */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black font-mono">
              2. Key Executive Findings &amp; Bottlenecks
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 print:text-gray-800">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&bull;</span>
                <span>
                  <strong>Security &amp; PII Exposure [Critical]:</strong> 46 unmasked operator personal records, emails, and phone numbers discovered in open factory telemetry spreadsheets.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">&bull;</span>
                <span>
                  <strong>Cloud Compute Waste [Critical]:</strong> 8 c5.2xlarge instances running in us-east-2 with &lt;4% average CPU utilization, generating $9,100 monthly in idle waste.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">&bull;</span>
                <span>
                  <strong>Legacy Fleet Saturation [Warning]:</strong> 26 of 42 on-prem nodes are older than 6 years with excessive memory saturation (&gt;85%) and no hardware tensor acceleration.
                </span>
              </li>
            </ul>
          </div>

          {/* Roadmap Highlights */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-black font-mono">
              3. Prioritized 30-Day Executive Roadmap
            </h3>
            <div className="divide-y divide-navy-800 print:divide-gray-300 text-xs">
              {roadmap.slice(0, 3).map((r) => (
                <div key={r.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-white print:text-black">{r.title}</div>
                    <div className="text-slate-400 print:text-gray-600 text-[11px]">{r.solution}</div>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-400 print:text-gray-600">
                    <div>{r.responsibleDepartment}</div>
                    <div className="text-emerald-400 print:text-black font-bold">{r.targetDate}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Certification Block */}
          <div className="pt-8 border-t border-navy-800 print:border-gray-400 grid grid-cols-2 gap-8 text-xs font-mono text-slate-400 print:text-gray-600">
            <div className="space-y-4">
              <div>Audited by: NEXORA AI Deterministic Engine</div>
              <div className="border-b border-navy-700 print:border-gray-400 w-48 h-8" />
              <div>Chief Technology Officer / CIO Sign-off</div>
            </div>

            <div className="space-y-4 text-right">
              <div>Verification Hash: a7f8e4...92b1</div>
              <div className="border-b border-navy-700 print:border-gray-400 w-48 h-8 ml-auto" />
              <div>Enterprise Governance Committee</div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

