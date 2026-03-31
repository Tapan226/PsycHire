import React, { useState } from 'react';
import {
  ArrowRight, Check, GraduationCap, Briefcase, MapPin, FileText, Globe,
  User, Clock, BookOpen, Wallet, ChevronLeft, ShieldCheck, Users, Building2,
  Stethoscope, Award, Heart, Upload,
} from 'lucide-react';
import { Chip } from '@/app/components/Chip';

type OnboardingRole = 'Student' | 'Professional' | 'Company';

interface OnboardingPageProps {
  onComplete: () => void;
  role?: OnboardingRole;
}

/* ═══════════════════════════════════════════════
   STEP CONFIGS PER ROLE
   ═══════════════════════════════════════════════ */

const STEP_CONFIGS: Record<OnboardingRole, {
  totalSteps: number;
  titles: Record<number, string>;
  subtitles: Record<number, string>;
}> = {
  Student: {
    totalSteps: 5,
    titles: {
      1: 'What is your current career stage?',
      2: 'Education Details',
      3: 'Specializations & Interests',
      4: 'Availability & Location',
      5: 'Setup Complete!',
    },
    subtitles: {
      1: 'This helps us tailor opportunities to your level.',
      2: 'Tell us about your academic background.',
      3: 'Share your areas of expertise and what interests you.',
      4: "Let employers know when and where you're available.",
      5: '',
    },
  },
  Professional: {
    totalSteps: 5,
    titles: {
      1: 'License & Credentials',
      2: 'Experience & Specializations',
      3: 'Supervision & Mentoring',
      4: 'Availability & Preferences',
      5: 'Setup Complete!',
    },
    subtitles: {
      1: 'Verify your professional credentials.',
      2: 'Tell us about your expertise and experience.',
      3: 'Set up your supervision and mentoring profile.',
      4: 'Let the community know how to work with you.',
      5: '',
    },
  },
  Company: {
    totalSteps: 5,
    titles: {
      1: 'Company Details',
      2: 'Size & Industry',
      3: 'Hiring Needs',
      4: 'About Your Organisation',
      5: 'Setup Complete!',
    },
    subtitles: {
      1: 'Tell us about your organisation.',
      2: 'Help us match you with the right talent.',
      3: 'What roles are you looking to fill?',
      4: 'A brief description helps candidates find you.',
      5: '',
    },
  },
};

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

