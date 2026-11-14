'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { AiRegistryItem } from '@/lib/types';
import {
  Shield,
  Lock,
  UserCheck,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  XCircle,
  Plus,
  Search,
  History,
  FileText,
} from 'lucide-react';

export default function GovernancePage() {
  const { aiRegistry, toggleAiApproval, addAiRegistryItem } = useNexoraStore();
  const [activeTab, setActiveTab] = useState<'pii' | 'registry' | 'audit' | 'frameworks'>('pii');

  // New Tool Registry State
  const [newTool, setNewTool] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newSensitivity, setNewSensitivity] = useState<'public' | 'internal' | 'confidential' | 'restricted'>('internal');
  const [newUseCase, setNewUseCase] = useState('');

  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.trim() || !newOwner.trim()) return;

    addAiRegistryItem({
      tool: newTool.trim(),
      owner: newOwner.trim(),
      department: newDept,
      dataSensitivity: newSensitivity,
      approved: false, // Default requires security approval
      riskLevel: newSensitivity === 'confidential' || newSensitivity === 'restricted' ? 'high' : 'low',
      useCase: newUseCase || 'General productivity support',
      monthlyCost: 30,
    });

    setNewTool('');
    setNewOwner('');
    setNewUseCase('');
  };

  // Detected PII in sample dataset
  const detectedPiiRecords = [
    { type: 'Personal Email', column: 'operator_email', count: 11, sample: 'tom.bradley@acmemfg.internal', risk: 'Critical' },
    { type: 'Phone Number', column: 'operator_phone', count: 10, sample: '+1-555-0192', risk: 'High' },
    { type: 'Worker Identity', column: 'operator_name', count: 15, sample: 'Operator Shift A (Mark T.)', risk: 'Medium' },
    { type: 'Equipment Serial', column: 'equipment_id', count: 10, sample: 'EQ-1001 (Internal Asset)', risk: 'Low' },
  ];

  // Framework Alignment (Language rule: Aligned with / Supports, never Certified)
  const governanceFrameworks = [
    {
      framework: 'NIST AI Risk Management Framework (AI RMF 1.0)',
      status: 'Aligned with Core Functions',
      description: 'NEXORA deterministic assessment covers Govern, Map, Measure, and Manage functions.',
      badge: 'Aligned',
    },
    {
      framework: 'ISO/IEC 42001 (Artificial Intelligence Management System)',
      status: 'Supports Management System Controls',
      description: 'Provides audit logging, role-based document access, and automated AI Usage Registry.',
      badge: 'Supports',
    },
    {
      framework: 'EU Artificial Intelligence Act (High-Risk Governance)',
      status: 'Supports Transparency & Data Quality Mandates',
      description: 'Implements rigorous missing-value, duplicate, and outlier detection prior to model training.',
      badge: 'Supports',
    },
  ];

  // Audit Log Entries
  const auditLogs = [
    { timestamp: '2026-11-14 09:30:14 UTC', user: 'system_daemon', action: 'DATASET_SCAN_PII', detail: 'Identified 46 PII entities in acme_factory_telemetry_messy.csv' },
    { timestamp: '2026-11-14 09:12:05 UTC', user: 'admin@acmemfg.internal', action: 'AI_TOOL_STATUS_CHANGE', detail: 'Toggled approval on GitHub Copilot Enterprise to APPROVED' },
    { timestamp: '2026-11-14 08:45:00 UTC', user: 'analyst@acmemfg.internal', action: 'ASSESSMENT_RUN', detail: 'Recalculated readiness score: 52.4 (Significant Gaps)' },
    { timestamp: '2026-11-14 08:00:22 UTC', user: 'system_daemon', action: 'HOST_METRIC_INGEST', detail: 'Ingested agent telemetry from acme-node-01' },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Security & AI Governance
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                Module 07
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              PII sanitization scanner, shadow AI sprawl registry, immutable audit trail, and regulatory framework alignment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SourceTagBadge source="Uploaded-data" />
          </div>
        </div>

        {/* Mandatory Honesty Rule: Compliance vs Alignment Language */}
        <div className="p-4 rounded-2xl bg-navy-900 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold uppercase tracking-wider font-mono">
              Governance & Legal Honesty Policy
            </span>
            <p className="text-slate-300">
              NEXORA uses precise legal language: our platform <strong>&ldquo;aligns with&rdquo;</strong> and <strong>&ldquo;supports&rdquo;</strong> governance frameworks (NIST AI RMF, ISO 42001, EU AI Act). We never falsely claim <em>&ldquo;compliant&rdquo;</em> or <em>&ldquo;certified&rdquo;</em>, as third-party independent audits are required for legal certifications.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-navy-800 pb-2">
          <button
            onClick={() => setActiveTab('pii')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'pii'
                ? 'bg-rose-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-900'
            }`}
          >
            PII &amp; Sensitive Data Scanner
          </button>
          <button
            onClick={() => setActiveTab('registry')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'registry'
                ? 'bg-rose-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-900'
            }`}
          >
            Shadow AI Registry ({aiRegistry.length} Tools)
          </button>
          <button
            onClick={() => setActiveTab('frameworks')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'frameworks'
                ? 'bg-rose-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-900'
            }`}
          >
            Framework Alignment
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'audit'
                ? 'bg-rose-600 text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-900'
            }`}
          >
            Immutable Audit Trail
          </button>
        </div>

        {/* TAB 1: PII SCANNER */}
        {activeTab === 'pii' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase text-slate-400">Total Flagged PII</span>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">46 Records</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">Exposed in open telemetry spreadsheets</p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase text-slate-400">High-Risk Columns</span>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">2 Columns</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">operator_email &amp; operator_phone</p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase text-slate-400">Sanitization Status</span>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">Action Req.</div>
                <p className="text-[11px] text-slate-400 font-sans mt-1">Cleaned export available in Data module</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Detected PII Pattern Entities</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 uppercase text-[11px]">
                      <th className="py-2.5 px-3">PII Classification</th>
                      <th className="py-2.5 px-3">Column Name</th>
                      <th className="py-2.5 px-3">Instances</th>
                      <th className="py-2.5 px-3">Sample Redacted Excerpt</th>
                      <th className="py-2.5 px-3">Risk Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 text-slate-300">
                    {detectedPiiRecords.map((r, idx) => (
                      <tr key={idx} className="hover:bg-navy-850/50">
                        <td className="py-2.5 px-3 font-semibold text-white">{r.type}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{r.column}</td>
                        <td className="py-2.5 px-3 font-bold text-rose-400">{r.count}</td>
                        <td className="py-2.5 px-3 text-slate-400">{r.sample}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              r.risk === 'Critical'
                                ? 'bg-rose-500/20 text-rose-400'
                                : r.risk === 'High'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-sky-500/20 text-sky-400'
                            }`}
                          >
                            {r.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHADOW AI REGISTRY */}
        {activeTab === 'registry' && (
          <div className="space-y-6">
            {/* Add Tool Form */}
            <form onSubmit={handleAddTool} className="p-5 rounded-2xl bg-navy-900/90 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-electric-cyan" />
                Register Department AI Tool (Prevent Shadow AI Sprawl)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
                <input
                  type="text"
                  placeholder="Tool Name (e.g. Claude 3.5, Cursor)"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  placeholder="Owner / Lead (e.g. Sarah K.)"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white placeholder-slate-500"
                />
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                >
                  <option>Engineering</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>Marketing</option>
                  <option>Legal</option>
                </select>
                <select
                  value={newSensitivity}
                  onChange={(e) => setNewSensitivity(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
                >
                  <option value="public">Public</option>
                  <option value="internal">Internal</option>
                  <option value="confidential">Confidential</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
              <div className="flex justify-between items-center pt-2">
                <input
                  type="text"
                  placeholder="Intended enterprise use case and justification..."
                  value={newUseCase}
                  onChange={(e) => setNewUseCase(e.target.value)}
                  className="flex-1 mr-3 px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-xs text-white placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-electric-blue hover:bg-sky-500 text-white text-xs font-semibold shadow-glow shrink-0 transition-all"
                >
                  Register Tool
                </button>
              </div>
            </form>

            {/* Registry List */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Audited Enterprise AI Tooling</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 uppercase text-[11px]">
                      <th className="py-2.5 px-3">AI Tool</th>
                      <th className="py-2.5 px-3">Registered Owner</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Data Sensitivity</th>
                      <th className="py-2.5 px-3">Risk Level</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Approval Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 text-slate-300">
                    {aiRegistry.map((item) => (
                      <tr key={item.id} className="hover:bg-navy-850/50">
                        <td className="py-2.5 px-3 font-semibold text-white">{item.tool}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.owner}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{item.department}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-[10px] uppercase">
                            {item.dataSensitivity}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.riskLevel === 'critical'
                                ? 'bg-rose-500/20 text-rose-400'
                                : item.riskLevel === 'high'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {item.riskLevel}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.approved
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {item.approved ? 'Approved' : 'Unapproved'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => toggleAiApproval(item.id)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                              item.approved
                                ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30'
                            }`}
                          >
                            {item.approved ? 'Revoke Approval' : 'Grant Approval'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FRAMEWORKS */}
        {activeTab === 'frameworks' && (
          <div className="space-y-4">
            {governanceFrameworks.map((fw, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{fw.framework}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {fw.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{fw.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4 font-mono text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-electric-cyan" />
              Immutable Enterprise Audit Log (Supabase RLS)
            </h3>
            <div className="divide-y divide-navy-800">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-electric-cyan font-bold">{log.action}</span>
                    <p className="text-slate-400 text-[11px] font-sans">{log.detail}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    <div>{log.user}</div>
                    <div>{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

