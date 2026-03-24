import React, { useState } from 'react';
import {
  ChevronLeft,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle2,
  Globe,
  Banknote,
  CalendarDays,
  Users,
  ListChecks,
  Building2,
} from 'lucide-react';
import { Tooltip } from '@/app/components/Tooltip';
import { FUNDING_DATA, FundingStatus } from '@/app/data/funding';
import { SimilarSection } from '@/app/components/SimilarSection';
import { FundingCard } from '@/app/components/funding/FundingCard';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { toastBookmarkAdded, toastBookmarkRemoved, toastFundingApplied } from '@/app/components/shared/toasts';

const STATUS_PILL: Record<FundingStatus, { bg: string; text: string; border: string }> = {
  Open:           { bg: 'bg-green-400/20',  text: 'text-green-200', border: 'border-green-400/25' },
  'Closing Soon': { bg: 'bg-amber-400/20',  text: 'text-amber-200', border: 'border-amber-400/25' },
  Closed:         { bg: 'bg-gray-400/20',    text: 'text-gray-300',  border: 'border-gray-400/25' },
};

interface FundingDetailPageProps {
  fundingId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
}

export function FundingDetailPage({ fundingId, onBack, onNavigate }: FundingDetailPageProps) {
  const funding = FUNDING_DATA.find((f) => f.id === fundingId);
  const [isSaved, setIsSaved] = useState(funding?.isSaved ?? false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = useState(false);

  if (!funding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-900">Funding opportunity not found</h2>
        <button onClick={onBack} className="mt-4 text-brand-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const statusPill = STATUS_PILL[funding.status];
  const isClosed = funding.status === 'Closed';

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950">
        {/* ── Zone 1: Nav bar ── */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-emerald-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Funding
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content={isSaved ? 'Saved' : 'Save'}>
                <button onClick={() => { if (isSaved) { setShowUnsaveConfirm(true); } else { setIsSaved(true); toastBookmarkAdded('funding'); } }} className={`p-2 rounded-lg transition-all ${isSaved ? 'text-white bg-white/15' : 'text-emerald-200/50 hover:text-white hover:bg-white/10'}`}>
                  <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>
              <Tooltip content="Share">
                <button className="p-2 text-emerald-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <Share2 size={17} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ── Zone 2: Identity + Action ── */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left — Identity */}
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-white/80 mb-3 block">{funding.offeredBy}</span>

              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2.5">
                {funding.title}
              </h1>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 ${statusPill.bg} ${statusPill.text} text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusPill.border}`}>
                  {funding.status}
                </span>
                {funding.status === 'Closing Soon' && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/25">
                    <CalendarDays size={9} /> {funding.deadline}
                  </span>
                )}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              {isClosed ? (
                <span className="bg-white/10 text-white/50 px-6 py-2.5 rounded-lg font-bold text-[14px] border border-white/10">
                  Applications Closed
                </span>
              ) : (
                <a
                  href={funding.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => toastFundingApplied(funding.title)}
                  className="bg-white text-emerald-800 px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-emerald-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 inline-flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-start"
                >
                  Apply <ExternalLink size={15} />
                </a>
              )}
              <div className="flex flex-col gap-1 text-[12px] text-white/45 lg:text-right">
                <span className="flex items-center lg:justify-end gap-1.5">
                  <CalendarDays size={12} /> Deadline: <span className="text-white/80 font-medium">{funding.deadline}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto w-full px-[24px] pt-[48px] pb-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main */}
          <div>
            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-8 pb-7 border-b border-gray-100">
              <Globe size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{funding.country}</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <span>{funding.type}</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <span>{funding.amount}</span>
            </div>

            {/* About */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">About This Opportunity</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">
                {funding.description}
              </p>
            </section>

            {/* Eligibility */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Eligibility Criteria</h2>
              <ul className="space-y-2.5">
                {funding.eligibility.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-[3px]" />
                    <span className="text-[15px] text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* What's Covered */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">What's Covered</h2>
              <ul className="space-y-2.5">
                {funding.whatsCovered.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-blue-500 shrink-0 mt-[3px]" />
                    <span className="text-[15px] text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Application Process */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Application Process</h2>
              <ul className="space-y-2.5">
                {funding.applicationProcess.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold flex items-center justify-center shrink-0 mt-[2px]">{i + 1}</span>
                    <span className="text-[15px] text-gray-600 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* About Provider */}
            <section>
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">About {funding.offeredBy}</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">
                {funding.providerDescription}
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">
            {/* Quick Info */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">Quick Info</h3>
              <div className="flex flex-col gap-3.5">
                {[
                  { label: 'Amount', value: funding.amount, icon: <Banknote size={14} /> },
                  { label: 'Deadline', value: funding.deadline, icon: <CalendarDays size={14} /> },
                  { label: 'Type', value: funding.type, icon: <ListChecks size={14} /> },
                  { label: 'Country', value: funding.country, icon: <Globe size={14} /> },
                  { label: 'Career Stage', value: funding.careerStages.join(', '), icon: <Users size={14} /> },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <span className="text-gray-400 mt-0.5 shrink-0">{item.icon}</span>
                    <div>
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide block">{item.label}</span>
                      <span className="text-[13px] text-gray-700 font-medium">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Website */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-4 flex items-center gap-2">
                <Building2 size={13} /> Official Website
              </h3>
              <a
                href={funding.officialWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-primary hover:underline"
              >
                <Globe size={13} /> Visit Website
              </a>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ SIMILAR FUNDING ═══ */}
      <SimilarSection
        title="Similar Funding"
        accent="emerald"
        exploreLabel="Explore more in Funding"
        onExploreClick={() => onNavigate?.('Funding')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {FUNDING_DATA
            .filter(f => f.id !== funding.id && (f.type === funding.type || f.careerStages.some(s => funding.careerStages.includes(s))))
            .slice(0, 2)
            .map(f => (
              <FundingCard
                key={f.id}
                {...f}
                compact
                onClick={() => onNavigate?.('FundingDetail', { fundingId: f.id })}
              />
            ))}
        </div>
      </SimilarSection>

      <ConfirmDialog
        isOpen={showUnsaveConfirm}
        onClose={() => setShowUnsaveConfirm(false)}
        onConfirm={() => { setIsSaved(false); toastBookmarkRemoved('funding'); }}
        title="Remove from Saved?"
        description="This funding opportunity will be removed from your saved items. You can always save it again later."
        confirmLabel="Unsave"
        variant="warning"
        icon={Bookmark}
      />
    </div>
  );
}