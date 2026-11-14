'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Database,
  Server,
  Activity,
  DollarSign,
  Bot,
  Shield,
  KanbanSquare,
  Compass,
  FileText,
  Settings,
  Sparkles,
  HelpCircle,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();

  const navGroups = [
    {
      group: 'Overview & Verification',
      items: [
        { label: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard },
        {
          label: 'Problem Coverage Matrix',
          path: '/coverage',
          icon: CheckSquare,
          badge: '18/18 Proof',
          badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        },
      ],
    },
    {
      group: 'Diagnostic Modules',
      items: [
        { label: 'Data Quality & Silos', path: '/data', icon: Database },
        { label: 'Infrastructure Fleet', path: '/infrastructure', icon: Server },
        { label: 'Network & Storage', path: '/network', icon: Activity },
        { label: 'Compute & Cost Optimizer', path: '/cost', icon: DollarSign },
      ],
    },
    {
      group: 'Intelligence & Governance',
      items: [
        { label: 'Knowledge RAG Assistant', path: '/assistant', icon: Bot },
        { label: 'Security & AI Governance', path: '/governance', icon: Shield },
        { label: 'Remediation Kanban', path: '/tasks', icon: KanbanSquare },
        {
          label: 'AI Readiness Advisor',
          path: '/advisor',
          icon: HelpCircle,
          badge: 'AI Chat',
          badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        },
      ],
    },
    {
      group: 'Strategy & Delivery',
      items: [
        { label: '3-Horizon Roadmap', path: '/roadmap', icon: Compass },
        { label: 'Executive Report', path: '/report', icon: FileText },
        { label: 'Settings & Weights', path: '/settings', icon: Settings },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy-950 border-r border-navy-800 text-white w-64 select-none">
      {/* Brand Logo & Name */}
      <div className="h-16 px-5 border-b border-navy-800 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-electric-blue via-electric-cyan to-violet-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-base tracking-wider bg-gradient-to-r from-white via-cyan-200 to-sky-400 bg-clip-text text-transparent">
              NEXORA AI
            </div>
            <div className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
              Enterprise Platform
            </div>
          </div>
        </Link>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] uppercase tracking-wider font-mono text-slate-500 font-semibold mb-1">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-electric-blue text-white shadow-glow'
                      : 'text-slate-300 hover:text-white hover:bg-navy-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold border ${
                        isActive
                          ? 'bg-white/20 text-white border-white/30'
                          : item.badgeColor || 'bg-navy-800 text-slate-300 border-navy-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-navy-800 bg-navy-950/80 text-[11px] font-mono text-slate-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Telemetry Online</span>
          </div>
          <span className="text-[10px] text-slate-500">v1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

