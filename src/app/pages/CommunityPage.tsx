import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  circles,
  mockDiscussions,
  mockAnnouncements,
  SPECIALIZATION_OPTIONS,
  LOCATION_OPTIONS,
  CAREER_STAGE_OPTIONS,
  FOCUS_AREA_OPTIONS,
  DiscussionThread,
  CircleAnnouncement,
} from '@/app/data/community';
import { CommunityCircleCard } from '@/app/components/community/CommunityCircleCard';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import { CompanyCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';
import {
  Search,
  X,
  ChevronDown,
  Check,
  ArrowDown,
  MapPin,
  Layers,
  Target,
  GraduationCap,
  MessageSquare,
  Megaphone,
  Users,
  ArrowRight,
} from 'lucide-react';
import { toastJoinedCircle } from '@/app/components/shared/toasts';
import { EmptyState } from '@/app/components/shared/EmptyState';

/* ─── Filter state ─── */

interface CircleFilterState {
  specializations: string[];
  locations: string[];
  careerStages: string[];
  focusAreas: string[];
}

const EMPTY_FILTERS: CircleFilterState = {
  specializations: [],
  locations: [],
  careerStages: [],
  focusAreas: [],
};

type DropdownKey = 'specializations' | 'locations' | 'careerStages' | 'focusAreas' | null;

/* ─── Props ─── */

interface CommunityPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
  embedded?: boolean;
  subTab?: 'my' | 'explore';
  onSubTabChange?: (tab: 'my' | 'explore') => void;
  /** External search forwarded from parent hub hero bar */
  externalSearchQuery?: string;
  onExternalSearchChange?: (q: string) => void;
}

