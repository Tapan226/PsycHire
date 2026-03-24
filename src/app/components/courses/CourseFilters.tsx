import React, { useState } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  GraduationCap,
  Layers,
  Building2,
  Wifi,
  LayoutList,
  Clock,
  DollarSign,
  Award,
  X,
} from 'lucide-react';
import type {
  CourseType,
  CourseSpecialization,
  ProviderType,
  CourseMode,
  CourseFormat,
  CourseDuration,
  CourseFees,
  CourseOutcome,
} from '@/app/data/courses';
import {
  SPECIALIZATION_OPTIONS,
  COURSE_TYPE_OPTIONS,
  PROVIDER_TYPE_OPTIONS,
  MODE_OPTIONS,
  FORMAT_OPTIONS,
  DURATION_OPTIONS,
  FEES_OPTIONS,
  OUTCOME_OPTIONS,
} from '@/app/data/courses';

// --- Filter State ---

export interface CourseFilterState {
  courseTypes: CourseType[];
  specializations: CourseSpecialization[];
  providerTypes: ProviderType[];
  modes: CourseMode[];
  formats: CourseFormat[];
  durations: CourseDuration[];
  fees: CourseFees[];
  outcomes: CourseOutcome[];
}

export const EMPTY_COURSE_FILTERS: CourseFilterState = {
  courseTypes: [],
  specializations: [],
  providerTypes: [],
  modes: [],
  formats: [],
  durations: [],
  fees: [],
  outcomes: [],
};

// --- Props ---

interface CourseFiltersProps {
  filters: CourseFilterState;
  onChange: (filters: CourseFilterState) => void;
}

// --- Sub-components ---

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
            ? 'bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/25'
            : 'bg-white border-gray-300 group-hover:border-brand-primary/60'
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
  defaultOpen = false,
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
        <div className="text-gray-400 group-hover:text-brand-primary transition-colors">
          {icon}
        </div>
        <span className="text-[13px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors flex-1 text-left">
          {title}
        </span>
        {count !== undefined && count > 0 && (
          <span className="min-w-[18px] h-[18px] rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center px-1">
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
          open ? 'max-h-[600px] opacity-100 mt-1 pb-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-0.5 pl-6">{children}</div>
      </div>
    </div>
  );
}

// --- Main Component ---

