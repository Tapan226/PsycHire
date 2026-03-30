// ── Project Filter Types & Constants ──
// Types, constants, and sidebar UI component.

import React, { useState } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  GraduationCap,
  Building2,
  Wifi,
  TrendingUp,
  Clock,
  DollarSign,
  Award,
  Users,
  X,
} from 'lucide-react';

export type ProjectType =
  | 'Diagnostics/Assessment Support'
  | 'Interdisciplinary Collaboration & Co-creation'
  | 'Consulting & Training Support'
  | 'Therapy Case Work & Case Audit'
  | 'Research & Pilot Studies'
  | 'Community Outreach & Field Work'
  | 'Digital Marketing & Content Support'
  | 'Policy & Advocacy'
  | 'Others';

export const PROJECT_TYPE_OPTIONS: ProjectType[] = [
  'Diagnostics/Assessment Support',
  'Interdisciplinary Collaboration & Co-creation',
  'Consulting & Training Support',
  'Therapy Case Work & Case Audit',
  'Research & Pilot Studies',
  'Community Outreach & Field Work',
  'Digital Marketing & Content Support',
  'Policy & Advocacy',
  'Others',
];

export type ProjectSegment =
  | 'Corporates'
  | 'Schools & Universities'
  | 'Hospitals & Clinics'
  | 'Startups'
  | 'NGOs/CSRs'
  | 'Government Entities'
  | 'Research Organizations';

export const PROJECT_SEGMENT_OPTIONS: ProjectSegment[] = [
  'Corporates',
  'Schools & Universities',
  'Hospitals & Clinics',
  'Startups',
  'NGOs/CSRs',
  'Government Entities',
  'Research Organizations',
];

export type ProjectFormat = 'Online' | 'Offline' | 'Hybrid';
export const PROJECT_FORMAT_OPTIONS: ProjectFormat[] = ['Online', 'Offline', 'Hybrid'];

// Kept for backward-compat — now prefer ProjectFormat
export type ProjectMode = ProjectFormat;

export type ProjectLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export const PROJECT_LEVEL_OPTIONS: ProjectLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export type ProjectDuration = 'Short' | 'Medium' | 'Long';
export const PROJECT_DURATION_OPTIONS: ProjectDuration[] = ['Short', 'Medium', 'Long'];
export const DURATION_LABELS: Record<ProjectDuration, string> = {
  Short: '≤ 2 weeks',
  Medium: '1–3 months',
  Long: '3+ months',
};

export type ProjectPrice = 'Unpaid' | 'Paid';
export const PROJECT_PRICE_OPTIONS: ProjectPrice[] = ['Unpaid', 'Paid'];

export type Recognition = 'Certificate' | 'LOR' | 'Co-authorship';
export const RECOGNITION_OPTIONS: Recognition[] = ['Certificate', 'LOR', 'Co-authorship'];

export type OfferedBy = 'Individual' | 'Company';
export const OFFERED_BY_OPTIONS: OfferedBy[] = ['Individual', 'Company'];

// Legacy aliases
export type ProjectCompensation = ProjectPrice;
export type ProjectExperienceLevel = ProjectLevel;

export interface ProjectFilterState {
  specializations: ProjectType[];
  offeredBy: OfferedBy[];
  formats: ProjectFormat[];
  levels: ProjectLevel[];
  durations: ProjectDuration[];
  prices: ProjectPrice[];
  recognitions: Recognition[];
  segments: ProjectSegment[];
}

export const EMPTY_FILTERS: ProjectFilterState = {
  specializations: [],
  offeredBy: [],
  formats: [],
  levels: [],
  durations: [],
  prices: [],
  recognitions: [],
  segments: [],
};

// ═══════════════════════════════════════════════
// Sidebar UI Component (mirrors JobFilters)
// ═══════════════════════════════════════════════

interface ProjectFiltersPanelProps {
  filters: ProjectFilterState;
  onChange: (filters: ProjectFilterState) => void;
}

