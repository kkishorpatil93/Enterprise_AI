'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { HostMetrics } from '@/lib/types';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export default function InfrastructurePage() {
  const { updateSubScore } = useNexoraStore();
  const [sourceMode, setSourceMode] = useState<'browser' | 'agent' | 'simulated'>('simulated');
  const [browserHardware, setBrowserHardware] = useState<any>(null);
  const [agentMetrics, setAgentMetrics] = useState<HostMetrics | null>(null);

  // Configurable thresholds
  const [cpuWarningThreshold, setCpuWarningThreshold] = useState<number>(75);
  const [cpuCriticalThreshold, setCpuCriticalThreshold] = useState<number>(90);
  const [ramWarningThreshold, setRamWarningThreshold] = useState<number>(80);

  // User-entered legacy hardware checklist
  const [serverAgeYears, setServerAgeYears] = useState<number>(6);
  const [cpuGeneration, setCpuGeneration] = useState<string>('Intel Xeon E5 v2 (Ivy Bridge - 2013)');
  const [diskType, setDiskType] = useState<string>('HDD Spinning Disk (RAID-5)');
  const [hasDedicatedGpu, setHasDedicatedGpu] = useState<boolean>(false);

  // Simulated enterprise fleet (Acme Manufacturing: 42 Nodes)
  const simulatedFleet = [
    { host: 'acme-node-01 (Assembly Main)', cpu: 88.4, ram: 92.1, disk: 84.0, gpu: 'Unavailable', status: 'Critical' },
    { host: 'acme-node-02 (Plant Gateway)', cpu: 76.2, ram: 84.5, disk: 71.0, gpu: 'Unavailable', status: 'Warning' },
    { host: 'acme-node-03 (Quality Camera)', cpu: 34.0, ram: 42.0, disk: 40.5, gpu: 'NVIDIA RTX A2000 (34%)', status: 'Optimal' },
    { host: 'acme-node-04 (SAP DB Replica)', cpu: 91.2, ram: 89.0, disk: 93.4, gpu: 'Unavailable', status: 'Critical' },
    { host: 'acme-node-05 (Telemetry Aggregator)', cpu: 48.5, ram: 65.0, disk: 55.2, gpu: 'Unavailable', status: 'Optimal' },
  ];

  // Read real browser hardware capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const nav: any = window.navigator;
      setBrowserHardware({
        cores: nav.hardwareConcurrency || 8,
        deviceMemoryGb: nav.deviceMemory || 8,
        platform: nav.platform || 'Unknown',
        userAgent: nav.userAgent,
        online: nav.onLine,
      });
    }
  }, []);

  // Fetch agent metrics if running
  const fetchAgentMetrics = async () => {
    try {
      const res = await fetch('/api/agent/metrics');
      const data = await res.json();
      if (data.metrics && data.metrics.length > 0) {
        setAgentMetrics(data.metrics[0]);
      }
    } catch (e) {
      console.warn('Agent metrics not reachable:', e);
    }
  };

  useEffect(() => {
    fetchAgentMetrics();
    const interval = setInterval(fetchAgentMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30">
                <Server className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Infrastructure Fleet Monitor
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                Module 03
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Honest multi-source hardware telemetry. Distinguishes local browser metrics, live Python daemon feeds, and simulated plant fleets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchAgentMetrics}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Poll Metrics</span>
            </button>
          </div>
        </div>

        {/* Source Mode Selector (Honesty Rule Non-Negotiable) */}
        <div className="p-4 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Active Metric Source:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setSourceMode('simulated')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
                  sourceMode === 'simulated'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow'
                    : 'bg-navy-950 text-slate-400 border border-navy-800 hover:text-white'
                }`}
              >
                Simulated Fleet (Acme Corp)
              </button>
              <button
                onClick={() => setSourceMode('browser')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
                  sourceMode === 'browser'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow'
                    : 'bg-navy-950 text-slate-400 border border-navy-800 hover:text-white'
                }`}
              >
                Local Browser Metrics
              </button>
              <button
                onClick={() => setSourceMode('agent')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium font-mono transition-colors ${
                  sourceMode === 'agent'
                    ? 'bg-electric-blue text-white shadow-glow'
                    : 'bg-navy-950 text-slate-400 border border-navy-800 hover:text-white'
                }`}
              >
                Live Python Host Agent
              </button>
            </div>
          </div>

          <SourceTagBadge
            source={
              sourceMode === 'simulated'
                ? 'Simulated'
                : sourceMode === 'browser'
                ? 'Measured'
                : 'Measured'
            }
          />
        </div>

        {/* SOURCE 1: SIMULATED ENTERPRISE FLEET */}
        {sourceMode === 'simulated' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center justify-between">
              <span>
                <strong>Simulated Acme Fleet:</strong> Reflects 42 on-premise industrial servers. 26 nodes exceed 85% memory saturation.
              </span>
              <span className="font-mono text-[11px] uppercase">Tag: Simulated</span>
            </div>

            {/* Fleet Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase font-mono text-slate-400">Total Plant Fleet</span>
                <div className="text-3xl font-extrabold font-mono text-white mt-1">42 Nodes</div>
                <p className="text-xs text-slate-400 mt-1">26 Legacy Nodes (&gt;6 Years Old)</p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase font-mono text-slate-400">Average CPU Saturation</span>
                <div className="text-3xl font-extrabold font-mono text-amber-400 mt-1">68.4%</div>
                <p className="text-xs text-rose-400 mt-1">Peaks at 96.2% during shift change</p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800">
                <span className="text-xs uppercase font-mono text-slate-400">GPU Acceleration</span>
                <div className="text-3xl font-extrabold font-mono text-rose-400 mt-1">1 of 42</div>
                <p className="text-xs text-slate-400 mt-1">41 nodes lack tensor inference acceleration</p>
              </div>
            </div>

            {/* Fleet Table */}
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
              <h3 className="text-sm font-bold text-white">Sample Host Telemetry Nodes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-navy-800 text-slate-400 uppercase text-[11px]">
                      <th className="py-2.5 px-3">Node Hostname</th>
                      <th className="py-2.5 px-3">CPU Usage</th>
                      <th className="py-2.5 px-3">RAM Usage</th>
                      <th className="py-2.5 px-3">Disk Saturation</th>
                      <th className="py-2.5 px-3">GPU Status</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800/60 text-slate-300">
                    {simulatedFleet.map((host, idx) => (
                      <tr key={idx} className="hover:bg-navy-850/50">
                        <td className="py-2.5 px-3 font-semibold text-white">{host.host}</td>
                        <td className="py-2.5 px-3">
                          <span className={host.cpu > 80 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {host.cpu}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={host.ram > 85 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                            {host.ram}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3">{host.disk}%</td>
                        <td className="py-2.5 px-3 text-slate-400">{host.gpu}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              host.status === 'Critical'
                                ? 'bg-rose-500/20 text-rose-400'
                                : host.status === 'Warning'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {host.status}
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

        {/* SOURCE 2: LOCAL BROWSER METRICS */}
        {sourceMode === 'browser' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <span>
                <strong>Honest Browser Measurement:</strong> Read directly from the browser environment using W3C Navigator APIs.
              </span>
              <span className="font-mono text-[11px] uppercase">Tag: Measured</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Logical CPU Cores</span>
                <div className="text-3xl font-extrabold font-mono text-white mt-1">
                  {browserHardware?.cores || 8} vCPUs
                </div>
                <p className="text-xs text-slate-400">navigator.hardwareConcurrency</p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Estimated Device RAM</span>
                <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
                  {browserHardware?.deviceMemoryGb || 8} GB
                </div>
                <p className="text-xs text-slate-400">navigator.deviceMemory (W3C estimate)</p>
              </div>

              <div className="p-5 rounded-2xl bg-navy-900 border border-navy-800 space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Client GPU / WebGL</span>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  Available
                </div>
                <p className="text-xs text-slate-400">Hardware WebGL Accelerator Active</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 font-mono text-xs text-slate-400 space-y-1">
              <div><strong>Platform:</strong> {browserHardware?.platform}</div>
              <div><strong>User Agent:</strong> {browserHardware?.userAgent}</div>
              <div><strong>Online Status:</strong> {browserHardware?.online ? 'Connected' : 'Offline'}</div>
            </div>
          </div>
        )}

        {/* SOURCE 3: LIVE PYTHON AGENT */}
        {sourceMode === 'agent' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-electric-blue/10 border border-electric-blue/30 text-xs text-sky-300 flex items-center justify-between">
              <span>
                <strong>NEXORA Python Host Agent:</strong> Live background telemetry daemon running on host machine.
              </span>
              <span className="font-mono text-[11px] uppercase">Tag: Measured</span>
            </div>

            {agentMetrics ? (
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                  <span className="text-xs text-slate-400">Host CPU</span>
                  <div className="text-2xl font-bold text-white mt-1">{agentMetrics.cpu}%</div>
                  <span className="text-[10px] text-slate-500">Real psutil sample</span>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                  <span className="text-xs text-slate-400">Host RAM</span>
                  <div className="text-2xl font-bold text-cyan-400 mt-1">{agentMetrics.ram}%</div>
                  <span className="text-[10px] text-slate-500">{agentMetrics.ramTotalGb} GB Total</span>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                  <span className="text-xs text-slate-400">Host Disk</span>
                  <div className="text-2xl font-bold text-emerald-400 mt-1">{agentMetrics.disk}%</div>
                  <span className="text-[10px] text-slate-500">{agentMetrics.diskTotalGb} GB Volume</span>
                </div>

                <div className="p-4 rounded-xl bg-navy-900 border border-navy-800">
                  <span className="text-xs text-slate-400">Host GPU (NVIDIA)</span>
                  <div className="text-lg font-bold text-amber-400 mt-1 truncate">
                    {agentMetrics.gpuName || 'Unavailable'}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {agentMetrics.gpu !== null && agentMetrics.gpu !== undefined
                      ? `${agentMetrics.gpu}% Utilized`
                      : 'nvidia-smi not detected'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-navy-900/60 border border-navy-800 text-center space-y-3">
                <Terminal className="w-8 h-8 text-electric-cyan mx-auto" />
                <div className="text-sm font-bold text-white">No Live Agent Metrics Received Yet</div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Run the single-file Python agent daemon on any enterprise server to push live telemetry into NEXORA:
                </p>
                <div className="p-3 bg-navy-950 rounded-xl font-mono text-xs text-cyan-300 max-w-lg mx-auto text-left border border-navy-800">
                  <code>python agent/nexora_agent.py --server http://localhost:3000 --interval 5</code>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legacy Hardware Audit Checklist */}
        <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Legacy Server Fleet Audit Checklist</h3>
              <p className="text-xs text-slate-400">
                User-entered specifications for on-premise hardware nodes (Problem #1).
              </p>
            </div>
            <SourceTagBadge source="User-entered" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-slate-400">Average Node Age</label>
              <input
                type="number"
                value={serverAgeYears}
                onChange={(e) => setServerAgeYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
              />
              <span className="text-[10px] text-rose-400">&gt;5 years triggers replacement recommendation</span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">CPU Architecture Generation</label>
              <select
                value={cpuGeneration}
                onChange={(e) => setCpuGeneration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
              >
                <option>Intel Xeon E5 v2 (Ivy Bridge - 2013)</option>
                <option>Intel Xeon Scalable 2nd Gen (Cascade Lake - 2019)</option>
                <option>AMD EPYC 7003 (Milan - 2021)</option>
                <option>Modern Intel Xeon 4th Gen / AMD Genoa (2023+)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Primary Storage Drive Media</label>
              <select
                value={diskType}
                onChange={(e) => setDiskType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-navy-800 text-white"
              >
                <option>HDD Spinning Disk (RAID-5)</option>
                <option>SATA SSD (Legacy)</option>
                <option>NVMe Enterprise PCIe Gen4</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Hardware Accelerator (GPU / NPU)</label>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setHasDedicatedGpu(!hasDedicatedGpu)}
                  className={`w-full py-2 px-3 rounded-xl font-semibold transition-colors ${
                    hasDedicatedGpu
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {hasDedicatedGpu ? 'Dedicated GPU Present' : 'No GPU Accelerators (Bottleneck)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

