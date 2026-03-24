import React, { useState } from 'react';
import { ChevronLeft, Calendar, Eye, MapPin, Clock, Users, TrendingUp, BarChart3, Ticket, Mic2, PenTool, Handshake } from 'lucide-react';
import { ApplicationListView, type Applicant, type ApplicationStatusType } from '@/app/components/shared/ApplicationListView';
import { StatusLifecycle, type LifecycleStep } from '@/app/components/shared/StatusLifecycle';

/* ═══ Mock Data ═══ */

const EVENT_INFO = {
  title: 'Annual Psychology Conference 2026',
  organizer: 'MindCare Clinic',
  location: 'Mumbai Convention Centre',
  type: 'Conference / Summit',
  posted: 'Jan 5, 2026',
  deadline: 'May 20, 2026',
  status: 'active' as const,
  views: 890,
  registrations: 156,
};

const LIFECYCLE_STEPS: LifecycleStep[] = [
  { id: 'draft', label: 'Draft', timestamp: 'Jan 3' },
  { id: 'review', label: 'Under Review', timestamp: 'Jan 4' },
  { id: 'active', label: 'Active', timestamp: 'Jan 5', description: 'Accepting registrations' },
  { id: 'ongoing', label: 'Event Ongoing' },
  { id: 'completed', label: 'Completed' },
];

const MOCK_REGISTRATIONS: Applicant[] = [
  {
    id: 'r1', name: 'Priya Sharma', email: 'priya.sharma@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBwc3ljaG9sb2d5fGVufDF8fHx8MTc3MDEwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Jan 20, 2026', status: 'accepted', matchScore: 92,
    headline: 'Student — General Ticket', resumeAvailable: true,
  },
  {
    id: 'r2', name: 'Dr. Arjun Mehta', email: 'arjun.mehta@serenityhealth.in',
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBibGF6ZXIlMjBjb25maWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzA3MTA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Jan 22, 2026', status: 'accepted',
    headline: 'Professional — Early Bird Ticket', resumeAvailable: true,
  },
  {
    id: 'r3', name: 'Sneha Patel', email: 'sneha.patel@yahoo.com',
    avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHBzeWNob2xvZ3l8ZW58MXx8fHwxNzcwMTA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 5, 2026', status: 'new',
    headline: 'Student — Group Ticket (5)', resumeAvailable: true,
  },
  {
    id: 'r4', name: 'Dr. Kavita Desai', email: 'kavita.desai@jnu.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1770627016447-cb9d29ed0398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbiUyMGNvcnBvcmF0ZSUyMGJ1c2luZXNzJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczNjY1MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 10, 2026', status: 'waitlisted',
    headline: 'Professional — General Ticket', resumeAvailable: true,
  },
  {
    id: 'r5', name: 'Rohan Kapoor', email: 'rohan.k@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhZG1pbmlzdHJhdG9yJTIwZm9ybWFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM2NjUxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 12, 2026', status: 'rejected',
    headline: 'Student — Student Ticket', resumeAvailable: false,
  },
];

const MOCK_PAPER_SUBMISSIONS: Applicant[] = [
  {
    id: 'ps1', name: 'Dr. Meera Iyer', email: 'meera.iyer@nimhans.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1770627016447-cb9d29ed0398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbiUyMGNvcnBvcmF0ZSUyMGJ1c2luZXNzJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczNjY1MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 1, 2026', status: 'shortlisted', matchScore: 88,
    headline: 'Paper: CBT for Adolescent Anxiety in Indian Context', resumeAvailable: true,
  },
  {
    id: 'ps2', name: 'Anand Kumar', email: 'anand.k@du.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhZG1pbmlzdHJhdG9yJTIwZm9ybWFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM2NjUxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 8, 2026', status: 'new',
    headline: 'Paper: Neural Correlates of Meditation Practice', resumeAvailable: true,
  },
  {
    id: 'ps3', name: 'Rhea Deshmukh', email: 'rhea.d@tiss.edu',
    avatarUrl: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBwc3ljaG9sb2d5fGVufDF8fHx8MTc3MDEwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 15, 2026', status: 'new',
    headline: 'Paper: Community-Based Mental Health Interventions', resumeAvailable: true,
  },
];

const MOCK_SPEAKER_APPS: Applicant[] = [
  {
    id: 'sa1', name: 'Dr. Anand Patel', email: 'anand.patel@nimhans.ac.in',
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBibGF6ZXIlMjBjb25maWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzA3MTA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Jan 28, 2026', status: 'accepted', matchScore: 95,
    headline: 'Topic: CBT for Trauma-Informed Care', resumeAvailable: true,
  },
  {
    id: 'sa2', name: 'Dr. Priya Nair', email: 'priya.nair@mindcare.com',
    avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHBzeWNob2xvZ3l8ZW58MXx8fHwxNzcwMTA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 3, 2026', status: 'new',
    headline: 'Topic: Mindfulness-Based Cognitive Therapy Updates', resumeAvailable: true,
  },
];

const MOCK_SPONSOR_APPS: Applicant[] = [
  {
    id: 'sp1', name: 'TechCorp India', email: 'partnerships@techcorp.in',
    avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
    appliedDate: 'Jan 15, 2026', status: 'accepted',
    headline: 'Gold Tier — ₹5,00,000', resumeAvailable: false,
  },
  {
    id: 'sp2', name: 'MindScope Labs', email: 'hello@mindscope.in',
    avatarUrl: '',
    appliedDate: 'Feb 1, 2026', status: 'new',
    headline: 'Silver Tier — ₹2,50,000', resumeAvailable: false,
  },
];

