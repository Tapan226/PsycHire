import { MapPin, Banknote, Bookmark, Share2, ArrowRight, Zap, Clock, Sparkles, Calendar } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip, ChipVariant } from '@/app/components/Chip';
import { FeaturedChip } from '@/app/components/FeaturedChip';

export type JobStatusBadge = 'new' | 'urgent' | 'closing-soon';

interface JobCardProps {
  companyName: string;
  jobTitle: string;
  tag: string;
  description: string;
  location: string;
  level: string;
  salary?: string;
  logoUrl?: string;
  chipVariant?: ChipVariant;
  isSaved?: boolean;
  isApplied?: boolean;
  isFeatured?: boolean;
  statusBadge?: JobStatusBadge;
  employmentType?: string;
  datePosted?: string;
  deadline?: string;
  compact?: boolean;
  onClick?: () => void;
  onShare?: () => void;
  onSave?: () => void;
}

const STATUS_BADGE_CONFIG: Record<JobStatusBadge, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  urgent: {
    bg: 'bg-red-100',
    text: 'text-red-700 border border-red-200',
    icon: <Zap size={10} className="fill-current" />,
    label: 'Urgent',
  },
  'closing-soon': {
    bg: 'bg-amber-100',
    text: 'text-amber-700 border border-amber-200',
    icon: <Clock size={10} />,
    label: 'Closing Soon',
  },
  new: {
    bg: 'bg-green-100',
    text: 'text-green-700 border border-green-200',
    icon: <Sparkles size={10} />,
    label: 'New',
  },
};

export const JobCard = ({
  companyName,
  jobTitle,
  tag,
  description,
  location,
  level,
  salary,
  logoUrl,
  chipVariant = "mint",
  isSaved = false,
  isApplied = false,
  isFeatured = false,
  statusBadge,
  employmentType,
  datePosted,
  deadline,
  compact = false,
  onClick,
  onShare,
  onSave
}: JobCardProps) => {

  // Priority: Urgent > Closing Soon > New > Featured — show only one
  const renderTopBadge = () => {
    if (statusBadge) {
      const config = STATUS_BADGE_CONFIG[statusBadge];
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text}`}>
          {config.icon}
          {config.label}
        </span>
      );
    }
    if (isFeatured) {
      return <FeaturedChip />;
    }
    return null;
  };

  const topBadge = renderTopBadge();

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border ${compact ? 'p-4 gap-3' : 'p-5 sm:p-7 gap-4 sm:gap-6'} flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer
        ${isApplied ? 'border-brand-primary/20 bg-brand-primary/[0.01]' : 'border-gray-100 hover:border-blue-200'}
        ${isFeatured && !statusBadge ? 'ring-1 ring-brand-secondary border-brand-secondary' : ''}
        ${statusBadge === 'urgent' ? 'ring-1 ring-red-200 border-red-200' : ''}
      `}
    >
      {/* Action Buttons (Absolute Top Right) */}
      {!compact && (
      <div className={`absolute top-3 right-3 sm:top-5 sm:right-5 flex items-center gap-2 z-10 transition-opacity duration-200 ${isSaved ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}>
        <button 
          className="p-2 rounded-full transition-colors text-gray-400 hover:text-brand-primary hover:bg-gray-100"
          title="Share"
          onClick={(e) => { e.stopPropagation(); onShare && onShare(); }}
        >
          <Share2 size={18} />
        </button>
        <button 
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-brand-primary bg-gray-50' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-100'}`}
          title={isSaved ? "Saved" : "Save Job"}
          onClick={(e) => { e.stopPropagation(); onSave?.(); }}
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3">
        {topBadge && <div className="self-start">{topBadge}</div>}

        <div className="flex items-center gap-3">
          <div className={`${compact ? 'w-8 h-8' : 'w-10 h-10'} rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0`}>
             {logoUrl ? (
                <ImageWithFallback src={logoUrl} alt={companyName} className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full bg-[#D7E7C9]" />
             )}
          </div>
          <span className="text-sm text-gray-500 font-medium">
            {companyName}
            {isApplied && (
              <span className="ml-2 bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                Applied
              </span>
            )}
          </span>
        </div>

        <p style={{ fontSize: compact ? 15 : undefined }} className={`text-gray-900 group-hover:text-brand-primary transition-colors ${compact ? 'pr-2' : 'pr-8'}`}>
          {jobTitle}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={tag} variant={chipVariant} />
          <Chip label={level} variant="blue" />
          {employmentType && <Chip label={employmentType} variant="slate" />}
        </div>
      </div>

      {/* Description */}
      {!compact && (
      <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 font-normal">
        {description}
      </p>
      )}

      {/* Footer */}
      <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 text-sm font-medium">
        <div className="flex items-center gap-3 sm:gap-4 text-gray-500 flex-wrap">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-gray-400" />
            <span>{location}</span>
          </div>
          {datePosted && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-400" />
              <span>{datePosted}</span>
            </div>
          )}
          {deadline && (
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-400" />
              <span>Due {deadline}</span>
            </div>
          )}
          {salary && (
            <div className="flex items-center gap-1.5">
              <Banknote size={16} className="text-gray-400" />
              <span>{salary}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 text-brand-primary text-sm font-semibold hover:underline group/btn">
          <span>View Details</span>
          <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};