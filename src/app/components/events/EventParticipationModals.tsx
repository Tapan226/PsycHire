/**
 * EventParticipationModals — Call for Papers & Speaker Application modals
 * for EventDetailsPage. Each has its own multi-field form with validation,
 * file upload (simulated), and confirmation state.
 */

import React, { useState } from 'react';
import {
  X, CheckCircle2, FileText, Upload, Mic2, Plus,
  AlertTriangle, Sparkles, Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import { Portal } from '@/app/components/shared/Portal';

/* ═══════════════════════════════════════
   Shared helpers
   ═══════════════════════════════════════ */

const inputCls = 'px-3.5 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all bg-white';

function ModalShell({
  open, onClose, children, title, subtitle, icon: Icon, iconBg, iconColor,
}: {
  open: boolean; onClose: () => void; children: React.ReactNode;
  title: string; subtitle?: string;
  icon: React.ElementType; iconBg: string; iconColor: string;
}) {
  if (!open) return null;
  return (
    <Portal>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>{title}</p>
                {subtitle && <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          {children}
        </div>
      </div>
    </Portal>
  );
}

/* ═══════════════════════════════════════
   Call for Papers Modal
   ═══════════════════════════════════════ */

interface CallForPapersModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
}

export function CallForPapersModal({ open, onClose, eventTitle }: CallForPapersModalProps) {
  const [form, setForm] = useState({
    title: '',
    abstract: '',
    keywords: '',
    coAuthors: '',
    fileName: '',
    agreedTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Paper submitted successfully!', { description: `Your paper "${form.title}" has been submitted for review.` });
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setSubmitting(false);
      setForm({ title: '', abstract: '', keywords: '', coAuthors: '', fileName: '', agreedTerms: false });
    }, 300);
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Submit Paper"
      subtitle={eventTitle}
      icon={FileText}
      iconBg="bg-purple-50"
      iconColor="text-purple-600"
    >
      {submitted ? (
        <div className="px-6 py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <p className="text-gray-900 mb-1.5" style={{ fontSize: 18, fontWeight: 800 }}>Paper Submitted!</p>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto" style={{ fontSize: 13 }}>
            Your submission will be reviewed by the organizing committee. You'll be notified of the decision via email.
          </p>
          <button onClick={handleClose} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors" style={{ fontSize: 13, fontWeight: 700 }}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Paper Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Paper Title <span className="text-red-500">*</span></label>
            <input
              type="text" required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="e.g., CBT for Adolescent Anxiety in Indian Context"
              className={inputCls} style={{ fontSize: 14 }}
            />
          </div>

          {/* Abstract */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Abstract <span className="text-red-500">*</span></label>
            <textarea
              required rows={5} value={form.abstract}
              onChange={e => setForm(p => ({ ...p, abstract: e.target.value }))}
              placeholder="Provide a brief summary of your paper (250-500 words)"
              className={`${inputCls} resize-none`} style={{ fontSize: 14 }}
            />
            <p className="text-gray-400" style={{ fontSize: 11 }}>{form.abstract.split(/\s+/).filter(Boolean).length} / 500 words</p>
          </div>

          {/* Keywords */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600 flex items-center gap-1.5" style={{ fontSize: 12, fontWeight: 600 }}>
              <Tag size={12} /> Keywords <span className="text-red-500">*</span>
            </label>
            <input
              type="text" required value={form.keywords}
              onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))}
              placeholder="e.g., CBT, Anxiety, Adolescents, India"
              className={inputCls} style={{ fontSize: 14 }}
            />
            <p className="text-gray-400" style={{ fontSize: 11 }}>Separate keywords with commas</p>
          </div>

          {/* Co-Authors */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Co-Authors <span className="text-gray-400" style={{ fontWeight: 400 }}>(Optional)</span></label>
            <input
              type="text" value={form.coAuthors}
              onChange={e => setForm(p => ({ ...p, coAuthors: e.target.value }))}
              placeholder="e.g., Dr. Anita Sharma, Vikram Das"
              className={inputCls} style={{ fontSize: 14 }}
            />
          </div>

          {/* File Upload (simulated) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Upload Paper <span className="text-gray-400" style={{ fontWeight: 400 }}>(PDF, max 10 MB)</span></label>
            {form.fileName ? (
              <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg border border-gray-200 bg-gray-50">
                <FileText size={16} className="text-purple-500 shrink-0" />
                <span className="text-gray-700 truncate flex-1" style={{ fontSize: 13 }}>{form.fileName}</span>
                <button type="button" onClick={() => setForm(p => ({ ...p, fileName: '' }))} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setForm(p => ({ ...p, fileName: 'CBT_Adolescent_Anxiety_Paper.pdf' }))}
                className="flex items-center justify-center gap-2 px-3.5 py-4 rounded-lg border-2 border-dashed border-gray-200 text-gray-400 hover:border-purple-300 hover:text-purple-500 hover:bg-purple-50/30 transition-all"
                style={{ fontSize: 13 }}
              >
                <Upload size={16} /> Click to upload or drag & drop
              </button>
            )}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox" required checked={form.agreedTerms}
              onChange={e => setForm(p => ({ ...p, agreedTerms: e.target.checked }))}
              className="mt-0.5 rounded"
            />
            <span className="text-gray-600" style={{ fontSize: 12 }}>
              I confirm this is original work and grant the organizers the right to include it in conference proceedings.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              {submitting ? (
                <div className="contents">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="contents">
                  <FileText size={14} /> Submit Paper
                </div>
              )}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}

/* ═══════════════════════════════════════
   Speaker Application Modal
   ═══════════════════════════════════════ */

interface SpeakerApplicationModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
}

export function SpeakerApplicationModal({ open, onClose, eventTitle }: SpeakerApplicationModalProps) {
  const [form, setForm] = useState({
    topic: '',
    outline: '',
    bio: '',
    credentials: '',
    priorExperience: '',
    avEquipment: '',
    agreedTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Speaker application submitted!', { description: 'The organizing committee will review your application.' });
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setSubmitting(false);
      setForm({ topic: '', outline: '', bio: '', credentials: '', priorExperience: '', avEquipment: '', agreedTerms: false });
    }, 300);
  };

  return (
    <ModalShell
      open={open}
      onClose={handleClose}
      title="Apply as Speaker"
      subtitle={eventTitle}
      icon={Mic2}
      iconBg="bg-blue-50"
      iconColor="text-blue-600"
    >
      {submitted ? (
        <div className="px-6 py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <p className="text-gray-900 mb-1.5" style={{ fontSize: 18, fontWeight: 800 }}>Application Submitted!</p>
          <p className="text-gray-500 mb-6 max-w-xs mx-auto" style={{ fontSize: 13 }}>
            Thank you for your interest in speaking. The organizers will review your application and respond within 5-7 business days.
          </p>
          <button onClick={handleClose} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors" style={{ fontSize: 13, fontWeight: 700 }}>
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {/* Proposed Topic */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Proposed Topic <span className="text-red-500">*</span></label>
            <input
              type="text" required value={form.topic}
              onChange={e => setForm(p => ({ ...p, topic: e.target.value }))}
              placeholder="e.g., Mindfulness-Based Cognitive Therapy Updates"
              className={inputCls} style={{ fontSize: 14 }}
            />
          </div>

          {/* Presentation Outline */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Presentation Outline <span className="text-red-500">*</span></label>
            <textarea
              required rows={4} value={form.outline}
              onChange={e => setForm(p => ({ ...p, outline: e.target.value }))}
              placeholder="Provide a brief outline of your talk (key points, structure, expected duration)"
              className={`${inputCls} resize-none`} style={{ fontSize: 14 }}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Speaker Bio <span className="text-red-500">*</span></label>
            <textarea
              required rows={3} value={form.bio}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              placeholder="Brief professional bio for event materials"
              className={`${inputCls} resize-none`} style={{ fontSize: 14 }}
            />
          </div>

          {/* Credentials */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Credentials & Affiliations <span className="text-red-500">*</span></label>
            <input
              type="text" required value={form.credentials}
              onChange={e => setForm(p => ({ ...p, credentials: e.target.value }))}
              placeholder="e.g., PhD Clinical Psychology, NIMHANS; RCI Licensed"
              className={inputCls} style={{ fontSize: 14 }}
            />
          </div>

          {/* Prior Speaking Experience */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Prior Speaking Experience <span className="text-gray-400" style={{ fontWeight: 400 }}>(Optional)</span></label>
            <input
              type="text" value={form.priorExperience}
              onChange={e => setForm(p => ({ ...p, priorExperience: e.target.value }))}
              placeholder="e.g., IPA Conference 2025, NIMHANS Annual Meet"
              className={inputCls} style={{ fontSize: 14 }}
            />
          </div>

          {/* A/V Requirements */}
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>A/V or Equipment Needs <span className="text-gray-400" style={{ fontWeight: 400 }}>(Optional)</span></label>
            <input
              type="text" value={form.avEquipment}
              onChange={e => setForm(p => ({ ...p, avEquipment: e.target.value }))}
              placeholder="e.g., Projector, whiteboard, video playback"
              className={inputCls} style={{ fontSize: 14 }}
            />
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox" required checked={form.agreedTerms}
              onChange={e => setForm(p => ({ ...p, agreedTerms: e.target.checked }))}
              className="mt-0.5 rounded"
            />
            <span className="text-gray-600" style={{ fontSize: 12 }}>
              I agree to present in person/virtually as per the event format and grant permission for session recording.
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1">
            <button type="button" onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
              Cancel
            </button>
            <button
              type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              {submitting ? (
                <div className="contents">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                <div className="contents">
                  <Mic2 size={14} /> Apply as Speaker
                </div>
              )}
            </button>
          </div>
        </form>
      )}
    </ModalShell>
  );
}