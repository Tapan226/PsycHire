import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  PenLine,
  MessageSquare,
} from 'lucide-react';
import { ReferralCard } from '@/app/components/ReferralCard';
import { MOCK_REFERRALS } from '@/app/data/referrals';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { ReferralCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';

// ── Types ──

export type ReferralSubTab = 'all' | 'mine' | 'closed';
type MineChildTab = 'created' | 'responded';
type SortOption = 'urgency' | 'deadline' | 'newest';

const SORT_LABELS: Record<SortOption, string> = {
  urgency: 'Urgency',
  deadline: 'Deadline',
  newest: 'Newest',
};

interface ReferralsPageProps {
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
  embedded?: boolean;
  externalSearchQuery?: string;
  onExternalSearchChange?: (query: string) => void;
  externalSubTab?: ReferralSubTab;
  onExternalSubTabChange?: (tab: ReferralSubTab) => void;
}

// ══════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════

export function ReferralsPage({
  onNavigate,
  userRole,
  embedded,
  externalSearchQuery,
  onExternalSearchChange,
  externalSubTab,
  onExternalSubTabChange,
}: ReferralsPageProps) {
  const isStudent = userRole === 'Student';

  // ── Sort state ──
  const [sortBy, setSortBy] = useState<SortOption>('urgency');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // ── Search state ──
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = embedded && externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = embedded && onExternalSearchChange ? onExternalSearchChange : setInternalSearchQuery;

  // ── Sub-tab state (professional only) ──
  const [internalTab, setInternalTab] = useState<ReferralSubTab>('all');
  const activeTab = isStudent ? 'all' : (externalSubTab !== undefined ? externalSubTab : internalTab);

  // ── "My Referrals" child tab (professional only) ──
  const [mineChildTab, setMineChildTab] = useState<MineChildTab>('created');

  // ── Loading state on tab switch ──
  const [isTabLoading, setIsTabLoading] = useState(false);
  useEffect(() => {
    if (activeTab === 'mine' || activeTab === 'closed') {
      setIsTabLoading(true);
      const t = setTimeout(() => setIsTabLoading(false), 600);
      return () => clearTimeout(t);
    }
  }, [activeTab, mineChildTab]);

  // ── Share modal state ──
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareReferralTitle, setShareReferralTitle] = useState('');

  const handleShareReferral = (title: string) => {
    setShareReferralTitle(title);
    setShareModalOpen(true);
  };

  // ── Close sort dropdown on outside click ──
  useEffect(() => {
    if (!showSortDropdown) return;
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSortDropdown]);

  // ── Derived data ──

  const referrals = useMemo(() => {
    let data = [...MOCK_REFERRALS];

    if (isStudent) {
      // Students: only student-eligible + open
      data = data.filter((r) => r.studentEligible && r.status === 'Open');
    } else {
      // Professional tab filtering
      if (activeTab === 'mine') {
        if (mineChildTab === 'created') {
          data = data.filter((r) => r.isCreatedByMe);
        } else {
          data = data.filter((r) => r.isRespondedByMe);
        }
      } else if (activeTab === 'closed') {
        data = data.filter((r) => r.status === 'Closed' || r.status === 'Expired');
      } else {
        data = data.filter((r) => r.status !== 'Closed' && r.status !== 'Expired');
      }
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.specialization.toLowerCase().includes(q) ||
          r.postedBy.name.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q)
      );
    }

    // Sort
    const urgencyOrder: Record<string, number> = { Immediate: 0, Scheduled: 1, Exploratory: 2 };

    if (sortBy === 'urgency') {
      data.sort((a, b) => {
        const uA = urgencyOrder[a.urgency] ?? 3;
        const uB = urgencyOrder[b.urgency] ?? 3;
        if (uA !== uB) return uA - uB;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    } else if (sortBy === 'deadline') {
      data.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } else {
      // newest — sort by postedDate descending
      data.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }

    return data;
  }, [searchQuery, activeTab, sortBy, isStudent, mineChildTab]);

  // ══════════════════════════════════════════════
  // Render
  // ══════════════════════════════════════════════

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Sort + "My Referrals" child tabs row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* "My Referrals" child tabs (professional only) */}
        {!isStudent && activeTab === 'mine' ? (
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMineChildTab('created')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mineChildTab === 'created'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <PenLine size={14} />
              Created
            </button>
            <button
              onClick={() => setMineChildTab('responded')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                mineChildTab === 'responded'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <MessageSquare size={14} />
              Responded To
            </button>
          </div>
        ) : (
          <div />
        )}

        {/* Sort dropdown */}
        <div ref={sortRef} className="relative">
          <button
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all"
          >
            Sort: {SORT_LABELS[sortBy]}
            <ChevronDown size={14} className={`transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-lg py-1.5 min-w-[160px] z-30 animate-in fade-in slide-in-from-top-1 duration-150">
              {(['urgency', 'deadline', 'newest'] as SortOption[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    sortBy === opt
                      ? 'text-brand-primary bg-brand-primary/[0.04] font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {SORT_LABELS[opt]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Browse by Specialization */}
      {activeTab === 'all' && !searchQuery && (
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">Browse:</span>
            {['Clinical', 'Counselling', 'Child Psychology', 'Neuropsychology', 'I/O Psychology', 'Community', 'Rehabilitation'].map(cat => (
              <button
                key={cat}
                onClick={() => setSearchQuery(cat)}
                className="px-3 py-1.5 rounded-full text-[12px] font-medium bg-white border border-gray-200 text-gray-600 hover:bg-brand-primary/5 hover:text-brand-primary hover:border-brand-primary/20 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results grid */}
      {isTabLoading ? (
        <SkeletonGrid count={4} columns={2}><ReferralCardSkeleton /></SkeletonGrid>
      ) : referrals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No referrals found</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            {searchQuery
              ? 'Try adjusting your search terms.'
              : activeTab === 'mine' && mineChildTab === 'created'
              ? "You haven't created any referrals yet."
              : activeTab === 'mine' && mineChildTab === 'responded'
              ? "You haven't responded to any referrals yet."
              : activeTab === 'closed'
              ? 'No closed or expired referrals.'
              : 'No referrals available right now. Check back soon.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {referrals.map((r) => (
            <ReferralCard
              key={r.id}
              title={r.title}
              specialization={r.specialization}
              location={r.location}
              urgency={r.urgency}
              deadline={r.deadline}
              status={r.status}
              postedBy={r.postedBy}
              mode={r.mode}
              showRespond={r.status === 'Open' && !r.isCreatedByMe}
              onClick={() => onNavigate?.('ReferralDetail', { referralId: r.id })}
              onRespond={() => onNavigate?.('ReferralDetail', { referralId: r.id })}
              onShare={() => handleShareReferral(r.title)}
            />
          ))}
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={shareReferralTitle}
        subtitle="Share this referral"
      />
    </div>
  );
}