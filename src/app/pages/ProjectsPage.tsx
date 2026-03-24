import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Search,
  MapPin,
  ArrowDown,
  Bookmark,
  FolderOpen,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronDown,
  Check,
  Compass,
  Building2,
  TrendingUp,
  Wifi,
  GraduationCap,
  SlidersHorizontal,
  DollarSign,
} from 'lucide-react';
import { ProjectCard } from '@/app/components/ProjectCard';
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { toastBookmarkAdded, toastBookmarkRemoved } from '@/app/components/shared/toasts';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { ProjectCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';
import {
  EMPTY_FILTERS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_SEGMENT_OPTIONS,
  PROJECT_FORMAT_OPTIONS,
  PROJECT_LEVEL_OPTIONS,
  PROJECT_PRICE_OPTIONS,
  DURATION_LABELS,
} from '@/app/components/projects/ProjectFilters';
import { ProjectFiltersPanel } from '@/app/components/projects/ProjectFilters';
import type {
  ProjectFilterState,
  ProjectType,
  ProjectSegment,
  ProjectFormat,
  ProjectLevel,
  ProjectDuration,
  ProjectPrice,
  Recognition,
  OfferedBy,
} from '@/app/components/projects/ProjectFilters';

interface ProjectsPageProps {
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
  embedded?: boolean;
  externalSearchQuery?: string;
  onExternalSearchChange?: (query: string) => void;
  externalLocationQuery?: string;
  onExternalLocationChange?: (query: string) => void;
  externalSubTab?: 'all' | 'saved';
  onExternalSubTabChange?: (tab: 'all' | 'saved') => void;
}

/* ══════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════ */

const allProjects = [
  {
    id: 1,
    title: 'AI-Driven Mental Health Chatbot Analysis',
    projectType: 'Research & Pilot Studies' as ProjectType,
    segment: 'Startups' as ProjectSegment,
    offeredByName: 'Dr. Neha Kapoor',
    offeredByType: 'Individual' as OfferedBy,
    format: 'Online' as ProjectFormat,
    location: 'Bangalore, India',
    duration: 'Medium' as ProjectDuration,
    durationLabel: '3 Months',
    timeCommitment: '10 hrs/week',
    level: 'Intermediate' as ProjectLevel,
    isPaid: false,
    recognition: ['Co-authorship', 'Certificate'] as Recognition[],
    isFeatured: true,
    isSaved: false,
    description:
      'Analyzing the efficacy of AI chatbots in providing mental health support. Looking for students to help code qualitative data and run statistical analysis.',
  },
  {
    id: 2,
    title: 'Community Resilience Mapping Initiative',
    projectType: 'Community Outreach & Field Work' as ProjectType,
    segment: 'NGOs/CSRs' as ProjectSegment,
    offeredByName: 'Serenity Foundation',
    offeredByType: 'Company' as OfferedBy,
    format: 'Offline' as ProjectFormat,
    location: 'Pune, India',
    duration: 'Medium' as ProjectDuration,
    durationLabel: '2 Months',
    timeCommitment: '15 hrs/week',
    level: 'Beginner' as ProjectLevel,
    isPaid: true,
    recognition: ['LOR'] as Recognition[],
    isFeatured: true,
    isSaved: true,
    description:
      'Mapping community resilience factors in urban neighborhoods through on-site interviews, surveys, and data collection.',
  },
  {
    id: 3,
    title: 'Cognitive Screening Tool for Schools',
    projectType: 'Diagnostics/Assessment Support' as ProjectType,
    segment: 'Schools & Universities' as ProjectSegment,
    offeredByName: 'BrainFirst Labs',
    offeredByType: 'Company' as OfferedBy,
    format: 'Hybrid' as ProjectFormat,
    location: 'Chennai, India',
    duration: 'Long' as ProjectDuration,
    durationLabel: '4 Months',
    timeCommitment: '12 hrs/week',
    level: 'Advanced' as ProjectLevel,
    isPaid: false,
    recognition: ['Co-authorship'] as Recognition[],
    isFeatured: false,
    isSaved: false,
    description:
      'Developing and validating a screening tool for identifying early cognitive development markers in school-aged children.',
  },
  {
    id: 4,
    title: 'Workplace Burnout Micro-Intervention',
    projectType: 'Consulting & Training Support' as ProjectType,
    segment: 'Corporates' as ProjectSegment,
    offeredByName: 'Dr. Raghav Iyer',
    offeredByType: 'Individual' as OfferedBy,
    format: 'Online' as ProjectFormat,
    location: 'Mumbai, India',
    duration: 'Long' as ProjectDuration,
    durationLabel: '6 Months',
    timeCommitment: '8 hrs/week',
    level: 'Intermediate' as ProjectLevel,
    isPaid: true,
    recognition: ['Certificate', 'LOR'] as Recognition[],
    isFeatured: false,
    isSaved: false,
    description:
      'Designing and testing a micro-intervention for reducing burnout in remote tech workers. Help design modules and track participant progress.',
  },
  {
    id: 5,
    title: 'Cross-Cultural Emotion Perception Study',
    projectType: 'Interdisciplinary Collaboration & Co-creation' as ProjectType,
    segment: 'Research Organizations' as ProjectSegment,
    offeredByName: 'Prof. Sarah Lin',
    offeredByType: 'Individual' as OfferedBy,
    format: 'Online' as ProjectFormat,
    location: 'Boston, US',
    duration: 'Short' as ProjectDuration,
    durationLabel: '2 Weeks',
    timeCommitment: '5 hrs/week',
    level: 'Beginner' as ProjectLevel,
    isPaid: false,
    recognition: ['Certificate'] as Recognition[],
    isFeatured: false,
    isSaved: false,
    description:
      'Cross-disciplinary study on how facial expressions are perceived across cultures. Help distribute surveys and manage participant queries.',
  },
  {
    id: 6,
    title: 'Mental Health Awareness Campaign',
    projectType: 'Digital Marketing & Content Support' as ProjectType,
    segment: 'Hospitals & Clinics' as ProjectSegment,
    offeredByName: 'MindCare Clinic',
    offeredByType: 'Company' as OfferedBy,
    format: 'Online' as ProjectFormat,
    location: 'Hyderabad, India',
    duration: 'Medium' as ProjectDuration,
    durationLabel: '2 Months',
    timeCommitment: '6 hrs/week',
    level: 'Beginner' as ProjectLevel,
    isPaid: true,
    recognition: ['Certificate'] as Recognition[],
    isFeatured: false,
    isSaved: false,
    description:
      'Create social media content, blog posts, and infographics for a national mental health awareness campaign targeting college students.',
  },
  {
    id: 7,
    title: 'Therapy Case Audit for Training Clinic',
    projectType: 'Therapy Case Work & Case Audit' as ProjectType,
    segment: 'Government Entities' as ProjectSegment,
    offeredByName: 'Dr. Meera Sharma',
    offeredByType: 'Individual' as OfferedBy,
    format: 'Offline' as ProjectFormat,
    location: 'New Delhi, India',
    duration: 'Medium' as ProjectDuration,
    durationLabel: '3 Months',
    timeCommitment: '4 hrs/week',
    level: 'Expert' as ProjectLevel,
    isPaid: false,
    recognition: ['LOR', 'Co-authorship'] as Recognition[],
    isFeatured: false,
    isSaved: false,
    description:
      'Auditing anonymised therapy case files to evaluate adherence to clinical protocols and identify training gaps.',
  },
];

/* ══════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════ */

export function ProjectsPage({
  onNavigate,
  userRole,
  embedded,
  externalSearchQuery,
  onExternalSearchChange,
  externalLocationQuery,
  onExternalLocationChange,
  externalSubTab,
  onExternalSubTabChange,
}: ProjectsPageProps) {
  const isProfessional = userRole === 'Professional';

  /* ── Search ── */
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalLocationQuery, setInternalLocationQuery] = useState('');
  const [internalTab, setInternalTab] = useState<'all' | 'saved'>('all');

  const searchQuery = embedded && externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = embedded && onExternalSearchChange ? onExternalSearchChange : setInternalSearchQuery;
  const locationQuery = embedded && externalLocationQuery !== undefined ? externalLocationQuery : internalLocationQuery;
  const setLocationQuery = embedded && onExternalLocationChange ? onExternalLocationChange : setInternalLocationQuery;
  const activeTab = externalSubTab !== undefined ? externalSubTab : internalTab;
  const setActiveTab = onExternalSubTabChange ? onExternalSubTabChange : setInternalTab;

  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const prevTabRef = useRef(activeTab);

  useEffect(() => {
    if (prevTabRef.current !== activeTab) {
      setIsTabLoading(true);
      const timer = setTimeout(() => setIsTabLoading(false), 600);
      prevTabRef.current = activeTab;
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Saved project IDs (local state)
  const [savedProjectIds, setSavedProjectIds] = useState<Set<number>>(() => {
    return new Set(allProjects.filter(p => p.isSaved).map(p => p.id));
  });

  const toggleSaveProject = (projectId: number) => {
    setSavedProjectIds(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
        toastBookmarkRemoved('project');
      } else {
        next.add(projectId);
        toastBookmarkAdded('project');
      }
      return next;
    });
  };

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareProjectTitle, setShareProjectTitle] = useState('');

  const handleShareProject = (title: string) => {
    setShareProjectTitle(title);
    setShareModalOpen(true);
  };

  /* ── Filters ── */
  const [filters, setFilters] = useState<ProjectFilterState>(EMPTY_FILTERS);

  const toggleFilter = useCallback(
    <T extends string>(key: keyof ProjectFilterState, value: T) => {
      setFilters((prev) => {
        const arr = (prev[key] as T[]) || [];
        const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
        return { ...prev, [key]: next };
      });
    },
    [],
  );

  /* ── Horizontal dropdown state (primary chips only) ── */
  type DropdownKey = 'specializations' | 'formats' | 'levels' | 'segments' | null;
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  /* ── Derived flags ── */
  const hasActiveFilters = (Object.values(filters) as string[][]).some((arr) => arr.length > 0);
  const hasSearch = !!searchQuery || !!locationQuery;
  const isDiscoveryMode = activeTab === 'all' && !hasSearch && !hasActiveFilters && !showAllProjects;

  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  // Scroll to listings when a dropdown closes after selecting filters
  const prevOpenDropdown = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpenDropdown.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    prevOpenDropdown.current = openDropdown;
  }, [openDropdown, hasActiveFilters]);

  /* ── Filtering ── */
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((p) => {
        if (activeTab === 'saved' && !savedProjectIds.has(p.id)) return false;

        const q = searchQuery.toLowerCase();
        if (q && !(p.title.toLowerCase().includes(q) || p.projectType.toLowerCase().includes(q) || p.segment.toLowerCase().includes(q) || p.offeredByName.toLowerCase().includes(q)))
          return false;

        if (locationQuery) {
          const loc = (p.location || '').toLowerCase();
          if (!loc.includes(locationQuery.toLowerCase())) return false;
        }

        if (activeTab === 'all') {
          if (filters.specializations.length && !filters.specializations.includes(p.projectType)) return false;
          if (filters.segments.length && !filters.segments.includes(p.segment)) return false;
          if (filters.offeredBy.length && !filters.offeredBy.includes(p.offeredByType)) return false;
          if (filters.formats.length && !filters.formats.includes(p.format)) return false;
          if (filters.levels.length && !filters.levels.includes(p.level)) return false;
          if (filters.durations.length && !filters.durations.includes(p.duration)) return false;
          if (filters.prices.length) {
            const priceTag: ProjectPrice = p.isPaid ? 'Paid' : 'Unpaid';
            if (!filters.prices.includes(priceTag)) return false;
          }
          if (filters.recognitions.length && !p.recognition.some((r) => filters.recognitions.includes(r))) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (!searchQuery && activeTab === 'all') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
        }
        return 0;
      });
  }, [searchQuery, locationQuery, activeTab, filters, showAllProjects, savedProjectIds]);

  const savedProjects = useMemo(() => allProjects.filter((p) => savedProjectIds.has(p.id)), [savedProjectIds]);
  const featuredProjects = useMemo(() => allProjects.filter((p) => p.isFeatured), []);
  const latestProjects = useMemo(() => allProjects.filter((p) => !p.isFeatured).slice(0, 6), []);

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setFilters(EMPTY_FILTERS);
    setShowAllProjects(false);
  };

  /* ── Active filter tags (for removable pills) ── */
  const activeFilterTags: { label: string; group: string; onRemove: () => void }[] = [];
  filters.specializations.forEach((t) => activeFilterTags.push({ label: t, group: 'Specialization', onRemove: () => toggleFilter('specializations', t) }));
  filters.offeredBy.forEach((o) => activeFilterTags.push({ label: o, group: 'Offered By', onRemove: () => toggleFilter('offeredBy', o) }));
  filters.formats.forEach((f) => activeFilterTags.push({ label: f, group: 'Format', onRemove: () => toggleFilter('formats', f) }));
  filters.levels.forEach((l) => activeFilterTags.push({ label: l, group: 'Level', onRemove: () => toggleFilter('levels', l) }));
  filters.durations.forEach((d) => activeFilterTags.push({ label: `${d} (${DURATION_LABELS[d]})`, group: 'Duration', onRemove: () => toggleFilter('durations', d) }));
  filters.prices.forEach((p) => activeFilterTags.push({ label: p, group: 'Price', onRemove: () => toggleFilter('prices', p) }));
  filters.recognitions.forEach((r) => activeFilterTags.push({ label: r, group: 'Recognition', onRemove: () => toggleFilter('recognitions', r) }));
  filters.segments.forEach((s) => activeFilterTags.push({ label: s, group: 'Segment', onRemove: () => toggleFilter('segments', s) }));

  /* ── Primary horizontal chip configs (4 most important) ── */
  const PRIMARY_CHIPS: {
    key: 'specializations' | 'formats' | 'levels' | 'segments';
    label: string;
    icon: React.ReactNode;
    options: string[];
    filterKey: keyof ProjectFilterState;
  }[] = [
    { key: 'specializations', label: 'Specialization', icon: <GraduationCap size={14} />, options: PROJECT_TYPE_OPTIONS as string[], filterKey: 'specializations' },
    { key: 'formats', label: 'Format', icon: <Wifi size={14} />, options: PROJECT_FORMAT_OPTIONS as string[], filterKey: 'formats' },
    { key: 'levels', label: 'Level', icon: <TrendingUp size={14} />, options: PROJECT_LEVEL_OPTIONS as string[], filterKey: 'levels' },
    { key: 'segments', label: 'Segment', icon: <Building2 size={14} />, options: PROJECT_SEGMENT_OPTIONS as string[], filterKey: 'segments' },
  ];

  /* ══════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════ */
  return (
    <div className={`flex flex-col w-full ${!embedded ? 'bg-[#f0f4f8] min-h-screen' : ''} font-sans animate-fade-in`}>
      {/* ══ HERO HEADER ══ */}
      {!embedded && (
        <div className="w-full bg-teal-800 pt-16 pb-12 shadow-sm relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                  Explore Projects
                </h1>
                <p className="text-teal-100 text-[15px] font-medium max-w-2xl leading-relaxed opacity-90">
                  {isProfessional
                    ? 'Lead collaborations or find research partnerships.'
                    : 'Gain real-world experience through collaborative projects.'}
                </p>
              </div>
              {isProfessional && (
                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-800 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm shrink-0">
                  <Plus size={16} strokeWidth={3} />
                  Create Project
                </button>
              )}
            </div>

            {/* Search bar */}
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Project title, domain, or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="w-px bg-gray-200 hidden sm:block my-2" />
              <div className="relative sm:w-72 group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="City or country..."
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all"
                />
                {locationQuery && (
                  <button
                    onClick={() => setLocationQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-sm">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <div className={`w-full ${embedded ? '' : 'max-w-[1440px] mx-auto px-6 lg:px-10 py-10'} relative z-20`}>
        {/* Sub-nav tabs */}
        {!externalSubTab && (
          <div className="flex items-center p-1 bg-gray-100/80 rounded-lg self-start mb-8 w-fit">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'all' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Compass size={16} />
              Explore
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                activeTab === 'saved' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bookmark size={16} />
              Saved
            </button>
          </div>
        )}

        {/* ═══ EXPLORE TAB ═══ */}
        {activeTab === 'all' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            {/* ── Primary horizontal filter chips (4 key categories) ── */}
            <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
              {PRIMARY_CHIPS.map((cat) => {
                const selected = (filters[cat.filterKey] as string[]) || [];
                const count = selected.length;
                const isOpen = openDropdown === cat.key;
                return (
                  <div key={cat.key} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : cat.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border shadow-sm ${
                        count > 0
                          ? 'bg-teal-700 text-white border-teal-700 shadow-teal-700/20'
                          : isOpen
                          ? 'bg-white text-teal-700 border-teal-600/40 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-teal-600/40 hover:text-teal-700 hover:shadow-md'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                      {count > 0 && (
                        <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">
                          {count}
                        </span>
                      )}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown popover */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                          {cat.options.map((option) => {
                            const isSelected = selected.includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() => toggleFilter(cat.filterKey, option)}
                                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                    isSelected ? 'bg-teal-700/5 text-teal-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected ? 'bg-teal-700 border-teal-700' : 'border-gray-300'
                                }`}>
                                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                                </div>
                                {option}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Paid / Unpaid toggle chip */}
              <div className="w-px h-6 bg-gray-200 mx-0.5" />
              {(() => {
                const isActive = filters.prices.includes('Paid');
                return (
                  <button
                    onClick={() => toggleFilter('prices', 'Paid')}
                    className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border shadow-sm ${
                      isActive
                        ? 'bg-teal-700 text-white border-teal-700 shadow-teal-700/20'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-teal-600/40 hover:text-teal-700 hover:shadow-md'
                    }`}
                  >
                    <DollarSign size={14} />
                    Paid
                  </button>
                );
              })()}

              {/* Clear All chip */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                  Clear All
                </button>
              )}
            </div>

            {/* Scroll target */}
            <div ref={listingsRef} className="-mt-4" />

            {/* ═══ DISCOVERY MODE (no filters / search / showAll) ═══ */}
            {isDiscoveryMode && (
              <div className="flex flex-col gap-12">
                {/* Featured */}
                {featuredProjects.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star size={18} className="text-amber-500" />
                        Top Projects
                      </h2>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {featuredProjects.length} Featured
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {featuredProjects.map((project) => (
                        <div key={`featured-${project.id}`} className="h-full">
                          <ProjectCard {...project} isSaved={savedProjectIds.has(project.id)} onSave={() => toggleSaveProject(project.id)} onClick={() => onNavigate?.('ProjectDetails')} onShare={() => handleShareProject(project.title)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Latest */}
                {latestProjects.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Latest Projects</h2>
                      <button
                        onClick={() => setShowAllProjects(true)}
                        className="text-sm font-bold text-teal-700 hover:underline flex items-center gap-1"
                      >
                        View All <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {latestProjects.map((project) => (
                        <div key={`latest-${project.id}`} className="h-full">
                          <ProjectCard {...project} isSaved={savedProjectIds.has(project.id)} onSave={() => toggleSaveProject(project.id)} onClick={() => onNavigate?.('ProjectDetails')} onShare={() => handleShareProject(project.title)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ═══ FILTERED / SEARCH / VIEW-ALL RESULTS ═══ */}
            {!isDiscoveryMode && (
              <div className="flex flex-col gap-4">
                {/* Active filter tags bar */}
                {(activeFilterTags.length > 0 || hasSearch) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Active Filters:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-teal-500/[0.07] text-teal-700 rounded-full text-[11px] font-medium">
                        &quot;{searchQuery}&quot;
                        <button onClick={() => setSearchQuery('')} className="w-4 h-4 rounded-full hover:bg-teal-500/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    )}
                    {locationQuery && (
                      <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-teal-500/[0.07] text-teal-600 rounded-full text-[11px] font-medium">
                        <MapPin size={10} /> {locationQuery}
                        <button onClick={() => setLocationQuery('')} className="w-4 h-4 rounded-full hover:bg-teal-500/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    )}
                    {activeFilterTags.map((tag) => (
                      <span
                        key={`${tag.group}-${tag.label}`}
                        className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-teal-500/[0.07] text-teal-700 rounded-full text-[11px] font-medium"
                      >
                        {tag.label}
                        <button onClick={tag.onRemove} className="w-4 h-4 rounded-full hover:bg-teal-500/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                    <button onClick={clearFilters} className="text-[12px] font-semibold text-gray-400 hover:text-teal-700 transition-colors ml-1">
                      Clear All
                    </button>
                  </div>
                )}

                {/* Back to explore */}
                <button onClick={clearFilters} className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:underline self-start">
                  <ArrowLeft size={16} />
                  Back to Explore Projects
                </button>

                {/* ── Sidebar + Results grid (like JobsPage) ── */}
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Mobile Filter Toggle */}
                  <button
                    className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <SlidersHorizontal size={18} />
                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  {/* Sidebar Filters (synced with horizontal chips) */}
                  <div className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <ProjectFiltersPanel filters={filters} onChange={setFilters} />
                  </div>

                  {/* Results */}
                  <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 hidden lg:block">
                        {showAllProjects && !hasSearch && !hasActiveFilters ? 'All Projects' : 'Search Results'}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 ml-auto">
                        Showing <span className="text-gray-900 font-bold">{filteredProjects.length}</span> result{filteredProjects.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {filteredProjects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProjects.map((project) => (
                          <div key={`result-${project.id}`} className="h-full">
                            <ProjectCard {...project} isSaved={savedProjectIds.has(project.id)} onSave={() => toggleSaveProject(project.id)} onClick={() => onNavigate?.('ProjectDetails')} onShare={() => handleShareProject(project.title)} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyStateNudge
                        module="projects"
                        onNavigate={(page, params) => onNavigate?.(page, params)}
                        onClearFilters={clearFilters}
                      />
                    )}

                    {filteredProjects.length > 0 && (
                      <>
                        <LowResultsNudge
                          module="projects"
                          resultCount={filteredProjects.length}
                          onNavigate={(page, params) => onNavigate?.(page, params)}
                        />
                        <div className="flex justify-center mt-8">
                          <button className="w-full md:w-auto px-8 py-3 text-sm font-medium text-gray-500 hover:text-teal-700 bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                            Load More Projects
                            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SAVED TAB ═══ */}
        {activeTab === 'saved' && (
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Saved Projects</h2>
              <p className="text-sm font-medium text-gray-500 ml-auto">
                <span className="text-gray-900 font-bold">{savedProjects.length}</span> saved
              </p>
            </div>

            {isTabLoading ? (
              <SkeletonGrid count={4} columns={2}><ProjectCardSkeleton /></SkeletonGrid>
            ) : savedProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedProjects.map((project) => (
                  <div key={`saved-${project.id}`} className="h-full">
                    <ProjectCard {...project} isSaved={savedProjectIds.has(project.id)} onSave={() => toggleSaveProject(project.id)} onClick={() => onNavigate?.('ProjectDetails')} onShare={() => handleShareProject(project.title)} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                variant="saved-projects"
                onAction={() => setActiveTab('all')}
              />
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={shareProjectTitle}
        subtitle="Share this project opportunity"
      />
    </div>
  );
}