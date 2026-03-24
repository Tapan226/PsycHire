import React, { useState } from 'react';
import { Eye, Bookmark, MessageSquare, Share2, MoreHorizontal, Flag, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import type { OpenMicPost } from '@/app/data/open-mic';
import type { UserGroup } from '@/app/data/profile';

interface OpenMicCardProps {
  post: OpenMicPost;
  onClick: (postId: string) => void;
}

const CATEGORY_COLOR: Record<string, { bg: string; text: string; border: string }> = {
  '#LivedExperiences': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  '#WhatIWishIKnew': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  '#BehindTheScene': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  '#EthicsInPractice': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  '#FailureStories': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  '#SuccessStories': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  '#ThoughtLeadership': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  '#Ideas': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  '#CaseReflections': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  '#ResearchInsights': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  '#FYI': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-300' },
  '#Poll': { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  '#Bulletin': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
};

export function OpenMicCard({ post, onClick }: OpenMicCardProps) {
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [showMenu, setShowMenu] = useState(false);

  const catColor = CATEGORY_COLOR[post.category] || CATEGORY_COLOR['#FYI'];
  const preview = post.content.length > 160 ? post.content.slice(0, 160) + '...' : post.content;

  return (
    <div
      onClick={() => onClick(post.id)}
      className="bg-white rounded-xl border border-gray-100 hover:border-purple-200 flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer"
    >
      {/* Top actions — visible on hover */}
      <div className={`absolute top-4 right-4 flex items-center gap-1.5 z-10 transition-opacity duration-200 ${isSaved ? 'opacity-100' : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'}`}>
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="p-1.5 rounded-full text-gray-400 hover:text-brand-primary hover:bg-gray-100 transition-colors"
          title="Share"
        >
          <Share2 size={15} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); }}
          className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-brand-primary bg-gray-50' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-100'}`}
          title={isSaved ? 'Saved' : 'Save'}
        >
          <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal size={15} />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Flag size={14} /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Category badge */}
        <div className="self-start">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
            {post.category}
          </span>
        </div>

        {/* Title */}
        <p className="text-gray-900 group-hover:text-brand-primary transition-colors pr-6" style={{ fontSize: 16, fontWeight: 600, lineHeight: '1.35' }}>
          {post.title}
        </p>

        {/* Preview */}
        <p className="text-gray-500 line-clamp-3" style={{ fontSize: 13, lineHeight: '1.55' }}>
          {preview}
        </p>

        {/* Author */}
        <div className="flex items-center gap-2.5 mt-auto pt-2">
          <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
            {post.author.avatarUrl ? (
              <ImageWithFallback src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 text-[10px] font-bold">
                {post.author.name[0]}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[13px] text-gray-800 font-medium truncate">{post.author.name}</span>
            <UserGroupBadge group={post.author.role as UserGroup} size="sm" />
          </div>
        </div>
      </div>

      {/* Footer — metrics + CTA */}
      <div className="px-6 py-3.5 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4 text-gray-400" style={{ fontSize: 12 }}>
          <span className="flex items-center gap-1">
            <Eye size={13} /> {post.views}
          </span>
          <span className="flex items-center gap-1">
            <Bookmark size={13} /> {post.saves}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={13} /> {post.comments.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-brand-primary text-[13px] font-semibold hover:underline group/btn">
          <span>Read</span>
          <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
