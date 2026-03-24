import React, { useState } from 'react';
import {
  GraduationCap, MapPin, Clock, Banknote, Calendar, FileText,
  CheckCircle2, Globe, Award, Layers, Upload, Plus, X,
  Users, BookOpen, Star, Heart,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import { MENTORSHIP_DOMAINS } from '@/app/data/mentorship';
import { CURRENCY_SYMBOLS } from '@/app/utils/currency';

/* ═══ Types ═══ */

interface CohortFormData {
  title: string;
  domain: string;
  focusAreas: string[];
  format: string;
  frequency: string;
  commitment: string;
  description: string;
  mentorshipApproach: string;
  eligibility: string;
  maxMentees: string;
  feePerSession: string;
  currency: string;
  location: string;
  availability: string;
  languages: string[];
  qualifications: string[];
  outcomes: string[];
  sessionStructure: string;
  brochureFile: string;
  featured: boolean;
}

const DEFAULT_FORM: CohortFormData = {
  title: '', domain: '', focusAreas: [''], format: '', frequency: '',
  commitment: '', description: '', mentorshipApproach: '', eligibility: '',
  maxMentees: '', feePerSession: '', currency: 'INR', location: '',
  availability: '', languages: ['English'], qualifications: [''],
  outcomes: [''], sessionStructure: '', brochureFile: '', featured: false,
};

const PREFILLED_FORM: CohortFormData = {
  title: 'Early Career Clinical Psychologist Cohort',
  domain: 'Clinical Psychology',
  focusAreas: ['Licensure Preparation', 'Building a Private Practice', 'Clinical Case Conceptualization'],
  format: 'Group + 1:1',
  frequency: 'Biweekly',
  commitment: '3 Months',
  description: 'A structured mentoring cohort for early-career clinical psychologists navigating the transition from training to independent practice. Combines group learning sessions with individual mentoring to address career development, licensure preparation, and clinical skill refinement.',
  mentorshipApproach: 'Structured goal-setting with accountability check-ins. Combines didactic sessions on career topics with reflective practice and peer learning. Each mentee receives a personalized action plan.',
  eligibility: "M.Phil. or Ph.D. in Clinical Psychology (completed within the last 3 years). Currently in or transitioning to clinical practice. Must commit to attending all group sessions.",
  maxMentees: '8',
  feePerSession: '800',
  currency: 'INR',
  location: 'Mumbai, India (Hybrid — online group sessions, optional in-person 1:1)',
  availability: 'Alternate Saturdays 10 AM – 12 PM (Group), Flexible for 1:1',
  languages: ['English', 'Hindi'],
  qualifications: ['Ph.D. Clinical Psychology, University of Mumbai', 'RCI-Licensed Clinical Psychologist', '15+ years clinical supervision experience'],
  outcomes: [
    'Develop a clear career roadmap with actionable milestones',
    'Build confidence in independent clinical decision-making',
    'Establish professional networking within the cohort community',
  ],
  sessionStructure: 'Group sessions: Topic presentation (30 min) + Case discussion (30 min) + Q&A (30 min). 1:1 sessions: Goal review + focused mentoring (45 min).',
  brochureFile: '',
  featured: false,
};

const STEPS: WizardStep[] = [
  { id: 'info', label: 'Cohort Details', shortLabel: 'Details', icon: <GraduationCap size={16} /> },
  { id: 'structure', label: 'Structure & Approach', shortLabel: 'Structure', icon: <Layers size={16} /> },
  { id: 'logistics', label: 'Logistics & Pricing', shortLabel: 'Logistics', icon: <Banknote size={16} /> },
  { id: 'outcomes', label: 'Qualifications & Outcomes', shortLabel: 'Outcomes', icon: <Award size={16} /> },
  { id: 'preview', label: 'Preview & Submit', shortLabel: 'Preview', icon: <CheckCircle2 size={16} /> },
];

const COMPLIANCE_ITEMS = [
  'Mentor holds relevant professional qualifications',
  'Cohort structure and schedule are clearly described',
  'Fee structure is transparent and fairly communicated',
  'Eligibility criteria are inclusive and clearly stated',
  'Mentorship approach and goals are well-defined',
  'Contact information and availability are accurate',
];

const FORMATS = ['Group Only', 'Group + 1:1', '1:1 Only'];
const FREQUENCIES = ['Weekly', 'Biweekly', 'Monthly'];
const COMMITMENTS = ['1 Session', '1 Month', '3 Months', '6 Months'];

/* ═══ Component ═══ */

interface CreateCohortPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editCohortId?: string;
}

