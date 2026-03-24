import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import {
  X,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Clock,
  Calendar,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import type { ReferralUrgency, ExperienceLevel } from '@/app/data/referrals';
import { SPECIALIZATIONS, EXPERIENCE_LEVELS } from '@/app/data/referrals';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';

interface ReferralFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralFormModal({ isOpen, onClose }: ReferralFormModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOptional, setShowOptional] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    specialization: '',
    location: '',
    urgency: 'Scheduled' as ReferralUrgency,
    deadline: '',
    studentEligible: false,
    // Optional fields
    duration: '',
    prerequisites: [''],
    clientSummary: '',
    experienceLevel: '' as ExperienceLevel | '',
    language: '',
    population: '',
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setShowOptional(false);
      setFormData({
        title: '', specialization: '', location: '', urgency: 'Scheduled',
        deadline: '', studentEligible: false, duration: '', prerequisites: [''],
        clientSummary: '', experienceLevel: '', language: '', population: '',
      });
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    if (!formData.title || !formData.specialization || !formData.deadline) {
      alert('Please fill in the required fields (Title, Specialization, Deadline).');
      return;
    }
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const addPrerequisite = () => {
    setFormData({ ...formData, prerequisites: [...formData.prerequisites, ''] });
  };
  const updatePrerequisite = (index: number, value: string) => {
    const next = [...formData.prerequisites];
    next[index] = value;
    setFormData({ ...formData, prerequisites: next });
  };
  const removePrerequisite = (index: number) => {
    setFormData({ ...formData, prerequisites: formData.prerequisites.filter((_, i) => i !== index) });
  };

  const modalContent = isSuccess ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 flex flex-col items-center text-center shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
        <SuccessCelebration
          title="Referral Created"
          subtitle="Your referral is now live. Qualified professionals and eligible students can view and respond."
          actionLabel="Done"
          onAction={onClose}
        />
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Create Referral</h2>
            <p className="text-sm text-gray-500 mt-1">Post a referral for the community to respond to.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="flex flex-col gap-6">

            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Child psychologist needed for developmental assessment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
              />
            </div>

            {/* Specialization */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Specialization <span className="text-red-500">*</span></label>
              <div className="relative">
                <select
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all cursor-pointer"
                >
                  <option value="">Select specialization</option>
                  {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Location + Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Location <span className="text-red-500">*</span></label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" placeholder="e.g. Mumbai, MH or Remote"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Urgency <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Zap size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as ReferralUrgency })}
                    className="w-full appearance-none pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all cursor-pointer"
                  >
                    <option value="Immediate">Immediate</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Exploratory">Exploratory</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Deadline + Student Eligible */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Deadline <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 justify-end">
                <label className="flex items-center gap-3 cursor-pointer py-3">
                  <input
                    type="checkbox"
                    checked={formData.studentEligible}
                    onChange={(e) => setFormData({ ...formData, studentEligible: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/30"
                  />
                  <span className="text-sm font-medium text-gray-700">Open to students</span>
                </label>
              </div>
            </div>

            {/* ── Optional fields toggle ── */}
            <button
              onClick={() => setShowOptional(!showOptional)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors self-start py-1"
            >
              <ChevronRight size={16} className={`transition-transform ${showOptional ? 'rotate-90' : ''}`} />
              Add more details
            </button>

            {showOptional && (
              <div className="flex flex-col gap-6 pl-1 border-l-2 border-gray-100 ml-2 animate-in slide-in-from-top-2 duration-200">
                <div className="pl-5 flex flex-col gap-6">
                  {/* Duration */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Duration</label>
                    <div className="relative">
                      <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text" placeholder="e.g. 3 sessions over 2 weeks"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Experience Level + Language */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Experience Level</label>
                      <div className="relative">
                        <select
                          value={formData.experienceLevel}
                          onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
                          className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all cursor-pointer"
                        >
                          <option value="">Select level</option>
                          {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Language</label>
                      <input
                        type="text" placeholder="e.g. English, Hindi"
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
                      />
                    </div>
                  </div>

                  {/* Population */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Population</label>
                    <input
                      type="text" placeholder="e.g. Children, Adolescents, Adults"
                      value={formData.population}
                      onChange={(e) => setFormData({ ...formData, population: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
                    />
                  </div>

                  {/* Client Summary */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Client Summary <span className="font-normal text-gray-400">(Non-identifiable)</span></label>
                    <textarea
                      rows={3}
                      placeholder="Brief, non-identifiable description of the case or opportunity..."
                      value={formData.clientSummary}
                      onChange={(e) => setFormData({ ...formData, clientSummary: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all resize-none"
                    />
                  </div>

                  {/* Prerequisites */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Prerequisites</label>
                    <div className="flex flex-col gap-2">
                      {formData.prerequisites.map((p, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={`e.g. ${['RCI-licensed', 'CBT certification', '2+ years experience'][i % 3]}`}
                            value={p}
                            onChange={(e) => updatePrerequisite(i, e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
                          />
                          {formData.prerequisites.length > 1 && (
                            <button onClick={() => removePrerequisite(i)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addPrerequisite}
                        className="inline-flex items-center gap-1.5 text-sm text-brand-primary font-medium hover:text-brand-primary/80 transition-colors self-start mt-1"
                      >
                        <Plus size={14} />
                        Add prerequisite
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-secondary text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-secondary-hover transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Referral'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return <Portal>{modalContent}</Portal>;
}