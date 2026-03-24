import React, { useState } from 'react';
import { MOCK_EVENTS, SponsorTier } from '@/app/data/events';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  ChevronLeft, Calendar, MapPin, Globe, Share2, Bookmark,
  CheckCircle2, Users, ExternalLink, Flag, Ticket, Mic2,
  CalendarPlus, Sparkles, TrendingUp, Award, FileText,
  Play, Image, MessageSquare, Star, X,
  CreditCard, ShieldCheck,
} from 'lucide-react';
import { Tooltip } from '@/app/components/Tooltip';
import { SimilarSection } from '@/app/components/SimilarSection';
import { EventCard } from '@/app/components/events/EventCard';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { ReportModal } from '@/app/components/shared/ReportModal';
import { toastBookmarkAdded, toastBookmarkRemoved, toastEventRSVP } from '@/app/components/shared/toasts';
import { downloadICS } from '@/app/utils/calendar';
import { CallForPapersModal, SpeakerApplicationModal } from '@/app/components/events/EventParticipationModals';
import { NominateEmployeesModal } from '@/app/components/shared/NominateEmployeesModal';
import { Portal } from '@/app/components/shared/Portal';
import { getReviewsForEntity } from '@/app/data/reviews';
import { FeedbackReviews } from '@/app/components/shared/FeedbackReviews';

interface EventDetailsPageProps {
  eventId?: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'Live':                 { label: 'Live',              color: 'text-green-200',   bg: 'bg-green-400/15',  border: 'border-green-400/20' },
  'Registration Open':    { label: 'Registration Open', color: 'text-emerald-200', bg: 'bg-emerald-400/15',border: 'border-emerald-400/20' },
  'Registration Closed':  { label: 'Reg. Closed',       color: 'text-orange-200',  bg: 'bg-orange-400/15', border: 'border-orange-400/20' },
  'Event Completed':      { label: 'Completed',         color: 'text-gray-300',    bg: 'bg-white/[0.08]',  border: 'border-white/[0.1]' },
  'Review Phase':         { label: 'In Review',         color: 'text-indigo-200',  bg: 'bg-indigo-400/15', border: 'border-indigo-400/20' },
  'Draft':                { label: 'Draft',             color: 'text-blue-200',    bg: 'bg-blue-400/15',   border: 'border-blue-400/20' },
  'Pending Approval':     { label: 'Pending',           color: 'text-purple-200',  bg: 'bg-purple-400/15', border: 'border-purple-400/20' },
};

