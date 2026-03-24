import React, { useState } from 'react';
import {
  Calendar, MapPin, Clock, Globe, Users, Mic2, FileText,
  CheckCircle2, ChevronDown, Plus, X, Upload, Sparkles,
  Tag, GraduationCap, Award, Ticket, PenTool, Handshake,
} from 'lucide-react';
import { CreateFormWizard, type WizardStep } from '@/app/components/shared/CreateFormWizard';
import { ComplianceChecklist, type ChecklistItem } from '@/app/components/shared/ComplianceChecklist';
import { SuccessCelebration } from '@/app/components/shared/SuccessCelebration';
import type { EventType, EventFormat, TargetAudience, Speaker, AgendaItem, SponsorTier } from '@/app/data/events';
import { EVENT_TYPE_OPTIONS, EVENT_FORMAT_OPTIONS, SPECIALIZATION_OPTIONS } from '@/app/data/events';

/* ═══ Types ═══ */

interface TicketCategoryForm {
  name: string;
  price: string;
  maxQuantity: string;
  description: string;
  discountPercent: string;
}

interface SponsorshipTierForm {
  tier: SponsorTier | '';
  amount: string;
  benefits: string[];
  maxSpots: string;
}

interface EventFormData {
  title: string;
  type: EventType | '';
  format: EventFormat | '';
  specialization: string;
  targetAudience: TargetAudience | '';
  description: string;
  objective: string;
  // Schedule
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  timezone: string;
  location: string;
  platformLink: string;
  // Speakers
  speakers: Speaker[];
  agenda: AgendaItem[];
  // Tickets & Config
  isFree: boolean;
  price: string;
  currency: string;
  ticketCategories: TicketCategoryForm[];
  maxAttendees: string;
  registrationDeadline: string;
  // Action Buttons
  enableRSVP: boolean;
  enableCallForPapers: boolean;
  enableSpeakerSlots: boolean;
  enableSponsorship: boolean;
  // Sponsorship
  sponsorshipTiers: SponsorshipTierForm[];
  // Extras
  tags: string[];
  languages: string[];
  featured: boolean;
  brochureUploaded: boolean;
  agendaUploaded: boolean;
  sponsorshipDeckUploaded: boolean;
}

const DEFAULT_FORM: EventFormData = {
  title: '', type: '', format: '', specialization: '', targetAudience: '',
  description: '', objective: '',
  startDate: '', startTime: '', endDate: '', endTime: '',
  timezone: 'IST (UTC+5:30)', location: '', platformLink: '',
  speakers: [], agenda: [],
  isFree: true, price: '', currency: 'INR',
  ticketCategories: [], maxAttendees: '', registrationDeadline: '',
  enableRSVP: true, enableCallForPapers: false, enableSpeakerSlots: false, enableSponsorship: false,
  sponsorshipTiers: [],
  tags: [''], languages: ['English'], featured: false,
  brochureUploaded: false, agendaUploaded: false, sponsorshipDeckUploaded: false,
};

