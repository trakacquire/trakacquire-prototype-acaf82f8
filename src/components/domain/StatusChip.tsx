import React from 'react';
import { EventStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface StatusChipProps {
  status: EventStatus;
  className?: string;
}

export function StatusChip({ status, className }: StatusChipProps) {
  const getStyles = (status: EventStatus) => {
    switch (status) {
      case 'Captured':
      case 'Linked':
        return 'bg-proof-blue/10 text-proof-blue border-proof-blue/20';
      case 'Confirmed':
      case 'Reconciled':
        return 'bg-verified/10 text-verified border-verified/20';
      case 'Divergent':
      case 'Stale':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Failed':
      case 'Orphan':
      case 'Policy blocked':
        return 'bg-critical/10 text-critical border-critical/20';
      case 'Sandbox':
        return 'bg-proof-blue/8 text-proof-blue/90 border-proof-blue/25';
      case 'Synthetic':
        return 'bg-stone/10 text-stone border-stone/20';
      default:
        return 'bg-zinc text-stone border-line';
    }
  };

  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-[6px] border text-11 font-medium whitespace-nowrap', getStyles(status), className)}>
      {status === 'Policy blocked' && <Lock className="w-3 h-3 mr-1" />}
      {status}
      {status === 'Orphan' && <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-critical animate-pulse" />}
    </span>
  );
}