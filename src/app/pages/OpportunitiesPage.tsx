import React, { useState } from 'react';
import { Briefcase, FolderOpen, Gift, Plus, Search, MapPin, X, LayoutGrid, Bookmark, CheckCircle2, Sparkles, User } from 'lucide-react';
import { JobsPage } from './JobsPage';
import { ProjectsPage } from './ProjectsPage';
import { ReferralsPage } from './ReferralsPage';
import type { ReferralSubTab } from './ReferralsPage';

type Tab = 'jobs' | 'projects' | 'referrals';

interface OpportunitiesPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
  initialTab?: Tab;
}

const MODULE_META: Record<Tab, {
  icon: React.ReactNode;
  label: string;
  title: (isPro: boolean) => string;
  subtitle: (isPro: boolean) => string;
}> = {
  jobs: {
    icon: <Briefcase size={20} />,
    label: 'Jobs',
    title: (isPro) => isPro ? 'Job Opportunities' : 'Browse Job Opportunities',
    subtitle: (isPro) => isPro
      ? 'Find consulting roles or post positions for your team.'
      : 'Find psychology roles that match your career goals.',
  },
  projects: {
    icon: <FolderOpen size={20} />,
    label: 'Projects',
    title: (isPro) => isPro ? 'Project Opportunities' : 'Explore Projects',
    subtitle: (isPro) => isPro
      ? 'Lead research initiatives or find collaborators for your projects.'
      : 'Discover research and applied projects to contribute to.',
  },
  referrals: {
    icon: <Gift size={20} />,
    label: 'Referrals',
    title: (isPro) => 'Referrals',
    subtitle: (isPro) => isPro
      ? 'Create and manage time-bound referrals for your professional network.'
      : 'Find and respond to referral opportunities available to you.',
  },
};

const MODULE_KEYS: Tab[] = ['jobs', 'projects', 'referrals'];

