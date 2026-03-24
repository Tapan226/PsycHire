/**
 * RequestFormPage — Company-only multi-step request form
 * for requesting Courses, Supervision, or Mentoring for their team.
 * Uses CreateFormWizard for stepper consistency across the platform.
 */

import React, { useState } from 'react';
import {
  ArrowLeft, BookOpen, Users, GraduationCap, CheckCircle2,
  ChevronRight, ChevronLeft, FileText, Calendar,
  Target, DollarSign, Send, AlertCircle, Check, Save,
} from 'lucide-react';
import { toast } from 'sonner';

/* ═══ Types ═══ */

export type RequestType = 'course' | 'supervision' | 'mentoring';

interface RequestFormPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  requestType?: RequestType;
}

const REQUEST_CONFIG: Record<RequestType, {
  title: string; subtitle: string; icon: React.ElementType;
  accentColor: string; accentBg: string;
}> = {
  course: {
    title: 'Request a Course',
    subtitle: 'Describe the training needs for your team and find the right provider',
    icon: BookOpen,
    accentColor: 'text-purple-600',
    accentBg: 'bg-purple-50',
  },
  supervision: {
    title: 'Request Supervision',
    subtitle: 'Find qualified supervisors for your clinical team or trainees',
    icon: Users,
    accentColor: 'text-cyan-700',
    accentBg: 'bg-cyan-50',
  },
  mentoring: {
    title: 'Request Mentoring',
    subtitle: 'Connect your team with experienced mentors in psychology',
    icon: GraduationCap,
    accentColor: 'text-indigo-600',
    accentBg: 'bg-indigo-50',
  },
};

