import React, { useState, useMemo } from 'react';
import {
  circles,
  mockDiscussions,
  mockResources,
  mockAnnouncements,
  mockCircleEvents,
  MOCK_USERS,
  DiscussionThread,
  DiscussionTag,
} from '@/app/data/community';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import {
  ArrowLeft,
  Search,
  MessageSquare,
  FileText,
  Megaphone,
  CalendarDays,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Bookmark,
  BookmarkCheck,
  Download,
  Flag,
  MoreHorizontal,
  Plus,
  X,
  Check,
  Clock,
  Globe,
  MapPin,
  Info,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Portal } from '@/app/components/shared/Portal';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { toastJoinedCircle, toastLeftCircle } from '@/app/components/shared/toasts';

/* ─── Props ─── */

interface CommunityCirclePageProps {
  circleId: string;
  onBack: () => void;
  userRole?: string;
}

/* ─── Tab type ─── */

type DetailTab = 'discussions' | 'resources' | 'announcements' | 'events';

const TAB_CONFIG: { key: DetailTab; label: string; icon: React.ReactNode }[] = [
  { key: 'discussions', label: 'Discussions', icon: <MessageSquare size={15} /> },
  { key: 'resources', label: 'Resources', icon: <FileText size={15} /> },
  { key: 'announcements', label: 'Announcements', icon: <Megaphone size={15} /> },
  { key: 'events', label: 'Events', icon: <CalendarDays size={15} /> },
];

const DISCUSSION_TAGS: DiscussionTag[] = ['Case Discussion', 'Tools', 'Ethical Dilemma', 'Publication', 'Q&A'];

/* ═══ COMPONENT ═══ */

