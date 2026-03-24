import React from 'react';
import { CommunityCircle } from '@/app/data/community';
import { Users, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';

interface CommunityCircleCardProps {
  circle: CommunityCircle;
  onClick: (circleId: string) => void;
  onJoin: (circleId: string, e: React.MouseEvent) => void;
}

export function CommunityCircleCard({ circle, onClick, onJoin }: CommunityCircleCardProps) {
  return (
    <div
      onClick={() => onClick(circle.id)}
      className={`bg-white rounded-xl border p-0 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer overflow-hidden
        ${circle.isJoined ? 'border-brand-primary/20' : 'border-gray-100 hover:border-purple-200'}
      `}
    >
      {/* Banner */}
      <div className="w-full h-36 bg-gray-100 relative overflow-hidden">
        <ImageWithFallback
          src={circle.bannerUrl}
          alt={circle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {circle.isJoined && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700 border border-green-200">
            <Check size={10} /> Joined
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Category chip */}
        <div className="flex items-center gap-2">
          <Chip label={circle.category} variant="purple" />
          <Chip label={circle.focusArea} variant="slate" />
        </div>

        {/* Title */}
        <p className="text-[17px] font-bold text-gray-900 group-hover:text-[color:var(--color-brand-primary)] transition-colors" style={{ lineHeight: '1.3' }}>
          {circle.name}
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 line-clamp-2" style={{ lineHeight: '1.5' }}>
          {circle.description}
        </p>

        {/* Member count */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Users size={14} className="text-gray-400" />
          <span className="font-medium">{circle.memberCount.toLocaleString()} members</span>
        </div>

        {/* Leader */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
            {circle.leader.avatarUrl ? (
              <ImageWithFallback src={circle.leader.avatarUrl} alt={circle.leader.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-gray-500 bg-gray-200">
                {circle.leader.name[0]}
              </div>
            )}
          </div>
          <span className="text-sm text-gray-700 font-medium">{circle.leader.name}</span>
          {circle.leader.isVerified && (
            <ShieldCheck size={14} className="text-blue-500" />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-gray-100 px-6 py-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!circle.isJoined) {
              onJoin(circle.id, e);
            } else {
              onClick(circle.id);
            }
          }}
          className={`w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            circle.isJoined
              ? 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
              : 'bg-[color:var(--color-brand-primary)] text-white hover:opacity-90 shadow-sm'
          }`}
        >
          {circle.isJoined ? (
            <>
              View Circle <ArrowRight size={14} />
            </>
          ) : (
            <>
              Join Circle <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