/* ── Tiny sub-components ── */

const CheckIcon = () => (
  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

function FilterCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-0.5">
      <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
      <div
        className={`w-[15px] h-[15px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all duration-150 shrink-0 ${
          checked
            ? 'bg-teal-700 border-teal-700 shadow-sm shadow-teal-700/25'
            : 'bg-white border-gray-300 group-hover:border-teal-600/60'
        }`}
      >
        {checked && <CheckIcon />}
      </div>
      <span
        className={`text-[13px] transition-colors ${
          checked ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover:text-gray-700'
        }`}
      >
        {label}
      </span>
    </label>
  );
}

function CollapsibleSection({
  title,
  icon,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ReactNode;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 w-full py-2 group"
      >
        <div className="text-gray-400 group-hover:text-teal-600 transition-colors">
          {icon}
        </div>
        <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left">
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="min-w-[18px] h-[18px] rounded-full bg-teal-700 text-white text-[10px] font-bold flex items-center justify-center px-1">
            {count}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`text-gray-300 group-hover:text-gray-500 transition-all duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? 'max-h-[500px] opacity-100 mt-1 pb-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-0.5 pl-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Main Sidebar Panel ── */

export function ProjectFiltersPanel({ filters: rawFilters, onChange }: ProjectFiltersPanelProps) {
  const filters: ProjectFilterState = {
    specializations: rawFilters.specializations || [],
    offeredBy: rawFilters.offeredBy || [],
    formats: rawFilters.formats || [],
    levels: rawFilters.levels || [],
    durations: rawFilters.durations || [],
    prices: rawFilters.prices || [],
    recognitions: rawFilters.recognitions || [],
    segments: rawFilters.segments || [],
  };

  const toggle = <T extends string>(key: keyof ProjectFilterState, value: T) => {
    const arr = (filters[key] as T[]) || [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    filters.specializations.length +
    filters.offeredBy.length +
    filters.formats.length +
    filters.levels.length +
    filters.durations.length +
    filters.prices.length +
    filters.recognitions.length +
    filters.segments.length;

  const activeTags: { label: string; onRemove: () => void }[] = [];
  filters.specializations.forEach((t) =>
    activeTags.push({ label: t, onRemove: () => toggle('specializations', t) }),
  );
  filters.segments.forEach((s) =>
    activeTags.push({ label: s, onRemove: () => toggle('segments', s) }),
  );
  filters.offeredBy.forEach((o) =>
    activeTags.push({ label: o, onRemove: () => toggle('offeredBy', o) }),
  );
  filters.formats.forEach((f) =>
    activeTags.push({ label: f, onRemove: () => toggle('formats', f) }),
  );
  filters.levels.forEach((l) =>
    activeTags.push({ label: l, onRemove: () => toggle('levels', l) }),
  );
  filters.durations.forEach((d) =>
    activeTags.push({
      label: `${d} (${DURATION_LABELS[d]})`,
      onRemove: () => toggle('durations', d),
    }),
  );
  filters.prices.forEach((p) =>
    activeTags.push({ label: p, onRemove: () => toggle('prices', p) }),
  );
  filters.recognitions.forEach((r) =>
    activeTags.push({ label: r, onRemove: () => toggle('recognitions', r) }),
  );

  const clearAll = () => onChange(EMPTY_FILTERS);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-teal-600" />
          <span className="text-sm font-semibold text-gray-800">Filters</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-[20px] rounded-full bg-teal-600/10 text-teal-700 text-[11px] font-bold flex items-center justify-center px-1.5">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Active Filter Pills */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50/30">
          {activeTags.map((tag) => (
            <span
              key={tag.label}
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-teal-600/[0.07] text-teal-700 rounded-full text-[11px] font-medium"
            >
              {tag.label}
              <button
                onClick={tag.onRemove}
                className="w-4 h-4 rounded-full hover:bg-teal-600/20 flex items-center justify-center transition-colors"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Filter Sections */}
      <div className="px-4 py-2 flex flex-col divide-y divide-gray-100/80">
        {/* Specialization (Project Type) */}
        <CollapsibleSection
          title="Specialization"
          icon={<GraduationCap size={15} />}
          count={filters.specializations.length}
        >
          {PROJECT_TYPE_OPTIONS.map((type) => (
            <FilterCheckbox
              key={type}
              checked={filters.specializations.includes(type)}
              label={type}
              onChange={() => toggle('specializations', type)}
            />
          ))}
        </CollapsibleSection>

        {/* Industry */}
        <CollapsibleSection
          title="Industry"
          icon={<Building2 size={15} />}
          count={filters.segments.length}
          defaultOpen={false}
        >
          {PROJECT_SEGMENT_OPTIONS.map((seg) => (
            <FilterCheckbox
              key={seg}
              checked={filters.segments.includes(seg)}
              label={seg}
              onChange={() => toggle('segments', seg)}
            />
          ))}
        </CollapsibleSection>

        {/* Format */}
        <CollapsibleSection
          title="Format"
          icon={<Wifi size={15} />}
          count={filters.formats.length}
          defaultOpen={false}
        >
          {PROJECT_FORMAT_OPTIONS.map((fmt) => (
            <FilterCheckbox
              key={fmt}
              checked={filters.formats.includes(fmt)}
              label={fmt}
              onChange={() => toggle('formats', fmt)}
            />
          ))}
        </CollapsibleSection>

        {/* Level */}
        <CollapsibleSection
          title="Level"
          icon={<TrendingUp size={15} />}
          count={filters.levels.length}
          defaultOpen={false}
        >
          {PROJECT_LEVEL_OPTIONS.map((lvl) => (
            <FilterCheckbox
              key={lvl}
              checked={filters.levels.includes(lvl)}
              label={lvl}
              onChange={() => toggle('levels', lvl)}
            />
          ))}
        </CollapsibleSection>

        {/* Offered By */}
        <CollapsibleSection
          title="Offered By"
          icon={<Users size={15} />}
          count={filters.offeredBy.length}
          defaultOpen={false}
        >
          {OFFERED_BY_OPTIONS.map((ob) => (
            <FilterCheckbox
              key={ob}
              checked={filters.offeredBy.includes(ob)}
              label={ob}
              onChange={() => toggle('offeredBy', ob)}
            />
          ))}
        </CollapsibleSection>

        {/* Duration */}
        <CollapsibleSection
          title="Duration"
          icon={<Clock size={15} />}
          count={filters.durations.length}
          defaultOpen={false}
        >
          {PROJECT_DURATION_OPTIONS.map((dur) => (
            <FilterCheckbox
              key={dur}
              checked={filters.durations.includes(dur)}
              label={`${dur} (${DURATION_LABELS[dur]})`}
              onChange={() => toggle('durations', dur)}
            />
          ))}
        </CollapsibleSection>

        {/* Price */}
        <CollapsibleSection
          title="Price"
          icon={<DollarSign size={15} />}
          count={filters.prices.length}
          defaultOpen={false}
        >
          {PROJECT_PRICE_OPTIONS.map((price) => (
            <FilterCheckbox
              key={price}
              checked={filters.prices.includes(price)}
              label={price}
              onChange={() => toggle('prices', price)}
            />
          ))}
        </CollapsibleSection>

        {/* Recognition */}
        <CollapsibleSection
          title="Recognition"
          icon={<Award size={15} />}
          count={filters.recognitions.length}
          defaultOpen={false}
        >
          {RECOGNITION_OPTIONS.map((rec) => (
            <FilterCheckbox
              key={rec}
              checked={filters.recognitions.includes(rec)}
              label={rec}
              onChange={() => toggle('recognitions', rec)}
            />
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
}