export function OpportunitiesPage({ onNavigate, userRole, initialTab = 'jobs' }: OpportunitiesPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const isProfessional = userRole === 'Professional';
  const isStudent = userRole === 'Student';
  const isCompany = userRole === 'Company';

  // Shared search state
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobLocationQuery, setJobLocationQuery] = useState('');
  const [projectSearchQuery, setProjectSearchQuery] = useState('');
  const [referralSearchQuery, setReferralSearchQuery] = useState('');

  // Sub-tab state per module
  const [jobSubTab, setJobSubTab] = useState<'all' | 'saved' | 'applied'>('all');
  const [projectSubTab, setProjectSubTab] = useState<'all' | 'saved'>('all');
  const [referralSubTab, setReferralSubTab] = useState<ReferralSubTab>('all');

  // Current search values
  const searchQuery = activeTab === 'jobs' ? jobSearchQuery
    : activeTab === 'projects' ? projectSearchQuery
    : referralSearchQuery;
  const setSearchQuery = activeTab === 'jobs' ? setJobSearchQuery
    : activeTab === 'projects' ? setProjectSearchQuery
    : setReferralSearchQuery;
  const locationQuery = activeTab === 'jobs' ? jobLocationQuery : '';
  const setLocationQuery = setJobLocationQuery;

  const meta = MODULE_META[activeTab];

  // Sub-tab configs
  const SUB_TABS: Record<Tab, { key: string; label: string; icon: React.ReactNode }[]> = {
    jobs: [
      { key: 'all', label: 'Explore', icon: <Sparkles size={15} /> },
      { key: 'saved', label: 'Saved', icon: <Bookmark size={15} /> },
      { key: 'applied', label: 'Applied', icon: <CheckCircle2 size={15} /> },
    ],
    projects: [
      { key: 'all', label: 'All Projects', icon: <LayoutGrid size={15} /> },
      { key: 'saved', label: 'Saved', icon: <Bookmark size={15} /> },
    ],
    referrals: isStudent ? [] : [
      { key: 'all', label: 'All Referrals', icon: <LayoutGrid size={15} /> },
      { key: 'mine', label: 'My Referrals', icon: <User size={15} /> },
      { key: 'closed', label: 'Closed', icon: <CheckCircle2 size={15} /> },
    ],
  };

  const currentSubTab = activeTab === 'jobs' ? jobSubTab
    : activeTab === 'projects' ? projectSubTab
    : referralSubTab;
  const setCurrentSubTab = (tab: string) => {
    if (activeTab === 'jobs') setJobSubTab(tab as 'all' | 'saved' | 'applied');
    if (activeTab === 'projects') setProjectSubTab(tab as 'all' | 'saved');
    if (activeTab === 'referrals') setReferralSubTab(tab as ReferralSubTab);
  };

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* MODULE SELECTOR */}
      <div className="w-full bg-blue-900 pt-4 px-6 lg:px-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-3 gap-2">
          {MODULE_KEYS.map((key) => {
            const mod = MODULE_META[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center gap-2.5 py-3 rounded-t-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-blue-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {mod.icon}
                {mod.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* HERO HEADER */}
      <div className={`w-full bg-blue-800 pt-12 shadow-sm relative overflow-hidden ${SUB_TABS[activeTab].length > 0 ? 'pb-0' : 'pb-10'}`}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">

          {/* Title + Action */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                {meta.title(isProfessional)}
              </h1>
              <p className="text-blue-100 text-[15px] font-medium max-w-xl leading-relaxed opacity-90">
                {meta.subtitle(isProfessional)}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {(isProfessional || isCompany) && activeTab === 'jobs' && (
                <button
                  onClick={() => onNavigate('CreateJob')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Post a Job
                </button>
              )}
              {(isProfessional || isCompany) && activeTab === 'projects' && (
                <button
                  onClick={() => onNavigate('CreateProject')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create Project
                </button>
              )}
              {(isProfessional || isCompany) && activeTab === 'referrals' && (
                <button
                  onClick={() => onNavigate('CreateReferral')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create Referral
                </button>
              )}
            </div>
          </div>

          {/* Search bar */}
          {activeTab !== 'referrals' && (
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder={
                    activeTab === 'jobs' ? 'Job title, company, or specialization...'
                    : activeTab === 'projects' ? 'Search projects by title, domain...'
                    : 'Search by title, specialization, or location...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              {activeTab === 'jobs' && (
                <>
                  <div className="w-px bg-gray-200 hidden sm:block my-2" />
                  <div className="relative sm:w-72 group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                    <input
                      type="text"
                      placeholder="City, state, or remote..."
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                    />
                    {locationQuery && (
                      <button onClick={() => setLocationQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </>
              )}
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-sm">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          )}

          {/* Sub-tabs */}
          {SUB_TABS[activeTab].length > 0 && (
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
              {SUB_TABS[activeTab].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCurrentSubTab(tab.key)}
                  className={`pb-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                    currentSubTab === tab.key
                      ? 'border-white text-white opacity-100'
                      : 'border-transparent text-blue-200 hover:text-white hover:opacity-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 relative z-20">
        {activeTab === 'jobs' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <JobsPage
              onNavigate={onNavigate}
              userRole={userRole}
              embedded
              externalSearchQuery={jobSearchQuery}
              onExternalSearchChange={setJobSearchQuery}
              externalLocationQuery={jobLocationQuery}
              onExternalLocationChange={setJobLocationQuery}
              externalSubTab={jobSubTab}
              onExternalSubTabChange={setJobSubTab}
            />
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <ProjectsPage
              onNavigate={onNavigate}
              userRole={userRole}
              embedded
              externalSearchQuery={projectSearchQuery}
              onExternalSearchChange={setProjectSearchQuery}
              externalSubTab={projectSubTab}
              onExternalSubTabChange={setProjectSubTab}
            />
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <ReferralsPage
              onNavigate={onNavigate}
              userRole={userRole}
              embedded
              externalSearchQuery={referralSearchQuery}
              onExternalSearchChange={setReferralSearchQuery}
              externalSubTab={referralSubTab}
              onExternalSubTabChange={setReferralSubTab}
            />
          </div>
        )}
      </div>

    </div>
  );
}