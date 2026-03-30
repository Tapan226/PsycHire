import React, { useState } from 'react';
import {
  FolderOpen, MapPin, Clock, Building2, Calendar, Users,
  CheckCircle2, Globe, ChevronDown, Award, Banknote,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';

/* ═══ Types ═══ */

interface ProjectFormData {
  title: string;
  projectType: string;
  segment: string;
  offeredByName: string;
  offeredByType: string;
  format: string;
  location: string;
  durationLabel: string;
  timeCommitment: string;
  level: string;
  description: string;
  fullDescription: string;
  expectedOutcome: string;
  teamRoles: { designation: string; participants: string; experienceLevel: string; skills: string[] }[];
  isPaid: boolean;
  salaryFixed: string;
  salaryVariable: string;
  paymentTerms: string;
  otherBenefits: string[];
  fundingSource: string;
  recognition: string[];
  applicationDeadline: string;
  startDate: string;
  endDate: string;
  tags: string[];
  featured: boolean;
}

const DEFAULT_FORM: ProjectFormData = {
  title: '', projectType: '', segment: '', offeredByName: '', offeredByType: 'Individual',
  format: 'Online', location: '', durationLabel: '', timeCommitment: '', level: 'Intermediate',
  description: '', fullDescription: '', expectedOutcome: '',
  teamRoles: [{ designation: '', participants: '1', experienceLevel: 'Intermediate', skills: [''] }],
  isPaid: false, salaryFixed: '', salaryVariable: '', paymentTerms: 'Monthly upon milestone completion',
  otherBenefits: [''], fundingSource: '', recognition: ['Certificate'],
  applicationDeadline: '', startDate: '', endDate: '', tags: [''], featured: false,
};

const PREFILLED_FORM: ProjectFormData = {
  title: 'AI-Driven Mental Health Chatbot Analysis',
  projectType: 'Research & Pilot Studies',
  segment: 'Startups',
  offeredByName: 'Dr. Neha Kapoor',
  offeredByType: 'Individual',
  format: 'Online',
  location: 'Bangalore, India',
  durationLabel: '3 Months',
  timeCommitment: '10 hrs/week',
  level: 'Intermediate',
  description: 'We are analyzing the efficacy of current AI chatbots in providing initial mental health support.',
  fullDescription: 'The rapid rise of AI chatbots in mental health care presents both opportunities and challenges. This project aims to rigorously evaluate the effectiveness, safety, and user experience of leading mental health chatbots.\n\nAs a collaborator, you will be involved in:\n1. Conducting a literature review on AI in therapy.\n2. Analyzing de-identified conversation logs for sentiment and therapeutic alliance.\n3. Helping design a survey for user feedback.\n4. Assisting in the preparation of the final research paper for publication.',
  expectedOutcome: 'A peer-reviewed research paper evaluating AI chatbot efficacy, accompanied by a standardized evaluation framework.',
  teamRoles: [
    { designation: 'Research Assistant – Data Coding', participants: '2', experienceLevel: 'Intermediate', skills: ['Qualitative Analysis', 'NVivo', 'SPSS/R'] },
    { designation: 'Survey Design & Distribution Lead', participants: '1', experienceLevel: 'Beginner', skills: ['Google Forms / Qualtrics', 'Communication'] },
  ],
  isPaid: true, salaryFixed: '$500', salaryVariable: '$300 (performance-based)',
  paymentTerms: 'Monthly upon milestone completion',
  otherBenefits: ['Access to premium research tools', 'Networking with senior researchers'],
  fundingSource: 'University Research Grant',
  recognition: ['Certificate', 'Co-authorship', 'LOR'],
  applicationDeadline: '2026-04-15', startDate: '2026-05-01', endDate: '2026-07-31',
  tags: ['Artificial Intelligence', 'Clinical Psychology', 'Digital Health'],
  featured: true,
};

const STEPS: WizardStep[] = [
  { id: 'basic', label: 'Basic Info', shortLabel: 'Basics' },
  { id: 'details', label: 'Details & Team', shortLabel: 'Details' },
  { id: 'compensation', label: 'Compensation & Timeline', shortLabel: 'Comp.' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review' },
];

const SELECT_OPTIONS = {
  projectType: [
    'Research & Pilot Studies', 'Community Outreach & Field Work',
    'Diagnostics/Assessment Support', 'Consulting & Training Support',
    'Digital Marketing & Content Support', 'Therapy Case Work & Case Audit',
    'Interdisciplinary Collaboration & Co-creation',
  ],
  segment: [
    'Startups', 'Corporates', 'NGOs/CSRs', 'Research Organizations',
    'Schools & Universities', 'Hospitals & Clinics', 'Government Entities',
  ],
  offeredByType: ['Individual', 'Company'],
  format: ['Online', 'Offline', 'Hybrid'],
  level: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  experienceLevel: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
  paymentTerms: ['Monthly upon milestone completion', 'Lump sum at completion', 'Hourly', 'Stipend'],
  recognition: ['Certificate', 'Co-authorship', 'LOR'],
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
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all"
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

function TextField({ label, value, onChange, placeholder, required, multiline, icon }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; multiline?: boolean; icon?: React.ReactNode }) {
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
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all"
          style={{ fontSize: 13 }}
        />
      ) : (
        <div className="relative">
          {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all`}
            style={{ fontSize: 13 }}
          />
        </div>
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
            <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
            <input
              type="text"
              value={item}
              onChange={e => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all"
              style={{ fontSize: 13 }}
            />
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" style={{ fontSize: 14 }}>×</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addItem} className="self-start flex items-center gap-1.5 text-teal-700 hover:text-teal-600 transition-colors mt-1" style={{ fontSize: 12, fontWeight: 600 }}>
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
          <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700" style={{ fontSize: 12, fontWeight: 600 }}>
            {tag}
            <button onClick={() => removeTag(i)} className="text-teal-400 hover:text-red-500 transition-colors ml-0.5" style={{ fontSize: 14 }}>×</button>
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
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all"
          style={{ fontSize: 13 }}
        />
        <button onClick={addTag} className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>Add</button>
      </div>
    </div>
  );
}

/* ═══ Component ═══ */

interface CreateProjectPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editProjectId?: string;
}

export function CreateProjectPage({ onBack, onNavigate, editMode = false, editProjectId }: CreateProjectPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<ProjectFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateTeamRole = (idx: number, field: string, value: any) => {
    const next = [...form.teamRoles];
    (next[idx] as any)[field] = value;
    updateField('teamRoles', next);
  };

  const addTeamRole = () => {
    updateField('teamRoles', [...form.teamRoles, { designation: '', participants: '1', experienceLevel: 'Intermediate', skills: [''] }]);
  };

  const removeTeamRole = (idx: number) => {
    if (form.teamRoles.length > 1) {
      updateField('teamRoles', form.teamRoles.filter((_, i) => i !== idx));
    }
  };

  const canSubmit = form.title.trim() !== '' && form.projectType !== '' && form.description.trim() !== '';

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.projectType) missingFields.push('Project Type');
  if (!form.description.trim()) missingFields.push('Description');

  const handleSaveDraft = () => { onBack(); };
  const handlePreview = () => {};
  const handleSubmit = () => { if (!canSubmit) return; setShowCompliance(true); };

  const handleComplianceConfirm = () => {
    setShowCompliance(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8] font-sans animate-fade-in px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
          <SuccessCelebration
            title={editMode ? 'Project Updated Successfully' : 'Project Submitted for Review'}
            subtitle={editMode
              ? 'Your changes have been saved. The updated listing will be reviewed by our team.'
              : 'Your project listing has been submitted and will be reviewed by our admin team within 24-48 hours.'}
            actionLabel="Go to My Listings"
            onAction={() => onNavigate('My Listings')}
            secondaryLabel="Create Another Project"
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

  /* ── Render Step Content ── */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <FolderOpen size={18} className="text-teal-700" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Basic Information</p>
                <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>Define the project type and who it's for</p>
              </div>
            </div>

            <TextField label="Project Title" value={form.title} onChange={v => updateField('title', v)} placeholder="e.g. AI-Driven Mental Health Chatbot Analysis" required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Project Type" value={form.projectType} onChange={v => updateField('projectType', v)} options={SELECT_OPTIONS.projectType} required />
              <SelectField label="Industry" value={form.segment} onChange={v => updateField('segment', v)} options={SELECT_OPTIONS.segment} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField label="Offered By" value={form.offeredByName} onChange={v => updateField('offeredByName', v)} placeholder="Your name or organization" required />
              <SelectField label="Offered By Type" value={form.offeredByType} onChange={v => updateField('offeredByType', v)} options={SELECT_OPTIONS.offeredByType} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectField label="Format" value={form.format} onChange={v => updateField('format', v)} options={SELECT_OPTIONS.format} required />
              <TextField label="Location" value={form.location} onChange={v => updateField('location', v)} placeholder="e.g. Bangalore, India or Remote" icon={<MapPin size={16} />} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <TextField label="Duration" value={form.durationLabel} onChange={v => updateField('durationLabel', v)} placeholder="e.g. 3 Months" icon={<Calendar size={16} />} required />
              <TextField label="Time Commitment" value={form.timeCommitment} onChange={v => updateField('timeCommitment', v)} placeholder="e.g. 10 hrs/week" icon={<Clock size={16} />} required />
              <SelectField label="Level" value={form.level} onChange={v => updateField('level', v)} options={SELECT_OPTIONS.level} required />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <FolderOpen size={18} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Project Details</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>Describe the project goals and expected outcomes</p>
                </div>
              </div>

              <TextField label="Short Description" value={form.description} onChange={v => updateField('description', v)} placeholder="Brief summary of the project..." required multiline />
              <TextField label="Full Description" value={form.fullDescription} onChange={v => updateField('fullDescription', v)} placeholder="Detailed project description, methodology, scope of work..." multiline />
              <TextField label="Expected Outcome" value={form.expectedOutcome} onChange={v => updateField('expectedOutcome', v)} placeholder="What will the project deliver?" multiline />

              <TagField label="Tags" items={form.tags} onChange={v => updateField('tags', v)} placeholder="e.g. AI, Clinical Psychology..." />
            </div>

            {/* Team Roles */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Users size={18} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Team & Roles</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>Define the roles you're looking for</p>
                </div>
              </div>

              {form.teamRoles.map((role, idx) => (
                <div key={idx} className="p-5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 700 }}>Role {idx + 1}</p>
                    {form.teamRoles.length > 1 && (
                      <button onClick={() => removeTeamRole(idx)} className="text-gray-400 hover:text-red-500 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>Remove</button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField label="Designation" value={role.designation} onChange={v => updateTeamRole(idx, 'designation', v)} placeholder="e.g. Research Assistant" required />
                    <div className="grid grid-cols-2 gap-4">
                      <TextField label="Positions" value={role.participants} onChange={v => updateTeamRole(idx, 'participants', v)} placeholder="1" />
                      <SelectField label="Level" value={role.experienceLevel} onChange={v => updateTeamRole(idx, 'experienceLevel', v)} options={SELECT_OPTIONS.experienceLevel} />
                    </div>
                  </div>

                  <ListField
                    label="Required Skills"
                    items={role.skills}
                    onChange={v => updateTeamRole(idx, 'skills', v)}
                    placeholder="e.g. SPSS, Qualitative Analysis"
                  />
                </div>
              ))}

              <button
                onClick={addTeamRole}
                className="self-start flex items-center gap-1.5 text-teal-700 hover:text-teal-600 transition-colors"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                + Add another role
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            {/* Compensation */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Banknote size={18} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Compensation</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>Define payment and recognition</p>
                </div>
              </div>

              {/* Paid toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPaid}
                  onChange={e => updateField('isPaid', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500/30"
                />
                <span className="text-gray-700" style={{ fontSize: 14, fontWeight: 600 }}>This is a paid project</span>
              </label>

              {form.isPaid && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TextField label="Fixed Compensation" value={form.salaryFixed} onChange={v => updateField('salaryFixed', v)} placeholder="e.g. $500" icon={<Banknote size={16} />} />
                  <TextField label="Variable / Bonus" value={form.salaryVariable} onChange={v => updateField('salaryVariable', v)} placeholder="e.g. $300" />
                  <SelectField label="Payment Terms" value={form.paymentTerms} onChange={v => updateField('paymentTerms', v)} options={SELECT_OPTIONS.paymentTerms} />
                </div>
              )}

              <TextField label="Funding Source" value={form.fundingSource} onChange={v => updateField('fundingSource', v)} placeholder="e.g. University Research Grant" />

              <ListField label="Other Benefits" items={form.otherBenefits} onChange={v => updateField('otherBenefits', v)} placeholder="e.g. Access to premium tools" />

              {/* Featured toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all cursor-pointer ${form.featured ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}
                  onClick={() => updateField('featured', !form.featured)}>
                  {form.featured && <svg width="12" height="10" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div>
                  <p className="text-gray-800" style={{ fontSize: 13, fontWeight: 700 }}>Mark as Featured</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 11 }}>Featured listings appear at the top of search results and get a special badge</p>
                </div>
              </div>

              {/* Recognition toggles */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Recognition</label>
                <div className="flex flex-wrap gap-2">
                  {SELECT_OPTIONS.recognition.map(r => {
                    const isSelected = form.recognition.includes(r);
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          const next = isSelected ? form.recognition.filter(x => x !== r) : [...form.recognition, r];
                          updateField('recognition', next);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all border ${
                          isSelected
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-amber-200 hover:text-amber-700'
                        }`}
                        style={{ fontSize: 12, fontWeight: 600 }}
                      >
                        <Award size={13} />
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Calendar size={18} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Timeline</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>Set deadlines and project dates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Application Deadline <span className="text-red-400">*</span></label>
                  <input type="date" value={form.applicationDeadline} onChange={e => updateField('applicationDeadline', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all" style={{ fontSize: 13 }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => updateField('startDate', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all" style={{ fontSize: 13 }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>End Date</label>
                  <input type="date" value={form.endDate} onChange={e => updateField('endDate', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition-all" style={{ fontSize: 13 }} />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
                <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-teal-700" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Review Your Project</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: 12 }}>Check all details before submitting</p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Title', value: form.title || '—' },
                  { label: 'Type', value: form.projectType || '—' },
                  { label: 'Industry', value: form.segment || '—' },
                  { label: 'Format', value: form.format },
                  { label: 'Location', value: form.location || '—' },
                  { label: 'Duration', value: form.durationLabel || '—' },
                  { label: 'Time Commitment', value: form.timeCommitment || '—' },
                  { label: 'Level', value: form.level },
                  { label: 'Offered By', value: `${form.offeredByName || '—'} (${form.offeredByType})` },
                  { label: 'Compensation', value: form.isPaid ? (form.salaryFixed || 'Paid') : 'Unpaid' },
                  { label: 'Application Deadline', value: form.applicationDeadline || '—' },
                  { label: 'Recognition', value: form.recognition.join(', ') || '—' },
                ].map(item => (
                  <div key={item.label} className="flex flex-col gap-0.5 p-3 rounded-lg bg-gray-50">
                    <span className="text-gray-400" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</span>
                    <span className="text-gray-800" style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>

              {/* Description preview */}
              {form.description && (
                <div className="mb-6">
                  <span className="text-gray-400 block mb-1" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</span>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl" style={{ fontSize: 13, lineHeight: 1.7 }}>{form.description}</p>
                </div>
              )}

              {/* Team roles summary */}
              {form.teamRoles.some(r => r.designation) && (
                <div className="mb-6">
                  <span className="text-gray-400 block mb-2" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Team Roles</span>
                  <div className="flex flex-col gap-2">
                    {form.teamRoles.filter(r => r.designation).map((role, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                        <Users size={14} className="text-teal-600 shrink-0" />
                        <span className="text-gray-800" style={{ fontSize: 13, fontWeight: 600 }}>{role.designation}</span>
                        <span className="text-gray-400" style={{ fontSize: 11 }}>({role.participants} position{Number(role.participants) > 1 ? 's' : ''}, {role.experienceLevel})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {form.tags.filter(t => t).length > 0 && (
                <div>
                  <span className="text-gray-400 block mb-2" style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {form.tags.filter(t => t).map((tag, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700" style={{ fontSize: 12, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
        accentColor="teal"
        accentHex="#0d9488"
        canSubmit={canSubmit}
        missingFields={missingFields}
        entityType="Project"
      >
        {renderStepContent()}
      </CreateFormWizard>

      <ComplianceChecklist
        isOpen={showCompliance}
        onClose={() => setShowCompliance(false)}
        onConfirm={handleComplianceConfirm}
        entityType="Project"
      />
    </>
  );
}