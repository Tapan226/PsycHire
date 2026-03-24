import React, { useState } from 'react';
import { Clock, ArrowRight, Bookmark, Share2 } from 'lucide-react';
import type { PeerPod, PodStatus } from '@/app/data/peer-pods';
import { POD_TYPE_COLOR } from '@/app/data/peer-pods';
import { Chip } from '@/app/components/Chip';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

const STATUS_CONFIG: Record<PodStatus, { bg: string; text: string; border: string; label: string }> = {
  Open: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: 'Open' },
  Full: { bg: 'bg-gray-50', text: 'text-gray-500', border: 'border-gray-200', label: 'Full' },
};

const GOAL_CHIP_VARIANT: Record<string, 'mint' | 'blue' | 'purple' | 'amber' | 'rose' | 'slate'> = {
  'Accountability': 'amber',
  'Skill Building': 'blue',
  'Peer Support': 'mint',
  'Networking': 'purple',
};

const POD_TYPE_ACCENT: Record<string, string> = {
  Resilience: '#e11d48',
  Practice: '#0d9488',
  Research: '#2563eb',
  Founder: '#d97706',
};

interface PodCardProps {
  pod: PeerPod;
  onClick: (podId: string) => void;
  compact?: boolean;
}

export function PodCard({ pod, onClick, compact = false }: PodCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const statusCfg = STATUS_CONFIG[pod.status];
  const typeColor = POD_TYPE_COLOR[pod.podType];
  const creator = pod.members.find(m => m.role === 'Creator');
  const displayMembers = pod.members.slice(0, 4);

  return (
    <div
      onClick={() => onClick(pod.id)}
      className={`bg-white rounded-xl border flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer overflow-hidden
        ${pod.isJoined ? 'border-teal-200/60' : 'border-gray-100 hover:border-gray-200'}
      `}
    >
      {/* ── Colored top accent bar ── */}
      <div
        className="w-full h-1 shrink-0"
        style={{ background: `linear-gradient(90deg, ${POD_TYPE_ACCENT[pod.podType] || '#6b7280'}, transparent)`, opacity: 0.45 }}
      />

      <div className={`flex flex-col ${compact ? 'p-4 gap-3' : 'p-6 gap-4'} flex-1`}>
        {/* ── Hover actions ── */}
        {!compact && (
          <div
            className={`absolute top-6 right-5 flex items-center gap-1.5 z-10 transition-opacity duration-200 ${
              isSaved ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
            }`}
          >
            <button
              className="p-2 rounded-full transition-colors text-gray-400 hover:text-teal-600 hover:bg-gray-100"
              title="Share"
              onClick={(e) => { e.stopPropagation(); }}
            >
              <Share2 size={16} />
            </button>
            <button
              className={`p-2 rounded-full transition-colors ${
                isSaved ? 'text-teal-600 bg-teal-50' : 'text-gray-400 hover:text-teal-600 hover:bg-gray-100'
              }`}
              title={isSaved ? 'Saved' : 'Save Pod'}
              onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
            >
              <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
          </div>
        )}

        {/* ── Badge row: Type + Status + Joined ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${typeColor.bg} ${typeColor.text} ${typeColor.border}`}>
            {pod.podType}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
            {statusCfg.label}
          </span>
          {pod.isJoined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 uppercase tracking-wide">
              Joined
            </span>
          )}
        </div>

        {/* ── Title ── */}
        <p
          style={{ fontSize: compact ? 15 : 17, fontWeight: 700, lineHeight: '1.35' }}
          className={`text-gray-900 group-hover:text-teal-700 transition-colors ${compact ? 'pr-2 line-clamp-2' : 'pr-10'}`}
        >
          {pod.title}
        </p>

        {/* ── Metadata chips ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <Chip label={pod.careerStage} variant="slate" />
          <Chip label={pod.primaryGoal} variant={GOAL_CHIP_VARIANT[pod.primaryGoal] || 'slate'} />
        </div>

        {/* ── Description (non-compact) ── */}
        {!compact && (
          <p className="text-sm text-gray-500 line-clamp-2" style={{ lineHeight: '1.5' }}>
            {pod.description}
          </p>
        )}

        {/* ── Creator row (non-compact) ── */}
        {!compact && creator && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
              <ImageWithFallback src={creator.avatarUrl} alt={creator.name} className="w-full h-full object-cover" />
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }} className="text-gray-700 truncate">{creator.name}</span>
            <span style={{ fontSize: 11 }} className="text-gray-400">· Creator</span>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Member avatars stack */}
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {displayMembers.map((m, i) => (
                  <div key={m.id} className="w-6 h-6 rounded-full overflow-hidden border-2 border-white bg-gray-100 shrink-0" style={{ zIndex: displayMembers.length - i }}>
                    <ImageWithFallback src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                ))}
                {pod.memberCount > 4 && (
                  <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center shrink-0" style={{ zIndex: 0 }}>
                    <span style={{ fontSize: 9, fontWeight: 700 }} className="text-gray-500">+{pod.memberCount - 4}</span>
                  </div>
                )}
              </div>
              <span style={{ fontSize: 12 }} className="text-gray-500 ml-2.5">{pod.memberCount}/{pod.maxMembers}</span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-gray-400" />
              <span style={{ fontSize: 12 }} className="text-gray-500">{pod.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-teal-600 hover:underline group/btn">
            <span style={{ fontSize: 13, fontWeight: 600 }}>{pod.isJoined ? 'Enter' : 'View'}</span>
            <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}