const TIER_COLORS: Record<SponsorTier, { bg: string; border: string; text: string; icon: string }> = {
  Gold:              { bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-700',  icon: 'text-amber-500' },
  Silver:            { bg: 'bg-gray-50',   border: 'border-gray-200',  text: 'text-gray-700',   icon: 'text-gray-400' },
  'Knowledge Partner':{ bg: 'bg-blue-50',  border: 'border-blue-200',  text: 'text-blue-700',   icon: 'text-blue-500' },
  Custom:            { bg: 'bg-indigo-50', border: 'border-indigo-200',text: 'text-indigo-700', icon: 'text-indigo-500' },
};

/* ── Registration Modal Steps ── */
type RegStep = 'select-tier' | 'details' | 'payment' | 'confirmed';

export function EventDetailsPage({ eventId, onBack, onNavigate, userRole }: EventDetailsPageProps) {
  const event = MOCK_EVENTS.find(e => e.id === eventId) || MOCK_EVENTS[0];
  const [isSaved, setIsSaved] = useState(event.isSaved || false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(event.isRegistered || false);
  const [showSponsorForm, setShowSponsorForm] = useState(false);

  // Sponsor apply state
  const [sponsorForm, setSponsorForm] = useState({ orgName: '', contactPerson: '', tier: '' as SponsorTier | '', agreed: false });
  const [sponsorSubmitted, setSponsorSubmitted] = useState(false);

  // Event participation modals
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [showNominateModal, setShowNominateModal] = useState(false);

  // ── Registration Modal ──
  const [showRegModal, setShowRegModal] = useState(false);
  const [regStep, setRegStep] = useState<RegStep>('select-tier');
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [regForm, setRegForm] = useState({ name: '', email: '', designation: '', organization: '' });
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  if (!event) return <div>Event not found</div>;

  const dateObj = new Date(event.startDate);
  const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendeesCount : null;
  const statusStyle = STATUS_BADGE[event.status] || STATUS_BADGE['Live'];
  const canRegister = ['Live', 'Registration Open'].includes(event.status);
  const isCompleted = ['Event Completed', 'Review Phase'].includes(event.status);

  const hasTickets = event.ticketCategories && event.ticketCategories.length > 0;
  const selectedTicket = event.ticketCategories?.find(t => t.id === selectedTierId);

  const handleRegister = () => {
    if (!canRegister) return;
    setShowRegModal(true);
    // If free or no tickets, skip tier selection
    if (event.isFree || !hasTickets) {
      setRegStep('details');
    } else {
      setRegStep('select-tier');
    }
  };

  const handleTierNext = () => {
    if (!selectedTierId && hasTickets && !event.isFree) return;
    setRegStep('details');
  };

  const handleDetailsNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (event.isFree || !hasTickets) {
      // Free event — confirm directly
      setRegStep('confirmed');
      setIsRegistered(true);
      toastEventRSVP(event.title);
    } else {
      setRegStep('payment');
    }
  };

  const handlePayment = () => {
    setPaymentProcessing(true);
    setTimeout(() => {
      setPaymentProcessing(false);
      setRegStep('confirmed');
      setIsRegistered(true);
      toastEventRSVP(event.title);
    }, 2000);
  };

  const handleAddToCalendar = () => {
    const parseTime = (timeStr: string): [number, number] => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return [9, 0];
      let h = parseInt(match[1]);
      const m = parseInt(match[2]);
      if (match[3].toUpperCase() === 'PM' && h < 12) h += 12;
      if (match[3].toUpperCase() === 'AM' && h === 12) h = 0;
      return [h, m];
    };
    const [sh, sm] = parseTime(event.startTime || '09:00 AM');
    const [eh, em] = parseTime(event.endTime || '05:00 PM');
    const start = new Date(event.startDate);
    start.setHours(sh, sm, 0);
    const end = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
    end.setHours(eh, em, 0);
    downloadICS({
      title: event.title,
      description: event.description,
      location: event.location || 'Online',
      startDate: start,
      endDate: end,
      organizer: event.organizer?.name,
    });
  };

  const closeModal = () => {
    setShowRegModal(false);
    setRegStep('select-tier');
    setSelectedTierId(null);
    setRegForm({ name: '', email: '', designation: '', organization: '' });
    setPaymentProcessing(false);
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorSubmitted(true);
    setShowSponsorForm(false);
  };

  const ctaLabel = canRegister ? (event.isFree ? 'RSVP Now' : 'Register') : isCompleted ? 'Event Ended' : 'Registration Closed';

  const currencySymbol = (c: string) => c === 'USD' ? '$' : c === 'INR' ? '₹' : c;

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#4338ca] via-[#3730a3] to-[#312e81]">
        {/* Zone 1: Nav bar */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-indigo-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Events
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content="Add to Calendar"><button onClick={handleAddToCalendar} className="p-2 text-indigo-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><CalendarPlus size={17} /></button></Tooltip>
              <Tooltip content={isSaved ? 'Saved' : 'Save Event'}><button onClick={() => { if (isSaved) { setShowUnsaveConfirm(true); } else { setIsSaved(true); toastBookmarkAdded('event'); } }} className={`p-2 rounded-lg transition-all ${isSaved ? 'text-white bg-white/15' : 'text-indigo-200/50 hover:text-white hover:bg-white/10'}`}><Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} /></button></Tooltip>
              <Tooltip content="Share Event"><button onClick={() => setShowShareModal(true)} className="p-2 text-indigo-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Share2 size={17} /></button></Tooltip>
            </div>
          </div>
        </div>

        {/* Zone 2: Identity + Action */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left — Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-3">
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="w-9 h-9 rounded-full overflow-hidden bg-white/[0.1] border border-white/[0.08] shrink-0 hover:border-white/30 transition-colors">
                  {event.host.avatarUrl ? <ImageWithFallback src={event.host.avatarUrl} alt={event.host.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[11px] font-bold text-white/90">{event.host.name[0]}</div>}
                </button>
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="text-[14px] font-semibold text-white/90 hover:text-white hover:underline transition-colors">
                  {event.host.name}
                </button>
                {event.host.isVerified && <CheckCircle2 size={13} className="text-blue-300" />}
              </div>
              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2.5">{event.title}</h1>

              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>{statusStyle.label}</span>
                {event.isFeatured && <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/25">★ Featured</span>}
                {event.isTrending && <span className="inline-flex items-center gap-1 bg-rose-400/20 text-rose-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-400/25"><TrendingUp size={9} /> Trending</span>}
                {event.isSponsored && <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/25"><Sparkles size={9} /> Sponsored</span>}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              <div className="flex flex-col items-start lg:items-end gap-1">
                <span className="text-[22px] font-extrabold text-white">
                  {event.isFree ? 'Free' : hasTickets
                    ? `From ${currencySymbol(event.currency)}${Math.min(...event.ticketCategories!.map(t => t.price))}`
                    : `${currencySymbol(event.currency)}${event.price}`}
                </span>
                {spotsLeft !== null && (
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    spotsLeft < 10 ? 'bg-red-400/20 text-red-200 border border-red-400/25' : 'bg-green-400/20 text-green-200 border border-green-400/25'
                  }`}><Ticket size={10} /> {spotsLeft} spots left</span>
                )}
              </div>

              {isRegistered ? (
                <button className="bg-white/10 text-white px-6 py-2.5 rounded-lg font-bold text-[14px] border border-white/15 flex items-center gap-2.5 cursor-default w-full lg:w-auto justify-center">
                  <CheckCircle2 size={15} className="text-green-400" /> Registered
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={!canRegister}
                  className={`w-full lg:w-auto px-8 py-2.5 rounded-lg font-bold text-[14px] transition-all tracking-wide flex items-center justify-center gap-2 ${
                    !canRegister ? 'bg-white/10 text-white/50 border border-white/10 cursor-not-allowed' : 'bg-white text-[#3730a3] hover:bg-indigo-50 shadow-sm active:scale-[0.97] duration-200'
                  }`}
                >{ctaLabel} {canRegister && <ExternalLink size={15} />}</button>
              )}

              <div className="flex flex-col gap-1 text-[12px] text-white/45 lg:text-right">
                <span className="flex items-center lg:justify-end gap-1.5"><Users size={12} /> <span className="text-white/80 font-medium">{event.attendeesCount}</span> {event.maxAttendees ? `/ ${event.maxAttendees}` : ''} registered</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto px-6 w-full py-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-7 pb-7 border-b border-gray-100">
              <Calendar size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{fullDate}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{event.startTime} – {event.endTime}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{event.type}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{event.specialization}</span>
            </div>

            {/* Objective */}
            {event.objective && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Objective</h2>
                <p className="text-[15px] text-gray-600 leading-[1.75]">{event.objective}</p>
              </section>
            )}

            {/* Description */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">About this Event</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{event.description}</p>
            </section>

            {/* ═══ AGENDA — improved timeline ═══ */}
            {event.agenda && event.agenda.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Agenda</h2>
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[59px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-200 via-gray-200 to-transparent" />
                  <div className="flex flex-col gap-0">
                    {event.agenda.map((item, idx) => {
                      const isFirst = idx === 0;
                      const isBreak = item.title.toLowerCase().includes('break') || item.title.toLowerCase().includes('lunch') || item.title.toLowerCase().includes('networking');
                      return (
                        <div key={idx} className="relative flex items-start group">
                          {/* Time column */}
                          <div className="w-[48px] shrink-0 text-right pr-3 pt-4">
                            <span className={`text-[11px] font-bold ${isFirst ? 'text-indigo-600' : 'text-gray-400'}`}>
                              {item.time.replace(' AM', 'am').replace(' PM', 'pm')}
                            </span>
                          </div>
                          {/* Dot */}
                          <div className="relative shrink-0 w-[22px] flex justify-center pt-[17px] z-10">
                            <div className={`w-2.5 h-2.5 rounded-full border-2 ${
                              isFirst ? 'border-indigo-500 bg-indigo-100 shadow-sm shadow-indigo-300/40'
                              : isBreak ? 'border-gray-300 bg-gray-100'
                              : 'border-indigo-300 bg-white'
                            }`} />
                          </div>
                          {/* Content */}
                          <div className={`flex-1 ml-3 py-3 px-4 my-1 rounded-lg transition-colors ${
                            isBreak ? 'bg-gray-50/80' : 'hover:bg-indigo-50/40'
                          }`}>
                            <p className={`text-[14px] font-semibold ${isBreak ? 'text-gray-500 italic' : 'text-gray-900'}`}>{item.title}</p>
                            {item.speaker && <p className="text-[12px] text-gray-500 font-medium mt-0.5">{item.speaker}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ SPEAKERS — horizontal compact ═══ */}
            {event.speakers && event.speakers.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Speakers</h2>
                <div className="flex flex-wrap gap-3">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50/70 border border-gray-100 min-w-[220px]">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-white shrink-0 border border-gray-200">
                        {speaker.avatarUrl
                          ? <ImageWithFallback src={speaker.avatarUrl} alt={speaker.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-[13px] font-bold text-gray-300">{speaker.name[0]}</div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-gray-900 truncate">{speaker.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium truncate">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ═══ TICKET CATEGORIES — informational only ═══ */}
            {hasTickets && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Ticket Categories</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {event.ticketCategories!.map(ticket => {
                    const soldOut = ticket.soldCount >= ticket.maxQuantity;
                    return (
                      <div key={ticket.id} className={`p-4 rounded-xl border ${soldOut ? 'bg-gray-50 border-gray-200 opacity-60' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[14px] font-bold text-gray-900">{ticket.name}</span>
                          <span className="text-[14px] font-bold text-gray-900">
                            {currencySymbol(ticket.currency)}{ticket.price}
                          </span>
                        </div>
                        {ticket.description && <p className="text-[12px] text-gray-500 mb-2">{ticket.description}</p>}
                        <div className="flex items-center justify-between text-[11px]">
                          {ticket.discountPercent && <span className="font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">{ticket.discountPercent}% off</span>}
                          {soldOut ? (
                            <span className="font-bold text-red-600">Sold Out</span>
                          ) : (
                            <span className="text-gray-400 font-medium">{ticket.maxQuantity - ticket.soldCount} remaining</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ═══ SPONSORSHIP ═══ */}
            {event.sponsorshipTiers && event.sponsorshipTiers.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">Sponsorship Opportunities</h2>
                  {!sponsorSubmitted && <button onClick={() => setShowSponsorForm(!showSponsorForm)} className="text-[13px] font-semibold text-indigo-600 hover:underline">{showSponsorForm ? 'Hide Form' : 'Apply as Sponsor'}</button>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {event.sponsorshipTiers.map(tier => {
                    const tc = TIER_COLORS[tier.tier];
                    const spotsAvailable = tier.maxSpots - tier.filledSpots;
                    return (
                      <div key={tier.tier} className={`p-4 rounded-xl border ${tc.border} ${tc.bg}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Award size={16} className={tc.icon} />
                            <span className={`text-[14px] font-bold ${tc.text}`}>{tier.tier}</span>
                          </div>
                          <span className={`text-[14px] font-bold ${tc.text}`}>
                            {tier.amount > 0 ? `${currencySymbol(tier.currency)}${tier.amount.toLocaleString()}` : 'Custom'}
                          </span>
                        </div>
                        <ul className="space-y-1 mb-3">
                          {tier.benefits.map((b, i) => (
                            <li key={i} className="text-[12px] text-gray-600 flex items-start gap-1.5">
                              <CheckCircle2 size={10} className="text-green-500 mt-0.5 shrink-0" /> {b}
                            </li>
                          ))}
                        </ul>
                        <div className="text-[11px] font-medium text-gray-400">
                          {spotsAvailable > 0 ? `${spotsAvailable} of ${tier.maxSpots} slots available` : <span className="text-red-500 font-bold">Full</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Current Sponsors */}
                {event.sponsors && event.sponsors.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-[14px] font-semibold text-gray-500 mb-3">Current Sponsors</h3>
                    <div className="flex flex-wrap gap-3">
                      {event.sponsors.map((s, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100">
                          {s.logoUrl ? (
                            <div className="w-7 h-7 rounded-full overflow-hidden bg-white border border-gray-200 shrink-0"><ImageWithFallback src={s.logoUrl} alt={s.name} className="w-full h-full object-cover" /></div>
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 shrink-0">{s.name[0]}</div>
                          )}
                          <div>
                            <p className="text-[12px] font-bold text-gray-900">{s.name}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{s.tier}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sponsor Application Form */}
                {showSponsorForm && !sponsorSubmitted && (
                  <div className="mt-5 p-5 rounded-xl bg-gray-50 border border-gray-200">
                    <h3 className="text-[14px] font-bold text-gray-900 mb-3">Apply as Sponsor</h3>
                    <form onSubmit={handleSponsorSubmit} className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input type="text" required placeholder="Organization Name" value={sponsorForm.orgName} onChange={e => setSponsorForm(p => ({ ...p, orgName: e.target.value }))} className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40" />
                        <input type="text" required placeholder="Contact Person" value={sponsorForm.contactPerson} onChange={e => setSponsorForm(p => ({ ...p, contactPerson: e.target.value }))} className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40" />
                      </div>
                      <select value={sponsorForm.tier} onChange={e => setSponsorForm(p => ({ ...p, tier: e.target.value as SponsorTier }))} required className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 bg-white">
                        <option value="">Select Tier</option>
                        {event.sponsorshipTiers.map(t => <option key={t.tier} value={t.tier}>{t.tier} {t.amount > 0 ? `(${currencySymbol(t.currency)}${t.amount.toLocaleString()})` : '(Custom)'}</option>)}
                      </select>
                      <label className="flex items-center gap-2 text-[12px] text-gray-600 cursor-pointer">
                        <input type="checkbox" required checked={sponsorForm.agreed} onChange={e => setSponsorForm(p => ({ ...p, agreed: e.target.checked }))} className="rounded" />
                        I agree to the sponsorship terms and conditions
                      </label>
                      <div className="flex items-center gap-3 mt-1">
                        <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white font-semibold text-[13px] rounded-lg hover:bg-indigo-700 transition-all shadow-sm"><Sparkles size={14} /> Submit Application</button>
                        <button type="button" onClick={() => setShowSponsorForm(false)} className="text-[13px] text-gray-500 hover:text-gray-700">Cancel</button>
                      </div>
                    </form>
                  </div>
                )}
                {sponsorSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-green-50/60 border border-green-200 text-center">
                    <CheckCircle2 size={24} className="text-green-500 mx-auto mb-2" />
                    <p className="text-[14px] font-bold text-gray-900">Sponsorship application submitted!</p>
                    <p className="text-[12px] text-gray-500 mt-1">Our team will review your application within 48 hours.</p>
                  </div>
                )}
              </section>
            )}

            {/* ═══ PARTICIPATION ACTION BUTTONS ═══ */}
            {canRegister && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <p style={{ fontSize: 17 }} className="text-gray-900 mb-4">Participate</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Call for Papers */}
                  <button
                    onClick={() => setShowPaperModal(true)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                      <FileText size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 group-hover:text-purple-700 transition-colors" style={{ fontSize: 14, fontWeight: 700 }}>Submit a Paper</p>
                      <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Submit your research for conference proceedings</p>
                    </div>
                  </button>

                  {/* Apply as Speaker */}
                  <button
                    onClick={() => setShowSpeakerModal(true)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                      <Mic2 size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-900 group-hover:text-blue-700 transition-colors" style={{ fontSize: 14, fontWeight: 700 }}>Apply as Speaker</p>
                      <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Propose a talk or presentation topic</p>
                    </div>
                  </button>

                  {/* Nominate Team (Company only) */}
                  {userRole === 'Company' && (
                    <button
                      onClick={() => setShowNominateModal(true)}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/40 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center shrink-0 group-hover:bg-cyan-100 transition-colors">
                        <Users size={18} className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-gray-900 group-hover:text-cyan-700 transition-colors" style={{ fontSize: 14, fontWeight: 700 }}>Nominate Team</p>
                        <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Register employees from your organization</p>
                      </div>
                    </button>
                  )}
                </div>
              </section>
            )}

            {/* ═══ POST-EVENT: Reviews & Feedback ═══ */}
            {isCompleted && event.postEvent && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Event Recap</h2>

                {/* Media links */}
                {event.postEvent.mediaLinks && event.postEvent.mediaLinks.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-5">
                    {event.postEvent.mediaLinks.map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[13px] font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                        {link.label.includes('Recording') ? <Play size={14} /> : <Image size={14} />}
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}

                {/* Testimonials */}
                {event.postEvent.testimonials && event.postEvent.testimonials.length > 0 && (
                  <div className="space-y-3 mb-5">
                    <h3 className="text-[14px] font-semibold text-gray-500">Testimonials</h3>
                    {event.postEvent.testimonials.map((t, i) => (
                      <div key={i} className="p-3 rounded-lg border-l-4 border-indigo-300 bg-indigo-50/30">
                        <p className="text-[13px] text-gray-600 italic leading-relaxed">"{t.quote}"</p>
                        <p className="text-[12px] font-semibold text-gray-800 mt-1.5">— {t.name}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Shared Ratings & Reviews component */}
                <FeedbackReviews
                  entityId={event.id}
                  entityType="event"
                  entityName={event.title}
                  entityLabel="event"
                  reviews={getReviewsForEntity(event.id, 'event')}
                  canReview={!!event.isRegistered}
                  title="Attendee Reviews"
                />
              </section>
            )}

            {/* Tags */}
            {event.tags.length > 0 && (
              <section className="pb-7">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map(tag => <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">{tag}</span>)}
                </div>
              </section>
            )}
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* Featured upsell banner */}
              {!event.isFeatured && canRegister && userRole === 'Professional' && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2"><Sparkles size={14} className="text-amber-600" /><span className="text-[13px] font-bold text-amber-700">Promote this Event</span></div>
                  <p className="text-[12px] text-amber-600/80 leading-relaxed mb-3">Highlight your event for maximum visibility. Get carousel placement, search boost, and email inclusion.</p>
                  <button className="w-full py-2 bg-amber-600 text-white text-[12px] font-bold rounded-lg hover:bg-amber-700 transition-colors">Upgrade to Featured</button>
                </div>
              )}

              {/* Event Details */}
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Event Details</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Calendar size={11} /> Date & Time</div>
                    <p className="text-[13px] text-gray-900 font-semibold">{fullDate}</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{event.startTime} – {event.endTime}</p>
                    {event.timezone && <p className="text-[11px] text-gray-400 mt-0.5">{event.timezone}</p>}
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{event.format === 'Virtual' ? <Globe size={11} /> : <MapPin size={11} />} Location</div>
                    <p className="text-[13px] text-gray-900 font-semibold">{event.format} Event</p>
                    <p className="text-[12px] text-gray-500 mt-0.5">{event.format === 'Virtual' ? 'Link provided upon registration' : event.location}</p>
                    {event.platformLink && <a href={event.platformLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-indigo-600 font-medium hover:underline mt-1"><Globe size={11} /> Join Link</a>}
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Users size={11} /> Target Audience</div>
                    <p className="text-[13px] text-gray-900 font-medium">{event.targetAudience === 'Both' ? 'Students & Professionals' : event.targetAudience}</p>
                  </div>
                  {event.registrationDeadline && (
                    <><div className="h-px bg-gray-100" /><div>
                      <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Calendar size={11} /> Registration Deadline</div>
                      <p className="text-[13px] text-gray-900 font-semibold">{event.registrationDeadline}</p>
                    </div></>
                  )}
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Languages</div>
                    <div className="flex flex-wrap gap-1.5">
                      {event.languages.map(lang => <span key={lang} className="text-[12px] font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{lang}</span>)}
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Host info */}
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-3">Hosted By</h3>
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 shrink-0 group-hover:border-indigo-200 transition-colors">
                    {event.host.avatarUrl ? <ImageWithFallback src={event.host.avatarUrl} alt={event.host.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[14px] font-bold text-gray-400">{event.host.name[0]}</div>}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5"><h4 className="text-[13px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{event.host.name}</h4>{event.host.isVerified && <CheckCircle2 size={12} className="text-blue-500" />}</div>
                    <span className="block text-[11px] text-gray-400 font-medium text-left">{event.host.type}</span>
                  </div>
                </button>
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex items-center"><button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-red-600 transition-colors"><Flag size={12} /> Report this event</button></div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ SIMILAR EVENTS ═══ */}
      <SimilarSection
        title="Similar Events"
        accent="indigo"
        exploreLabel="Explore more in Events"
        onExploreClick={() => onNavigate?.('Network')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_EVENTS
            .filter(e => e.id !== event.id && (e.type === event.type || e.tags.some(t => event.tags.includes(t))))
            .slice(0, 2)
            .map(e => (
              <EventCard
                key={e.id}
                event={e}
                onClick={(id) => onNavigate?.('EventDetails', { eventId: id })}
                compact
              />
            ))}
        </div>
      </SimilarSection>

      {/* ═══ REGISTRATION MODAL ═══ */}
      {showRegModal && (
        <Portal><div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={(e) => e.target === e.currentTarget && regStep !== 'confirmed' && closeModal()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[17px] font-bold text-gray-900">
                  {regStep === 'select-tier' && 'Select Your Ticket'}
                  {regStep === 'details' && 'Your Details'}
                  {regStep === 'payment' && 'Payment'}
                  {regStep === 'confirmed' && 'You\'re In!'}
                </h2>
                <p className="text-[12px] text-gray-500 mt-0.5 truncate">{event.title}</p>
              </div>
              {regStep !== 'confirmed' && (
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"><X size={18} /></button>
              )}
            </div>

            {/* ── Step: Select Tier ── */}
            {regStep === 'select-tier' && hasTickets && (
              <div className="px-6 py-5">
                <div className="flex flex-col gap-2.5 mb-6">
                  {event.ticketCategories!.map(ticket => {
                    const soldOut = ticket.soldCount >= ticket.maxQuantity;
                    const isSelected = selectedTierId === ticket.id;
                    return (
                      <button
                        key={ticket.id}
                        disabled={soldOut}
                        onClick={() => setSelectedTierId(ticket.id)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center gap-4 ${
                          soldOut ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                          : isSelected ? 'border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                          : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                        }`}
                      >
                        {/* Radio indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          isSelected ? 'border-indigo-500' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[14px] font-bold text-gray-900">{ticket.name}</span>
                            <span className="text-[14px] font-bold text-gray-900">
                              {currencySymbol(ticket.currency)}{ticket.price}
                            </span>
                          </div>
                          {ticket.description && <p className="text-[12px] text-gray-500">{ticket.description}</p>}
                          <div className="flex items-center gap-2 mt-1 text-[11px]">
                            {ticket.discountPercent && <span className="font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">{ticket.discountPercent}% off</span>}
                            {soldOut ? (
                              <span className="font-bold text-red-600">Sold Out</span>
                            ) : (
                              <span className="text-gray-400 font-medium">{ticket.maxQuantity - ticket.soldCount} remaining</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleTierNext}
                  disabled={!selectedTierId}
                  className="w-full py-3 bg-indigo-600 text-white font-bold text-[14px] rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* ── Step: Details ── */}
            {regStep === 'details' && (
              <form onSubmit={handleDetailsNext} className="px-6 py-5">
                {selectedTicket && !event.isFree && (
                  <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <Ticket size={14} className="text-indigo-500" />
                      <span className="text-[13px] font-bold text-indigo-700">{selectedTicket.name}</span>
                    </div>
                    <span className="text-[15px] font-bold text-indigo-700">{currencySymbol(selectedTicket.currency)}{selectedTicket.price}</span>
                  </div>
                )}
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Full Name *</label>
                    <input type="text" required value={regForm.name} onChange={e => setRegForm(p => ({ ...p, name: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" placeholder="Jane Doe" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Email *</label>
                    <input type="email" required value={regForm.email} onChange={e => setRegForm(p => ({ ...p, email: e.target.value }))}
                      className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" placeholder="jane@example.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Designation</label>
                      <input type="text" value={regForm.designation} onChange={e => setRegForm(p => ({ ...p, designation: e.target.value }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" placeholder="Psychologist" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Organization</label>
                      <input type="text" value={regForm.organization} onChange={e => setRegForm(p => ({ ...p, organization: e.target.value }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" placeholder="University" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white font-bold text-[14px] rounded-xl hover:bg-indigo-700 transition-all">
                    {event.isFree || !hasTickets ? 'Confirm RSVP' : 'Continue to Payment'}
                  </button>
                  <button type="button" onClick={() => {
                    if (hasTickets && !event.isFree) setRegStep('select-tier');
                    else closeModal();
                  }} className="px-4 py-3 text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors">Back</button>
                </div>
              </form>
            )}

            {/* ── Step: Payment (demo) ── */}
            {regStep === 'payment' && selectedTicket && (
              <div className="px-6 py-5">
                {/* Order summary */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-semibold text-gray-700">Order Summary</span>
                    <span className="text-[11px] text-gray-400">1 ticket</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-200">
                    <span className="text-[14px] text-gray-700">{selectedTicket.name}</span>
                    <span className="text-[14px] text-gray-900 font-semibold">{currencySymbol(selectedTicket.currency)}{selectedTicket.price}</span>
                  </div>
                  {selectedTicket.discountPercent && (
                    <div className="flex items-center justify-between py-2 border-t border-gray-200">
                      <span className="text-[13px] text-green-600">Discount ({selectedTicket.discountPercent}%)</span>
                      <span className="text-[13px] text-green-600 font-semibold">-{currencySymbol(selectedTicket.currency)}{(selectedTicket.price * selectedTicket.discountPercent / 100).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-3 border-t-2 border-gray-200 mt-1">
                    <span className="text-[15px] font-bold text-gray-900">Total</span>
                    <span className="text-[18px] font-extrabold text-gray-900">
                      {currencySymbol(selectedTicket.currency)}
                      {selectedTicket.discountPercent
                        ? (selectedTicket.price * (1 - selectedTicket.discountPercent / 100)).toFixed(2)
                        : selectedTicket.price}
                    </span>
                  </div>
                </div>

                {/* Demo payment form */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard size={15} className="text-gray-400" />
                    <span className="text-[13px] font-semibold text-gray-700">Payment Details</span>
                    <span className="ml-auto text-[10px] text-gray-400 flex items-center gap-1"><ShieldCheck size={10} /> Secure</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-mono" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="MM / YY" defaultValue="12 / 28" className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-mono" />
                      <input type="text" placeholder="CVC" defaultValue="123" className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all font-mono" />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic">This is a demo payment. No real charges will be made.</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePayment}
                    disabled={paymentProcessing}
                    className="flex-1 py-3 bg-indigo-600 text-white font-bold text-[14px] rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {paymentProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Pay {currencySymbol(selectedTicket.currency)}{selectedTicket.discountPercent ? (selectedTicket.price * (1 - selectedTicket.discountPercent / 100)).toFixed(2) : selectedTicket.price}</>
                    )}
                  </button>
                  <button onClick={() => setRegStep('details')} className="px-4 py-3 text-[14px] font-medium text-gray-500 hover:text-gray-700 transition-colors">Back</button>
                </div>
              </div>
            )}

            {/* ── Step: Confirmed ── */}
            {regStep === 'confirmed' && (
              <div className="px-6 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-[20px] font-extrabold text-gray-900 mb-1.5">Registration Confirmed!</h3>
                <p className="text-[14px] text-gray-500 mb-6 max-w-[320px] mx-auto">
                  {event.isFree || !hasTickets
                    ? 'You\'re all set. A confirmation has been sent to your email.'
                    : 'Payment successful! Your ticket and QR code have been sent to your email.'}
                </p>

                {/* ── Event Ticket ── compact horizontal layout ── */}
                <div className="mx-auto max-w-[440px] bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden mb-6">
                  <div className="h-1 bg-gradient-to-r from-[#1e40af] to-[#4338ca]" />
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.12em]">PsycHIRE Event Pass</span>
                      <Ticket size={13} className="text-indigo-400" />
                    </div>
                    <p className="text-[14px] font-bold text-gray-900 text-left leading-snug mb-3">{event.title}</p>

                    <div className="flex gap-5 items-start">
                      {/* Left — details */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                            <p className="text-[11px] font-semibold text-gray-800 truncate">{fullDate}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Time</p>
                            <p className="text-[11px] font-semibold text-gray-800">{event.startTime}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Venue</p>
                            <p className="text-[11px] text-gray-700 truncate">{event.format === 'Virtual' ? 'Virtual Event' : event.location || 'TBA'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Attendee</p>
                            <p className="text-[11px] font-semibold text-gray-800 truncate">{regForm.name || 'Attendee'}</p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">Ticket</p>
                          {selectedTicket && !event.isFree
                            ? <p className="text-[12px] font-bold text-indigo-700">{selectedTicket.name} — {currencySymbol(selectedTicket.currency)}{selectedTicket.price}</p>
                            : <p className="text-[12px] font-bold text-emerald-600">Free Entry</p>}
                        </div>
                      </div>

                      {/* Vertical divider */}
                      <div className="w-px self-stretch bg-gray-200 mx-0 relative">
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gray-100" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gray-100" />
                      </div>

                      {/* Right — QR */}
                      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                        <div className="w-[100px] h-[100px] rounded-xl p-1.5">
                          <svg viewBox="0 0 100 100" className="w-full h-full">
                            <rect x="0" y="0" width="28" height="28" fill="#1e1b4b"/>
                            <rect x="4" y="4" width="20" height="20" fill="white"/>
                            <rect x="8" y="8" width="12" height="12" fill="#1e1b4b"/>
                            <rect x="72" y="0" width="28" height="28" fill="#1e1b4b"/>
                            <rect x="76" y="4" width="20" height="20" fill="white"/>
                            <rect x="80" y="8" width="12" height="12" fill="#1e1b4b"/>
                            <rect x="0" y="72" width="28" height="28" fill="#1e1b4b"/>
                            <rect x="4" y="76" width="20" height="20" fill="white"/>
                            <rect x="8" y="80" width="12" height="12" fill="#1e1b4b"/>
                            {Array.from({length:12},(_,r)=>Array.from({length:12},(_,c)=>{const x=32+c*5,y=32+r*5,s=(r*17+c*31+42)%10;return s>3&&x<70&&y<70?<rect key={`${r}${c}`} x={x} y={y} width="3.5" height="3.5" rx=".4" fill="#312e81"/>:null}))}
                            <circle cx="50" cy="50" r="9" fill="white"/><circle cx="50" cy="50" r="7" fill="#1e40af"/>
                            <text x="50" y="53" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="system-ui">P</text>
                          </svg>
                        </div>
                        <p className="text-[7px] font-mono text-gray-400 tracking-wider">{event.id.toUpperCase().slice(0,6)}-{Date.now().toString(36).slice(-4).toUpperCase()}</p>
                        <p className="text-[8px] text-gray-400">Scan at entry</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 max-w-[440px] mx-auto">
                  <button
                    onClick={handleAddToCalendar}
                    className="w-full py-2.5 bg-indigo-600 text-white font-bold text-[13px] rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <CalendarPlus size={15} /> Add to Calendar
                  </button>
                  <button
                    onClick={closeModal}
                    className="w-full py-2.5 bg-gray-100 text-gray-700 font-semibold text-[13px] rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div></Portal>
      )}

      <ConfirmDialog
        isOpen={showUnsaveConfirm}
        onClose={() => setShowUnsaveConfirm(false)}
        onConfirm={() => { setIsSaved(false); toastBookmarkRemoved('event'); }}
        title="Remove from Saved?"
        description="This event will be removed from your saved items. You can always save it again later."
        confirmLabel="Unsave"
        variant="warning"
        icon={Bookmark}
      />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={event.title} subtitle="Share this event" />
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} entityType="Event" entityTitle={event.title} />

      {/* Event Participation Modals */}
      <CallForPapersModal open={showPaperModal} onClose={() => setShowPaperModal(false)} eventTitle={event.title} />
      <SpeakerApplicationModal open={showSpeakerModal} onClose={() => setShowSpeakerModal(false)} eventTitle={event.title} />
      <NominateEmployeesModal open={showNominateModal} onClose={() => setShowNominateModal(false)} context="event" targetTitle={event.title} />
    </div>
  );
}
