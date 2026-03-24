import React, { useState, useMemo } from 'react';
import { Plus, Users, ArrowDown, Compass, Bookmark } from 'lucide-react';
import { PodCard } from '@/app/components/peer-pods/PodCard';
import { CreatePodModal } from '@/app/components/peer-pods/CreatePodModal';
import { ConfidentialityModal } from '@/app/components/peer-pods/ConfidentialityModal';
import {
  MOCK_PODS,
  POD_TYPE_OPTIONS,
  POD_TYPE_COLOR,
  type PodType,
} from '@/app/data/peer-pods';

/* ── Sub-tab type ── */
export type PodSubTab = 'my' | 'explore';

/* ── Props ── */

interface PeerPodsPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
  /** When true, parent provides hero — we render content only */
  embedded?: boolean;
  /** Sub-tab (My Pods / Explore) — managed by parent when embedded */
  subTab?: PodSubTab;
  onSubTabChange?: (tab: PodSubTab) => void;
  /** External modal triggers from parent hub */
  createOpen?: boolean;
  onCreateClose?: () => void;
  /** External search from parent hero */
  externalSearchQuery?: string;
  onExternalSearchChange?: (q: string) => void;
}

export function PeerPodsPage({
  onNavigate,
  userRole,
  embedded,
  subTab: externalSubTab,
  onSubTabChange,
  createOpen,
  onCreateClose,
  externalSearchQuery,
  onExternalSearchChange,
}: PeerPodsPageProps) {
  const isProfessional = userRole === 'Professional';

  // Sub-tab — external when embedded, local when standalone
  const [localSubTab, setLocalSubTab] = useState<PodSubTab>('my');
  const activeSubTab = embedded ? (externalSubTab ?? 'my') : localSubTab;
  const setActiveSubTab = embedded ? (onSubTabChange ?? setLocalSubTab) : setLocalSubTab;

  // Type filter tags (for explore)
  const [selectedTypes, setSelectedTypes] = useState<PodType[]>([]);
  const [showAllExplore, setShowAllExplore] = useState(false);

  // Search — external when embedded, local when standalone
  const [localSearch, setLocalSearch] = useState('');
  const searchQuery = embedded ? (externalSearchQuery ?? '') : localSearch;

  // Local modal state (standalone mode)
  const [localCreateOpen, setLocalCreateOpen] = useState(false);
  const [confidentialityPodId, setConfidentialityPodId] = useState<string | null>(null);

  const isCreateOpen = embedded ? (createOpen ?? false) : localCreateOpen;
  const closeCreate = embedded
    ? () => { if (onCreateClose) onCreateClose(); }
    : () => setLocalCreateOpen(false);

  /* ── Toggle type filter ── */
  const toggleType = (type: PodType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  /* ── My Pods ── */
  const myPods = useMemo(() => {
    return MOCK_PODS.filter(p => p.isJoined);
  }, []);

  /* ── Explore Pods ── */
  const explorePods = useMemo(() => {
    let result = MOCK_PODS.filter(p => !p.isJoined);

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(pod =>
        pod.title.toLowerCase().includes(q) ||
        pod.primaryGoal.toLowerCase().includes(q) ||
        pod.careerStage.toLowerCase().includes(q) ||
        pod.podType.toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.podType));
    }

    return result;
  }, [searchQuery, selectedTypes]);

  const hasExploreFilters = selectedTypes.length > 0 || !!searchQuery;
  const visibleExplore = showAllExplore ? explorePods : explorePods.slice(0, 9);

  /* ── Handlers ── */
  const handlePodClick = (podId: string) => {
    const pod = MOCK_PODS.find(p => p.id === podId);
    if (pod?.isJoined) {
      onNavigate('InsidePod', { podId });
    } else {
      onNavigate('PodDetail', { podId });
    }
  };

  const handleConfidentialityAgree = () => {
    if (confidentialityPodId) {
      onNavigate('InsidePod', { podId: confidentialityPodId });
    }
    setConfidentialityPodId(null);
  };

  const confidentialityPod = confidentialityPodId ? MOCK_PODS.find(p => p.id === confidentialityPodId) : null;

  /* ── My Pods content ── */
  const myPodsContent = (
    <>
      {myPods.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-5">
            <p style={{ fontSize: 13 }} className="text-gray-400">
              {myPods.length} pod{myPods.length !== 1 ? 's' : ''} joined
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myPods.map(pod => (
              <PodCard key={pod.id} pod={pod} onClick={handlePodClick} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center">
            <Users size={22} className="text-gray-300" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600 }} className="text-gray-700">No pods yet</p>
          <p style={{ fontSize: 14 }} className="text-gray-500 max-w-sm">Explore available pods and join one that fits your goals and career stage.</p>
          <button
            onClick={() => setActiveSubTab('explore')}
            className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Compass size={15} />
            Explore Pods
          </button>
        </div>
      )}
    </>
  );

  /* ── Explore Pods content ── */
  const exploreContent = (
    <>
      {/* Type filter tags */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {POD_TYPE_OPTIONS.map(type => {
          const isSelected = selectedTypes.includes(type);
          const color = POD_TYPE_COLOR[type];
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium border transition-all ${
                isSelected
                  ? `${color.bg} ${color.text} ${color.border} shadow-sm`
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Results info when filtering */}
      {hasExploreFilters && (
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{explorePods.length}</span> pod{explorePods.length !== 1 ? 's' : ''} found
          </p>
        </div>
      )}

      {/* Pod grid */}
      {visibleExplore.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="pod-grid">
          {visibleExplore.map(pod => (
            <PodCard key={pod.id} pod={pod} onClick={handlePodClick} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-14 gap-4">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
            <Users size={22} className="text-gray-400" />
          </div>
          <p className="text-gray-700" style={{ fontSize: 16, fontWeight: 600 }}>No pods match your search</p>
          <p className="text-gray-500" style={{ fontSize: 14 }}>Try adjusting your filters.</p>
        </div>
      )}

      {/* Show more */}
      {!showAllExplore && explorePods.length > 9 && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setShowAllExplore(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <ArrowDown size={14} />
            View All ({explorePods.length})
          </button>
        </div>
      )}
    </>
  );

  /* ── Modals ── */
  const modals = (
    <>
      <CreatePodModal isOpen={isCreateOpen} onClose={closeCreate} onSubmit={() => {}} />
      <ConfidentialityModal
        isOpen={!!confidentialityPodId}
        onClose={() => setConfidentialityPodId(null)}
        onAgree={handleConfidentialityAgree}
        podTitle={confidentialityPod?.title || ''}
      />
    </>
  );

  /* ── Sub-tab definitions ── */
  const SUB_TABS: { key: PodSubTab; label: string; icon: React.ReactNode }[] = [
    { key: 'my', label: 'My Pods', icon: <Bookmark size={15} /> },
    { key: 'explore', label: 'Explore', icon: <Compass size={15} /> },
  ];

  /* ── Embedded mode ── */
  if (embedded) {
    return (
      <div className="w-full">
        {activeSubTab === 'my' ? myPodsContent : exploreContent}
        {modals}
      </div>
    );
  }

  /* ── Standalone mode ── */
  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ HERO ═══ */}
      <div className="w-full bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#134e4a] pt-12 pb-0 shadow-sm relative overflow-hidden">
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
              <p className="tracking-tight text-white" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: '1.25' }}>
                Peer Pods
              </p>
              <p className="text-teal-100 max-w-xl opacity-90" style={{ fontSize: 15, fontWeight: 500, lineHeight: '1.625' }}>
                Confidential peer-based professional support groups
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {isProfessional && (
                <button
                  onClick={() => setLocalCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create a Pod
                </button>
              )}
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
                      : 'border-transparent text-teal-200 hover:text-white hover:opacity-100'
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
        {activeSubTab === 'my' ? myPodsContent : exploreContent}
      </div>

      {modals}
    </div>
  );
}