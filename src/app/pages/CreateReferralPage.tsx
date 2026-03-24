import React, { useState } from 'react';
import {
  MapPin, Clock, Calendar, Zap, Globe, ChevronDown, Users,
  Building2, FileText, Shield, GraduationCap,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import { SPECIALIZATIONS, EXPERIENCE_LEVELS, MOCK_REFERRALS } from '@/app/data/referrals';
import type { ReferralUrgency, ReferralMode, ExperienceLevel } from '@/app/data/referrals';

/* ═══ Types ═══ */

interface ReferralFormData {
  title: string;
  specialization: string;
  location: string;
  urgency: ReferralUrgency;
  mode: ReferralMode;
  deadline: string;
  studentEligible: boolean;
  domain: string;
  duration: string;
  experienceLevel: ExperienceLevel | '';
  language: string;
  population: string;
  prerequisites: string[];
  clientName: string;
  clientIndustry: string;
  clientDescription: string;
  clientWebsite: string;
  clientSummary: string;
}

const DEFAULT_FORM: ReferralFormData = {
  title: '', specialization: '', location: '', urgency: 'Scheduled', mode: 'In-person',
  deadline: '', studentEligible: false, domain: '', duration: '', experienceLevel: '',
  language: '', population: '', prerequisites: [''],
  clientName: '', clientIndustry: '', clientDescription: '', clientWebsite: '', clientSummary: '',
};

const PREFILLED_FORM: ReferralFormData = {
  title: 'Substance abuse counselor for de-addiction center',
  specialization: 'Substance Abuse',
  location: 'Delhi, NCR',
  urgency: 'Immediate',
  mode: 'In-person',
  deadline: '2026-04-20',
  studentEligible: false,
  domain: 'Clinical Psychology',
  duration: '6 months contract',
  experienceLevel: 'Mid-level',
  language: 'English, Hindi',
  population: 'Adults',
  prerequisites: ['RCI-licensed', 'Addiction counseling training'],
  clientName: 'Hope De-Addiction Centre',
  clientIndustry: 'Addiction & Recovery',
  clientDescription: 'An inpatient facility specializing in alcohol and substance dependence treatment, detoxification, and relapse prevention programs.',
  clientWebsite: '',
  clientSummary: 'The center requires an experienced counselor for a growing caseload of adult patients in their residential program.',
};

const STEPS: WizardStep[] = [
  { id: 'basic', label: 'Basic Info', shortLabel: 'Basics' },
  { id: 'details', label: 'Details & Requirements', shortLabel: 'Details' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review' },
];

const DOMAINS = [
  'Clinical Psychology', 'Counselling Psychology', 'Developmental Psychology',
  'Neuropsychology', 'Organizational Psychology', 'Health Psychology',
  'Forensic Psychology', 'Educational Psychology', 'Social Psychology',
];

const INDUSTRIES = [
  'Healthcare', 'Hospital & Healthcare', 'Mental Health', 'Pediatric Mental Health',
  'Education', 'Higher Education', 'Research & Academia', 'NGO & Non-Profit',
  'Information Technology', 'Corporate', 'Government', 'Community Healthcare',
  'Teletherapy & Digital Health', 'Addiction & Recovery', 'Sports & Athletics',
  'Family & Couples Counseling', 'Neurology & Rehabilitation',
];

const COMPLIANCE_ITEMS = [
  { id: 'confidential', label: 'All client information is non-identifiable and confidential' },
  { id: 'ethical', label: 'This referral complies with professional ethical guidelines' },
  { id: 'accurate', label: 'Specialization and prerequisite requirements are accurate' },
  { id: 'no-discrimination', label: 'No discriminatory language or restrictions' },
  { id: 'valid-deadline', label: 'Deadline and timeline are realistic and valid' },
  { id: 'contact', label: 'I am available to facilitate the referral connection' },
];

/* ═══ Helpers ═══ */

function SelectField({ label, value, onChange, options, required, icon }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-300 transition-all`}
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

function TextField({ label, value, onChange, placeholder, required, multiline, icon, type }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; multiline?: boolean; icon?: React.ReactNode; type?: string }) {
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
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-300 transition-all"
          style={{ fontSize: 13 }}
        />
      ) : (
        <div className="relative">
          {icon && <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
          <input
            type={type || 'text'}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-300 transition-all`}
            style={{ fontSize: 13 }}
          />
        </div>
      )}
    </div>
  );
}

