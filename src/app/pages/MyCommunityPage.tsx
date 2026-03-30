import React, { useState } from 'react';
import { Users, Plus, Compass, Bookmark, Shield, Mic, Search, X } from 'lucide-react';
import { CommunityPage } from './CommunityPage';
import { PeerPodsPage, type PodSubTab } from './PeerPodsPage';
import { OpenMicPage, type MicSubTab } from './OpenMicPage';
import { CreateCircleModal } from '@/app/components/community/CreateCircleModal';

export type CommunityTab = 'circles' | 'peer-pods' | 'open-mic';

const MODULE_META: Record<CommunityTab, {
  icon: React.ReactNode;
  label: string;
  title: (isPro: boolean) => string;
  subtitle: (isPro: boolean) => string;
  searchPlaceholder?: string;
}> = {
  circles: {
    icon: <Users size={20} />,
    label: 'Circles',
    title: (isPro) => isPro ? 'Professional Circles' : 'Circles',
    subtitle: (isPro) => isPro
      ? 'Lead and participate in peer communities for shared learning and practice.'
      : 'Peer communities for shared learning and practice.',
    searchPlaceholder: 'Search circles by name, specialization, or topic...',
  },
  'peer-pods': {
    icon: <Shield size={20} />,
    label: 'Peer Pods',
    title: (isPro) => 'Peer Pods',
    subtitle: (isPro) => isPro
      ? 'Facilitate and join confidential peer support groups for professional growth.'
      : 'Confidential peer-based professional support groups.',
    searchPlaceholder: 'Search pods by name, specialization, or goal...',
  },
  'open-mic': {
    icon: <Mic size={20} />,
    label: 'Open Mic',
    title: (isPro) => 'Open Mic',
    subtitle: (isPro) => isPro
      ? 'Share lived experiences, lessons, and professional insights with the community.'
      : 'Share lived experiences, lessons, and professional insights.',
    searchPlaceholder: 'Search posts by title, topic, or author...',
  },
};

const MODULE_KEYS: CommunityTab[] = ['circles', 'peer-pods', 'open-mic'];

type CircleSubTab = 'my' | 'explore';

interface MyCommunityPageProps {
  onNavigate: (page: string, params?: any) => void;
  userRole?: string;
  initialTab?: CommunityTab;
}

const SUB_TABS: Record<CommunityTab, { key: string; label: string; icon: React.ReactNode }[]> = {
  circles: [
    { key: 'my', label: 'My Circles', icon: <Bookmark size={15} /> },
    { key: 'explore', label: 'Browse', icon: <Compass size={15} /> },
  ],
  'peer-pods': [
    { key: 'my', label: 'My Pods', icon: <Bookmark size={15} /> },
    { key: 'explore', label: 'Browse', icon: <Compass size={15} /> },
  ],
  'open-mic': [
    { key: 'my', label: 'My Posts', icon: <Bookmark size={15} /> },
    { key: 'explore', label: 'Browse', icon: <Compass size={15} /> },
  ],
};

