import React, { useState } from 'react';
import {
  Users, MapPin, Clock, Banknote, Calendar, FileText,
  CheckCircle2, Globe, Languages, Award, Layers, Upload, Plus, X, Wifi,
  ShieldCheck, BookOpen, Briefcase, Star, DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import { SUPERVISION_DOMAINS, SUPERVISION_PURPOSES, SUPERVISION_MODES, SUPERVISION_SESSION_TYPES } from '@/app/data/supervision';
import { CURRENCY_SYMBOLS } from '@/app/utils/currency';

/* ═══ Types ═══ */

interface SupervisionFormData {
  title: string;
  domain: string;
  specializations: string[];
  purpose: string[];
  mode: string;
  sessionType: string;
  frequency: string;
  description: string;
  approach: string;
  eligibility: string;
  maxSupervisees: string;
  isPaid: boolean;
  feePerSession: string;
  currency: string;
  location: string;
  availability: string;
  languages: string[];
  credentials: string[];
  outcomes: string[];
  brochureFile: string;
  termsAndConditions: string;
  featured: boolean;
}

const DEFAULT_FORM: SupervisionFormData = {
  title: '', domain: '', specializations: [''], purpose: [], mode: '',
  sessionType: '', frequency: '', description: '', approach: '',
  eligibility: '', maxSupervisees: '', isPaid: true, feePerSession: '',
  currency: 'INR', location: '', availability: '', languages: ['English'],
  credentials: [''], outcomes: [''], brochureFile: '', termsAndConditions: '',
  featured: false,
};

const PREFILLED_FORM: SupervisionFormData = {
  title: 'Clinical Supervision — CBT & Integrative Track',
  domain: 'Clinical Psychology',
  specializations: ['CBT Supervision', 'Case Formulation', 'Licensure Preparation'],
  purpose: ['Licensure', 'Skill Building'],
  mode: 'Online',
  sessionType: '1:1',
  frequency: 'Weekly',
  description: 'Structured clinical supervision program for M.Phil. trainees and early-career clinicians pursuing RCI licensure. Focuses on evidence-based case formulation, therapeutic technique refinement, and ethical practice development through reflective supervision.',
  approach: 'Integrative model combining developmental supervision with competency-based assessment. Uses reflective practice journals, recorded session reviews, and structured case presentations.',
  eligibility: "M.Phil. in Clinical Psychology (completed or enrolled). Minimum 50 hours of direct client contact. Must be willing to submit recorded sessions for review.",
  maxSupervisees: '6',
  isPaid: true,
  feePerSession: '1000',
  currency: 'INR',
  location: 'Mumbai, India (Online sessions via Google Meet)',
  availability: 'Weekday evenings (6–8 PM IST), Saturday mornings by appointment',
  languages: ['English', 'Hindi'],
  credentials: ['RCI Supervisor License (CLP/SUP/2014)', 'Ph.D. Clinical Psychology, NIMHANS', 'EMDR Trained Clinician'],
  outcomes: [
    'Complete supervised clinical hours required for RCI licensure',
    'Develop competency in CBT case formulation and treatment planning',
    'Build skills in therapeutic process analysis and self-reflection',
  ],
  brochureFile: '',
  termsAndConditions: 'All supervisees must agree to the supervision contract, including confidentiality of case material, regular attendance, and submission of session recordings for review. Supervisees may terminate with 2 weeks notice.',
  featured: false,
};

const STEPS: WizardStep[] = [
  { id: 'info', label: 'Basic Information', shortLabel: 'Info', icon: <Users size={16} /> },
  { id: 'structure', label: 'Structure & Approach', shortLabel: 'Structure', icon: <Layers size={16} /> },
  { id: 'logistics', label: 'Logistics & Pricing', shortLabel: 'Logistics', icon: <Banknote size={16} /> },
  { id: 'credentials', label: 'Credentials & Outcomes', shortLabel: 'Credentials', icon: <Award size={16} /> },
  { id: 'preview', label: 'Preview & Submit', shortLabel: 'Preview', icon: <CheckCircle2 size={16} /> },
];

const COMPLIANCE_ITEMS = [
  'Supervisor holds valid RCI registration or equivalent credential',
  'Supervision approach and methods are clearly described',
  'Fee structure is transparent and clearly stated',
  'Eligibility criteria are fair and non-discriminatory',
  'Terms & conditions are clearly outlined',
  'Contact information and availability are accurate',
];

const FREQUENCIES = ['Weekly', 'Biweekly', 'Monthly', 'Custom'];

/* ═══ Component ═══ */

interface CreateSupervisionPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editSupervisionId?: string;
}

