import React from 'react';
import { Check, Clock, Circle } from 'lucide-react';

export interface LifecycleStep {
  id: string;
  label: string;
  timestamp?: string;
  description?: string;
}

type StepState = 'completed' | 'current' | 'upcoming';

interface StatusLifecycleProps {
  steps: LifecycleStep[];
  currentStepId: string;
  direction?: 'horizontal' | 'vertical';
  accentColor?: string; // e.g., 'blue', 'teal', 'cyan'
  compact?: boolean;
}

const ACCENT_MAP: Record<string, { completed: string; current: string; line: string; bg: string; currentBg: string }> = {
  blue: {
    completed: 'bg-blue-600',
    current: 'bg-blue-600',
    line: 'bg-blue-600',
    bg: 'bg-blue-50',
    currentBg: 'bg-blue-50',
  },
  teal: {
    completed: 'bg-teal-600',
    current: 'bg-teal-600',
    line: 'bg-teal-600',
    bg: 'bg-teal-50',
    currentBg: 'bg-teal-50',
  },
  cyan: {
    completed: 'bg-cyan-600',
    current: 'bg-cyan-600',
    line: 'bg-cyan-600',
    bg: 'bg-cyan-50',
    currentBg: 'bg-cyan-50',
  },
  emerald: {
    completed: 'bg-emerald-600',
    current: 'bg-emerald-600',
    line: 'bg-emerald-600',
    bg: 'bg-emerald-50',
    currentBg: 'bg-emerald-50',
  },
};

export function StatusLifecycle({
  steps,
  currentStepId,
  direction = 'horizontal',
  accentColor = 'blue',
  compact = false,
}: StatusLifecycleProps) {
  const accent = ACCENT_MAP[accentColor] || ACCENT_MAP.blue;
  const currentIdx = steps.findIndex(s => s.id === currentStepId);

  const getState = (idx: number): StepState => {
    if (idx < currentIdx) return 'completed';
    if (idx === currentIdx) return 'current';
    return 'upcoming';
  };

  if (direction === 'vertical') {
    return (
      <div className="flex flex-col gap-0">
        {steps.map((step, i) => {
          const state = getState(i);
          const isLast = i === steps.length - 1;

          return (
            <div key={step.id} className="flex gap-3">
              {/* Dot + Line */}
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  state === 'completed' ? accent.completed : state === 'current' ? `${accent.currentBg} border-2 border-current` : 'bg-gray-100'
                }`}
                  style={state === 'current' ? { borderColor: accentColor === 'blue' ? '#1e40af' : accentColor === 'teal' ? '#0d9488' : '#0891b2' } : undefined}
                >
                  {state === 'completed' ? (
                    <Check size={12} className="text-white" strokeWidth={3} />
                  ) : state === 'current' ? (
                    <Clock size={12} style={{ color: accentColor === 'blue' ? '#1e40af' : accentColor === 'teal' ? '#0d9488' : '#0891b2' }} />
                  ) : (
                    <Circle size={8} className="text-gray-300" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-6 transition-colors ${
                    state === 'completed' ? accent.line : 'bg-gray-200'
                  }`} />
                )}
              </div>

              {/* Label */}
              <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                <p className={`${
                  state === 'current' ? 'text-gray-900' : state === 'completed' ? 'text-gray-600' : 'text-gray-400'
                }`} style={{ fontSize: 13, fontWeight: state === 'current' ? 700 : 500 }}>
                  {step.label}
                </p>
                {step.timestamp && (
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 11 }}>{step.timestamp}</p>
                )}
                {step.description && state === 'current' && (
                  <p className="text-gray-500 mt-1" style={{ fontSize: 11 }}>{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div className="flex items-start w-full">
      {steps.map((step, i) => {
        const state = getState(i);
        const isLast = i === steps.length - 1;

        return (
          <div key={step.id} className="contents">
            <div className="flex flex-col items-center gap-2 min-w-0">
              {/* Dot */}
              <div className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center shrink-0 transition-all ${
                state === 'completed' ? accent.completed : state === 'current' ? accent.current : 'bg-gray-200'
              }`}>
                {state === 'completed' ? (
                  <Check size={compact ? 10 : 14} className="text-white" strokeWidth={3} />
                ) : state === 'current' ? (
                  <Clock size={compact ? 10 : 14} className="text-white" />
                ) : (
                  <Circle size={compact ? 6 : 8} className="text-gray-400" />
                )}
              </div>

              {/* Label */}
              <div className="text-center max-w-[80px] sm:max-w-[100px]">
                <p className={`${
                  state === 'current' ? 'text-gray-900' : state === 'completed' ? 'text-gray-600' : 'text-gray-400'
                } truncate`} style={{ fontSize: compact ? 10 : 11, fontWeight: state === 'current' ? 700 : 500 }}>
                  {step.label}
                </p>
                {step.timestamp && !compact && (
                  <p className="text-gray-400 mt-0.5 truncate" style={{ fontSize: 10 }}>{step.timestamp}</p>
                )}
              </div>
            </div>

            {/* Connector */}
            {!isLast && (
              <div className={`flex-1 h-0.5 mt-3 sm:mt-4 mx-1 transition-colors ${
                i < currentIdx ? accent.line : 'bg-gray-200'
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}