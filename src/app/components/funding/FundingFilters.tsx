import React, { useState } from 'react';
import {
  ChevronDown,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import type { FundingType, FundingStatus, CareerStage } from '@/app/data/funding';

/* ── Types ── */

export type AmountRange = 'Under ₹25k' | '₹25k – ₹1L' | '₹1L – ₹5L' | 'Above ₹5L' | 'Full Funding';

export interface FundingFilterState {
  types: FundingType[];
  careerStages: CareerStage[];
  countries: string[];
  amountRanges: AmountRange[];
  statuses: FundingStatus[];
}

export const EMPTY_FILTERS: FundingFilterState = {
  types: [],
  careerStages: [],
  countries: [],
  amountRanges: [],
  statuses: [],
};

/* ── Constants ── */

const TYPES: FundingType[] = ['Scholarship', 'Grant', 'Fellowship'];
const CAREER_STAGES: CareerStage[] = ['Undergraduate', 'Postgraduate', 'Early Career', 'Mid Career', 'Senior'];
const COUNTRIES: string[] = ['India', 'USA', 'UK', 'International'];
const AMOUNT_RANGES: AmountRange[] = ['Under ₹25k', '₹25k – ₹1L', '₹1L – ₹5L', 'Above ₹5L', 'Full Funding'];
const STATUSES: FundingStatus[] = ['Open', 'Closing Soon', 'Closed'];

/* ── Props ── */

interface FundingFiltersProps {
  filters: FundingFilterState;
  onChange: (filters: FundingFilterState) => void;
  onClose?: () => void;
}

/* ── Collapsible Section ── */

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3.5 text-[13px] font-bold text-gray-700 hover:text-gray-900 transition-colors"
      >
        {title}
        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4 flex flex-col gap-2">{children}</div>}
    </div>
  );
}

/* ── Checkbox Item ── */

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group py-0.5">
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
          checked
            ? 'bg-brand-primary border-brand-primary'
            : 'border-gray-300 group-hover:border-gray-400'
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white fill-current">
            <path d="M10 3L4.5 8.5 2 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-[13px] ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {label}
      </span>
    </label>
  );
}

/* ── Main Component ── */

export function FundingFilters({ filters, onChange, onClose }: FundingFiltersProps) {
  const toggleValue = <T extends string>(key: keyof FundingFilterState, value: T) => {
    const arr = (filters[key] as T[]) || [];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    filters.types.length +
    filters.careerStages.length +
    filters.countries.length +
    filters.amountRanges.length +
    filters.statuses.length;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <SlidersHorizontal size={16} className="text-gray-400" />
          <span className="text-[14px] font-bold text-gray-900">Filters</span>
          {activeCount > 0 && (
            <span className="text-[11px] font-bold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={() => onChange(EMPTY_FILTERS)}
              className="text-[12px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear All
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="mt-2">
        <FilterSection title="Type">
          {TYPES.map((t) => (
            <CheckboxItem
              key={t}
              label={t}
              checked={filters.types.includes(t)}
              onChange={() => toggleValue('types', t)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Career Stage">
          {CAREER_STAGES.map((s) => (
            <CheckboxItem
              key={s}
              label={s}
              checked={filters.careerStages.includes(s)}
              onChange={() => toggleValue('careerStages', s)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Country">
          {COUNTRIES.map((c) => (
            <CheckboxItem
              key={c}
              label={c}
              checked={filters.countries.includes(c)}
              onChange={() => toggleValue('countries', c)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Amount Range">
          {AMOUNT_RANGES.map((r) => (
            <CheckboxItem
              key={r}
              label={r}
              checked={filters.amountRanges.includes(r)}
              onChange={() => toggleValue('amountRanges', r)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Deadline Status">
          {STATUSES.map((s) => (
            <CheckboxItem
              key={s}
              label={s}
              checked={filters.statuses.includes(s)}
              onChange={() => toggleValue('statuses', s)}
            />
          ))}
        </FilterSection>
      </div>
    </div>
  );
}
