'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AssessmentResult,
  SubScores,
  RemediationTask,
  AiRegistryItem,
  DocumentChunk,
  DataQualityReport,
  EnterpriseProblem,
  RoadmapItem,
  AuthUser,
} from './types';
import { supabase, isSupabaseConfigured } from './supabase';
import {
  ALL_18_PROBLEMS,
  INITIAL_ASSESSMENT,
  ACME_SUB_SCORES,
  INITIAL_TASKS,
  INITIAL_AI_REGISTRY,
  INITIAL_DOCUMENTS_CHUNKS,
  INITIAL_ROADMAP,
  SAMPLE_MESSY_CSV_CONTENT,
} from './demoData';
import { calculateReadinessScore } from './scoring';
import { analyzeDatasetQuality } from './dataQuality';
import Papa from 'papaparse';

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'critical' | 'warning' | 'info';
  read: boolean;
}

interface NexoraStoreContextType {
  // Assessment
  assessment: AssessmentResult;
  subScores: SubScores;
  updateSubScore: (category: keyof SubScores, value: number) => void;
  resetToAcmeDemo: () => void;

  // Problems
  problems: EnterpriseProblem[];

  // Tasks
  tasks: RemediationTask[];
  approveTask: (taskId: string) => void;
  moveTaskStatus: (taskId: string, newStatus: RemediationTask['status']) => void;
  createTaskFromFinding: (task: Omit<RemediationTask, 'id' | 'createdAt'>) => void;

  // Data Quality
  activeDatasetReport: DataQualityReport | null;
  setActiveDatasetReport: (report: DataQualityReport | null) => void;
  loadSampleMessyCsv: () => void;

  // AI Registry
  aiRegistry: AiRegistryItem[];
  toggleAiApproval: (id: string) => void;
  addAiRegistryItem: (item: Omit<AiRegistryItem, 'id'>) => void;

  // Documents & RAG
  documentChunks: DocumentChunk[];
  addDocumentChunks: (chunks: DocumentChunk[]) => void;

  // Roadmap
  roadmap: RoadmapItem[];

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;

  // Judge Tour
  isJudgeTourActive: boolean;
  judgeTourStep: number;
  startJudgeTour: () => void;
  nextJudgeTourStep: () => void;
  prevJudgeTourStep: () => void;
  endJudgeTour: () => void;

  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Authentication & Session
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (email: string, role: AuthUser['role'], rememberMe?: boolean) => void;
  logout: () => Promise<void>;
}

const NexoraStoreContext = createContext<NexoraStoreContextType | null>(null);

