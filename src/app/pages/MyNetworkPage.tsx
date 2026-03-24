import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import {
  Users, Building2, Calendar, Search, Bookmark, SlidersHorizontal, X,
  Star, ArrowRight, ArrowLeft, ArrowDown, ChevronDown, Check, Compass,
  Tag, Wifi, Layers, Zap, DollarSign, Plus, FileText, Clock, CheckCircle2,
  Globe, MapPin, Ticket, Lightbulb, FlaskConical, Bell, Briefcase, UserPlus,
} from 'lucide-react';
import { PersonCard } from '@/app/components/PersonCard';
import { CompanyCard } from '@/app/components/CompanyCard';
import { CompanyUpdateCard } from '@/app/components/companies/CompanyUpdateCard';
import { FollowedCompaniesList } from '@/app/components/companies/FollowedCompaniesList';
import {
  MOCK_PEOPLE,
  PEOPLE_SPECIALIZATIONS,
  PEOPLE_CITIES,
  PEOPLE_INTERESTS,
  PEOPLE_RESEARCH_TOPICS,
} from '@/app/data/people';
import {
  MOCK_COMPANIES,
  Company,
  CompanyUpdate,
  COMPANY_INDUSTRIES,
  COMPANY_LOCATIONS,
  COMPANY_SIZES,
} from '@/app/data/companies';
import {
  MOCK_EVENTS,
  EventStatus,
  EVENT_STATUS_OPTIONS, EVENT_TYPE_OPTIONS, EVENT_FORMAT_OPTIONS,
} from '@/app/data/events';
import { EventCard } from '@/app/components/events/EventCard';
import {
  EventFilters,
  EventFilterState,
  EMPTY_EVENT_FILTERS,
} from '@/app/components/events/EventFilters';
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import { EventCardSkeleton, PersonCardSkeleton, CompanyCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';
import { ShareModal } from '@/app/components/shared/ShareModal';

type Tab = 'people' | 'companies' | 'events';

const MODULE_META: Record<Tab, {
  icon: React.ReactNode;
  label: string;
  title: () => string;
  subtitle: () => string;
}> = {
  people: {
    icon: <Users size={20} />,
    label: 'People',
    title: () => 'People',
    subtitle: () => 'Discover and connect with psychologists, students, and mentors in your field.',
  },
  companies: {
    icon: <Building2 size={20} />,
    label: 'Companies',
    title: () => 'Companies & Organizations',
    subtitle: () => 'Explore clinics, hospitals, research labs, and NGOs hiring in psychology.',
  },
  events: {
    icon: <Calendar size={20} />,
    label: 'Events',
    title: () => 'Events',
    subtitle: () => 'Discover workshops, conferences, webinars, and networking events in psychology.',
  },
};

const MODULE_KEYS: Tab[] = ['people', 'companies', 'events'];

/* ── Event sub-tab types ── */
type EventSubTab = 'explore' | 'saved' | 'my-events';
type PeopleSubTab = 'discover' | 'connections';
type CompanySubTab = 'updates' | 'browse';
type PeopleDropdownKey = 'p-specializations' | 'p-cities' | 'p-interests' | 'p-research' | null;
type CompanyDropdownKey = 'c-industries' | 'c-locations' | 'c-sizes' | null;

interface PeopleFilterState {
  specializations: string[];
  cities: string[];
  interests: string[];
  researchTopics: string[];
}
const EMPTY_PEOPLE_FILTERS: PeopleFilterState = { specializations: [], cities: [], interests: [], researchTopics: [] };

interface CompanyFilterState {
  industries: string[];
  locations: string[];
  sizes: string[];
  verifiedOnly: boolean;
}
const EMPTY_COMPANY_FILTERS: CompanyFilterState = { industries: [], locations: [], sizes: [], verifiedOnly: false };

interface MyNetworkPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
  initialTab?: Tab;
}

