'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { useNexoraStore } from '@/lib/store';
import { SourceTagBadge } from '@/components/SourceTagBadge';
import { BM25Ranker } from '@/lib/retrieval';
import { DocumentChunk } from '@/lib/types';
import {
  Bot,
  Send,
  Upload,
  FileText,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Check,
  ShieldAlert,
} from 'lucide-react';

export default function KnowledgeAssistantPage() {
  const { documentChunks, addDocumentChunks } = useNexoraStore();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<
    {
      id: string;
      role: 'user' | 'assistant';
      content: string;
      citations?: { documentName: string; page: number; content: string }[];
      isFallback?: boolean;
      feedback?: 'up' | 'down';
    }[]
  >([
    {
      id: 'm1',
      role: 'assistant',
      content:
        'Hello! I am the NEXORA Enterprise Knowledge Assistant. Ask me anything about Acme Manufacturing Corp’s AI transformation strategy, factory telemetry, or infrastructure bottlenecks. My responses cite exact PDF page numbers and verbatim excerpts.',
      citations: [],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const departments = ['All', 'Executive', 'Data', 'Finance', 'Security', 'Operations'];

  const filteredChunks =
    selectedDept === 'All'
      ? documentChunks
      : documentChunks.filter((c) => c.department === selectedDept);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMsg = query.trim();
    setQuery('');

    const newMsgId = `msg-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      { id: newMsgId, role: 'user', content: userMsg },
    ]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'rag',
          message: userMsg,
          documentChunks: filteredChunks,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.text || 'I could not find this in the uploaded documents.',
          citations: data.citations || [],
          isFallback: data.isFallback,
        },
      ]);
    } catch (err) {
      // Local fallback using BM25 ranker
      const ranker = new BM25Ranker(filteredChunks);
      const matches = ranker.search(userMsg, 2, 0.7);

      if (matches.length > 0) {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            role: 'assistant',
            content: `Based on **${matches[0].documentName}** (Page ${matches[0].page}):\n\n"${matches[0].content}"`,
            citations: matches.map((m) => ({
              documentName: m.documentName,
              page: m.page,
              content: m.content,
            })),
            isFallback: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `asst-${Date.now()}`,
            role: 'assistant',
            content: 'I could not find this in the uploaded documents.',
            citations: [],
            isFallback: true,
          },
        ]);
      }
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
                <Bot className="w-5 h-5" />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Enterprise Knowledge Assistant (RAG)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
                Module 06
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic document synthesis with BM25 vector ranking. Strict boundary rules: answers using ONLY retrieved passages with exact PDF page citations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <SourceTagBadge source="Uploaded-data" />
          </div>
        </div>

        {/* Fallback Mode Informative Notice */}
        <div className="p-4 rounded-2xl bg-navy-900 border border-violet-500/30 flex items-start gap-3 shadow-lg">
          <Sparkles className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="text-xs font-bold text-white uppercase font-mono tracking-wider">
              Verifiable Retrieval &amp; Anti-Hallucination Policy
            </div>
            <p className="text-xs text-slate-300">
              When <code>GEMINI_API_KEY</code> is present, responses are synthesized with safety boundaries. Without a key, NEXORA falls back gracefully to verbatim passage retrieval with zero hallucinated facts.
            </p>
          </div>
        </div>

        {/* Chat & Document Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Chat Interface (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl bg-navy-900 border border-navy-800 flex flex-col h-[600px] overflow-hidden shadow-2xl">
            {/* Department Filter Bar */}
            <div className="p-3 border-b border-navy-800 bg-navy-950 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">RLS Department Filter:</span>
              <div className="flex items-center gap-1">
                {departments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDept(dept)}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                      selectedDept === dept
                        ? 'bg-violet-600 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-navy-850'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.role === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-electric-blue text-white shadow-glow'
                        : 'bg-navy-950 border border-navy-800 text-slate-200'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.content}</div>

                    {/* Citations Block */}
                    {m.citations && m.citations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-navy-800/80 space-y-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Source Citations ({m.citations.length})
                        </span>
                        {m.citations.map((c, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-navy-900 border border-navy-800 text-[11px] font-mono text-slate-300"
                          >
                            <div className="flex items-center justify-between text-cyan-300 font-semibold mb-1">
                              <span>{c.documentName}</span>
                              <span className="px-1.5 py-0.5 rounded bg-navy-950 border border-navy-750 text-[10px]">
                                Page {c.page}
                              </span>
                            </div>
                            <p className="text-slate-400 font-sans italic">&ldquo;{c.content}&rdquo;</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Assistant Message Actions: Copy & Thumbs */}
                    {m.role === 'assistant' && (
                      <div className="flex items-center justify-between pt-2 text-slate-400 text-[11px] border-t border-navy-800/40">
                        <span className="font-mono text-[10px]">
                          {m.isFallback ? 'Retrieval-Only Mode' : 'Gemini AI Synthesized'}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(m.id, m.content)}
                            className="hover:text-white p-1 rounded transition-colors"
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
                            className={`p-1 rounded transition-colors ${
                              m.feedback === 'up' ? 'text-emerald-400' : 'hover:text-white'
                            }`}
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleFeedback(m.id, 'down')}
                            className={`p-1 rounded transition-colors ${
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
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                  <span>Scanning indexed chunks with BM25 ranker...</span>
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-navy-800 bg-navy-950 flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g., 'What is our primary infrastructure problem in the strategy doc?'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-navy-900 border border-navy-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs transition-all shadow-glow flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Ask RAG</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Indexed Documents Panel (1 Col) */}
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-electric-cyan" />
                  Indexed Knowledge Documents
                </h3>
                <span className="text-xs font-mono text-cyan-400">
                  {documentChunks.length} Chunks
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Documents are chunked into 800-char passages with 100-char overlap and indexed with BM25.
              </p>

              <div className="space-y-2 pt-2">
                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Acme_Enterprise_AI_Strategy_2026.pdf</span>
                    <span className="text-[10px] font-mono text-cyan-400">3 Pages</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Executive Charter, legacy hardware count, and $28,400 cloud budget.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Acme_Security_Policy_v4.pdf</span>
                    <span className="text-[10px] font-mono text-cyan-400">1 Page</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans">
                    Acceptable AI usage policies and PII transmission prohibitions.
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Questions */}
            <div className="p-4 rounded-2xl bg-navy-900/80 border border-navy-800 space-y-2">
              <span className="text-xs uppercase font-mono text-slate-400">
                Suggested Verification Questions
              </span>
              <div className="space-y-1.5">
                {[
                  'What are the primary infrastructure bottlenecks in our 2026 charter?',
                  'How much is Acme spending monthly on cloud compute?',
                  'What is our policy on uploading PII into public AI models?',
                  'Is there any mention of quantum supersonic aerospace propulsion?',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(q)}
                    className="w-full text-left p-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-navy-850 border border-navy-800/60 transition-colors"
                  >
                    &ldquo;{q}&rdquo;
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