export function CommunityPage({
  onNavigate,
  userRole,
  embedded,
  subTab: extSubTab,
  onSubTabChange: extSetSubTab,
  externalSearchQuery,
  onExternalSearchChange,
}: CommunityPageProps) {
  /* ── State ── */
  const [intSubTab, setIntSubTab] = useState<'my' | 'explore'>('my');
  const activeTab = extSubTab !== undefined ? extSubTab : intSubTab;
  const setActiveTab = extSetSubTab || setIntSubTab;

  const [localSearch, setLocalSearch] = useState('');
  // Use external search when embedded, local otherwise
  const exploreSearch = embedded ? (externalSearchQuery ?? '') : localSearch;
  const setExploreSearch = embedded ? (onExternalSearchChange ?? setLocalSearch) : setLocalSearch;
  const [filters, setFilters] = useState<CircleFilterState>(EMPTY_FILTERS);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [showAllCircles, setShowAllCircles] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  /* ── Toggle filter ── */
  const toggleFilter = useCallback(<T extends string>(key: keyof CircleFilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  /* ── Derived ── */
  const hasActiveFilters = (Object.values(filters) as string[][]).some(arr => arr.length > 0);
  const hasSearch = !!exploreSearch;
  const isDiscoveryMode = activeTab === 'explore' && !hasSearch && !hasActiveFilters && !showAllCircles;

  /* ── Close dropdown on outside click ── */
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

  /* ── Scroll to listings on dropdown close with filters ── */
  const prevOpen = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpen.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    prevOpen.current = openDropdown;
  }, [openDropdown, hasActiveFilters]);

  /* ── Skeleton loading on tab switch ── */
  useEffect(() => {
    setIsTabLoading(true);
    const t = setTimeout(() => setIsTabLoading(false), 600);
    return () => clearTimeout(t);
  }, [activeTab]);

  /* ── Circle data ── */
  const myCircles = useMemo(() => circles.filter(c => c.isJoined), []);
  const featuredCircles = useMemo(() => circles.filter(c => c.memberCount >= 800), []);

  const filteredCircles = useMemo(() => {
    return circles.filter(c => {
      const q = exploreSearch.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.specialization.toLowerCase().includes(q);
      if (!matchesSearch) return false;

      if (filters.specializations.length > 0 && !filters.specializations.includes(c.specialization)) return false;
      if (filters.locations.length > 0 && !filters.locations.includes(c.location)) return false;
      if (filters.careerStages.length > 0 && !filters.careerStages.includes(c.careerStage)) return false;
      if (filters.focusAreas.length > 0 && !filters.focusAreas.includes(c.focusArea)) return false;

      return true;
    });
  }, [exploreSearch, filters]);

  /* ── Feed data (aggregate updates from joined circles) ── */
  const joinedCircleIds = useMemo(() => new Set(myCircles.map(c => c.id)), [myCircles]);

  const feedItems = useMemo(() => {
    const discussions: { type: 'discussion'; data: DiscussionThread; circleName: string }[] = mockDiscussions
      .filter(d => joinedCircleIds.has(d.circleId))
      .map(d => ({
        type: 'discussion' as const,
        data: d,
        circleName: circles.find(c => c.id === d.circleId)?.name || '',
      }));

    const announcements: { type: 'announcement'; data: CircleAnnouncement; circleName: string }[] = mockAnnouncements
      .filter(a => joinedCircleIds.has(a.circleId))
      .map(a => ({
        type: 'announcement' as const,
        data: a,
        circleName: circles.find(c => c.id === a.circleId)?.name || '',
      }));

    return [...announcements, ...discussions];
  }, [joinedCircleIds]);

  const clearFilters = () => {
    setExploreSearch('');
    setFilters(EMPTY_FILTERS);
    setShowAllCircles(false);
  };

  /* ── Active filter tags ── */
  const activeFilterTags: { label: string; onRemove: () => void }[] = [];
  filters.specializations.forEach(s => activeFilterTags.push({ label: s, onRemove: () => toggleFilter('specializations', s) }));
  filters.locations.forEach(l => activeFilterTags.push({ label: l, onRemove: () => toggleFilter('locations', l) }));
  filters.careerStages.forEach(c => activeFilterTags.push({ label: c, onRemove: () => toggleFilter('careerStages', c) }));
  filters.focusAreas.forEach(f => activeFilterTags.push({ label: f, onRemove: () => toggleFilter('focusAreas', f) }));

  /* ── Primary filter chips config ── */
  const PRIMARY_CHIPS: {
    key: DropdownKey & string;
    label: string;
    icon: React.ReactNode;
    options: readonly string[];
    filterKey: keyof CircleFilterState;
  }[] = [
    { key: 'specializations', label: 'Specialization', icon: <Layers size={14} />, options: SPECIALIZATION_OPTIONS, filterKey: 'specializations' },
    { key: 'locations', label: 'Location', icon: <MapPin size={14} />, options: LOCATION_OPTIONS, filterKey: 'locations' },
    { key: 'careerStages', label: 'Career Stage', icon: <GraduationCap size={14} />, options: CAREER_STAGE_OPTIONS, filterKey: 'careerStages' },
    { key: 'focusAreas', label: 'Focus Area', icon: <Target size={14} />, options: FOCUS_AREA_OPTIONS, filterKey: 'focusAreas' },
  ];

  const displayCircles = (isDiscoveryMode && !showAllCircles) ? featuredCircles : filteredCircles;
  const visibleCircles = showAllCircles ? displayCircles : displayCircles.slice(0, 6);

  const handleJoin = (id: string, e?: React.MouseEvent) => {
    const circle = circles.find(c => c.id === id);
    toastJoinedCircle(circle?.name);
  };

  return (
    <div className={`${embedded ? 'w-full' : 'flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in'}`}>
      <div className={embedded ? 'w-full' : 'max-w-[1440px] mx-auto px-6 lg:px-10 w-full py-10 pb-14'}>

        {/* ═══ MY CIRCLES TAB ═══ */}
        {activeTab === 'my' && (
          isTabLoading ? (
            <SkeletonGrid count={6} columns={3}><CompanyCardSkeleton /></SkeletonGrid>
          ) : (
            <MyCirclesContent
              myCircles={myCircles}
              feedItems={feedItems}
              onNavigate={onNavigate}
            />
          )
        )}

        {/* ═══ EXPLORE TAB ═══ */}
        {activeTab === 'explore' && (
          <>
            {/* Filter chips */}
            <div className="flex flex-col gap-4 mb-8">
              <div ref={dropdownRef} className="relative flex items-center gap-2 flex-wrap">
                {PRIMARY_CHIPS.map(chip => {
                  const selected = (filters[chip.filterKey] as string[]);
                  const isOpen = openDropdown === chip.key;
                  const count = selected.length;

                  return (
                    <div key={chip.key} className="relative">
                      <button
                        onClick={() => setOpenDropdown(isOpen ? null : chip.key as DropdownKey)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border shadow-sm ${
                          count > 0
                            ? 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20'
                            : isOpen
                            ? 'bg-white text-brand-primary border-brand-primary/40 shadow-md'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary/40 hover:text-brand-primary hover:shadow-md'
                        }`}
                      >
                        {chip.icon}
                        {chip.label}
                        {count > 0 && (
                          <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">
                            {count}
                          </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                            {chip.options.map(option => {
                              const isSelected = selected.includes(option);
                              return (
                                <button
                                  key={option}
                                  onClick={() => toggleFilter(chip.filterKey, option)}
                                  className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                    isSelected ? 'bg-brand-primary/5 text-brand-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                    isSelected ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
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

                {/* Inline search — only when NOT embedded (hero provides search when embedded) */}
                {!embedded && (
                  <div className="relative ml-auto group shrink-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={14} />
                    <input
                      type="text"
                      placeholder="Search circles..."
                      value={exploreSearch}
                      onChange={(e) => setExploreSearch(e.target.value)}
                      className="w-52 pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 focus:w-64 transition-all"
                    />
                    {exploreSearch && (
                      <button
                        onClick={() => setExploreSearch('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Scroll target */}
            <div ref={listingsRef} className="-mt-4" />

            {/* Active filter tags */}
            {activeFilterTags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-6 mt-4">
                {activeFilterTags.map((tag, i) => (
                  <span
                    key={`${tag.label}-${i}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary/5 text-brand-primary rounded-full text-[12px] font-semibold border border-brand-primary/15"
                  >
                    {tag.label}
                    <button onClick={tag.onRemove} className="hover:text-red-500 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Results header */}
            {!isDiscoveryMode && (
              <div className="flex items-center justify-between mb-6 scroll-mt-6">
                <p className="text-sm text-gray-500 font-medium">
                  {filteredCircles.length} circle{filteredCircles.length !== 1 ? 's' : ''} found
                </p>
              </div>
            )}

            {/* Section label for discovery */}
            {isDiscoveryMode && (
              <div className="flex items-center justify-between mb-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  Popular Circles
                </p>
              </div>
            )}

            {/* Circle cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {visibleCircles.map(circle => (
                <CommunityCircleCard
                  key={circle.id}
                  circle={circle}
                  onClick={(id) => onNavigate('CommunityCircle', { circleId: id })}
                  onJoin={(id) => handleJoin(id)}
                />
              ))}
            </div>

            {/* Empty state */}
            {visibleCircles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <Search size={28} />
                </div>
                <p className="text-[17px] font-bold text-gray-900 mb-2">No circles found</p>
                <p className="text-sm text-gray-500 max-w-sm">
                  Try adjusting your filters or search to find circles.
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm font-semibold text-[color:var(--color-brand-primary)] hover:underline"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Show more */}
            {!showAllCircles && displayCircles.length > 6 && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setShowAllCircles(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <ArrowDown size={14} />
                  View All Circles ({displayCircles.length})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MY CIRCLES CONTENT (Feed + Sidebar)
   ═══════════════════════════════════════ */

import type { CommunityCircle } from '@/app/data/community';

function MyCirclesContent({
  myCircles,
  feedItems,
  onNavigate,
}: {
  myCircles: CommunityCircle[];
  feedItems: { type: 'discussion' | 'announcement'; data: DiscussionThread | CircleAnnouncement; circleName: string }[];
  onNavigate: (page: string, params?: any) => void;
}) {
  if (myCircles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
          <Users size={28} />
        </div>
        <p className="text-[17px] font-bold text-gray-900 mb-2">No circles yet</p>
        <p className="text-sm text-gray-500 max-w-sm">
          Explore and join circles to see updates from your communities here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
      {/* Left — Feed */}
      <div className="flex flex-col gap-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          Recent Updates
        </p>

        {feedItems.length > 0 ? (
          feedItems.map(item => (
            item.type === 'discussion'
              ? <FeedDiscussionCard key={item.data.id} thread={item.data as DiscussionThread} circleName={item.circleName} onNavigate={onNavigate} />
              : <FeedAnnouncementCard key={item.data.id} announcement={item.data as CircleAnnouncement} circleName={item.circleName} onNavigate={onNavigate} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-[15px] font-bold text-gray-900 mb-1">No recent updates</p>
            <p className="text-sm text-gray-500">Activity from your circles will appear here.</p>
          </div>
        )}
      </div>

      {/* Right — Compact circle list */}
      <aside className="flex flex-col gap-4">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          My Circles ({myCircles.length})
        </p>

        {myCircles.map(circle => (
          <button
            key={circle.id}
            onClick={() => onNavigate('CommunityCircle', { circleId: circle.id })}
            className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3.5 hover:shadow-md hover:border-purple-200 transition-all text-left group"
          >
            <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              <ImageWithFallback
                src={circle.bannerUrl}
                alt={circle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-bold text-gray-900 truncate group-hover:text-[color:var(--color-brand-primary)] transition-colors" style={{ lineHeight: '1.3' }}>
                {circle.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] text-gray-400 font-medium flex items-center gap-1">
                  <Users size={11} />
                  {circle.memberCount.toLocaleString()}
                </span>
                <Chip label={circle.category} variant="purple" />
              </div>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-[color:var(--color-brand-primary)] shrink-0 transition-colors" />
          </button>
        ))}
      </aside>
    </div>
  );
}

/* ─── Feed: Discussion Card ─── */

function FeedDiscussionCard({
  thread,
  circleName,
  onNavigate,
}: {
  thread: DiscussionThread;
  circleName: string;
  onNavigate: (page: string, params?: any) => void;
}) {
  const TAG_VARIANT: Record<string, 'mint' | 'blue' | 'amber' | 'purple' | 'rose'> = {
    'Case Discussion': 'mint',
    'Tools': 'blue',
    'Ethical Dilemma': 'amber',
    'Publication': 'purple',
    'Q&A': 'rose',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-50/60 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
          {thread.author.avatarUrl ? (
            <ImageWithFallback src={thread.author.avatarUrl} alt={thread.author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-200">
              {thread.author.name[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{thread.author.name}</span>
            <span className="text-gray-300 text-[10px]">·</span>
            <button
              onClick={() => onNavigate('CommunityCircle', { circleId: thread.circleId })}
              className="text-[12px] font-semibold text-purple-600 hover:underline"
            >
              {circleName}
            </button>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">{thread.timestamp}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Chip label={thread.tag} variant={TAG_VARIANT[thread.tag] || 'slate'} />
        </div>
        <p className="text-[15px] font-bold text-gray-900" style={{ lineHeight: '1.35' }}>
          {thread.title}
        </p>
        <p className="text-[14px] text-gray-600 line-clamp-2" style={{ lineHeight: '1.6' }}>
          {thread.content}
        </p>
      </div>

      {/* Actions */}
      <div className="px-5 pb-3.5">
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
            <MessageSquare size={14} />
            {thread.comments.length > 0 ? `${thread.comments.length}` : '0'}
          </span>
          <div className="flex-1" />
          <button
            onClick={() => onNavigate('CommunityCircle', { circleId: thread.circleId })}
            className="text-[12px] font-semibold text-[color:var(--color-brand-primary)] hover:underline flex items-center gap-1"
          >
            View in Circle <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Feed: Announcement Card ─── */

function FeedAnnouncementCard({
  announcement,
  circleName,
  onNavigate,
}: {
  announcement: CircleAnnouncement;
  circleName: string;
  onNavigate: (page: string, params?: any) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-[color:var(--color-brand-primary)]/15 shadow-sm overflow-hidden">
      <div className="h-1 bg-[color:var(--color-brand-primary)]" />
      <div className="p-5 flex flex-col gap-2.5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
            {announcement.author.avatarUrl ? (
              <ImageWithFallback src={announcement.author.avatarUrl} alt={announcement.author.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-200">
                {announcement.author.name[0]}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{announcement.author.name}</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-semibold">
                <Megaphone size={10} /> Announcement
              </span>
              <span className="text-gray-300 text-[10px]">·</span>
              <button
                onClick={() => onNavigate('CommunityCircle', { circleId: announcement.circleId })}
                className="text-[12px] font-semibold text-purple-600 hover:underline"
              >
                {circleName}
              </button>
            </div>
            <span className="text-[11px] text-gray-400 font-medium">{announcement.timestamp}</span>
          </div>
        </div>

        <p className="text-[15px] font-bold text-gray-900" style={{ lineHeight: '1.35' }}>
          {announcement.title}
        </p>
        <p className="text-[14px] text-gray-600 line-clamp-2" style={{ lineHeight: '1.6' }}>
          {announcement.content}
        </p>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <div className="flex-1" />
          <button
            onClick={() => onNavigate('CommunityCircle', { circleId: announcement.circleId })}
            className="text-[12px] font-semibold text-[color:var(--color-brand-primary)] hover:underline flex items-center gap-1"
          >
            View in Circle <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}