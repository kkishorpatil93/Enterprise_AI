import React from 'react';
import type { SourceTag } from '@/lib/types';
import { Activity, UserCheck, FileSpreadsheet, Cpu } from 'lucide-react';

interface SourceTagBadgeProps {
  source: SourceTag;
  className?: string;
  showIcon?: boolean;
}

export const SourceTagBadge: React.FC<SourceTagBadgeProps> = ({
  source,
  className = '',
  showIcon = true,
}) => {
  const getBadgeConfig = () => {
    switch (source) {
      case 'Measured':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          icon: Activity,
          label: 'Measured',
        };
      case 'User-entered':
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          dot: 'bg-sky-400',
          icon: UserCheck,
          label: 'User-entered',
        };
      case 'Uploaded-data':
        return {
          bg: 'bg-violet-500/10 border-violet-500/30 text-violet-400',
          dot: 'bg-violet-400',
          icon: FileSpreadsheet,
          label: 'Uploaded-data',
        };
      case 'Simulated':
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-400',
          icon: Cpu,
          label: 'Simulated',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <span
      title={`Data Origin: ${config.label} (Honesty verification tag)`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{config.label}</span>
    </span>
  );
};

