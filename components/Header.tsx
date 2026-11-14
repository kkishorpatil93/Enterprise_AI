'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { useNexoraStore } from '@/lib/store';
import {
  Bell,
  Sun,
  Moon,
  Search,
  Sparkles,
  Trophy,
  Sliders,
  RotateCcw,
  Building2,
  Menu,
} from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { WhatIfSimulatorModal } from './WhatIfSimulatorModal';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const {
    isDark,
    toggleTheme,
    notifications,
    markNotificationRead,
    startJudgeTour,
    resetToAcmeDemo,
  } = useNexoraStore();

  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  return (
    <>
      <header className="h-16 px-4 md:px-6 border-b border-navy-800 bg-navy-950/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-40">
        {/* Left: Mobile hamburger & Organization info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-navy-850 border border-navy-750 text-electric-blue">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  Acme Manufacturing Corp
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Demo Fleet
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Assessed: Industrial Discrete Division
              </div>
            </div>
          </div>

          <button
            onClick={resetToAcmeDemo}
            title="Reload Acme Demo Seed"
            className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-400 px-2 py-1 rounded bg-navy-900 border border-navy-800 hover:border-cyan-500/40 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Demo
          </button>
        </div>

        {/* Center: Command Palette search trigger */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-navy-900 border border-navy-800 hover:border-navy-700 text-xs text-slate-400 hover:text-slate-200 transition-colors w-64 shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search modules, tasks, metrics...</span>
            <kbd className="ml-auto text-[10px] font-mono px-1.5 py-0.5 bg-navy-850 rounded border border-navy-750">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Judge Tour Button */}
          <button
            onClick={startJudgeTour}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-electric-blue to-electric-cyan text-white text-xs font-semibold shadow-glow hover:brightness-110 transition-all"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Judge Tour (4m)</span>
            <span className="sm:hidden">Tour</span>
          </button>

          {/* AI Digital Twin Simulator Button */}
          <button
            onClick={() => setIsSimulatorOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 text-xs font-medium transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-violet-400" />
            <span>Digital Twin</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-850 transition-colors relative"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
              {unreadNotifs > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-navy-900 border border-navy-750 rounded-2xl shadow-2xl p-4 z-50 text-white animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-navy-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Platform Alerts & Findings
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    {unreadNotifs} Unread
                  </span>
                </div>
                <div className="divide-y divide-navy-800/60 max-h-64 overflow-y-auto my-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`py-2.5 px-1 cursor-pointer transition-colors ${
                        n.read ? 'opacity-60' : 'opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            n.type === 'critical' ? 'text-rose-400' : 'text-amber-400'
                          }`}
                        >
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{n.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-850 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
          </button>
        </div>
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Digital Twin Simulator Modal */}
      <WhatIfSimulatorModal isOpen={isSimulatorOpen} onClose={() => setIsSimulatorOpen(false)} />
    </>
  );
};