function ListField({ label, items, onChange, placeholder }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  const addItem = () => onChange([...items, '']);
  const removeItem = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, val: string) => onChange(items.map((item, i) => i === idx ? val : item));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
            <input
              type="text"
              value={item}
              onChange={e => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-100 focus:border-amber-300 transition-all"
              style={{ fontSize: 13 }}
            />
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" style={{ fontSize: 14 }}>×</button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addItem} className="self-start flex items-center gap-1.5 text-amber-700 hover:text-amber-600 transition-colors mt-1" style={{ fontSize: 12, fontWeight: 600 }}>
        + Add another
      </button>
    </div>
  );
}

/* ═══ Component ═══ */

interface CreateReferralPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editReferralId?: string;
}

export function CreateReferralPage({ onBack, onNavigate, editMode = false, editReferralId }: CreateReferralPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<ReferralFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = <K extends keyof ReferralFormData>(key: K, value: ReferralFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.title.trim() !== '' && form.specialization !== '' && form.deadline !== '' && form.location.trim() !== '';

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.specialization) missingFields.push('Specialization');
  if (!form.location.trim()) missingFields.push('Location');
  if (!form.deadline) missingFields.push('Deadline');

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
            title={editMode ? 'Referral Updated Successfully' : 'Referral Submitted for Review'}
            subtitle={editMode
              ? 'Your changes have been saved. The updated referral will be reviewed by our team.'
              : 'Your referral has been submitted and will be reviewed by our admin team within 24-48 hours. Once approved, it will be visible to qualified professionals.'}
            actionLabel="Go to My Listings"
            onAction={() => onNavigate('My Listings')}
            secondaryLabel="Create Another Referral"
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

  /* ═══ Step 1: Basic Info ═══ */
  const renderBasicInfo = () => (
    <div className="flex flex-col gap-6">
      <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <Shield size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-amber-800" style={{ fontSize: 13, fontWeight: 600 }}>Confidentiality Notice</p>
          <p className="text-amber-700 mt-1" style={{ fontSize: 12 }}>
            Do not include any personally identifiable information (PII) about clients. All case descriptions must be non-identifiable.
          </p>
        </div>
      </div>

      <TextField label="Referral Title" value={form.title} onChange={v => updateField('title', v)} placeholder="e.g. Child psychologist needed for developmental assessment" required />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SelectField label="Specialization" value={form.specialization} onChange={v => updateField('specialization', v)} options={SPECIALIZATIONS} required />
        <SelectField label="Domain" value={form.domain} onChange={v => updateField('domain', v)} options={DOMAINS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField label="Location" value={form.location} onChange={v => updateField('location', v)} placeholder="e.g. Mumbai, MH or Remote" required icon={<MapPin size={16} />} />
        <SelectField label="Mode" value={form.mode} onChange={v => updateField('mode', v as ReferralMode)} options={['In-person', 'Remote', 'Hybrid']} icon={<Globe size={16} />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SelectField label="Urgency" value={form.urgency} onChange={v => updateField('urgency', v as ReferralUrgency)} options={['Immediate', 'Scheduled', 'Exploratory']} required icon={<Zap size={16} />} />
        <TextField label="Deadline" value={form.deadline} onChange={v => updateField('deadline', v)} type="date" required icon={<Calendar size={16} />} />
      </div>

      <div className="flex items-center gap-3 py-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.studentEligible}
            onChange={e => updateField('studentEligible', e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary/30"
          />
          <span className="text-gray-700" style={{ fontSize: 13, fontWeight: 500 }}>
            <GraduationCap size={14} className="inline mr-1.5 text-brand-primary" />
            Open to students (supervised participation)
          </span>
        </label>
      </div>
    </div>
  );

  /* ═══ Step 2: Details & Requirements ═══ */
  const renderDetails = () => (
    <div className="flex flex-col gap-6">
      {/* Duration & Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField label="Duration" value={form.duration} onChange={v => updateField('duration', v)} placeholder="e.g. 3 sessions over 2 weeks" icon={<Clock size={16} />} />
        <SelectField label="Experience Level" value={form.experienceLevel} onChange={v => updateField('experienceLevel', v as ExperienceLevel)} options={EXPERIENCE_LEVELS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <TextField label="Language" value={form.language} onChange={v => updateField('language', v)} placeholder="e.g. English, Hindi" />
        <TextField label="Population" value={form.population} onChange={v => updateField('population', v)} placeholder="e.g. Children, Adolescents, Adults" />
      </div>

      <ListField label="Prerequisites" items={form.prerequisites} onChange={v => updateField('prerequisites', v)} placeholder="e.g. RCI-licensed, CBT certification" />

      <TextField label="Case / Opportunity Summary" value={form.clientSummary} onChange={v => updateField('clientSummary', v)} placeholder="Brief, non-identifiable description of the case or opportunity..." multiline />

      {/* Client / Organization Info */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-gray-700 flex items-center gap-2 mb-4" style={{ fontSize: 14, fontWeight: 600 }}>
          <Building2 size={16} className="text-amber-600" />
          Referring Organization (Optional)
        </p>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TextField label="Organization Name" value={form.clientName} onChange={v => updateField('clientName', v)} placeholder="e.g. MindCare Clinic" />
            <SelectField label="Industry" value={form.clientIndustry} onChange={v => updateField('clientIndustry', v)} options={INDUSTRIES} />
          </div>
          <TextField label="Organization Description" value={form.clientDescription} onChange={v => updateField('clientDescription', v)} placeholder="Brief description of the organization..." multiline />
          <TextField label="Website" value={form.clientWebsite} onChange={v => updateField('clientWebsite', v)} placeholder="e.g. www.mindcareclinic.com" icon={<Globe size={16} />} />
        </div>
      </div>
    </div>
  );

  /* ═══ Step 3: Review ═══ */
  const renderReview = () => {
    const sections = [
      {
        title: 'Basic Information',
        items: [
          { label: 'Title', value: form.title },
          { label: 'Specialization', value: form.specialization },
          { label: 'Domain', value: form.domain },
          { label: 'Location', value: form.location },
          { label: 'Mode', value: form.mode },
          { label: 'Urgency', value: form.urgency },
          { label: 'Deadline', value: form.deadline },
          { label: 'Open to Students', value: form.studentEligible ? 'Yes' : 'No' },
        ],
      },
      {
        title: 'Details & Requirements',
        items: [
          { label: 'Duration', value: form.duration },
          { label: 'Experience Level', value: form.experienceLevel },
          { label: 'Language', value: form.language },
          { label: 'Population', value: form.population },
          { label: 'Prerequisites', value: form.prerequisites.filter(p => p.trim()).join(', ') },
          { label: 'Case Summary', value: form.clientSummary },
        ],
      },
      {
        title: 'Referring Organization',
        items: [
          { label: 'Name', value: form.clientName },
          { label: 'Industry', value: form.clientIndustry },
          { label: 'Description', value: form.clientDescription },
          { label: 'Website', value: form.clientWebsite },
        ],
      },
    ];

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <FileText size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-amber-800" style={{ fontSize: 13, fontWeight: 600 }}>Review Your Referral</p>
            <p className="text-amber-700 mt-1" style={{ fontSize: 12 }}>
              Please review all details before submitting. Once submitted, the referral will go through admin review before going live.
            </p>
          </div>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 700 }}>{section.title}</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex flex-col gap-0.5">
                    <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 600 }}>{item.label}</p>
                    <p className="text-gray-800 min-w-0 truncate" style={{ fontSize: 13 }}>
                      {item.value || <span className="text-gray-300 italic">Not provided</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const stepContent = [renderBasicInfo, renderDetails, renderReview];

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
        accentColor="amber"
        accentHex="#d97706"
        isLastStepPreview
        canSubmit={canSubmit}
        isDraft={!editMode}
        entityType={editMode ? 'Referral (Edit)' : 'Referral'}
        missingFields={missingFields}
      >
        <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
          {stepContent[currentStep]()}
        </div>
      </CreateFormWizard>

      {showCompliance && (
        <ComplianceChecklist
          title="Referral Compliance Check"
          items={COMPLIANCE_ITEMS}
          onConfirm={handleComplianceConfirm}
          onCancel={() => setShowCompliance(false)}
          accentColor="amber"
        />
      )}
    </>
  );
}
