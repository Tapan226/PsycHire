import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  Briefcase,
  GraduationCap,
  Building2,
  BarChart3,
  MapPin,
  IndianRupee,
  X,
} from 'lucide-react';

// --- Type Definitions ---

export type JobSpecialization =
  | 'Clinical'
  | 'Counselling'
  | 'Developmental'
  | 'Social Psychology'
  | 'Industrial-Organizational'
  | 'Neuropsychology'
  | 'Sports Psychology'
  | 'Research'
  | 'Academia'
  | 'Others';

export type JobType =
  | 'Full-time'
  | 'Part-time'
  | 'Internship'
  | 'Consulting'
  | 'Remote'
  | 'Volunteer';

export type JobLevel = 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Expert';

export type JobIndustry = 'Hospital' | 'School' | 'Companies' | 'Mental Health Startup';

export type SalaryBracket =
  | 'Under ₹25k'
  | '₹25k – ₹50k'
  | '₹50k – ₹75k'
  | '₹75k – ₹1L'
  | 'Above ₹1L';

export interface JobFilterState {
  specializations: JobSpecialization[];
  types: JobType[];
  levels: JobLevel[];
  industries: JobIndustry[];
  country: string;
  state: string;
  city: string;
  salaryBrackets: SalaryBracket[];
}

interface JobFiltersProps {
  filters: JobFilterState;
  onChange: (filters: JobFilterState) => void;
}

// --- Location Data ---

const locationData: Record<string, Record<string, string[]>> = {
  India: {
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Bangalore', 'Mysore'],
    'Tamil Nadu': ['Chennai', 'Coimbatore'],
    Telangana: ['Hyderabad', 'Warangal'],
    Delhi: ['New Delhi', 'Noida', 'Gurgaon'],
    'West Bengal': ['Kolkata'],
    Gujarat: ['Ahmedabad', 'Surat'],
    Kerala: ['Kochi', 'Thiruvananthapuram'],
  },
  'United States': {
    California: ['Los Angeles', 'San Francisco', 'San Diego'],
    'New York': ['New York City', 'Buffalo'],
    Texas: ['Houston', 'Austin', 'Dallas'],
    Massachusetts: ['Boston', 'Cambridge'],
  },
  'United Kingdom': {
    England: ['London', 'Manchester', 'Birmingham'],
    Scotland: ['Edinburgh', 'Glasgow'],
  },
};

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

function FilterSelect({
  value,
  placeholder,
  icon,
  options,
  onChange,
  disabled,
}: {
  value: string;
  placeholder: string;
  icon?: React.ReactNode;
  options: string[];
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${disabled ? 'text-gray-200' : 'text-gray-400'}`}>
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none ${icon ? 'pl-8' : 'pl-3'} pr-8 py-2 bg-white border rounded-lg text-[13px] transition-all focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30 ${
          disabled
            ? 'border-gray-100 text-gray-300 cursor-not-allowed bg-gray-50/50'
            : value
            ? 'border-brand-primary/30 text-gray-900 bg-brand-primary/[0.02]'
            : 'border-gray-200 text-gray-400 hover:border-gray-300'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
          disabled ? 'text-gray-200' : 'text-gray-400'
        }`}
      />
    </div>
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
          open ? 'max-h-[500px] opacity-100 mt-1 pb-2' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-0.5 pl-6">{children}</div>
      </div>
    </div>
  );
}

// --- Main Component ---

