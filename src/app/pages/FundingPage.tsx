import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  X,
  Bookmark,
  CheckCircle2,
  Compass,
  ChevronDown,
  Check,
  GraduationCap,
  Award,
  Globe,
  Banknote,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  CalendarDays,
} from 'lucide-react';
import { FundingCard } from '@/app/components/funding/FundingCard';
import { FundingFilters, FundingFilterState, EMPTY_FILTERS, AmountRange } from '@/app/components/funding/FundingFilters';
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import { EmptyState as SharedEmptyState } from '@/app/components/shared/EmptyState';
import { FundingCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';
import { toastBookmarkAdded, toastBookmarkRemoved } from '@/app/components/shared/toasts';
import { ShareModal } from '@/app/components/shared/ShareModal';
import {
  FUNDING_DATA,
  FundingOpportunity,
  FundingType,
  FundingStatus,
  CareerStage,
} from '@/app/data/funding';

/* ── Browse category chip definitions ── */

const TYPES: FundingType[] = ['Scholarship', 'Grant', 'Fellowship'];
const CAREER_STAGES: CareerStage[] = ['Undergraduate', 'Postgraduate', 'Early Career', 'Mid Career', 'Senior'];
const COUNTRIES: string[] = ['India', 'USA', 'UK', 'International'];
const AMOUNT_RANGES: AmountRange[] = ['Under ₹25k', '₹25k – 1L', '₹1L – ₹5L', 'Above ₹5L', 'Full Funding'];
const DEADLINE_STATUSES: FundingStatus[] = ['Open', 'Closing Soon', 'Closed'];

type DropdownKey = 'types' | 'careerStages' | 'countries' | 'amountRanges' | 'statuses' | null;

const BROWSE_CATEGORIES: {
  key: DropdownKey & string;
  label: string;
  icon: React.ReactNode;
  options: string[];
  filterKey: keyof FundingFilterState;
}[] = [
  { key: 'types',        label: 'Type',         icon: <Award size={14} />,         options: TYPES,            filterKey: 'types' },
  { key: 'careerStages', label: 'Career Stage',  icon: <GraduationCap size={14} />, options: CAREER_STAGES,    filterKey: 'careerStages' },
  { key: 'countries',    label: 'Country',       icon: <Globe size={14} />,         options: COUNTRIES,        filterKey: 'countries' },
  { key: 'amountRanges', label: 'Amount Range',  icon: <Banknote size={14} />,      options: AMOUNT_RANGES,    filterKey: 'amountRanges' },
  { key: 'statuses',     label: 'Deadline',      icon: <Clock size={14} />,         options: DEADLINE_STATUSES, filterKey: 'statuses' },
];

/* ── Page ── */

type ActiveTab = 'browse' | 'saved' | 'applied';

interface FundingPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
}

