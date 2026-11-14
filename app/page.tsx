'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNexoraStore } from '@/lib/store';
import { Sparkles, ShieldCheck } from 'lucide-react';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isAuthLoading } = useNexoraStore();

  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        router.replace('/dashboard');
      } else {
        router.replace('/login');
      }
    }
  }, [isAuthenticated, isAuthLoading, router]);

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center text-slate-100 p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-electric-blue/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-5 text-center max-w-sm">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-electric-blue via-electric-cyan to-violet-600 flex items-center justify-center shadow-glow animate-pulse">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold text-white tracking-wider">NEXORA AI</h1>
          <p className="text-xs font-mono text-cyan-400">Enterprise AI Readiness & Intelligence Platform</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-navy-900 border border-navy-750 text-xs font-mono text-slate-400 shadow-lg">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-electric-cyan border-t-transparent animate-spin" />
          <span>Connecting to secure enterprise gateway...</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>SOC 2 Type II &bull; ISO 27001 Protected</span>
        </div>
      </div>
    </div>
  );
}
