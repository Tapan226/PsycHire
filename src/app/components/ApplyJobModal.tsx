import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, Upload, CheckCircle2, Calendar, MapPin, DollarSign, Briefcase, ChevronDown } from 'lucide-react';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import { toastApplicationSubmitted } from '@/app/components/shared/toasts';

interface ApplyJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  jobTitle: string;
  companyName: string;
}

export function ApplyJobModal({ isOpen, onClose, onSubmitted, jobTitle, companyName }: ApplyJobModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    email: 'jane.doe@university.edu',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    experience: '3-5',
    currency: 'INR',
    salary: '85000',
    availableFrom: '2026-03-01',
    resume: null as File | null,
    linkedin: 'https://linkedin.com/in/janedoe',
    portfolio: 'https://janedoe.com',
    coverLetter: 'I am excited to apply for this position because I have the relevant experience and skills.',
    notes: 'I am available for interviews anytime after 2 PM.'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSuccess(false);
      setIsSubmitting(false);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleNext = () => {
    if (!formData.email || !formData.location || !formData.experience || !formData.availableFrom) {
      alert("Please fill in all required fields.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.coverLetter) {
      alert("Please provide a cover letter.");
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);

    // Fire branded toast
    toastApplicationSubmitted(jobTitle);

    onSubmitted?.();
  };

  const handleDone = () => {
    onClose();
  };

  const modalContent = isSuccess ? (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center">
        <SuccessCelebration
          title="Application Sent!"
          subtitle={`Your application for ${jobTitle} at ${companyName} has been submitted successfully. Good luck!`}
          actionLabel="Done"
          onAction={handleDone}
        />
      </div>
    </div>
    </Portal>
  ) : (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Apply to Job</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1 shrink-0">
          <div
            className="h-full bg-brand-secondary transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
          {step === 1 ? (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    Step 1: Basic Info
                  </h3>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">1 of 2</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Contact Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Current Location <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, India"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Years of Experience <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select experience</option>
                        <option value="fresher">Fresher</option>
                        <option value="1-2">1-2 Years</option>
                        <option value="3-5">3-5 Years</option>
                        <option value="5+">5+ Years</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Expected Salary */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Expected Salary</label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          value={formData.currency}
                          onChange={(e) => setFormData({...formData, currency: e.target.value})}
                          className="pl-3 pr-8 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary font-medium appearance-none cursor-pointer"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                      <div className="relative flex-1">
                        <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          placeholder="Annual expectation"
                          value={formData.salary}
                          onChange={(e) => setFormData({...formData, salary: e.target.value})}
                          className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Available From */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Available From <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        value={formData.availableFrom}
                        onChange={(e) => setFormData({...formData, availableFrom: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  Step 2: Details & Cover Letter
                </h3>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">2 of 2</span>
              </div>

              {/* Section: Professional Links */}
              <div className="flex flex-col gap-5">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Professional Profile</h4>

                <div className="flex flex-col gap-4">
                  {/* Resume Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Resume/CV <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-brand-primary/40 hover:bg-gray-50/50 transition-all cursor-pointer group">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload size={20} className="text-gray-500 group-hover:text-brand-primary" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PDF or Word (max 50MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LinkedIn */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">LinkedIn URL</label>
                      <input
                        type="url"
                        placeholder="linkedin.com/in/username"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                    {/* Portfolio */}
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Portfolio URL</label>
                      <input
                        type="url"
                        placeholder="yourportfolio.com"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                        className="px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Cover Letter */}
              <div className="flex flex-col gap-5">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2">Additional Information</h4>

                {/* Cover Letter */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Cover Letter <span className="text-red-500">*</span></label>
                  <textarea
                    rows={6}
                    placeholder="Explain why you're a good fit for this role..."
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500">Briefly describe your relevant experience and motivation.</p>
                </div>

                {/* Additional Notes */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Additional Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Anything else you'd like us to know?"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <button
            onClick={step === 1 ? onClose : () => setStep(1)}
            className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <button
            onClick={step === 1 ? handleNext : handleSubmit}
            disabled={isSubmitting}
            className="bg-brand-secondary text-white px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-secondary-hover transition-all shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              step === 1 ? 'Continue to Details' : 'Submit Application'
            )}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );

  return modalContent;
}