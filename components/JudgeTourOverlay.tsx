'use client';

import React, { useEffect, useState } from 'react';
import { useNexoraStore } from '@/lib/store';
import { useRouter, usePathname } from 'next/navigation';
import {
  Trophy,
  X,
  ChevronRight,
  ChevronLeft,
  Clock,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface TourStep {
  step: number;
  title: string;
  route: string;
  headline: string;
  demoAction: string;
  keyProblemsHighlighted: string;
  judgeTakeaway: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    step: 1,
    title: 'Executive Readiness Overview',
    route: '/dashboard',
    headline: 'Deterministic Readiness Baseline (Score ~52)',
    demoAction: 'Look at the animated readiness gauge (52.4), 6 sub-scores, confidence score, and department heat-map.',
    keyProblemsHighlighted: 'Problem #9 (No AI Strategy), Problem #17 (Delayed Decisions), Problem #18 (No Centralised Insights)',
    judgeTakeaway: 'NEXORA produces an honest mathematical score rather than hallucinated AI promises.',
  },
  {
    step: 2,
    title: 'AI Data Quality & Silo Mapper',
    route: '/data',
    headline: 'Real Ingestion, Outliers & Schema Unification',
    demoAction: 'Click "Load Acme Messy Dataset", see missing values, duplicate detection, IQR outliers, and download the cleaned CSV.',
    keyProblemsHighlighted: 'Problem #5 (Poor Data Quality), Problem #6 (Disconnected Data Silos), Problem #7 (Complex Integration)',
    judgeTakeaway: 'The original data is never modified; cleaning rules generate instant RFC-compliant downloads and silo maps.',
  },
  {
    step: 3,
    title: 'Infrastructure & Real Network Path',
    route: '/infrastructure',
    headline: 'Honest 3-Source Telemetry (Browser, Agent, Fleet)',
    demoAction: 'Switch between Browser hardware, NEXORA Python Agent, and Simulated Fleet. Check latency and storage.',
    keyProblemsHighlighted: 'Problem #1 (Legacy Hardware), Problem #2 (Network Latency), Problem #3 (Storage Bottlenecks)',
    judgeTakeaway: 'Honesty rule strictly upheld: local browser measurements are never falsely branded as enterprise-wide fleets.',
  },
  {
    step: 4,
    title: 'Cost Optimizer & What-If Digital Twin',
    route: '/cost',
    headline: 'Eliminate $9,100/mo Idle Compute Waste',
    demoAction: 'Adjust right-sizing sliders to simulate downsizing 8 idle c5.2xlarge instances and calculate AI ROI.',
    keyProblemsHighlighted: 'Problem #4 (Compute Mismatch), Problem #8 (High Operating Costs)',
    judgeTakeaway: 'Projections are clearly labelled as projections, not guaranteed savings.',
  },
  {
    step: 5,
    title: 'Security, PII & Shadow AI Registry',
    route: '/governance',
    headline: 'PII Scrubbing & Shadow AI Registry',
    demoAction: 'Review 46 detected PII matches, check NIST/ISO framework alignment, and toggle approvals on unvetted AI tools.',
    keyProblemsHighlighted: 'Problem #11 (PII & Compliance Gaps), Problem #12 (Shadow AI Sprawl)',
    judgeTakeaway: 'Language rule followed: supports frameworks, never claims certified.',
  },
  {
    step: 6,
    title: 'Problem Coverage Matrix & Roadmap',
    route: '/coverage',
    headline: '18 of 18 Problems Formally Proven & Remediation Tasks',
    demoAction: 'View the 18-problem matrix showing detection module, live status, and jump to the 30-day Kanban task board.',
    keyProblemsHighlighted: 'Problems #13-#18 (Business Workflows & Governance)',
    judgeTakeaway: 'Every single hackathon requirement is fulfilled, proven, and operational.',
  },
];

export const JudgeTourOverlay: React.FC = () => {
  const {
    isJudgeTourActive,
    judgeTourStep,
    nextJudgeTourStep,
    prevJudgeTourStep,
    endJudgeTour,
  } = useNexoraStore();
  const router = useRouter();
  const pathname = usePathname();

  // 4-minute timer (240 seconds countdown)
  const [timeLeft, setTimeLeft] = useState<number>(240);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let timer: any;
    if (isJudgeTourActive && isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isJudgeTourActive, isRunning, timeLeft]);

  const currentStep = TOUR_STEPS[judgeTourStep - 1] || TOUR_STEPS[0];

  // Auto-navigate to the step route if user progresses
  const handleNavigate = (route: string) => {
    if (pathname !== route) {
      router.push(route);
    }
  };

  if (!isJudgeTourActive) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-lg bg-navy-900/95 border-2 border-electric-cyan rounded-2xl shadow-2xl backdrop-blur-xl p-5 text-white animate-fade-in">
      {/* Header with 4-min timer */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-electric-cyan/20 border border-electric-cyan/40 rounded-lg text-electric-cyan">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-electric-cyan flex items-center gap-1.5">
              4-Minute Judge Demo Tour
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-xs text-slate-400">
              Step {judgeTourStep} of {TOUR_STEPS.length}: {currentStep.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer pill */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-navy-950 border border-navy-750 rounded-full font-mono text-xs text-amber-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedTime}</span>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="text-slate-400 hover:text-white ml-1"
            >
              {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          <button
            onClick={endJudgeTour}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="py-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white">{currentStep.headline}</h4>
          <button
            onClick={() => handleNavigate(currentStep.route)}
            className="text-xs text-electric-blue hover:underline flex items-center gap-1 font-mono"
          >
            Go to {currentStep.route}
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="p-2.5 rounded-xl bg-navy-950/70 border border-navy-800/80 text-xs space-y-1.5">
          <div className="text-slate-200">
            <strong className="text-electric-cyan">Demo Action:</strong> {currentStep.demoAction}
          </div>
          <div className="text-slate-400 text-[11px]">
            <strong className="text-slate-300">Problems Solved:</strong> {currentStep.keyProblemsHighlighted}
          </div>
          <div className="text-emerald-400 text-[11px] font-medium pt-1 border-t border-navy-900">
            <strong>Judge Takeaway:</strong> {currentStep.judgeTakeaway}
          </div>
        </div>
      </div>

      {/* Stepper Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-navy-800">
        <button
          onClick={prevJudgeTourStep}
          disabled={judgeTourStep === 1}
          className="px-3 py-1.5 text-xs text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1 bg-navy-800 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous
        </button>

        <div className="flex items-center gap-1">
          {TOUR_STEPS.map((s) => (
            <span
              key={s.step}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s.step === judgeTourStep
                  ? 'w-6 bg-electric-cyan'
                  : 'w-2 bg-navy-700'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (judgeTourStep < TOUR_STEPS.length) {
              nextJudgeTourStep();
              handleNavigate(TOUR_STEPS[judgeTourStep].route);
            } else {
              endJudgeTour();
            }
          }}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-electric-blue hover:bg-sky-500 rounded-lg flex items-center gap-1 shadow-glow transition-all"
        >
          {judgeTourStep === TOUR_STEPS.length ? 'Finish Tour' : 'Next Step'}
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

