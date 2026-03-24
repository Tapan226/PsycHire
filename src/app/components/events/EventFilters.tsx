import React, { useState } from 'react';
import {
  EventStatus, EventType, EventFormat,
  EVENT_STATUS_OPTIONS, EVENT_TYPE_OPTIONS, EVENT_FORMAT_OPTIONS,
} from '@/app/data/events';
import {
  ChevronDown, SlidersHorizontal, Tag, Wifi, Layers, DollarSign,
  MapPin, Calendar, Globe, Users, X, Zap, TrendingUp, Sparkles, Star, Flame,
} from 'lucide-react';

/* ── Filter State ── */

export interface EventFilterState {
  statuses: EventStatus[];
  types: EventType[];
  formats: EventFormat[];
  specializations: string[];
  price: 'all' | 'free' | 'paid';
  locations: string[];
  organizers: string[];
  languages: string[];
  dateRange: 'all' | 'upcoming' | 'this-week' | 'this-month';
  // Phase 2 advanced
  fillingUpSoon: boolean;
  featured: boolean;
  trending: boolean;
  sponsored: boolean;
}

export const EMPTY_EVENT_FILTERS: EventFilterState = {
  statuses: [],
  types: [],
  formats: [],
  specializations: [],
  price: 'all',
  locations: [],
  organizers: [],
  languages: [],
  dateRange: 'all',
  fillingUpSoon: false,
  featured: false,
  trending: false,
  sponsored: false,
};

/* ── Sub-components ── */