export function FundingPage({ onNavigate, userRole }: FundingPageProps) {
  const isProfessional = userRole === 'Professional';

  // ── State ──
  const [activeTab, setActiveTab] = useState<ActiveTab>('browse');
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FundingFilterState>(EMPTY_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllResults, setShowAllResults] = useState(false);
  const [savedSet, setSavedSet] = useState<Set<string>>(() => new Set(FUNDING_DATA.filter(f => f.isSaved).map(f => f.id)));
  const [appliedSet, setAppliedSet] = useState<Set<string>>(() => new Set(FUNDING_DATA.filter(f => f.isApplied).map(f => f.id)));
  const [userStatuses, setUserStatuses] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    FUNDING_DATA.forEach(f => { if (f.userStatus) map[f.id] = f.userStatus; });
    return map;
  });

  // Dropdown browse chips
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

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

  // Scroll to listings when dropdown closes after selection
  const prevOpen = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpen.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => {
        listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    prevOpen.current = openDropdown;
  }, [openDropdown]);

  const toggleFilter = useCallback(<T extends string>(key: keyof FundingFilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const toggleSave = (id: string) => {
    setSavedSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toastBookmarkRemoved('funding');
      } else {
        next.add(id);
        toastBookmarkAdded('funding');
      }
      return next;
    });
  };

  // ── Derived ──
  const hasActiveFilters = filters.types.length > 0 || filters.careerStages.length > 0 || filters.countries.length > 0 || filters.amountRanges.length > 0 || filters.statuses.length > 0;
  const hasSearch = !!searchQuery;
  const isDiscoveryMode = activeTab === 'browse' && !hasSearch && !hasActiveFilters && !showAllResults;

  const matchesAmountRange = (amount: string, ranges: AmountRange[]): boolean => {
    if (ranges.length === 0) return true;
    const lower = amount.toLowerCase();
    if (ranges.includes('Full Funding') && (lower.includes('full') || lower.includes('tuition'))) return true;
    const numMatch = amount.match(/₹([\d,]+)/);
    if (numMatch) {
      const num = parseInt(numMatch[1].replace(/,/g, ''));
      if (ranges.includes('Under ₹25k') && num < 25000) return true;
      if (ranges.includes('₹25k – ₹1L') && num >= 25000 && num < 100000) return true;
      if (ranges.includes('₹1L – ₹5L') && num >= 100000 && num < 500000) return true;
      if (ranges.includes('Above ₹5L') && num >= 500000) return true;
    }
    if (!numMatch && !lower.includes('full') && !lower.includes('tuition')) return true;
    return false;
  };

  const filteredFunding = useMemo(() => {
    return FUNDING_DATA.filter(f => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || f.title.toLowerCase().includes(q) || f.offeredBy.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.targetAudience.toLowerCase().includes(q);
      if (!matchesSearch) return false;
      if (filters.types.length > 0 && !filters.types.includes(f.type)) return false;
      if (filters.careerStages.length > 0 && !f.careerStages.some(s => filters.careerStages.includes(s))) return false;
      if (filters.countries.length > 0 && !filters.countries.includes(f.country)) return false;
      if (filters.statuses.length > 0 && !filters.statuses.includes(f.status)) return false;
      if (!matchesAmountRange(f.amount, filters.amountRanges)) return false;
      return true;
    }).sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [searchQuery, filters]);

  const featuredFunding = useMemo(() => FUNDING_DATA.filter(f => f.isFeatured), []);
  const latestFunding = useMemo(() => FUNDING_DATA.filter(f => !f.isFeatured).slice(0, 4), []);

  const clearFilters = () => {
    setSearchQuery('');
    setFilters(EMPTY_FILTERS);
    setShowAllResults(false);
  };

  // Active filter pill tags
  const activeTags: { label: string; onRemove: () => void }[] = [];
  filters.types.forEach(t => activeTags.push({ label: t, onRemove: () => toggleFilter('types', t) }));
  filters.careerStages.forEach(s => activeTags.push({ label: s, onRemove: () => toggleFilter('careerStages', s) }));
  filters.countries.forEach(c => activeTags.push({ label: c, onRemove: () => toggleFilter('countries', c) }));
  filters.amountRanges.forEach(r => activeTags.push({ label: r, onRemove: () => toggleFilter('amountRanges', r) }));
  filters.statuses.forEach(s => activeTags.push({ label: s, onRemove: () => toggleFilter('statuses', s) }));

  // Saved / Applied data
  const savedFunding = useMemo(() => FUNDING_DATA.filter(f => savedSet.has(f.id)), [savedSet]);
  const appliedFunding = useMemo(() => FUNDING_DATA.filter(f => appliedSet.has(f.id)), [appliedSet]);

  const showSidebar = activeTab === 'browse' && !isDiscoveryMode;

  // ── Tabs ──
  const TABS: { key: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { key: 'browse',  label: 'Browse',  icon: <Compass size={15} /> },
    { key: 'saved',   label: 'Saved',   icon: <Bookmark size={15} /> },
    { key: 'applied', label: 'Applied', icon: <CheckCircle2 size={15} /> },
  ];

  const handleCardClick = (id: string) => {
    onNavigate('FundingDetail', { fundingId: id });
  };

  // Skeleton loading on tab switch
  useEffect(() => {
    if (activeTab !== 'browse') {
      setIsTabLoading(true);
      const t = setTimeout(() => setIsTabLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [activeTab]);

  // ── Share modal state ──
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareFundingTitle, setShareFundingTitle] = useState('');
  const handleShareFunding = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    setShareFundingTitle(title);
    setShareModalOpen(true);
  };

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-emerald-800 pt-12 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
              Funding & Scholarships
            </h1>
            <p className="text-emerald-100 text-[15px] font-medium max-w-xl leading-relaxed opacity-90">
              {isProfessional
                ? 'Discover grants, fellowships, and funding for your research and practice.'
                : 'Find scholarships, grants, and financial support for your education and training.'}
            </p>
          </div>

          {/* Search bar (Browse only) */}
          {activeTab === 'browse' && (
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search by title, organization, or type..."
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
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-sm">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-white text-white opacity-100'
                    : 'border-transparent text-emerald-200 hover:text-white hover:opacity-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 relative z-20">

        {/* ── BROWSE TAB ── */}
        {activeTab === 'browse' && (
          <div>
            {/* Discovery mode */}
            {isDiscoveryMode && (
              <div className="animate-in fade-in duration-300">
                {/* Browse by category chips */}
                <div className="mb-10" ref={dropdownRef}>
                  <h2 className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-4">Browse by Category</h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    {BROWSE_CATEGORIES.map((cat) => {
                      const selected = (filters[cat.filterKey] as string[]) || [];
                      const isOpen = openDropdown === cat.key;
                      return (
                        <div key={cat.key} className="relative">
                          <button
                            onClick={() => setOpenDropdown(isOpen ? null : cat.key as DropdownKey)}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold border transition-all duration-200 ${
                              selected.length > 0
                                ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                                : isOpen
                                ? 'bg-white text-gray-900 border-gray-300 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:shadow-sm'
                            }`}
                          >
                            {cat.icon}
                            {cat.label}
                            {selected.length > 0 && (
                              <span className="ml-0.5 bg-brand-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {selected.length}
                              </span>
                            )}
                            <ChevronDown size={13} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                          </button>

                          {isOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                              {cat.options.map((opt) => {
                                const isChecked = selected.includes(opt);
                                return (
                                  <button
                                    key={opt}
                                    onClick={() => toggleFilter(cat.filterKey, opt)}
                                    className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                      isChecked ? 'bg-brand-primary/5 text-brand-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                  >
                                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                      isChecked ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
                                    }`}>
                                      {isChecked && <Check size={10} className="text-white" strokeWidth={3} />}
                                    </div>
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Featured */}
                <section className="mb-10">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Star size={16} className="text-amber-500" />
                    <h2 className="text-[17px] font-bold text-gray-900">Featured Opportunities</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredFunding.map((f) => (
                      <FundingCard
                        key={f.id}
                        {...f}
                        isSaved={savedSet.has(f.id)}
                        onClick={() => handleCardClick(f.id)}
                        onSave={(e) => { e.stopPropagation(); toggleSave(f.id); }}
                        onShare={(e) => handleShareFunding(e, f.title)}
                      />
                    ))}
                  </div>
                </section>

                {/* Latest */}
                <section className="mb-10">
                  <div className="flex items-center gap-2.5 mb-5">
                    <Sparkles size={16} className="text-blue-500" />
                    <h2 className="text-[17px] font-bold text-gray-900">Latest Opportunities</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestFunding.map((f) => (
                      <FundingCard
                        key={f.id}
                        {...f}
                        isSaved={savedSet.has(f.id)}
                        onClick={() => handleCardClick(f.id)}
                        onSave={(e) => { e.stopPropagation(); toggleSave(f.id); }}
                        onShare={(e) => handleShareFunding(e, f.title)}
                      />
                    ))}
                  </div>
                </section>

                {/* View All */}
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowAllResults(true)}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-xl border border-gray-200 text-[14px] font-semibold text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm transition-all bg-white"
                  >
                    View All Funding <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Search / Filter results mode */}
            {!isDiscoveryMode && (
              <div ref={listingsRef} className="animate-in fade-in duration-300">
                <div className="flex gap-8">
                  {/* Left sidebar */}
                  {showSidebar && (
                    <aside className="hidden lg:block w-[260px] shrink-0">
                      <div className="sticky top-[90px]">
                        <FundingFilters
                          filters={filters}
                          onChange={setFilters}
                        />
                      </div>
                    </aside>
                  )}

                  {/* Main listings */}
                  <div className="flex-1 min-w-0">
                    {/* Active filter pills */}
                    {activeTags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap mb-5">
                        {activeTags.map((tag) => (
                          <span key={tag.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/10 text-brand-primary text-[12px] font-semibold rounded-lg">
                            {tag.label}
                            <button onClick={tag.onRemove} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                          </span>
                        ))}
                        <button onClick={clearFilters} className="text-[12px] font-semibold text-gray-400 hover:text-red-500 ml-2 transition-colors">
                          Clear All
                        </button>
                      </div>
                    )}

                    {/* Mobile filter toggle */}
                    <div className="lg:hidden mb-4">
                      <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-600 hover:border-gray-300 bg-white"
                      >
                        <SlidersHorizontal size={14} /> Filters
                        {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-brand-primary" />}
                      </button>
                      {showMobileFilters && (
                        <div className="mt-3">
                          <FundingFilters
                            filters={filters}
                            onChange={setFilters}
                            onClose={() => setShowMobileFilters(false)}
                          />
                        </div>
                      )}
                    </div>

                    {/* Results count */}
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-[13px] text-gray-500 font-medium">
                        {filteredFunding.length} {filteredFunding.length === 1 ? 'opportunity' : 'opportunities'} found
                      </p>
                    </div>

                    {/* Cards */}
                    {filteredFunding.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredFunding.map((f) => (
                          <FundingCard
                            key={f.id}
                            {...f}
                            isSaved={savedSet.has(f.id)}
                            onClick={() => handleCardClick(f.id)}
                            onSave={(e) => { e.stopPropagation(); toggleSave(f.id); }}
                            onShare={(e) => handleShareFunding(e, f.title)}
                          />
                        ))}
                      </div>
                    ) : (
                      <EmptyStateNudge
                        module="funding"
                        onNavigate={onNavigate}
                        onClearFilters={clearFilters}
                      />
                    )}

                    {filteredFunding.length > 0 && (
                      <LowResultsNudge
                        module="funding"
                        resultCount={filteredFunding.length}
                        onNavigate={onNavigate}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── SAVED TAB ── */}
        {activeTab === 'saved' && (
          <div className="animate-in fade-in duration-300">
            {isTabLoading ? (
              <SkeletonGrid count={4} columns={2}><FundingCardSkeleton /></SkeletonGrid>
            ) : savedFunding.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedFunding.map((f) => (
                  <FundingCard
                    key={f.id}
                    {...f}
                    isSaved={true}
                    onClick={() => handleCardClick(f.id)}
                    onSave={(e) => { e.stopPropagation(); toggleSave(f.id); }}
                    onShare={(e) => handleShareFunding(e, f.title)}
                  />
                ))}
              </div>
            ) : (
              <SharedEmptyState
                variant="funding"
                title="No saved funding"
                description="Save funding opportunities you're interested in to track them here."
                actionLabel="Browse Funding"
              />
            )}
          </div>
        )}

        {/* ── APPLIED TAB ── */}
        {activeTab === 'applied' && (
          <div className="animate-in fade-in duration-300">
            {isTabLoading ? (
              <SkeletonGrid count={4} columns={2}><FundingCardSkeleton /></SkeletonGrid>
            ) : appliedFunding.length > 0 ? (
              <div className="flex flex-col gap-4">
                {appliedFunding.map((f) => (
                  <AppliedRow
                    key={f.id}
                    funding={f}
                    status={userStatuses[f.id] || 'Applied'}
                    onStatusChange={(status) => setUserStatuses(prev => ({ ...prev, [f.id]: status }))}
                    onClick={() => handleCardClick(f.id)}
                  />
                ))}
              </div>
            ) : (
              <SharedEmptyState
                variant="applied"
                title="No funding applications"
                description="When you apply to external funding opportunities, mark them here to track your progress."
                actionLabel="Browse Funding"
              />
            )}
          </div>
        )}
      </div>

      {/* ── Share Modal ── */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={shareFundingTitle}
        subtitle="Share this funding opportunity"
      />
    </div>
  );
}

/* ─── Sub-components ─── */

function AppliedRow({
  funding,
  status,
  onStatusChange,
  onClick,
}: {
  funding: FundingOpportunity;
  status: string;
  onStatusChange: (status: string) => void;
  onClick: () => void;
}) {
  const STATUS_OPTIONS = ['Applied', 'Not Selected', 'Received'];
  const STATUS_COLORS: Record<string, string> = {
    Applied: 'bg-blue-50 text-blue-700 border-blue-200',
    'Not Selected': 'bg-gray-50 text-gray-500 border-gray-200',
    Received: 'bg-green-50 text-green-700 border-green-200',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate">{funding.title}</p>
        <p className="text-[13px] text-gray-500 font-medium mt-0.5">{funding.offeredBy}</p>
        <div className="flex items-center gap-3 mt-2 text-[12px] text-gray-400 font-medium">
          <span className="flex items-center gap-1"><Banknote size={12} /> {funding.amount}</span>
          <span className="flex items-center gap-1"><CalendarDays size={12} /> {funding.deadline}</span>
        </div>
      </div>
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        
      </div>
    </div>
  );
}