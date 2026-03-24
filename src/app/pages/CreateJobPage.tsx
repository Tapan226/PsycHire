import React, { useState } from 'react';
import {
  Briefcase, MapPin, Clock, Building2, Banknote, Calendar, Users,
  FileText, CheckCircle2, Heart, AlertTriangle, GraduationCap, Globe,
  Languages, Star, Tag, Eye, ChevronDown,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';

/* ═══ Types ═══ */

interface JobFormData {
  title: string;
  companyName: string;
  type: string;
  workType: string;
  location: string;
  specialization: string;
  experience: string;
  urgency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  competencies: string[];
  specialRequirements: string[];
  educationBackground: string[];
  salaryFixed: string;
  salaryVariable: string;
  paymentTerms: string;
  benefits: string[];
  deadline: string;
  openPositions: string;
  reportingTo: string;
  populationServed: string[];
  languages: string[];
  tags: string[];
  featured: boolean;
}

const DEFAULT_FORM: JobFormData = {
  title: '', companyName: 'MindCare Clinic', type: 'Full-time', workType: 'On-site',
  location: '', specialization: '', experience: '0-2 years', urgency: '',
  description: '', responsibilities: [''], requirements: [''], competencies: [''],
  specialRequirements: [''], educationBackground: [''],
  salaryFixed: '', salaryVariable: '', paymentTerms: 'Monthly Fixed',
  benefits: [''], deadline: '', openPositions: '1', reportingTo: '',
  populationServed: [''], languages: [''], tags: [''], featured: false,
};

const PREFILLED_FORM: JobFormData = {
  title: 'Junior Child Psychologist', companyName: 'MindCare Clinic', type: 'Full-time',
  workType: 'On-site', location: 'Mumbai, MH, India', specialization: 'Child Psychology',
  experience: '0-2 years', urgency: 'High Priority',
  description: 'We are looking for a compassionate and dedicated Junior Child Psychologist to join our pediatric mental health team.',
  responsibilities: [
    'Conduct initial screenings and assessments for children and adolescents.',
    'Develop and implement individualized treatment plans under supervision.',
    'Facilitate individual and group therapy sessions.',
  ],
  requirements: [
    "Master's degree in Psychology (specialization in Child Psychology preferred).",
    'Valid RCI license or eligibility for licensure is a plus.',
    'Strong understanding of child development and therapeutic modalities.',
  ],
  competencies: ['Play therapy techniques', 'Cognitive-behavioral interventions for children'],
  specialRequirements: ['Willingness to work with children with special needs'],
  educationBackground: ["Master's degree (M.A. / M.Sc.) in Psychology"],
  salaryFixed: '₹35,000/mo', salaryVariable: '₹5,000 - ₹25,000/mo', paymentTerms: 'Monthly Fixed',
  benefits: ['Comprehensive health insurance', 'Professional development allowance', 'Supervision hours for licensure'],
  deadline: '2026-04-15', openPositions: '2', reportingTo: 'Dr. Meera Sharma, Senior Clinical Psychologist',
  populationServed: ['Children (3-12)', 'Adolescents (13-18)'], languages: ['English', 'Hindi'],
  tags: ['Child Psychology', 'Pediatric', 'Entry Level'], featured: false,
};

const STEPS: WizardStep[] = [
  { id: 'basic', label: 'Basic Info', shortLabel: 'Basics' },
  { id: 'details', label: 'Description & Requirements', shortLabel: 'Details' },
  { id: 'compensation', label: 'Compensation & Context', shortLabel: 'Comp.' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review' },
];

const SELECT_OPTIONS = {
  type: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'],
  workType: ['On-site', 'Remote', 'Hybrid'],
  experience: ['0-2 years', '2-5 years', '5-10 years', '10+ years', 'Any'],
  urgency: ['', 'High Priority', 'Urgent', 'Normal'],
  paymentTerms: ['Monthly Fixed', 'Hourly', 'Project-based', 'Stipend'],
  specialization: ['Child Psychology', 'Clinical Psychology', 'Counselling', 'I/O Psychology', 'Neuropsychology', 'Developmental', 'Social Psychology', 'Forensic Psychology', 'Health Psychology', 'Other'],
};

/* ═══ Helpers ═══ */

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          style={{ fontSize: 13 }}
        >
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, required, multiline }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; multiline?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          style={{ fontSize: 13 }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          style={{ fontSize: 13 }}
        />
      )}
    </div>
  );
}

function ListField({ label, items, onChange, placeholder, required }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string; required?: boolean }) {
  const addItem = () => onChange([...items, '']);
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, val: string) => onChange(items.map((item, i) => i === idx ? val : item));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-blue-50 text-brand-primary flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
            <input
              type="text"
              value={item}
              onChange={e => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
              style={{ fontSize: 13 }}
            />
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" style={{ fontSize: 14 }}>×</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addItem} className="self-start flex items-center gap-1.5 text-brand-primary hover:text-brand-primary/80 transition-colors mt-1" style={{ fontSize: 12, fontWeight: 600 }}>
        + Add another
      </button>
    </div>
  );
}