export function MyCommunityPage({ onNavigate, userRole, initialTab = 'circles' }: MyCommunityPageProps) {
  const isProfessional = userRole === 'Professional';
  const [activeTab, setActiveTab] = useState<CommunityTab>(initialTab);

  // Circles state
  const [circleSubTab, setCircleSubTab] = useState<CircleSubTab>('my');
  const [isCreateCircleOpen, setIsCreateCircleOpen] = useState(false);

  // Peer Pods state
  const [podSubTab, setPodSubTab] = useState<PodSubTab>('my');
  const [podCreateOpen, setPodCreateOpen] = useState(false);

  // Open Mic state
  const [micSubTab, setMicSubTab] = useState<MicSubTab>('my');
  const [micCreateOpen, setMicCreateOpen] = useState(false);

  // Shared search
  const [circleSearchQuery, setCircleSearchQuery] = useState('');
  const [podSearchQuery, setPodSearchQuery] = useState('');
  const [micSearchQuery, setMicSearchQuery] = useState('');

  const meta = MODULE_META[activeTab];

  const currentSubTab = activeTab === 'circles' ? circleSubTab
    : activeTab === 'peer-pods' ? podSubTab
    : micSubTab;
  const setCurrentSubTab = (key: string) => {
    if (activeTab === 'circles') setCircleSubTab(key as CircleSubTab);
    if (activeTab === 'peer-pods') setPodSubTab(key as PodSubTab);
    if (activeTab === 'open-mic') setMicSubTab(key as MicSubTab);
  };

  const hasSubTabs = SUB_TABS[activeTab].length > 0;

  // Search state per tab — show search only in explore sub-tabs and open mic
  const searchQuery = activeTab === 'circles' ? circleSearchQuery
    : activeTab === 'peer-pods' ? podSearchQuery
    : micSearchQuery;
  const setSearchQuery = activeTab === 'circles' ? setCircleSearchQuery
    : activeTab === 'peer-pods' ? setPodSearchQuery
    : setMicSearchQuery;
  const showSearch = activeTab === 'circles'
    ? circleSubTab === 'explore'
    : activeTab === 'peer-pods'
    ? podSubTab === 'explore'
    : activeTab === 'open-mic'
    ? micSubTab === 'explore'
    : false;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ MODULE SELECTOR ═══ */}
      <div className="w-full bg-purple-900 pt-4 px-6 lg:px-10">
        <div className="max-w-[1440px] mx-auto grid grid-cols-3 gap-2">
          {MODULE_KEYS.map((key) => {
            const mod = MODULE_META[key];
            const isActive = activeTab === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center justify-center gap-2.5 py-3 rounded-t-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {mod.icon}
                {mod.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ HERO HEADER ═══ */}
      <div className={`w-full bg-purple-800 pt-12 ${hasSubTabs ? 'pb-0' : 'pb-8'} shadow-sm relative overflow-hidden`}>
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">

          {/* Title + CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-white tracking-tight" style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: '1.25' }}>
                {meta.title(isProfessional)}
              </p>
              <p className="text-purple-100 max-w-xl opacity-90" style={{ fontSize: 15, fontWeight: 500, lineHeight: '1.625' }}>
                {meta.subtitle(isProfessional)}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {/* Circles CTAs */}
              {activeTab === 'circles' && isProfessional && (
                <button
                  onClick={() => setIsCreateCircleOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Form a Circle
                </button>
              )}

              {/* Peer Pods CTAs */}
              {activeTab === 'peer-pods' && isProfessional && (
                <button
                  onClick={() => setPodCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create a Pod
                </button>
              )}

              {/* Open Mic CTAs */}
              {activeTab === 'open-mic' && (
                <button
                  onClick={() => setMicCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-purple-50 transition-colors shadow-sm shrink-0"
                >
                  <Plus size={16} strokeWidth={3} />
                  Create Post
                </button>
              )}
            </div>
          </div>

          {/* Search bar in hero */}
          {showSearch && meta.searchPlaceholder && (
            <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
                <input
                  type="text"
                  placeholder={meta.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                    <X size={14} />
                  </button>
                )}
              </div>
              <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-sm">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          )}

          {/* Sub-tabs at bottom of hero */}
          {hasSubTabs && (
            <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px">
              {SUB_TABS[activeTab].map((tab) => {
                const isActive = currentSubTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setCurrentSubTab(tab.key)}
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
          )}
        </div>
      </div>

      {/* ═══ CONTENT AREA ═══ */}
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 py-10 relative z-20">

        {/* ── Circles ── */}
        {activeTab === 'circles' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <CommunityPage
              onNavigate={onNavigate}
              userRole={userRole}
              embedded
              subTab={circleSubTab}
              onSubTabChange={setCircleSubTab}
              externalSearchQuery={circleSearchQuery}
              onExternalSearchChange={setCircleSearchQuery}
            />
          </div>
        )}

        {/* ── Peer Pods ── */}
        {activeTab === 'peer-pods' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <PeerPodsPage
              onNavigate={onNavigate}
              userRole={userRole}
              embedded
              subTab={podSubTab}
              onSubTabChange={setPodSubTab}
              createOpen={podCreateOpen}
              onCreateClose={() => setPodCreateOpen(false)}
              externalSearchQuery={podSearchQuery}
              onExternalSearchChange={setPodSearchQuery}
            />
          </div>
        )}

        {/* ── Open Mic ── */}
        {activeTab === 'open-mic' && (
          <div className="animate-in slide-in-from-left-4 duration-300">
            <OpenMicPage
              onNavigate={onNavigate}
              userRole={userRole}
              embedded
              externalSearchQuery={micSearchQuery}
              createOpen={micCreateOpen}
              onCreateClose={() => setMicCreateOpen(false)}
              subTab={micSubTab}
              onSubTabChange={setMicSubTab}
            />
          </div>
        )}
      </div>

      {/* Circle creation modal */}
      <CreateCircleModal
        isOpen={isCreateCircleOpen}
        onClose={() => setIsCreateCircleOpen(false)}
        onSubmit={(data) => {
          console.log('Create circle:', data);
          setIsCreateCircleOpen(false);
        }}
      />
    </div>
  );
}