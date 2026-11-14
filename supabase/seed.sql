-- NEXORA AI Demo Seed Data: Acme Manufacturing (Score ~52)
-- Organization
insert into organizations (id, name, industry, plan, agent_token)
values (
  '11111111-1111-1111-1111-111111111111',
  'Acme Manufacturing Corp',
  'Industrial & Discrete Manufacturing',
  'enterprise',
  'acme_agent_live_token_2026'
) on conflict do nothing;

-- Assessments Seed (Score: 52.4 - Significant Gaps)
insert into assessments (id, org_id, overall, confidence, scores, inputs)
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  52.4,
  100.0,
  jsonb_build_object(
    'infrastructure', 48.0,
    'dataQuality', 42.0,
    'networkStorage', 68.0,
    'computeCost', 55.0,
    'securityGovernance', 46.0,
    'skillsStrategy', 54.0
  ),
  jsonb_build_object(
    'companyName', 'Acme Manufacturing Corp',
    'totalServers', 42,
    'legacyServers', 26,
    'monthlySpend', 28400,
    'projectedSavings', 9100,
    'dataQualityPct', 58.4,
    'detectedPiiCount', 184,
    'unapprovedAiTools', 7
  )
) on conflict do nothing;

-- Datasets Seed
insert into datasets (id, org_id, name, storage_path, rows, cols, quality_score, report)
values (
  '33333333-3333-3333-3333-333333333333',
  '11111111-1111-1111-1111-111111111111',
  'acme_factory_telemetry_messy.csv',
  'datasets/acme_factory_telemetry_messy.csv',
  2450,
  14,
  42.0,
  jsonb_build_object(
    'missingValues', 312,
    'duplicateRows', 84,
    'formatErrors', 128,
    'outliers', 92,
    'piiExposures', 46,
    'columnsWithIssues', array['equipment_id', 'sensor_reading_temp', 'operator_email', 'calibrated_date', 'operating_voltage']
  )
) on conflict do nothing;

-- Tasks Seed
insert into tasks (id, org_id, title, description, problem_id, department, priority, status, due_date, approved)
values
  ('44444444-4444-4444-4444-444444440001', '11111111-1111-1111-1111-111111111111', 'Remediate unmasked operator PII in factory CSV', 'Found 46 unmasked personal emails and phone records in open S3 bucket telemetry files.', 11, 'Security', 'critical', 'todo', '2026-11-20', true),
  ('44444444-4444-4444-4444-444444440002', '11111111-1111-1111-1111-111111111111', 'Decommission 8 idle compute instances in us-east-2', 'Identified 8 c5.2xlarge instances with <4% CPU average utilization over 30 days.', 4, 'Infrastructure', 'high', 'in_progress', '2026-11-25', true),
  ('44444444-4444-4444-4444-444444440003', '11111111-1111-1111-1111-111111111111', 'Unify ERP & Maintenance DB schemas via pipeline', 'Eliminate manual weekly Excel extracts between Plant Operations and SAP ERP.', 6, 'Data', 'high', 'todo', '2026-12-05', false),
  ('44444444-4444-4444-4444-444444440004', '11111111-1111-1111-1111-111111111111', 'Establish AI Usage Policy & approve vetted LLM gateway', '7 departments currently using unvetted consumer generative AI accounts with company data.', 12, 'Security', 'critical', 'in_progress', '2026-11-18', true),
  ('44444444-4444-4444-4444-444444440005', '11111111-1111-1111-1111-111111111111', 'Deploy edge inference cluster for QA camera vision', 'Replace 2014 legacy IPCs with modern TensorRT-accelerated edge nodes on assembly lines.', 1, 'Infrastructure', 'medium', 'done', '2026-11-10', true)
on conflict do nothing;

-- AI Registry Seed
insert into ai_registry (id, org_id, tool, owner, department, data_sensitivity, approved, risk_level)
values
  ('55555555-5555-5555-5555-555555550001', '11111111-1111-1111-1111-111111111111', 'Public ChatGPT 4o Free', 'Plant Supervisor (Tom B.)', 'Operations', 'confidential', false, 'high'),
  ('55555555-5555-5555-5555-555555550002', '11111111-1111-1111-1111-111111111111', 'GitHub Copilot Enterprise', 'Lead Architect (Sarah K.)', 'Engineering', 'internal', true, 'low'),
  ('55555555-5555-5555-5555-555555550003', '11111111-1111-1111-1111-111111111111', 'Claude Pro Personal Account', 'Financial Analyst (Dev M.)', 'Finance', 'restricted', false, 'high'),
  ('55555555-5555-5555-5555-555555550004', '11111111-1111-1111-1111-111111111111', 'Midjourney v6', 'Design Lead (Chloe R.)', 'Marketing', 'public', true, 'low')
on conflict do nothing;

-- Documents & Chunks Seed
insert into documents (id, org_id, name, department, storage_path, file_size)
values (
  '66666666-6666-6666-6666-666666660001',
  '11111111-1111-1111-1111-111111111111',
  'Acme_Enterprise_AI_Strategy_2026.pdf',
  'Executive Strategy',
  'documents/Acme_Enterprise_AI_Strategy_2026.pdf',
  245000
) on conflict do nothing;

insert into chunks (document_id, org_id, page, content)
values
  ('66666666-6666-6666-6666-666666660001', '11111111-1111-1111-1111-111111111111', 1, 'Acme Manufacturing Corp: Executive AI Transformation Charter (Page 1). Our 2026 strategic objective is to modernize discrete assembly line operations with automated optical inspection and predictive maintenance. Current infrastructure bottlenecks include 26 legacy on-prem servers running Windows Server 2012 with insufficient GPU acceleration.'),
  ('66666666-6666-6666-6666-666666660001', '11111111-1111-1111-1111-111111111111', 2, 'Data Governance & Silos (Page 2). Plant telemetry data is currently fragmented across 4 separate factory networks and saved into inconsistent local CSV files. Missing sensor timestamps occur in approximately 12.7% of log records. Centralizing telemetry into a unified lakehouse is required before fine-tuning vision models.'),
  ('66666666-6666-6666-6666-666666660001', '11111111-1111-1111-1111-111111111111', 3, 'Cost Optimization & Right-Sizing (Page 3). The current cloud compute budget is $28,400 monthly. 8 underutilized instances in us-east-2 account for approximately $9,100 in idle waste. Implementing scheduled off-peak hibernation and spot GPU instances is projected to reduce AI inference costs by 32%.')
on conflict do nothing;

