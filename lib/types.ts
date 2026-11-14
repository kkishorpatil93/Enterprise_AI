export type SourceTag = 'Measured' | 'User-entered' | 'Uploaded-data' | 'Simulated';

export type ProblemCategory =
  | 'Infrastructure'
  | 'Data'
  | 'Financial/Operational'
  | 'Security/Governance'
  | 'Business Scenario';

export interface EnterpriseProblem {
  id: number;
  category: ProblemCategory;
  name: string;
  shortDescription: string;
  detectedByModule: string;
  moduleRoute: string;
  currentStatus: 'Critical' | 'Warning' | 'Optimal' | 'Unassessed';
  measuredValue?: string;
  sourceTag: SourceTag;
  linkedRecommendation: string;
  linkedTaskId?: string;
}

export interface SubScores {
  infrastructure?: number;
  dataQuality?: number;
  networkStorage?: number;
  computeCost?: number;
  securityGovernance?: number;
  skillsStrategy?: number;
}

export interface ScoreWeights {
  infrastructure: number;
  dataQuality: number;
  networkStorage: number;
  computeCost: number;
  securityGovernance: number;
  skillsStrategy: number;
}

export type ReadinessTier = 'AI Ready' | 'Needs Improvement' | 'Significant Gaps' | 'Not Ready';

export interface SubScoreFactor {
  name: string;
  impactPts: number;
  reason: string;
  source: SourceTag;
}

export interface SubScoreExplanation {
  subScore: number;
  weightAssigned: number;
  isAssessed: boolean;
  factors: SubScoreFactor[];
  strengths: string[];
  improvements: string[];
}

export interface AssessmentResult {
  overallScore: number;
  tier: ReadinessTier;
  confidenceScore: number;
  assessedCount: number;
  totalCategories: number;
  subScores: SubScores;
  weights: ScoreWeights;
  explanations: Record<keyof SubScores, SubScoreExplanation>;
  calculatedAt: string;
}

export interface DataColumnIssue {
  column: string;
  missingCount: number;
  missingPct: number;
  duplicateCount: number;
  invalidFormatCount: number;
  formatType?: string;
  outlierCount: number;
  casingVariants: string[];
  inferredType: string;
}

export interface DataCleaningAction {
  id: string;
  title: string;
  column: string;
  description: string;
  impactScoreImprovement: number;
  applied: boolean;
}

export interface DataQualityReport {
  fileName: string;
  totalRows: number;
  totalCols: number;
  qualityScore: number;
  missingTotal: number;
  duplicateRows: number;
  formatErrorsTotal: number;
  outliersTotal: number;
  piiCount: number;
  columns: DataColumnIssue[];
  suggestedActions: DataCleaningAction[];
  cleanedDataSample?: Record<string, any>[];
  rawDataSample?: Record<string, any>[];
}

export interface DataSiloSource {
  id: string;
  name: string;
  department: string;
  format: 'CSV' | 'Excel' | 'PDF' | 'SQL Database' | 'Legacy ERP' | 'REST API';
  estimatedVolumeMb: number;
  updateFrequency: 'Realtime' | 'Daily' | 'Weekly' | 'Manual Batch';
  hasStandardSchema: boolean;
}

export interface HostMetrics {
  cpu?: number;
  cpuUsage?: number;
  ram?: number;
  ramUsage?: number;
  ramTotalGb?: number;
  disk?: number;
  diskUsage?: number;
  diskTotalGb?: number;
  gpu?: number | null;
  gpuUsage?: number | null;
  gpuName?: string;
  recordedAt?: string;
  timestamp?: string;
  source: 'browser' | 'agent' | 'simulated';
  host?: string;
  hostName?: string;
}

export interface NetworkDiagnostics {
  pingMedianMs: number;
  pingJitterMs: number;
  downloadMbps: number;
  uploadMbps: number;
  storageEstimateMb: number;
  storageQuotaMb: number;
  testedAt: string;
  pathIntegrity: 'Optimal' | 'Warning' | 'Degraded';
}

export interface ComputeInstance {
  id: string;
  name: string;
  department: string;
  vCpu: number;
  ramGb: number;
  gpuCount: number;
  hourlyRate: number;
  currentCpuAvgPct: number;
  currentRamAvgPct: number;
  status: 'Underutilized' | 'Optimal' | 'Overloaded';
  suggestedInstance: string;
  monthlySavings: number;
}

export interface DocumentChunk {
  id: string;
  documentName: string;
  page: number;
  content: string;
  department: string;
  relevanceScore?: number;
}

export interface PiiMatch {
  type: 'Email' | 'Phone' | 'SSN / National ID' | 'Credit Card' | 'Full Name Column';
  column: string;
  snippet: string;
  rowIndex: number;
}

export interface GovernanceChecklist {
  id: string;
  framework: 'NIST AI RMF' | 'ISO 42001' | 'EU AI Act' | 'Internal RBAC';
  name: string;
  status: 'Aligned' | 'Supports' | 'Pending';
  lastAudited: string;
  auditor: string;
}

export interface AiRegistryItem {
  id: string;
  tool: string;
  owner: string;
  department: string;
  dataSensitivity: 'public' | 'internal' | 'confidential' | 'restricted';
  approved: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  useCase: string;
  monthlyCost: number;
}

export interface RemediationTask {
  id: string;
  title: string;
  description: string;
  problemId: number;
  department: 'Data' | 'IT' | 'Security' | 'Infrastructure' | 'Executive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'todo' | 'in_progress' | 'done';
  dueDate: string;
  approved: boolean;
  assignedTo?: string;
  createdAt: string;
  sourceFinding: string;
}

export interface RoadmapItem {
  id: string;
  horizon: 'Immediate (0-30 Days)' | 'Medium-term (1-6 Months)' | 'Long-term (6-18 Months)';
  problemId: number;
  title: string;
  solution: string;
  priority: 'critical' | 'high' | 'medium';
  effort: 'Low' | 'Medium' | 'High';
  expectedBenefit: string;
  responsibleDepartment: string;
  targetDate: string;
  linkedTaskId?: string;
}

export interface AuthUser {
  email: string;
  role: 'admin' | 'analyst' | 'member' | 'viewer';
  name?: string;
  organization?: string;
  isAuthenticated: boolean;
}
