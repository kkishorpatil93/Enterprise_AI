'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useNexoraStore } from '@/lib/store';
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
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useNexoraStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleConfirmLogout = async () => {
    setShowLogoutModal(false);
    if (onClose) onClose();
    await logout();
    router.push('/login');
  };

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
            {group.group === 'Strategy & Delivery' && (
              <div className="pt-2 mt-2 border-t border-navy-850">
                <button
                  type="button"
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all group"
                  title="End your session and sign out"
                >
                  <div className="flex items-center gap-2.5">
                    <LogOut className="w-4 h-4 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
                    <span>Logout</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Exit
                  </span>
                </button>
              </div>
            )}
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowLogoutModal(false);
          }}
        >
          <div className="w-full max-w-sm rounded-2xl bg-navy-900 border border-navy-750 p-6 shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <LogOut className="w-5 h-5" />
              </div>
              <div>
                <h3 id="logout-title" className="text-sm font-bold text-white">
                  Confirm Logout
                </h3>
                <p className="text-xs text-slate-400">End your active enterprise session</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to log out of NEXORA AI? You will need to sign in again to access the enterprise dashboard, telemetry, and datasets.
            </p>

            {user?.email && (
              <div className="p-2.5 rounded-xl bg-navy-950 border border-navy-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                <span className="truncate max-w-[200px]">
                  User: <strong className="text-cyan-400 font-semibold">{user.email}</strong>
                </span>
                {user.role && (
                  <span className="px-1.5 py-0.5 rounded bg-navy-900 border border-navy-750 text-[10px] text-slate-400 uppercase">
                    {user.role}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-navy-800">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-glow transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

