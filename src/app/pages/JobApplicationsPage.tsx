import React, { useState } from 'react';
import { ChevronLeft, Briefcase, Eye, MapPin, Clock, Users, TrendingUp, BarChart3 } from 'lucide-react';
import { ApplicationListView, type Applicant, type ApplicationStatusType } from '@/app/components/shared/ApplicationListView';
import { StatusLifecycle, type LifecycleStep } from '@/app/components/shared/StatusLifecycle';

/* ═══ Mock Data ═══ */

const JOB_INFO = {
  title: 'Junior Child Psychologist',
  company: 'MindCare Clinic',
  location: 'Mumbai, MH',
  type: 'Full-time',
  posted: 'Feb 9, 2026',
  deadline: 'Mar 15, 2026',
  status: 'active' as const,
  views: 312,
};

const LIFECYCLE_STEPS: LifecycleStep[] = [
  { id: 'draft', label: 'Draft', timestamp: 'Feb 7' },
  { id: 'review', label: 'Under Review', timestamp: 'Feb 8' },
  { id: 'active', label: 'Active', timestamp: 'Feb 9', description: 'Accepting applications' },
  { id: 'closed', label: 'Closed' },
];

const MOCK_APPLICANTS: Applicant[] = [
  {
    id: 'a1', name: 'Priya Sharma', email: 'priya.sharma@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBwc3ljaG9sb2d5fGVufDF8fHx8MTc3MDEwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 12, 2026', status: 'shortlisted', matchScore: 92,
    headline: 'M.A. Clinical Psychology, TISS Mumbai', resumeAvailable: true,
  },
  {
    id: 'a2', name: 'Arjun Desai', email: 'arjun.desai@outlook.com',
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBibGF6ZXIlMjBjb25maWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzA3MTA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 13, 2026', status: 'new', matchScore: 78,
    headline: 'M.Sc. Psychology, Delhi University', resumeAvailable: true,
  },
  {
    id: 'a3', name: 'Sneha Patel', email: 'sneha.patel@yahoo.com',
    avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHBzeWNob2xvZ3l8ZW58MXx8fHwxNzcwMTA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 14, 2026', status: 'interview', matchScore: 85,
    headline: 'M.Phil. Clinical Psychology, NIMHANS', resumeAvailable: true,
  },
  {
    id: 'a4', name: 'Rohan Kapoor', email: 'rohan.k@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhZG1pbmlzdHJhdG9yJTIwZm9ybWFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM2NjUxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 15, 2026', status: 'new', matchScore: 65,
    headline: 'B.A. Psychology, Christ University', resumeAvailable: true,
  },
  {
    id: 'a5', name: 'Meera Iyer', email: 'meera.iyer@proton.me',
    avatarUrl: 'https://images.unsplash.com/photo-1770627016447-cb9d29ed0398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbiUyMGNvcnBvcmF0ZSUyMGJ1c2luZXNzJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczNjY1MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    appliedDate: 'Feb 16, 2026', status: 'rejected',
    headline: 'M.A. Counselling Psychology, Amity', resumeAvailable: true,
  },
];

/* ═══ Component ═══ */

interface JobApplicationsPageProps {
  jobId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function JobApplicationsPage({ jobId, onBack, onNavigate }: JobApplicationsPageProps) {
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
      <div className="w-full bg-gradient-to-br from-cyan-800 via-cyan-700 to-teal-700 pt-6 pb-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-5">
          {/* Back */}
          <button onClick={onBack} className="flex items-center gap-1.5 text-cyan-200/70 hover:text-white transition-colors self-start group" style={{ fontSize: 13 }}>
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to My Listings
          </button>

          {/* Job Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-green-400/20 text-green-200" style={{ fontSize: 10, fontWeight: 700 }}>Active</span>
                <span className="text-cyan-200" style={{ fontSize: 12 }}>{JOB_INFO.type}</span>
              </div>
              <p className="text-white mb-1" style={{ fontSize: 22, fontWeight: 800 }}>{JOB_INFO.title}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-cyan-200" style={{ fontSize: 12 }}><MapPin size={12} />{JOB_INFO.location}</span>
                <span className="flex items-center gap-1 text-cyan-200" style={{ fontSize: 12 }}><Clock size={12} />Posted {JOB_INFO.posted}</span>
                <span className="flex items-center gap-1 text-cyan-200" style={{ fontSize: 12 }}><Eye size={12} />{JOB_INFO.views} views</span>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Total', value: applicants.length, color: 'text-cyan-200' },
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
            <p className="text-cyan-200 mb-3" style={{ fontSize: 11, fontWeight: 600 }}>LISTING LIFECYCLE</p>
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
          entityType="Job"
        />
      </div>
    </div>
  );
}