const CheckIcon = () => (
  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

function FilterCheckbox({ checked, label, onChange }: { checked: boolean; label: string; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <div className={`w-[15px] h-[15px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all duration-150 shrink-0 ${
        checked ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/25' : 'bg-white border-gray-300 group-hover:border-brand-primary/60'
      }`}>{checked && <CheckIcon />}</div>
      <span className={`text-[13px] transition-colors ${checked ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>{label}</span>
    </label>
  );
}

function CollapsibleSection({ title, icon, count, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; count?: number; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 w-full py-2 group">
        <div className="text-gray-400 group-hover:text-brand-primary transition-colors">{icon}</div>
        <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left">{title}</span>
        {count !== undefined && count > 0 && (
          <span className="min-w-[18px] h-[18px] rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center px-1">{count}</span>
        )}
        <ChevronDown size={14} className={`text-gray-300 group-hover:text-gray-500 transition-all duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[600px] opacity-100 mt-1 pb-2' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col gap-0.5 pl-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Props ── */

interface EventFiltersProps {
  filters: EventFilterState;
  availableSpecializations: string[];
  availableLocations: string[];
  availableOrganizers: string[];
  availableLanguages: string[];
  onChange: (filters: EventFilterState) => void;
}

/* ── Main Component ── */

export function EventFilters({ filters, availableSpecializations, availableLocations, availableOrganizers, availableLanguages, onChange }: EventFiltersProps) {
  const toggle = <T extends string>(key: keyof EventFilterState, value: T) => {
    const arr = (filters[key] as T[]) || [];
    const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const advancedCount = [filters.fillingUpSoon, filters.featured, filters.trending, filters.sponsored].filter(Boolean).length;

  const activeCount =
    filters.statuses.length + filters.types.length + filters.formats.length +
    filters.specializations.length + filters.locations.length +
    filters.organizers.length + filters.languages.length +
    (filters.price !== 'all' ? 1 : 0) + (filters.dateRange !== 'all' ? 1 : 0) + advancedCount;

  const activeTags: { label: string; onRemove: () => void }[] = [];
  filters.statuses.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('statuses', v) }));
  filters.types.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('types', v) }));
  filters.formats.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('formats', v) }));
  filters.specializations.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('specializations', v) }));
  filters.locations.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('locations', v) }));
  filters.organizers.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('organizers', v) }));
  filters.languages.forEach(v => activeTags.push({ label: v, onRemove: () => toggle('languages', v) }));
  if (filters.price !== 'all') activeTags.push({ label: filters.price === 'free' ? 'Free' : 'Paid', onRemove: () => onChange({ ...filters, price: 'all' }) });
  if (filters.dateRange !== 'all') activeTags.push({ label: filters.dateRange === 'upcoming' ? 'Upcoming' : filters.dateRange === 'this-week' ? 'This Week' : 'This Month', onRemove: () => onChange({ ...filters, dateRange: 'all' }) });
  if (filters.fillingUpSoon) activeTags.push({ label: 'Filling Up Soon', onRemove: () => onChange({ ...filters, fillingUpSoon: false }) });
  if (filters.featured) activeTags.push({ label: 'Featured', onRemove: () => onChange({ ...filters, featured: false }) });
  if (filters.trending) activeTags.push({ label: 'Trending', onRemove: () => onChange({ ...filters, trending: false }) });
  if (filters.sponsored) activeTags.push({ label: 'Sponsored', onRemove: () => onChange({ ...filters, sponsored: false }) });

  const clearAll = () => onChange({ ...EMPTY_EVENT_FILTERS });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-brand-primary" />
          <span className="text-[13px] font-semibold text-gray-800">Filters</span>
          {activeCount > 0 && <span className="min-w-[20px] h-[20px] rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold flex items-center justify-center px-1.5">{activeCount}</span>}
        </div>
        {activeCount > 0 && <button onClick={clearAll} className="text-[12px] font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors">Clear all</button>}
      </div>

      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50/30">
          {activeTags.map(tag => (
            <span key={tag.label} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium">
              {tag.label}
              <button onClick={tag.onRemove} className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors"><X size={10} strokeWidth={2.5} /></button>
            </span>
          ))}
        </div>
      )}

      <div className="px-4 py-2 flex flex-col divide-y divide-gray-100/80">
        {/* Quick Filters */}
        <CollapsibleSection title="Quick Filters" icon={<Flame size={15} />} count={advancedCount} defaultOpen>
          <FilterCheckbox checked={filters.fillingUpSoon} label="Filling Up Soon" onChange={() => onChange({ ...filters, fillingUpSoon: !filters.fillingUpSoon })} />
          <FilterCheckbox checked={filters.featured} label="Featured" onChange={() => onChange({ ...filters, featured: !filters.featured })} />
          <FilterCheckbox checked={filters.trending} label="Trending" onChange={() => onChange({ ...filters, trending: !filters.trending })} />
          <FilterCheckbox checked={filters.sponsored} label="Sponsored" onChange={() => onChange({ ...filters, sponsored: !filters.sponsored })} />
        </CollapsibleSection>

        {/* Status */}
        <CollapsibleSection title="Status" icon={<Zap size={15} />} count={filters.statuses.length} defaultOpen>
          {EVENT_STATUS_OPTIONS.map(s => (
            <FilterCheckbox key={s} checked={filters.statuses.includes(s)} label={s} onChange={() => toggle('statuses', s)} />
          ))}
        </CollapsibleSection>

        {/* Specialization */}
        <CollapsibleSection title="Specialization" icon={<Layers size={15} />} count={filters.specializations.length}>
          <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1">
            {availableSpecializations.map(spec => (
              <FilterCheckbox key={spec} checked={filters.specializations.includes(spec)} label={spec} onChange={() => toggle('specializations', spec)} />
            ))}
          </div>
        </CollapsibleSection>

        {/* Type */}
        <CollapsibleSection title="Event Type" icon={<Tag size={15} />} count={filters.types.length} defaultOpen>
          {EVENT_TYPE_OPTIONS.map(t => (
            <FilterCheckbox key={t} checked={filters.types.includes(t)} label={t} onChange={() => toggle('types', t)} />
          ))}
        </CollapsibleSection>

        {/* Date */}
        <CollapsibleSection title="Date" icon={<Calendar size={15} />} count={filters.dateRange !== 'all' ? 1 : 0}>
          {(['all', 'upcoming', 'this-week', 'this-month'] as const).map(d => (
            <label key={d} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input type="radio" name="eventDate" checked={filters.dateRange === d} onChange={() => onChange({ ...filters, dateRange: d })} className="hidden" />
              <div className={`w-[15px] h-[15px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150 shrink-0 ${filters.dateRange === d ? 'border-brand-primary' : 'border-gray-300 group-hover:border-brand-primary/60'}`}>
                {filters.dateRange === d && <div className="w-[7px] h-[7px] rounded-full bg-brand-primary" />}
              </div>
              <span className={`text-[13px] transition-colors ${filters.dateRange === d ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>
                {d === 'all' ? 'Any' : d === 'upcoming' ? 'Upcoming' : d === 'this-week' ? 'This Week' : 'This Month'}
              </span>
            </label>
          ))}
        </CollapsibleSection>

        {/* Format */}
        <CollapsibleSection title="Format" icon={<Wifi size={15} />} count={filters.formats.length}>
          {EVENT_FORMAT_OPTIONS.map(f => (
            <FilterCheckbox key={f} checked={filters.formats.includes(f)} label={f} onChange={() => toggle('formats', f)} />
          ))}
        </CollapsibleSection>

        {/* Price */}
        <CollapsibleSection title="Free / Paid" icon={<DollarSign size={15} />} count={filters.price !== 'all' ? 1 : 0}>
          {(['all', 'free', 'paid'] as const).map(p => (
            <label key={p} className="flex items-center gap-2.5 cursor-pointer group py-0.5">
              <input type="radio" name="eventPrice" checked={filters.price === p} onChange={() => onChange({ ...filters, price: p })} className="hidden" />
              <div className={`w-[15px] h-[15px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-150 shrink-0 ${filters.price === p ? 'border-brand-primary' : 'border-gray-300 group-hover:border-brand-primary/60'}`}>
                {filters.price === p && <div className="w-[7px] h-[7px] rounded-full bg-brand-primary" />}
              </div>
              <span className={`text-[13px] transition-colors capitalize ${filters.price === p ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'}`}>{p === 'all' ? 'Any' : p}</span>
            </label>
          ))}
        </CollapsibleSection>

        {availableLocations.length > 0 && (
          <CollapsibleSection title="Location" icon={<MapPin size={15} />} count={filters.locations.length}>
            <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto pr-1">
              {availableLocations.map(loc => <FilterCheckbox key={loc} checked={filters.locations.includes(loc)} label={loc} onChange={() => toggle('locations', loc)} />)}
            </div>
          </CollapsibleSection>
        )}

        {availableOrganizers.length > 0 && (
          <CollapsibleSection title="Organizer" icon={<Users size={15} />} count={filters.organizers.length}>
            <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto pr-1">
              {availableOrganizers.map(org => <FilterCheckbox key={org} checked={filters.organizers.includes(org)} label={org} onChange={() => toggle('organizers', org)} />)}
            </div>
          </CollapsibleSection>
        )}

        {availableLanguages.length > 0 && (
          <CollapsibleSection title="Language" icon={<Globe size={15} />} count={filters.languages.length}>
            <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto pr-1">
              {availableLanguages.map(lang => <FilterCheckbox key={lang} checked={filters.languages.includes(lang)} label={lang} onChange={() => toggle('languages', lang)} />)}
            </div>
          </CollapsibleSection>
        )}
      </div>
    </div>
  );
}