type EventRegTab = 'registrations' | 'papers' | 'speakers' | 'sponsorship';

const REGISTRATION_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'accepted', label: 'Confirmed' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'rejected', label: 'Rejected' },
];

const PAPER_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'Submitted' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const SPEAKER_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'Applied' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

const SPONSOR_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'Inquiry' },
  { value: 'shortlisted', label: 'In Discussion' },
  { value: 'accepted', label: 'Confirmed' },
  { value: 'rejected', label: 'Declined' },
];

/* ═══ Component ═══ */

interface EventRegistrationsPageProps {
  eventId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function EventRegistrationsPage({ eventId, onBack, onNavigate }: EventRegistrationsPageProps) {
  const [activeTab, setActiveTab] = useState<EventRegTab>('registrations');
  const [registrations, setRegistrations] = useState(MOCK_REGISTRATIONS);
  const [papers, setPapers] = useState(MOCK_PAPER_SUBMISSIONS);
  const [speakerApps, setSpeakerApps] = useState(MOCK_SPEAKER_APPS);
  const [sponsorApps, setSponsorApps] = useState(MOCK_SPONSOR_APPS);

  const tabs: { id: EventRegTab; label: string; icon: React.ElementType; count: number; color: string }[] = [
    { id: 'registrations', label: 'Registrations', icon: Ticket, count: registrations.length, color: 'text-rose-600' },
    { id: 'papers', label: 'Paper Submissions', icon: PenTool, count: papers.length, color: 'text-purple-600' },
    { id: 'speakers', label: 'Speaker Apps', icon: Mic2, count: speakerApps.length, color: 'text-blue-600' },
    { id: 'sponsorship', label: 'Sponsorship', icon: Handshake, count: sponsorApps.length, color: 'text-amber-600' },
  ];

  const handleStatusChange = (tab: EventRegTab) => (id: string, newStatus: ApplicationStatusType) => {
    if (tab === 'registrations') setRegistrations(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (tab === 'papers') setPapers(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (tab === 'speakers') setSpeakerApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    if (tab === 'sponsorship') setSponsorApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const currentApplicants = activeTab === 'registrations' ? registrations : activeTab === 'papers' ? papers : activeTab === 'speakers' ? speakerApps : sponsorApps;
  const currentStatusOptions = activeTab === 'registrations' ? REGISTRATION_STATUS_OPTIONS : activeTab === 'papers' ? PAPER_STATUS_OPTIONS : activeTab === 'speakers' ? SPEAKER_STATUS_OPTIONS : SPONSOR_STATUS_OPTIONS;
  const currentEntityType = activeTab === 'registrations' ? 'Registration' : activeTab === 'papers' ? 'Paper Submission' : activeTab === 'speakers' ? 'Speaker Application' : 'Sponsorship';

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-indigo-800 via-indigo-700 to-violet-700 pt-8 pb-0 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-5">
          {/* Back button */}
          <button onClick={onBack} className="flex items-center gap-1.5 text-indigo-200/70 hover:text-white transition-colors self-start" style={{ fontSize: 13 }}>
            <ChevronLeft size={15} /> Back to My Listings
          </button>

          {/* Event Info */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>{EVENT_INFO.title}</p>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-indigo-200" style={{ fontSize: 12 }}>{EVENT_INFO.type}</span>
                <span className="text-indigo-300/50">·</span>
                <span className="text-indigo-200" style={{ fontSize: 12 }}>{EVENT_INFO.location}</span>
                <span className="text-indigo-300/50">·</span>
                <span className="text-indigo-200" style={{ fontSize: 12 }}>Deadline: {EVENT_INFO.deadline}</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('EventDetails', { eventId })}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors shrink-0"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <Eye size={14} /> Preview Event
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Registrations', value: registrations.length, icon: Ticket, color: 'text-rose-200' },
              { label: 'Paper Submissions', value: papers.length, icon: PenTool, color: 'text-purple-200' },
              { label: 'Speaker Apps', value: speakerApps.length, icon: Mic2, color: 'text-blue-200' },
              { label: 'Sponsor Inquiries', value: sponsorApps.length, icon: Handshake, color: 'text-amber-200' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.08] border border-white/[0.08] rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} className={stat.color} />
                  <p className="text-indigo-200" style={{ fontSize: 11, fontWeight: 500 }}>{stat.label}</p>
                </div>
                <p className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Status Lifecycle — white card inside hero for contrast */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-gray-500 mb-3" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>EVENT LIFECYCLE</p>
            <StatusLifecycle steps={LIFECYCLE_STEPS} currentStepId="active" direction="horizontal" accentColor="blue" compact />
          </div>

          {/* Tab Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px scrollbar-hide">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all duration-200 shrink-0 border-b-2 ${
                    isActive
                      ? 'bg-[#f0f4f8] text-gray-900 border-transparent'
                      : 'text-indigo-100 hover:text-white hover:bg-white/[0.06] border-transparent'
                  }`}
                >
                  <tab.icon size={15} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-md ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-white/10 text-indigo-200'
                  }`} style={{ fontSize: 10, fontWeight: 700 }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-6">
        <ApplicationListView
          applicants={currentApplicants}
          onStatusChange={handleStatusChange(activeTab)}
          onViewProfile={(id) => onNavigate('PersonProfile', { personId: id })}
          onDownloadCV={() => {}}
          onEmailApplicant={() => {}}
          statusOptions={currentStatusOptions}
          entityType={currentEntityType}
        />
      </div>
    </div>
  );
}