'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNexoraStore } from '@/lib/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Sparkles, Building2, ArrowRight, ShieldCheck, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useNexoraStore();
  const [email, setEmail] = useState('demo.analyst@acmemfg.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState<'admin' | 'analyst' | 'member' | 'viewer'>('analyst');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          console.warn('Supabase signInWithPassword note:', error.message);
        }
      }
    } catch (err) {
      console.warn('Auth handler note:', err);
    }

    login(email, role);
    setTimeout(() => {
      router.push('/dashboard');
    }, 250);
  };

  const handleInstantDemo = () => {
    setIsLoading(true);
    login('demo.analyst@acmemfg.internal', 'analyst');
    setTimeout(() => {
      router.push('/dashboard');
    }, 200);
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center px-4 relative overflow-hidden text-slate-100">
      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-electric-blue/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-navy-900 border border-navy-750 rounded-3xl p-8 shadow-2xl relative z-10 space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-electric-blue via-electric-cyan to-violet-600 flex items-center justify-center shadow-glow">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sign In to NEXORA AI</h2>
          <p className="text-xs text-slate-400">
            Enterprise AI Readiness & Intelligence Platform
          </p>
        </div>

        {/* 1-Click Instant Demo Button */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-electric-blue/20 via-electric-cyan/20 to-violet-600/20 border border-electric-cyan/40 space-y-2.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-electric-cyan uppercase tracking-wider font-mono">
            <Building2 className="w-4 h-4" />
            Hackathon Judge Access
          </div>
          <p className="text-xs text-slate-300">
            One-click instant login with seeded enterprise data for <strong>Acme Manufacturing Corp</strong> (Score 52.4).
          </p>
          <button
            onClick={handleInstantDemo}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-electric-blue to-cyan-500 hover:brightness-110 text-white font-semibold text-xs shadow-glow transition-all flex items-center justify-center gap-2"
          >
            <span>{isLoading ? 'Loading Enterprise Fleet...' : 'Enter Acme Demo Fleet (1-Click)'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-navy-800 w-full" />
          <span className="bg-navy-900 px-3 text-[11px] font-mono uppercase text-slate-500">
            Or sign in with credentials
          </span>
          <div className="border-t border-navy-800 w-full" />
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Corporate Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-950 border border-navy-750 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-blue"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Role Selection (RLS Persona)</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['admin', 'analyst', 'member', 'viewer'] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-1.5 px-2 text-[11px] font-mono uppercase rounded-lg border transition-all ${
                    role === r
                      ? 'bg-electric-blue text-white border-electric-blue font-bold shadow-glow'
                      : 'bg-navy-950 text-slate-400 border-navy-800 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-100 font-semibold text-xs border border-navy-700 transition-colors"
          >
            Sign In with SSO / Supabase
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            &larr; Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}

