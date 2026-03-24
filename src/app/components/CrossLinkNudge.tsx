import React from 'react';
import {
  Briefcase,
  FolderOpen,
  GraduationCap,
  DollarSign,
  Calendar,
  Users,
  Search,
  ArrowRight,
  UserCheck,
  BookOpen,
} from 'lucide-react';

/* ══════════════════════════════════════════════
   Cross-Link Nudge — shared across listing modules
   ══════════════════════════════════════════════
   Two modes:
   1. Empty state — replaces generic "no results" messaging
   2. Low-results strip — shown below listings with < 3 results
   ══════════════════════════════════════════════ */

type Module = 'jobs' | 'projects' | 'courses' | 'funding' | 'events' | 'supervision' | 'mentoring';

interface NudgeLink {
  label: string;
  page: string;
  params?: any;
  icon: React.ReactNode;
}

interface LowResultCard {
  key: string;
  label: string;
  description: string;
  page: string;
  params?: any;
  icon: React.ReactNode;
  accentBg: string;
  accentText: string;
  hoverBorder: string;
}

/* ── Config: per-module cross-links ── */

const EMPTY_NUDGES: Record<Module, NudgeLink[]> = {
  jobs: [
    { label: 'Explore Projects', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={14} /> },
    { label: 'Explore Courses', page: 'Learning', icon: <GraduationCap size={14} /> },
  ],
  projects: [
    { label: 'Explore Jobs', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={14} /> },
    { label: 'Browse Events', page: 'Events', icon: <Calendar size={14} /> },
  ],
  courses: [
    { label: 'Explore Jobs', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={14} /> },
    { label: 'Explore Projects', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={14} /> },
    { label: 'Browse Events', page: 'Events', icon: <Calendar size={14} /> },
  ],
  funding: [
    { label: 'Explore Courses', page: 'Learning', icon: <GraduationCap size={14} /> },
    { label: 'Explore Research Projects', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={14} /> },
  ],
  events: [
    { label: 'Explore Courses', page: 'Learning', icon: <GraduationCap size={14} /> },
    { label: 'Explore Projects', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={14} /> },
    { label: 'Browse Jobs', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={14} /> },
  ],
  supervision: [
    { label: 'Explore Projects', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={14} /> },
    { label: 'Explore Courses', page: 'Learning', icon: <GraduationCap size={14} /> },
    { label: 'Browse Events', page: 'Events', icon: <Calendar size={14} /> },
    { label: 'Browse Jobs', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={14} /> },
  ],
  mentoring: [
    { label: 'Explore Projects', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={14} /> },
    { label: 'Explore Courses', page: 'Learning', icon: <GraduationCap size={14} /> },
    { label: 'Browse Events', page: 'Events', icon: <Calendar size={14} /> },
    { label: 'Browse Jobs', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={14} /> },
  ],
};

const EMPTY_COPY: Record<Module, string> = {
  jobs: "We're warming things up here.",
  projects: 'Looking for other ways to grow? Explore events or full-time roles.',
  courses: 'No courses match right now. Try projects, events, or jobs instead.',
  funding: "We're warming things up here.",
  events: "No events match right now. Explore courses, projects, or jobs instead.",
  supervision: 'No supervision listings match your criteria. Explore other growth opportunities.',
  mentoring: 'No mentoring cohorts match your criteria. Explore other growth opportunities.',
};

const EMPTY_ICONS: Record<Module, { icon: React.ReactNode; bg: string; text: string }> = {
  jobs:        { icon: <Briefcase size={28} />,     bg: 'bg-blue-50',    text: 'text-[#1e40af]' },
  projects:    { icon: <FolderOpen size={28} />,    bg: 'bg-teal-50',    text: 'text-teal-600' },
  courses:     { icon: <GraduationCap size={28} />, bg: 'bg-indigo-50',  text: 'text-indigo-600' },
  funding:     { icon: <Search size={28} />,        bg: 'bg-gray-100',   text: 'text-gray-400' },
  events:      { icon: <Calendar size={28} />,      bg: 'bg-cyan-50',    text: 'text-cyan-600' },
  supervision: { icon: <UserCheck size={28} />,     bg: 'bg-cyan-50',    text: 'text-cyan-600' },
  mentoring:   { icon: <Users size={28} />,         bg: 'bg-indigo-50',  text: 'text-indigo-600' },
};

