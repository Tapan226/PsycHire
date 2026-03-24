import React, { useState } from 'react';
import {
  Shield, Briefcase, FolderKanban, BookOpen, Calendar, Users, GraduationCap,
  Search, Clock, CheckCircle2, XCircle, AlertTriangle, FileText,
  BarChart3, TrendingUp, Flag, Eye, Tag, Settings, LayoutDashboard,
  CheckSquare, Square, GitBranch,
} from 'lucide-react';
import { AdminReviewCard, type ReviewItem } from '@/app/components/shared/AdminReviewCard';
import { AdminOverview } from '@/app/components/admin/AdminOverview';
import { AdminStatistics } from '@/app/components/admin/AdminStatistics';
import { AdminTaxonomy } from '@/app/components/admin/AdminTaxonomy';

/* ══════════════════════════════════════════════
   Types
   ══════════════════════════════════════════════ */

type AdminSection = 'overview' | 'review' | 'reports' | 'statistics' | 'taxonomy';
type ReviewModule = 'jobs' | 'projects' | 'courses' | 'events' | 'supervision' | 'mentoring' | 'referrals';
type ReviewFilter = 'all' | 'pending' | 'approved' | 'rejected';

const SECTION_TABS: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'review', label: 'Review Queue', icon: Eye },
  { id: 'reports', label: 'Reports', icon: Flag },
  { id: 'statistics', label: 'Statistics', icon: BarChart3 },
  { id: 'taxonomy', label: 'Taxonomy', icon: Tag },
];

const MODULE_TABS: { id: ReviewModule; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'jobs', label: 'Jobs', icon: Briefcase, color: 'text-blue-600' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-teal-600' },
  { id: 'courses', label: 'Courses', icon: BookOpen, color: 'text-purple-600' },
  { id: 'events', label: 'Events', icon: Calendar, color: 'text-rose-600' },
  { id: 'supervision', label: 'Supervision', icon: Users, color: 'text-cyan-600' },
  { id: 'mentoring', label: 'Mentoring', icon: GraduationCap, color: 'text-indigo-600' },
  { id: 'referrals', label: 'Referrals', icon: GitBranch, color: 'text-amber-600' },
];

/* ══════════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════════ */

