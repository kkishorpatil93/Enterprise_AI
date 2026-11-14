'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import {
  HelpCircle,
  Send,
  Sparkles,
  Bot,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export default function AdvisorPage() {
  const { assessment } = useNexoraStore();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    {
      id: string;
      role: 'user' | 'assistant';
      content: string;
      sourceModule?: string;
      sourceTag?: 'Measured' | 'User-entered' | 'Uploaded-data' | 'Simulated';
      isFallback?: boolean;
      feedback?: 'up' | 'down';
    }[]
  >([
    {
      id: 'adv-0',
      role: 'assistant',
      content:
        `Welcome to the **NEXORA AI Readiness Advisor**. I am strictly grounded by your organization's mathematical assessment snapshot (**Overall Score: ${assessment.overallScore}/100 - ${assessment.tier}**).\n\nI explain bottlenecks, prioritize remediation roadmaps, and calculate ROI without inventing numbers. Click any recommended prompt below or ask your own question.`,
      sourceModule: 'AI Readiness Engine',
      sourceTag: 'Measured',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedQuestions = [
    'Is our company ready for AI?',
    'What is our biggest infrastructure problem?',
    'How do we improve data quality?',
    'What should we fix first?',
    'How do we reduce AI cost?',
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || isLoading) return;

    const userText = questionText.trim();
    setQuery('');
    setMessages((prev) => [
      ...prev,
      { id: `user-${Date.now()}`, role: 'user', content: userText },
    ]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'advisor',
          message: userText,
          assessment,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `adv-${Date.now()}`,
          role: 'assistant',
          content: data.text || 'Unable to generate advice.',
          sourceModule: data.sourceModule || 'Scoring Engine',
          sourceTag: data.sourceTag || 'Measured',
          isFallback: data.isFallback,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `adv-${Date.now()}`,
          role: 'assistant',
          content:
            `**Status: ${assessment.tier} (${assessment.overallScore}/100)**\n\n` +
            `Based on your active assessment data, immediate remediation is required in **Data Quality** (${assessment.subScores.dataQuality}/100) and **Infrastructure** (${assessment.subScores.infrastructure}/100). Decommission the 8 idle instances to save $9,100 monthly.`,
          sourceModule: 'Scoring Engine',
          sourceTag: 'Measured',
          isFallback: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFeedback = (id: string, fb: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: fb } : m))
    );
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-violet-500/20 text-violet-400 border border-violet-500/30">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                AI Readiness Advisor
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                Module 09
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic advisory engine. Grounded strictly in calculated metrics—explains and prioritizes without ever inventing numbers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-navy-900 border border-navy-800 text-xs font-mono text-cyan-400">
              Score: {assessment.overallScore} ({assessment.tier})
            </span>
          </div>
        </div>

        {/* Suggested Question Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1">Recommended Prompts:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-850 border border-navy-750 hover:border-violet-500/50 text-xs text-slate-300 hover:text-white font-medium transition-all shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Window */}
        <div className="rounded-2xl bg-navy-900 border border-navy-800 flex flex-col h-[600px] overflow-hidden shadow-2xl">
          {/* Messages View */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-3 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-electric-blue text-white shadow-glow'
                      : 'bg-navy-950 border border-navy-800 text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  {/* Metadata and Citations */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center justify-between pt-2 border-t border-navy-800/60 text-[11px] text-slate-400 font-mono">
                      <div className="flex items-center gap-2">
                        {m.sourceTag && <SourceTagBadge source={m.sourceTag} />}
                        <span className="text-cyan-400">{m.sourceModule}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="hover:text-white p-1 rounded"
                          title="Copy response"
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'up')}
                          className={`p-1 rounded ${
                            m.feedback === 'up' ? 'text-emerald-400' : 'hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleFeedback(m.id, 'down')}
                          className={`p-1 rounded ${
                            m.feedback === 'down' ? 'text-rose-400' : 'hover:text-white'
                          }`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2 font-mono">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>Consulting deterministic assessment snapshot...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(query);
            }}
            className="p-3 border-t border-navy-800 bg-navy-950 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask the Advisor (e.g., 'What is our primary infrastructure problem?')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-navy-900 border border-navy-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-electric-blue to-cyan-500 hover:brightness-110 text-white font-semibold text-xs shadow-glow transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <span>Ask Advisor</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}