export function MyNetworkPage({ onNavigate, userRole, initialTab = 'companies' }: MyNetworkPageProps) {
  const isProfessional = userRole === 'Professional';
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  /* ── People State ── */
  const [peopleSubTab, setPeopleSubTab] = useState<PeopleSubTab>('discover');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [peopleFilters, setPeopleFilters] = useState<PeopleFilterState>(EMPTY_PEOPLE_FILTERS);
  const [openPeopleDropdown, setOpenPeopleDropdown] = useState<PeopleDropdownKey>(null);
  const peopleDropdownRef = useRef<HTMLDivElement>(null);

  /* ── Events State ── */
  const [eventSubTab, setEventSubTab] = useState<EventSubTab>('explore');
  const [isEventTabLoading, setIsEventTabLoading] = useState(false);
  useEffect(() => {
    if (eventSubTab !== 'explore') {
      setIsEventTabLoading(true);
      const t = setTimeout(() => setIsEventTabLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [eventSubTab]);
  const [eventSearchQuery, setEventSearchQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [eventFilters, setEventFilters] = useState<EventFilterState>(EMPTY_EVENT_FILTERS);

  // ── Share modal state ──
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareEventTitle, setShareEventTitle] = useState('');
  const handleShareEvent = (eventId: string) => {
    const event = MOCK_EVENTS.find(e => e.id === eventId);
    setShareEventTitle(event?.title || 'Event');
    setShareModalOpen(true);
  };

  /* ── Company State ── */
  const [companySubTab, setCompanySubTab] = useState<CompanySubTab>('browse');
  const [companySearch, setCompanySearch] = useState('');
  const [companyFilters, setCompanyFilters] = useState<CompanyFilterState>(EMPTY_COMPANY_FILTERS);
  const [openCompanyDropdown, setOpenCompanyDropdown] = useState<CompanyDropdownKey>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  /* ── Horizontal dropdown state ── */
  type DropdownKey = 'statuses' | 'types' | 'formats' | 'specializations' | 'dates' | 'languages' | 'organizers' | null;
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  /* ── Derived data ── */
  const availableSpecializations = useMemo(() => Array.from(new Set(MOCK_EVENTS.map(e => e.specialization))).sort(), []);
  const availableLocations = useMemo(() => Array.from(new Set(MOCK_EVENTS.filter(e => e.location).map(e => e.location!))).sort(), []);
  const availableOrganizers = useMemo(() => Array.from(new Set(MOCK_EVENTS.map(e => e.host.name))).sort(), []);
  const availableLanguages = useMemo(() => Array.from(new Set(MOCK_EVENTS.flatMap(e => e.languages))).sort(), []);

  const toggleFilter = useCallback(<T extends string>(key: keyof EventFilterState, value: T) => {
    setEventFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  /* ── Derived flags ── */
  const hasActiveFilters =
    eventFilters.statuses.length > 0 ||
    eventFilters.types.length > 0 ||
    eventFilters.formats.length > 0 ||
    eventFilters.specializations.length > 0 ||
    eventFilters.locations.length > 0 ||
    eventFilters.organizers.length > 0 ||
    eventFilters.languages.length > 0 ||
    eventFilters.price !== 'all' ||
    eventFilters.dateRange !== 'all' ||
    eventFilters.fillingUpSoon ||
    eventFilters.featured ||
    eventFilters.trending ||
    eventFilters.sponsored;
  const hasSearch = !!eventSearchQuery;
  const isDiscoveryMode = !hasSearch && !hasActiveFilters && !showAllEvents;

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    if (!openDropdown && !openPeopleDropdown && !openCompanyDropdown) return;
    const handler = (e: MouseEvent) => {
      if (openDropdown && dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
      if (openPeopleDropdown && peopleDropdownRef.current && !peopleDropdownRef.current.contains(e.target as Node)) setOpenPeopleDropdown(null);
      if (openCompanyDropdown && companyDropdownRef.current && !companyDropdownRef.current.contains(e.target as Node)) setOpenCompanyDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown, openPeopleDropdown, openCompanyDropdown]);

  /* ── Scroll to listings on dropdown close ── */
  const prevOpenDropdown = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpenDropdown.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    prevOpenDropdown.current = openDropdown;
  }, [openDropdown, hasActiveFilters]);

  /* ── Filtering logic ── */
  const filteredEvents = useMemo(() => {
    // Only show public-facing events
    let result = MOCK_EVENTS.filter(e => ['Live', 'Registration Open', 'Registration Closed', 'Event Completed'].includes(e.status));

    if (eventSubTab === 'saved') {
      result = result.filter(e => e.isSaved);
    }

    // Search
    if (eventSearchQuery) {
      const q = eventSearchQuery.toLowerCase();
      result = result.filter(e =>
        e.title.toLowerCase().includes(q) ||
        e.host.name.toLowerCase().includes(q) ||
        e.specialization.toLowerCase().includes(q) ||
        e.type.toLowerCase().includes(q)
      );
    }

    // Filters (only in explore tab)
    if (eventSubTab === 'explore') {
      if (eventFilters.statuses.length > 0) result = result.filter(e => eventFilters.statuses.includes(e.status as EventStatus));
      if (eventFilters.types.length > 0) result = result.filter(e => eventFilters.types.includes(e.type));
      if (eventFilters.formats.length > 0) result = result.filter(e => eventFilters.formats.includes(e.format));
      if (eventFilters.specializations.length > 0) result = result.filter(e => eventFilters.specializations.includes(e.specialization));
      if (eventFilters.price === 'free') result = result.filter(e => e.isFree);
      if (eventFilters.price === 'paid') result = result.filter(e => !e.isFree);
      if (eventFilters.locations.length > 0) result = result.filter(e => e.location && eventFilters.locations.includes(e.location));
      if (eventFilters.organizers.length > 0) result = result.filter(e => eventFilters.organizers.includes(e.host.name));
      if (eventFilters.languages.length > 0) result = result.filter(e => e.languages.some(l => eventFilters.languages.includes(l)));
      if (eventFilters.fillingUpSoon) result = result.filter(e => e.maxAttendees && (e.maxAttendees - e.attendeesCount) < (e.maxAttendees * 0.15) && (e.maxAttendees - e.attendeesCount) > 0);
      if (eventFilters.featured) result = result.filter(e => e.isFeatured);
      if (eventFilters.trending) result = result.filter(e => e.isTrending);
      if (eventFilters.sponsored) result = result.filter(e => e.isSponsored);
    }

    // Sort: featured first
    result.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });

    return result;
  }, [eventSearchQuery, eventFilters, eventSubTab]);

  const browseableEvents = useMemo(() => MOCK_EVENTS.filter(e => ['Live', 'Registration Open'].includes(e.status)), []);
  const featuredEvents = useMemo(() => browseableEvents.filter(e => e.isFeatured), [browseableEvents]);
  const latestEvents = useMemo(() => browseableEvents.filter(e => !e.isFeatured).slice(0, 6), [browseableEvents]);
  const savedEvents = useMemo(() => MOCK_EVENTS.filter(e => e.isSaved), []);

  // My Events data
  const myRegisteredEvents = useMemo(() => MOCK_EVENTS.filter(e => e.isRegistered), []);
  const myUpcomingEvents = useMemo(() => {
    const now = new Date();
    return MOCK_EVENTS.filter(e => e.isRegistered && new Date(e.startDate) > now);
  }, []);

  const clearFilters = () => {
    setEventSearchQuery('');
    setEventFilters(EMPTY_EVENT_FILTERS);
    setShowAllEvents(false);
  };

  /* ── Active filter tags ── */
  const activeFilterTags: { label: string; group: string; onRemove: () => void }[] = [];
  eventFilters.statuses.forEach(v => activeFilterTags.push({ label: v, group: 'Status', onRemove: () => toggleFilter('statuses', v) }));
  eventFilters.types.forEach(v => activeFilterTags.push({ label: v, group: 'Type', onRemove: () => toggleFilter('types', v) }));
  eventFilters.formats.forEach(v => activeFilterTags.push({ label: v, group: 'Format', onRemove: () => toggleFilter('formats', v) }));
  eventFilters.specializations.forEach(v => activeFilterTags.push({ label: v, group: 'Specialization', onRemove: () => toggleFilter('specializations', v) }));
  eventFilters.locations.forEach(v => activeFilterTags.push({ label: v, group: 'Location', onRemove: () => toggleFilter('locations', v) }));
  eventFilters.organizers.forEach(v => activeFilterTags.push({ label: v, group: 'Organizer', onRemove: () => toggleFilter('organizers', v) }));
  eventFilters.languages.forEach(v => activeFilterTags.push({ label: v, group: 'Language', onRemove: () => toggleFilter('languages', v) }));
  if (eventFilters.price !== 'all') activeFilterTags.push({ label: eventFilters.price === 'free' ? 'Free' : 'Paid', group: 'Price', onRemove: () => setEventFilters(p => ({ ...p, price: 'all' })) });
  if (eventFilters.dateRange !== 'all') activeFilterTags.push({ label: eventFilters.dateRange === 'upcoming' ? 'Upcoming' : eventFilters.dateRange === 'this-week' ? 'This Week' : 'This Month', group: 'Date', onRemove: () => setEventFilters(p => ({ ...p, dateRange: 'all' })) });

  /* ── Primary horizontal chip configs ── */
  const PRIMARY_CHIPS: {
    key: DropdownKey & string;
    label: string;
    icon: React.ReactNode;
    options: string[];
    filterKey: keyof EventFilterState;
  }[] = [
    { key: 'statuses', label: 'Status', icon: <Zap size={14} />, options: EVENT_STATUS_OPTIONS as string[], filterKey: 'statuses' },
    { key: 'types', label: 'Type', icon: <Tag size={14} />, options: EVENT_TYPE_OPTIONS as string[], filterKey: 'types' },
    { key: 'formats', label: 'Format', icon: <Wifi size={14} />, options: EVENT_FORMAT_OPTIONS as string[], filterKey: 'formats' },
    { key: 'languages', label: 'Language', icon: <Globe size={14} />, options: availableLanguages, filterKey: 'languages' },
    { key: 'organizers', label: 'Organizer', icon: <Users size={14} />, options: availableOrganizers, filterKey: 'organizers' },
    { key: 'specializations', label: 'Specialization', icon: <Layers size={14} />, options: availableSpecializations, filterKey: 'specializations' },
  ];

  const meta = MODULE_META[activeTab];

  const EVENT_SUB_TABS: { key: EventSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'explore', label: 'Explore', icon: <Compass size={15} /> },
    { key: 'saved', label: 'Saved', icon: <Bookmark size={15} /> },
    { key: 'my-events', label: 'My Events', icon: <Ticket size={15} /> },
  ];

  const PEOPLE_SUB_TABS: { key: PeopleSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'discover', label: 'Discover', icon: <Compass size={15} /> },
    { key: 'connections', label: 'My Connections', icon: <Users size={15} /> },
  ];

  /* ── People filtering ── */
  const togglePeopleFilter = useCallback(<T extends string>(key: keyof typeof EMPTY_PEOPLE_FILTERS, value: T) => {
    setPeopleFilters(prev => {
      const arr = prev[key] as T[];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const hasPeopleFilters =
    peopleFilters.specializations.length > 0 ||
    peopleFilters.cities.length > 0 ||
    peopleFilters.interests.length > 0 ||
    peopleFilters.researchTopics.length > 0;

  const clearPeopleFilters = () => {
    setPeopleSearch('');
    setPeopleFilters(EMPTY_PEOPLE_FILTERS);
  };

  const filteredPeople = useMemo(() => {
    let result = [...MOCK_PEOPLE];
    if (peopleSubTab === 'connections') {
      result = result.filter(p => p.isConnected);
    }
    if (peopleSearch) {
      const q = peopleSearch.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.specializations.some(s => s.toLowerCase().includes(q)) ||
        p.interests.some(i => i.toLowerCase().includes(q)) ||
        p.researchTopics.some(r => r.toLowerCase().includes(q)) ||
        p.city.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q)
      );
    }
    if (peopleFilters.specializations.length > 0) {
      result = result.filter(p => p.specializations.some(s => peopleFilters.specializations.includes(s)));
    }
    if (peopleFilters.cities.length > 0) {
      result = result.filter(p => peopleFilters.cities.includes(p.city));
    }
    if (peopleFilters.interests.length > 0) {
      result = result.filter(p => p.interests.some(i => peopleFilters.interests.includes(i)));
    }
    if (peopleFilters.researchTopics.length > 0) {
      result = result.filter(p => p.researchTopics.some(r => peopleFilters.researchTopics.includes(r)));
    }
    return result;
  }, [peopleSearch, peopleFilters, peopleSubTab]);

  const connectedPeople = useMemo(() => MOCK_PEOPLE.filter(p => p.isConnected), []);

  const suggestedPeople = useMemo(() => {
    return MOCK_PEOPLE
      .filter(p => !p.isConnected && !p.isPending)
      .sort((a, b) => {
        const scoreA = (a.openToCollaboration ? 2 : 0) + (a.mutualConnections ?? 0);
        const scoreB = (b.openToCollaboration ? 2 : 0) + (b.mutualConnections ?? 0);
        return scoreB - scoreA;
      })
      .slice(0, 6);
  }, []);

  const PEOPLE_FILTER_CHIPS: {
    key: PeopleDropdownKey & string;
    label: string;
    icon: React.ReactNode;
    options: string[];
    filterKey: keyof typeof EMPTY_PEOPLE_FILTERS;
  }[] = [
    { key: 'p-specializations', label: 'Specialization', icon: <Layers size={14} />, options: PEOPLE_SPECIALIZATIONS, filterKey: 'specializations' },
    { key: 'p-cities', label: 'City', icon: <MapPin size={14} />, options: PEOPLE_CITIES, filterKey: 'cities' },
    { key: 'p-interests', label: 'Interest', icon: <Lightbulb size={14} />, options: PEOPLE_INTERESTS, filterKey: 'interests' },
    { key: 'p-research', label: 'Research Topic', icon: <FlaskConical size={14} />, options: PEOPLE_RESEARCH_TOPICS, filterKey: 'researchTopics' },
  ];

  const isPeopleDiscovery = peopleSubTab === 'discover' && !peopleSearch && !hasPeopleFilters;

  /* ── Company filtering ── */
  const toggleCompanyFilter = useCallback(<T extends string>(key: keyof Omit<CompanyFilterState, 'verifiedOnly'>, value: T) => {
    setCompanyFilters(prev => {
      const arr = prev[key] as T[];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  const hasCompanyFilters =
    companyFilters.industries.length > 0 ||
    companyFilters.locations.length > 0 ||
    companyFilters.sizes.length > 0 ||
    companyFilters.verifiedOnly;

  const clearCompanyFilters = () => {
    setCompanySearch('');
    setCompanyFilters(EMPTY_COMPANY_FILTERS);
  };

  const filteredCompanies = useMemo(() => {
    let result = [...MOCK_COMPANIES];
    if (companySearch) {
      const q = companySearch.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    if (companyFilters.industries.length > 0) result = result.filter(c => companyFilters.industries.includes(c.industry));
    if (companyFilters.locations.length > 0) result = result.filter(c => companyFilters.locations.includes(c.location));
    if (companyFilters.sizes.length > 0) result = result.filter(c => companyFilters.sizes.includes(c.size));
    if (companyFilters.verifiedOnly) result = result.filter(c => c.isVerified);
    return result;
  }, [companySearch, companyFilters]);

  const followedCompanies = useMemo(() => MOCK_COMPANIES.filter(c => c.isFollowed), []);

  const companyFeedUpdates = useMemo(() => {
    const all: { update: CompanyUpdate; company: Company }[] = [];
    followedCompanies.forEach(company => {
      company.updates.forEach(update => { all.push({ update, company }); });
    });
    return all.reverse();
  }, [followedCompanies]);

  const isCompanyDiscovery = companySubTab === 'browse' && !companySearch && !hasCompanyFilters;

  const COMPANY_SUB_TABS: { key: CompanySubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'browse', label: 'Browse', icon: <Compass size={15} /> },
    { key: 'updates', label: 'Updates', icon: <Bell size={15} /> },
  ];

  const COMPANY_FILTER_CHIPS: {
    key: CompanyDropdownKey & string;
    label: string;
    icon: React.ReactNode;
    options: string[];
    filterKey: keyof Omit<CompanyFilterState, 'verifiedOnly'>;
  }[] = [
    { key: 'c-industries', label: 'Industry', icon: <Layers size={14} />, options: COMPANY_INDUSTRIES, filterKey: 'industries' },
    { key: 'c-locations', label: 'Location', icon: <MapPin size={14} />, options: COMPANY_LOCATIONS, filterKey: 'locations' },
    { key: 'c-sizes', label: 'Size', icon: <Building2 size={14} />, options: COMPANY_SIZES, filterKey: 'sizes' },
  ];

  const showSearch = activeTab === 'events' && eventSubTab === 'explore';
  const showPeopleSearch = activeTab === 'people';
  const showCompanySearch = activeTab === 'companies' && companySubTab === 'browse';

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* MODULE SELECTOR */}
      <div className="w-full bg-cyan-900 pt-4 px-6 lg:px-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-3 gap-2">
          {MODULE_KEYS.map((key) => {
            const mod = MODULE_META[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center gap-2.5 py-3 rounded-t-xl text-[13px] font-semibold transition-all duration-200 ${
                  isActive ? 'bg-white text-cyan-900 shadow-sm' : 'text-cyan-300 hover:text-white hover:bg-white/10'
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
      <div className={`w-full bg-cyan-800 pt-12 ${activeTab === 'events' || activeTab === 'people' || activeTab === 'companies' ? 'pb-0' : 'pb-8'} shadow-sm relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">

          {/* Module Title + Host CTA */}
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">{meta.title()}</h1>
                <p className="text-cyan-100 text-[15px] font-medium max-w-xl leading-relaxed opacity-90 mt-2">{meta.subtitle()}</p>
              </div>
              {activeTab === 'events' && isProfessional && (
                <button className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-cyan-800 font-semibold text-[13px] rounded-lg hover:bg-cyan-50 transition-colors shadow-sm">
                  <Plus size={16} /> Host Event
                </button>
              )}
            </div>
          </div>

          {/* Search bar */}
          {showSearch && (
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search events by title, host, or topic..."
                  value={eventSearchQuery}
                  onChange={(e) => setEventSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                />
                {eventSearchQuery && (
                  <button onClick={() => setEventSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
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

          {/* People search bar */}
          {showPeopleSearch && (
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search people by name, specialization, or location..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                />
                {peopleSearch && (
                  <button onClick={() => setPeopleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
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

          {/* Sub-tabs: Events */}
          {activeTab === 'events' && (
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
              {EVENT_SUB_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setEventSubTab(tab.key)}
                  className={`pb-4 text-[13px] font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                    eventSubTab === tab.key
                      ? 'border-white text-white opacity-100'
                      : 'border-transparent text-cyan-200 hover:text-white hover:opacity-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* Sub-tabs: People */}
          {activeTab === 'people' && (
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
              {PEOPLE_SUB_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setPeopleSubTab(tab.key)}
                  className={`pb-4 text-[13px] font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                    peopleSubTab === tab.key
                      ? 'border-white text-white opacity-100'
                      : 'border-transparent text-cyan-200 hover:text-white hover:opacity-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.key === 'connections' && connectedPeople.length > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-white/20 text-[11px] font-bold flex items-center justify-center px-1">{connectedPeople.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Company search bar */}
          {showCompanySearch && (
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Search companies by name, industry, or location..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                />
                {companySearch && (
                  <button onClick={() => setCompanySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
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

          {/* Sub-tabs: Companies */}
          {activeTab === 'companies' && (
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
              {COMPANY_SUB_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setCompanySubTab(tab.key)}
                  className={`pb-4 text-[13px] font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                    companySubTab === tab.key
                      ? 'border-white text-white opacity-100'
                      : 'border-transparent text-cyan-200 hover:text-white hover:opacity-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.key === 'updates' && companyFeedUpdates.length > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-white/20 text-[11px] font-bold flex items-center justify-center px-1">{companyFeedUpdates.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 relative z-20">

        {/* ── PEOPLE ── */}
        {activeTab === 'people' && (
          <div className="animate-in slide-in-from-left-4 duration-300 flex flex-col gap-8">

            {/* ═══ Horizontal dropdown filter chips ═══ */}
            <div className="flex flex-wrap items-center gap-2" ref={peopleDropdownRef}>
              {PEOPLE_FILTER_CHIPS.map(chip => {
                const selected = peopleFilters[chip.filterKey] as string[];
                const count = selected.length;
                const isOpen = openPeopleDropdown === chip.key;
                return (
                  <div key={chip.key} className="relative">
                    <button
                      onClick={() => setOpenPeopleDropdown(isOpen ? null : chip.key as PeopleDropdownKey)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border shadow-sm ${
                        count > 0
                          ? 'bg-cyan-700 text-white border-cyan-700 shadow-cyan-700/20'
                          : isOpen
                          ? 'bg-white text-cyan-700 border-cyan-600/40 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-600/40 hover:text-cyan-700 hover:shadow-md'
                      }`}
                    >
                      {chip.icon}
                      {chip.label}
                      {count > 0 && (
                        <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">{count}</span>
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
                                onClick={() => togglePeopleFilter(chip.filterKey, option)}
                                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                  isSelected ? 'bg-cyan-700/5 text-cyan-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected ? 'bg-cyan-700 border-cyan-700' : 'border-gray-300'
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
              {(hasPeopleFilters || peopleSearch) && (
                <button onClick={clearPeopleFilters} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors">
                  <X size={14} strokeWidth={2.5} /> Clear All
                </button>
              )}
              <span className="text-[13px] font-medium text-gray-400 ml-auto">
                {filteredPeople.length} {filteredPeople.length === 1 ? 'person' : 'people'}
              </span>
            </div>

            {/* ═══ DISCOVER TAB — Discovery mode ═══ */}
            {isPeopleDiscovery && (
              <div className="flex flex-col gap-8">

                {/* Suggested People — horizontal scroll */}
                {suggestedPeople.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-4 rounded-full bg-cyan-500" />
                        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Suggested for You</p>
                      </div>
                      <span className="text-gray-400" style={{ fontSize: 11, fontWeight: 500 }}>{suggestedPeople.length} suggestions</span>
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 no-scrollbar">
                      {suggestedPeople.map(person => (
                        <div key={`sug-${person.id}`} className="w-[260px] shrink-0">
                          <PersonCard
                            person={person}
                            onClick={() => onNavigate('PersonProfile', { personId: person.id })}
                            onMessage={(e) => { e.stopPropagation(); onNavigate('Messages', { personId: person.id }); }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Directory grid */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full bg-gray-300" />
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Directory</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {MOCK_PEOPLE.map(person => (
                      <PersonCard
                        key={`all-${person.id}`}
                        person={person}
                        onClick={() => onNavigate('PersonProfile', { personId: person.id })}
                        onMessage={(e) => { e.stopPropagation(); onNavigate('Messages', { personId: person.id }); }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ DISCOVER TAB — Filtered results ═══ */}
            {peopleSubTab === 'discover' && !isPeopleDiscovery && (
              <div className="flex flex-col gap-5">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  {filteredPeople.length} result{filteredPeople.length !== 1 ? 's' : ''}
                </p>
                {filteredPeople.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPeople.map(person => (
                      <PersonCard
                        key={person.id}
                        person={person}
                        onClick={() => onNavigate('PersonProfile', { personId: person.id })}
                        onMessage={(e) => { e.stopPropagation(); onNavigate('Messages', { personId: person.id }); }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-5 text-cyan-600"><Users size={28} /></div>
                    <p className="text-gray-900 mb-2" style={{ fontSize: 17, fontWeight: 700 }}>No people found</p>
                    <p className="text-gray-500 text-center max-w-md mb-6" style={{ fontSize: 13 }}>Try adjusting your search or filters.</p>
                    <button onClick={clearPeopleFilters} className="text-cyan-700 font-bold hover:underline text-[13px]">Clear all filters</button>
                  </div>
                )}
              </div>
            )}

            {/* ═══ CONNECTIONS TAB ═══ */}
            {peopleSubTab === 'connections' && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">My Connections</p>
                  <span className="text-[13px] font-medium text-gray-400"><span className="text-gray-900 font-bold">{connectedPeople.length}</span> connection{connectedPeople.length !== 1 ? 's' : ''}</span>
                </div>
                {filteredPeople.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPeople.map(person => (
                      <PersonCard
                        key={person.id}
                        person={person}
                        onClick={() => onNavigate('PersonProfile', { personId: person.id })}
                        onMessage={(e) => { e.stopPropagation(); onNavigate('Messages', { personId: person.id }); }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-5 text-gray-400"><Users size={28} /></div>
                    <p className="text-gray-900 mb-2" style={{ fontSize: 17, fontWeight: 700 }}>
                      {peopleSearch || hasPeopleFilters ? 'No matching connections' : 'No connections yet'}
                    </p>
                    <p className="text-gray-500 text-center max-w-md" style={{ fontSize: 13 }}>
                      {peopleSearch || hasPeopleFilters
                        ? 'Try adjusting your search or filters.'
                        : 'Start connecting with people in the Discover tab.'}
                    </p>
                    {!peopleSearch && !hasPeopleFilters && (
                      <button onClick={() => setPeopleSubTab('discover')} className="mt-5 text-cyan-700 font-bold hover:underline text-[13px]">Discover People</button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── COMPANIES — BROWSE TAB ── */}
        {activeTab === 'companies' && companySubTab === 'browse' && (
          <div className="animate-in slide-in-from-left-4 duration-300 flex flex-col gap-8">

            {/* Horizontal dropdown filter chips */}
            <div className="flex flex-wrap items-center gap-2" ref={companyDropdownRef}>
              {COMPANY_FILTER_CHIPS.map(chip => {
                const selected = companyFilters[chip.filterKey] as string[];
                const count = selected.length;
                const isOpen = openCompanyDropdown === chip.key;
                return (
                  <div key={chip.key} className="relative">
                    <button
                      onClick={() => setOpenCompanyDropdown(isOpen ? null : chip.key as CompanyDropdownKey)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border shadow-sm ${
                        count > 0
                          ? 'bg-cyan-700 text-white border-cyan-700 shadow-cyan-700/20'
                          : isOpen
                          ? 'bg-white text-cyan-700 border-cyan-600/40 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-600/40 hover:text-cyan-700 hover:shadow-md'
                      }`}
                    >
                      {chip.icon}
                      {chip.label}
                      {count > 0 && (
                        <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">{count}</span>
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
                                onClick={() => toggleCompanyFilter(chip.filterKey, option)}
                                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                  isSelected ? 'bg-cyan-700/5 text-cyan-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected ? 'bg-cyan-700 border-cyan-700' : 'border-gray-300'
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

              {/* Verified toggle */}
              <button
                onClick={() => setCompanyFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border shadow-sm ${
                  companyFilters.verifiedOnly
                    ? 'bg-cyan-700 text-white border-cyan-700 shadow-cyan-700/20'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-600/40 hover:text-cyan-700 hover:shadow-md'
                }`}
              >
                <CheckCircle2 size={14} />
                Verified
              </button>

              {(hasCompanyFilters || companySearch) && (
                <button onClick={clearCompanyFilters} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors">
                  <X size={14} strokeWidth={2.5} /> Clear All
                </button>
              )}
              <span className="text-[13px] font-medium text-gray-400 ml-auto">
                {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'}
              </span>
            </div>

            {/* Discovery mode — full grid */}
            {isCompanyDiscovery && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-cyan-500" />
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>All Companies</p>
                  <span className="text-gray-400 ml-auto" style={{ fontSize: 12, fontWeight: 500 }}>
                    {MOCK_COMPANIES.length} companies
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {MOCK_COMPANIES.map(company => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      onClick={() => onNavigate('CompanyProfile', { companyId: company.id })}
                      onFollow={(e) => { e.stopPropagation(); }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Filtered results */}
            {!isCompanyDiscovery && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full bg-cyan-500" />
                  <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>
                    {filteredCompanies.length} result{filteredCompanies.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {filteredCompanies.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredCompanies.map(company => (
                      <CompanyCard
                        key={company.id}
                        company={company}
                        onClick={() => onNavigate('CompanyProfile', { companyId: company.id })}
                        onFollow={(e) => { e.stopPropagation(); }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center mb-5 text-cyan-400">
                      <Building2 size={28} />
                    </div>
                    <p className="text-gray-900 mb-2" style={{ fontSize: 17, fontWeight: 700 }}>No companies found</p>
                    <p className="text-gray-500 text-center max-w-md mb-6" style={{ fontSize: 13, lineHeight: '20px' }}>
                      Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                      onClick={clearCompanyFilters}
                      className="text-cyan-700 hover:underline"
                      style={{ fontSize: 13, fontWeight: 700 }}
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── COMPANIES — UPDATES TAB ── */}
        {activeTab === 'companies' && companySubTab === 'updates' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Feed */}
              <div className="lg:col-span-8 flex flex-col gap-5">
                {companyFeedUpdates.length > 0 ? (
                  <>
                    {/* Feed header */}
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full bg-cyan-500" />
                      <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Latest from your companies</p>
                      <span className="text-gray-400 ml-auto" style={{ fontSize: 12, fontWeight: 500 }}>
                        {companyFeedUpdates.length} update{companyFeedUpdates.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {companyFeedUpdates.map((item) => (
                      <CompanyUpdateCard
                        key={item.update.id}
                        update={item.update}
                        company={item.company}
                        onClick={() => onNavigate('CompanyProfile', { companyId: item.company.id })}
                      />
                    ))}
                  </>
                ) : (
                  <div className="bg-white rounded-xl border border-dashed border-gray-200 p-14 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-400 mb-5">
                      <Briefcase size={28} />
                    </div>
                    <p className="text-gray-900 mb-2" style={{ fontSize: 17, fontWeight: 700 }}>Your feed is empty</p>
                    <p className="text-gray-500 max-w-sm mb-6" style={{ fontSize: 13, lineHeight: '20px' }}>
                      Follow companies to see their latest jobs, projects, and announcements here.
                    </p>
                    <button
                      onClick={() => setCompanySubTab('browse')}
                      className="bg-cyan-700 text-white px-6 py-2.5 rounded-lg hover:bg-cyan-800 transition-colors shadow-sm flex items-center gap-2"
                      style={{ fontSize: 13, fontWeight: 700 }}
                    >
                      <Plus size={16} />
                      Discover Companies
                    </button>
                  </div>
                )}
              </div>

              {/* Sidebar: Followed list */}
              <div className="lg:col-span-4 hidden lg:block">
                <FollowedCompaniesList
                  companies={followedCompanies}
                  onNavigate={(id) => onNavigate('CompanyProfile', { companyId: id })}
                  onDiscover={() => setCompanySubTab('browse')}
                  onViewAll={() => setCompanySubTab('browse')}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* ═══ EVENTS — EXPLORE TAB ═══ */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'events' && eventSubTab === 'explore' && (
          <div className="animate-in slide-in-from-left-4 duration-300 flex flex-col gap-8">

            {/* Primary horizontal filter chips */}
            <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
              {PRIMARY_CHIPS.map((cat) => {
                const selected = (eventFilters[cat.filterKey] as string[]) || [];
                const count = selected.length;
                const isOpen = openDropdown === cat.key;
                return (
                  <div key={cat.key} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : cat.key)}
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border shadow-sm ${
                        count > 0
                          ? 'bg-cyan-700 text-white border-cyan-700 shadow-cyan-700/20'
                          : isOpen
                          ? 'bg-white text-cyan-700 border-cyan-600/40 shadow-md'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-600/40 hover:text-cyan-700 hover:shadow-md'
                      }`}
                    >
                      {cat.icon}
                      {cat.label}
                      {count > 0 && (
                        <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">{count}</span>
                      )}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                          {cat.options.map((option) => {
                            const isSelected = selected.includes(option);
                            return (
                              <button
                                key={option}
                                onClick={() => toggleFilter(cat.filterKey, option)}
                                className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                                  isSelected ? 'bg-cyan-700/5 text-cyan-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                                  isSelected ? 'bg-cyan-700 border-cyan-700' : 'border-gray-300'
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

              {/* Date range dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'dates' ? null : 'dates')}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border shadow-sm ${
                    eventFilters.dateRange !== 'all'
                      ? 'bg-cyan-700 text-white border-cyan-700 shadow-cyan-700/20'
                      : openDropdown === 'dates'
                      ? 'bg-white text-cyan-700 border-cyan-600/40 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-600/40 hover:text-cyan-700 hover:shadow-md'
                  }`}
                >
                  <Calendar size={14} />
                  {eventFilters.dateRange === 'all' ? 'Date' : eventFilters.dateRange === 'this-week' ? 'This Week' : 'This Month'}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${openDropdown === 'dates' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'dates' && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {([{ key: 'this-week', label: 'This Week' }, { key: 'this-month', label: 'This Month' }] as const).map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => { setEventFilters(p => ({ ...p, dateRange: p.dateRange === opt.key ? 'all' : opt.key })); setOpenDropdown(null); }}
                        className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                          eventFilters.dateRange === opt.key ? 'bg-cyan-700/5 text-cyan-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          eventFilters.dateRange === opt.key ? 'border-cyan-700' : 'border-gray-300'
                        }`}>
                          {eventFilters.dateRange === opt.key && <div className="w-[7px] h-[7px] rounded-full bg-cyan-700" />}
                        </div>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Free / Paid quick chip */}
              <button
                onClick={() => setEventFilters(prev => ({ ...prev, price: prev.price === 'free' ? 'all' : 'free' }))}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-semibold transition-all border shadow-sm ${
                  eventFilters.price === 'free'
                    ? 'bg-cyan-700 text-white border-cyan-700 shadow-cyan-700/20'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-cyan-600/40 hover:text-cyan-700 hover:shadow-md'
                }`}
              >
                <DollarSign size={14} />
                Free Only
              </button>

              {/* Clear All */}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-[13px] font-semibold text-cyan-700 hover:bg-cyan-50 transition-colors">
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
                {/* Featured */}
                {featuredEvents.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star size={18} className="text-amber-500" />
                        Featured Events
                      </h2>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{featuredEvents.length} Featured</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {featuredEvents.map(event => (
                        <div key={`featured-${event.id}`} className="h-full">
                          <EventCard event={event} onClick={() => onNavigate('EventDetails', { eventId: event.id })} onShare={handleShareEvent} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Events */}
                {latestEvents.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">All Events</h2>
                      <button
                        onClick={() => setShowAllEvents(true)}
                        className="text-[13px] font-bold text-cyan-700 hover:underline flex items-center gap-1"
                      >
                        View All <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {latestEvents.map(event => (
                        <div key={`latest-${event.id}`} className="h-full">
                          <EventCard event={event} onClick={() => onNavigate('EventDetails', { eventId: event.id })} onShare={handleShareEvent} />
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
                    {eventSearchQuery && (
                      <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-cyan-500/[0.07] text-cyan-700 rounded-full text-[11px] font-medium">
                        &quot;{eventSearchQuery}&quot;
                        <button onClick={() => setEventSearchQuery('')} className="w-4 h-4 rounded-full hover:bg-cyan-500/20 flex items-center justify-center transition-colors"><X size={10} strokeWidth={2.5} /></button>
                      </span>
                    )}
                    {activeFilterTags.map(tag => (
                      <span key={`${tag.group}-${tag.label}`} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-cyan-500/[0.07] text-cyan-700 rounded-full text-[11px] font-medium">
                        {tag.label}
                        <button onClick={tag.onRemove} className="w-4 h-4 rounded-full hover:bg-cyan-500/20 flex items-center justify-center transition-colors"><X size={10} strokeWidth={2.5} /></button>
                      </span>
                    ))}
                    <button onClick={clearFilters} className="text-[12px] font-semibold text-gray-400 hover:text-cyan-700 transition-colors ml-1">Clear All</button>
                  </div>
                )}

                {/* Back to explore */}
                <button onClick={clearFilters} className="inline-flex items-center gap-2 text-[13px] font-bold text-cyan-700 hover:underline self-start">
                  <ArrowLeft size={16} />
                  Back to Explore Events
                </button>

                {/* Sidebar + Results */}
                <div className="flex flex-col lg:flex-row gap-8">
                  <button
                    className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <SlidersHorizontal size={18} />
                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  <div className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <EventFilters
                      filters={eventFilters}
                      availableSpecializations={availableSpecializations}
                      availableLocations={availableLocations}
                      availableOrganizers={availableOrganizers}
                      availableLanguages={availableLanguages}
                      onChange={setEventFilters}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 hidden lg:block">
                        {showAllEvents && !hasSearch && !hasActiveFilters ? 'All Events' : 'Search Results'}
                      </h2>
                      <p className="text-[13px] font-medium text-gray-500 ml-auto">
                        Showing <span className="text-gray-900 font-bold">{filteredEvents.length}</span> event{filteredEvents.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {filteredEvents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEvents.map(event => (
                            <div key={event.id} className="h-full">
                              <EventCard event={event} onClick={() => onNavigate('EventDetails', { eventId: event.id })} onShare={handleShareEvent} />
                            </div>
                          ))}
                      </div>
                    ) : (
                      <EmptyStateNudge
                        module="events"
                        onNavigate={onNavigate}
                        onClearFilters={clearFilters}
                      />
                    )}

                    {filteredEvents.length > 0 && (
                      <>
                        <LowResultsNudge
                          module="events"
                          resultCount={filteredEvents.length}
                          onNavigate={onNavigate}
                        />
                        <div className="flex justify-center mt-8">
                          <button className="w-full md:w-auto px-8 py-3 text-[13px] font-medium text-gray-500 hover:text-cyan-700 bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                            Load More Events
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

        {/* ══════════════════════════════════════════════ */}
        {/* ═══ EVENTS — SAVED TAB ═══ */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'events' && eventSubTab === 'saved' && (
          <div className="flex-1 animate-in slide-in-from-left-4 duration-300">
            {isEventTabLoading ? (
              <SkeletonGrid count={6} columns={3}><EventCardSkeleton /></SkeletonGrid>
            ) : (<>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Saved Events</h2>
              <p className="text-[13px] font-medium text-gray-500"><span className="text-gray-900 font-bold">{savedEvents.length}</span> saved</p>
            </div>

            {savedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {savedEvents.map(event => (
                  <div key={`saved-${event.id}`} className="h-full">
                    <EventCard event={event} onClick={() => onNavigate('EventDetails', { eventId: event.id })} onShare={handleShareEvent} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400"><Bookmark size={24} /></div>
                <h3 className="text-lg font-bold text-gray-900">No saved events</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md text-[13px]">You haven't saved any events yet. Browse events and click the bookmark icon to save them.</p>
                <button onClick={() => setEventSubTab('explore')} className="mt-6 text-cyan-700 font-bold hover:underline text-[13px]">Explore Events</button>
              </div>
            )}
            </>)}
          </div>
        )}

        {/* ══════════════════════════════════════════════ */}
        {/* ═══ EVENTS — MY EVENTS TAB ═══ */}
        {/* ══════════════════════════════════════════════ */}
        {activeTab === 'events' && eventSubTab === 'my-events' && (
          <div className="animate-in slide-in-from-left-4 duration-300 flex flex-col gap-10">
            {isEventTabLoading ? (
              <SkeletonGrid count={6} columns={3}><EventCardSkeleton /></SkeletonGrid>
            ) : (<>
            {/* Events Attending */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  Events Attending
                </h2>
                <span className="text-[13px] font-medium text-gray-400">{myRegisteredEvents.length} event{myRegisteredEvents.length !== 1 ? 's' : ''}</span>
              </div>

              {myRegisteredEvents.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {myRegisteredEvents.map(event => {
                    const dateObj = new Date(event.startDate);
                    const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    return (
                      <div
                        key={event.id}
                        onClick={() => onNavigate('EventDetails', { eventId: event.id })}
                        className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-5 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex flex-col items-center justify-center shrink-0 border border-indigo-100">
                          <span className="text-[9px] font-bold uppercase text-indigo-400 leading-none">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                          <span className="text-[16px] font-bold text-indigo-700 leading-tight">{dateObj.getDate()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate">{event.title}</h3>
                          <div className="flex items-center gap-3 mt-1 text-[12px] text-gray-500">
                            <span className="flex items-center gap-1"><Clock size={11} /> {event.startTime}</span>
                            <span className="flex items-center gap-1">
                              {event.format === 'Virtual' ? <Globe size={11} /> : <MapPin size={11} />}
                              {event.format === 'Virtual' ? 'Virtual' : event.location || 'In-Person'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                            <CheckCircle2 size={10} /> Registered
                          </span>
                          <button className="text-[12px] font-semibold text-indigo-600 hover:underline">View Ticket</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                  <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400"><Calendar size={24} /></div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-1">No events yet</h3>
                  <p className="text-gray-500 text-[13px]">Browse events and register to see them here.</p>
                  <button onClick={() => setEventSubTab('explore')} className="mt-4 text-cyan-700 font-bold hover:underline text-[13px]">Browse Events</button>
                </div>
              )}
            </div>

            {/* Papers Submitted (placeholder) */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <FileText size={18} className="text-amber-500" />
                  Feedback & Reviews
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mb-4 text-amber-500"><FileText size={24} /></div>
                <h3 className="text-[15px] font-bold text-gray-900 mb-1">No reviews yet</h3>
                <p className="text-gray-500 text-[13px]">Attend events and submit feedback to see your reviews here.</p>
              </div>
            </div>
            </>)}
          </div>
        )}
      </div>
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title={shareEventTitle} subtitle="Share this event" />
    </div>
  );
}