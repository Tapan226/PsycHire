import React, { useState } from 'react';
import {
  X, Send, CheckCircle2, BookOpen, Users, Building2,
  ChevronDown, Lightbulb,
} from 'lucide-react';
import { Portal } from '@/app/components/shared/Portal';

interface RequestCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestCourseModal({ isOpen, onClose }: RequestCourseModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    specialization: '',
    description: '',
    targetGroup: '',
    preferredMode: '',
    preferredDuration: '',
    budget: '',
    numberOfParticipants: '',
    additionalNotes: '',
  });

  if (!isOpen) return null;

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  const canSubmit = form.title && form.description && form.targetGroup;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    setForm({ title: '', specialization: '', description: '', targetGroup: '', preferredMode: '', preferredDuration: '', budget: '', numberOfParticipants: '', additionalNotes: '' });
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 rounded-t-2xl z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Lightbulb size={18} />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Request a Course</p>
              <p className="text-gray-500" style={{ fontSize: 12 }}>Describe your training needs for matching</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><X size={18} /></button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>Request Submitted!</p>
              <p className="text-gray-500 mt-2 max-w-sm" style={{ fontSize: 13 }}>
                Your training request has been received. Our course matching team will review it and connect you with relevant providers within 48 hours.
              </p>
              <button onClick={handleClose} className="mt-6 px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>Done</button>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Training Title <span className="text-red-400">*</span></label>
                <input type="text" value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Trauma-Informed Care for HR Teams" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Specialization</label>
                <div className="relative">
                  <select value={form.specialization} onChange={e => update('specialization', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }}>
                    <option value="">Select specialization...</option>
                    {['Clinical', 'Counselling', 'I-O Psychology', 'Developmental', 'Neuropsychology', 'Social Psychology', 'Other'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Describe Your Training Need <span className="text-red-400">*</span></label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="What skills or knowledge are you looking to develop for your team?" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Target Audience <span className="text-red-400">*</span></label>
                <input type="text" value={form.targetGroup} onChange={e => update('targetGroup', e.target.value)} placeholder="e.g. HR managers, counsellors, team leads" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Preferred Mode</label>
                  <div className="relative">
                    <select value={form.preferredMode} onChange={e => update('preferredMode', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }}>
                      <option value="">Any</option>
                      {['Online', 'Offline', 'Hybrid'].map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Participants</label>
                  <input type="text" value={form.numberOfParticipants} onChange={e => update('numberOfParticipants', e.target.value)} placeholder="e.g. 15-20" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Preferred Duration</label>
                  <input type="text" value={form.preferredDuration} onChange={e => update('preferredDuration', e.target.value)} placeholder="e.g. 2-3 days" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Budget Range</label>
                  <input type="text" value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. INR 50,000-1,00,000" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                </div>
              </div>

              <button onClick={handleSubmit} disabled={!canSubmit} className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${canSubmit ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} style={{ fontSize: 13, fontWeight: 700 }}>
                <Send size={14} /> Submit Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}