const PREFILLED_FORM: EventFormData = {
  title: 'Advances in Cognitive Behavioral Therapy — 2026 Summit',
  type: 'Conference / Summit', format: 'Hybrid', specialization: 'Clinical Psychology',
  targetAudience: 'Both',
  description: 'A premier gathering of CBT practitioners and researchers discussing the latest advances in cognitive-behavioral interventions. Features keynote addresses, breakout workshops, poster presentations, and networking opportunities.',
  objective: 'Share cutting-edge CBT research findings and practical techniques with practitioners across India.',
  startDate: '2026-05-15', startTime: '09:00', endDate: '2026-05-17', endTime: '17:00',
  timezone: 'IST (UTC+5:30)', location: 'Taj Convention Centre, Mumbai',
  platformLink: 'https://zoom.us/meeting/cbt-summit-2026',
  speakers: [
    { name: 'Dr. Sarah Jenkins', role: 'Director, CBT Institute, London', bio: 'Pioneer in third-wave CBT approaches.' },
    { name: 'Dr. Anand Patel', role: 'Chief Psychologist, NIMHANS', bio: 'Leading researcher in CBT for adolescent disorders.' },
  ],
  agenda: [
    { time: '09:00', title: 'Opening Keynote: The Future of CBT', speaker: 'Dr. Sarah Jenkins' },
    { time: '10:30', title: 'Workshop: ACT in Clinical Practice' },
    { time: '12:00', title: 'Networking Lunch' },
    { time: '13:30', title: 'Panel: CBT for Trauma-Informed Care', speaker: 'Dr. Anand Patel' },
    { time: '15:00', title: 'Poster Presentations' },
    { time: '16:30', title: 'Closing & Awards Ceremony' },
  ],
  isFree: false, price: '150', currency: 'INR',
  ticketCategories: [
    { name: 'Student', price: '2500', maxQuantity: '100', description: 'Valid student ID required', discountPercent: '' },
    { name: 'Early Bird', price: '4500', maxQuantity: '50', description: 'Available until April 30', discountPercent: '25' },
    { name: 'General', price: '6000', maxQuantity: '150', description: '', discountPercent: '' },
    { name: 'Group (5+)', price: '25000', maxQuantity: '20', description: 'Pack of 5 tickets', discountPercent: '17' },
  ],
  maxAttendees: '300', registrationDeadline: '2026-05-10',
  enableRSVP: true, enableCallForPapers: true, enableSpeakerSlots: true, enableSponsorship: true,
  sponsorshipTiers: [
    { tier: 'Gold', amount: '500000', benefits: ['Main stage branding', 'Keynote introduction', '20 passes', 'Exhibition booth'], maxSpots: '3' },
    { tier: 'Silver', amount: '250000', benefits: ['Event page branding', '10 passes', 'Social media package'], maxSpots: '5' },
  ],
  tags: ['CBT', 'Clinical Psychology', 'Summit', 'Research'],
  languages: ['English', 'Hindi'], featured: false,
  brochureUploaded: true, agendaUploaded: true, sponsorshipDeckUploaded: false,
};

const STEPS: WizardStep[] = [
  { id: 'basic', label: 'Basic Info', shortLabel: 'Basics' },
  { id: 'schedule', label: 'Schedule & Venue', shortLabel: 'Schedule' },
  { id: 'speakers', label: 'Speakers & Agenda', shortLabel: 'Speakers' },
  { id: 'tickets', label: 'Tickets & Actions', shortLabel: 'Tickets' },
  { id: 'extras', label: 'Uploads & Extras', shortLabel: 'Extras' },
  { id: 'review', label: 'Review & Submit', shortLabel: 'Review' },
];

const EVENT_COMPLIANCE: ChecklistItem[] = [
  { id: 'accurate', label: 'Accurate Event Information', description: 'All details including dates, venue, and pricing are truthful and verified', required: true },
  { id: 'non_disc', label: 'Non-discriminatory Language', description: 'Event description does not discriminate based on gender, caste, religion, or disability', required: true },
  { id: 'pricing', label: 'Pricing Disclosed', description: 'Ticket prices and any additional fees are clearly mentioned', required: true },
  { id: 'contact', label: 'Valid Contact Information', description: 'Correct organizational contact details are provided', required: true },
  { id: 'deadline', label: 'Valid Registration Deadline', description: 'Registration deadline is set before the event start date', required: true },
  { id: 'guidelines', label: 'Community Guidelines', description: 'Event follows PsycHIRE community guidelines and terms of service', required: true },
  { id: 'speakers', label: 'Speaker Consent', description: 'All listed speakers have consented to their participation being advertised', required: true },
];

const TIMEZONE_OPTIONS = ['IST (UTC+5:30)', 'EST (UTC-5)', 'PST (UTC-8)', 'GMT (UTC+0)', 'CET (UTC+1)', 'AEST (UTC+10)'];
const CURRENCY_OPTIONS = ['INR', 'USD', 'EUR', 'GBP'];
const SPONSOR_TIER_OPTIONS: SponsorTier[] = ['Gold', 'Silver', 'Knowledge Partner', 'Custom'];

/* ═══ Helpers ═══ */

function SelectField({ label, value, onChange, options, required }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
          style={{ fontSize: 13 }}>
          <option value="">Select...</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, placeholder, required, multiline, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; multiline?: boolean; type?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
          style={{ fontSize: 13 }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
          style={{ fontSize: 13 }} />
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
            <span className="w-6 h-6 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>{i + 1}</span>
            <input type="text" value={item} onChange={e => updateItem(i, e.target.value)} placeholder={placeholder}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
              style={{ fontSize: 13 }} />
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <button onClick={addItem} className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors self-start" style={{ fontSize: 12, fontWeight: 600 }}>
        <Plus size={14} /> Add Another
      </button>
    </div>
  );
}