export function JobFilters({ filters: rawFilters, onChange }: JobFiltersProps) {
  // Defensive defaults
  const filters: JobFilterState = {
    specializations: rawFilters.specializations || [],
    types: rawFilters.types || [],
    levels: rawFilters.levels || [],
    industries: rawFilters.industries || [],
    country: rawFilters.country || '',
    state: rawFilters.state || '',
    city: rawFilters.city || '',
    salaryBrackets: rawFilters.salaryBrackets || [],
  };

  const toggle = <T extends string>(key: keyof JobFilterState, value: T) => {
    const arr = (filters[key] as T[]) || [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  // Location cascading
  const countries = Object.keys(locationData);
  const states = useMemo(
    () => (filters.country ? Object.keys(locationData[filters.country] || {}) : []),
    [filters.country]
  );
  const cities = useMemo(
    () =>
      filters.country && filters.state
        ? locationData[filters.country]?.[filters.state] || []
        : [],
    [filters.country, filters.state]
  );

  const setLocation = (field: 'country' | 'state' | 'city', value: string) => {
    if (field === 'country') {
      onChange({ ...filters, country: value, state: '', city: '' });
    } else if (field === 'state') {
      onChange({ ...filters, state: value, city: '' });
    } else {
      onChange({ ...filters, city: value });
    }
  };

  const activeCount =
    filters.specializations.length +
    filters.types.length +
    filters.levels.length +
    filters.industries.length +
    filters.salaryBrackets.length +
    (filters.country ? 1 : 0) +
    (filters.state ? 1 : 0) +
    (filters.city ? 1 : 0);

  const locationCount =
    (filters.country ? 1 : 0) + (filters.state ? 1 : 0) + (filters.city ? 1 : 0);

  // Collect active filter tags for the pill display
  const activeTags: { label: string; onRemove: () => void }[] = [];
  filters.types.forEach((t) =>
    activeTags.push({ label: t, onRemove: () => toggle('types', t) })
  );
  filters.specializations.forEach((s) =>
    activeTags.push({ label: s, onRemove: () => toggle('specializations', s) })
  );
  filters.industries.forEach((i) =>
    activeTags.push({ label: i, onRemove: () => toggle('industries', i) })
  );
  filters.levels.forEach((l) =>
    activeTags.push({ label: l, onRemove: () => toggle('levels', l) })
  );
  filters.salaryBrackets.forEach((b) =>
    activeTags.push({ label: b, onRemove: () => toggle('salaryBrackets', b) })
  );
  if (filters.city) activeTags.push({ label: filters.city, onRemove: () => setLocation('city', '') });
  else if (filters.state) activeTags.push({ label: filters.state, onRemove: () => setLocation('state', '') });
  else if (filters.country) activeTags.push({ label: filters.country, onRemove: () => setLocation('country', '') });

  const clearAll = () =>
    onChange({
      specializations: [],
      types: [],
      levels: [],
      industries: [],
      country: '',
      state: '',
      city: '',
      salaryBrackets: [],
    });

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
        {/* Job Type */}
        <CollapsibleSection
          title="Job Type"
          icon={<Briefcase size={15} />}
          count={filters.types.length}
        >
          {(
            ['Full-time', 'Part-time', 'Internship', 'Consulting', 'Remote', 'Volunteer'] as JobType[]
          ).map((type) => (
            <FilterCheckbox
              key={type}
              checked={filters.types.includes(type)}
              label={type}
              onChange={() => toggle('types', type)}
            />
          ))}
        </CollapsibleSection>

        {/* Specialization */}
        <CollapsibleSection
          title="Specialization"
          icon={<GraduationCap size={15} />}
          count={filters.specializations.length}
          defaultOpen={false}
        >
          {(
            [
              'Clinical',
              'Counselling',
              'Developmental',
              'Social Psychology',
              'Industrial-Organizational',
              'Neuropsychology',
              'Sports Psychology',
              'Research',
              'Academia',
              'Others',
            ] as JobSpecialization[]
          ).map((spec) => (
            <FilterCheckbox
              key={spec}
              checked={filters.specializations.includes(spec)}
              label={spec}
              onChange={() => toggle('specializations', spec)}
            />
          ))}
        </CollapsibleSection>

        {/* Industry */}
        <CollapsibleSection
          title="Industry"
          icon={<Building2 size={15} />}
          count={filters.industries.length}
          defaultOpen={false}
        >
          {(
            ['Hospital', 'School', 'Companies', 'Mental Health Startup'] as JobIndustry[]
          ).map((industry) => (
            <FilterCheckbox
              key={industry}
              checked={filters.industries.includes(industry)}
              label={industry}
              onChange={() => toggle('industries', industry)}
            />
          ))}
        </CollapsibleSection>

        {/* Experience Level */}
        <CollapsibleSection
          title="Experience Level"
          icon={<BarChart3 size={15} />}
          count={filters.levels.length}
          defaultOpen={false}
        >
          {(['Entry Level', 'Mid Level', 'Senior Level', 'Expert'] as JobLevel[]).map((level) => (
            <FilterCheckbox
              key={level}
              checked={filters.levels.includes(level)}
              label={level}
              onChange={() => toggle('levels', level)}
            />
          ))}
        </CollapsibleSection>

        {/* Location */}
        <CollapsibleSection
          title="Location"
          icon={<MapPin size={15} />}
          count={locationCount}
          defaultOpen={false}
        >
          <div className="flex flex-col gap-2 py-0.5">
            <FilterSelect
              value={filters.country}
              placeholder="Select country"
              options={countries}
              onChange={(v) => setLocation('country', v)}
            />
            <FilterSelect
              value={filters.state}
              placeholder="Select state"
              options={states}
              onChange={(v) => setLocation('state', v)}
              disabled={!filters.country}
            />
            <FilterSelect
              value={filters.city}
              placeholder="Select city"
              options={cities}
              onChange={(v) => setLocation('city', v)}
              disabled={!filters.state}
            />
          </div>
        </CollapsibleSection>

        {/* Salary Bracket */}
        <CollapsibleSection
          title="Salary Bracket"
          icon={<IndianRupee size={15} />}
          count={filters.salaryBrackets.length}
          defaultOpen={false}
        >
          {(
            ['Under ₹25k', '₹25k – ₹50k', '₹50k – ₹75k', '₹75k – ₹1L', 'Above ₹1L'] as SalaryBracket[]
          ).map((bracket) => (
            <FilterCheckbox
              key={bracket}
              checked={filters.salaryBrackets.includes(bracket)}
              label={bracket}
              onChange={() => toggle('salaryBrackets', bracket)}
            />
          ))}
        </CollapsibleSection>
      </div>
    </div>
  );
}