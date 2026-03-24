import React from 'react';
import {
  MapPin, UserPlus, ShieldCheck, Check, Clock,
  MessageSquare, Handshake, Users as UsersIcon,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import type { Person } from '@/app/data/people';

interface PersonCardProps {
  person: Person;
  onClick?: () => void;
  onConnect?: (e: React.MouseEvent) => void;
  onMessage?: (e: React.MouseEvent) => void;
}

export function PersonCard({ person, onClick, onConnect, onMessage }: PersonCardProps) {
  const topSpec = person.specializations[0] ?? '';

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-cyan-200/60 transition-all duration-200 cursor-pointer group relative flex flex-col h-full"
    >
      <div className="px-4 pt-4 pb-3.5 flex flex-col gap-2.5 flex-1">
        {/* Avatar row */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-white shadow-sm">
            <ImageWithFallback src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p
                className="text-gray-900 group-hover:text-cyan-700 transition-colors truncate"
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                {person.name}
              </p>
              {person.isVerified && <ShieldCheck size={12} className="text-green-500 shrink-0" />}
            </div>
            <p className="text-gray-500 truncate mt-0.5" style={{ fontSize: 12 }}>
              {person.title}
            </p>
          </div>
          <UserGroupBadge group={person.userGroup} size="sm" />
        </div>

        {/* Meta line: Specialization · City */}
        <div className="flex items-center gap-1 text-gray-400 min-w-0" style={{ fontSize: 11 }}>
          {topSpec && (
            <>
              <span className="truncate text-gray-500" style={{ fontWeight: 600 }}>{topSpec}</span>
              {person.specializations.length > 1 && (
                <span className="shrink-0">+{person.specializations.length - 1}</span>
              )}
            </>
          )}
          {topSpec && person.city && <span className="shrink-0 mx-0.5">·</span>}
          {person.city && (
            <span className="inline-flex items-center gap-1 shrink-0">
              <MapPin size={10} />
              {person.city}
            </span>
          )}
        </div>

        {/* Tags: Collaboration + Activity + Mutual */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {person.openToCollaboration && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-100"
              style={{ fontSize: 10, fontWeight: 600 }}
            >
              <Handshake size={9} />
              Collaborate
            </span>
          )}
          {person.activityStatus && (
            <span
              className="inline-flex items-center gap-1 text-gray-400"
              style={{ fontSize: 10, fontWeight: 500 }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  person.activityStatus === 'Active Contributor' ? 'bg-green-400' : 'bg-amber-300'
                }`}
              />
              {person.activityStatus === 'Active Contributor' ? 'Active' : 'Recent'}
            </span>
          )}
          {person.mutualConnections > 0 && (
            <span
              className="inline-flex items-center gap-1 text-gray-400"
              style={{ fontSize: 10, fontWeight: 500 }}
            >
              <UsersIcon size={9} />
              {person.mutualConnections} mutual
            </span>
          )}
        </div>

        {/* Inline actions — bottom-anchored */}
        <div className="flex items-center gap-1.5 mt-auto pt-1" onClick={(e) => e.stopPropagation()}>
          {person.isConnected ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 text-green-600 border border-green-100"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              <Check size={10} /> Connected
            </span>
          ) : person.isPending ? (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              <Clock size={10} /> Pending
            </span>
          ) : (
            <button
              onClick={onConnect}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-100 hover:bg-cyan-100 transition-colors"
              style={{ fontSize: 11, fontWeight: 600 }}
            >
              <UserPlus size={10} /> Connect
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onMessage?.(e); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-cyan-700 hover:bg-cyan-50 border border-transparent hover:border-cyan-100 transition-colors ml-auto"
            title="Message"
          >
            <MessageSquare size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
