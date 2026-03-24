import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, CheckCircle2, ChevronDown } from 'lucide-react';
import { EXPERIENCE_LEVELS } from '@/app/data/referrals';
import type { ExperienceLevel } from '@/app/data/referrals';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';

interface RespondModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralTitle?: string;
}

export function RespondModal({ isOpen, onClose, referralTitle }: RespondModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    message: '',
    experienceLevel: '' as ExperienceLevel | '',
    timeAvailability: '',
    portfolioLink: '',
  });

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setFormData({ message: '', experienceLevel: '', timeAvailability: '', portfolioLink: '' });
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    if (!formData.message.trim()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const modalContent = isSuccess ? (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 flex flex-col items-center text-center shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
        <SuccessCelebration
          title="Response Sent!"
          subtitle="The referral creator will review your response and get back to you."
          actionLabel="Done"
          onAction={onClose}
        />
      </div>
    </div>
  ) : (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg flex flex-col shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Respond to Referral</h2>
            {referralTitle && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-1">{referralTitle}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto flex-1">
          <div className="flex flex-col gap-6">

            {/* Message — required */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Why are you a good fit? <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe your relevant experience, skills, and interest in this referral..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all resize-none"
              />
            </div>

            {/* Experience Level — optional */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Experience Level <span className="font-normal text-gray-400">(optional)</span>
              </label>
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

            {/* Time Availability — optional */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Time Availability <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 10 hours/week, weekday mornings"
                value={formData.timeAvailability}
                onChange={(e) => setFormData({ ...formData, timeAvailability: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
              />
            </div>

            {/* Portfolio / Website — optional */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Portfolio / Website <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://"
                value={formData.portfolioLink}
                onChange={(e) => setFormData({ ...formData, portfolioLink: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 transition-all"
              />
            </div>
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
            disabled={isSubmitting || !formData.message.trim()}
            className="bg-brand-primary text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-primary/90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              'Submit Response'
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return <Portal>{modalContent}</Portal>;
}