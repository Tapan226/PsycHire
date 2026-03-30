import React, { useState } from 'react';
import { ChevronLeft, FolderKanban, Eye, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { ApplicationListView, type Applicant, type ApplicationStatusType } from '@/app/components/shared/ApplicationListView';
import { StatusLifecycle, type LifecycleStep } from '@/app/components/shared/StatusLifecycle';

/* ═══ Mock Data ═══ */

const PROJECT_INFO = {
  title: 'AI-Driven Mental Health Chatbot',
  organisation: 'NeuroTech Research Lab',
  location: 'Bangalore, KA',
  format: 'Hybrid',
  duration: '6 months',
  posted: 'Feb 15, 2026',
  deadline: 'Apr 1, 2026',
  status: 'active' as const,
  views: 187,
};

const LIFECYCLE_STEPS: LifecycleStep[] = [
  { id: 'draft', label: 'Draft', timestamp: 'Feb 12' },
  { id: 'review', label: 'Under Review', timestamp: 'Feb 14' },
  { id: 'active', label: 'Active', timestamp: 'Feb 15', description: 'Accepting applications' },
  { id: 'closed', label: 'Closed' },
];

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'pa1', name: 'Kavitha Menon', email: 'kavitha.menon@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    appliedDate: 'Feb 18, 2026', status: 'shortlisted', matchScore: 94,
    headline: 'M.Phil. Clinical Psychology, NIMHANS — NLP & ML experience', resumeAvailable: true,
  },
  {
    id: 'pa2', name: 'Vikram Rathi', email: 'vikram.rathi@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    appliedDate: 'Feb 19, 2026', status: 'new', matchScore: 81,
    headline: 'M.Sc. Data Science, IIT Madras — Psychology minor', resumeAvailable: true,
  },
  {
    id: 'pa3', name: 'Ananya Kulkarni', email: 'ananya.k@proton.me',
    avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    appliedDate: 'Feb 20, 2026', status: 'new', matchScore: 76,
    headline: 'M.A. Counselling Psychology, TISS — Research interest in AI ethics', resumeAvailable: true,
  },
  {
    id: 'pa4', name: 'Siddharth Nair', email: 'sid.nair@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    appliedDate: 'Feb 22, 2026', status: 'interview', matchScore: 88,
    headline: 'M.Tech. AI, IIIT Hyderabad — Published in mental health tech', resumeAvailable: true,
  },
];

/* ═══ Component ═══ */

interface ProjectApplicationsPageProps {
  projectId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function ProjectApplicationsPage({ projectId, onBack, onNavigate }: ProjectApplicationsPageProps) {
  const [applicants, setApplicants] = useState<Applicant[]>(MOCK_APPLICANTS);

  const handleStatusChange = (applicantId: string, newStatus: ApplicationStatusType) => {
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
  };

  const statusSummary = applicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-700 pt-6 pb-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-5">
          {/* Back */}
          <button onClick={onBack} className="flex items-center gap-1.5 text-teal-200/70 hover:text-white transition-colors self-start group" style={{ fontSize: 13 }}>
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to My Listings
          </button>

          {/* Project Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-green-400/20 text-green-200" style={{ fontSize: 10, fontWeight: 700 }}>Active</span>
                <span className="text-teal-200" style={{ fontSize: 12 }}>{PROJECT_INFO.format}</span>
              </div>
              <p className="text-white mb-1" style={{ fontSize: 22, fontWeight: 800 }}>{PROJECT_INFO.title}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-teal-200" style={{ fontSize: 12 }}><FolderKanban size={12} />{PROJECT_INFO.organisation}</span>
                <span className="flex items-center gap-1 text-teal-200" style={{ fontSize: 12 }}><MapPin size={12} />{PROJECT_INFO.location}</span>
                <span className="flex items-center gap-1 text-teal-200" style={{ fontSize: 12 }}><Calendar size={12} />{PROJECT_INFO.duration}</span>
                <span className="flex items-center gap-1 text-teal-200" style={{ fontSize: 12 }}><Clock size={12} />Posted {PROJECT_INFO.posted}</span>
                <span className="flex items-center gap-1 text-teal-200" style={{ fontSize: 12 }}><Eye size={12} />{PROJECT_INFO.views} views</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Total', value: applicants.length, color: 'text-teal-200' },
              { label: 'New', value: statusSummary['new'] || 0, color: 'text-blue-300' },
              { label: 'Shortlisted', value: statusSummary['shortlisted'] || 0, color: 'text-purple-300' },
              { label: 'Interview', value: statusSummary['interview'] || 0, color: 'text-indigo-300' },
              { label: 'Rejected', value: statusSummary['rejected'] || 0, color: 'text-red-300' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.08] border border-white/[0.08] rounded-xl px-3 py-2 backdrop-blur-sm">
                <p className={stat.color} style={{ fontSize: 10, fontWeight: 500 }}>{stat.label}</p>
                <p className="text-white" style={{ fontSize: 20, fontWeight: 800 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Lifecycle */}
          <div className="bg-white/[0.06] rounded-xl px-5 py-4 border border-white/[0.06]">
            <p className="text-teal-200 mb-3" style={{ fontSize: 11, fontWeight: 600 }}>LISTING LIFECYCLE</p>
            <StatusLifecycle steps={LIFECYCLE_STEPS} currentStepId="active" direction="horizontal" accentColor="teal" compact />
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-6">
        <ApplicationListView
          applicants={applicants}
          onStatusChange={handleStatusChange}
          onViewProfile={(id) => onNavigate('PersonProfile', { personId: id })}
          onDownloadCV={() => {}}
          onEmailApplicant={() => {}}
          entityType="Project"
        />
      </div>
    </div>
  );
}
