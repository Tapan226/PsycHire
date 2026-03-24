import React from 'react';
import {
  MapPin,
  Clock,
  Calendar,
  Bookmark,
  Share2,
  ArrowRight,
  Globe,
  Briefcase,
  Award,
} from 'lucide-react';
import { Chip } from '@/app/components/Chip';
import { FeaturedChip } from '@/app/components/FeaturedChip';
import type { ProjectFormat, ProjectLevel, ProjectDuration, Recognition } from '@/app/components/projects/ProjectFilters';

export interface ProjectCardProps {
  id: number | string;
  title: string;
  projectType: string;
  segment: string;
  offeredByName: string;
  offeredByType: 'Individual' | 'Company';

  /* Metadata row */
  format: ProjectFormat;
  location?: string;
  duration: ProjectDuration;
  durationLabel: string;
  timeCommitment: string;
  level: ProjectLevel;

  /* Compensation row */
  isPaid: boolean;
  recognition: Recognition[];

  /* Flags */
  isFeatured?: boolean;
  isSaved?: boolean;

  /* Unused but accepted for spread compatibility */
  description?: string;

  /* Compact mode for similar sections */
  compact?: boolean;

  /* Handlers */
  onClick?: () => void;
  onSave?: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
  onRefer?: (e: React.MouseEvent) => void;
}

const FORMAT_ICON: Record<ProjectFormat, React.ReactNode> = {
  Online: <Globe size={14} className="text-gray-400" />,
  Offline: <MapPin size={14} className="text-gray-400" />,
  Hybrid: <Globe size={14} className="text-gray-400" />,
};

const LEVEL_VARIANT: Record<ProjectLevel, 'blue' | 'mint' | 'amber' | 'rose'> = {
  Beginner: 'mint',
  Intermediate: 'blue',
  Advanced: 'amber',
  Expert: 'rose',
};

export const ProjectCard = ({
  title,
  projectType,
  segment,
  offeredByName,
  offeredByType,
  format,
  location,
  duration,
  durationLabel,
  timeCommitment,
  level,
  isPaid,
  recognition,
  isFeatured = false,
  isSaved = false,
  compact = false,
  onClick,
  onSave,
  onShare,
}: ProjectCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border ${compact ? 'p-4 gap-3' : 'p-5 sm:p-7 gap-4 sm:gap-6'} flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${isFeatured ? 'ring-1 ring-brand-secondary border-brand-secondary' : 'border-gray-100 hover:border-teal-200'}
      `}
    >
      {/* ── Hover actions (top-5 right-5, size 18) ── */}
      {!compact && (
      <div
        className={`absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 z-10 transition-opacity duration-200 ${
          isSaved ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
        }`}
      >
        <button
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Share Project"
          onClick={(e) => { e.stopPropagation(); onShare?.(e); }}
        >
          <Share2 size={18} />
        </button>
        <button
          className={`p-2 rounded-full transition-colors ${
            isSaved ? 'text-brand-primary bg-gray-50' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-100'
          }`}
          title={isSaved ? 'Saved' : 'Save Project'}
          onClick={(e) => { e.stopPropagation(); onSave?.(e); }}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>
      )}

      {/* ── Header: FeaturedChip → meta → title → chips ── */}
      <div className="flex flex-col gap-3">
        {isFeatured && <FeaturedChip className="self-start" />}

        {/* Meta row: project type + segment */}
        <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500 font-medium">
          <span>{projectType}</span>
          <span className="text-gray-300">&middot;</span>
          <span>{segment}</span>
        </div>

        {/* Title */}
        <p style={{ fontSize: compact ? 15 : undefined }} className={`text-gray-900 group-hover:text-brand-primary transition-colors ${compact ? 'pr-2' : 'pr-8'}`}>
          {title}
        </p>

        {/* Offered by */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">by</span>
          <span className="font-semibold text-gray-800">{offeredByName}</span>
          {offeredByType === 'Company' && (
            <span className="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border border-blue-100">
              Org
            </span>
          )}
        </div>

        {/* Level chip */}
        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={level} variant={LEVEL_VARIANT[level]} />
          <Chip label={format} variant="slate" />
        </div>
      </div>

      {/* ── Metadata grid ── */}
      {!compact && (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          {FORMAT_ICON[format]}
          <span>{format}{location && format !== 'Online' ? ` · ${location}` : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-gray-400" />
          <span>{durationLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400" />
          <span>{timeCommitment}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase size={14} className="text-gray-400" />
          <span>{level}</span>
        </div>
      </div>
      )}

      {/* ── Compensation row ── */}
      {!compact && (
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${
            isPaid
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-gray-50 text-gray-500 border-gray-200'
          }`}
        >
          {isPaid ? 'Paid' : 'Unpaid'}
        </span>
        {recognition.map((r) => (
          <span
            key={r}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200"
          >
            <Award size={10} />
            {r}
          </span>
        ))}
      </div>
      )}

      {/* ── Footer with divider ── */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-between text-sm font-medium">
        <button
          className="px-3 py-1.5 text-brand-primary font-semibold hover:bg-brand-primary/[0.06] rounded-lg transition-colors flex items-center gap-1 group/btn"
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        >
          View Details
          <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};