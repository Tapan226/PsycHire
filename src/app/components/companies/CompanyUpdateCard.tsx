import React from 'react';
import { CompanyUpdate, Company } from '@/app/data/companies';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  Briefcase, FolderGit2, Calendar, BookOpen, Megaphone,
  MapPin, Banknote, ArrowRight, CheckCircle2, MoreHorizontal,
} from 'lucide-react';

interface CompanyUpdateCardProps {
  update: CompanyUpdate;
  company: Company;
  onClick: () => void;
}

const TYPE_CONFIG: Record<string, {
  icon: React.ReactNode;
  label: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  dotColor: string;
}> = {
  JOB_POST: {
    icon: <Briefcase size={13} />,
    label: 'New Job',
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-700',
    accentBorder: 'border-blue-100',
    dotColor: 'bg-blue-500',
  },
  PROJECT_POST: {
    icon: <FolderGit2 size={13} />,
    label: 'New Project',
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    accentBorder: 'border-purple-100',
    dotColor: 'bg-purple-500',
  },
  EVENT_POST: {
    icon: <Calendar size={13} />,
    label: 'Event',
    accentBg: 'bg-orange-50',
    accentText: 'text-orange-700',
    accentBorder: 'border-orange-100',
    dotColor: 'bg-orange-500',
  },
  COURSE_POST: {
    icon: <BookOpen size={13} />,
    label: 'New Course',
    accentBg: 'bg-green-50',
    accentText: 'text-green-700',
    accentBorder: 'border-green-100',
    dotColor: 'bg-green-500',
  },
  ANNOUNCEMENT: {
    icon: <Megaphone size={13} />,
    label: 'Announcement',
    accentBg: 'bg-gray-50',
    accentText: 'text-gray-600',
    accentBorder: 'border-gray-200',
    dotColor: 'bg-gray-400',
  },
};

export const CompanyUpdateCard = ({ update, company, onClick }: CompanyUpdateCardProps) => {
  const config = TYPE_CONFIG[update.type] || TYPE_CONFIG.ANNOUNCEMENT;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group overflow-hidden"
    >
      {/* Type accent bar */}
      <div className={`h-0.5 w-full ${config.dotColor}`} />

      <div className="p-5">
        {/* ── Header: Company identity + timestamp ── */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
            <ImageWithFallback src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 700 }}>
                {company.name}
              </p>
              {company.isVerified && <CheckCircle2 size={12} className="text-blue-500 shrink-0" fill="currentColor" />}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-gray-400" style={{ fontSize: 12 }}>{company.industry}</p>
              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
              <p className="text-gray-400" style={{ fontSize: 12 }}>{update.timestamp}</p>
            </div>
          </div>

          {/* Type badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border shrink-0 ${config.accentBg} ${config.accentText} ${config.accentBorder}`}
            style={{ fontSize: 11, fontWeight: 700 }}
          >
            {config.icon}
            <span>{config.label}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col gap-3">
          {/* Title */}
          <p className="text-gray-900 group-hover:text-cyan-700 transition-colors" style={{ fontSize: 16, fontWeight: 700 }}>
            {update.title}
          </p>

          {/* Content */}
          <p className="text-gray-600 line-clamp-3" style={{ fontSize: 14, lineHeight: '22px' }}>
            {update.content}
          </p>

          {/* Metadata pills */}
          {update.metadata && (update.metadata.location || update.metadata.salary || update.metadata.date) && (
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {update.metadata.location && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  <MapPin size={12} className="text-gray-400" />
                  {update.metadata.location}
                </span>
              )}
              {update.metadata.salary && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  <Banknote size={12} className="text-gray-400" />
                  {update.metadata.salary}
                </span>
              )}
              {update.metadata.date && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 border border-gray-100"
                  style={{ fontSize: 12, fontWeight: 500 }}
                >
                  <Calendar size={12} className="text-gray-400" />
                  {update.metadata.date}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Footer CTA ── */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-cyan-700 group-hover:gap-2.5 transition-all"
            style={{ fontSize: 13, fontWeight: 700 }}
          >
            <span>View Details</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </div>
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <MoreHorizontal size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