const MOCK_REVIEWS: Record<string, ReviewItem[]> = {
  jobs: [
    {
      id: 'rj1',
      title: 'Neuropsychology Intern',
      type: 'Job',
      submittedBy: { name: 'MindCare Clinic', avatarUrl: 'https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', organization: 'MindCare Clinic' },
      submittedAt: '2 hours ago',
      location: 'Hyderabad, TS',
      deadline: 'Apr 10, 2026',
      highlights: ['Internship', 'Neuropsychology', 'Entry Level'],
      status: 'pending',
    },
    {
      id: 'rj2',
      title: 'Senior Therapist — CBT Specialist',
      type: 'Job',
      submittedBy: { name: 'Serenity Health', avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyb2xvZ3klMjBsb2dvfGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080', organization: 'Serenity Health' },
      submittedAt: '5 hours ago',
      location: 'Pune, MH',
      highlights: ['Full-time', 'CBT', 'Senior'],
      status: 'pending',
    },
    {
      id: 'rj3',
      title: 'Junior Child Psychologist',
      type: 'Job',
      submittedBy: { name: 'MindCare Clinic', avatarUrl: 'https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', organization: 'MindCare Clinic' },
      submittedAt: '2 days ago',
      location: 'Mumbai, MH',
      highlights: ['Full-time', 'Child Psychology', 'Entry Level'],
      status: 'approved',
    },
  ],
  projects: [
    {
      id: 'rp1',
      title: 'Community Resilience Mapping',
      type: 'Project',
      submittedBy: { name: 'UNICEF India', avatarUrl: 'https://images.unsplash.com/photo-1758790636662-2f8eec12077e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmljZWYlMjBodW1hbml0YXJpYW4lMjBvcmdhbml6YXRpb24lMjBvZmZpY2V8ZW58MXx8fHwxNzcxMjM1MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', organization: 'UNICEF India' },
      submittedAt: '1 day ago',
      highlights: ['Field Work', 'Community Psychology'],
      status: 'pending',
    },
  ],
  courses: [
    {
      id: 'rc1',
      title: 'Trauma-Informed Care Certification',
      type: 'Course',
      submittedBy: { name: 'MindCare Clinic', avatarUrl: 'https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', organization: 'MindCare Clinic' },
      submittedAt: '4 hours ago',
      highlights: ['Certification', 'Clinical', 'Hybrid'],
      status: 'pending',
    },
    {
      id: 'rc2',
      title: 'I-O Psychology Bootcamp',
      type: 'Course',
      submittedBy: { name: 'PsychEdge Corp', organization: 'PsychEdge Corp' },
      submittedAt: '1 day ago',
      highlights: ['Bootcamp', 'Sponsored', 'I-O'],
      status: 'approved',
    },
  ],
  events: [
    {
      id: 're1',
      title: 'Child Development Workshop',
      type: 'Event',
      submittedBy: { name: 'NIMHANS', avatarUrl: 'https://images.unsplash.com/photo-1645423660753-74c9121fe6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlY2hub2xvZ3klMjBpbnN0aXR1dGUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzEyMzUzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', organization: 'NIMHANS' },
      submittedAt: '3 hours ago',
      highlights: ['Workshop', 'Developmental'],
      status: 'pending',
    },
    {
      id: 're2',
      title: 'Advances in CBT Summit 2026',
      type: 'Event',
      submittedBy: { name: 'MindCare Clinic', avatarUrl: 'https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', organization: 'MindCare Clinic' },
      submittedAt: '1 day ago',
      location: 'Mumbai, MH',
      deadline: 'May 10, 2026',
      highlights: ['Conference', 'CBT', 'Hybrid'],
      status: 'pending',
    },
    {
      id: 're3',
      title: 'Research Methods Webinar',
      type: 'Event',
      submittedBy: { name: 'Indian Psych Society', organization: 'Indian Psych Society' },
      submittedAt: '2 days ago',
      highlights: ['Webinar', 'Free', 'Research'],
      status: 'approved',
    },
  ],
  supervision: [
    {
      id: 'rs1',
      title: 'Clinical Supervision — CBT & Integrative Track',
      type: 'Supervision',
      submittedBy: { name: 'Dr. Anita Sharma', avatarUrl: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'Independent' },
      submittedAt: '1 day ago',
      location: 'Mumbai, India',
      highlights: ['Clinical Psychology', 'Licensure', '1:1', 'Online'],
      status: 'pending',
    },
    {
      id: 'rs2',
      title: 'Group Case Review — Trauma & PTSD',
      type: 'Supervision',
      submittedBy: { name: 'Dr. Arun Pillai', avatarUrl: 'https://images.unsplash.com/photo-1659353887804-fc7f9313021a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'Chennai Trauma Center' },
      submittedAt: '3 days ago',
      location: 'Chennai, India',
      highlights: ['Trauma & PTSD', 'Case Review', 'Group', 'Offline'],
      status: 'pending',
    },
  ],
  mentoring: [
    {
      id: 'rm1',
      title: 'Early Career Clinical Psychologist Cohort',
      type: 'Mentoring Cohort',
      submittedBy: { name: 'Dr. Meera Kapoor', avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'Serenity Health Center' },
      submittedAt: '2 days ago',
      location: 'Mumbai, India',
      highlights: ['Clinical Psychology', 'Group + 1:1', '3 Months', 'Hybrid'],
      status: 'pending',
    },
    {
      id: 'rm2',
      title: 'I/O Psychology Career Accelerator',
      type: 'Mentoring Cohort',
      submittedBy: { name: 'Dr. Rajesh Venkataraman', avatarUrl: 'https://images.unsplash.com/photo-1584827172806-ea64d6d30fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'PsychEdge Consulting' },
      submittedAt: '5 days ago',
      location: 'Hyderabad, India',
      highlights: ['Organizational Psychology', 'Group Only', '6 Months'],
      status: 'approved',
    },
  ],
  referrals: [
    {
      id: 'rref1',
      title: 'Psychometric assessor for corporate screening',
      type: 'Referral',
      submittedBy: { name: 'Dr. Arjun Mehta', avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'Serenity Health' },
      submittedAt: '3 hours ago',
      location: 'Mumbai, MH',
      highlights: ['Psychometric Assessment', 'Scheduled', 'In-person'],
      status: 'pending',
    },
    {
      id: 'rref2',
      title: 'CBT specialist for anxiety management group',
      type: 'Referral',
      submittedBy: { name: 'Dr. Kavitha Menon', avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'Independent' },
      submittedAt: '1 day ago',
      location: 'Kochi, KL',
      highlights: ['Cognitive Behavioral Therapy', 'Immediate', 'Hybrid'],
      status: 'pending',
    },
    {
      id: 'rref3',
      title: 'Academic researcher for longitudinal child development study',
      type: 'Referral',
      submittedBy: { name: 'Dr. Priya Nair', avatarUrl: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100', organization: 'Nair Family Therapy Centre' },
      submittedAt: '4 days ago',
      highlights: ['Academic Research', 'Exploratory', 'Remote'],
      status: 'approved',
    },
  ],
};

interface ReportItem {
  id: string;
  entityTitle: string;
  entityType: string;
  reportedBy: string;
  reason: string;
  reportedAt: string;
  status: 'open' | 'resolved' | 'dismissed';
}

const MOCK_REPORTS: ReportItem[] = [
  { id: 'rep1', entityTitle: 'Unlicensed Therapy Position', entityType: 'Job', reportedBy: 'Dr. Priya Nair', reason: 'Misleading Information', reportedAt: '6 hours ago', status: 'open' },
  { id: 'rep2', entityTitle: 'Dubious Online Certification', entityType: 'Course', reportedBy: 'Arjun Mehta', reason: 'Fraud or Scam', reportedAt: '1 day ago', status: 'open' },
  { id: 'rep3', entityTitle: 'Spam Event Listing', entityType: 'Event', reportedBy: 'Sneha Patel', reason: 'Spam', reportedAt: '3 days ago', status: 'resolved' },
  { id: 'rep4', entityTitle: 'Inappropriate Project Description', entityType: 'Project', reportedBy: 'Dr. Rakesh Sinha', reason: 'Inappropriate Content', reportedAt: '4 days ago', status: 'open' },
  { id: 'rep5', entityTitle: 'Unauthorized Use of Logo', entityType: 'Event', reportedBy: 'NIMHANS Admin', reason: 'Copyright Violation', reportedAt: '5 days ago', status: 'dismissed' },
];

const PENDING_TOTAL = Object.values(MOCK_REVIEWS).reduce((sum, items) => sum + items.filter(r => r.status === 'pending').length, 0);

/* ══════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════ */

interface AdminDashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');
  const [reviewModule, setReviewModule] = useState<ReviewModule>('jobs');
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [reportFilter, setReportFilter] = useState<'all' | 'open' | 'resolved' | 'dismissed'>('all');

  const currentModuleTab = MODULE_TABS.find(t => t.id === reviewModule)!;
  const currentReviews = reviews[reviewModule] || [];

  const filteredReviews = currentReviews.filter(r => {
    const matchesFilter = reviewFilter === 'all' || r.status === reviewFilter;
    const matchesSearch = !searchQuery || r.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredReports = reports.filter(r => {
    const matchesFilter = reportFilter === 'all' || r.status === reportFilter;
    return matchesFilter;
  });

  const pendingCounts = MODULE_TABS.reduce<Record<string, number>>((acc, tab) => {
    acc[tab.id] = (reviews[tab.id] || []).filter(r => r.status === 'pending').length;
    return acc;
  }, {});

  const handleApprove = (id: string) => {
    setReviews(prev => ({
      ...prev,
      [reviewModule]: prev[reviewModule].map(r => r.id === id ? { ...r, status: 'approved' as const } : r),
    }));
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleReject = (id: string, message: string) => {
    setReviews(prev => ({
      ...prev,
      [reviewModule]: prev[reviewModule].map(r => r.id === id ? { ...r, status: 'rejected' as const, rejectionMessage: message } : r),
    }));
    setSelectedIds(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  const handleSuggestEdit = (id: string, message: string) => {
    setReviews(prev => ({
      ...prev,
      [reviewModule]: prev[reviewModule].map(r => r.id === id ? { ...r, status: 'changes_requested' as const, rejectionMessage: message } : r),
    }));
  };

  const handleBulkApprove = () => {
    if (selectedIds.size === 0) return;
    setReviews(prev => ({
      ...prev,
      [reviewModule]: prev[reviewModule].map(r => selectedIds.has(r.id) ? { ...r, status: 'approved' as const } : r),
    }));
    setSelectedIds(new Set());
  };

  const handleBulkReject = () => {
    if (selectedIds.size === 0) return;
    setReviews(prev => ({
      ...prev,
      [reviewModule]: prev[reviewModule].map(r => selectedIds.has(r.id) ? { ...r, status: 'rejected' as const, rejectionMessage: 'Bulk rejected by admin' } : r),
    }));
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pendingIds = filteredReviews.filter(r => r.status === 'pending').map(r => r.id);
    if (pendingIds.every(id => selectedIds.has(id))) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(pendingIds));
    }
  };

  const handleResolveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'resolved' as const } : r));
  };

  const handleDismissReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'dismissed' as const } : r));
  };

  const handleSectionNavigate = (tab: string) => {
    if (['jobs', 'projects', 'courses', 'events', 'supervision', 'mentoring', 'referrals'].includes(tab)) {
      setActiveSection('review');
      setReviewModule(tab as ReviewModule);
      setReviewFilter('pending');
    } else if (tab === 'reports') {
      setActiveSection('reports');
    } else if (tab === 'statistics') {
      setActiveSection('statistics');
    } else if (tab === 'taxonomy') {
      setActiveSection('taxonomy');
    }
  };

  const openReportCount = reports.filter(r => r.status === 'open').length;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 pt-10 pb-0 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-6">

          {/* Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>Admin Dashboard</p>
                <p className="text-blue-100 mt-1" style={{ fontSize: 14, fontWeight: 500 }}>
                  Review, moderate, and manage platform content
                </p>
              </div>
            </div>

            {/* Quick Stat Pills */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                <Clock size={13} className="text-amber-300" />
                <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>{PENDING_TOTAL} Pending</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                <Flag size={13} className="text-red-300" />
                <span className="text-white" style={{ fontSize: 12, fontWeight: 600 }}>{openReportCount} Reports</span>
              </div>
            </div>
          </div>

          {/* Section Tab Bar */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0 -mb-px scrollbar-hide">
            {SECTION_TABS.map(tab => {
              const isActive = activeSection === tab.id;
              const badge = tab.id === 'review' ? PENDING_TOTAL : tab.id === 'reports' ? openReportCount : 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveSection(tab.id); setSearchQuery(''); setSelectedIds(new Set()); }}
                  className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all duration-200 shrink-0 border-b-2 ${
                    isActive
                      ? 'bg-[#f0f4f8] text-gray-900 border-transparent'
                      : 'text-blue-200 hover:text-white hover:bg-white/[0.06] border-transparent'
                  }`}
                >
                  <tab.icon size={16} />
                  <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                  {badge > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-red-100 text-red-700' : 'bg-red-500/20 text-red-300'
                    }`} style={{ fontSize: 10, fontWeight: 700 }}>
                      {badge}
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

        {/* ── OVERVIEW ── */}
        {activeSection === 'overview' && (
          <AdminOverview onNavigateToTab={handleSectionNavigate} />
        )}

        {/* ── REVIEW QUEUE ── */}
        {activeSection === 'review' && (
          <>
            {/* Module Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mt-1">
              {MODULE_TABS.map(tab => {
                const isActive = reviewModule === tab.id;
                const count = pendingCounts[tab.id] || 0;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setReviewModule(tab.id); setReviewFilter('pending'); setSearchQuery(''); setSelectedIds(new Set()); }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 ${
                      isActive
                        ? 'bg-white text-gray-900 shadow-sm border border-gray-200'
                        : 'bg-transparent text-gray-500 hover:bg-white/60 hover:text-gray-700'
                    }`}
                  >
                    <tab.icon size={15} className={isActive ? tab.color : 'text-gray-400'} />
                    <span style={{ fontSize: 13, fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                    {count > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-md ${
                        isActive ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-500'
                      }`} style={{ fontSize: 10, fontWeight: 700 }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={`Search ${currentModuleTab.label.toLowerCase()} listings...`}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                  style={{ fontSize: 13 }}
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                {(['all', 'pending', 'approved', 'rejected'] as ReviewFilter[]).map(f => {
                  const count = f === 'all' ? currentReviews.length : currentReviews.filter(r => r.status === f).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setReviewFilter(f)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
                        reviewFilter === f
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      {f === 'all' ? 'All' : f === 'pending' ? 'Pending' : f === 'approved' ? 'Approved' : 'Rejected'}
                      {' '}({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bulk Operations Bar */}
            {reviewFilter === 'pending' && filteredReviews.filter(r => r.status === 'pending').length > 1 && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-100">
                <button
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-blue-700 hover:text-blue-800 transition-colors"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  {filteredReviews.filter(r => r.status === 'pending').every(r => selectedIds.has(r.id))
                    ? <CheckSquare size={16} />
                    : <Square size={16} />
                  }
                  Select All Pending
                </button>
                {selectedIds.size > 0 && (
                  <>
                    <span className="text-blue-400" style={{ fontSize: 12 }}>·</span>
                    <span className="text-blue-600" style={{ fontSize: 12, fontWeight: 600 }}>{selectedIds.size} selected</span>
                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        onClick={handleBulkApprove}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> Approve ({selectedIds.size})</span>
                      </button>
                      <button
                        onClick={handleBulkReject}
                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                        style={{ fontSize: 12, fontWeight: 700 }}
                      >
                        <span className="flex items-center gap-1.5"><XCircle size={13} /> Reject ({selectedIds.size})</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Review Cards */}
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                  {reviewFilter === 'pending' ? (
                    <CheckCircle2 size={28} className="text-emerald-400" />
                  ) : (
                    <currentModuleTab.icon size={28} className="text-gray-300" />
                  )}
                </div>
                <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>
                  {reviewFilter === 'pending' ? 'All caught up!' : `No ${reviewFilter} listings`}
                </p>
                <p className="text-gray-500 text-center max-w-sm" style={{ fontSize: 13 }}>
                  {reviewFilter === 'pending'
                    ? `No pending ${currentModuleTab.label.toLowerCase()} listings to review right now.`
                    : 'Try changing the filter to see other listings.'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredReviews.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    {/* Bulk checkbox */}
                    {reviewFilter === 'pending' && item.status === 'pending' && (
                      <button
                        onClick={() => toggleSelect(item.id)}
                        className="mt-5 shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {selectedIds.has(item.id) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} />}
                      </button>
                    )}
                    <div className="flex-1 min-w-0">
                      <AdminReviewCard
                        item={item}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        onSuggestEdit={handleSuggestEdit}
                        onPreview={(id) => {
                          const typeMap: Record<string, string> = {
                            jobs: 'JobDetails', projects: 'ProjectDetails', events: 'EventDetails',
                            courses: 'CourseDetails', supervision: 'SupervisorProfile', mentoring: 'MentorProfile',
                            referrals: 'ReferralDetail',
                          };
                          const page = typeMap[reviewModule] || 'JobDetails';
                          if (reviewModule === 'events') onNavigate(page, { eventId: id });
                          else if (reviewModule === 'jobs') onNavigate(page, { jobId: id });
                          else if (reviewModule === 'projects') onNavigate(page, { projectId: id });
                          else if (reviewModule === 'referrals') onNavigate(page, { referralId: id });
                          else onNavigate(page);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── REPORTS ── */}
        {activeSection === 'reports' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2">
                <Flag size={18} className="text-red-500" />
                <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Flagged Content</p>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto overflow-x-auto">
                {(['all', 'open', 'resolved', 'dismissed'] as const).map(f => {
                  const count = f === 'all' ? reports.length : reports.filter(r => r.status === f).length;
                  return (
                    <button
                      key={f}
                      onClick={() => setReportFilter(f)}
                      className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
                        reportFilter === f
                          ? f === 'open' ? 'bg-red-600 text-white' : 'bg-gray-800 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {filteredReports.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-emerald-400" />
                </div>
                <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>No reports to show</p>
                <p className="text-gray-500" style={{ fontSize: 13 }}>All clear for this filter.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredReports.map(report => (
                  <div key={report.id} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Flag size={14} className="text-red-400" />
                        <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 700 }}>{report.entityTitle}</p>
                        <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600" style={{ fontSize: 10, fontWeight: 600 }}>{report.entityType}</span>
                        <span className={`px-2 py-0.5 rounded-md ${
                          report.status === 'open' ? 'bg-red-50 text-red-600' : report.status === 'resolved' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'
                        }`} style={{ fontSize: 10, fontWeight: 700 }}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-gray-500" style={{ fontSize: 12 }}>Reason: {report.reason}</span>
                        <span className="text-gray-400" style={{ fontSize: 12 }}>· By {report.reportedBy}</span>
                        <span className="text-gray-400" style={{ fontSize: 12 }}>· {report.reportedAt}</span>
                      </div>
                    </div>

                    {report.status === 'open' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-blue-50 transition-colors" title="Preview">
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDismissReport(report.id)}
                          className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                          style={{ fontSize: 12, fontWeight: 600 }}
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleResolveReport(report.id)}
                          className="px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors shadow-sm"
                          style={{ fontSize: 12, fontWeight: 700 }}
                        >
                          Remove Listing
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── STATISTICS ── */}
        {activeSection === 'statistics' && <AdminStatistics />}

        {/* ── TAXONOMY ── */}
        {activeSection === 'taxonomy' && <AdminTaxonomy />}
      </div>
    </div>
  );
}