interface WizardStep {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STEPS: WizardStep[] = [
  { id: 'requirements', label: 'Requirements', shortLabel: 'Require', icon: Target },
  { id: 'details', label: 'Program Details', shortLabel: 'Details', icon: FileText },
  { id: 'budget', label: 'Budget & Timeline', shortLabel: 'Budget', icon: DollarSign },
  { id: 'preview', label: 'Preview & Submit', shortLabel: 'Preview', icon: Send },
];

const inputCls = 'w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 transition-all bg-white';

/* ═══ Component ═══ */

export function RequestFormPage({ onBack, onNavigate, requestType = 'course' }: RequestFormPageProps) {
  const config = REQUEST_CONFIG[requestType];

  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    trainingArea: '',
    specialization: '',
    targetAudience: '',
    participantCount: '',
    objectives: '',
    preferredFormat: 'In-Person',
    location: '',
    duration: '',
    frequency: '',
    prerequisites: '',
    description: '',
    budgetRange: '',
    currency: 'INR',
    preferredStartDate: '',
    deadline: '',
    paymentTerms: '',
    additionalNotes: '',
    agreedTerms: false,
  });

  const update = (field: string, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isFirst = currentStep === 0;
  const isLast = currentStep === STEPS.length - 1;
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success('Request submitted successfully!', { description: 'Your request has been sent for admin review.' });
    }, 2000);
  };

  /* ─── Success Screen ─── */
  if (submitted) {
    return (
      <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center max-w-lg w-full">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <p className="text-gray-900 mb-2" style={{ fontSize: 22, fontWeight: 800 }}>Request Submitted!</p>
            <p className="text-gray-500 max-w-sm mx-auto mb-8" style={{ fontSize: 14 }}>
              Your {requestType} request has been submitted for review. Our admin team will review and publish it within 24–48 hours. You'll receive an email notification once approved.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={() => onNavigate('CompanyDashboard')} className="px-6 py-2.5 text-white rounded-xl transition-colors bg-brand-primary hover:bg-brand-primary/90" style={{ fontSize: 13, fontWeight: 700 }}>
                Go to My Listings
              </button>
              <button onClick={onBack} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
                Back to Browse
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Main Form ─── */
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f0f4f8] animate-fade-in">
      {/* ═══ PROGRESS HEADER — matches CreateFormWizard ═══ */}
      <div className="w-full bg-white border-b border-gray-100 sticky top-[72px] z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {STEPS.map((step, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;

                return (
                  <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                    {i > 0 && (
                      <div className={`hidden sm:block h-px flex-1 max-w-8 transition-colors duration-300 ${
                        isCompleted ? 'bg-brand-primary' : 'bg-gray-200'
                      }`} />
                    )}
                    <button
                      onClick={() => i <= currentStep && setCurrentStep(i)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 shrink-0 ${
                        isCurrent
                          ? 'bg-blue-50 text-brand-primary'
                          : isCompleted
                            ? 'text-brand-primary hover:bg-blue-50/50 cursor-pointer'
                            : 'text-gray-400 cursor-default'
                      }`}
                      disabled={i > currentStep}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-brand-primary text-white'
                          : isCurrent
                            ? 'bg-brand-primary text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                        )}
                      </div>
                      <span className="hidden md:inline" style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500 }}>
                        {step.label}
                      </span>
                      <span className="inline md:hidden" style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 500 }}>
                        {step.shortLabel}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-0.5 bg-gray-100 -mx-4 sm:-mx-6">
            <div
              className="h-full bg-brand-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ═══ FORM CONTENT ═══ */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">

        {/* Step: Requirements */}
        {currentStep === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-8 py-6 flex flex-col gap-5 animate-fade-in">
            <div>
              <p className="text-gray-900 mb-1" style={{ fontSize: 17, fontWeight: 700 }}>What are you looking for?</p>
              <p className="text-gray-500" style={{ fontSize: 13 }}>Describe the training or program needs for your team.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Training Area <span className="text-red-500">*</span></label>
                <select value={form.trainingArea} onChange={e => update('trainingArea', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="">Select area</option>
                  <option value="Clinical Psychology">Clinical Psychology</option>
                  <option value="Counselling Psychology">Counselling Psychology</option>
                  <option value="I-O Psychology">I-O Psychology</option>
                  <option value="Child & Developmental">Child & Developmental</option>
                  <option value="Neuropsychology">Neuropsychology</option>
                  <option value="Health Psychology">Health Psychology</option>
                  <option value="Forensic Psychology">Forensic Psychology</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Specialization Focus</label>
                <input type="text" value={form.specialization} onChange={e => update('specialization', e.target.value)} placeholder="e.g., CBT, Trauma-Informed Care" className={inputCls} style={{ fontSize: 14 }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Target Audience <span className="text-red-500">*</span></label>
                <select value={form.targetAudience} onChange={e => update('targetAudience', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="">Select audience</option>
                  <option value="Clinical Team">Clinical Team</option>
                  <option value="Counsellors">Counsellors</option>
                  <option value="Interns & Trainees">Interns & Trainees</option>
                  <option value="HR & Management">HR & Management</option>
                  <option value="All Staff">All Staff</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Number of Participants <span className="text-red-500">*</span></label>
                <input type="number" min={1} value={form.participantCount} onChange={e => update('participantCount', e.target.value)} placeholder="e.g., 15" className={inputCls} style={{ fontSize: 14 }} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Learning Objectives <span className="text-red-500">*</span></label>
              <textarea rows={4} value={form.objectives} onChange={e => update('objectives', e.target.value)} placeholder="Describe the specific skills, knowledge, or competencies you want participants to gain" className={`${inputCls} resize-none`} style={{ fontSize: 14 }} />
            </div>
          </div>
        )}

        {/* Step: Details */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-8 py-6 flex flex-col gap-5 animate-fade-in">
            <div>
              <p className="text-gray-900 mb-1" style={{ fontSize: 17, fontWeight: 700 }}>Program Details</p>
              <p className="text-gray-500" style={{ fontSize: 13 }}>Specify the format, duration, and other requirements.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Preferred Format <span className="text-red-500">*</span></label>
                <select value={form.preferredFormat} onChange={e => update('preferredFormat', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="In-Person">In-Person</option>
                  <option value="Virtual">Virtual</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Location <span className="text-gray-400" style={{ fontWeight: 400 }}>(if in-person)</span></label>
                <input type="text" value={form.location} onChange={e => update('location', e.target.value)} placeholder="e.g., Mumbai, Maharashtra" className={inputCls} style={{ fontSize: 14 }} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Duration <span className="text-red-500">*</span></label>
                <select value={form.duration} onChange={e => update('duration', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="">Select duration</option>
                  <option value="Half day (4 hrs)">Half day (4 hrs)</option>
                  <option value="Full day (8 hrs)">Full day (8 hrs)</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Session Frequency</label>
                <select value={form.frequency} onChange={e => update('frequency', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="">Select frequency</option>
                  <option value="One-time">One-time</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Bi-weekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Prerequisites <span className="text-gray-400" style={{ fontWeight: 400 }}>(Optional)</span></label>
              <input type="text" value={form.prerequisites} onChange={e => update('prerequisites', e.target.value)} placeholder="e.g., RCI Registration, 2+ years clinical experience" className={inputCls} style={{ fontSize: 14 }} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Additional Description</label>
              <textarea rows={3} value={form.description} onChange={e => update('description', e.target.value)} placeholder="Any additional details about what you're looking for" className={`${inputCls} resize-none`} style={{ fontSize: 14 }} />
            </div>
          </div>
        )}

        {/* Step: Budget & Timeline */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-8 py-6 flex flex-col gap-5 animate-fade-in">
            <div>
              <p className="text-gray-900 mb-1" style={{ fontSize: 17, fontWeight: 700 }}>Budget & Timeline</p>
              <p className="text-gray-500" style={{ fontSize: 13 }}>Set your budget range and preferred timeline.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Budget Range <span className="text-red-500">*</span></label>
                <select value={form.budgetRange} onChange={e => update('budgetRange', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="">Select range</option>
                  <option value="Under ₹50,000">Under ₹50,000</option>
                  <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                  <option value="₹1,00,000 – ₹3,00,000">₹1,00,000 – ₹3,00,000</option>
                  <option value="₹3,00,000 – ₹5,00,000">₹3,00,000 – ₹5,00,000</option>
                  <option value="₹5,00,000+">₹5,00,000+</option>
                  <option value="Flexible / Open">Flexible / Open</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Payment Terms</label>
                <select value={form.paymentTerms} onChange={e => update('paymentTerms', e.target.value)} className={inputCls} style={{ fontSize: 14 }}>
                  <option value="">Select terms</option>
                  <option value="Full upfront">Full upfront</option>
                  <option value="50% advance, 50% on completion">50% advance, 50% on completion</option>
                  <option value="Monthly installments">Monthly installments</option>
                  <option value="On completion">On completion</option>
                  <option value="Negotiable">Negotiable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Preferred Start Date</label>
                <input type="date" value={form.preferredStartDate} onChange={e => update('preferredStartDate', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputCls} style={{ fontSize: 14 }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Application Deadline <span className="text-red-500">*</span></label>
                <input type="date" value={form.deadline} onChange={e => update('deadline', e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputCls} style={{ fontSize: 14 }} />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>Additional Notes</label>
              <textarea rows={3} value={form.additionalNotes} onChange={e => update('additionalNotes', e.target.value)} placeholder="Any other details potential providers should know" className={`${inputCls} resize-none`} style={{ fontSize: 14 }} />
            </div>
          </div>
        )}

        {/* Step: Preview & Submit */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 sm:px-8 py-6 flex flex-col gap-5 animate-fade-in">
            <div>
              <p className="text-gray-900 mb-1" style={{ fontSize: 17, fontWeight: 700 }}>Review & Submit</p>
              <p className="text-gray-500" style={{ fontSize: 13 }}>Review your request details before submitting for admin approval.</p>
            </div>

            {/* Summary Sections */}
            <div className="flex flex-col gap-4">
              {/* Requirements */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Requirements</p>
                  <button onClick={() => setCurrentStep(0)} className={config.accentColor} style={{ fontSize: 11, fontWeight: 600 }}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Training Area</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.trainingArea || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Specialization</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.specialization || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Target Audience</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.targetAudience || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Participants</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.participantCount || '—'}</p>
                  </div>
                </div>
                {form.objectives && (
                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Objectives</p>
                    <p className="text-gray-700 mt-0.5" style={{ fontSize: 12 }}>{form.objectives}</p>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Program Details</p>
                  <button onClick={() => setCurrentStep(1)} className={config.accentColor} style={{ fontSize: 11, fontWeight: 600 }}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Format</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.preferredFormat}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Duration</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.duration || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Frequency</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.frequency || '—'}</p>
                  </div>
                  {form.location && (
                    <div>
                      <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Location</p>
                      <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.location}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Budget & Timeline</p>
                  <button onClick={() => setCurrentStep(2)} className={config.accentColor} style={{ fontSize: 11, fontWeight: 600 }}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Budget Range</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.budgetRange || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Payment Terms</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.paymentTerms || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Start Date</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.preferredStartDate || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>Application Deadline</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{form.deadline || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-amber-800" style={{ fontSize: 12, fontWeight: 600 }}>Admin Review Required</p>
                <p className="text-amber-700 mt-0.5" style={{ fontSize: 11 }}>Your request will be reviewed by the PsycHIRE admin team before being published. Providers will then be able to apply.</p>
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox" checked={form.agreedTerms}
                onChange={e => update('agreedTerms', e.target.checked)}
                className="mt-0.5 rounded"
              />
              <span className="text-gray-600" style={{ fontSize: 12 }}>
                I confirm the information provided is accurate, and I authorize PsycHIRE to share these details with potential providers.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* ═══ STICKY FOOTER — matches CreateFormWizard ═══ */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left — Back */}
          <button
            onClick={() => {
              if (isFirst) {
                onBack();
              } else {
                setCurrentStep(currentStep - 1);
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <ChevronLeft size={16} />
            {isFirst ? 'Back to Browse' : 'Back'}
          </button>

          {/* Right — Next / Submit */}
          <div className="flex items-center gap-3">
            {!isLast && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-sm"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}

            {isLast && (
              <button
                onClick={handleSubmit}
                disabled={!form.agreedTerms || submitting}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white transition-all shadow-sm ${
                  form.agreedTerms && !submitting
                    ? 'bg-brand-secondary hover:bg-brand-secondary-hover cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                {submitting ? (
                  <div className="contents">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </div>
                ) : (
                  <div className="contents">
                    <Send size={14} />
                    Submit for Review
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