function UploadBox({ label, description, uploaded, onToggle }: { label: string; description: string; uploaded: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full p-4 rounded-xl border-2 border-dashed text-left transition-all ${
        uploaded ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-rose-300 hover:bg-rose-50/30'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${uploaded ? 'bg-green-100' : 'bg-gray-100'}`}>
          {uploaded ? <CheckCircle2 size={20} className="text-green-600" /> : <Upload size={20} className="text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className={uploaded ? 'text-green-700' : 'text-gray-700'} style={{ fontSize: 13, fontWeight: 600 }}>{label}</p>
          <p className={uploaded ? 'text-green-600' : 'text-gray-500'} style={{ fontSize: 11 }}>
            {uploaded ? 'Uploaded successfully — click to remove' : description}
          </p>
        </div>
      </div>
    </button>
  );
}

/* ═══ Component ═══ */

interface CreateEventPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
  editMode?: boolean;
  editEventId?: string;
}

export function CreateEventPage({ onBack, onNavigate, editMode = false, editEventId }: CreateEventPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState<EventFormData>(editMode ? PREFILLED_FORM : DEFAULT_FORM);
  const [showCompliance, setShowCompliance] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const updateForm = <K extends keyof EventFormData>(key: K, value: EventFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const canSubmit = form.title.trim() !== '' && form.type !== '' && form.format !== '' && form.description.trim() !== '' && form.startDate !== '' && form.location.trim() !== '';

  const missingFields: string[] = [];
  if (!form.title.trim()) missingFields.push('Title');
  if (!form.type) missingFields.push('Event Type');
  if (!form.format) missingFields.push('Format');
  if (!form.description.trim()) missingFields.push('Description');
  if (!form.startDate) missingFields.push('Start Date');
  if (!form.location.trim()) missingFields.push('Location / Venue');

  const handleSaveDraft = () => {
    // simulate save
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setShowCompliance(true);
  };

  const handleComplianceConfirm = () => {
    setShowCompliance(false);
    setSubmitted(true);
  };

  // Speaker helpers
  const addSpeaker = () => updateForm('speakers', [...form.speakers, { name: '', role: '', bio: '' }]);
  const removeSpeaker = (idx: number) => updateForm('speakers', form.speakers.filter((_, i) => i !== idx));
  const updateSpeaker = (idx: number, field: keyof Speaker, val: string) =>
    updateForm('speakers', form.speakers.map((s, i) => i === idx ? { ...s, [field]: val } : s));

  // Agenda helpers
  const addAgendaItem = () => updateForm('agenda', [...form.agenda, { time: '', title: '', speaker: '' }]);
  const removeAgendaItem = (idx: number) => updateForm('agenda', form.agenda.filter((_, i) => i !== idx));
  const updateAgendaItem = (idx: number, field: keyof AgendaItem, val: string) =>
    updateForm('agenda', form.agenda.map((a, i) => i === idx ? { ...a, [field]: val } : a));

  // Ticket helpers
  const addTicket = () => updateForm('ticketCategories', [...form.ticketCategories, { name: '', price: '', maxQuantity: '', description: '', discountPercent: '' }]);
  const removeTicket = (idx: number) => updateForm('ticketCategories', form.ticketCategories.filter((_, i) => i !== idx));
  const updateTicket = (idx: number, field: keyof TicketCategoryForm, val: string) =>
    updateForm('ticketCategories', form.ticketCategories.map((t, i) => i === idx ? { ...t, [field]: val } : t));

  // Sponsorship tier helpers
  const addSponsorTier = () => updateForm('sponsorshipTiers', [...form.sponsorshipTiers, { tier: '', amount: '', benefits: [''], maxSpots: '' }]);
  const removeSponsorTier = (idx: number) => updateForm('sponsorshipTiers', form.sponsorshipTiers.filter((_, i) => i !== idx));
  const updateSponsorTier = (idx: number, field: keyof SponsorshipTierForm, val: any) =>
    updateForm('sponsorshipTiers', form.sponsorshipTiers.map((t, i) => i === idx ? { ...t, [field]: val } : t));

  if (submitted) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-[#f0f4f8] animate-fade-in">
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <SuccessCelebration
            title={editMode ? 'Event Updated!' : 'Event Submitted!'}
            subtitle={editMode
              ? 'Your changes have been saved and resubmitted for admin review.'
              : "Your event has been submitted for admin review. You'll be notified once it's approved and goes live on PsycHIRE."}
            actionLabel="Back to My Listings"
            onAction={() => onNavigate('My Listings')}
            secondaryLabel="Create Another Event"
            onSecondary={() => {
              setForm(DEFAULT_FORM);
              setCurrentStep(0);
              setSubmitted(false);
            }}
          />
        </div>
      </div>
    );
  }

  /* ── Section Card wrapper ── */
  const SectionCard = ({ title, icon: Icon, children, className = '' }: { title: string; icon: React.ElementType; children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6 ${className}`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
          <Icon size={16} className="text-rose-600" />
        </div>
        <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{title}</p>
      </div>
      {children}
    </div>
  );

  return (
    <>
      <CreateFormWizard
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onSaveDraft={handleSaveDraft}
        onPreview={() => {}}
        onSubmit={handleSubmit}
        onBack={onBack}
        entityType="Event"
        isLastStepPreview
        canSubmit={canSubmit}
        missingFields={missingFields}
        isDraft
      >
        {/* ════════ STEP 1: Basic Info ════════ */}
        {currentStep === 0 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <SectionCard title="Event Information" icon={Calendar}>
              <div className="flex flex-col gap-4">
                <TextField label="Event Title" value={form.title} onChange={v => updateForm('title', v)} placeholder="e.g., Annual CBT Summit 2026" required />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Event Type" value={form.type} onChange={v => updateForm('type', v as EventType)} options={EVENT_TYPE_OPTIONS as string[]} required />
                  <SelectField label="Format" value={form.format} onChange={v => updateForm('format', v as EventFormat)} options={EVENT_FORMAT_OPTIONS as string[]} required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField label="Specialization" value={form.specialization} onChange={v => updateForm('specialization', v)} options={SPECIALIZATION_OPTIONS} required />
                  <SelectField label="Target Audience" value={form.targetAudience} onChange={v => updateForm('targetAudience', v as TargetAudience)} options={['Students', 'Professionals', 'Both']} required />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Description" icon={FileText}>
              <div className="flex flex-col gap-4">
                <TextField label="Event Description" value={form.description} onChange={v => updateForm('description', v)} placeholder="Describe what attendees can expect..." required multiline />
                <TextField label="Objective" value={form.objective} onChange={v => updateForm('objective', v)} placeholder="What is the primary goal of this event?" multiline />
              </div>
            </SectionCard>
          </div>
        )}

        {/* ════════ STEP 2: Schedule & Venue ════════ */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <SectionCard title="Date & Time" icon={Clock}>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Start Date" value={form.startDate} onChange={v => updateForm('startDate', v)} type="date" required />
                  <TextField label="End Date" value={form.endDate} onChange={v => updateForm('endDate', v)} type="date" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Start Time" value={form.startTime} onChange={v => updateForm('startTime', v)} type="time" required />
                  <TextField label="End Time" value={form.endTime} onChange={v => updateForm('endTime', v)} type="time" required />
                </div>
                <SelectField label="Timezone" value={form.timezone} onChange={v => updateForm('timezone', v)} options={TIMEZONE_OPTIONS} required />
              </div>
            </SectionCard>

            <SectionCard title="Venue & Location" icon={MapPin}>
              <div className="flex flex-col gap-4">
                {(form.format === 'In-Person' || form.format === 'Hybrid') && (
                  <TextField label="Venue / Address" value={form.location} onChange={v => updateForm('location', v)} placeholder="e.g., Taj Convention Centre, Mumbai" required />
                )}
                {(form.format === 'Virtual' || form.format === 'Hybrid') && (
                  <TextField label="Platform / Meeting Link" value={form.platformLink} onChange={v => updateForm('platformLink', v)} placeholder="e.g., https://zoom.us/meeting/..." />
                )}
                {!form.format && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                    <p className="text-gray-500" style={{ fontSize: 13 }}>Select a format in Step 1 to see venue options</p>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ════════ STEP 3: Speakers & Agenda ════════ */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <SectionCard title="Speakers / Presenters" icon={Mic2}>
              <div className="flex flex-col gap-4">
                {form.speakers.length === 0 && (
                  <div className="p-6 rounded-xl bg-gray-50/60 border border-gray-100 text-center">
                    <Mic2 size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 mb-3" style={{ fontSize: 13 }}>No speakers added yet</p>
                    <button onClick={addSpeaker} className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>
                      <Plus size={14} /> Add Speaker
                    </button>
                  </div>
                )}
                {form.speakers.map((speaker, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-gray-700" style={{ fontSize: 12, fontWeight: 700 }}>Speaker {idx + 1}</p>
                      <button onClick={() => removeSpeaker(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input type="text" value={speaker.name} onChange={e => updateSpeaker(idx, 'name', e.target.value)} placeholder="Full Name"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 13 }} />
                      <input type="text" value={speaker.role} onChange={e => updateSpeaker(idx, 'role', e.target.value)} placeholder="Role / Title"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 13 }} />
                    </div>
                    <textarea value={speaker.bio || ''} onChange={e => updateSpeaker(idx, 'bio', e.target.value)} placeholder="Short bio (optional)" rows={2}
                      className="w-full mt-3 px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 13 }} />
                  </div>
                ))}
                {form.speakers.length > 0 && (
                  <button onClick={addSpeaker} className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors self-start" style={{ fontSize: 12, fontWeight: 600 }}>
                    <Plus size={14} /> Add Another Speaker
                  </button>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Agenda / Schedule" icon={Calendar}>
              <div className="flex flex-col gap-3">
                {form.agenda.length === 0 && (
                  <div className="p-6 rounded-xl bg-gray-50/60 border border-gray-100 text-center">
                    <Calendar size={24} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 mb-3" style={{ fontSize: 13 }}>No agenda items yet</p>
                    <button onClick={addAgendaItem} className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>
                      <Plus size={14} /> Add Item
                    </button>
                  </div>
                )}
                {form.agenda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/60 border border-gray-100">
                    <div className="flex flex-col items-center gap-1 pt-1">
                      <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0" style={{ fontSize: 10, fontWeight: 700 }}>{idx + 1}</span>
                    </div>
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-[100px_1fr_1fr] gap-2">
                      <input type="time" value={item.time} onChange={e => updateAgendaItem(idx, 'time', e.target.value)}
                        className="px-2 py-2 rounded-lg border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                      <input type="text" value={item.title} onChange={e => updateAgendaItem(idx, 'title', e.target.value)} placeholder="Session title"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 13 }} />
                      <input type="text" value={item.speaker || ''} onChange={e => updateAgendaItem(idx, 'speaker', e.target.value)} placeholder="Speaker (optional)"
                        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 13 }} />
                    </div>
                    <button onClick={() => removeAgendaItem(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 mt-0.5">
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {form.agenda.length > 0 && (
                  <button onClick={addAgendaItem} className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors self-start" style={{ fontSize: 12, fontWeight: 600 }}>
                    <Plus size={14} /> Add Agenda Item
                  </button>
                )}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ════════ STEP 4: Tickets & Action Buttons ════════ */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <SectionCard title="Registration & Tickets" icon={Ticket}>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextField label="Max Attendees" value={form.maxAttendees} onChange={v => updateForm('maxAttendees', v)} placeholder="e.g., 300" type="number" />
                  <TextField label="Registration Deadline" value={form.registrationDeadline} onChange={v => updateForm('registrationDeadline', v)} type="date" />
                </div>

                {/* Free/Paid Toggle */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                  <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Event Pricing</p>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => updateForm('isFree', true)}
                      className={`px-4 py-1.5 rounded-lg transition-all ${form.isFree ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >Free</button>
                    <button
                      onClick={() => updateForm('isFree', false)}
                      className={`px-4 py-1.5 rounded-lg transition-all ${!form.isFree ? 'bg-rose-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >Paid</button>
                  </div>
                </div>

                {!form.isFree && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <SelectField label="Currency" value={form.currency} onChange={v => updateForm('currency', v)} options={CURRENCY_OPTIONS} />
                      <TextField label="Base Price" value={form.price} onChange={v => updateForm('price', v)} placeholder="e.g., 6000" type="number" />
                    </div>

                    {/* Ticket Categories */}
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Ticket Categories</p>
                        <button onClick={addTicket} className="flex items-center gap-1 text-rose-600 hover:text-rose-700 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>
                          <Plus size={14} /> Add Ticket
                        </button>
                      </div>
                      {form.ticketCategories.length === 0 && (
                        <p className="text-gray-400 p-4 rounded-xl bg-gray-50/60 border border-gray-100 text-center" style={{ fontSize: 12 }}>
                          No ticket categories yet. Add categories like Student, Early Bird, General, etc.
                        </p>
                      )}
                      {form.ticketCategories.map((ticket, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100 mb-3">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-gray-700" style={{ fontSize: 12, fontWeight: 700 }}>Ticket {idx + 1}</p>
                            <button onClick={() => removeTicket(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                              <X size={14} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <input type="text" value={ticket.name} onChange={e => updateTicket(idx, 'name', e.target.value)} placeholder="Name"
                              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                            <input type="number" value={ticket.price} onChange={e => updateTicket(idx, 'price', e.target.value)} placeholder="Price"
                              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                            <input type="number" value={ticket.maxQuantity} onChange={e => updateTicket(idx, 'maxQuantity', e.target.value)} placeholder="Max Qty"
                              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                            <input type="text" value={ticket.discountPercent} onChange={e => updateTicket(idx, 'discountPercent', e.target.value)} placeholder="Discount %"
                              className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                          </div>
                          <input type="text" value={ticket.description} onChange={e => updateTicket(idx, 'description', e.target.value)} placeholder="Description (optional)"
                            className="w-full mt-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </SectionCard>

            {/* Action Buttons Config */}
            <SectionCard title="Participation Types" icon={Users}>
              <p className="text-gray-500 mb-4" style={{ fontSize: 12 }}>
                Enable different ways for people to participate in your event. Each type will show as an action button on the event page.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'enableRSVP' as const, label: 'RSVP / Register', icon: Ticket, desc: 'Allow attendees to register for the event' },
                  { key: 'enableCallForPapers' as const, label: 'Call for Papers', icon: PenTool, desc: 'Accept paper/abstract submissions' },
                  { key: 'enableSpeakerSlots' as const, label: 'Speaker Applications', icon: Mic2, desc: 'Accept speaker/presenter applications' },
                  { key: 'enableSponsorship' as const, label: 'Sponsorship', icon: Handshake, desc: 'Accept sponsorship inquiries' },
                ].map(action => (
                  <button
                    key={action.key}
                    onClick={() => updateForm(action.key, !form[action.key])}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      form[action.key]
                        ? 'border-rose-300 bg-rose-50/60 ring-1 ring-rose-200'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${form[action.key] ? 'bg-rose-100' : 'bg-gray-100'}`}>
                        <action.icon size={16} className={form[action.key] ? 'text-rose-600' : 'text-gray-400'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={form[action.key] ? 'text-rose-700' : 'text-gray-700'} style={{ fontSize: 13, fontWeight: 600 }}>{action.label}</p>
                        <p className={form[action.key] ? 'text-rose-500' : 'text-gray-400'} style={{ fontSize: 11 }}>{action.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        form[action.key] ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                      }`}>
                        {form[action.key] && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ════════ STEP 5: Uploads & Extras ════════ */}
        {currentStep === 4 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <SectionCard title="Document Uploads" icon={Upload}>
              <div className="flex flex-col gap-3">
                <UploadBox label="Event Brochure" description="PDF or image — max 10MB" uploaded={form.brochureUploaded} onToggle={() => updateForm('brochureUploaded', !form.brochureUploaded)} />
                <UploadBox label="Agenda Document" description="PDF — max 5MB" uploaded={form.agendaUploaded} onToggle={() => updateForm('agendaUploaded', !form.agendaUploaded)} />
                {form.enableSponsorship && (
                  <UploadBox label="Sponsorship Deck" description="PDF or PPT — max 20MB" uploaded={form.sponsorshipDeckUploaded} onToggle={() => updateForm('sponsorshipDeckUploaded', !form.sponsorshipDeckUploaded)} />
                )}
              </div>
            </SectionCard>

            {/* Sponsorship Tiers (if enabled) */}
            {form.enableSponsorship && (
              <SectionCard title="Sponsorship Tiers" icon={Award}>
                <div className="flex flex-col gap-3">
                  {form.sponsorshipTiers.length === 0 && (
                    <div className="p-6 rounded-xl bg-gray-50/60 border border-gray-100 text-center">
                      <Award size={24} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500 mb-3" style={{ fontSize: 13 }}>Define sponsorship tiers and their benefits</p>
                      <button onClick={addSponsorTier} className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}>
                        <Plus size={14} /> Add Tier
                      </button>
                    </div>
                  )}
                  {form.sponsorshipTiers.map((tier, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50/60 border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-gray-700" style={{ fontSize: 12, fontWeight: 700 }}>Tier {idx + 1}</p>
                        <button onClick={() => removeSponsorTier(idx)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div className="relative">
                          <select value={tier.tier} onChange={e => updateSponsorTier(idx, 'tier', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 appearance-none focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all"
                            style={{ fontSize: 12 }}>
                            <option value="">Tier Name</option>
                            {SPONSOR_TIER_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                        <input type="number" value={tier.amount} onChange={e => updateSponsorTier(idx, 'amount', e.target.value)} placeholder="Amount"
                          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                        <input type="number" value={tier.maxSpots} onChange={e => updateSponsorTier(idx, 'maxSpots', e.target.value)} placeholder="Max Spots"
                          className="px-3 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <p className="text-gray-600" style={{ fontSize: 11, fontWeight: 600 }}>Benefits</p>
                        {tier.benefits.map((b, bi) => (
                          <div key={bi} className="flex items-center gap-2">
                            <input type="text" value={b} onChange={e => {
                              const updated = [...tier.benefits];
                              updated[bi] = e.target.value;
                              updateSponsorTier(idx, 'benefits', updated);
                            }} placeholder="Benefit description"
                              className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:border-rose-300 transition-all" style={{ fontSize: 12 }} />
                            {tier.benefits.length > 1 && (
                              <button onClick={() => {
                                const updated = tier.benefits.filter((_, i) => i !== bi);
                                updateSponsorTier(idx, 'benefits', updated);
                              }} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                            )}
                          </div>
                        ))}
                        <button onClick={() => updateSponsorTier(idx, 'benefits', [...tier.benefits, ''])}
                          className="text-rose-600 hover:text-rose-700 self-start" style={{ fontSize: 11, fontWeight: 600 }}>
                          + Add Benefit
                        </button>
                      </div>
                    </div>
                  ))}
                  {form.sponsorshipTiers.length > 0 && (
                    <button onClick={addSponsorTier} className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 transition-colors self-start" style={{ fontSize: 12, fontWeight: 600 }}>
                      <Plus size={14} /> Add Another Tier
                    </button>
                  )}
                </div>
              </SectionCard>
            )}

            <SectionCard title="Tags & Languages" icon={Tag}>
              <div className="flex flex-col gap-4">
                <ListField label="Tags" items={form.tags} onChange={v => updateForm('tags', v)} placeholder="e.g., CBT, Research, Summit" />
                <ListField label="Languages" items={form.languages} onChange={v => updateForm('languages', v)} placeholder="e.g., English" />
              </div>
            </SectionCard>

            {/* Featured Toggle */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Sparkles size={18} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-amber-800" style={{ fontSize: 14, fontWeight: 700 }}>Featured Event</p>
                  <p className="text-amber-600" style={{ fontSize: 12 }}>Boost visibility with carousel placement, search priority, and email highlights.</p>
                </div>
                <button
                  onClick={() => updateForm('featured', !form.featured)}
                  className={`px-5 py-2 rounded-lg transition-all ${form.featured ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'}`}
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  {form.featured ? 'Featured ✓' : 'Upgrade'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ════════ STEP 6: Review & Submit ════════ */}
        {currentStep === 5 && (
          <div className="flex flex-col gap-5 animate-fade-in">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Preview Header */}
              <div className="bg-gradient-to-br from-[#4338ca] via-[#3730a3] to-[#312e81] p-6">
                <p className="text-white mb-1" style={{ fontSize: 22, fontWeight: 800 }}>
                  {form.title || 'Untitled Event'}
                </p>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {form.type && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white/90 border border-white/10">{form.type}</span>}
                  {form.format && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white/90 border border-white/10">{form.format}</span>}
                  {form.specialization && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white/90 border border-white/10">{form.specialization}</span>}
                  {form.featured && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-200 border border-amber-400/25">★ Featured</span>}
                </div>
              </div>

              {/* Preview Body */}
              <div className="p-6 flex flex-col gap-5">
                {/* Quick Facts */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Date', value: form.startDate ? new Date(form.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—', icon: Calendar },
                    { label: 'Time', value: form.startTime && form.endTime ? `${form.startTime} – ${form.endTime}` : '—', icon: Clock },
                    { label: 'Location', value: form.format === 'Virtual' ? 'Virtual' : form.location || '—', icon: form.format === 'Virtual' ? Globe : MapPin },
                    { label: 'Audience', value: form.targetAudience || '—', icon: Users },
                  ].map(fact => (
                    <div key={fact.label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-1.5 mb-1">
                        <fact.icon size={12} className="text-gray-400" />
                        <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>{fact.label}</p>
                      </div>
                      <p className="text-gray-800 truncate" style={{ fontSize: 13, fontWeight: 600 }}>{fact.value}</p>
                    </div>
                  ))}
                </div>

                {/* Description */}
                {form.description && (
                  <div>
                    <p className="text-gray-400 mb-1" style={{ fontSize: 11, fontWeight: 600 }}>DESCRIPTION</p>
                    <p className="text-gray-600" style={{ fontSize: 13, lineHeight: 1.7 }}>{form.description}</p>
                  </div>
                )}

                {/* Speakers Preview */}
                {form.speakers.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>SPEAKERS ({form.speakers.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {form.speakers.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-[11px] font-bold text-rose-600">{s.name?.[0] || '?'}</div>
                          <div>
                            <p className="text-gray-800 truncate" style={{ fontSize: 12, fontWeight: 600 }}>{s.name || 'Unnamed'}</p>
                            <p className="text-gray-400" style={{ fontSize: 10 }}>{s.role || 'No role'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Agenda Preview */}
                {form.agenda.length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>AGENDA ({form.agenda.length} items)</p>
                    <div className="flex flex-col gap-1.5">
                      {form.agenda.map((a, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50/70">
                          <span className="text-gray-400 shrink-0" style={{ fontSize: 11, fontWeight: 600 }}>{a.time || '—'}</span>
                          <span className="text-gray-700" style={{ fontSize: 12, fontWeight: 500 }}>{a.title || 'Untitled'}</span>
                          {a.speaker && <span className="text-gray-400 ml-auto" style={{ fontSize: 11 }}>— {a.speaker}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing Preview */}
                <div>
                  <p className="text-gray-400 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>PRICING</p>
                  {form.isFree ? (
                    <span className="inline-flex px-3 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200" style={{ fontSize: 12, fontWeight: 700 }}>Free Event</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {form.ticketCategories.length > 0 ? form.ticketCategories.map((t, i) => (
                        <div key={i} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                          <p className="text-gray-800" style={{ fontSize: 12, fontWeight: 600 }}>{t.name || 'Unnamed'}</p>
                          <p className="text-gray-500" style={{ fontSize: 11 }}>{form.currency} {t.price || '0'}</p>
                        </div>
                      )) : (
                        <span className="text-gray-500" style={{ fontSize: 12 }}>{form.currency} {form.price || '0'}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons Preview */}
                <div>
                  <p className="text-gray-400 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>ENABLED PARTICIPATION TYPES</p>
                  <div className="flex flex-wrap gap-2">
                    {form.enableRSVP && <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-600 border border-rose-200" style={{ fontSize: 11, fontWeight: 600 }}>RSVP / Register</span>}
                    {form.enableCallForPapers && <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 border border-purple-200" style={{ fontSize: 11, fontWeight: 600 }}>Call for Papers</span>}
                    {form.enableSpeakerSlots && <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-200" style={{ fontSize: 11, fontWeight: 600 }}>Speaker Apps</span>}
                    {form.enableSponsorship && <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200" style={{ fontSize: 11, fontWeight: 600 }}>Sponsorship</span>}
                  </div>
                </div>

                {/* Tags */}
                {form.tags.filter(t => t.trim()).length > 0 && (
                  <div>
                    <p className="text-gray-400 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>TAGS</p>
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.filter(t => t.trim()).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-gray-100 text-gray-600" style={{ fontSize: 11, fontWeight: 500 }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Readiness checklist summary */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Submission Readiness</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { label: 'Event title', ok: !!form.title },
                  { label: 'Event type & format', ok: !!form.type && !!form.format },
                  { label: 'Start date & time', ok: !!form.startDate && !!form.startTime },
                  { label: 'Description', ok: !!form.description },
                  { label: 'Venue or link', ok: !!(form.location || form.platformLink || form.format === '') },
                  { label: 'Target audience', ok: !!form.targetAudience },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50/60">
                    <CheckCircle2 size={14} className={item.ok ? 'text-green-500' : 'text-gray-300'} />
                    <span className={item.ok ? 'text-gray-700' : 'text-gray-400'} style={{ fontSize: 12, fontWeight: 500 }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CreateFormWizard>

      <ComplianceChecklist
        isOpen={showCompliance}
        onClose={() => setShowCompliance(false)}
        onConfirm={handleComplianceConfirm}
        entityType="Event"
        items={EVENT_COMPLIANCE}
      />
    </>
  );
}