const LOW_RESULT_CARDS: Record<Module, LowResultCard[]> = {
  jobs: [
    { key: 'projects', label: 'Projects', description: 'Hands-on research & applied work', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={16} />, accentBg: 'bg-teal-50', accentText: 'text-teal-600', hoverBorder: 'hover:border-teal-200' },
    { key: 'courses', label: 'Courses', description: 'Build skills with expert-led programs', page: 'Learning', icon: <GraduationCap size={16} />, accentBg: 'bg-indigo-50', accentText: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
  ],
  projects: [
    { key: 'jobs', label: 'Jobs', description: 'Full-time & consulting roles', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={16} />, accentBg: 'bg-blue-50', accentText: 'text-[#1e40af]', hoverBorder: 'hover:border-blue-200' },
    { key: 'events', label: 'Events', description: 'Workshops, conferences & webinars', page: 'Events', icon: <Calendar size={16} />, accentBg: 'bg-cyan-50', accentText: 'text-cyan-600', hoverBorder: 'hover:border-cyan-200' },
  ],
  courses: [
    { key: 'jobs', label: 'Jobs', description: 'Apply your skills to open roles', page: 'Opportunities', params: { tab: 'jobs' }, icon: <Briefcase size={16} />, accentBg: 'bg-blue-50', accentText: 'text-[#1e40af]', hoverBorder: 'hover:border-blue-200' },
    { key: 'projects', label: 'Projects', description: 'Gain practical experience', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={16} />, accentBg: 'bg-teal-50', accentText: 'text-teal-600', hoverBorder: 'hover:border-teal-200' },
  ],
  funding: [
    { key: 'courses', label: 'Courses', description: 'Funded learning opportunities', page: 'Learning', icon: <GraduationCap size={16} />, accentBg: 'bg-indigo-50', accentText: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
    { key: 'projects', label: 'Research Projects', description: 'Contribute to funded research', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={16} />, accentBg: 'bg-teal-50', accentText: 'text-teal-600', hoverBorder: 'hover:border-teal-200' },
  ],
  events: [
    { key: 'courses', label: 'Courses', description: 'Continue learning anytime', page: 'Learning', icon: <GraduationCap size={16} />, accentBg: 'bg-indigo-50', accentText: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
    { key: 'projects', label: 'Projects', description: 'Gain hands-on experience', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={16} />, accentBg: 'bg-teal-50', accentText: 'text-teal-600', hoverBorder: 'hover:border-teal-200' },
  ],
  supervision: [
    { key: 'courses', label: 'Courses', description: 'Expert-led training programs', page: 'Learning', icon: <GraduationCap size={16} />, accentBg: 'bg-indigo-50', accentText: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
    { key: 'events', label: 'Events', description: 'Workshops & conferences', page: 'Events', icon: <Calendar size={16} />, accentBg: 'bg-cyan-50', accentText: 'text-cyan-600', hoverBorder: 'hover:border-cyan-200' },
  ],
  mentoring: [
    { key: 'courses', label: 'Courses', description: 'Expert-led training programs', page: 'Learning', icon: <GraduationCap size={16} />, accentBg: 'bg-indigo-50', accentText: 'text-indigo-600', hoverBorder: 'hover:border-indigo-200' },
    { key: 'projects', label: 'Projects', description: 'Gain hands-on experience', page: 'Opportunities', params: { tab: 'projects' }, icon: <FolderOpen size={16} />, accentBg: 'bg-teal-50', accentText: 'text-teal-600', hoverBorder: 'hover:border-teal-200' },
  ],
};

/* ═══════════════════════════════════════
   1. Empty State Nudge
   ═══════════════════════════════════════ */

interface EmptyStateNudgeProps {
  module: Module;
  onNavigate: (page: string, params?: any) => void;
  onClearFilters?: () => void;
}

export function EmptyStateNudge({ module, onNavigate, onClearFilters }: EmptyStateNudgeProps) {
  const nudges = EMPTY_NUDGES[module];
  const copy = EMPTY_COPY[module];
  const vis = EMPTY_ICONS[module];

  return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
      <div className={`w-16 h-16 ${vis.bg} rounded-full flex items-center justify-center mb-5 ${vis.text}`}>
        {vis.icon}
      </div>
      <p style={{ fontSize: '17px', fontWeight: 700 }} className="text-gray-900 mb-2">
        No results found.
      </p>
      <p style={{ fontSize: '13px', lineHeight: '1.6' }} className="text-gray-500 text-center max-w-md mb-6">
        {copy}
      </p>

      {/* Cross-link buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        {nudges.map((nudge) => (
          <button
            key={nudge.label}
            onClick={() => onNavigate(nudge.page, nudge.params)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all"
            style={{ fontSize: '13px', fontWeight: 600 }}
          >
            {nudge.icon}
            {nudge.label}
            <ArrowRight size={12} className="opacity-40" />
          </button>
        ))}
      </div>

      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="mt-5 text-[color:var(--brand-primary)] hover:underline"
          style={{ fontSize: '13px', fontWeight: 600 }}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   2. Low-Results Suggestion Strip
   ═══════════════════════════════════════ */

interface LowResultsNudgeProps {
  module: Module;
  resultCount: number;
  onNavigate: (page: string, params?: any) => void;
}

export function LowResultsNudge({ module, resultCount, onNavigate }: LowResultsNudgeProps) {
  // Only show when 1–2 results
  if (resultCount === 0 || resultCount >= 3) return null;

  const cards = LOW_RESULT_CARDS[module];

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.04em' }} className="text-gray-400 uppercase mb-4">
        You might also be interested in
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card) => (
          <button
            key={card.key}
            onClick={() => onNavigate(card.page, card.params)}
            className={`flex items-center gap-3 px-4 py-3.5 bg-gray-50/60 rounded-xl border border-gray-100 ${card.hoverBorder} hover:bg-white transition-all group text-left`}
          >
            <div className={`w-9 h-9 rounded-lg ${card.accentBg} flex items-center justify-center ${card.accentText} shrink-0 transition-colors`}>
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p style={{ fontSize: '13px', fontWeight: 600 }} className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {card.label}
              </p>
              <p style={{ fontSize: '11px', lineHeight: '1.4' }} className="text-gray-400 truncate">
                {card.description}
              </p>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}