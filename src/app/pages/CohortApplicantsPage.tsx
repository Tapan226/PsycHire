import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, Clock, Users, Globe, MapPin, Calendar, Briefcase } from 'lucide-react';
import { ApplicationListView, type Applicant, type ApplicationStatusType } from '@/app/components/shared/ApplicationListView';
import { RUPEE } from '@/app/utils/currency';

/* ═══ Mock Data ═══ */

const MOCK_COHORT_INFO = {
  title: 'Early Career Psychologist Cohort',
  domain: 'Clinical Psychology',
  format: 'Group + 1:1',
  frequency: 'Biweekly',
  commitment: '3 Months',
  fee: RUPEE + '800/session',
  status: 'Active',
  maxMentees: 8,
  currentMentees: 3,
};

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'ca-1',
    name: 'Ananya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'ananya.sharma@university.edu',
    appliedDate: 'Mar 14, 2026',
    status: 'new',
    matchScore: 90,
    headline: 'Post-grad \u2014 RCI Licensure Prep, Case Conceptualization',
    resumeAvailable: true,
  },
  {
    id: 'ca-2',
    name: 'Vikram Das',
    avatarUrl: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'vikram.das@gmail.com',
    appliedDate: 'Mar 12, 2026',
    status: 'shortlisted',
    matchScore: 85,
    headline: 'Early Career \u2014 Hospital to Private Practice Transition',
    resumeAvailable: true,
  },
  {
    id: 'ca-3',
    name: 'Priya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1765248148309-69d900a5bc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'priya.nair@mindcare.in',
    appliedDate: 'Mar 10, 2026',
    status: 'accepted',
    matchScore: 93,
    headline: 'Post-grad Clinical Psychology \u2014 Building Practice Skills',
    resumeAvailable: true,
  },
  {
    id: 'ca-4',
    name: 'Deepak Pillai',
    avatarUrl: 'https://images.unsplash.com/photo-1584827172806-ea64d6d30fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'deepak.pillai@corp.com',
    appliedDate: 'Mar 8, 2026',
    status: 'new',
    matchScore: 78,
    headline: 'Early Career I/O Psychologist \u2014 Career Transition',
    resumeAvailable: true,
  },
  {
    id: 'ca-5',
    name: 'Sanya Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1650546322568-de64777e4000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'sanya.gupta@university.edu',
    appliedDate: 'Mar 6, 2026',
    status: 'waitlisted',
    matchScore: 81,
    headline: 'Post-grad \u2014 Anxiety & Mood Disorders Specialization',
    resumeAvailable: true,
  },
];

const COHORT_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'rejected', label: 'Declined' },
];

/* ═══ Component ═══ */

interface CohortApplicantsPageProps {
  cohortId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function CohortApplicantsPage({ cohortId, onBack, onNavigate }: CohortApplicantsPageProps) {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const info = MOCK_COHORT_INFO;

  const handleStatusChange = (applicantId: string, newStatus: ApplicationStatusType) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
  };

  const slots = info.maxMentees - info.currentMentees;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-br from-indigo-800 via-indigo-700 to-purple-700 pt-8 pb-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-200 hover:text-white mb-4 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to My Listings
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>{info.title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm" style={{ fontSize: 11, fontWeight: 600 }}>{info.domain}</span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm" style={{ fontSize: 11, fontWeight: 600 }}>{info.format}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200" style={{ fontSize: 11, fontWeight: 600 }}>{info.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{applicants.length}</p>
                <p className="text-indigo-200" style={{ fontSize: 11 }}>Applicants</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{slots}</p>
                <p className="text-indigo-200" style={{ fontSize: 11 }}>Slots Open</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8 w-full">
        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Format', value: info.format, color: 'text-indigo-600' },
            { icon: Clock, label: 'Frequency', value: info.frequency, color: 'text-blue-600' },
            { icon: Calendar, label: 'Commitment', value: info.commitment, color: 'text-purple-600' },
            { icon: Briefcase, label: 'Fee', value: info.fee, color: 'text-emerald-600' },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <item.icon size={16} className={`${item.color} mb-2`} />
              <p className="text-gray-500" style={{ fontSize: 11 }}>{item.label}</p>
              <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Application List */}
        <ApplicationListView
          applicants={applicants}
          onStatusChange={handleStatusChange}
          onViewProfile={(id) => onNavigate('PersonProfile', { personId: id })}
          statusOptions={COHORT_STATUS_OPTIONS}
          entityType="Mentoring Cohort"
        />
      </div>
    </div>
  );
}
