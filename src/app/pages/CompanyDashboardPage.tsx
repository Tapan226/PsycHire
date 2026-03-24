import React, { useState } from 'react';
import {
  Briefcase, FolderKanban, BookOpen, Calendar, Users, GraduationCap,
  Plus, Search, ChevronRight, Clock, CheckCircle2, AlertCircle, FileText,
  Eye, Edit3, MoreHorizontal, Trash2, RefreshCw, ArrowUpRight,
  Building2, BarChart3, TrendingUp, UserPlus, Copy, Archive, Star, Bell, UserSearch,
  CalendarPlus, GitBranch,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { StatusLifecycle } from '@/app/components/shared/StatusLifecycle';
import { StatusLifecycleDropdown } from '@/app/components/shared/StatusLifecycleDropdown';
import { ListingActionModal, ListingActionButtons } from '@/app/components/shared/ListingActions';
import type { ListingActionType } from '@/app/components/shared/ListingActions';

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

type ListingStatus = 'draft' | 'pending_review' | 'active' | 'closed' | 'rejected' | 'changes_requested';
type ModuleType = 'jobs' | 'projects' | 'courses' | 'events' | 'supervision' | 'mentoring' | 'referrals';

interface Listing {
  id: string;
  title: string;
  status: ListingStatus;
  createdAt: string;
  deadline?: string;
  applicantCount: number;
  views: number;
  isFeatured?: boolean;
  location?: string;
  type?: string;
  rejectionMessage?: string;
}

const STATUS_CONFIG: Record<ListingStatus, { label: string; bg: string; text: string; dot: string }> = {
  draft: { label: 'Draft', bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500' },
  pending_review: { label: 'Pending Review', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-600' },
  active: { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-800', dot: 'bg-emerald-600' },
  closed: { label: 'Closed', bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-500' },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-600' },
  changes_requested: { label: 'Changes Needed', bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-600' },
};

/* ══════════════════════════════════════════════
   Module Tabs Config
   ══════════════════════════════════════════════ */

const MODULE_TABS: { id: ModuleType; label: string; icon: React.ElementType; color: string; activeColor: string; description: string }[] = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase, color: 'text-blue-600', activeColor: 'bg-blue-600', description: 'Manage your job postings' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-teal-600', activeColor: 'bg-teal-600', description: 'Manage project collaborations' },
  { id: 'courses', label: 'Courses', icon: BookOpen, color: 'text-purple-600', activeColor: 'bg-purple-600', description: 'Manage course offerings' },
  { id: 'events', label: 'Events', icon: Calendar, color: 'text-rose-600', activeColor: 'bg-rose-600', description: 'Manage events and workshops' },
  { id: 'supervision', label: 'Supervision', icon: Users, color: 'text-cyan-600', activeColor: 'bg-cyan-600', description: 'Manage supervision programs' },
  { id: 'mentoring', label: 'Mentoring', icon: GraduationCap, color: 'text-indigo-600', activeColor: 'bg-indigo-600', description: 'Manage mentoring cohorts' },
  { id: 'referrals', label: 'Referrals', icon: GitBranch, color: 'text-amber-600', activeColor: 'bg-amber-600', description: 'Manage your referral postings' },
];

const STATUS_TABS: { id: ListingStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Drafts' },
  { id: 'pending_review', label: 'Under Review' },
  { id: 'active', label: 'Active' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'changes_requested', label: 'Changes Needed' },
  { id: 'closed', label: 'Closed' },
];

/* ══════════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════════ */

const MOCK_LISTINGS: Record<ModuleType, Listing[]> = {
  jobs: [
    { id: 'j1', title: 'Junior Child Psychologist', status: 'active', createdAt: 'Feb 9, 2026', deadline: 'Mar 15, 2026', applicantCount: 45, views: 312, isFeatured: true, location: 'Mumbai, MH', type: 'Full-time' },
    { id: 'j2', title: 'School Counselor', status: 'active', createdAt: 'Feb 5, 2026', deadline: 'Mar 20, 2026', applicantCount: 28, views: 189, location: 'Delhi, DL', type: 'Full-time' },
    { id: 'j3', title: 'Clinical Research Assistant', status: 'draft', createdAt: 'Mar 12, 2026', applicantCount: 0, views: 0, location: 'Bengaluru, KA', type: 'Part-time' },
    { id: 'j4', title: 'Neuropsychology Intern', status: 'pending_review', createdAt: 'Mar 14, 2026', deadline: 'Apr 10, 2026', applicantCount: 0, views: 0, location: 'Hyderabad, TS', type: 'Internship' },
    { id: 'j5', title: 'Senior Therapist — CBT Specialist', status: 'rejected', createdAt: 'Mar 1, 2026', applicantCount: 0, views: 0, location: 'Pune, MH', type: 'Full-time', rejectionMessage: 'Please add salary range and revise the qualification requirements for clarity.' },
    { id: 'j6', title: 'Community Outreach Counselor', status: 'closed', createdAt: 'Jan 10, 2026', deadline: 'Feb 28, 2026', applicantCount: 67, views: 580, location: 'Chennai, TN', type: 'Contract' },
  ],
  projects: [
    { id: 'p1', title: 'AI-Driven Mental Health Chatbot', status: 'active', createdAt: 'Jan 20, 2026', deadline: 'Jun 30, 2026', applicantCount: 12, views: 156, type: 'Research' },
    { id: 'p2', title: 'Workplace Wellness Assessment Tool', status: 'draft', createdAt: 'Mar 10, 2026', applicantCount: 0, views: 0, type: 'Consulting' },
  ],
  courses: [
    { id: 'c1', title: 'CBT Fundamentals Workshop', status: 'active', createdAt: 'Feb 1, 2026', deadline: 'Apr 15, 2026', applicantCount: 34, views: 220, type: 'Workshop' },
    { id: 'c2', title: 'Trauma-Informed Care Certification', status: 'pending_review', createdAt: 'Mar 14, 2026', deadline: 'Apr 30, 2026', applicantCount: 0, views: 0, type: 'Certification Course' },
    { id: 'c3', title: 'Mindfulness in Clinical Practice', status: 'draft', createdAt: 'Mar 16, 2026', applicantCount: 0, views: 0, type: 'Workshop' },
    { id: 'c4', title: 'I-O Psychology for HR Leaders', status: 'active', createdAt: 'Jan 15, 2026', deadline: 'Mar 30, 2026', applicantCount: 18, views: 145, type: 'Bootcamp' },
    { id: 'c5', title: 'Child Assessment Techniques', status: 'closed', createdAt: 'Nov 10, 2025', deadline: 'Jan 20, 2026', applicantCount: 25, views: 310, type: 'Course' },
  ],
  events: [
    { id: 'e1', title: 'Annual Psychology Conference 2026', status: 'active', createdAt: 'Jan 5, 2026', deadline: 'May 20, 2026', applicantCount: 156, views: 890, type: 'Conference', isFeatured: true },
    { id: 'e2', title: 'Child Development Workshop', status: 'pending_review', createdAt: 'Mar 13, 2026', deadline: 'Apr 5, 2026', applicantCount: 0, views: 0, type: 'Workshop' },
    { id: 'e3', title: 'CBT Techniques Webinar', status: 'draft', createdAt: 'Mar 15, 2026', applicantCount: 0, views: 0, type: 'Webinar' },
    { id: 'e4', title: 'Mindfulness Masterclass', status: 'rejected', createdAt: 'Mar 8, 2026', applicantCount: 0, views: 0, type: 'Workshop', rejectionMessage: 'Please add speaker credentials and ensure the event description meets accessibility guidelines.' },
    { id: 'e5', title: 'I/O Psychology Summit', status: 'closed', createdAt: 'Nov 10, 2025', deadline: 'Jan 15, 2026', applicantCount: 89, views: 420, type: 'Conference' },
  ],
  supervision: [
    { id: 's1', title: 'Clinical Supervision — RCI Track', status: 'active', createdAt: 'Dec 15, 2025', applicantCount: 8, views: 95, type: 'Individual' },
    { id: 's2', title: 'Group Case Review — Trauma & PTSD', status: 'pending_review', createdAt: 'Mar 14, 2026', applicantCount: 0, views: 0, type: 'Group' },
    { id: 's3', title: 'CBT Supervision for Interns', status: 'draft', createdAt: 'Mar 16, 2026', applicantCount: 0, views: 0, type: 'Individual' },
  ],
  mentoring: [
    { id: 'm1', title: 'Early Career Psychologist Cohort', status: 'active', createdAt: 'Jan 8, 2026', applicantCount: 22, views: 178, type: 'Group Cohort' },
    { id: 'm2', title: 'Research Mentorship — PhD Candidates', status: 'pending_review', createdAt: 'Mar 12, 2026', applicantCount: 0, views: 0, type: 'Group + 1:1' },
    { id: 'm3', title: 'I/O Psychology Career Accelerator', status: 'active', createdAt: 'Feb 1, 2026', applicantCount: 15, views: 120, type: 'Group Cohort' },
  ],
  referrals: [
    { id: 'ref-9', title: 'Substance abuse counselor for de-addiction center', status: 'active' as ListingStatus, createdAt: 'Jan 28, 2026', deadline: 'Feb 20, 2026', applicantCount: 4, views: 67, type: 'Immediate', location: 'Delhi, NCR' },
    { id: 'ref-cr1', title: 'Psychometric assessor for corporate screening', status: 'pending_review' as ListingStatus, createdAt: 'Mar 14, 2026', deadline: 'Apr 10, 2026', applicantCount: 0, views: 0, type: 'Scheduled', location: 'Mumbai, MH' },
    { id: 'ref-cr2', title: 'Trauma counselor for disaster relief project', status: 'draft' as ListingStatus, createdAt: 'Mar 16, 2026', applicantCount: 0, views: 0, type: 'Exploratory', location: 'Chennai, TN' },
    { id: 'ref-12', title: 'School counselor for inclusive education program', status: 'closed' as ListingStatus, createdAt: 'Dec 10, 2025', deadline: 'Jan 15, 2026', applicantCount: 7, views: 145, type: 'Scheduled', location: 'Pune, MH' },
  ],
};

const STATS = {
  totalListings: 20,
  activeListings: 9,
  totalApplications: 405,
  pendingReview: 4,
};

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

interface CompanyDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
  user?: { name: string; avatar: string; role: string };
}

export function CompanyDashboardPage({ onNavigate, user }: CompanyDashboardPageProps) {
  const [activeModule, setActiveModule] = useState<ModuleType>('jobs');
  const [statusFilter, setStatusFilter] = useState<ListingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{ listingId: string; action: ListingActionType } | null>(null);

  const companyName = user?.name || 'MindCare Clinic';
  const currentModule = MODULE_TABS.find(t => t.id === activeModule)!;
  const listings = MOCK_LISTINGS[activeModule] || [];

  const filtered = listings.filter(l => {
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesSearch = !searchQuery || l.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const moduleListingCounts = MODULE_TABS.map(tab => ({
    ...tab,
    count: (MOCK_LISTINGS[tab.id] || []).length,
    activeCount: (MOCK_LISTINGS[tab.id] || []).filter(l => l.status === 'active').length,
  }));

  const statusCounts = listings.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-cyan-800 via-cyan-700 to-teal-700 pt-10 pb-0 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-6">

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm overflow-hidden">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>My Listings</p>
                <p className="text-cyan-100 mt-1" style={{ fontSize: 14, fontWeight: 500 }}>
                  Manage all your postings across PsycHIRE
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (activeModule === 'projects') {
                  onNavigate('CreateProject');
                } else if (activeModule === 'events') {
                  onNavigate('CreateEvent');
                } else if (activeModule === 'courses') {
                  onNavigate('CreateCourse');
                } else if (activeModule === 'supervision') {
                  onNavigate('CreateSupervision');
                } else if (activeModule === 'mentoring') {
                  onNavigate('CreateCohort');
                } else if (activeModule === 'referrals') {
                  onNavigate('CreateReferral');
                } else {
                  onNavigate('CreateJob');
                }
              }}
              className="flex items-center gap-2 px-5 py-3 bg-white text-cyan-800 rounded-xl hover:bg-cyan-50 transition-all shadow-lg shrink-0"
              style={{ fontSize: 14, fontWeight: 700 }}
            >
              <Plus size={18} />
              Create New
            </button>
          </div>

          {/* Quick Action Pills */}
          <div className="flex items-center gap-2 flex-wrap -mt-2">
            <button
              onClick={() => onNavigate('CandidateSearch')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-cyan-100 hover:bg-white/20 hover:text-white transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <UserSearch size={14} /> Candidate Directory
            </button>
            <button
              onClick={() => onNavigate('NotificationSettings')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-cyan-100 hover:bg-white/20 hover:text-white transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <Bell size={14} /> Notification Settings
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-6">
            {[
              { label: 'Total Listings', value: STATS.totalListings, icon: FileText, color: 'text-cyan-200' },
              { label: 'Active', value: STATS.activeListings, icon: CheckCircle2, color: 'text-emerald-300' },
              { label: 'Applications', value: STATS.totalApplications, icon: UserPlus, color: 'text-cyan-200' },
              { label: 'Pending Review', value: STATS.pendingReview, icon: Clock, color: 'text-amber-300' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.08] border border-white/[0.08] rounded-xl px-4 py-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon size={14} className={stat.color} />
                  <p className="text-cyan-200" style={{ fontSize: 11, fontWeight: 500 }}>{stat.label}</p>
                </div>
                <p className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Module Tab Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px scrollbar-hide">
            {moduleListingCounts.map(tab => {
              const isActive = activeModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveModule(tab.id); setStatusFilter('all'); setSearchQuery(''); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all duration-200 shrink-0 border-b-2 ${
                    isActive
                      ? 'bg-[#f0f4f8] text-gray-900 border-transparent'
                      : 'text-cyan-100 hover:text-white hover:bg-white/[0.06] border-transparent'
                  }`}
                >
                  <tab.icon size={16} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-cyan-100 text-cyan-800' : 'bg-white/10 text-cyan-200'
                    }`} style={{ fontSize: 10, fontWeight: 700 }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT AREA ═══ */}
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-6 flex flex-col gap-5">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={`Search ${currentModule.label.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 transition-all"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Status Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {STATUS_TABS.map(tab => {
              const count = tab.id === 'all' ? listings.length : (statusCounts[tab.id] || 0);
              if (tab.id !== 'all' && count === 0) return null;
              return (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
                    statusFilter === tab.id
                      ? 'bg-cyan-700 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {tab.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Listings */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center">
              <currentModule.icon size={28} className="text-cyan-400" />
            </div>
            <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>
              {searchQuery || statusFilter !== 'all' ? 'No listings found' : `No ${currentModule.label.toLowerCase()} yet`}
            </p>
            <p className="text-gray-500 text-center max-w-sm" style={{ fontSize: 13 }}>
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : `Create your first ${currentModule.label.toLowerCase().slice(0, -1)} listing to start receiving applications.`}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-cyan-700 text-white rounded-xl hover:bg-cyan-800 transition-colors shadow-sm mt-2"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                <Plus size={16} />
                Create {currentModule.label.slice(0, -1)}
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(listing => {
              const statusCfg = STATUS_CONFIG[listing.status];
              return (
                <div
                  key={listing.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-200/40 transition-all duration-200 group"
                >
                  <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    {/* Title + Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-gray-900 truncate group-hover:text-cyan-700 transition-colors" style={{ fontSize: 15, fontWeight: 700 }}>
                          {listing.title}
                        </p>
                        {listing.isFeatured && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-brand-secondary text-white" style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.04em' }}>
                            FEATURED
                          </span>
                        )}
                        <StatusLifecycleDropdown
                          currentStatus={listing.status as any}
                          moduleType={activeModule}
                          onStatusChange={() => {}}
                          compact
                        />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        {listing.type && (
                          <span className="text-gray-500" style={{ fontSize: 12 }}>{listing.type}</span>
                        )}
                        {listing.location && (
                          <span className="text-gray-400" style={{ fontSize: 12 }}>· {listing.location}</span>
                        )}
                        <span className="text-gray-400" style={{ fontSize: 12 }}>· Created {listing.createdAt}</span>
                        {listing.deadline && (
                          <span className="text-gray-400" style={{ fontSize: 12 }}>· Deadline {listing.deadline}</span>
                        )}
                      </div>

                      {/* Rejection message */}
                      {(listing.status === 'rejected' || listing.status === 'changes_requested') && listing.rejectionMessage && (
                        <div className="mt-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 flex items-start gap-2">
                          <AlertCircle size={13} className="text-red-400 mt-0.5 shrink-0" />
                          <p className="text-red-600" style={{ fontSize: 11, fontWeight: 500 }}>{listing.rejectionMessage}</p>
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-5 shrink-0">
                      <div className="text-center">
                        <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{listing.applicantCount}</p>
                        <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 500 }}>Applicants</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{listing.views}</p>
                        <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 500 }}>Views</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      {listing.status === 'active' && listing.applicantCount > 0 && (
                        <button
                          onClick={() => {
                            if (activeModule === 'events') {
                              onNavigate('EventRegistrations', { eventId: listing.id });
                            } else if (activeModule === 'courses') {
                              onNavigate('CourseEnrollments', { courseId: listing.id });
                            } else if (activeModule === 'supervision') {
                              onNavigate('SupervisionApplicants', { supervisionId: listing.id });
                            } else if (activeModule === 'mentoring') {
                              onNavigate('CohortApplicants', { cohortId: listing.id });
                            } else if (activeModule === 'referrals') {
                              onNavigate('ReferralRespondents', { referralId: listing.id });
                            } else {
                              onNavigate('JobApplications', { jobId: listing.id });
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}
                        >
                          <Users size={14} />
                          <span className="hidden sm:inline">{activeModule === 'events' ? 'Registrations' : activeModule === 'courses' ? 'Enrollments' : activeModule === 'supervision' || activeModule === 'mentoring' ? 'Applicants' : activeModule === 'referrals' ? 'Respondents' : 'Applications'}</span>
                        </button>
                      )}
                      {(listing.status === 'draft' || listing.status === 'rejected' || listing.status === 'changes_requested') && (
                        <button
                          onClick={() => {
                            if (activeModule === 'events') {
                              onNavigate('EditEvent', { eventId: listing.id });
                            } else if (activeModule === 'projects') {
                              onNavigate('EditProject', { projectId: listing.id });
                            } else if (activeModule === 'courses') {
                              onNavigate('EditCourse', { courseId: listing.id });
                            } else if (activeModule === 'referrals') {
                              onNavigate('EditReferral', { referralId: listing.id });
                            } else {
                              onNavigate('EditJob', { jobId: listing.id });
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-brand-primary hover:bg-blue-100 transition-colors" style={{ fontSize: 12, fontWeight: 600 }}
                        >
                          <Edit3 size={14} />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                      )}
                      {/* Extend / Close / Renew inline actions */}
                      <ListingActionButtons
                        status={listing.status}
                        hasDeadline={!!listing.deadline}
                        onExtend={() => setActionModal({ listingId: listing.id, action: 'extend' })}
                        onExpire={() => setActionModal({ listingId: listing.id, action: 'expire' })}
                        onRenew={() => setActionModal({ listingId: listing.id, action: 'renew' })}
                      />
                      <button
                        onClick={() => {
                          if (activeModule === 'events') {
                            onNavigate('EventDetails', { eventId: listing.id });
                          } else if (activeModule === 'projects') {
                            onNavigate('ProjectDetails');
                          } else {
                            onNavigate('JobDetails');
                          }
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                        title="Preview Listing"
                      >
                        <Eye size={15} />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === listing.id ? null : listing.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            openMenuId === listing.id ? 'text-gray-700 bg-gray-100' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <MoreHorizontal size={15} />
                        </button>
                        {openMenuId === listing.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-200 shadow-xl z-40 py-1.5 animate-fade-in">
                              {listing.status === 'active' && (
                                <button onClick={() => setOpenMenuId(null)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                                  <Star size={14} className="text-amber-500" />
                                  {listing.isFeatured ? 'Remove Featured' : 'Upgrade to Featured'}
                                </button>
                              )}
                              <button onClick={() => setOpenMenuId(null)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                                <Copy size={14} className="text-gray-400" />
                                Duplicate Listing
                              </button>
                              {listing.status === 'active' && listing.deadline && (
                                <button onClick={() => { setOpenMenuId(null); setActionModal({ listingId: listing.id, action: 'extend' }); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                                  <CalendarPlus size={14} className="text-cyan-500" />
                                  Extend Deadline
                                </button>
                              )}
                              {listing.status === 'active' && (
                                <button onClick={() => { setOpenMenuId(null); setActionModal({ listingId: listing.id, action: 'expire' }); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                                  <Archive size={14} className="text-gray-400" />
                                  Close Listing
                                </button>
                              )}
                              {listing.status === 'closed' && (
                                <button onClick={() => { setOpenMenuId(null); setActionModal({ listingId: listing.id, action: 'renew' }); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-gray-700 hover:bg-gray-50 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                                  <RefreshCw size={14} className="text-emerald-500" />
                                  Reopen Listing
                                </button>
                              )}
                              <div className="my-1.5 border-t border-gray-100" />
                              <button onClick={() => setOpenMenuId(null)} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                                <Trash2 size={14} />
                                Delete Listing
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {actionModal && (() => {
        const listing = listings.find(l => l.id === actionModal.listingId);
        if (!listing) return null;
        return (
          <ListingActionModal
            actionType={actionModal.action}
            listingTitle={listing.title}
            currentDeadline={listing.deadline}
            onConfirm={() => setActionModal(null)}
            onClose={() => setActionModal(null)}
          />
        );
      })()}
    </div>
  );
}