export function CreateSupervisionPage({ onBack, onNavigate, editMode = false, editSupervisionId }: CreateSupervisionPageProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SupervisionFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceComplete, setComplianceComplete] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const update = <K extends keyof SupervisionFormData>(key: K, value: SupervisionFormData[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const updateArrayField = (key: 'specializations' | 'credentials' | 'outcomes' | 'languages', index: number, value: string) => {
    setForm(prev => ({ ...prev, [key]: prev[key].map((v, i) => i === index ? value : v) }));
  };

  const addArrayItem = (key: 'specializations' | 'credentials' | 'outcomes' | 'languages') => {
    setForm(prev => ({ ...prev, [key]: [...prev[key], ''] }));
  };

  const removeArrayItem = (key: 'specializations' | 'credentials' | 'outcomes' | 'languages', index: number) => {
    setForm(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  const togglePurpose = (purpose: string) => {
    setForm(prev => ({
      ...prev,
      purpose: prev.purpose.includes(purpose)
        ? prev.purpose.filter(p => p !== purpose)
        : [...prev.purpose, purpose],
    }));
  };

  const canSubmit = form.title.trim() !== '' && form.domain !== '' && form.description.trim() !== '' && form.approach.trim() !== '' && form.location.trim() !== '';

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.domain) missingFields.push('Domain');
  if (!form.description.trim()) missingFields.push('Description');
  if (!form.approach.trim()) missingFields.push('Supervision Approach');
  if (!form.sessionType) missingFields.push('Session Type');
  if (!form.frequency) missingFields.push('Frequency');
  if (!form.location.trim()) missingFields.push('Location');

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowCompliance(true);
  };

  const handleSaveDraft = () => {
    setSavedDraft(true);
    setTimeout(() => onBack(), 1500);
  };

  if (submitted) {
    return (
      <SuccessCelebration
        title={editMode ? 'Supervision Updated!' : 'Supervision Submitted!'}
        subtitle={editMode ? 'Your supervision listing has been updated and resubmitted for review.' : 'Your supervision offering has been submitted for admin review. You\'ll be notified once it\'s approved.'}
        accentColor="cyan"
        primaryAction={{ label: 'Go to My Listings', onClick: () => onNavigate('CompanyDashboard') }}
        secondaryAction={{ label: 'Create Another', onClick: () => { setSubmitted(false); setStep(0); setForm(DEFAULT_FORM); setComplianceComplete(false); } }}
      />
    );
  }

  /* ═══ Render fields ═══ */
  const inputClasses = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 transition-all";
  const labelClasses = "text-gray-700 mb-1.5 block";
  const labelStyle = { fontSize: 13, fontWeight: 600 } as const;

  const renderStep = () => {
    switch (step) {
      case 0: // Basic Information
        return (
          <div className="flex flex-col gap-6">
            <div>
              <p style={labelStyle} className={labelClasses}>Supervision Title *</p>
              <input className={inputClasses} style={{ fontSize: 14 }} placeholder="e.g., Clinical Supervision — CBT Track" value={form.title} onChange={e => update('title', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p style={labelStyle} className={labelClasses}>Domain *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.domain} onChange={e => update('domain', e.target.value)}>
                  <option value="">Select domain</option>
                  {SUPERVISION_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <p style={labelStyle} className={labelClasses}>Mode *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.mode} onChange={e => update('mode', e.target.value)}>
                  <option value="">Select mode</option>
                  {SUPERVISION_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Purpose(s) *</p>
              <div className="flex flex-wrap gap-2">
                {SUPERVISION_PURPOSES.map(p => (
                  <button key={p} onClick={() => togglePurpose(p)} className={`px-4 py-2 rounded-lg border text-[13px] font-semibold transition-all ${form.purpose.includes(p) ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Specializations</p>
              <div className="flex flex-col gap-2">
                {form.specializations.map((s, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="e.g., CBT Supervision" value={s} onChange={e => updateArrayField('specializations', i, e.target.value)} />
                    {form.specializations.length > 1 && <button onClick={() => removeArrayItem('specializations', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArrayItem('specializations')} className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add specialization</button>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Description *</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={4} placeholder="Describe your supervision offering..." value={form.description} onChange={e => update('description', e.target.value)} />
            </div>
          </div>
        );
      case 1: // Structure & Approach
        return (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p style={labelStyle} className={labelClasses}>Session Type *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.sessionType} onChange={e => update('sessionType', e.target.value)}>
                  <option value="">Select type</option>
                  {SUPERVISION_SESSION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <p style={labelStyle} className={labelClasses}>Frequency *</p>
                <select className={inputClasses} style={{ fontSize: 14 }} value={form.frequency} onChange={e => update('frequency', e.target.value)}>
                  <option value="">Select frequency</option>
                  {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Supervision Approach *</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={4} placeholder="Describe your supervision style and methodology..." value={form.approach} onChange={e => update('approach', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Eligibility Criteria *</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={3} placeholder="Who is eligible to apply for this supervision?" value={form.eligibility} onChange={e => update('eligibility', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Maximum Supervisees</p>
              <input className={inputClasses} style={{ fontSize: 14 }} type="number" placeholder="e.g., 6" value={form.maxSupervisees} onChange={e => update('maxSupervisees', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Terms & Conditions</p>
              <textarea className={inputClasses} style={{ fontSize: 14 }} rows={3} placeholder="Outline the supervision agreement terms..." value={form.termsAndConditions} onChange={e => update('termsAndConditions', e.target.value)} />
            </div>
          </div>
        );
      case 2: // Logistics & Pricing
        return (
          <div className="flex flex-col gap-6">
            <div>
              <p style={labelStyle} className={labelClasses}>Payment</p>
              <div className="flex gap-3">
                {[{ label: 'Paid', value: true }, { label: 'Pro Bono', value: false }].map(opt => (
                  <button key={String(opt.value)} onClick={() => update('isPaid', opt.value)} className={`flex-1 px-4 py-3 rounded-xl border text-[13px] font-semibold transition-all ${form.isPaid === opt.value ? 'bg-cyan-50 border-cyan-300 text-cyan-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {form.isPaid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p style={labelStyle} className={labelClasses}>Fee per Session *</p>
                  <input className={inputClasses} style={{ fontSize: 14 }} type="number" placeholder="e.g., 1000" value={form.feePerSession} onChange={e => update('feePerSession', e.target.value)} />
                </div>
                <div>
                  <p style={labelStyle} className={labelClasses}>Currency</p>
                  <select className={inputClasses} style={{ fontSize: 14 }} value={form.currency} onChange={e => update('currency', e.target.value)}>
                    <option value="INR">{'INR (' + CURRENCY_SYMBOLS.INR + ')'}</option>
                    <option value="USD">USD ($)</option>
                    <option value="GBP">{'GBP (' + CURRENCY_SYMBOLS.GBP + ')'}</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <p style={labelStyle} className={labelClasses}>Location *</p>
              <input className={inputClasses} style={{ fontSize: 14 }} placeholder="e.g., Mumbai, India" value={form.location} onChange={e => update('location', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Availability *</p>
              <input className={inputClasses} style={{ fontSize: 14 }} placeholder="e.g., Weekday evenings (6–8 PM IST)" value={form.availability} onChange={e => update('availability', e.target.value)} />
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Languages</p>
              <div className="flex flex-col gap-2">
                {form.languages.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="e.g., English" value={l} onChange={e => updateArrayField('languages', i, e.target.value)} />
                    {form.languages.length > 1 && <button onClick={() => removeArrayItem('languages', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArrayItem('languages')} className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add language</button>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Upload Brochure (optional)</p>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 text-gray-400 hover:border-cyan-300 hover:text-cyan-500 transition-colors cursor-pointer">
                <Upload size={24} />
                <p style={{ fontSize: 13 }}>Click or drag to upload brochure (PDF)</p>
              </div>
            </div>
          </div>
        );
      case 3: // Credentials & Outcomes
        return (
          <div className="flex flex-col gap-6">
            <div>
              <p style={labelStyle} className={labelClasses}>Supervisor Credentials *</p>
              <div className="flex flex-col gap-2">
                {form.credentials.map((c, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="e.g., RCI Supervisor License" value={c} onChange={e => updateArrayField('credentials', i, e.target.value)} />
                    {form.credentials.length > 1 && <button onClick={() => removeArrayItem('credentials', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArrayItem('credentials')} className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add credential</button>
              </div>
            </div>
            <div>
              <p style={labelStyle} className={labelClasses}>Learning Outcomes</p>
              <div className="flex flex-col gap-2">
                {form.outcomes.map((o, i) => (
                  <div key={i} className="flex gap-2">
                    <input className={`${inputClasses} flex-1`} style={{ fontSize: 14 }} placeholder="What will supervisees achieve?" value={o} onChange={e => updateArrayField('outcomes', i, e.target.value)} />
                    {form.outcomes.length > 1 && <button onClick={() => removeArrayItem('outcomes', i)} className="p-2 text-gray-400 hover:text-red-500"><X size={16} /></button>}
                  </div>
                ))}
                <button onClick={() => addArrayItem('outcomes')} className="text-cyan-600 hover:text-cyan-700 flex items-center gap-1 self-start" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={14} /> Add outcome</button>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
              <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="w-4 h-4 accent-cyan-600" />
              <div>
                <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>Feature this listing</p>
                <p className="text-gray-500" style={{ fontSize: 12 }}>Featured listings appear at the top of search results</p>
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
                  <p className="text-gray-900" style={{ fontSize: 20, fontWeight: 800 }}>{form.title || 'Untitled Supervision'}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {form.domain && <span className="px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200" style={{ fontSize: 11, fontWeight: 600 }}>{form.domain}</span>}
                    {form.purpose.map(p => <span key={p} className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200" style={{ fontSize: 11, fontWeight: 600 }}>{p}</span>)}
                    {form.mode && <span className="px-2.5 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200" style={{ fontSize: 11, fontWeight: 600 }}>{form.mode}</span>}
                  </div>
                </div>
                {form.isPaid && form.feePerSession && (
                  <div className="text-right">
                    <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{CURRENCY_SYMBOLS[form.currency]}{form.feePerSession}</p>
                    <p className="text-gray-500" style={{ fontSize: 11 }}>per session</p>
                  </div>
                )}
              </div>
              {form.description && <p className="text-gray-600 mb-4" style={{ fontSize: 13, lineHeight: 1.6 }}>{form.description}</p>}
              <div className="grid grid-cols-2 gap-3">
                {form.sessionType && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><Users size={14} className="text-cyan-600" /> {form.sessionType}</div>}
                {form.frequency && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><Clock size={14} className="text-cyan-600" /> {form.frequency}</div>}
                {form.location && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><MapPin size={14} className="text-cyan-600" /> {form.location}</div>}
                {form.maxSupervisees && <div className="flex items-center gap-2 text-gray-600" style={{ fontSize: 12 }}><Users size={14} className="text-cyan-600" /> Max {form.maxSupervisees} supervisees</div>}
              </div>
            </div>
            {form.credentials.filter(Boolean).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Credentials</p>
                <div className="flex flex-col gap-2">
                  {form.credentials.filter(Boolean).map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-gray-600" style={{ fontSize: 13 }}>
                      <Award size={14} className="text-cyan-600 mt-0.5 shrink-0" /> {c}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {form.outcomes.filter(Boolean).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Learning Outcomes</p>
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
        onSaveDraft={handleSaveDraft}
        onPreview={() => setStep(4)}
        onSubmit={handleSubmit}
        onBack={onBack}
        accentColor="cyan"
        accentHex="#06b6d4"
        isLastStepPreview
        canSubmit={canSubmit}
        entityType="Supervision"
        missingFields={missingFields}
      >
        {renderStep()}
      </CreateFormWizard>

      <ComplianceChecklist
        isOpen={showCompliance}
        onClose={() => setShowCompliance(false)}
        onComplete={() => { setComplianceComplete(true); setShowCompliance(false); setSubmitted(true); }}
        items={COMPLIANCE_ITEMS}
        entityType="Supervision"
        accentColor="cyan"
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