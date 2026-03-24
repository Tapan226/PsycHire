/**
 * StatusLifecycleDropdown — Granular status transition dropdown
 * for CompanyDashboard listing cards. Each module has its own
 * valid status lifecycle; this component enforces allowed transitions.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Circle,
  ArrowRight,
} from 'lucide-react';

/* ═══════════════════════════════════════
   Status Types & Config
   ═══════════════════════════════════════ */

export type ListingStatus =
  | 'draft'
  | 'pending_review'
  | 'active'
  | 'paused'
  | 'closed'
  | 'rejected'
  | 'changes_requested'
  | 'expired';

type ModuleType = 'jobs' | 'projects' | 'courses' | 'events' | 'supervision' | 'mentoring';

const STATUS_DISPLAY: Record<ListingStatus, { label: string; dot: string; bg: string; text: string }> = {
  draft:             { label: 'Draft',           dot: 'bg-gray-400',   bg: 'bg-gray-100',   text: 'text-gray-700' },
  pending_review:    { label: 'Under Review',    dot: 'bg-amber-500',  bg: 'bg-amber-100',  text: 'text-amber-800' },
  active:            { label: 'Active',          dot: 'bg-emerald-500',bg: 'bg-emerald-100', text: 'text-emerald-800' },
  paused:            { label: 'Paused',          dot: 'bg-blue-400',   bg: 'bg-blue-100',   text: 'text-blue-700' },
  closed:            { label: 'Closed',          dot: 'bg-gray-400',   bg: 'bg-gray-100',   text: 'text-gray-600' },
  rejected:          { label: 'Rejected',        dot: 'bg-red-500',    bg: 'bg-red-100',    text: 'text-red-800' },
  changes_requested: { label: 'Changes Needed',  dot: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-800' },
  expired:           { label: 'Expired',         dot: 'bg-gray-400',   bg: 'bg-gray-100',   text: 'text-gray-500' },
};

/** Which statuses can transition to which, per module */
const TRANSITIONS: Record<ModuleType, Record<string, ListingStatus[]>> = {
  jobs: {
    draft:             ['pending_review'],
    pending_review:    [],
    active:            ['paused', 'closed'],
    paused:            ['active', 'closed'],
    closed:            [],
    rejected:          ['draft'],
    changes_requested: ['pending_review'],
    expired:           ['draft'],
  },
  projects: {
    draft:             ['pending_review'],
    pending_review:    [],
    active:            ['paused', 'closed'],
    paused:            ['active', 'closed'],
    closed:            [],
    rejected:          ['draft'],
    changes_requested: ['pending_review'],
    expired:           ['draft'],
  },
  courses: {
    draft:             ['pending_review'],
    pending_review:    [],
    active:            ['paused', 'closed'],
    paused:            ['active', 'closed'],
    closed:            [],
    rejected:          ['draft'],
    changes_requested: ['pending_review'],
    expired:           ['draft'],
  },
  events: {
    draft:             ['pending_review'],
    pending_review:    [],
    active:            ['paused', 'closed'],
    paused:            ['active', 'closed'],
    closed:            [],
    rejected:          ['draft'],
    changes_requested: ['pending_review'],
    expired:           ['draft'],
  },
  supervision: {
    draft:             ['pending_review'],
    pending_review:    [],
    active:            ['paused', 'closed'],
    paused:            ['active', 'closed'],
    closed:            [],
    rejected:          ['draft'],
    changes_requested: ['pending_review'],
    expired:           ['draft'],
  },
  mentoring: {
    draft:             ['pending_review'],
    pending_review:    [],
    active:            ['paused', 'closed'],
    paused:            ['active', 'closed'],
    closed:            [],
    rejected:          ['draft'],
    changes_requested: ['pending_review'],
    expired:           ['draft'],
  },
};

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */

interface StatusLifecycleDropdownProps {
  currentStatus: ListingStatus;
  moduleType: ModuleType;
  onStatusChange: (newStatus: ListingStatus) => void;
  compact?: boolean;
}

export function StatusLifecycleDropdown({
  currentStatus,
  moduleType,
  onStatusChange,
  compact = false,
}: StatusLifecycleDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const display = STATUS_DISPLAY[currentStatus] || STATUS_DISPLAY.draft;
  const allowed = TRANSITIONS[moduleType]?.[currentStatus] || [];
  const hasTransitions = allowed.length > 0;

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); if (hasTransitions) setIsOpen(!isOpen); }}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all ${display.bg} ${display.text} ${
          hasTransitions ? 'cursor-pointer hover:opacity-80' : 'cursor-default'
        }`}
        style={{ fontSize: compact ? 10 : 11, fontWeight: 700 }}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${display.dot}`} />
        {display.label}
        {hasTransitions && (
          <ChevronDown size={10} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-200 shadow-xl z-40 py-1.5 animate-fade-in">
            <div className="px-3 py-1.5 border-b border-gray-100">
              <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Change status to
              </p>
            </div>
            {allowed.map(status => {
              const st = STATUS_DISPLAY[status];
              return (
                <button
                  key={status}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  <span className={`w-2 h-2 rounded-full ${st.dot}`} />
                  {st.label}
                  <ArrowRight size={10} className="ml-auto text-gray-300" />
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
