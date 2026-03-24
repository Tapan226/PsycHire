/**
 * ListingActions — Shared Extend / Renew / Expire action modals
 * for CompanyDashboard listing cards across all 6 modules.
 */

import React, { useState } from 'react';
import {
  CalendarPlus, RefreshCw, TimerOff, X,
  CheckCircle2, AlertTriangle, Calendar,
} from 'lucide-react';

import { Portal } from '@/app/components/shared/Portal';

/* ═══════════════════════════════════════
   Types
   ═══════════════════════════════════════ */

export type ListingActionType = 'extend' | 'renew' | 'expire';

interface ListingActionModalProps {
  actionType: ListingActionType;
  listingTitle: string;
  currentDeadline?: string;
  onConfirm: (data: { newDeadline?: string }) => void;
  onClose: () => void;
}

const ACTION_CONFIG: Record<ListingActionType, {
  icon: React.ElementType;
  title: string;
  description: string;
  confirmLabel: string;
  confirmColor: string;
  iconBg: string;
  iconColor: string;
}> = {
  extend: {
    icon: CalendarPlus,
    title: 'Extend Deadline',
    description: 'Push the deadline forward to keep receiving applications.',
    confirmLabel: 'Extend Deadline',
    confirmColor: 'bg-cyan-700 hover:bg-cyan-800',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
  renew: {
    icon: RefreshCw,
    title: 'Renew Listing',
    description: 'Reactivate this closed listing with a new deadline. It will be set to active immediately.',
    confirmLabel: 'Renew Listing',
    confirmColor: 'bg-emerald-600 hover:bg-emerald-700',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  expire: {
    icon: TimerOff,
    title: 'Close Listing',
    description: 'Close this listing immediately. Applicants who already applied will still be visible.',
    confirmLabel: 'Close Now',
    confirmColor: 'bg-red-600 hover:bg-red-700',
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
  },
};

/* ═══════════════════════════════════════
   Component
   ═══════════════════════════════════════ */

export function ListingActionModal({
  actionType,
  listingTitle,
  currentDeadline,
  onConfirm,
  onClose,
}: ListingActionModalProps) {
  const config = ACTION_CONFIG[actionType];
  const Icon = config.icon;
  const needsDate = actionType === 'extend' || actionType === 'renew';

  const [newDeadline, setNewDeadline] = useState(() => {
    if (actionType === 'extend' && currentDeadline) {
      const d = new Date(currentDeadline);
      d.setDate(d.getDate() + 14);
      return d.toISOString().split('T')[0];
    }
    if (actionType === 'renew') {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split('T')[0];
    }
    return '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ newDeadline: needsDate ? newDeadline : undefined });
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${config.iconBg} flex items-center justify-center`}>
                <Icon size={18} className={config.iconColor} />
              </div>
              <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>{config.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="px-6 py-5">
            <p className="text-gray-500 mb-4" style={{ fontSize: 13 }}>{config.description}</p>

            {/* Listing title */}
            <div className="px-3.5 py-2.5 bg-gray-50 rounded-lg border border-gray-100 mb-4">
              <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Listing</p>
              <p className="text-gray-900 mt-0.5 truncate" style={{ fontSize: 14, fontWeight: 600 }}>{listingTitle}</p>
            </div>

            {/* Current deadline */}
            {currentDeadline && actionType === 'extend' && (
              <div className="flex items-center gap-2 mb-3 text-gray-500" style={{ fontSize: 12 }}>
                <Calendar size={13} className="text-gray-400" />
                Current deadline: <span className="text-gray-700" style={{ fontWeight: 600 }}>{currentDeadline}</span>
              </div>
            )}

            {/* Date picker */}
            {needsDate && (
              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>
                  {actionType === 'extend' ? 'New Deadline *' : 'Active Until *'}
                </label>
                <input
                  type="date"
                  required
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:border-cyan-300 transition-all"
                  style={{ fontSize: 14 }}
                />
              </div>
            )}

            {/* Warning for expire */}
            {actionType === 'expire' && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 bg-amber-50 border border-amber-200 rounded-lg mb-5">
                <AlertTriangle size={15} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-amber-700" style={{ fontSize: 12 }}>
                  This action cannot be undone immediately. You can renew the listing later if needed.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`flex-1 py-2.5 rounded-xl text-white ${config.confirmColor} transition-colors flex items-center justify-center gap-2`}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                <Icon size={14} />
                {config.confirmLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Portal>
  );
}

/* ═══════════════════════════════════════
   Inline Action Buttons (for listing rows)
   ═══════════════════════════════════════ */

interface ListingActionButtonsProps {
  status: string;
  hasDeadline: boolean;
  onExtend: () => void;
  onExpire: () => void;
  onRenew: () => void;
}

export function ListingActionButtons({ status, hasDeadline, onExtend, onExpire, onRenew }: ListingActionButtonsProps) {
  if (status === 'active') {
    return (
      <div className="contents">
        {hasDeadline && (
          <button
            onClick={(e) => { e.stopPropagation(); onExtend(); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors"
            style={{ fontSize: 12, fontWeight: 600 }}
            title="Extend Deadline"
          >
            <CalendarPlus size={14} />
            <span className="hidden sm:inline">Extend</span>
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onExpire(); }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
          style={{ fontSize: 12, fontWeight: 600 }}
          title="Close Listing"
        >
          <TimerOff size={14} />
          <span className="hidden sm:inline">Close</span>
        </button>
      </div>
    );
  }

  if (status === 'closed') {
    return (
      <button
        onClick={(e) => { e.stopPropagation(); onRenew(); }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
        style={{ fontSize: 12, fontWeight: 600 }}
        title="Renew Listing"
      >
        <RefreshCw size={14} />
        <span className="hidden sm:inline">Renew</span>
      </button>
    );
  }

  return null;
}