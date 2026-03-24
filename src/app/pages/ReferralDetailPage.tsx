import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  Calendar,
  CalendarPlus,
  Zap,
  Clock,
  Globe,
  Languages,
  Users,
  Share2,
  Bookmark,
  CheckCircle2,
  Building2,
  Flag,
} from 'lucide-react';
import { MOCK_REFERRALS } from '@/app/data/referrals';
import type { ReferralUrgency } from '@/app/data/referrals';
import { RespondModal } from '@/app/components/referrals/RespondModal';
import { Tooltip } from '@/app/components/Tooltip';
import { Chip } from '@/app/components/Chip';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { ReportModal } from '@/app/components/shared/ReportModal';
import { downloadICS } from '@/app/utils/calendar';

interface ReferralDetailPageProps {
  referralId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

const URGENCY_CONFIG: Record<ReferralUrgency, { bg: string; text: string; icon: React.ReactNode; headerBg: string; headerText: string }> = {
  Immediate: {
    bg: 'bg-red-50', text: 'text-red-700',
    icon: <Zap size={13} className="fill-current" />,
    headerBg: 'bg-red-400/20', headerText: 'text-red-200',
  },
  Scheduled: {
    bg: 'bg-amber-50', text: 'text-amber-700',
    icon: <Calendar size={13} />,
    headerBg: 'bg-amber-400/20', headerText: 'text-amber-200',
  },
  Exploratory: {
    bg: 'bg-blue-50', text: 'text-blue-600',
    icon: <Clock size={13} />,
    headerBg: 'bg-blue-400/20', headerText: 'text-blue-200',
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

function getDeadlineLabel(deadline: string): { label: string; isUrgent: boolean } {
  const now = new Date();
  const dl = new Date(deadline);
  const diffMs = dl.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'Expired', isUrgent: false };
  if (diffDays === 0) return { label: 'Due today', isUrgent: true };
  if (diffDays === 1) return { label: '1 day left', isUrgent: true };
  if (diffDays <= 3) return { label: `${diffDays} days left`, isUrgent: true };
  if (diffDays <= 7) return { label: `${diffDays} days left`, isUrgent: false };
  if (diffDays <= 30) return { label: `${Math.ceil(diffDays / 7)} weeks left`, isUrgent: false };
  return { label: `${Math.ceil(diffDays / 30)} months left`, isUrgent: false };
}

export function ReferralDetailPage({ referralId, onBack, onNavigate, userRole }: ReferralDetailPageProps) {
  const referral = MOCK_REFERRALS.find((r) => r.id === referralId);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const [hasResponded, setHasResponded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  if (!referral) {
    return (
      <div className="flex flex-col w-full bg-white min-h-screen items-center justify-center p-8">
        <p className="text-gray-500">Referral not found.</p>
        <button onClick={onBack} className="mt-4 text-brand-primary font-semibold hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const urgencyStyle = URGENCY_CONFIG[referral.urgency];
  const deadlineInfo = getDeadlineLabel(referral.deadline);
  const isRemote = referral.mode === 'Remote' || referral.location === 'Remote';
  const isActive = referral.status === 'Open';

  const handleRespondClose = () => {
    setShowRespondModal(false);
    setHasResponded(true);
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#1a327a]">
        {/* ── Zone 1: Nav bar ── */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-blue-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Referrals
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content={isSaved ? 'Saved' : 'Save Referral'}>
                <button onClick={() => setIsSaved(!isSaved)} className={`p-2 rounded-lg transition-all ${isSaved ? 'text-white bg-white/15' : 'text-blue-200/50 hover:text-white hover:bg-white/10'}`}>
                  <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>
              <Tooltip content="Share Referral">
                <button onClick={() => setShareModalOpen(true)} className="p-2 text-blue-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Share2 size={17} /></button>
              </Tooltip>
              <Tooltip content="Add Deadline to Calendar">
                <button
                  onClick={() => {
                    const deadlineDate = new Date(referral.deadline);
                    deadlineDate.setHours(23, 59, 0);
                    const reminderDate = new Date(deadlineDate.getTime() - 24 * 60 * 60 * 1000);
                    reminderDate.setHours(9, 0, 0);
                    downloadICS({
                      title: `Referral Deadline: ${referral.title}`,
                      description: `Deadline to respond to referral "${referral.title}" by ${referral.postedBy.name}`,
                      location: referral.location || 'Remote',
                      startDate: reminderDate,
                      endDate: deadlineDate,
                      organizer: referral.postedBy.name,
                    });
                  }}
                  className="p-2 text-blue-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <CalendarPlus size={17} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ── Zone 2: Subject + Referrer + CTA ── */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left — Subject + Referrer */}
            <div className="flex-1 min-w-0">
              {/* Subject */}
              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-3">
                {referral.title}
              </h1>

              {/* Referrer details — linked to profile */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-white/10 flex items-center justify-center text-white/90 font-bold text-[12px]">
                  {referral.postedBy.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <div className="flex flex-col">
                  <button
                    onClick={() => onNavigate?.('PersonProfile', { personId: referral.postedBy.name })}
                    className="text-[14px] font-semibold text-white hover:text-blue-200 hover:underline transition-colors text-left"
                  >
                    {referral.postedBy.name}
                  </button>
                  <span className="text-[12px] text-blue-200/60">{referral.postedBy.role}</span>
                </div>
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              {isActive && !hasResponded ? (
                <button
                  onClick={() => setShowRespondModal(true)}
                  className="bg-white text-[#1e40af] px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-blue-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 w-full lg:w-auto text-center"
                >
                  Respond
                </button>
              ) : hasResponded ? (
                <span className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-bold text-[14px] border border-white/15 flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-green-400" /> Responded
                </span>
              ) : null}
              <div className="flex flex-col gap-1 text-[12px] text-white/45 lg:text-right">
                <span className="flex items-center lg:justify-end gap-1.5">
                  <Calendar size={12} /> Deadline: <span className={`font-medium ${deadlineInfo.isUrgent ? 'text-red-300' : 'text-white/80'}`}>{formatDate(referral.deadline)}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto w-full px-[24px] pt-[48px] pb-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* ── Main ── */}
          <div>
            {/* 1. Location */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">Location</h2>
              <div className="flex items-center gap-2 text-[15px] text-gray-600">
                {isRemote ? <Globe size={16} className="text-gray-400 shrink-0" /> : <MapPin size={16} className="text-gray-400 shrink-0" />}
                <span>{referral.location}</span>
                {referral.mode && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600 ml-1">
                    {referral.mode}
                  </span>
                )}
              </div>
            </section>

            {/* 2. Duration */}
            {referral.duration && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-3">Duration</h2>
                <div className="flex items-center gap-2 text-[15px] text-gray-600">
                  <Clock size={16} className="text-gray-400 shrink-0" />
                  <span>{referral.duration}</span>
                </div>
              </section>
            )}

            {/* 3. Domain & Specialization */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Domain & Specialization</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {referral.domain && (
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Domain</span>
                    <span className="text-[13px] text-gray-800 font-medium">{referral.domain}</span>
                  </div>
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Specialization</span>
                  <span className="text-[13px] text-gray-800 font-medium">{referral.specialization}</span>
                </div>
              </div>
            </section>

            {/* 4. Prerequisites */}
            {referral.prerequisites && referral.prerequisites.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Prerequisites</h2>
                <ul className="space-y-2.5">
                  {referral.prerequisites.map((p, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-[3px]" />
                      <span className="text-[15px] text-gray-600 leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 5. Language & Population */}
            {(referral.language || referral.population) && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Language & Population</h2>
                <div className="flex flex-col gap-5">
                  {referral.language && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        <Languages size={11} /> Languages
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {referral.language.split(',').map((l, i) => <Chip key={i} label={l.trim()} variant="slate" />)}
                      </div>
                    </div>
                  )}
                  {referral.population && (
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                        <Users size={11} /> Population
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <Chip label={referral.population} variant="blue" />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* 6. Details of the Client */}
            {referral.client && (
              <section className="pb-7">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Details of the Client</h2>
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-gray-400" />
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <span className="text-[15px] font-semibold text-gray-900">{referral.client.name}</span>
                    {referral.client.industry && (
                      <span className="text-[12px] text-gray-500 font-medium">{referral.client.industry}</span>
                    )}
                    {referral.client.description && (
                      <p className="text-[14px] text-gray-600 leading-relaxed mt-1">{referral.client.description}</p>
                    )}
                    {referral.client.website && (
                      <a
                        href={`https://${referral.client.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 text-[13px] font-medium hover:underline mt-1"
                      >
                        <Globe size={13} /> {referral.client.website}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* Urgency */}
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Urgency</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${urgencyStyle.bg} ${urgencyStyle.text}`}>
                  {urgencyStyle.icon}
                  {referral.urgency}
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Deadline */}
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Deadline</span>
                <span className={`text-[13px] font-semibold ${deadlineInfo.isUrgent ? 'text-red-600' : 'text-gray-800'}`}>
                  {formatDate(referral.deadline)}
                </span>
                {deadlineInfo.isUrgent && (
                  <span className="block text-[11px] text-red-500 font-medium mt-0.5">{deadlineInfo.label}</span>
                )}
              </div>
              <div className="h-px bg-gray-100" />
              <div className="flex items-center"><button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-red-600 transition-colors"><Flag size={12} /> Report this referral</button></div>
            </div>
          </aside>
        </div>
      </div>

      {/* Respond Modal */}
      <RespondModal
        isOpen={showRespondModal}
        onClose={handleRespondClose}
        referralTitle={referral.title}
      />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={referral.title}
        subtitle="Share this referral"
      />
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} entityType="Referral" entityTitle={referral.title} />
    </div>
  );
}