export function NexoraStoreProvider({ children }: { children: React.ReactNode }) {
  const [subScores, setSubScores] = useState<SubScores>(ACME_SUB_SCORES);
  const [assessment, setAssessment] = useState<AssessmentResult>(INITIAL_ASSESSMENT);
  const [problems] = useState<EnterpriseProblem[]>(ALL_18_PROBLEMS);
  const [tasks, setTasks] = useState<RemediationTask[]>(INITIAL_TASKS);
  const [aiRegistry, setAiRegistry] = useState<AiRegistryItem[]>(INITIAL_AI_REGISTRY);
  const [documentChunks, setDocumentChunks] = useState<DocumentChunk[]>(INITIAL_DOCUMENTS_CHUNKS);
  const [roadmap] = useState<RoadmapItem[]>(INITIAL_ROADMAP);
  const [activeDatasetReport, setActiveDatasetReport] = useState<DataQualityReport | null>(null);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Authentication & Session State
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Judge Tour State
  const [isJudgeTourActive, setIsJudgeTourActive] = useState<boolean>(false);
  const [judgeTourStep, setJudgeTourStep] = useState<number>(1);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Critical PII Exposure Detected',
      description: '46 unmasked phone numbers and emails found in telemetry dataset.',
      time: '12m ago',
      type: 'critical',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Idle Cloud Compute Waste',
      description: '8 instances in us-east-2 idle for >720 hours.',
      time: '1h ago',
      type: 'warning',
      read: false,
    },
    {
      id: 'notif-3',
      title: 'Unapproved AI Tool Reported',
      description: 'Consumer ChatGPT usage detected on engineering assembly IP.',
      time: '3h ago',
      type: 'warning',
      read: false,
    },
  ]);

  // Recalculate assessment whenever subScores change
  useEffect(() => {
    setAssessment(calculateReadinessScore(subScores));
  }, [subScores]);

  // Theme application
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  // Pre-load messy sample CSV into active report
  useEffect(() => {
    const parsed = Papa.parse(SAMPLE_MESSY_CSV_CONTENT, { header: true, skipEmptyLines: true });
    if (parsed.data && parsed.data.length > 0) {
      const report = analyzeDatasetQuality('acme_factory_telemetry_messy.csv', parsed.data as Record<string, any>[]);
      setActiveDatasetReport(report);
    }
  }, []);

  // Authentication session initialization & sync
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return;

      // 1. Check local session (persistent or session-only) FIRST
      try {
        const savedSession =
          localStorage.getItem('nexora_auth_session') ||
          sessionStorage.getItem('nexora_auth_session');

        if (savedSession) {
          const parsed: AuthUser = JSON.parse(savedSession);
          if (parsed && parsed.email) {
            setUser(parsed);
            setIsAuthenticated(true);
            setIsAuthLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Error reading saved session:', err);
      }

      // 2. Check if explicitly logged out
      const isExplicitlyLoggedOut = localStorage.getItem('nexora_logged_out') === 'true';
      if (isExplicitlyLoggedOut) {
        setUser(null);
        setIsAuthenticated(false);
        setIsAuthLoading(false);
        return;
      }

      // 3. Check Supabase session if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const sbUser: AuthUser = {
              email: data.session.user.email || 'user@acmemfg.internal',
              role: (data.session.user.user_metadata?.role as any) || 'analyst',
              organization: 'Acme Manufacturing Corp',
              isAuthenticated: true,
            };
            setUser(sbUser);
            setIsAuthenticated(true);
            localStorage.setItem('nexora_auth_session', JSON.stringify(sbUser));
            setIsAuthLoading(false);
            return;
          }
        } catch (sbErr) {
          console.warn('Supabase getSession error:', sbErr);
        }
      }

      // 4. Unauthenticated default: new visitors must sign in
      setUser(null);
      setIsAuthenticated(false);
      setIsAuthLoading(false);
    };

    initAuth();

    // Listen to Supabase auth events
    if (isSupabaseConfigured && supabase) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const sbUser: AuthUser = {
            email: session.user.email || 'user@acmemfg.internal',
            role: (session.user.user_metadata?.role as any) || 'analyst',
            organization: 'Acme Manufacturing Corp',
            isAuthenticated: true,
          };
          setUser(sbUser);
          setIsAuthenticated(true);
          localStorage.setItem('nexora_auth_session', JSON.stringify(sbUser));
          localStorage.removeItem('nexora_logged_out');
        }
      });

      return () => {
        authListener?.subscription?.unsubscribe();
      };
    }
  }, []);

  const updateSubScore = (category: keyof SubScores, value: number) => {
    setSubScores((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const resetToAcmeDemo = () => {
    setSubScores(ACME_SUB_SCORES);
    setTasks(INITIAL_TASKS);
    setAiRegistry(INITIAL_AI_REGISTRY);
    const parsed = Papa.parse(SAMPLE_MESSY_CSV_CONTENT, { header: true, skipEmptyLines: true });
    if (parsed.data && parsed.data.length > 0) {
      const report = analyzeDatasetQuality('acme_factory_telemetry_messy.csv', parsed.data as Record<string, any>[]);
      setActiveDatasetReport(report);
    }
  };

  const approveTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, approved: true } : t))
    );
  };

  const moveTaskStatus = (taskId: string, newStatus: RemediationTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const createTaskFromFinding = (taskData: Omit<RemediationTask, 'id' | 'createdAt'>) => {
    const newTask: RemediationTask = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const loadSampleMessyCsv = () => {
    const parsed = Papa.parse(SAMPLE_MESSY_CSV_CONTENT, { header: true, skipEmptyLines: true });
    if (parsed.data && parsed.data.length > 0) {
      const report = analyzeDatasetQuality('acme_factory_telemetry_messy.csv', parsed.data as Record<string, any>[]);
      setActiveDatasetReport(report);
    }
  };

  const toggleAiApproval = (id: string) => {
    setAiRegistry((prev) =>
      prev.map((item) => (item.id === id ? { ...item, approved: !item.approved } : item))
    );
  };

  const addAiRegistryItem = (itemData: Omit<AiRegistryItem, 'id'>) => {
    const newItem: AiRegistryItem = {
      ...itemData,
      id: `ai-${Date.now()}`,
    };
    setAiRegistry((prev) => [newItem, ...prev]);
  };

  const addDocumentChunks = (chunks: DocumentChunk[]) => {
    setDocumentChunks((prev) => [...chunks, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const startJudgeTour = () => {
    setIsJudgeTourActive(true);
    setJudgeTourStep(1);
  };

  const nextJudgeTourStep = () => {
    setJudgeTourStep((prev) => Math.min(prev + 1, 6));
  };

  const prevJudgeTourStep = () => {
    setJudgeTourStep((prev) => Math.max(prev - 1, 1));
  };

  const endJudgeTour = () => {
    setIsJudgeTourActive(false);
  };

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const login = (email: string, role: AuthUser['role'], rememberMe: boolean = true) => {
    const newUser: AuthUser = {
      email,
      role,
      name: email.split('@')[0],
      organization: 'Acme Manufacturing Corp',
      isAuthenticated: true,
    };
    if (typeof window !== 'undefined') {
      if (rememberMe) {
        localStorage.setItem('nexora_auth_session', JSON.stringify(newUser));
        sessionStorage.removeItem('nexora_auth_session');
      } else {
        sessionStorage.setItem('nexora_auth_session', JSON.stringify(newUser));
        localStorage.removeItem('nexora_auth_session');
      }
      localStorage.removeItem('nexora_logged_out');
    }
    setUser(newUser);
    setIsAuthenticated(true);
    setIsAuthLoading(false);
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nexora_auth_session');
      sessionStorage.removeItem('nexora_auth_session');
      localStorage.setItem('nexora_logged_out', 'true');
      sessionStorage.clear();
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsAuthLoading(false);
  };

  return (
    <NexoraStoreContext.Provider
      value={{
        assessment,
        subScores,
        updateSubScore,
        resetToAcmeDemo,
        problems,
        tasks,
        approveTask,
        moveTaskStatus,
        createTaskFromFinding,
        activeDatasetReport,
        setActiveDatasetReport,
        loadSampleMessyCsv,
        aiRegistry,
        toggleAiApproval,
        addAiRegistryItem,
        documentChunks,
        addDocumentChunks,
        roadmap,
        notifications,
        markNotificationRead,
        isJudgeTourActive,
        judgeTourStep,
        startJudgeTour,
        nextJudgeTourStep,
        prevJudgeTourStep,
        endJudgeTour,
        isDark,
        toggleTheme,
        user,
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
      }}
    >
      {children}
    </NexoraStoreContext.Provider>
  );
}

export function useNexoraStore() {
  const context = useContext(NexoraStoreContext);
  if (!context) {
    throw new Error('useNexoraStore must be used within a NexoraStoreProvider');
  }
  return context;
}
