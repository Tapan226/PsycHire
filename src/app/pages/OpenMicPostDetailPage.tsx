import React, { useState } from 'react';
import {
  ChevronLeft, Eye, Bookmark, MessageSquare, Share2,
  Flag, MoreHorizontal, Send,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import { Tooltip } from '@/app/components/Tooltip';
import { MOCK_OPEN_MIC_POSTS, type OpenMicComment } from '@/app/data/open-mic';
import type { UserGroup } from '@/app/data/profile';

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

const REACTIONS = [
  { emoji: '💡', label: 'Insightful' },
  { emoji: '❤️', label: 'Love' },
  { emoji: '👏', label: 'Applause' },
  { emoji: '🤔', label: 'Thought-provoking' },
];

interface OpenMicPostDetailPageProps {
  postId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

export function OpenMicPostDetailPage({ postId, onBack, onNavigate, userRole }: OpenMicPostDetailPageProps) {
  const post = MOCK_OPEN_MIC_POSTS.find(p => p.id === postId);

  const [isSaved, setIsSaved] = useState(post?.isSaved ?? false);
  const [showMenu, setShowMenu] = useState(false);
  const [comments, setComments] = useState<OpenMicComment[]>(post?.comments ?? []);
  const [commentText, setCommentText] = useState('');
  const [reactedEmoji, setReactedEmoji] = useState<string | null>(null);
  const [showReactions, setShowReactions] = useState(false);

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-gray-900" style={{ fontSize: 20, fontWeight: 600 }}>Post not found</p>
        <button onClick={onBack} className="mt-4 text-brand-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const catColor = CATEGORY_COLOR[post.category] || CATEGORY_COLOR['#FYI'];

  const handleComment = () => {
    const text = commentText.trim();
    if (!text) return;
    const newComment: OpenMicComment = {
      id: `oc-new-${Date.now()}`,
      author: { id: 'me', name: 'You', avatarUrl: '', role: 'Student' },
      content: text,
      timestamp: 'Just now',
    };
    setComments([...comments, newComment]);
    setCommentText('');
  };

  const handleReact = (emoji: string) => {
    setReactedEmoji(reactedEmoji === emoji ? null : emoji);
    setShowReactions(false);
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-purple-800 via-purple-700 to-purple-900">
        {/* Nav bar */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-purple-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Open Mic
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content="Share">
                <button
                  onClick={() => {}}
                  className="p-2 text-purple-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <Share2 size={17} />
                </button>
              </Tooltip>
              <Tooltip content={isSaved ? 'Saved' : 'Save'}>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`p-2 rounded-lg transition-all ${isSaved ? 'text-white bg-white/10' : 'text-purple-200/50 hover:text-white hover:bg-white/10'}`}
                >
                  <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 text-purple-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <MoreHorizontal size={17} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-1">
                    <button
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Flag size={14} /> Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Identity */}
        <div className="max-w-3xl mx-auto px-6 pt-6 pb-8">
          <div className="flex flex-col gap-4">
            {/* Category */}
            <div className="self-start">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border ${catColor.bg} ${catColor.text} ${catColor.border}`}>
                {post.category}
              </span>
            </div>

            {/* Title */}
            <p className="text-white" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: '1.25' }}>
              {post.title}
            </p>

            {/* Author row */}
            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-purple-600 shrink-0">
                {post.author.avatarUrl ? (
                  <ImageWithFallback src={post.author.avatarUrl} alt={post.author.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-[12px] font-bold">
                    {post.author.name[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{post.author.name}</span>
                  <UserGroupBadge group={post.author.role as UserGroup} size="sm" />
                </div>
                {post.author.title && (
                  <span className="text-purple-200/70 text-[12px]">{post.author.title}</span>
                )}
              </div>
              <span className="text-purple-200/50 text-[12px] ml-auto">{post.timestamp}</span>
            </div>

            {/* Metrics bar */}
            <div className="flex items-center gap-5 mt-1">
              <span className="flex items-center gap-1.5 text-purple-200/60 text-[13px]">
                <Eye size={14} /> {post.views} views
              </span>
              <span className="flex items-center gap-1.5 text-purple-200/60 text-[13px]">
                <Bookmark size={14} /> {post.saves} saves
              </span>
              <span className="flex items-center gap-1.5 text-purple-200/60 text-[13px]">
                <MessageSquare size={14} /> {comments.length} comment{comments.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-3xl mx-auto px-6 w-full py-10 pb-20">

        {/* Full post content */}
        <div className="bg-white">
          <div className="text-gray-800 whitespace-pre-wrap" style={{ fontSize: 16, lineHeight: '1.75' }}>
            {post.content}
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-100">
              {post.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-[12px] font-medium border border-gray-200">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Actions bar ── */}
        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-100">
          {/* React */}
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                reactedEmoji
                  ? 'bg-purple-50 text-purple-700 border-purple-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {reactedEmoji || '😊'} React
            </button>
            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-xl shadow-xl py-2 px-2 flex items-center gap-1 z-20 animate-fade-in">
                {REACTIONS.map(r => (
                  <button
                    key={r.emoji}
                    onClick={() => handleReact(r.emoji)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-lg hover:bg-gray-100 transition-colors ${reactedEmoji === r.emoji ? 'bg-purple-50 ring-1 ring-purple-200' : ''}`}
                    title={r.label}
                  >
                    {r.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Save */}
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              isSaved
                ? 'bg-brand-primary/5 text-brand-primary border-brand-primary/20'
                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
            }`}
          >
            <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved' : 'Save'}
          </button>

          {/* Share */}
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-gray-300 transition-all">
            <Share2 size={15} />
            Share
          </button>

          {/* Report */}
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-gray-300 transition-all ml-auto">
            <Flag size={15} />
            Report
          </button>
        </div>

        {/* ── Comments section ── */}
        <div className="mt-10">
          <p className="text-gray-900 mb-6" style={{ fontSize: 16, fontWeight: 700 }}>
            Comments ({comments.length})
          </p>

          {/* Comment input */}
          <div className="flex items-start gap-3 mb-8">
            <div className="w-9 h-9 rounded-full bg-brand-primary shrink-0 flex items-center justify-center text-white text-[11px] font-bold mt-0.5">
              ME
            </div>
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20 transition-all min-h-[80px] resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  disabled={!commentText.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Send size={14} /> Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="flex flex-col gap-5">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0 mt-0.5">
                    {comment.author.avatarUrl ? (
                      <ImageWithFallback src={comment.author.avatarUrl} alt={comment.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 text-[10px] font-bold">
                        {comment.author.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-xl rounded-tl-none p-4">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-semibold text-gray-900">{comment.author.name}</span>
                        <UserGroupBadge group={comment.author.role as UserGroup} size="sm" />
                      </div>
                      <span className="text-[11px] text-gray-400">{comment.timestamp}</span>
                    </div>
                    <p className="text-gray-700" style={{ fontSize: 14, lineHeight: '1.6' }}>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-gray-500 italic">
              No comments yet. Be the first to share your thoughts.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
