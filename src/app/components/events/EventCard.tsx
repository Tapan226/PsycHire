import React, { useState } from 'react';
import { Event, EventStatus } from '@/app/data/events';
import { Calendar, MapPin, Globe, Bookmark, Share2, ArrowRight, CheckCircle2, Users, TrendingUp, Sparkles, Flame, Star, Clock } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { FeaturedChip } from '@/app/components/FeaturedChip';
import { toastBookmarkAdded, toastBookmarkRemoved } from '@/app/components/shared/toasts';

interface EventCardProps {
  event: Event;
  onClick: (eventId: string) => void;
  compact?: boolean;
  onShare?: (eventId: string) => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  'Live':                 { label: 'Live',               color: 'text-green-700',  bg: 'bg-green-50',   border: 'border-green-200' },
  'Registration Open':    { label: 'Registration Open',  color: 'text-emerald-700',bg: 'bg-emerald-50', border: 'border-emerald-200' },
  'Registration Closed':  { label: 'Reg. Closed',        color: 'text-orange-700', bg: 'bg-orange-50',  border: 'border-orange-200' },
  'Event Completed':      { label: 'Completed',          color: 'text-gray-500',   bg: 'bg-gray-50',    border: 'border-gray-200' },
  'Review Phase':         { label: 'In Review',          color: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-200' },
  'Draft':                { label: 'Draft',              color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200' },
  'Pending Approval':     { label: 'Pending',            color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200' },
};

export function EventCard({ event, onClick, compact = false, onShare }: EventCardProps) {
  const [isSaved, setIsSaved] = useState(event.isSaved || false);

  const dateObj = new Date(event.startDate);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();
  const statusStyle = STATUS_CONFIG[event.status] || STATUS_CONFIG['Live'];
  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendeesCount : null;
  const fillingUp = spotsLeft !== null && spotsLeft > 0 && spotsLeft < (event.maxAttendees! * 0.15);

  const canRegister = ['Live', 'Registration Open'].includes(event.status);
  const ctaLabel = canRegister ? (event.isFree ? 'RSVP' : 'Get Tickets') : event.status === 'Event Completed' ? 'View Recap' : 'Closed';
  const ctaDisabled = !canRegister && event.status !== 'Event Completed';

  // Additional tag logic
  const isHighlyRated = event.postEvent?.averageRating && event.postEvent.averageRating >= 4.5;
  const isUpcoming = (() => {
    const now = new Date();
    const start = new Date(event.startDate);
    const daysUntil = Math.floor((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntil > 0 && daysUntil <= 14 && canRegister;
  })();

  return (
    <div
      onClick={() => onClick(event.id)}
      className={`bg-white rounded-xl border flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 h-full group relative cursor-pointer overflow-hidden
        ${event.isFeatured ? 'ring-1 ring-brand-secondary border-brand-secondary' : 'border-gray-100 hover:border-gray-200'}
      `}
    >
      {/* ── Banner ── */}
      {event.bannerUrl && (
        <div className={`relative w-full ${compact ? 'h-24' : 'h-36'} bg-gray-100 overflow-hidden shrink-0`}>
          <ImageWithFallback src={event.bannerUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {event.isFeatured && (
            <div className="absolute top-3 left-3"><FeaturedChip /></div>
          )}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {event.isSponsored && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/90 text-amber-900 border border-amber-500/30">
                <Sparkles size={8} /> Sponsored
              </span>
            )}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
              {statusStyle.label}
            </span>
          </div>
        </div>
      )}

      {/* ── Body ── */}
      <div className={`flex flex-col ${compact ? 'gap-3 p-4' : 'gap-3 sm:gap-4 p-4 sm:p-5'} flex-1`}>
        {!event.bannerUrl && (
          <div className="flex items-center gap-2 flex-wrap">
            {event.isFeatured && <FeaturedChip className="self-start" />}
            {event.isSponsored && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Sparkles size={8} /> Sponsored
              </span>
            )}
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>
              {statusStyle.label}
            </span>
          </div>
        )}

        {/* Title */}
        <p style={{ fontSize: compact ? 15 : 17 }} className="text-gray-900 group-hover:text-brand-primary transition-colors line-clamp-2">
          {event.title}
        </p>

        {/* Metadata */}
        <div className="flex flex-col gap-2 text-[13px] text-gray-500">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-brand-primary uppercase tracking-wide text-[11px]">{event.type}</span>
            <span className="text-gray-300">&middot;</span>
            <span className="font-medium text-gray-600">{event.format}</span>
            {event.isTrending && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-600">
                <TrendingUp size={10} /> Trending
              </span>
            )}
            {isHighlyRated && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600">
                <Star size={10} className="fill-amber-500" /> {event.postEvent!.averageRating}
              </span>
            )}
            {isUpcoming && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-600">
                <Clock size={10} /> Upcoming
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-gray-400 shrink-0" />
            <span>{month} {day}, {year} &middot; {event.startTime} – {event.endTime}</span>
          </div>
          {!compact && (
          <>
          <div className="flex items-center gap-2">
            {event.format === 'Virtual' ? <Globe size={13} className="text-gray-400 shrink-0" /> : <MapPin size={13} className="text-gray-400 shrink-0" />}
            <span className="truncate">
              {event.format === 'Virtual' ? 'Virtual Event' : event.location || 'In-Person'}
              {event.format === 'Hybrid' && ' (Hybrid)'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {event.host.avatarUrl ? (
              <div className="w-4 h-4 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                <ImageWithFallback src={event.host.avatarUrl} alt={event.host.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[7px] font-bold text-gray-400 shrink-0">{event.host.name[0]}</div>
            )}
            <span className="font-medium text-gray-700 truncate">{event.host.name}</span>
            {event.host.isVerified && <CheckCircle2 size={11} className="text-blue-500 shrink-0" />}
          </div>
          </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="mt-auto pt-4 border-t border-gray-100 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
          <div className="flex items-center gap-2">
            {event.isFree ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 uppercase tracking-wide border border-green-200">Free</span>
            ) : (
              <span className="text-[14px] font-bold text-gray-900">
                {event.ticketCategories && event.ticketCategories.length > 0
                  ? `From ${event.currency === 'USD' ? '$' : event.currency === 'INR' ? '₹' : event.currency}${Math.min(...event.ticketCategories.map(t => t.price))}`
                  : `${event.currency === 'USD' ? '$' : event.currency === 'INR' ? '₹' : event.currency}${event.price}`}
              </span>
            )}
            {fillingUp && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full border border-red-200">
                <Flame size={9} /> {spotsLeft} left
              </span>
            )}
            {/* Hover actions */}
            {!compact && (
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${isSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <button className="p-1.5 rounded-full text-gray-400 hover:text-brand-primary hover:bg-gray-50 transition-colors" title="Share" onClick={(e) => { e.stopPropagation(); onShare?.(event.id); }}>
                <Share2 size={14} />
              </button>
              <button className={`p-1.5 rounded-full transition-colors ${isSaved ? 'text-brand-primary bg-blue-50/50' : 'text-gray-400 hover:text-brand-primary hover:bg-gray-50'}`} title={isSaved ? 'Saved' : 'Save'} onClick={(e) => {
                e.stopPropagation();
                const next = !isSaved;
                setIsSaved(next);
                if (next) { toastBookmarkAdded('event'); } else { toastBookmarkRemoved('event'); }
              }}>
                <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            </div>
            )}
          </div>

          {event.isRegistered ? (
            <span className="flex items-center gap-1.5 text-[12px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200">
              <CheckCircle2 size={12} /> Registered
            </span>
          ) : (
            <button
              disabled={ctaDisabled && event.status !== 'Event Completed'}
              onClick={(e) => { e.stopPropagation(); onClick(event.id); }}
              className={`flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-lg transition-all ${
                ctaDisabled && event.status !== 'Event Completed'
                  ? 'text-gray-400 bg-gray-50 border border-gray-200 cursor-not-allowed'
                  : 'text-brand-primary hover:bg-blue-50 border border-blue-200'
              }`}
            >
              <ArrowRight size={13} />
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}