export function CreateCohortPage({ onBack, onNavigate, editMode = false }: CreateCohortPageProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CohortFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceComplete, setComplianceComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const update = <K extends keyof CohortFormData>(key: K, value: CohortFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const updateArr = (key: 'focusAreas' | 'qualifications' | 'outcomes' | 'languages', i: number, v: string) =>
    setForm(prev => ({ ...prev, [key]: prev[key].map((x, idx) => idx === i ? v : x) }));

  const addArr = (key: 'focusAreas' | 'qualifications' | 'outcomes' | 'languages') =>
    setForm(prev => ({ ...prev, [key]: [...prev[key], ''] }));

  const removeArr = (key: 'focusAreas' | 'qualifications' | 'outcomes' | 'languages', i: number) =>
    setForm(prev => ({ ...prev, [key]: prev[key].filter((_, idx) => idx !== i) }));

  const canSubmit = form.title.trim() !== '' && form.domain !== '' && form.description.trim() !== '' && form.mentorshipApproach.trim() !== '' && form.location.trim() !== '';

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.domain) missingFields.push('Domain');
  if (!form.description.trim()) missingFields.push('Description');
  if (!form.mentorshipApproach.trim()) missingFields.push('Mentorship Approach');
  if (!form.format) missingFields.push('Format');
  if (!form.frequency) missingFields.push('Frequency');
  if (!form.location.trim()) missingFields.push('Location');

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowCompliance(true);
  };

  if (submitted) {
    return (
      <SuccessCelebration
        title={editMode ? 'Cohort Updated!' : 'Cohort Submitted!'}
        subtitle={editMode ? 'Your mentoring cohort has been updated and resubmitted for review.' : 'Your mentoring cohort has been submitted for admin review. You\'ll be notified once approved.'}
        accentColor="indigo"
        primaryAction={{ label: 'Go to My Listings', onClick: () => onNavigate('CompanyDashboard') }}
        secondaryAction={{ label: 'Create Another', onClick: () => { setSubmitted(false); setStep(0); setForm(DEFAULT_FORM); setComplianceComplete(false); } }}
      />
    );
  }

  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 transition-all";
  const labelClasses = "text-gray-700 mb-1.5 block";
  const labelStyle = { fontSize: 13, fontWeight: 600 } as const;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <p style={labelStyle} className={labelClasses}>Cohort Title *</p>
              <input className={inputClasses} style={{ fontSize: 14 }} placeholder="e.g., Early Career Clinical Psychologist Cohort" value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p style={labelStyle} className={labelClasses}>Domain *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.domain} onChange={e => update('domain', e.target.value)}>
                  <option value="">Select domain</option>
                  {MENTORSHIP_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <p style={labelStyle} className={labelClasses}>Format *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.format} onChange={e => update('format', e.target.value)}>
                  <option value="">Select format</option>
                  {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Focus Areas</p>
              <div className="flex flex-col gap-2">
                {form.focusAreas.map((f, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="e.g., Career Development" value={f} onChange={e => updateArr('focusAreas', i, e.target.value)} />
                    {form.focusAreas.length > 1 && <button onClick={() => removeArr('focusAreas', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArr('focusAreas')} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add focus area</button>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Description *</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={4} placeholder="Describe your mentoring cohort..." value={form.description} onChange={e => update('description', e.target.value)} />
            </div>
          </div>
        );
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p style={labelStyle} className={labelClasses}>Session Frequency *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.frequency} onChange={e => update('frequency', e.target.value)}>
                  <option value="">Select frequency</option>
                  {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <p style={labelStyle} className={labelClasses}>Commitment Duration *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.commitment} onChange={e => update('commitment', e.target.value)}>
                  <option value="">Select commitment</option>
                  {COMMITMENTS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Mentorship Approach *</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={4} placeholder="How do you structure mentorship sessions?" value={form.mentorshipApproach} onChange={e => update('mentorshipApproach', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Session Structure</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={3} placeholder="Describe a typical session..." value={form.sessionStructure} onChange={e => update('sessionStructure', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Eligibility Criteria *</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={3} placeholder="Who is eligible to join this cohort?" value={form.eligibility} onChange={e => update('eligibility', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Maximum Mentees</p>
              <input className={inputClasses} style={{ fontSize: 14 }} type="number" placeholder="e.g., 8" value={form.maxMentees} onChange={e => update('maxMentees', e.target.value)} />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p style={labelStyle} className={labelClasses}>Fee per Session</p>
                <input className={inputClasses} style={{ fontSize: 14 }} type="number" placeholder="e.g., 800 (leave empty for free)" value={form.feePerSession} onChange={e => update('feePerSession', e.target.value)} />
              </div>
              <div>
                <p style={labelStyle} className={labelClasses}>Currency</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.currency} onChange={e => update('currency', e.target.value)}>
                  {Object.entries(CURRENCY_SYMBOLS).map(([code, symbol]) => (
                    <option key={code} value={code}>{code} ({symbol})</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Location *</p>
              <input className={inputClasses} style={{ fontSize: 14 }} placeholder="e.g., Mumbai, India (Hybrid)" value={form.location} onChange={e => update('location', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Availability *</p>
              <input className={inputClasses} style={{ fontSize: 14 }} placeholder="e.g., Alternate Saturdays 10 AM – 12 PM" value={form.availability} onChange={e => update('availability', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Languages</p>
              <div className="flex flex-col gap-2">
                {form.languages.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} value={l} onChange={e => updateArr('languages', i, e.target.value)} />
                    {form.languages.length > 1 && <button onClick={() => removeArr('languages', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArr('languages')} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add language</button>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Upload Brochure (optional)</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors cursor-pointer">
                <Upload size={24} />
                <p style={{ fontSize: 13 }}>Click or drag to upload brochure (PDF)</p>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <div>
              <p style={labelStyle} className={labelClasses}>Mentor Qualifications *</p>
              <div className="flex flex-col gap-2">
                {form.qualifications.map((q, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="e.g., Ph.D. Clinical Psychology" value={q} onChange={e => updateArr('qualifications', i, e.target.value)} />
                    {form.qualifications.length > 1 && <button onClick={() => removeArr('qualifications', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArr('qualifications')} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add qualification</button>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Expected Outcomes</p>
              <div className="flex flex-col gap-2">
                {form.outcomes.map((o, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="What will mentees achieve?" value={o} onChange={e => updateArr('outcomes', i, e.target.value)} />
                    {form.outcomes.length > 1 && <button onClick={() => removeArr('outcomes', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArr('outcomes')} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add outcome</button>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
              <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="w-4 h-4 accent-indigo-600" />
              <div>
                <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>Feature this cohort</p>
                <p className="text-gray-500" style={{ fontSize: 12 }}>Featured cohorts appear at the top of search results</p>
              </div>
            </div>
          </div>
        );
      case 4: // Preview
        return (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-900" style={{ fontSize: 20, fontWeight: 800 }}>{form.title || 'Untitled Cohort'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {form.domain && <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200" style={{ fontSize: 11, fontWeight: 600 }}>{form.domain}</span>}
                    {form.format && <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200" style={{ fontSize: 11, fontWeight: 600 }}>{form.format}</span>}
                    {form.commitment && <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200" style={{ fontSize: 11, fontWeight: 600 }}>{form.commitment}</span>}
                  </div>
                </div>
                {form.feePerSession && (
                  <div className="text-right">
                    <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{CURRENCY_SYMBOLS[form.currency] || form.currency}{form.feePerSession}</p>
                    <p className="text-gray-500" style={{ fontSize: 11 }}>per session</p>
                  </div>
                )}
              </div>
              {form.description && <p className="text-gray-600 mb-4" style={{ fontSize: 13, lineHeight: 1.6 }}>{form.description}</p>}
              <div className="grid grid-cols-2 gap-3">
                {form.frequency && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><Clock size={14} className="text-indigo-600" /> {form.frequency}</div>}
                {form.location && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><MapPin size={14} className="text-indigo-600" /> {form.location}</div>}
                {form.maxMentees && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><Users size={14} className="text-indigo-600" /> Max {form.maxMentees} mentees</div>}
                {form.commitment && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><Calendar size={14} className="text-indigo-600" /> {form.commitment}</div>}
              </div>
            </div>
            {form.outcomes.filter(Boolean).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Expected Outcomes</p>
                <div className="flex flex-col gap-2">
                  {form.outcomes.filter(Boolean).map((o, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-600" style={{ fontSize: 13 }}>
                      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" /> {o}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <CreateFormWizard
        steps={STEPS}
        currentStep={step}
        onStepChange={setStep}
        onSaveDraft={() => { setSavedDraft(true); setTimeout(() => onBack(), 1500); }}
        onPreview={() => setStep(4)}
        onSubmit={handleSubmit}
        onBack={onBack}
        accentColor="indigo"
        accentHex="#6366f1"
        isLastStepPreview
        canSubmit={canSubmit}
        entityType="Mentoring Cohort"
        missingFields={missingFields}
      >
        {renderStep()}
      </CreateFormWizard>

      <ComplianceChecklist
        isOpen={showCompliance}
        onClose={() => setShowCompliance(false)}
        onComplete={() => { setComplianceComplete(true); setShowCompliance(false); setSubmitted(true); }}
        items={COMPLIANCE_ITEMS}
        entityType="Mentoring Cohort"
        accentColor="indigo"
      />

      {savedDraft && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-gray-200 rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 size={18} className="text-emerald-500" />
          <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Draft saved successfully</p>
          <button onClick={() => setSavedDraft(false)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
        </div>
      )}
    </>
  );
}