export function OnboardingPage({ onComplete, role = 'Student' }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const config = STEP_CONFIGS[role];
  const totalSteps = config.totalSteps;

  /* ── Student State ── */
  const [careerStage, setCareerStage] = useState('post-grad');
  const [education, setEducation] = useState({ degree: 'M.A. Clinical Psychology', institution: 'Tata Institute of Social Sciences', startYear: '2023', endYear: '2025' });
  const [specializations] = useState(['Clinical Psychology', 'Neuropsychology']);
  const [populations] = useState(['Adults', 'Adolescents']);
  const [languages] = useState(['English', 'Hindi', 'Marathi']);
  const [interests, setInterests] = useState(['Clinical Research', 'Therapy', 'Workshops', 'Child Development']);
  const [availability, setAvailability] = useState({ status: 'Immediate', location: 'Mumbai, MH', relocate: 'Yes, willing to relocate', type: 'Full-time' });

  /* ── Professional State ── */
  const [license, setLicense] = useState({ number: 'RCI/CLP/2016/4523', type: 'RCI Clinical', issuingBody: 'Rehabilitation Council of India', year: '2016' });
  const [proExperience, setProExperience] = useState({ years: '8-12', specializations: ['CBT', 'Trauma & PTSD', 'Clinical Supervision'], populations: ['Adults', 'Adolescents'], languages: ['English', 'Hindi', 'Kannada'] });
  const [supervision, setSupervision] = useState({ offerSupervision: true, offerMentoring: true, openToResearch: true, hourlyRate: '2,500' });
  const [proAvailability, setProAvailability] = useState({ location: 'Bangalore, KA', workMode: 'Hybrid', openTo: ['Offer Supervision', 'Offer Mentoring', 'Consulting', 'Workshops & Talks'] });

  /* ── Company State ── */
  const [companyDetails, setCompanyDetails] = useState({ name: 'MindCare Clinic', type: 'Clinic', website: 'www.mindcareclinic.com' });
  const [companySize, setCompanySize] = useState({ size: '11-50', industry: 'Clinical', location: 'Mumbai, MH' });
  const [hiringNeeds, setHiringNeeds] = useState<string[]>(['Clinical Psychologists', 'Counselors', 'Interns']);
  const [hiringTimeline, setHiringTimeline] = useState('Next 1-3 months');
  const [companyAbout, setCompanyAbout] = useState('MindCare Clinic is a leading pediatric mental health center dedicated to providing holistic and evidence-based care for children and adolescents.');

  /* ── Navigation ── */
  const handleNext = () => { if (step < totalSteps) setStep(step + 1); else onComplete(); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };
  const progressPercentage = (step / totalSteps) * 100;

  /* ── Shared UI Helpers ── */
  const RadioCard = ({ id, label, desc, selected, onClick }: { id: string; label: string; desc: string; selected: boolean; onClick: () => void }) => (
    <button type="button" onClick={onClick} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selected ? 'border-brand-primary bg-brand-primary/[0.03]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-gray-900">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'}`}>
          {selected && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
      </div>
    </button>
  );

  const ToggleCard = ({ label, desc, active, onToggle, icon: Icon }: { label: string; desc: string; active: boolean; onToggle: () => void; icon: React.ElementType }) => (
    <button type="button" onClick={onToggle} className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${active ? 'border-brand-secondary bg-brand-secondary/[0.04]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-brand-secondary/10 text-brand-secondary' : 'bg-gray-100 text-gray-400'}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{label}</p>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      <div className={`w-10 h-6 rounded-full transition-colors relative ${active ? 'bg-brand-secondary' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${active ? 'left-5' : 'left-1'}`} />
      </div>
    </button>
  );

  const InputField = ({ label, value, onChange, icon: Icon, placeholder }: { label: string; value: string; onChange: (v: string) => void; icon: React.ElementType; placeholder?: string }) => (
    <div>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-gray-800 bg-gray-50/50" />
      </div>
    </div>
  );

  const SelectField = ({ label, value, onChange, options, icon: Icon }: { label: string; value: string; onChange: (v: string) => void; options: string[]; icon: React.ElementType }) => (
    <div>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">{label}</label>
      <div className="relative">
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-gray-800 bg-gray-50/50 appearance-none cursor-pointer">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
    </div>
  );

  const ChipSelector = ({ label, options, selected, onToggle }: { label: string; options: string[]; selected: string[]; onToggle: (o: string) => void }) => (
    <div>
      <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button key={o} type="button" onClick={() => onToggle(o)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selected.includes(o) ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════
     STEP CONTENT (role-branched)
     ═══════════════════════════════════════════════ */

  const renderStepContent = () => {
    // ─── STUDENT ─────────────────────────────────
    if (role === 'Student') {
      if (step === 1) return (
        <div className="flex flex-col gap-3">
          {[
            { id: 'undergrad', label: 'Undergraduate', desc: 'B.A. / B.Sc Psychology student' },
            { id: 'graduation', label: 'Recent Graduate', desc: "Completed Bachelor's degree" },
            { id: 'post-grad', label: 'Post-graduation', desc: 'M.A. / M.Sc student' },
            { id: 'mphil', label: 'M.Phil Student', desc: 'Pursuing clinical licensure' },
            { id: 'doctorate', label: 'Doctorate', desc: 'PhD candidate' },
          ].map(s => <RadioCard key={s.id} {...s} selected={careerStage === s.id} onClick={() => setCareerStage(s.id)} />)}
        </div>
      );
      if (step === 2) return (
        <div className="flex flex-col gap-4">
          <InputField label="Degree" value={education.degree} onChange={(v) => setEducation({...education, degree: v})} icon={GraduationCap} />
          <InputField label="Institution" value={education.institution} onChange={(v) => setEducation({...education, institution: v})} icon={Building2} />
          <div className="grid grid-cols-2 gap-3">
            <InputField label="Start Year" value={education.startYear} onChange={(v) => setEducation({...education, startYear: v})} icon={Clock} />
            <InputField label="End Year" value={education.endYear} onChange={(v) => setEducation({...education, endYear: v})} icon={Clock} />
          </div>
        </div>
      );
      if (step === 3) return (
        <div className="flex flex-col gap-5">
          <div><label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Specializations</label><div className="flex flex-wrap gap-2">{specializations.map(s => <Chip key={s} label={s} variant="blue" />)}</div></div>
          <div><label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Population of Interest</label><div className="flex flex-wrap gap-2">{populations.map(p => <Chip key={p} label={p} variant="mint" />)}</div></div>
          <div><label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Languages</label><div className="flex flex-wrap gap-2">{languages.map(l => <Chip key={l} label={l} variant="slate" />)}</div></div>
          <ChipSelector label="Topics of Interest" options={["Clinical Research", "Therapy", "Workshops", "Child Development", "I/O Psychology", "Counseling", "Forensic Psychology", "School Psychology"]} selected={interests} onToggle={(o) => setInterests(prev => prev.includes(o) ? prev.filter(i => i !== o) : [...prev, o])} />
        </div>
      );
      if (step === 4) return (
        <div className="flex flex-col gap-4">
          <SelectField label="Availability" value={availability.status} onChange={(v) => setAvailability({...availability, status: v})} options={['Immediate', 'Within 15 days', 'Within 1 month', 'Within 3 months']} icon={Clock} />
          <InputField label="Preferred Location" value={availability.location} onChange={(v) => setAvailability({...availability, location: v})} icon={MapPin} />
          <SelectField label="Open to Relocate" value={availability.relocate} onChange={(v) => setAvailability({...availability, relocate: v})} options={['Yes, willing to relocate', 'No, local only', 'Open to remote']} icon={Globe} />
          <SelectField label="Employment Type" value={availability.type} onChange={(v) => setAvailability({...availability, type: v})} options={['Full-time', 'Part-time', 'Internship', 'Freelance', 'Volunteer']} icon={Briefcase} />
        </div>
      );
    }

    // ─── PROFESSIONAL ────────────────────────────
    if (role === 'Professional') {
      if (step === 1) return (
        <div className="flex flex-col gap-4">
          <InputField label="License Number" value={license.number} onChange={(v) => setLicense({...license, number: v})} icon={ShieldCheck} placeholder="e.g., RCI/CLP/2016/4523" />
          <SelectField label="License Type" value={license.type} onChange={(v) => setLicense({...license, type: v})} options={['RCI Clinical', 'RCI Rehabilitation', 'State License', 'International License', 'Other']} icon={Award} />
          <InputField label="Issuing Body" value={license.issuingBody} onChange={(v) => setLicense({...license, issuingBody: v})} icon={Building2} />
          <InputField label="Year of Licensure" value={license.year} onChange={(v) => setLicense({...license, year: v})} icon={Clock} />
        </div>
      );
      if (step === 2) return (
        <div className="flex flex-col gap-5">
          <SelectField label="Years of Experience" value={proExperience.years} onChange={(v) => setProExperience({...proExperience, years: v})} options={['1-3', '4-7', '8-12', '13-20', '20+']} icon={Briefcase} />
          <div><label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Specializations</label><div className="flex flex-wrap gap-2">{proExperience.specializations.map(s => <Chip key={s} label={s} variant="blue" />)}</div></div>
          <div><label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Populations Served</label><div className="flex flex-wrap gap-2">{proExperience.populations.map(p => <Chip key={p} label={p} variant="mint" />)}</div></div>
          <div><label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-2 block">Languages</label><div className="flex flex-wrap gap-2">{proExperience.languages.map(l => <Chip key={l} label={l} variant="slate" />)}</div></div>
        </div>
      );
      if (step === 3) return (
        <div className="flex flex-col gap-4">
          <ToggleCard label="I offer supervision" desc="Accept supervisees for clinical training hours" active={supervision.offerSupervision} onToggle={() => setSupervision({...supervision, offerSupervision: !supervision.offerSupervision})} icon={Users} />
          <ToggleCard label="I offer mentoring" desc="Guide early-career professionals" active={supervision.offerMentoring} onToggle={() => setSupervision({...supervision, offerMentoring: !supervision.offerMentoring})} icon={Heart} />
          <ToggleCard label="Open to research collaboration" desc="Co-author papers, lead studies" active={supervision.openToResearch} onToggle={() => setSupervision({...supervision, openToResearch: !supervision.openToResearch})} icon={BookOpen} />
          <InputField label="Hourly Rate (INR)" value={supervision.hourlyRate} onChange={(v) => setSupervision({...supervision, hourlyRate: v})} icon={Wallet} placeholder="e.g., 2,500" />
        </div>
      );
      if (step === 4) return (
        <div className="flex flex-col gap-4">
          <InputField label="Location" value={proAvailability.location} onChange={(v) => setProAvailability({...proAvailability, location: v})} icon={MapPin} />
          <SelectField label="Work Mode" value={proAvailability.workMode} onChange={(v) => setProAvailability({...proAvailability, workMode: v})} options={['Remote', 'Hybrid', 'On-site']} icon={Globe} />
          <ChipSelector label="Open To" options={['Offer Supervision', 'Offer Mentoring', 'Research Collaboration', 'Consulting', 'Workshops & Talks', 'Hiring', 'Pro Bono / CSR']} selected={proAvailability.openTo} onToggle={(o) => setProAvailability(prev => ({...prev, openTo: prev.openTo.includes(o) ? prev.openTo.filter(i => i !== o) : [...prev.openTo, o]}))} />
        </div>
      );
    }

    // ─── COMPANY ─────────────────────────────────
    if (role === 'Company') {
      if (step === 1) return (
        <div className="flex flex-col gap-4">
          <InputField label="Company Name" value={companyDetails.name} onChange={(v) => setCompanyDetails({...companyDetails, name: v})} icon={Building2} />
          <SelectField label="Organisation Type" value={companyDetails.type} onChange={(v) => setCompanyDetails({...companyDetails, type: v})} options={['Private Practice', 'Clinic', 'Hospital', 'Training Center', 'University', 'NGO', 'Corporate', 'Other']} icon={Briefcase} />
          <InputField label="Website" value={companyDetails.website} onChange={(v) => setCompanyDetails({...companyDetails, website: v})} icon={Globe} placeholder="www.example.com" />
        </div>
      );
      if (step === 2) return (
        <div className="flex flex-col gap-4">
          <SelectField label="Company Size" value={companySize.size} onChange={(v) => setCompanySize({...companySize, size: v})} options={['1-10', '11-50', '51-200', '201-500', '500+']} icon={Users} />
          <SelectField label="Primary Industry Focus" value={companySize.industry} onChange={(v) => setCompanySize({...companySize, industry: v})} options={['Clinical', 'Counseling', 'I/O Psychology', 'Research', 'Education', 'Multi-specialty']} icon={Briefcase} />
          <InputField label="Location" value={companySize.location} onChange={(v) => setCompanySize({...companySize, location: v})} icon={MapPin} />
        </div>
      );
      if (step === 3) return (
        <div className="flex flex-col gap-5">
          <ChipSelector label="What roles are you hiring for?" options={['Clinical Psychologists', 'Counselors', 'Interns', 'Researchers', 'Supervisors', 'Administrative Staff', 'Trainers']} selected={hiringNeeds} onToggle={(o) => setHiringNeeds(prev => prev.includes(o) ? prev.filter(i => i !== o) : [...prev, o])} />
          <SelectField label="Hiring Timeline" value={hiringTimeline} onChange={setHiringTimeline} options={['Immediately', 'Next 1-3 months', 'Next 6 months', 'Ongoing']} icon={Clock} />
        </div>
      );
      if (step === 4) return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">About Your Organisation</label>
            <textarea value={companyAbout} onChange={(e) => setCompanyAbout(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-sm text-gray-800 bg-gray-50/50 resize-none" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Company Logo</label>
            <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50">
              <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400"><Upload size={20} /></div>
              <div>
                <p className="text-sm font-medium text-gray-700">Upload logo</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ─── COMPLETION (shared) ─────────────────────
    if (step === totalSteps) {
      const summaryItems = role === 'Student'
        ? [{ l: 'Role', v: 'Student' }, { l: 'Stage', v: careerStage }, { l: 'Location', v: availability.location }]
        : role === 'Professional'
        ? [{ l: 'Role', v: 'Professional' }, { l: 'License', v: license.number }, { l: 'Experience', v: `${proExperience.years} years` }, { l: 'Location', v: proAvailability.location }]
        : [{ l: 'Role', v: 'Company' }, { l: 'Organisation', v: companyDetails.name }, { l: 'Type', v: companyDetails.type }, { l: 'Size', v: companySize.size }];

      return (
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mb-5">
            <Check size={28} className="text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">You're all set!</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-sm">Your profile is ready. You can always update your details from your profile page.</p>
          <div className="w-full max-w-xs flex flex-col gap-2">
            {summaryItems.map(s => (
              <div key={s.l} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{s.l}</span>
                <span className="text-sm font-semibold text-gray-800">{s.v}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] p-4 font-['Inter']">

      {/* Top Bar Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div className="h-full bg-brand-primary transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
      </div>

      <div className="w-full max-w-2xl pt-8">

        {/* Brand mark + step dots */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-sm">P</div>
            <span className="text-sm font-bold text-gray-400 tracking-tight">PsycHIRE</span>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div key={s} className={`rounded-full transition-all duration-300 ${s === step ? 'w-6 h-2 bg-brand-primary' : s < step ? 'w-2 h-2 bg-brand-primary/40' : 'w-2 h-2 bg-gray-300'}`} />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              {step > 1 && (
                <button onClick={handleBack} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors -ml-1">
                  <ChevronLeft size={18} />
                </button>
              )}
              <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                Step {step} of {totalSteps}
                {step < totalSteps && <span className="text-gray-400 normal-case font-medium ml-2">· {role}</span>}
              </span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{config.titles[step]}</h2>
            {config.subtitles[step] && (
              <p className="text-sm text-gray-500 mt-1">{config.subtitles[step]}</p>
            )}
          </div>

          {/* Content */}
          <div className="px-8 py-6 animate-fade-in">
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <div>
              {step > 1 && step < totalSteps && (
                <button onClick={handleBack} className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Back</button>
              )}
            </div>
            <button
              onClick={handleNext}
              className="bg-brand-secondary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-brand-secondary-hover transition-all shadow-sm flex items-center gap-2 group active:scale-[0.97] duration-200"
            >
              {step === totalSteps ? 'Get Started' : 'Continue'}
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Skip */}
        {step >= 2 && step < totalSteps && (
          <div className="mt-4 text-center animate-fade-in">
            <button onClick={handleNext} className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Skip for now</button>
          </div>
        )}
      </div>
    </div>
  );
}
