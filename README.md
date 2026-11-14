# NEXORA AI &bull; Enterprise AI Readiness & Intelligence Platform

> **Tagline:** Make every enterprise AI-ready, intelligent and efficient.  
> **Mission:** One unified platform that finds, measures, explains, and remediates the barriers to enterprise AI adoption—turning diagnostics into an actionable roadmap and human-governed remediation tasks.

---

## 🏆 Hackathon Context & Overview
In a corporate landscape where over 80% of enterprise AI initiatives fail or stall in proof-of-concept, NEXORA AI provides executive transparency, data hygiene verification, cloud cost optimization, and shadow AI governance.

### 🌟 Key Product Highlights
- **Deterministic Scoring Engine:** Mathematical 0–100 readiness index with 6 weighted sub-scores, dynamic renormalization for missing categories, and a *"Why this score?"* audit drawer.
- **18/18 Problem Coverage Matrix:** Complete proof page detecting and remediating all 18 enterprise challenges.
- **AI Data Quality Analyzer & Silo Mapper:** Ingests CSV/XLSX, flags missing cells, duplicate rows, IQR outliers, and casing variants. Generates an RFC-compliant cleaned CSV export without mutating original storage. Maps departmental silos into a canonical schema.
- **Honest 3-Source Infrastructure Telemetry:** Seamlessly switch between real Browser W3C metrics (`hardwareConcurrency`, `deviceMemory`), a live Python host daemon (`nexora_agent.py`), and a simulated enterprise fleet.
- **Real Network Path & Speed Diagnostics:** Live HTTP/2 ping tests measuring median latency and jitter with clear honesty disclosures.
- **Compute & Cost Optimizer + Digital Twin:** Pinpoints over-provisioned cloud instances, provides interactive savings sliders, and calculates enterprise AI payback periods.
- **Enterprise Knowledge Assistant (RAG):** Verifiable document Q&A with exact PDF page citations and anti-hallucination guardrails.
- **Security & Shadow AI Governance:** Automated PII entity scanner (emails, phone numbers), shadow AI registry, and alignment with NIST AI RMF, ISO 42001, and EU AI Act.
- **4-Minute Judge Tour Widget:** Guided walkthrough overlay with a synchronized countdown timer and step highlights.

---

## 🛠 Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS + Lucide React + Recharts + Framer Motion.
- **Backend:** Next.js Route Handlers (Serverless) with strict Zod payload validation.
- **Database & Storage:** Supabase (Postgres, Row Level Security, Storage Buckets, Realtime).
- **AI & Retrieval:** Google Gemini API via official `@google/genai` SDK + deterministic TypeScript BM25 retrieval ranker fallback.
- **Host Telemetry Agent:** Single-file Python script (`agent/nexora_agent.py`) leveraging `psutil` and `requests`.
- **Testing:** Node.js native test runner & Vitest.

---

## 🚀 Quickstart & Setup Guide

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/nexora-ai.git
cd nexora-ai
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-1.5-flash
AGENT_TOKEN_SALT=acme_agent_live_token_2026
```
*(Note: NEXORA AI includes an out-of-the-box in-memory Demo Store with pre-seeded Acme Manufacturing data, allowing instant evaluation even before connecting Supabase or Gemini keys).*

### 3. Run Database Migrations (Supabase)
Apply the initial schema and seed data:
```bash
# Run migration
supabase db push
# Or execute migrations in Supabase SQL Editor:
# supabase/migrations/20261114000001_initial_schema.sql
# supabase/seed.sql
```

### 4. Run Unit Tests
```bash
npm test
```
All 11 unit tests across scoring, data quality, and BM25 retrieval will execute.

### 5. Launch the Platform
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤖 Running the NEXORA Host Agent (Optional)
To stream live host metrics (CPU, RAM, Disk, GPU):
```bash
pip install psutil requests
python agent/nexora_agent.py --server http://localhost:3000 --interval 5
```

---

## ⚖️ Honesty & Verification Standards
- **Source Tags:** Every statistic carries an audited badge: `[Measured]`, `[User-entered]`, `[Uploaded-data]`, or `[Simulated]`.
- **Network Honesty:** Explicit diagnostic notice: *"Measures this device's path to NEXORA, not your whole enterprise network."*
- **Legal Compliance:** Platform uses accurate legal language (*"aligned with"* and *"supports"* frameworks, never *"certified"*).
- **Projections:** Financial cost savings and ROI figures are clearly branded as projections.

