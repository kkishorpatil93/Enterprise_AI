'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { exportCleanedCsvString, calculateSiloIntegrationComplexity } from '@/lib/dataQuality';
import { DataSiloSource } from '@/lib/types';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  Database,
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';

export default function DataQualityPage() {
  const {
    activeDatasetReport,
    setActiveDatasetReport,
    loadSampleMessyCsv,
    updateSubScore,
  } = useNexoraStore();

  const [activeTab, setActiveTab] = useState<'quality' | 'silos'>('quality');
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Initial Data Silos for Acme
  const [siloSources, setSiloSources] = useState<DataSiloSource[]>([
    {
      id: 'silo-1',
      name: 'SAP Plant ERP',
      department: 'Operations',
      format: 'Legacy ERP',
      estimatedVolumeMb: 450,
      updateFrequency: 'Manual Batch',
      hasStandardSchema: false,
    },
    {
      id: 'silo-2',
      name: 'Assembly Line Telemetry',
      department: 'Engineering',
      format: 'CSV',
      estimatedVolumeMb: 280,
      updateFrequency: 'Daily',
      hasStandardSchema: false,
    },
    {
      id: 'silo-3',
      name: 'Quality Lab Spectrometer',
      department: 'Quality',
      format: 'Excel',
      estimatedVolumeMb: 120,
      updateFrequency: 'Weekly',
      hasStandardSchema: false,
    },
    {
      id: 'silo-4',
      name: 'Supplier Compliance Certificates',
      department: 'Procurement',
      format: 'PDF',
      estimatedVolumeMb: 90,
      updateFrequency: 'Manual Batch',
      hasStandardSchema: false,
    },
    {
      id: 'silo-5',
      name: 'Customer Defect CRM',
      department: 'Sales',
      format: 'SQL Database',
      estimatedVolumeMb: 60,
      updateFrequency: 'Realtime',
      hasStandardSchema: true,
    },
  ]);

  // Compute Silo Complexity
  const siloAnalysis = calculateSiloIntegrationComplexity(siloSources);

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'dataset');

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.report) {
        setActiveDatasetReport(data.report);
        updateSubScore('dataQuality', data.report.qualityScore);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Cleaned CSV
  const handleDownloadCleaned = () => {
    if (!activeDatasetReport || !activeDatasetReport.cleanedDataSample) return;

    const csvContent = exportCleanedCsvString(activeDatasetReport.cleanedDataSample);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `cleaned_${activeDatasetReport.fileName || 'dataset.csv'}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-electric-blue/20 text-electric-blue border border-electric-blue/30">
                <Database className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                AI Data Quality Analyzer & Silo Mapper
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                Module 02
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Scans structured datasets for missing values, duplicates, outliers, casing anomalies, and PII. Maps enterprise silos into a unified schema.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadSampleMessyCsv}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-800 border border-navy-750 text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Acme Messy Dataset</span>
            </button>

            {activeDatasetReport && (
              <button
                onClick={handleDownloadCleaned}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Cleaned CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-navy-800 pb-2">
          <button
            onClick={() => setActiveTab('quality')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'quality'
                ? 'bg-electric-blue text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-900'
            }`}
          >
            Dataset Quality & Anomaly Scanner
          </button>
          <button
            onClick={() => setActiveTab('silos')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'silos'
                ? 'bg-electric-blue text-white shadow-glow'
                : 'text-slate-400 hover:text-white hover:bg-navy-900'
            }`}
          >
            Department Data Silo Mapper & Schema ({siloSources.length} Silos)
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Cleaned CSV successfully generated and downloaded without modifying original storage files.</span>
          </div>
        )}

        {/* TAB 1: DATA QUALITY ANALYZER */}
        {activeTab === 'quality' && (
          <div className="space-y-6">
            {/* Upload Area */}
            <div className="p-6 rounded-2xl bg-navy-900/80 border border-dashed border-navy-700 hover:border-cyan-500/50 transition-colors text-center relative">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                disabled={isProcessing}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                <div className="p-3 bg-navy-850 rounded-2xl text-electric-cyan">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <div className="text-sm font-semibold text-white">
                  {isProcessing ? 'Analyzing Dataset Statistics...' : 'Drop your CSV or Excel file here, or browse'}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Supported formats: CSV, XLSX, XLS &bull; Max size: 10MB &bull; Analyzed server-side
                </div>
              </div>
            </div>

            {/* Quality Summary Cards */}
            {activeDatasetReport ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Quality Score</span>
                    <div className="text-2xl font-extrabold font-mono text-amber-400">
                      {activeDatasetReport.qualityScore}%
                    </div>
                    <SourceTagBadge source="Uploaded-data" />
                  </div>

                  <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Total Rows</span>
                    <div className="text-2xl font-extrabold font-mono text-white">
                      {activeDatasetReport.totalRows}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {activeDatasetReport.totalCols} Columns
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Missing Values</span>
                    <div className="text-2xl font-extrabold font-mono text-rose-400">
                      {activeDatasetReport.missingTotal}
                    </div>
                    <span className="text-[10px] text-rose-400/80 font-mono">Imputation needed</span>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Duplicate Rows</span>
                    <div className="text-2xl font-extrabold font-mono text-amber-400">
                      {activeDatasetReport.duplicateRows}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Exact matches</span>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">Format Errors</span>
                    <div className="text-2xl font-extrabold font-mono text-rose-400">
                      {activeDatasetReport.formatErrorsTotal}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Type schema drift</span>
                  </div>

                  <div className="p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-1">
                    <span className="text-[10px] uppercase font-mono text-slate-400">IQR Outliers</span>
                    <div className="text-2xl font-extrabold font-mono text-violet-400">
                      {activeDatasetReport.outliersTotal}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">Extreme values</span>
                  </div>
                </div>

                {/* Per-Column Issue Table */}
                <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Column Health Diagnostics</h3>
                      <p className="text-xs text-slate-400">
                        Detailed breakdown per column in <code>{activeDatasetReport.fileName}</code>
                      </p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400">
                      {activeDatasetReport.columns.length} Columns Audited
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-navy-800 text-slate-400 font-mono text-[11px] uppercase">
                          <th className="py-2.5 px-3">Column</th>
                          <th className="py-2.5 px-3">Inferred Type</th>
                          <th className="py-2.5 px-3">Missing Cells</th>
                          <th className="py-2.5 px-3">Format Errors</th>
                          <th className="py-2.5 px-3">IQR Outliers</th>
                          <th className="py-2.5 px-3">Casing Inconsistencies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
                        {activeDatasetReport.columns.map((col, idx) => (
                          <tr key={idx} className="hover:bg-navy-850/50">
                            <td className="py-2.5 px-3 font-semibold text-white">{col.column}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-cyan-300">
                                {col.inferredType}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              {col.missingCount > 0 ? (
                                <span className="text-rose-400 font-bold">
                                  {col.missingCount} ({col.missingPct}%)
                                </span>
                              ) : (
                                <span className="text-emerald-400">0</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {col.invalidFormatCount > 0 ? (
                                <span className="text-amber-400 font-bold">{col.invalidFormatCount}</span>
                              ) : (
                                <span className="text-emerald-400">0</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3">
                              {col.outlierCount > 0 ? (
                                <span className="text-violet-400 font-bold">{col.outlierCount}</span>
                              ) : (
                                <span className="text-emerald-400">0</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-[11px] text-slate-400">
                              {col.casingVariants.length > 0 ? (
                                <span className="text-amber-300">{col.casingVariants.join(', ')}</span>
                              ) : (
                                <span className="text-slate-500">Standardized</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Suggested Cleaning Actions */}
                <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-electric-cyan" />
                        Automated Data Hygiene Actions
                      </h3>
                      <p className="text-xs text-slate-400">
                        Cleaning rules applied to the downloaded dataset. The original file in storage is never mutated.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeDatasetReport.suggestedActions.map((act) => (
                      <div
                        key={act.id}
                        className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">{act.title}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                            +{act.impactScoreImprovement} Quality Pts
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{act.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Before / After Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">
                      Raw Original Data Sample (First 5 Rows)
                    </span>
                    <pre className="text-[11px] font-mono bg-navy-950 p-3 rounded-xl overflow-x-auto text-slate-400 border border-navy-800 max-h-48">
                      {JSON.stringify(activeDatasetReport.rawDataSample?.slice(0, 5), null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                      Cleaned RFC-Compliant Output (First 5 Rows)
                    </span>
                    <pre className="text-[11px] font-mono bg-navy-950 p-3 rounded-xl overflow-x-auto text-emerald-300 border border-navy-800 max-h-48">
                      {JSON.stringify(activeDatasetReport.cleanedDataSample?.slice(0, 5), null, 2)}
                    </pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-slate-500 font-mono text-xs">
                No active dataset loaded. Click &apos;Load Acme Messy Dataset&apos; above or upload a CSV.
              </div>
            )}
          </div>
        )}

        {/* TAB 2: DATA SILO MAPPER */}
        {activeTab === 'silos' && (
          <div className="space-y-6">
            {/* Silo Metrics Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase font-mono text-slate-400">
                  Integration Complexity
                </span>
                <div className="text-3xl font-extrabold font-mono text-rose-400 mt-1">
                  {siloAnalysis.complexityScore} / 100
                </div>
                <span className="text-xs text-rose-400 font-semibold">{siloAnalysis.riskLevel} Risk</span>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase font-mono text-slate-400">
                  Disconnected Silos
                </span>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">
                  {siloSources.length} Systems
                </div>
                <span className="text-xs text-slate-400">Across 5 Corporate Departments</span>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase font-mono text-slate-400">
                  Canonical Schema Ready
                </span>
                <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
                  Unified
                </div>
                <span className="text-xs text-slate-400">5 Enterprise Fields Defined</span>
              </div>
            </div>

            {/* Department Silo Table */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Registered Department Data Sources</h3>
                  <p className="text-xs text-slate-400">
                    Disparate data stores preventing cross-functional AI reasoning (Problem #6 &amp; #7).
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 font-mono text-[11px] uppercase">
                      <th className="py-2.5 px-3">System Name</th>
                      <th className="py-2.5 px-3">Department</th>
                      <th className="py-2.5 px-3">Format</th>
                      <th className="py-2.5 px-3">Est. Volume</th>
                      <th className="py-2.5 px-3">Sync Cadence</th>
                      <th className="py-2.5 px-3">Standard Schema</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 font-mono text-slate-300">
                    {siloSources.map((s) => (
                      <tr key={s.id} className="hover:bg-navy-850/50">
                        <td className="py-2.5 px-3 font-semibold text-white">{s.name}</td>
                        <td className="py-2.5 px-3 text-cyan-400">{s.department}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-[10px]">
                            {s.format}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{s.estimatedVolumeMb} MB</td>
                        <td className="py-2.5 px-3 text-amber-400">{s.updateFrequency}</td>
                        <td className="py-2.5 px-3">
                          {s.hasStandardSchema ? (
                            <span className="text-emerald-400">Yes</span>
                          ) : (
                            <span className="text-rose-400">No (Proprietary)</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Suggested Canonical Schema */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-electric-cyan" />
                  NEXORA Unified Canonical Schema Specification
                </h3>
                <p className="text-xs text-slate-400">
                  Recommended universal ingestion contract to eliminate manual spreadsheets and harmonize silos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {siloAnalysis.unifiedSchemaSuggestion.map((f, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-navy-950 border border-navy-800 space-y-1 font-mono"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-electric-cyan">{f.field}</span>
                      <span className="text-[10px] text-slate-400">{f.type}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans">{f.source}</p>
                    <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-navy-900 border border-navy-800 text-slate-500">
                      {f.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

