import React, { useState } from 'react';
import {
  BookOpen, MapPin, Clock, Building2, Banknote, Calendar, Users,
  FileText, CheckCircle2, GraduationCap, Globe, Languages, Star,
  Tag, ChevronDown, Award, Layers, Upload, Plus, X, Wifi,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import {
  SPECIALIZATION_OPTIONS, COURSE_TYPE_OPTIONS, MODE_OPTIONS, FORMAT_OPTIONS,
  LEVEL_OPTIONS, LANGUAGE_OPTIONS, ASSESSMENT_METHOD_OPTIONS, OUTCOME_OPTIONS,
  FEES_OPTIONS, PROVIDER_TYPE_OPTIONS,
} from '@/app/data/courses';

/* ═══ Types ═══ */

interface CourseFormData {
  title: string;
  providerName: string;
  courseType: string;
  specialization: string;
  mode: string;
  format: string;
  level: string;
  language: string;
  description: string;
  targetAudience: string;
  prerequisites: string;
  learningOutcomes: string[];
  curriculum: { title: string; topics: string }[];
  duration: string;
  schedule: string;
  startDate: string;
  endDate: string;
  lastDateToApply: string;
  maxParticipants: string;
  fees: string;
  price: string;
  currency: string;
  earlyBirdDiscount: string;
  paymentPlans: string;
  outcomes: string[];
  assessmentMethod: string;
  accreditation: string;
  instructorName: string;
  instructorTitle: string;
  instructorBio: string;
  tags: string[];
  featured: boolean;
}

const DEFAULT_FORM: CourseFormData = {
  title: '', providerName: 'MindCare Clinic', courseType: '', specialization: '',
  mode: '', format: '', level: '', language: 'English',
  description: '', targetAudience: '', prerequisites: '',
  learningOutcomes: [''], curriculum: [{ title: '', topics: '' }],
  duration: '', schedule: '', startDate: '', endDate: '', lastDateToApply: '',
  maxParticipants: '', fees: '', price: '', currency: 'INR',
  earlyBirdDiscount: '', paymentPlans: '', outcomes: [],
  assessmentMethod: '', accreditation: '', instructorName: '',
  instructorTitle: '', instructorBio: '', tags: [''], featured: false,
};

const PREFILLED_FORM: CourseFormData = {
  title: 'Trauma-Informed Care Certification',
  providerName: 'MindCare Clinic',
  courseType: 'Certification Course',
  specialization: 'Clinical',
  mode: 'Hybrid',
  format: 'Course',
  level: 'Intermediate',
  language: 'English',
  description: 'A comprehensive certification program in trauma-informed care, covering evidence-based approaches to understanding and treating trauma across the lifespan. Combines theoretical foundations with practical skills through supervised case work.',
  targetAudience: 'Licensed mental health professionals, social workers, and counselors seeking specialization in trauma work.',
  prerequisites: "Master's degree in Psychology, Counseling, or Social Work. Minimum 1 year of clinical experience.",
  learningOutcomes: [
    'Apply trauma-informed principles across diverse clinical settings',
    'Conduct comprehensive trauma assessments using validated tools',
    'Implement evidence-based trauma therapies (EMDR, CPT, PE)',
    'Navigate complex trauma presentations and comorbidities',
  ],
  curriculum: [
    { title: 'Foundations of Trauma Psychology', topics: 'Neurobiology of trauma, ACEs, Attachment disruptions' },
    { title: 'Assessment & Diagnosis', topics: 'PTSD screening, Complex PTSD, Differential diagnosis' },
    { title: 'Evidence-Based Interventions', topics: 'EMDR, CPT, Prolonged Exposure, Somatic Experiencing' },
    { title: 'Special Populations', topics: 'Children, Veterans, Refugees, Domestic violence survivors' },
    { title: 'Practicum & Supervision', topics: 'Case presentations, Live supervision, Self-care' },
  ],
  duration: '12 weeks',
  schedule: 'Saturdays 10:00 AM - 1:00 PM IST + Self-paced modules',
  startDate: '2026-04-15',
  endDate: '2026-07-10',
  lastDateToApply: '2026-04-05',
  maxParticipants: '30',
  fees: 'Paid',
  price: '24,999',
  currency: 'INR',
  earlyBirdDiscount: '15% off before March 31',
  paymentPlans: '3 monthly installments available',
  outcomes: ['Certificate'],
  assessmentMethod: 'Project',
  accreditation: 'Accredited',
  instructorName: 'Dr. Kavya Iyer',
  instructorTitle: 'Senior Trauma Psychologist',
  instructorBio: 'Dr. Iyer is a licensed clinical psychologist specializing in trauma with 12 years of experience. She has trained over 500 clinicians across India.',
  tags: ['Trauma', 'Certification', 'Clinical'],
  featured: false,
};

const STEPS: WizardStep[] = [
  { id: 'info', label: 'Course Info', shortLabel: 'Info' },
  { id: 'curriculum', label: 'Curriculum & Schedule', shortLabel: 'Curriculum' },
  { id: 'pricing', label: 'Pricing & Enrollment', shortLabel: 'Pricing' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review' },
];

const COMPLIANCE_ITEMS = [
  { id: 'content', label: 'Course content is accurate and up-to-date', required: true },
  { id: 'prereqs', label: 'Prerequisites are clearly stated', required: true },
  { id: 'outcomes', label: 'Learning outcomes are measurable and specific', required: true },
  { id: 'pricing', label: 'Pricing is transparent with no hidden fees', required: true },
  { id: 'instructor', label: 'Instructor credentials are verifiable', required: true },
  { id: 'accreditation', label: 'Accreditation status is correctly represented', required: true },
  { id: 'nondiscrimination', label: 'Non-discriminatory enrollment policy', required: true },
];

/* ═══ Helpers ═══ */

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all" style={{ fontSize: 13 }}>
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
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all" style={{ fontSize: 13 }} />
      ) : (
        <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all" style={{ fontSize: 13 }} />
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
            <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-700 flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
            <input type="text" value={item} onChange={e => updateItem(i, e.target.value)} placeholder={placeholder} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all" style={{ fontSize: 13 }} />
            {items.length > 1 && <button onClick={() => removeItem(i)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>}
          </div>
        ))}
      </div>
      <button onClick={addItem} className="self-start flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors mt-1" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={13} /> Add item</button>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-gray-100">
      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">{icon}</div>
      <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>{title}</p>
    </div>
  );
}

