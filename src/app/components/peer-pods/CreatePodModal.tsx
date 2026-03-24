import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, CheckCircle2 } from 'lucide-react';
import {
  POD_TYPE_OPTIONS,
  CAREER_STAGE_OPTIONS,
  PRIMARY_GOAL_OPTIONS,
  DURATION_OPTIONS,
  AVAILABILITY_OPTIONS,
  POD_TYPE_COLOR,
} from '@/app/data/peer-pods';

interface CreatePodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function CreatePodModal({ isOpen, onClose, onSubmit }: CreatePodModalProps) {
  const [title, setTitle] = useState('');
  const [podType, setPodType] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [careerStage, setCareerStage] = useState('');
  const [duration, setDuration] = useState('');
  const [maxMembers, setMaxMembers] = useState('6');
  const [availability, setAvailability] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const canSubmit = title.trim() && podType;

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ title, podType, primaryGoal, careerStage, duration, maxMembers, availability });
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setTitle('');
    setPodType('');
    setPrimaryGoal('');
    setCareerStage('');
    setDuration('');
    setMaxMembers('6');
    setAvailability('');
    onClose();
  };

  const inputClass = 'w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20 transition-all';
  const labelClass = 'text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block';

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-50 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <p style={{ fontSize: 18 }} className="text-gray-900">Create a Pod</p>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          /* ── Success State ── */
          <div className="p-8 text-center flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center">
              <CheckCircle2 size={28} className="text-teal-600" />
            </div>
            <p style={{ fontSize: 18 }} className="text-gray-900">Pod Submitted for Approval</p>
            <p style={{ fontSize: 14 }} className="text-gray-500 max-w-xs">
              Your pod will be reviewed by an admin. Once approved, it will be visible as "Open" and others can join.
            </p>
            <button onClick={handleClose} className="mt-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="p-6 overflow-y-auto flex flex-col gap-5">
              {/* Pod Title */}
              <div>
                <label className={labelClass}>Pod Title <span className="text-red-400">*</span></label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Resilience in Clinical Practice" className={inputClass} />
              </div>

              {/* Pod Type */}
              <div>
                <label className={labelClass}>Pod Type <span className="text-red-400">*</span></label>
                <div className="flex flex-wrap gap-2">
                  {POD_TYPE_OPTIONS.map(t => {
                    const color = POD_TYPE_COLOR[t];
                    const isSelected = podType === t;
                    return (
                      <button
                        key={t}
                        onClick={() => setPodType(t)}
                        className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition-all ${
                          isSelected
                            ? `${color.bg} ${color.text} ${color.border} shadow-sm`
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Goal */}
              <div>
                <label className={labelClass}>Primary Goal</label>
                <select value={primaryGoal} onChange={e => setPrimaryGoal(e.target.value)} className={inputClass}>
                  <option value="">Select</option>
                  {PRIMARY_GOAL_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Career Stage & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Career Stage</label>
                  <select value={careerStage} onChange={e => setCareerStage(e.target.value)} className={inputClass}>
                    <option value="">Any</option>
                    {CAREER_STAGE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Duration</label>
                  <select value={duration} onChange={e => setDuration(e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {DURATION_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Max Members & Availability */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Max Members (2–8)</label>
                  <select value={maxMembers} onChange={e => setMaxMembers(e.target.value)} className={inputClass}>
                    {[2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={String(n)}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Availability</label>
                  <select value={availability} onChange={e => setAvailability(e.target.value)} className={inputClass}>
                    <option value="">Select</option>
                    {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p style={{ fontSize: 11 }} className="text-gray-400">Submitted pods require admin approval.</p>
              <button onClick={handleSubmit} disabled={!canSubmit} className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm">
                Submit Pod
              </button>
            </div>
          </>
        )}
      </div>
    </div>
    </Portal>
  );
}