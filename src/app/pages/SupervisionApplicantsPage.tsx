import React, { useState } from 'react';
import { ArrowLeft, Users, Clock, CheckCircle2, Globe, MapPin, Calendar, Briefcase, ExternalLink } from 'lucide-react';
import { ApplicationListView, type Applicant, type ApplicationStatusType } from '@/app/components/shared/ApplicationListView';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { RUPEE } from '@/app/utils/currency';

/* ═══ Mock Data ═══ */

const MOCK_SUPERVISION_INFO = {
  title: 'Clinical Supervision \u2014 RCI Track',
  domain: 'Clinical Psychology',
  mode: 'Online',
  sessionType: '1:1',
  frequency: 'Weekly',
  fee: RUPEE + '1,000/session',
  status: 'Active',
  maxSupervisees: 6,
  currentSupervisees: 4,
};

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'sa-1',
    name: 'Sneha Patel',
    avatarUrl: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'sneha.patel@university.edu',
    appliedDate: 'Mar 12, 2026',
    status: 'new',
    matchScore: 92,
    headline: 'M.Phil. Clinical Psychology \u2014 Seeking RCI Licensure Track',
    resumeAvailable: true,
  },
  {
    id: 'sa-2',
    name: 'Rohan Gupta',
    avatarUrl: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'rohan.gupta@nimhans.in',
    appliedDate: 'Mar 10, 2026',
    status: 'shortlisted',
    matchScore: 88,
    headline: 'Early Career Clinician \u2014 Group Therapy Specialization',
    resumeAvailable: true,
  },
  {
    id: 'sa-3',
    name: 'Aisha Khan',
    avatarUrl: 'https://images.unsplash.com/photo-1765248148309-69d900a5bc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'aisha.khan@gmail.com',
    appliedDate: 'Mar 8, 2026',
    status: 'accepted',
    matchScore: 95,
    headline: 'Post-grad in Clinical Psychology \u2014 Trauma & PTSD Focus',
    resumeAvailable: true,
  },
  {
    id: 'sa-4',
    name: 'Vikram Singh',
    avatarUrl: 'https://images.unsplash.com/photo-1584827172806-ea64d6d30fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    email: 'vikram.singh@psychire.in',
    appliedDate: 'Mar 5, 2026',
    status: 'rejected',
    matchScore: 62,
    headline: 'B.A. Psychology \u2014 Interested in Clinical Practice',
    resumeAvailable: false,
  },
];

const SUPERVISION_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'rejected', label: 'Declined' },
];

/* ═══ Component ═══ */

interface SupervisionApplicantsPageProps {
  supervisionId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function SupervisionApplicantsPage({ supervisionId, onBack, onNavigate }: SupervisionApplicantsPageProps) {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);
  const info = MOCK_SUPERVISION_INFO;

  const handleStatusChange = (applicantId: string, newStatus: ApplicationStatusType) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
  };

  const accepted = applicants.filter(a => a.status === 'accepted').length;
  const slots = info.maxSupervisees - info.currentSupervisees;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* Hero Header */}
      <div className="w-full bg-gradient-to-br from-cyan-800 via-cyan-700 to-teal-700 pt-8 pb-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-cyan-200 hover:text-white mb-4 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to My Listings
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>{info.title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm" style={{ fontSize: 11, fontWeight: 600 }}>{info.domain}</span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-white/90 backdrop-blur-sm" style={{ fontSize: 11, fontWeight: 600 }}>{info.mode}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 text-emerald-200" style={{ fontSize: 11, fontWeight: 600 }}>{info.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{applicants.length}</p>
                <p className="text-cyan-200" style={{ fontSize: 11 }}>Applicants</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{slots}</p>
                <p className="text-cyan-200" style={{ fontSize: 11 }}>Slots Open</p>
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
            { icon: Users, label: 'Session Type', value: info.sessionType, color: 'text-cyan-600' },
            { icon: Clock, label: 'Frequency', value: info.frequency, color: 'text-blue-600' },
            { icon: Globe, label: 'Mode', value: info.mode, color: 'text-teal-600' },
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
          statusOptions={SUPERVISION_STATUS_OPTIONS}
          entityType="Supervision"
        />
      </div>
    </div>
  );
}
