'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  LayoutDashboard,
  Database,
  Server,
  Activity,
  DollarSign,
  Bot,
  Shield,
  CheckSquare,
  Compass,
  FileText,
  Sliders,
  Settings,
  HelpCircle,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const commands = [
    { title: 'Executive Dashboard', path: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
    { title: 'Problem Coverage Matrix (18 Problems)', path: '/coverage', icon: CheckSquare, category: 'Judge Proof' },
    { title: 'AI Data Quality Analyzer', path: '/data', icon: Database, category: 'Modules' },
    { title: 'Infrastructure Monitor', path: '/infrastructure', icon: Server, category: 'Modules' },
    { title: 'Network & Storage Diagnostics', path: '/network', icon: Activity, category: 'Modules' },
    { title: 'Compute & Cost Optimizer', path: '/cost', icon: DollarSign, category: 'Modules' },
    { title: 'Enterprise Knowledge Assistant (RAG)', path: '/assistant', icon: Bot, category: 'Modules' },
    { title: 'Security & AI Governance', path: '/governance', icon: Shield, category: 'Modules' },
    { title: 'Remediation Tasks Kanban', path: '/tasks', icon: CheckSquare, category: 'Modules' },
    { title: 'AI Readiness Advisor Chat', path: '/advisor', icon: HelpCircle, category: 'AI Tools' },
    { title: 'Transformation Roadmap', path: '/roadmap', icon: Compass, category: 'Strategy' },
    { title: 'Executive Report (Printable/PDF)', path: '/report', icon: FileText, category: 'Reports' },
    { title: 'Platform Settings & Weights', path: '/settings', icon: Settings, category: 'Configuration' },
  ];

  const filtered = query.trim() === ''
    ? commands
    : commands.filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelect = (path: string) => {
    router.push(path);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-xl bg-navy-900 border border-navy-700 rounded-2xl shadow-2xl overflow-hidden text-white">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-navy-800 bg-navy-950">
          <Search className="w-5 h-5 text-electric-cyan" />
          <input
            type="text"
            placeholder="Type a command or module name (e.g., 'Data', 'Coverage', 'Cost')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-none outline-none text-sm text-white placeholder-slate-500"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-navy-850 border border-navy-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching modules found. Try &apos;Dashboard&apos; or &apos;Advisor&apos;.
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.path)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-navy-800 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-lg bg-navy-850 group-hover:bg-electric-blue/20 text-slate-300 group-hover:text-electric-blue transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-200 group-hover:text-white">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{item.path}</div>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-navy-950 border border-navy-800 text-slate-400">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-navy-800 bg-navy-950 text-[11px] text-slate-500 flex items-center justify-between font-mono">
          <span>Navigate with arrows or click</span>
          <span>Ctrl/Cmd+K to toggle</span>
        </div>
      </div>
    </div>
  );
};