/* ═══ Component ═══ */

interface CreateCoursePageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editCourseId?: string;
}

export function CreateCoursePage({ onBack, onNavigate, editMode, editCourseId }: CreateCoursePageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<CourseFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const update = <K extends keyof CourseFormData>(key: K, val: CourseFormData[K]) => setForm(prev => ({ ...prev, [key]: val }));

  const canSubmit = !!form.title && !!form.courseType && !!form.description;

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.courseType) missingFields.push('Course Type');
  if (!form.description.trim()) missingFields.push('Description');

  const handleSaveDraft = () => { setDraftSaved(true); setTimeout(() => setDraftSaved(false), 2000); };
  const handlePreview = () => setCurrentStep(3);
  const handleSubmit = () => { if (!canSubmit) return; setShowCompliance(true); };
  const handleComplianceComplete = () => { setShowCompliance(false); setShowSuccess(true); };

  if (showSuccess) {
    return (
      <SuccessCelebration
        title={editMode ? 'Course Updated!' : 'Course Submitted!'}
        subtitle={editMode ? 'Your course has been updated and is under review.' : 'Your course has been submitted for admin review.'}
        actionLabel="Go to Dashboard"
        onAction={() => onNavigate('CompanyDashboard')}
        secondaryLabel="Create Another"
        onSecondary={() => { setShowSuccess(false); setForm(DEFAULT_FORM); setCurrentStep(0); }}
      />
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
        accentColor="purple"
        accentHex="#7c3aed"
        isLastStepPreview
        canSubmit={canSubmit}
        missingFields={missingFields}
        isDraft={!editMode}
        entityType="Course"
      >
        {/* ═══ STEP 1: Course Info ═══ */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<BookOpen size={16} />} title="Course Details" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <TextField label="Course Title" value={form.title} onChange={v => update('title', v)} placeholder="e.g. Trauma-Informed Care Certification" required />
                </div>
                <SelectField label="Course Type" value={form.courseType} onChange={v => update('courseType', v)} options={COURSE_TYPE_OPTIONS} required />
                <SelectField label="Specialization" value={form.specialization} onChange={v => update('specialization', v)} options={SPECIALIZATION_OPTIONS as string[]} required />
                <SelectField label="Mode" value={form.mode} onChange={v => update('mode', v)} options={MODE_OPTIONS} required />
                <SelectField label="Format" value={form.format} onChange={v => update('format', v)} options={FORMAT_OPTIONS} required />
                <SelectField label="Level" value={form.level} onChange={v => update('level', v)} options={LEVEL_OPTIONS} required />
                <SelectField label="Language" value={form.language} onChange={v => update('language', v)} options={LANGUAGE_OPTIONS as string[]} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<FileText size={16} />} title="Description & Audience" />
              <div className="flex flex-col gap-5">
                <TextField label="Description" value={form.description} onChange={v => update('description', v)} placeholder="Describe what students will learn..." required multiline />
                <TextField label="Target Audience" value={form.targetAudience} onChange={v => update('targetAudience', v)} placeholder="Who is this course for?" required multiline />
                <TextField label="Prerequisites" value={form.prerequisites} onChange={v => update('prerequisites', v)} placeholder="Required background or qualifications (leave blank if none)" multiline />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<GraduationCap size={16} />} title="Instructor" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="Instructor Name" value={form.instructorName} onChange={v => update('instructorName', v)} placeholder="Dr. Name" required />
                <TextField label="Title / Designation" value={form.instructorTitle} onChange={v => update('instructorTitle', v)} placeholder="e.g. Senior Clinical Psychologist" />
                <div className="md:col-span-2">
                  <TextField label="Bio" value={form.instructorBio} onChange={v => update('instructorBio', v)} placeholder="Brief bio of the instructor..." multiline />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: Curriculum & Schedule ═══ */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<Layers size={16} />} title="Learning Outcomes" />
              <ListField label="What students will achieve" items={form.learningOutcomes} onChange={v => update('learningOutcomes', v)} placeholder="e.g. Apply advanced CBT techniques" required />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<BookOpen size={16} />} title="Curriculum / Modules" />
              <div className="flex flex-col gap-4">
                {form.curriculum.map((mod, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0" style={{ fontSize: 12, fontWeight: 700 }}>W{i + 1}</span>
                    <div className="flex-1 flex flex-col gap-2">
                      <input type="text" value={mod.title} onChange={e => { const next = [...form.curriculum]; next[i] = { ...next[i], title: e.target.value }; update('curriculum', next); }} placeholder="Module title" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                      <input type="text" value={mod.topics} onChange={e => { const next = [...form.curriculum]; next[i] = { ...next[i], topics: e.target.value }; update('curriculum', next); }} placeholder="Topics (comma-separated)" className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                    </div>
                    {form.curriculum.length > 1 && (
                      <button onClick={() => update('curriculum', form.curriculum.filter((_, j) => j !== i))} className="p-1.5 text-gray-400 hover:text-red-500 mt-1"><X size={14} /></button>
                    )}
                  </div>
                ))}
                <button onClick={() => update('curriculum', [...form.curriculum, { title: '', topics: '' }])} className="self-start flex items-center gap-1.5 text-purple-600 hover:text-purple-700 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}><Plus size={13} /> Add module</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<Calendar size={16} />} title="Schedule & Duration" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TextField label="Duration" value={form.duration} onChange={v => update('duration', v)} placeholder="e.g. 12 weeks" required />
                <TextField label="Schedule" value={form.schedule} onChange={v => update('schedule', v)} placeholder="e.g. Saturdays 10 AM - 1 PM IST" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>End Date</label>
                  <input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Last Date to Enroll <span className="text-red-400">*</span></label>
                  <input type="date" value={form.lastDateToApply} onChange={e => update('lastDateToApply', e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300" style={{ fontSize: 13 }} />
                </div>
                <TextField label="Max Participants" value={form.maxParticipants} onChange={v => update('maxParticipants', v)} placeholder="e.g. 30 (leave blank for unlimited)" />
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: Pricing & Enrollment ═══ */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<Banknote size={16} />} title="Pricing" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SelectField label="Fee Structure" value={form.fees} onChange={v => update('fees', v)} options={FEES_OPTIONS} required />
                {form.fees === 'Paid' && (
                  <>
                    <TextField label="Price" value={form.price} onChange={v => update('price', v)} placeholder="e.g. 24,999" required />
                    <SelectField label="Currency" value={form.currency} onChange={v => update('currency', v)} options={['INR', 'USD', 'GBP', 'EUR']} />
                    <TextField label="Early Bird Discount" value={form.earlyBirdDiscount} onChange={v => update('earlyBirdDiscount', v)} placeholder="e.g. 15% off before March 31" />
                    <div className="md:col-span-2">
                      <TextField label="Payment Plans" value={form.paymentPlans} onChange={v => update('paymentPlans', v)} placeholder="e.g. 3 monthly installments available" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<Award size={16} />} title="Outcomes & Assessment" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="text-gray-700 block mb-2" style={{ fontSize: 13, fontWeight: 600 }}>Outcomes / Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {OUTCOME_OPTIONS.map(outcome => (
                      <button key={outcome} onClick={() => update('outcomes', form.outcomes.includes(outcome) ? form.outcomes.filter(o => o !== outcome) : [...form.outcomes, outcome])} className={`px-3 py-1.5 rounded-lg border transition-all ${form.outcomes.includes(outcome) ? 'bg-purple-50 border-purple-300 text-purple-700' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`} style={{ fontSize: 12, fontWeight: 600 }}>{outcome}</button>
                    ))}
                  </div>
                </div>
                <SelectField label="Assessment Method" value={form.assessmentMethod} onChange={v => update('assessmentMethod', v)} options={ASSESSMENT_METHOD_OPTIONS as string[]} />
                <SelectField label="Accreditation Status" value={form.accreditation} onChange={v => update('accreditation', v)} options={['Accredited', 'Pending', 'Not Accredited']} />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <SectionTitle icon={<Tag size={16} />} title="Tags & Brochure" />
              <div className="flex flex-col gap-5">
                <ListField label="Tags / Keywords" items={form.tags} onChange={v => update('tags', v)} placeholder="e.g. Trauma, Clinical, Certification" />
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Brochure Upload</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50 hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer">
                    <Upload size={24} className="text-gray-400 mb-2" />
                    <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 500 }}>Click to upload brochure (PDF, max 5MB)</p>
                    <p className="text-gray-400 mt-1" style={{ fontSize: 11 }}>Optional: Add a downloadable course brochure</p>
                  </div>
                </div>
                <label className="flex items-center gap-3 p-4 bg-purple-50/60 rounded-xl border border-purple-100 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => update('featured', e.target.checked)} className="w-4 h-4 accent-purple-600 rounded" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>Feature this course</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>Featured courses appear at the top of browse results</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP 4: Review ═══ */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-purple-200" style={{ fontSize: 11, fontWeight: 600 }}>COURSE PREVIEW</p>
                  {form.featured && <span className="px-2 py-0.5 bg-amber-400/20 text-amber-200 rounded-full" style={{ fontSize: 10, fontWeight: 700 }}>FEATURED</span>}
                </div>
                <p className="text-white mb-2" style={{ fontSize: 22, fontWeight: 800 }}>{form.title || 'Untitled Course'}</p>
                <div className="flex flex-wrap items-center gap-3 text-purple-200" style={{ fontSize: 12 }}>
                  {form.providerName && <span className="flex items-center gap-1"><Building2 size={12} /> {form.providerName}</span>}
                  {form.mode && <span className="flex items-center gap-1"><Wifi size={12} /> {form.mode}</span>}
                  {form.duration && <span className="flex items-center gap-1"><Clock size={12} /> {form.duration}</span>}
                  {form.level && <span className="flex items-center gap-1"><Layers size={12} /> {form.level}</span>}
                </div>
              </div>
            </div>

            {/* Review cards */}
            {[
              { title: 'Course Details', items: [
                ['Type', form.courseType], ['Specialization', form.specialization], ['Format', form.format],
                ['Language', form.language], ['Assessment', form.assessmentMethod], ['Accreditation', form.accreditation],
              ]},
              { title: 'Schedule', items: [
                ['Duration', form.duration], ['Schedule', form.schedule],
                ['Start Date', form.startDate], ['End Date', form.endDate],
                ['Last Date to Enroll', form.lastDateToApply], ['Max Participants', form.maxParticipants],
              ]},
              { title: 'Pricing', items: [
                ['Fees', form.fees], ['Price', form.price ? `${form.currency} ${form.price}` : 'Free'],
                ['Early Bird', form.earlyBirdDiscount], ['Payment Plans', form.paymentPlans],
              ]},
            ].map((section, si) => (
              <div key={si} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>{section.title}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {section.items.filter(([, v]) => v).map(([label, value], i) => (
                    <div key={i}>
                      <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 600 }}>{label}</p>
                      <p className="text-gray-800 mt-0.5" style={{ fontSize: 13, fontWeight: 500 }}>{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {form.description && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-gray-900 mb-2" style={{ fontSize: 14, fontWeight: 700 }}>Description</p>
                <p className="text-gray-600" style={{ fontSize: 13 }}>{form.description}</p>
              </div>
            )}

            {form.learningOutcomes.filter(o => o).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Learning Outcomes</p>
                <div className="flex flex-col gap-2">
                  {form.learningOutcomes.filter(o => o).map((o, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-purple-500 mt-0.5 shrink-0" />
                      <p className="text-gray-700" style={{ fontSize: 13 }}>{o}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.curriculum.filter(m => m.title).length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Curriculum</p>
                <div className="flex flex-col gap-3">
                  {form.curriculum.filter(m => m.title).map((mod, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-purple-50/50 rounded-xl">
                      <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0" style={{ fontSize: 11, fontWeight: 700 }}>W{i + 1}</span>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{mod.title}</p>
                        {mod.topics && <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{mod.topics}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.instructorName && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <p className="text-gray-900 mb-2" style={{ fontSize: 14, fontWeight: 700 }}>Instructor</p>
                <p className="text-gray-800" style={{ fontSize: 13, fontWeight: 600 }}>{form.instructorName}</p>
                {form.instructorTitle && <p className="text-gray-500" style={{ fontSize: 12 }}>{form.instructorTitle}</p>}
                {form.instructorBio && <p className="text-gray-600 mt-2" style={{ fontSize: 13 }}>{form.instructorBio}</p>}
              </div>
            )}
          </div>
        )}
      </CreateFormWizard>

      <ComplianceChecklist
        isOpen={showCompliance}
        onClose={() => setShowCompliance(false)}
        onConfirm={handleComplianceComplete}
        items={COMPLIANCE_ITEMS}
        entityType="Course"
        accentColor="purple"
      />
    </>
  );
}