export function CourseFilters({ filters: rawFilters, onChange }: CourseFiltersProps) {
  const filters: CourseFilterState = {
    courseTypes: rawFilters.courseTypes || [],
    specializations: rawFilters.specializations || [],
    providerTypes: rawFilters.providerTypes || [],
    modes: rawFilters.modes || [],
    formats: rawFilters.formats || [],
    durations: rawFilters.durations || [],
    fees: rawFilters.fees || [],
    outcomes: rawFilters.outcomes || [],
  };

  const toggle = <T extends string>(key: keyof CourseFilterState, value: T) => {
    const arr = (filters[key] as T[]) || [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    filters.courseTypes.length +
    filters.specializations.length +
    filters.providerTypes.length +
    filters.modes.length +
    filters.formats.length +
    filters.durations.length +
    filters.fees.length +
    filters.outcomes.length;

  // Active filter pills
  const activeTags: { label: string; onRemove: () => void }[] = [];
  filters.courseTypes.forEach((v) => activeTags.push({ label: v, onRemove: () => toggle('courseTypes', v) }));
  filters.specializations.forEach((v) => activeTags.push({ label: v, onRemove: () => toggle('specializations', v) }));
  filters.providerTypes.forEach((v) => activeTags.push({ label: v, onRemove: () => toggle('providerTypes', v) }));
  filters.modes.forEach((v) => activeTags.push({ label: v, onRemove: () => toggle('modes', v) }));
  filters.formats.forEach((v) => activeTags.push({ label: v, onRemove: () => toggle('formats', v) }));
  filters.durations.forEach((v) =>
    activeTags.push({
      label: v === 'Short' ? '≤ 2 weeks' : v === 'Medium' ? '1–3 months' : '3+ months',
      onRemove: () => toggle('durations', v),
    })
  );
  filters.fees.forEach((v) => activeTags.push({ label: v, onRemove: () => toggle('fees', v) }));
  filters.outcomes.forEach((v) => activeTags.push({ label: `→ ${v}`, onRemove: () => toggle('outcomes', v) }));

  const clearAll = () => onChange({ ...EMPTY_COURSE_FILTERS });

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-brand-primary" />
          <span className="text-sm font-semibold text-gray-800">Filters</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-[20px] rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold flex items-center justify-center px-1.5">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-[12px] font-semibold text-brand-primary hover:text-brand-primary/80 transition-colors"
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
              className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium"
            >
              {tag.label}
              <button
                onClick={tag.onRemove}
                className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors"
              >
                <X size={10} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Filter Sections */}
      <div className="px-4 py-2 flex flex-col divide-y divide-gray-100/80">
        {/* 1. Course Type */}
        <CollapsibleSection title="Course Type" icon={<GraduationCap size={15} />} count={filters.courseTypes.length} defaultOpen={true}>
          {COURSE_TYPE_OPTIONS.map((type) => (
            <FilterCheckbox key={type} checked={filters.courseTypes.includes(type)} label={type} onChange={() => toggle('courseTypes', type)} />
          ))}
        </CollapsibleSection>

        {/* 2. Specialization */}
        <CollapsibleSection title="Specialization" icon={<Layers size={15} />} count={filters.specializations.length}>
          <div className="flex flex-col gap-0.5 max-h-52 overflow-y-auto pr-1">
            {SPECIALIZATION_OPTIONS.map((spec) => (
              <FilterCheckbox key={spec} checked={filters.specializations.includes(spec)} label={spec} onChange={() => toggle('specializations', spec)} />
            ))}
          </div>
        </CollapsibleSection>

        {/* 3. Provider */}
        <CollapsibleSection title="Provider" icon={<Building2 size={15} />} count={filters.providerTypes.length}>
          <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto pr-1">
            {PROVIDER_TYPE_OPTIONS.map((pt) => (
              <FilterCheckbox key={pt} checked={filters.providerTypes.includes(pt)} label={pt} onChange={() => toggle('providerTypes', pt)} />
            ))}
          </div>
        </CollapsibleSection>

        {/* 4. Mode */}
        <CollapsibleSection title="Mode" icon={<Wifi size={15} />} count={filters.modes.length}>
          {MODE_OPTIONS.map((m) => (
            <FilterCheckbox key={m} checked={filters.modes.includes(m)} label={m} onChange={() => toggle('modes', m)} />
          ))}
        </CollapsibleSection>

        {/* 5. Format */}
        <CollapsibleSection title="Format" icon={<LayoutList size={15} />} count={filters.formats.length}>
          <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto pr-1">
            {FORMAT_OPTIONS.map((f) => (
              <FilterCheckbox key={f} checked={filters.formats.includes(f)} label={f} onChange={() => toggle('formats', f)} />
            ))}
          </div>
        </CollapsibleSection>

        {/* 6. Duration */}
        <CollapsibleSection title="Duration" icon={<Clock size={15} />} count={filters.durations.length}>
          {DURATION_OPTIONS.map((d) => (
            <FilterCheckbox key={d.value} checked={filters.durations.includes(d.value)} label={d.label} onChange={() => toggle('durations', d.value)} />
          ))}
        </CollapsibleSection>

        {/* 7. Fees */}
        <CollapsibleSection title="Fees" icon={<DollarSign size={15} />} count={filters.fees.length}>
          {FEES_OPTIONS.map((f) => (
            <FilterCheckbox key={f} checked={filters.fees.includes(f)} label={f} onChange={() => toggle('fees', f)} />
          ))}
        </CollapsibleSection>

        {/* 8. Outcome */}
        <CollapsibleSection title="Outcome" icon={<Award size={15} />} count={filters.outcomes.length}>
          {OUTCOME_OPTIONS.map((o) => (
            <FilterCheckbox key={o} checked={filters.outcomes.includes(o)} label={o} onChange={() => toggle('outcomes', o)} />
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
}