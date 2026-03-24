import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import {
  courses,
  ENROLLED_COURSES,
  COMPLETED_COURSES,
  SPECIALIZATION_OPTIONS,
  COURSE_TYPE_OPTIONS,
  MODE_OPTIONS,
  DURATION_OPTIONS as DURATION_OPTS,
  FEES_OPTIONS as FEES_OPTS,
  OUTCOME_OPTIONS as OUTCOME_OPTS,
} from "@/app/data/courses";
import { CourseCard } from "@/app/components/courses/CourseCard";
import { CourseFilters, CourseFilterState, EMPTY_COURSE_FILTERS } from "@/app/components/courses/CourseFilters";
import { RequestCourseModal } from "@/app/components/courses/RequestCourseModal";
import { NominateEmployeesModal } from "@/app/components/courses/NominateEmployeesModal";
import {
  Search,
  X,
  Bookmark,
  SlidersHorizontal,
  GraduationCap,
  Users,
  UserCheck,
  Star,
  ArrowRight,
  ArrowLeft,
  ArrowDown,
  ChevronDown,
  Check,
  Compass,
  Wifi,
  Clock,
  DollarSign,
  Award,
  Layers,
  BookOpen,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  UserPlus,
  BarChart3,
  Download,
} from "lucide-react";
import { MentorshipPage } from "@/app/pages/MentorshipPage";
import { SupervisionPage } from "@/app/pages/SupervisionPage";
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { CourseCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';
import { ShareModal } from '@/app/components/shared/ShareModal';

type Tab = "courses" | "mentorship" | "supervision";

type CourseSubTab = "all" | "saved" | "enrolled" | "completed";

const MODULE_META: Record<Tab, {
  icon: React.ReactNode;
  label: string;
  title: (isPro: boolean) => string;
  subtitle: (isPro: boolean) => string;
}> = {
  courses: {
    icon: <GraduationCap size={20} />,
    label: 'Courses',
    title: (isPro) => isPro ? 'Professional Development' : 'Explore Courses',
    subtitle: (isPro) => isPro
      ? 'Advance your clinical skills and earn continuing education credits.'
      : 'Grow your skills with expert-led courses and certifications.',
  },
  mentorship: {
    icon: <Users size={20} />,
    label: 'Mentorship',
    title: (isPro) => isPro ? 'Mentorship' : 'Mentorship',
    subtitle: (isPro) => isPro
      ? 'Guide students and early-career professionals on their journey.'
      : 'Connect with experienced professionals who can guide your career.',
  },
  supervision: {
    icon: <UserCheck size={20} />,
    label: 'Supervision',
    title: (isPro) => 'Supervision',
    subtitle: (isPro) => isPro
      ? 'Manage supervisees, log sessions, and track clinical hours.'
      : 'Find qualified supervisors for your clinical practice requirements.',
  },
};

const MODULE_KEYS: Tab[] = ['courses', 'mentorship', 'supervision'];

/* ── Primary horizontal chip configs (6 chips) ── */
type DropdownKey = 'courseTypes' | 'specializations' | 'modes' | 'durations' | 'fees' | 'outcomes' | null;

interface LearningPageProps {
  onNavigate: (page: string, params?: any) => void;
  onCourseSelect: (courseId: string) => void;
  initialTab?: Tab;
  userRole?: string;
}

export function LearningPage({
  onNavigate,
  onCourseSelect,
  initialTab = "courses",
  userRole,
}: LearningPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab as any);
  const isProfessional = userRole === "Professional";

  // --- Courses State ---
  const [courseSearchQuery, setCourseSearchQuery] = useState("");
  const [courseFilterTab, setCourseFilterTab] = useState<CourseSubTab>("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isCourseTabLoading, setIsCourseTabLoading] = useState(false);
  const prevCourseTab = useRef(courseFilterTab);

  useEffect(() => {
    if (prevCourseTab.current !== courseFilterTab) {
      setIsCourseTabLoading(true);
      const timer = setTimeout(() => setIsCourseTabLoading(false), 600);
      prevCourseTab.current = courseFilterTab;
      return () => clearTimeout(timer);
    }
  }, [courseFilterTab]);
  const [courseFilters, setCourseFilters] = useState<CourseFilterState>(EMPTY_COURSE_FILTERS);
  const [showAllCourses, setShowAllCourses] = useState(false);

  // --- Mentorship State ---
  const [mentorshipSubTab, setMentorshipSubTab] = useState<"explore" | "my">("explore");
  const [mentorSearchQuery, setMentorSearchQuery] = useState("");

  // --- Supervision State ---
  const [supervisionSubTab, setSupervisionSubTab] = useState<"explore" | "my">("explore");
  const [supervisionSearchQuery, setSupervisionSearchQuery] = useState("");

  // --- Request / Nominate modals ---
  const [showRequestCourse, setShowRequestCourse] = useState(false);
  const [showNominateModal, setShowNominateModal] = useState(false);

  // --- Share modal ---
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareCourseTitle, setShareCourseTitle] = useState('');

  const handleShareCourse = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    setShareCourseTitle(course?.title || 'Course');
    setShareModalOpen(true);
  };

  /* ── Horizontal dropdown state ── */
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  const toggleFilter = useCallback(<T extends string>(key: keyof CourseFilterState, value: T) => {
    setCourseFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  /* ── Derived flags ── */
  const hasActiveFilters = (Object.values(courseFilters) as string[][]).some(arr => arr.length > 0);
  const hasSearch = !!courseSearchQuery;
  const isDiscoveryMode = courseFilterTab === 'all' && !hasSearch && !hasActiveFilters && !showAllCourses;

  // Close dropdown on outside click
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

  // Scroll to listings on dropdown close with active filters
  const prevOpenDropdown = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpenDropdown.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    prevOpenDropdown.current = openDropdown;
  }, [openDropdown, hasActiveFilters]);

  // --- Course Filtering ---
  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      if (courseFilterTab === "saved" && !course.isSaved) return false;

      const matchesSearch =
        course.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
        course.provider.name.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(courseSearchQuery.toLowerCase());
      if (!matchesSearch) return false;

      if (courseFilterTab === 'all') {
        if (courseFilters.courseTypes.length > 0 && !courseFilters.courseTypes.includes(course.courseType)) return false;
        if (courseFilters.specializations.length > 0 && !course.specializations.some(s => courseFilters.specializations.includes(s))) return false;
        if (courseFilters.providerTypes.length > 0 && !courseFilters.providerTypes.includes(course.providerType)) return false;
        if (courseFilters.modes.length > 0 && !courseFilters.modes.includes(course.mode)) return false;
        if (courseFilters.formats.length > 0 && !courseFilters.formats.includes(course.courseFormat)) return false;
        if (courseFilters.durations.length > 0 && !courseFilters.durations.includes(course.durationCategory)) return false;
        if (courseFilters.fees.length > 0 && !courseFilters.fees.includes(course.fees)) return false;
        if (courseFilters.outcomes.length > 0 && !courseFilters.outcomes.some(o => courseFilters.outcomes.includes(o))) return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

    return result;
  }, [courseSearchQuery, courseFilters, courseFilterTab]);

  const featuredCourses = useMemo(() => courses.filter(c => c.isFeatured), []);
  const latestCourses = useMemo(() => courses.filter(c => !c.isFeatured).slice(0, 6), []);
  const savedCourses = useMemo(() => courses.filter(c => c.isSaved), []);

  const clearFilters = () => {
    setCourseSearchQuery('');
    setCourseFilters(EMPTY_COURSE_FILTERS);
    setShowAllCourses(false);
  };

  /* ── Active filter tags ── */
  const activeFilterTags: { label: string; group: string; onRemove: () => void }[] = [];
  courseFilters.courseTypes.forEach(t => activeFilterTags.push({ label: t, group: 'Course Type', onRemove: () => toggleFilter('courseTypes', t) }));
  courseFilters.specializations.forEach(s => activeFilterTags.push({ label: s, group: 'Specialization', onRemove: () => toggleFilter('specializations', s) }));
  courseFilters.modes.forEach(m => activeFilterTags.push({ label: m, group: 'Mode', onRemove: () => toggleFilter('modes', m) }));
  courseFilters.durations.forEach(d => activeFilterTags.push({ label: d === 'Short' ? '≤ 2 weeks' : d === 'Medium' ? '1–3 months' : '3+ months', group: 'Duration', onRemove: () => toggleFilter('durations', d) }));
  courseFilters.fees.forEach(f => activeFilterTags.push({ label: f, group: 'Fees', onRemove: () => toggleFilter('fees', f) }));
  courseFilters.outcomes.forEach(o => activeFilterTags.push({ label: o, group: 'Outcome', onRemove: () => toggleFilter('outcomes', o) }));
  courseFilters.formats.forEach(f => activeFilterTags.push({ label: f, group: 'Format', onRemove: () => toggleFilter('formats', f) }));
  courseFilters.providerTypes.forEach(p => activeFilterTags.push({ label: p, group: 'Provider', onRemove: () => toggleFilter('providerTypes', p) }));

  /* ── Primary horizontal chip configs (6 high-priority) ── */
  const PRIMARY_CHIPS: {
    key: DropdownKey & string;
    label: string;
    icon: React.ReactNode;
    options: string[];
    filterKey: keyof CourseFilterState;
  }[] = [
    { key: 'courseTypes', label: 'Course Type', icon: <GraduationCap size={14} />, options: COURSE_TYPE_OPTIONS as string[], filterKey: 'courseTypes' },
    { key: 'specializations', label: 'Specialization', icon: <Layers size={14} />, options: SPECIALIZATION_OPTIONS as string[], filterKey: 'specializations' },
    { key: 'modes', label: 'Mode', icon: <Wifi size={14} />, options: MODE_OPTIONS as string[], filterKey: 'modes' },
    { key: 'durations', label: 'Duration', icon: <Clock size={14} />, options: DURATION_OPTS.map(d => d.value) as string[], filterKey: 'durations' },
    { key: 'fees', label: 'Fees', icon: <DollarSign size={14} />, options: FEES_OPTS as string[], filterKey: 'fees' },
    { key: 'outcomes', label: 'Outcome', icon: <Award size={14} />, options: OUTCOME_OPTS as string[], filterKey: 'outcomes' },
  ];

  const meta = MODULE_META[activeTab];

  const SUB_TABS: Record<Tab, { key: string; label: string; icon: React.ReactNode }[]> = {
    courses: [
      { key: 'all', label: 'Explore', icon: <Compass size={15} /> },
      { key: 'saved', label: 'Saved', icon: <Bookmark size={15} /> },
      { key: 'enrolled', label: 'Enrolled', icon: <BookOpen size={15} /> },
      { key: 'completed', label: 'Completed', icon: <CheckCircle2 size={15} /> },
    ],
    mentorship: [
      { key: 'explore', label: 'Explore', icon: <Compass size={15} /> },
      { key: 'my', label: isProfessional ? 'My Mentees' : 'My Mentors', icon: <Users size={15} /> },
    ],
    supervision: [
      { key: 'explore', label: 'Explore', icon: <Compass size={15} /> },
      { key: 'my', label: isProfessional ? 'My Supervisees' : 'My Supervision', icon: <UserCheck size={15} /> },
    ],
  };

  const showSearch = activeTab === 'courses'
    || (activeTab === 'mentorship' && mentorshipSubTab === 'explore')
    || (activeTab === 'supervision' && supervisionSubTab === 'explore');
  const hasBottomContent = showSearch || SUB_TABS[activeTab].length > 0;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* MODULE SELECTOR — full-width top bar */}
      <div className="w-full bg-indigo-900 pt-4 px-6 lg:px-10">
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
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-indigo-300 hover:text-white hover:bg-white/10'
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
      <div className={`w-full bg-indigo-800 pt-12 ${hasBottomContent ? 'pb-0' : 'pb-8'} shadow-sm relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">

          {/* Module Title + CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                {meta.title(isProfessional)}
              </h1>
              <p className="text-indigo-100 text-[15px] font-medium max-w-xl leading-relaxed opacity-90">
                {meta.subtitle(isProfessional)}
              </p>
            </div>
            {activeTab === 'courses' && (
              <div className="flex items-center gap-3 shrink-0">
                {userRole === 'Company' && (
                  <>
                    <button
                      onClick={() => setShowRequestCourse(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      <Lightbulb size={15} />
                      Request Course
                    </button>
                    <button
                      onClick={() => setShowNominateModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/10"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      <UserPlus size={15} />
                      Nominate
                    </button>
                  </>
                )}
                {isProfessional && (
                  <button
                    onClick={() => {}}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary rounded-xl hover:bg-indigo-50 transition-colors shadow-sm"
                    style={{ fontSize: 14, fontWeight: 700 }}
                  >
                    <Sparkles size={16} />
                    Empower Talent
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Search bar */}
          {showSearch && (() => {
            const currentQuery = activeTab === 'courses' ? courseSearchQuery
              : activeTab === 'mentorship' ? mentorSearchQuery
              : supervisionSearchQuery;
            const setCurrentQuery = activeTab === 'courses' ? setCourseSearchQuery
              : activeTab === 'mentorship' ? setMentorSearchQuery
              : setSupervisionSearchQuery;
            const placeholder = activeTab === 'courses'
              ? 'Course title, provider, or specialization...'
              : 'Search by name, domain, or specialization...';
            return (
              <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                  <input
                    type="text"
                    placeholder={placeholder}
                    value={currentQuery}
                    onChange={(e) => setCurrentQuery(e.target.value)}
                    className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                  />
                  {currentQuery && (
                    <button onClick={() => setCurrentQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-sm">
                  <Search size={18} />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            );
          })()}

          {/* Sub-tabs at bottom of hero */}
          {SUB_TABS[activeTab].length > 0 && (
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
              {SUB_TABS[activeTab].map((tab) => {
                const isActive = activeTab === 'courses'
                  ? courseFilterTab === tab.key
                  : activeTab === 'mentorship'
                  ? mentorshipSubTab === tab.key
                  : activeTab === 'supervision'
                  ? supervisionSubTab === tab.key
                  : false;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      if (activeTab === 'courses') setCourseFilterTab(tab.key as any);
                      if (activeTab === 'mentorship') setMentorshipSubTab(tab.key as any);
                      if (activeTab === 'supervision') setSupervisionSubTab(tab.key as any);
                    }}
                    className={`pb-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                      isActive
                        ? 'border-white text-white opacity-100'
                        : 'border-transparent text-indigo-200 hover:text-white hover:opacity-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 relative z-20">
        {/* --- COURSES TAB: EXPLORE --- */}
        {activeTab === "courses" && courseFilterTab === 'all' && (
          <div className="animate-in slide-in-from-left-4 duration-300 flex flex-col gap-8">

            {/* ── Primary horizontal filter chips ── */}
            <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
              {PRIMARY_CHIPS.map((cat) => {
                const selected = (courseFilters[cat.filterKey] as string[]) || [];
                const count = selected.length;
                const isOpen = openDropdown === cat.key;
                return (
                  <div key={cat.key} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : cat.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border shadow-sm ${
                        count > 0
                          ? 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20'
                          : isOpen
                          ? 'bg-white text-brand-primary border-brand-primary/40 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary/40 hover:text-brand-primary hover:shadow-md'
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
                            const displayLabel = cat.key === 'durations'
                              ? (option === 'Short' ? 'Short (≤ 2 weeks)' : option === 'Medium' ? 'Medium (1–3 months)' : 'Long (3+ months)')
                              : option;
                            return (
                              <button
                                key={option}
                                onClick={() => toggleFilter(cat.filterKey, option)}
                                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                  isSelected ? 'bg-brand-primary/5 text-brand-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
                                }`}>
                                  {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                                </div>
                                {displayLabel}
                              </button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Clear All chip */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-semibold text-brand-primary hover:bg-brand-primary/[0.06] transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                  Clear All
                </button>
              )}
            </div>

            {/* Scroll target */}
            <div ref={listingsRef} className="-mt-4" />

            {/* ═══ DISCOVERY MODE ═══ */}
            {isDiscoveryMode && (
              <div className="flex flex-col gap-12">

                {/* ── Trending: Featured course (large) ── */}
                {featuredCourses.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star size={18} className="text-amber-500" />
                        Trending Courses
                      </h2>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        {featuredCourses.length} Featured
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {featuredCourses.map((course) => (
                        <div key={`featured-${course.id}`} className="h-full">
                          <CourseCard course={course} onClick={onCourseSelect} onShare={handleShareCourse} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Latest Courses ── */}
                {latestCourses.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">All Courses</h2>
                      <button
                        onClick={() => setShowAllCourses(true)}
                        className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1"
                      >
                        View All <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {latestCourses.map((course) => (
                        <div key={`latest-${course.id}`} className="h-full">
                          <CourseCard course={course} onClick={onCourseSelect} onShare={handleShareCourse} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}


              </div>
            )}

            {/* ═══ FILTERED / SEARCH / VIEW-ALL ═══ */}
            {!isDiscoveryMode && (
              <div className="flex flex-col gap-4">
                {/* Active filter tags */}
                {(activeFilterTags.length > 0 || hasSearch) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Active Filters:</span>
                    {courseSearchQuery && (
                      <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium">
                        &quot;{courseSearchQuery}&quot;
                        <button onClick={() => setCourseSearchQuery('')} className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    )}
                    {activeFilterTags.map((tag) => (
                      <span
                        key={`${tag.group}-${tag.label}`}
                        className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium"
                      >
                        {tag.label}
                        <button onClick={tag.onRemove} className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                    <button onClick={clearFilters} className="text-[12px] font-semibold text-gray-400 hover:text-brand-primary transition-colors ml-1">
                      Clear All
                    </button>
                  </div>
                )}

                {/* Back to explore */}
                <button onClick={clearFilters} className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline self-start">
                  <ArrowLeft size={16} />
                  Back to Explore Courses
                </button>

                {/* Sidebar + Results grid */}
                <div className="flex flex-col lg:flex-row gap-8">
                  <button
                    className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <SlidersHorizontal size={18} />
                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <div className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <CourseFilters filters={courseFilters} onChange={setCourseFilters} />
                  </div>

                  <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 hidden lg:block">
                        {showAllCourses && !hasSearch && !hasActiveFilters ? 'All Courses' : 'Search Results'}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 ml-auto">
                        Showing <span className="text-gray-900 font-bold">{filteredCourses.length}</span> result{filteredCourses.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {filteredCourses.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                          <div key={course.id} className="h-full">
                            <CourseCard course={course} onClick={onCourseSelect} onShare={handleShareCourse} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyStateNudge
                        module="courses"
                        onNavigate={onNavigate}
                        onClearFilters={clearFilters}
                      />
                    )}

                    {filteredCourses.length > 0 && (
                      <>
                        <LowResultsNudge
                          module="courses"
                          resultCount={filteredCourses.length}
                          onNavigate={onNavigate}
                        />
                        <div className="flex justify-center mt-8">
                          <button className="w-full md:w-auto px-8 py-3 text-sm font-medium text-gray-500 hover:text-brand-primary bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                            Load More Courses
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
        {activeTab === "courses" && courseFilterTab === "saved" && (
          <div className="flex-1 animate-in slide-in-from-left-4 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Saved Courses</h2>
              <p className="text-sm font-medium text-gray-500 ml-auto">
                <span className="text-gray-900 font-bold">{savedCourses.length}</span> saved
              </p>
            </div>

            {isCourseTabLoading ? (
              <SkeletonGrid count={6} columns={3}><CourseCardSkeleton /></SkeletonGrid>
            ) : savedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedCourses.map((course) => (
                  <div key={`saved-${course.id}`} className="h-full">
                    <CourseCard course={course} onClick={onCourseSelect} onShare={handleShareCourse} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                variant="courses"
                title="No saved courses"
                description="You haven't saved any courses yet. Browse courses and click the bookmark icon to save them."
                actionLabel="Explore Courses"
                onAction={() => setCourseFilterTab("all")}
              />
            )}
          </div>
        )}

        {/* ═══ ENROLLED TAB ═══ */}
        {activeTab === "courses" && courseFilterTab === "enrolled" && (
          <div className="flex-1 animate-in slide-in-from-left-4 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>My Enrolled Courses</p>
              <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 500 }}>
                <span className="text-gray-900" style={{ fontWeight: 700 }}>{ENROLLED_COURSES.length}</span> active
              </p>
            </div>

            {isCourseTabLoading ? (
              <SkeletonGrid count={4} columns={2}><CourseCardSkeleton /></SkeletonGrid>
            ) : ENROLLED_COURSES.length > 0 ? (
              <div className="flex flex-col gap-4">
                {ENROLLED_COURSES.map(course => (
                  <div key={`enrolled-${course.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => onCourseSelect(course.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700" style={{ fontSize: 10, fontWeight: 700 }}>ENROLLED</span>
                          <span className="text-gray-400" style={{ fontSize: 11 }}>Since {course.enrollmentDate}</span>
                        </div>
                        <p className="text-gray-900 truncate" style={{ fontSize: 15, fontWeight: 700 }}>{course.title}</p>
                        <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{course.provider.name} · {course.duration} · {course.mode}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                          </div>
                          <p className="text-purple-600" style={{ fontSize: 12, fontWeight: 700 }}>{course.progress}%</p>
                        </div>
                        {course.startDate && course.endDate && (
                          <p className="text-gray-400" style={{ fontSize: 11 }}>{course.startDate} — {course.endDate}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                variant="courses"
                title="No enrolled courses"
                description="You haven't enrolled in any courses yet. Browse courses and enroll to start learning."
                actionLabel="Explore Courses"
                onAction={() => setCourseFilterTab("all")}
              />
            )}
          </div>
        )}

        {/* ═══ COMPLETED TAB ═══ */}
        {activeTab === "courses" && courseFilterTab === "completed" && (
          <div className="flex-1 animate-in slide-in-from-left-4 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Completed Courses</p>
              <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 500 }}>
                <span className="text-gray-900" style={{ fontWeight: 700 }}>{COMPLETED_COURSES.length}</span> completed
              </p>
            </div>

            {isCourseTabLoading ? (
              <SkeletonGrid count={4} columns={2}><CourseCardSkeleton /></SkeletonGrid>
            ) : COMPLETED_COURSES.length > 0 ? (
              <div className="flex flex-col gap-4">
                {COMPLETED_COURSES.map(course => (
                  <div key={`completed-${course.id}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all cursor-pointer" onClick={() => onCourseSelect(course.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700" style={{ fontSize: 10, fontWeight: 700 }}>COMPLETED</span>
                          <span className="text-gray-400" style={{ fontSize: 11 }}>Completed {course.completionDate}</span>
                        </div>
                        <p className="text-gray-900 truncate" style={{ fontSize: 15, fontWeight: 700 }}>{course.title}</p>
                        <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{course.provider.name} · {course.duration}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {course.rating ? (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} size={14} fill={i <= course.rating! ? '#f59e0b' : 'none'} className={i <= course.rating! ? 'text-amber-400' : 'text-gray-300'} />
                            ))}
                            <p className="text-gray-500 ml-1" style={{ fontSize: 11 }}>Your rating</p>
                          </div>
                        ) : (
                          <button className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-600 hover:bg-purple-100 transition-all" style={{ fontSize: 11, fontWeight: 600 }}>
                            <Star size={12} className="inline mr-1" /> Rate Course
                          </button>
                        )}
                        {course.avgRating && (
                          <p className="text-gray-400" style={{ fontSize: 11 }}>Avg. {course.avgRating}/5 ({course.totalRatings} reviews)</p>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all"
                          style={{ fontSize: 11, fontWeight: 600 }}
                        >
                          <Download size={12} /> Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                variant="courses"
                title="No completed courses"
                description="Complete your enrolled courses to see them here and leave reviews."
                actionLabel="View Enrolled"
                onAction={() => setCourseFilterTab("enrolled")}
              />
            )}
          </div>
        )}

        {/* --- MENTORSHIP TAB CONTENT --- */}
        {activeTab === "mentorship" && (
          <MentorshipPage
            onNavigate={onNavigate}
            onMentorSelect={(mentorId) => onNavigate('MentorProfile', { mentorId })}
            userRole={userRole}
            activeSubTab={mentorshipSubTab}
            searchQuery={mentorSearchQuery}
          />
        )}

        {/* --- SUPERVISION TAB CONTENT --- */}
        {activeTab === "supervision" && (
          <SupervisionPage
            onNavigate={onNavigate}
            onSupervisorSelect={(supervisorId) => onNavigate('SupervisorProfile', { supervisorId })}
            userRole={userRole}
            activeSubTab={supervisionSubTab}
            searchQuery={supervisionSearchQuery}
          />
        )}
      </div>

      {/* Modals */}
      <RequestCourseModal isOpen={showRequestCourse} onClose={() => setShowRequestCourse(false)} />
      <NominateEmployeesModal isOpen={showNominateModal} onClose={() => setShowNominateModal(false)} courseTitle="" />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title={shareCourseTitle} subtitle="Share this course" />
    </div>
  );
}