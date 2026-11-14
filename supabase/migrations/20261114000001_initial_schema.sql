-- NEXORA AI Initial Database Schema with Row Level Security (RLS)
create extension if not exists pgcrypto;

-- 1. Organizations
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text default 'Manufacturing',
  plan text default 'enterprise',
  agent_token text default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz default now()
);

-- 2. Organization Members
create table if not exists members (
  org_id uuid references organizations on delete cascade,
  user_id uuid references auth.users on delete cascade,
  role text check (role in ('admin','analyst','member','viewer')) default 'member',
  department text default 'IT',
  primary key (org_id, user_id)
);

-- 3. Datasets & Quality Reports
create table if not exists datasets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations on delete cascade,
  name text not null,
  storage_path text,
  rows int default 0,
  cols int default 0,
  quality_score numeric default 0,
  report jsonb default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz default now()
);

-- 4. Infrastructure & Host Metrics
create table if not exists metrics (
  id bigserial primary key,
  org_id uuid references organizations on delete cascade,
  source text check (source in ('browser','agent','simulated')) not null,
  host text default 'localhost',
  cpu numeric default 0,
  ram numeric default 0,
  disk numeric default 0,
  gpu numeric,
  recorded_at timestamptz default now()
);

-- 5. Knowledge Documents
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations on delete cascade,
  name text not null,
  department text default 'General',
  storage_path text,
  file_size int default 0,
  created_at timestamptz default now()
);

-- 6. Document Chunks for Retrieval (RAG)
create table if not exists chunks (
  id bigserial primary key,
  document_id uuid references documents on delete cascade,
  org_id uuid references organizations on delete cascade,
  page int default 1,
  content text not null,
  created_at timestamptz default now()
);

-- 7. Enterprise Readiness Assessments
create table if not exists assessments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations on delete cascade,
  overall numeric not null,
  confidence numeric not null,
  scores jsonb not null,
  inputs jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 8. Governance Tasks & Findings Remediation
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations on delete cascade,
  title text not null,
  description text,
  problem_id int,
  department text default 'IT',
  priority text check (priority in ('low','medium','high','critical')) default 'medium',
  status text check (status in ('todo','in_progress','done')) default 'todo',
  due_date date,
  approved boolean default false,
  created_by uuid,
  created_at timestamptz default now()
);

-- 9. AI Usage Registry (Shadow AI Sprawl Prevention)
create table if not exists ai_registry (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references organizations on delete cascade,
  tool text not null,
  owner text not null,
  department text not null,
  data_sensitivity text check (data_sensitivity in ('public','internal','confidential','restricted')) default 'internal',
  approved boolean default false,
  risk_level text default 'medium',
  created_at timestamptz default now()
);

-- 10. Audit Log
create table if not exists audit_log (
  id bigserial primary key,
  org_id uuid references organizations on delete cascade,
  user_id uuid,
  action text not null,
  detail jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Indexes for performance
create index if not exists idx_metrics_org_recorded on metrics(org_id, recorded_at desc);
create index if not exists idx_tasks_org on tasks(org_id);
create index if not exists idx_chunks_org on chunks(org_id);
create index if not exists idx_chunks_doc on chunks(document_id);
create index if not exists idx_audit_org on audit_log(org_id, created_at desc);

-- GIN full-text index on chunks for fast text search
create index if not exists idx_chunks_content_search on chunks using gin (to_tsvector('english', content));

-- Row Level Security (RLS) Policies on EVERY table
alter table organizations enable row level security;
alter table members enable row level security;
alter table datasets enable row level security;
alter table metrics enable row level security;
alter table documents enable row level security;
alter table chunks enable row level security;
alter table assessments enable row level security;
alter table tasks enable row level security;
alter table ai_registry enable row level security;
alter table audit_log enable row level security;

-- Organizations policy
create policy "members read their org" on organizations for select
  using (id in (select org_id from members where user_id = auth.uid()));

-- Tasks RLS
create policy "org members read tasks" on tasks for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members write tasks" on tasks for all
  using (org_id in (select org_id from members where user_id = auth.uid()))
  with check (org_id in (select org_id from members where user_id = auth.uid()));

-- Datasets RLS
create policy "org members read datasets" on datasets for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members write datasets" on datasets for all
  using (org_id in (select org_id from members where user_id = auth.uid()))
  with check (org_id in (select org_id from members where user_id = auth.uid()));

-- Metrics RLS
create policy "org members read metrics" on metrics for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members insert metrics" on metrics for insert
  with check (org_id in (select org_id from members where user_id = auth.uid()));

-- Documents & Chunks RLS
create policy "org members read documents" on documents for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members write documents" on documents for all
  using (org_id in (select org_id from members where user_id = auth.uid()));

create policy "org members read chunks" on chunks for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members write chunks" on chunks for all
  using (org_id in (select org_id from members where user_id = auth.uid()));

-- Assessments RLS
create policy "org members read assessments" on assessments for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members insert assessments" on assessments for insert
  with check (org_id in (select org_id from members where user_id = auth.uid()));

-- AI Registry RLS
create policy "org members read ai_registry" on ai_registry for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members write ai_registry" on ai_registry for all
  using (org_id in (select org_id from members where user_id = auth.uid()));

-- Audit Log RLS
create policy "org members read audit_log" on audit_log for select
  using (org_id in (select org_id from members where user_id = auth.uid()));
create policy "org members insert audit_log" on audit_log for insert
  with check (org_id in (select org_id from members where user_id = auth.uid()));

