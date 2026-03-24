import React from 'react';
import { MapPin, Briefcase, CheckCircle2, UserPlus, Check, Star, Building2, Users, ArrowUpRight } from 'lucide-react';
import { Company } from '@/app/data/companies';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
  onFollow: (e: React.MouseEvent) => void;
}

export function CompanyCard({ company, onClick, onFollow }: CompanyCardProps) {
  const openings = company.stats.activeJobs + company.stats.activeProjects;

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-cyan-200/60 transition-all duration-200 cursor-pointer group relative flex flex-col h-full overflow-hidden"
    >
      {/* Accent top bar */}
      <div className="h-1 w-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-teal-400 opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Logo + Identity */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100 shadow-sm">
            <ImageWithFallback src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className="text-gray-900 group-hover:text-cyan-700 transition-colors truncate"
                style={{ fontSize: 15, fontWeight: 700 }}
              >
                {company.name}
              </p>
              {company.isVerified && <CheckCircle2 size={13} className="text-blue-500 shrink-0" fill="currentColor" />}
            </div>
            <p className="text-gray-500 truncate mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>
              {company.industry}
            </p>
          </div>
          {/* Arrow indicator */}
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 group-hover:text-cyan-600 group-hover:bg-cyan-50 transition-all shrink-0">
            <ArrowUpRight size={14} />
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-gray-500 line-clamp-2" style={{ fontSize: 12, lineHeight: '18px' }}>
          {company.description}
        </p>

        {/* Location + Size row */}
        <div className="flex items-center gap-3" style={{ fontSize: 12 }}>
          <span className="inline-flex items-center gap-1.5 text-gray-500">
            <MapPin size={12} className="text-gray-400" />
            {company.location}
          </span>
          {company.size && (
            <>
              <span className="text-gray-200">|</span>
              <span className="inline-flex items-center gap-1.5 text-gray-500">
                <Building2 size={12} className="text-gray-400" />
                {company.size}
              </span>
            </>
          )}
        </div>

        {/* Stat pills row */}
        <div className="flex items-center gap-2 flex-wrap">
          {company.rating > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              <Star size={10} className="fill-amber-400 text-amber-400" />
              {company.rating}
              <span className="text-amber-500/70" style={{ fontSize: 10 }}>({company.reviews})</span>
            </span>
          )}
          {openings > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              <Briefcase size={10} />
              {openings} opening{openings !== 1 ? 's' : ''}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 text-gray-400 ml-auto"
            style={{ fontSize: 11, fontWeight: 500 }}
          >
            <Users size={10} />
            {company.stats.followers.toLocaleString()}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 -mx-5" />

        {/* Action row */}
        <div className="flex items-center gap-2 mt-auto" onClick={(e) => e.stopPropagation()}>
          {company.isFollowed ? (
            <button
              onClick={onFollow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <Check size={12} /> Following
            </button>
          ) : (
            <button
              onClick={onFollow}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-100 hover:bg-cyan-100 transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <UserPlus size={12} /> Follow
            </button>
          )}
          {openings > 0 && (
            <span
              className="ml-auto text-cyan-700 group-hover:underline"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              View openings →
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