function TagField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  const [input, setInput] = useState('');
  const addTag = () => {
    if (input.trim() && !items.includes(input.trim())) {
      onChange([...items.filter(t => t), input.trim()]);
      setInput('');
    }
  };
  const removeTag = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-1">
        {items.filter(t => t).map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-brand-primary" style={{ fontSize: 12, fontWeight: 600 }}>
            {tag}
            <button onClick={() => removeTag(i)} className="text-blue-400 hover:text-red-500 transition-colors ml-0.5" style={{ fontSize: 14 }}>×</button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
          placeholder={placeholder || 'Type and press Enter...'}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
          style={{ fontSize: 13 }}
        />
        <button onClick={addTag} className="px-3 py-2 rounded-lg bg-blue-50 text-brand-primary hover:bg-blue-100 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>Add</button>
      </div>
    </div>
  );
}

/* ═══ Component ═══ */

interface CreateJobPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editJobId?: string;
}

export function CreateJobPage({ onBack, onNavigate, editMode = false, editJobId }: CreateJobPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<JobFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof JobFormData>(key: K, value: JobFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.title.trim() !== '' && form.location.trim() !== '' && form.description.trim() !== '';

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.location.trim()) missingFields.push('Location');
  if (!form.description.trim()) missingFields.push('Description');

  const handleSaveDraft = () => {
    // Save as draft — navigate back
    onBack();
  };

  const handlePreview = () => {
    // In production would open a preview modal
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowCompliance(true);
  };

  const handleComplianceConfirm = () => {
    setShowCompliance(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8] font-sans animate-fade-in px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <SuccessCelebration
            title={editMode ? 'Job Updated Successfully' : 'Job Submitted for Review'}
            subtitle={editMode
              ? 'Your changes have been saved. The updated listing will be reviewed by our team.'
              : 'Your job listing has been submitted and will be reviewed by our admin team within 24-48 hours.'}
            actionLabel="Go to My Listings"
            onAction={() => onNavigate('My Listings')}
            secondaryLabel="Create Another Job"
            onSecondary={() => {
              setIsSubmitted(false);
              setCurrentStep(0);
              setForm(DEFAULT_FORM);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <CreateFormWizard
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        onSubmit={handleSubmit}
        onBack={onBack}
        entityType="Job"
        canSubmit={canSubmit}
        missingFields={missingFields}
      >
        {/* ═══ STEP 1: BASIC INFO ═══ */}
        {currentStep === 0 && (
          <div className="animate-fade-in">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Briefcase size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Basic Information</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Core details about the position</p>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <TextField label="Job Title" value={form.title} onChange={v => updateField('title', v)} placeholder="e.g., Junior Child Psychologist" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Employment Type" value={form.type} onChange={v => updateField('type', v)} options={SELECT_OPTIONS.type} required />
                  <SelectField label="Work Mode" value={form.workType} onChange={v => updateField('workType', v)} options={SELECT_OPTIONS.workType} required />
                </div>
                <TextField label="Location" value={form.location} onChange={v => updateField('location', v)} placeholder="e.g., Mumbai, MH, India" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Specialization" value={form.specialization} onChange={v => updateField('specialization', v)} options={SELECT_OPTIONS.specialization} required />
                  <SelectField label="Experience Required" value={form.experience} onChange={v => updateField('experience', v)} options={SELECT_OPTIONS.experience} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Urgency" value={form.urgency} onChange={v => updateField('urgency', v)} options={SELECT_OPTIONS.urgency} />
                  <div className="flex items-end gap-3 pb-0.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${form.featured ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}
                        onClick={() => updateField('featured', !form.featured)}
                      >
                        {form.featured && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
                        <Star size={14} className="inline text-amber-500 mr-1" />
                        Mark as Featured
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: DESCRIPTION & REQUIREMENTS ═══ */}
        {currentStep === 1 && (
          <div className="animate-fade-in flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FileText size={18} className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Job Description</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Describe the role and what it involves</p>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <TextField label="About the Role" value={form.description} onChange={v => updateField('description', v)} placeholder="Describe the role, team, and impact..." required multiline />
                <ListField label="Key Responsibilities" items={form.responsibilities} onChange={v => updateField('responsibilities', v)} placeholder="Add a responsibility..." required />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Requirements & Qualifications</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>What candidates need to apply</p>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <ListField label="Requirements" items={form.requirements} onChange={v => updateField('requirements', v)} placeholder="Add a requirement..." required />
                <ListField label="Key Competencies" items={form.competencies} onChange={v => updateField('competencies', v)} placeholder="Add a competency..." />
                <ListField label="Education Background" items={form.educationBackground} onChange={v => updateField('educationBackground', v)} placeholder="Add education requirement..." />
                <ListField label="Special Requirements" items={form.specialRequirements} onChange={v => updateField('specialRequirements', v)} placeholder="Add a special requirement..." />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: COMPENSATION & CONTEXT ═══ */}
        {currentStep === 2 && (
          <div className="animate-fade-in flex flex-col gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Banknote size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Compensation & Benefits</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Salary details and perks</p>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <TextField label="Fixed Salary" value={form.salaryFixed} onChange={v => updateField('salaryFixed', v)} placeholder="e.g., ₹35,000/mo" required />
                  <TextField label="Variable Pay" value={form.salaryVariable} onChange={v => updateField('salaryVariable', v)} placeholder="e.g., ₹5,000 - ₹25,000/mo" />
                  <SelectField label="Payment Terms" value={form.paymentTerms} onChange={v => updateField('paymentTerms', v)} options={SELECT_OPTIONS.paymentTerms} />
                </div>
                <ListField label="Benefits & Perks" items={form.benefits} onChange={v => updateField('benefits', v)} placeholder="Add a benefit..." />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Users size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Role Context & Details</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Additional role context</p>
                </div>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Application Deadline" value={form.deadline} onChange={v => updateField('deadline', v)} placeholder="YYYY-MM-DD" required />
                  <TextField label="Open Positions" value={form.openPositions} onChange={v => updateField('openPositions', v)} placeholder="e.g., 2" />
                </div>
                <TextField label="Reporting To" value={form.reportingTo} onChange={v => updateField('reportingTo', v)} placeholder="e.g., Dr. Meera Sharma, Senior Clinical Psychologist" />
                <TagField label="Population Served" items={form.populationServed} onChange={v => updateField('populationServed', v)} placeholder="e.g., Children (3-12)" />
                <TagField label="Languages Required" items={form.languages} onChange={v => updateField('languages', v)} placeholder="e.g., English, Hindi" />
                <TagField label="Tags" items={form.tags} onChange={v => updateField('tags', v)} placeholder="e.g., Clinical, Pediatric" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: REVIEW ═══ */}
        {currentStep === 3 && (
          <div className="animate-fade-in flex flex-col gap-5">
            {/* Preview Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Eye size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Review Your Listing</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Please review all details before submitting</p>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-6">
                {/* Title block */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {form.featured && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700" style={{ fontSize: 10, fontWeight: 700 }}>
                        <Star size={10} className="fill-current" /> Featured
                      </span>
                    )}
                    {form.urgency && (
                      <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600" style={{ fontSize: 10, fontWeight: 700 }}>{form.urgency}</span>
                    )}
                  </div>
                  <p className="text-gray-900 mb-1" style={{ fontSize: 20, fontWeight: 800 }}>{form.title || 'Untitled Job'}</p>
                  <p className="text-gray-600" style={{ fontSize: 13 }}>{form.companyName}</p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {form.location && <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}><MapPin size={12} />{form.location}</span>}
                    <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}><Briefcase size={12} />{form.type}</span>
                    <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}><Globe size={12} />{form.workType}</span>
                    {form.experience && <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}><Clock size={12} />{form.experience}</span>}
                  </div>
                </div>

                {/* Summary sections */}
                {[
                  { label: 'Description', value: form.description, icon: FileText },
                  { label: 'Salary', value: [form.salaryFixed, form.salaryVariable].filter(Boolean).join(' + '), icon: Banknote },
                  { label: 'Deadline', value: form.deadline, icon: Calendar },
                  { label: 'Specialization', value: form.specialization, icon: Tag },
                ].map(item => item.value && (
                  <div key={item.label} className="flex items-start gap-3">
                    <item.icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-gray-500 mb-0.5" style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</p>
                      <p className="text-gray-800" style={{ fontSize: 13 }}>{item.value}</p>
                    </div>
                  </div>
                ))}

                {/* List sections */}
                {[
                  { label: 'Responsibilities', items: form.responsibilities.filter(Boolean) },
                  { label: 'Requirements', items: form.requirements.filter(Boolean) },
                  { label: 'Benefits', items: form.benefits.filter(Boolean) },
                ].map(section => section.items.length > 0 && (
                  <div key={section.label}>
                    <p className="text-gray-500 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>{section.label}</p>
                    <ul className="flex flex-col gap-1.5">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 mt-1.5" />
                          <span className="text-gray-700" style={{ fontSize: 13 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Tags */}
                {form.tags.filter(Boolean).length > 0 && (
                  <div>
                    <p className="text-gray-500 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.filter(Boolean).map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100" style={{ fontSize: 11, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Validation warnings */}
                {!canSubmit && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                    <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                    <p className="text-amber-700" style={{ fontSize: 12, fontWeight: 500 }}>
                      Please complete all required fields (Title, Location, Description) before submitting.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CreateFormWizard>

      <ComplianceChecklist
        isOpen={showCompliance}
        onClose={() => setShowCompliance(false)}
        onConfirm={handleComplianceConfirm}
        entityType="Job Listing"
      />
    </>
  );
}