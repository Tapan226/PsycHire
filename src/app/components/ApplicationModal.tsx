import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, CheckCircle2, Upload, FileText, Briefcase, Clock, DollarSign, Globe, Link as LinkIcon, ChevronDown } from 'lucide-react';
import { Chip } from './Chip';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import { toastApplicationSubmitted } from '@/app/components/shared/toasts';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
  projectTitle: string;
}

export function ApplicationModal({ isOpen, onClose, onSubmitted, projectTitle }: ApplicationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    role: 'Research Assistant',
    experienceLevel: 'Intermediate',
    timeAvailability: '15 hrs/week',
    portfolioUrl: 'https://github.com/janedoe',
    expectedCompensation: '$25/hr',
    coverLetter: 'I have significant experience in qualitative analysis and Python, which fits this project perfectly.',
    statementOfInterest: '',
  });

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling and reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setFormData({
        role: 'Research Assistant',
        experienceLevel: 'Intermediate',
        timeAvailability: '15 hrs/week',
        portfolioUrl: 'https://github.com/janedoe',
        expectedCompensation: '$25/hr',
        coverLetter: 'I have significant experience in qualitative analysis and Python, which fits this project perfectly.',
        statementOfInterest: '',
      });
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.role || !formData.experienceLevel || !formData.timeAvailability || !formData.coverLetter) {
        alert("Please fill in all required fields.");
        return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Fire branded toast
    toastApplicationSubmitted(projectTitle);

    // Call onSubmitted callback if provided
    if (onSubmitted) {
      onSubmitted();
    }
  };

  const modalContent = isSuccess ? (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 text-center">
          <SuccessCelebration
            title="Application Sent!"
            subtitle={`Your application for ${projectTitle} has been successfully submitted to the project lead.`}
            actionLabel="Done"
            onAction={onClose}
          />
      </div>
    </div>
    </Portal>
  ) : (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Apply to Project</h2>
            <p className="text-sm text-gray-500 mt-1">Submit your proposal for {projectTitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content (Scrollable) */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Role */}
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Role Interested In <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <Briefcase size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="e.g. Research Assistant"
                              value={formData.role}
                              onChange={(e) => setFormData({...formData, role: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                          />
                      </div>
                  </div>

                  {/* Experience */}
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Experience Level <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <select 
                              value={formData.experienceLevel}
                              onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all appearance-none cursor-pointer"
                          >
                              <option value="">Select level</option>
                              <option value="Beginner">Beginner</option>
                              <option value="Intermediate">Intermediate</option>
                              <option value="Advanced">Advanced</option>
                              <option value="Expert">Expert</option>
                          </select>
                          <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      </div>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Time Availability */}
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Time Availability <span className="text-red-500">*</span></label>
                      <div className="relative">
                          <Clock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="e.g. 10-15 hrs/week"
                              value={formData.timeAvailability}
                              onChange={(e) => setFormData({...formData, timeAvailability: e.target.value})}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                          />
                      </div>
                  </div>

                  {/* Expected Compensation */}
                  <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-gray-700">Expected Compensation <span className="font-normal text-gray-400">(Optional)</span></label>
                      <div className="relative">
                          <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input 
                              type="text" 
                              placeholder="e.g. $20/hr"
                              value={formData.expectedCompensation}
                              onChange={(e) => setFormData({...formData, expectedCompensation: e.target.value})}
                              className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                          />
                      </div>
                  </div>
              </div>

              {/* Portfolio URL */}
              <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Portfolio or Website <span className="font-normal text-gray-400">(Optional)</span></label>
                  <div className="relative">
                      <LinkIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                          type="url" 
                          placeholder="https://..."
                          value={formData.portfolioUrl}
                          onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                  </div>
              </div>

              {/* Cover Letter */}
              <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Cover Letter / Proposal <span className="text-red-500">*</span></label>
                  <textarea 
                      rows={5}
                      placeholder="Explain your interest and fit for the project..."
                      value={formData.coverLetter}
                      onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500">Briefly describe your relevant experience and motivation.</p>
              </div>

              {/* Statement of Interest */}
              <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Statement of Interest <span className="text-red-500">*</span></label>
                  <textarea 
                      rows={4}
                      placeholder="Why are you interested in this specific project? What unique value would you bring?"
                      value={formData.statementOfInterest}
                      onChange={(e) => setFormData({...formData, statementOfInterest: e.target.value})}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500">This statement will be shared with the project lead alongside your profile.</p>
              </div>

            </div>
        </div>

        {/* Footer Actions */}
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
                 Submitting...
                </>
            ) : (
                'Submit Application'
            )}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );

  return modalContent;
}