import React from 'react';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import type { Person } from '@/app/data/people';

interface SuggestionCardProps {
  person: Person;
  onClick?: () => void;
  onConnect?: (e: React.MouseEvent) => void;
}

export function SuggestionCard({ person, onClick, onConnect }: SuggestionCardProps) {
  const topSpec = person.specializations[0] ?? '';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 cursor-pointer group w-[200px] shrink-0"
    >
      <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100">
        <ImageWithFallback src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col items-center gap-1 min-w-0 w-full">
        <div className="flex items-center gap-1.5">
          <p className="text-[13px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate max-w-[130px]">
            {person.name}
          </p>
          {person.isVerified && <ShieldCheck size={12} className="text-green-500 shrink-0" />}
        </div>
        <UserGroupBadge group={person.userGroup} size="sm" />
        {topSpec && (
          <p className="text-[11px] text-gray-400 truncate w-full mt-0.5">{topSpec}</p>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()} className="mt-auto pt-1">
        <button
          onClick={onConnect}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-[11px] font-bold text-brand-primary bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <UserPlus size={12} /> Connect
        </button>
      </div>
    </div>
  );
}