export function CommunityCirclePage({ circleId, onBack, userRole }: CommunityCirclePageProps) {
  const circle = circles.find(c => c.id === circleId);
  const isProfessional = userRole === 'Professional';
  // Mock: current user id — in production this comes from auth context
  const CURRENT_USER_ID = 'l1'; // simulates being Dr. Sarah Miller (circle c1 leader)
  const isCircleAdmin = circle ? circle.leader.id === CURRENT_USER_ID : false;

  const [activeTab, setActiveTab] = useState<DetailTab>('discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  if (!circle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8]">
        <p className="text-[17px] font-bold text-gray-900 mb-2">Circle not found</p>
        <button onClick={onBack} className="text-sm font-semibold text-[color:var(--color-brand-primary)] hover:underline">
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">

      {/* ═══ ZONE HEADER ═══ */}
      <div className="w-full bg-purple-800 pt-8 pb-0 shadow-sm relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-6">

          {/* Back */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-200 hover:text-white transition-colors font-medium text-sm group w-fit"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Circles
          </button>

          {/* Circle info — organized header */}
          <div className="flex flex-col gap-4">
            {/* Row 1: Title + CTA */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                {/* Tags inline with title context */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Chip label={circle.category} variant="purple" className="bg-white/20 text-white border-0" />
                  <Chip label={circle.focusArea} variant="purple" className="bg-white/10 text-purple-200 border-0" />
                  {circle.isJoined && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-teal-100 bg-teal-500/20 border border-teal-500/30 uppercase tracking-wide">
                      <Check size={10} strokeWidth={3} /> Joined
                    </span>
                  )}
                </div>
                <p className="text-[26px] font-extrabold tracking-tight text-white" style={{ lineHeight: '1.2' }}>
                  {circle.name}
                </p>
                <p className="text-purple-100 text-[14px] font-medium max-w-2xl opacity-90" style={{ lineHeight: '1.5' }}>
                  {circle.description}
                </p>
              </div>

              <div className="shrink-0 flex items-start pt-1 gap-2">
                {circle.isJoined ? (
                  <>
                    <button
                      onClick={() => setIsLeaveDialogOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-purple-200 font-semibold rounded-xl hover:bg-white/20 hover:text-white transition-colors border border-purple-500/30"
                      style={{ fontSize: 13 }}
                    >
                      <ArrowLeft size={14} />
                      Leave
                    </button>
                    <button
                      onClick={() => setIsCreatePostOpen(true)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-sm"
                    >
                      <Plus size={16} strokeWidth={3} />
                      New Discussion
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toastJoinedCircle(circle.name)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-secondary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-sm"
                  >
                    <Users size={16} />
                    Join Circle
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Meta strip — clean horizontal with leader avatar */}
            <div className="flex items-center gap-4 flex-wrap py-2 px-4 bg-white/[0.06] rounded-xl -mx-0.5">
              <span className="flex items-center gap-1.5 text-purple-100 text-[13px] font-medium">
                <Users size={14} className="text-purple-300" />
                {circle.memberCount.toLocaleString()} members
              </span>
              <span className="w-px h-4 bg-purple-500/30" />
              <span className="flex items-center gap-1.5 text-purple-100 text-[13px] font-medium">
                <MapPin size={14} className="text-purple-300" />
                {circle.location}
              </span>
              <span className="w-px h-4 bg-purple-500/30" />
              <span className="flex items-center gap-1.5 text-purple-100 text-[13px] font-medium">
                {circle.leader.avatarUrl ? (
                  <span className="w-5 h-5 rounded-full overflow-hidden border border-purple-400/40 shrink-0">
                    <ImageWithFallback src={circle.leader.avatarUrl} alt={circle.leader.name} className="w-full h-full object-cover" />
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-[8px] text-white font-bold shrink-0">
                    {circle.leader.name[0]}
                  </span>
                )}
                Led by <span className="text-white font-semibold">{circle.leader.name}</span>
                {circle.leader.isVerified && <ShieldCheck size={12} className="text-teal-300" />}
              </span>
            </div>
          </div>

          {/* Tabs — border-b-4 underline style matching other modules */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
            {TAB_CONFIG.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`pb-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-white text-white opacity-100'
                    : 'border-transparent text-purple-300 hover:text-white hover:opacity-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 w-full py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* Main column */}
          <div className="flex flex-col gap-6">
            {activeTab === 'discussions' && (
              <DiscussionsTab
                circleId={circleId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isJoined={!!circle.isJoined}
              />
            )}
            {activeTab === 'resources' && (
              <ResourcesTab circleId={circleId} />
            )}
            {activeTab === 'announcements' && (
              <AnnouncementsTab circleId={circleId} />
            )}
            {activeTab === 'events' && (
              <EventsTab circleId={circleId} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {/* Guidelines */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4 text-[color:var(--color-brand-primary)]">
                <ShieldCheck size={18} />
                <p className="text-[14px] font-bold text-gray-900">Community Guidelines</p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {circle.guidelines.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600" style={{ lineHeight: '1.5' }}>
                    <span className="font-bold text-gray-300 select-none shrink-0">{i + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Moderators */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                Circle Team
              </p>
              <div className="flex flex-col gap-3">
                {/* Leader */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                    {circle.leader.avatarUrl ? (
                      <ImageWithFallback src={circle.leader.avatarUrl} alt={circle.leader.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-200">
                        {circle.leader.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-gray-900 truncate">{circle.leader.name}</span>
                      {circle.leader.isVerified && <ShieldCheck size={12} className="text-blue-500 shrink-0" />}
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-semibold mt-0.5">
                      Circle Leader
                    </span>
                  </div>
                </div>

                {/* Moderators */}
                {circle.moderators.map(mod => (
                  <div key={mod.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {mod.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-gray-900 truncate block">{mod.name}</span>
                      <span className="inline-flex items-center px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-semibold mt-0.5">
                        Moderator
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Moderation (for moderators) */}
            {isCircleAdmin && (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Moderation
                </p>
                <div className="flex flex-col gap-2">
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                    <Flag size={14} className="text-gray-400" />
                    Review Flagged Content
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                    <Trash2 size={14} className="text-gray-400" />
                    Remove Content
                  </button>
                  <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all">
                    <AlertTriangle size={14} className="text-gray-400" />
                    Suspend Member
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Create Discussion Modal */}
      {isCreatePostOpen && (
        <CreateDiscussionModal
          circleName={circle.name}
          guidelines={circle.guidelines}
          onClose={() => setIsCreatePostOpen(false)}
          onSubmit={(data) => {
            console.log('New discussion:', data);
            setIsCreatePostOpen(false);
          }}
        />
      )}

      {/* Leave Circle Dialog */}
      <ConfirmDialog
        isOpen={isLeaveDialogOpen}
        onClose={() => setIsLeaveDialogOpen(false)}
        onConfirm={() => {
          toastLeftCircle();
        }}
        title="Leave this circle?"
        description={`You'll lose access to discussions, resources, and events in "${circle.name}". You can rejoin anytime.`}
        confirmLabel="Leave Circle"
        cancelLabel="Stay"
        variant="warning"
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   DISCUSSIONS TAB
   ═══════════════════════════════════════ */

function DiscussionsTab({
  circleId,
  searchQuery,
  setSearchQuery,
  isJoined,
}: {
  circleId: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isJoined: boolean;
}) {
  const [filterTag, setFilterTag] = useState<DiscussionTag | 'All'>('All');

  const threads = useMemo(() => {
    let result = mockDiscussions.filter(d => d.circleId === circleId);
    if (filterTag !== 'All') result = result.filter(d => d.tag === filterTag);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
      );
    }
    return result;
  }, [circleId, filterTag, searchQuery]);

  return (
    <>
      {/* Search + tag filter */}
      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[color:var(--color-brand-primary)] transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[color:var(--color-brand-primary)] focus:ring-1 focus:ring-[color:var(--color-brand-primary)]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(['All', ...DISCUSSION_TAGS] as const).map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                filterTag === tag
                  ? 'bg-[color:var(--color-brand-primary)] text-white border-[color:var(--color-brand-primary)]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Thread list */}
      <div className="flex flex-col gap-4">
        {threads.length > 0 ? (
          threads.map(thread => (
            <DiscussionCard key={thread.id} thread={thread} />
          ))
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
            <p className="text-[15px] font-bold text-gray-900 mb-1">No discussions found</p>
            <p className="text-sm text-gray-500">
              {isJoined ? 'Start a new discussion to get things going.' : 'Join this circle to participate in discussions.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Discussion Thread Card ─── */

function DiscussionCard({ thread }: { thread: DiscussionThread }) {
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(thread.isSaved || false);
  const [menuOpen, setMenuOpen] = useState(false);

  const TAG_VARIANT: Record<DiscussionTag, 'mint' | 'blue' | 'amber' | 'purple' | 'rose'> = {
    'Case Discussion': 'mint',
    'Tools': 'blue',
    'Ethical Dilemma': 'amber',
    'Publication': 'purple',
    'Q&A': 'rose',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gray-50/60 border-b border-gray-100">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
          {thread.author.avatarUrl ? (
            <ImageWithFallback src={thread.author.avatarUrl} alt={thread.author.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-200">
              {thread.author.name[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{thread.author.name}</span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600">
              {thread.author.role}
            </span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">{thread.timestamp}</span>
        </div>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MoreHorizontal size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-20 py-1">
              <button className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Flag size={14} /> Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <Chip label={thread.tag} variant={TAG_VARIANT[thread.tag]} />
        </div>
        <p className="text-[16px] font-bold text-gray-900" style={{ lineHeight: '1.35' }}>
          {thread.title}
        </p>
        <p className="text-[14px] text-gray-600" style={{ lineHeight: '1.6' }}>
          {thread.content}
        </p>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4">
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showComments ? 'text-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={14} />
            {thread.comments.length > 0 ? `${thread.comments.length} Comments` : 'Comment'}
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isSaved ? 'text-[color:var(--color-brand-primary)] bg-[color:var(--color-brand-primary)]/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
            <Share2 size={14} />
            Share
          </button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {thread.comments.length > 0 ? (
              <div className="flex flex-col gap-3 mb-4">
                {thread.comments.map(comment => (
                  <div key={comment.id} className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-100 shrink-0 mt-0.5 border border-gray-200">
                      {comment.author.avatarUrl ? (
                        <ImageWithFallback src={comment.author.avatarUrl} alt={comment.author.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-[9px]">
                          {comment.author.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 bg-gray-50 p-3 rounded-lg rounded-tl-none">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className="text-[12px] font-bold text-gray-900">{comment.author.name}</span>
                        <span className="text-[10px] text-gray-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700" style={{ lineHeight: '1.5' }}>{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-sm text-gray-400 italic">No comments yet. Be the first to share your thoughts.</p>
            )}

            {/* Reply input */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[color:var(--color-brand-primary)] shrink-0 flex items-center justify-center text-white text-[9px] font-bold">
                AJ
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] focus:ring-1 focus:ring-[color:var(--color-brand-primary)]/20 transition-all"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   RESOURCES TAB
   ═══════════════════════════════════════ */

function ResourcesTab({ circleId }: { circleId: string }) {
  const resources = useMemo(() => mockResources.filter(r => r.circleId === circleId), [circleId]);

  const TYPE_ICON: Record<string, string> = {
    'Template': '📋',
    'Research Paper': '📄',
    'Assessment Tool': '📊',
  };

  return (
    <div className="flex flex-col gap-4">
      {resources.length > 0 ? (
        resources.map(resource => (
          <div key={resource.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-[20px]">{TYPE_ICON[resource.type] || '📄'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-bold text-gray-900 truncate" style={{ lineHeight: '1.3' }}>
                    {resource.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Chip label={resource.type} variant="slate" />
                    <span className="text-[11px] text-gray-400 font-medium">{resource.fileSize}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500" style={{ lineHeight: '1.5' }}>
              {resource.description}
            </p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-[12px] text-gray-400 font-medium">
                Shared by {resource.author} &middot; {resource.timestamp}
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                  <Bookmark size={14} />
                  Save
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)]/5 transition-colors">
                  <Download size={14} />
                  Download
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-[15px] font-bold text-gray-900 mb-1">No resources yet</p>
          <p className="text-sm text-gray-500">Resources shared by circle members will appear here.</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   ANNOUNCEMENTS TAB
   ═══════════════════════════════════════ */

function AnnouncementsTab({ circleId }: { circleId: string }) {
  const announcements = useMemo(() => mockAnnouncements.filter(a => a.circleId === circleId), [circleId]);

  return (
    <div className="flex flex-col gap-4">
      {announcements.length > 0 ? (
        announcements.map(ann => (
          <div
            key={ann.id}
            className="bg-white rounded-xl border border-[color:var(--color-brand-primary)]/15 shadow-sm overflow-hidden"
          >
            {/* Accent bar */}
            <div className="h-1 bg-[color:var(--color-brand-primary)]" />
            <div className="p-5 flex flex-col gap-3">
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 bg-white shrink-0">
                  {ann.author.avatarUrl ? (
                    <ImageWithFallback src={ann.author.avatarUrl} alt={ann.author.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500 bg-gray-200">
                      {ann.author.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{ann.author.name}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-[10px] font-semibold">
                      <Megaphone size={10} /> Moderator
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">{ann.timestamp}</span>
                </div>
              </div>

              {/* Content */}
              <p className="text-[16px] font-bold text-gray-900" style={{ lineHeight: '1.35' }}>
                {ann.title}
              </p>
              <p className="text-[14px] text-gray-600" style={{ lineHeight: '1.6' }}>
                {ann.content}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                  <Bookmark size={14} />
                  Save
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                  <Share2 size={14} />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-[15px] font-bold text-gray-900 mb-1">No announcements</p>
          <p className="text-sm text-gray-500">Circle moderators will post announcements here.</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   EVENTS TAB
   ═══════════════════════════════════════ */

function EventsTab({ circleId }: { circleId: string }) {
  const events = useMemo(() => mockCircleEvents.filter(e => e.circleId === circleId), [circleId]);

  return (
    <div className="flex flex-col gap-4">
      {events.length > 0 ? (
        events.map(event => (
          <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Chip label={event.format} variant={event.format === 'Online' ? 'blue' : event.format === 'Hybrid' ? 'purple' : 'mint'} />
            </div>
            <p className="text-[16px] font-bold text-gray-900" style={{ lineHeight: '1.35' }}>
              {event.title}
            </p>
            <p className="text-[14px] text-gray-500" style={{ lineHeight: '1.5' }}>
              {event.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <CalendarDays size={14} className="text-gray-400" />
                {event.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-400" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                {event.format === 'Online' ? <Globe size={14} className="text-gray-400" /> : <MapPin size={14} className="text-gray-400" />}
                {event.format}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors">
                <Bookmark size={14} />
                Save
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)]/5 transition-colors font-semibold">
                <CalendarDays size={14} />
                Join Event
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <p className="text-[15px] font-bold text-gray-900 mb-1">No upcoming events</p>
          <p className="text-sm text-gray-500">Circle events and meetups will appear here.</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   CREATE DISCUSSION MODAL (guidelines only, no checkboxes)
   ═══════════════════════════════════════ */

function CreateDiscussionModal({
  circleName,
  guidelines,
  onClose,
  onSubmit,
}: {
  circleName: string;
  guidelines: string[];
  onClose: () => void;
  onSubmit: (data: { tag: DiscussionTag; title: string; content: string }) => void;
}) {
  const [tag, setTag] = useState<DiscussionTag>('Q&A');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const canSubmit = title.trim() && content.trim();

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-50 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-[18px] font-bold text-gray-900">New Discussion</p>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          <p className="text-[12px] text-gray-500 font-medium">
            Posting to <span className="font-semibold text-gray-700">{circleName}</span>
          </p>

          {/* Tag selector */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 block">
              Discussion Type
            </label>
            <div className="flex flex-wrap gap-2">
              {DISCUSSION_TAGS.map(t => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
                    tag === t
                      ? 'bg-[color:var(--color-brand-primary)] text-white border-[color:var(--color-brand-primary)]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your discussion a clear title..."
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] transition-all"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">
              Content <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts, questions, or insights..."
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[color:var(--color-brand-primary)] transition-all min-h-[120px] resize-none"
            />
          </div>

          {/* Guidelines (read-only, no checkboxes) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-[12px] font-bold text-gray-500 mb-2.5 flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-gray-400" />
              Community Guidelines
            </p>
            <ul className="flex flex-col gap-2">
              {guidelines.map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] text-gray-600" style={{ lineHeight: '1.4' }}>
                  <span className="font-bold text-gray-300 select-none shrink-0">{i + 1}.</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
          <button
            onClick={() => canSubmit && onSubmit({ tag, title, content })}
            disabled={!canSubmit}
            className="bg-[color:var(--color-brand-primary)] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            Post Discussion
          </button>
        </div>
      </div>
    </div>
  );

  return <Portal>{modalContent}</Portal>;
}