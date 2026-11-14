# Architecture & Product Decisions (DECISIONS.md)

### NEXORA AI - Enterprise AI Readiness & Intelligence Platform

| Decision ID | Area | Decision Taken | Rationale |
|---|---|---|---|
| **DEC-001** | Stack Architecture | Next.js 14 App Router + TypeScript + Tailwind CSS | Unified serverless full-stack runtime with high developer velocity, type-safe route handlers, and zero configuration deployment on Vercel. |
| **DEC-002** | Theme & Design System | Dark Navy base (`#070B1A`), Electric Blue/Cyan accents, Violet AI glow, 8px grid | Matches high-end enterprise observability platforms (Palantir, Datadog) while highlighting AI-first features with soft glows and clean typography. |
| **DEC-003** | Honest Data Sourcing | Every statistic strictly tagged with `[Measured]`, `[User-entered]`, `[Uploaded-data]`, or `[Simulated]` | Non-negotiable honesty rule: no fabricated measurements, no claiming browser benchmarks are company-wide fleets. Transparent trust wins enterprise buyers and hackathon judges. |
| **DEC-004** | Dual Storage Strategy | Supabase Postgres + RLS with automatic in-memory Demo Store fallback | Allows instant zero-config evaluation for judges with "Acme Manufacturing" data even before Supabase environment variables are connected, while full Supabase integration activates immediately when keys are present. |
| **DEC-005** | Deterministic Scoring | Pure mathematical scoring engine (`lib/scoring.ts`) with documented penalties and sub-score weights | AI never invents readiness scores. Gemini only synthesizes and explains deterministic metrics from the scoring engine. |
| **DEC-006** | AI Generation Fallback | Graceful fallback when `GEMINI_API_KEY` is not set | System renders an informative banner `"AI generation unavailable - showing retrieved passages"` and provides rule-based recommendations and BM25 search results without crashing. |
| **DEC-007** | RAG Document Processing | Client/server-side chunking (800 chars, 100 overlap) + BM25/TF-IDF ranker + citation locator | Delivers exact PDF page numbers, document names, and snippet quotes with zero hallucination. |
| **DEC-008** | Task Lifecycle Governance | Findings can be turned into tasks with auto-department routing, but require Human Approval before entering Todo | Adheres to enterprise governance best practices: recommendations do not mutate workflow without explicit human sign-off. |
| **DEC-009** | Lightweight Python Agent | Single-file script `agent/nexora_agent.py` using `psutil` + `requests` | Ultra-lightweight host daemon pushing real CPU/RAM/Disk metrics to `/api/agent/metrics` with org token authentication. |
| **DEC-010** | 4-Minute Judge Tour | Interactive automated overlay with timer, step highlight, and narration | Guaranteed to guide judges through the 4-minute demo effortlessly, showcasing all 18 solved enterprise problems. |

