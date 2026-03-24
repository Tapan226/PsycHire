import React, { useState, useMemo } from 'react';
import { Mic, ArrowDown, Compass, Bookmark, Eye, MessageSquare, Plus } from 'lucide-react';
import { OpenMicCard } from '@/app/components/open-mic/OpenMicCard';
import { CreateOpenMicPostModal } from '@/app/components/open-mic/CreateOpenMicPostModal';
import { MOCK_OPEN_MIC_POSTS, OPEN_MIC_CATEGORIES, type OpenMicCategory } from '@/app/data/open-mic';

/* ── Sub-tab type ── */
export type MicSubTab = 'my' | 'explore';

interface OpenMicPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
  /** When true, parent provides hero — we just render content */
  embedded?: boolean;
  /** Sub-tab (My Posts / Explore) — managed by parent when embedded */
  subTab?: MicSubTab;
  onSubTabChange?: (tab: MicSubTab) => void;
  /** External search from parent hero bar */
  externalSearchQuery?: string;
  /** External modal trigger from parent CTA */
  createOpen?: boolean;
  onCreateClose?: () => void;
}

export function OpenMicPage({
  onNavigate,
  userRole,
  embedded,
  subTab: externalSubTab,
  onSubTabChange,
  externalSearchQuery,
  createOpen,
  onCreateClose,
}: OpenMicPageProps) {
  // Sub-tab — external when embedded, local when standalone
  const [localSubTab, setLocalSubTab] = useState<MicSubTab>('my');
  const activeSubTab = embedded ? (externalSubTab ?? 'my') : localSubTab;
  const setActiveSubTab = embedded ? (onSubTabChange ?? setLocalSubTab) : setLocalSubTab;

  // Filter state (explore only)
  const [selectedCategories, setSelectedCategories] = useState<OpenMicCategory[]>([]);
  const [showAllPosts, setShowAllPosts] = useState(false);

  // Search — external when embedded
  const searchQuery = externalSearchQuery ?? '';

  // Local modal state (used when not embedded)
  const [localCreateOpen, setLocalCreateOpen] = useState(false);
  const isCreateOpen = embedded ? (createOpen ?? false) : localCreateOpen;
  const closeCreate = embedded
    ? () => { if (onCreateClose) onCreateClose(); }
    : () => setLocalCreateOpen(false);

  /* ── Category toggle ── */
  const toggleCategory = (cat: OpenMicCategory) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  /* ── My Posts ── */
  const myPosts = useMemo(() => {
    return MOCK_OPEN_MIC_POSTS.filter(p => p.isOwn);
  }, []);

  /* ── Explore filtering ── */
  const filteredPosts = useMemo(() => {
    let result = [...MOCK_OPEN_MIC_POSTS];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.author.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }

    return result;
  }, [searchQuery, selectedCategories]);

  const hasFilters = selectedCategories.length > 0 || !!searchQuery;
  const visiblePosts = showAllPosts ? filteredPosts : filteredPosts.slice(0, 8);

  const handlePostClick = (postId: string) => {
    onNavigate('OpenMicPostDetail', { postId });
  };

  const handleCreateSubmit = (data: any) => {
    console.log('Create Open Mic post:', data);
    closeCreate();
  };

  /* ── My Posts content ── */
  const myPostsContent = (
    <>
      {myPosts.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontSize: 13 }} className="text-gray-400">
              {myPosts.length} post{myPosts.length !== 1 ? 's' : ''} published
            </p>
          </div>

          {/* Summary stats row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Views', value: myPosts.reduce((s, p) => s + p.views, 0), icon: <Eye size={16} className="text-purple-500" /> },
              { label: 'Total Saves', value: myPosts.reduce((s, p) => s + p.saves, 0), icon: <Bookmark size={16} className="text-purple-500" /> },
              { label: 'Comments', value: myPosts.reduce((s, p) => s + p.comments.length, 0), icon: <MessageSquare size={16} className="text-purple-500" /> },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>{stat.value.toLocaleString()}</p>
                  <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {myPosts.map(post => (
              <OpenMicCard key={post.id} post={post} onClick={handlePostClick} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
            <Mic size={22} className="text-purple-300" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-700">No posts yet</p>
          <p style={{ fontSize: 14 }} className="text-gray-500 max-w-sm">
            Share your experiences, insights, and reflections with the community.
          </p>
          <button
            onClick={() => setActiveSubTab('explore')}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Compass size={15} />
            Explore Posts
          </button>
        </div>
      )}
    </>
  );

  /* ── Explore content ── */
  const exploreContent = (
    <>
      {/* ═══ CATEGORY TAGS ═══ */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {OPEN_MIC_CATEGORIES.map(cat => {
          const isSelected = selectedCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition-all ${
                isSelected
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm shadow-purple-200'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
        {selectedCategories.length > 0 && (
          <button
            onClick={() => setSelectedCategories([])}
            className="px-3 py-2 rounded-full text-[13px] font-medium text-brand-primary hover:bg-brand-primary/[0.06] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Results count */}
      {hasFilters && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 font-medium">
            <span className="font-semibold text-gray-800">{filteredPosts.length}</span> post{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Section label when no filters */}
      {!hasFilters && (
        <div className="mb-6">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            Recent Reflections
          </p>
        </div>
      )}

      {/* ═══ 4-CARD GRID ═══ */}
      {visiblePosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {visiblePosts.map(post => (
            <OpenMicCard key={post.id} post={post} onClick={handlePostClick} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
            <Mic size={24} className="text-purple-400" />
          </div>
          <p className="text-gray-700" style={{ fontSize: 16, fontWeight: 600 }}>No posts match your filters</p>
          <p className="text-gray-500" style={{ fontSize: 14 }}>Try selecting different categories or adjusting your search.</p>
        </div>
      )}

      {/* Show more */}
      {!showAllPosts && filteredPosts.length > 8 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAllPosts(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <ArrowDown size={14} />
            View All Posts ({filteredPosts.length})
          </button>
        </div>
      )}
    </>
  );

  /* ── Modal ── */
  const modal = (
    <CreateOpenMicPostModal
      isOpen={isCreateOpen}
      onClose={closeCreate}
      onSubmit={handleCreateSubmit}
    />
  );

  /* ── Sub-tab definitions ── */
  const SUB_TABS: { key: MicSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'my', label: 'My Posts', icon: <Bookmark size={15} /> },
    { key: 'explore', label: 'Explore', icon: <Compass size={15} /> },
  ];

  /* ── Embedded mode ── */
  if (embedded) {
    return (
      <div className="w-full">
        {activeSubTab === 'my' ? myPostsContent : exploreContent}
        {modal}
      </div>
    );
  }

  /* ── Standalone (fallback) ── */
  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ HERO ═══ */}
      <div className="w-full bg-purple-800 pt-12 pb-0 shadow-sm relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-white tracking-tight" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: '1.25' }}>
                Open Mic
              </p>
              <p className="text-purple-100 max-w-xl opacity-90" style={{ fontSize: 15, fontWeight: 500, lineHeight: '1.625' }}>
                Share lived experiences, lessons, and professional insights.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <button
                onClick={() => setLocalCreateOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary rounded-xl hover:bg-purple-50 transition-colors shadow-sm shrink-0"
                style={{ fontWeight: 700 }}
              >
                <Plus size={16} strokeWidth={3} />
                Create Post
              </button>
            </div>
          </div>

          {/* Sub-tabs at bottom of hero */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
            {SUB_TABS.map((tab) => {
              const isActive = activeSubTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveSubTab(tab.key)}
                  className={`pb-4 text-sm font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                    isActive
                      ? 'border-white text-white opacity-100'
                      : 'border-transparent text-purple-200 hover:text-white hover:opacity-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10">
        {activeSubTab === 'my' ? myPostsContent : exploreContent}
      </div>

      {modal}
    </div>
  );
}
