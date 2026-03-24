import React, { useState } from 'react';
import {
  ChevronLeft, Clock, Users, Share2,
  ShieldCheck, ArrowRight,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Tooltip } from '@/app/components/Tooltip';
import { ConfidentialityModal } from '@/app/components/peer-pods/ConfidentialityModal';
import { MOCK_PODS, POD_TYPE_COLOR } from '@/app/data/peer-pods';

interface PodDetailPageProps {
  podId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

const STATUS_COLOR: Record<string, string> = {
  Open: 'text-green-700 bg-green-50 border-green-200',
  Full: 'text-gray-500 bg-gray-50 border-gray-200',
};

export function PodDetailPage({ podId, onBack, onNavigate, userRole }: PodDetailPageProps) {
  const pod = MOCK_PODS.find(p => p.id === podId);
  const [showConfidentiality, setShowConfidentiality] = useState(false);

  if (!pod) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p style={{ fontSize: 20 }} className="text-gray-900">Pod not found</p>
        <button onClick={onBack} className="mt-4 text-teal-600 hover:underline">Go Back</button>
      </div>
    );
  }

  const canJoin = pod.status === 'Open' && !pod.isJoined;
  const typeColor = POD_TYPE_COLOR[pod.podType];

  const handleJoinClick = () => {
    setShowConfidentiality(true);
  };

  const handleConfidentialityAgree = () => {
    setShowConfidentiality(false);
    onNavigate?.('InsidePod', { podId: pod.id });
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-in fade-in duration-500">

      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#0f766e] via-[#115e59] to-[#134e4a]">
        {/* Nav bar */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-teal-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Peer Pods
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content="Share Pod">
                <button className="p-2 text-teal-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Share2 size={17} /></button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Identity + Action */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left — Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${STATUS_COLOR[pod.status]}`}>
                  {pod.status}
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                  <ShieldCheck size={10} /> Confidential
                </span>
              </div>

              <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: '1.25' }} className="text-white tracking-tight mb-2.5">
                {pod.title}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${typeColor.bg} ${typeColor.text} ${typeColor.border}`}>
                  {pod.podType}
                </span>
                <span className="inline-flex items-center gap-1 bg-white/10 text-white/80 text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/10">
                  {pod.careerStage}
                </span>
              </div>
            </div>

            {/* Right — CTA */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              {pod.isJoined ? (
                <button
                  onClick={() => onNavigate?.('InsidePod', { podId: pod.id })}
                  className="bg-white text-teal-700 px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-teal-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 inline-flex items-center gap-2 w-full lg:w-auto justify-center"
                >
                  Enter Pod <ArrowRight size={15} />
                </button>
              ) : canJoin ? (
                <button
                  onClick={handleJoinClick}
                  className="bg-white text-teal-700 px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-teal-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 inline-flex items-center gap-2 w-full lg:w-auto justify-center"
                >
                  Join Pod <ArrowRight size={15} />
                </button>
              ) : (
                <span className="text-white/50 text-[14px] font-bold px-4 py-2.5">This pod is full</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto px-6 w-full py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

          {/* Main */}
          <div>
            {/* Quick metadata */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-8 pb-7 border-b border-gray-100">
              <Clock size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{pod.duration}</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <Users size={14} className="text-gray-400 shrink-0" />
              <span>{pod.memberCount}/{pod.maxMembers} members</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <span>{pod.availability}</span>
            </div>

            {/* About */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <p style={{ fontSize: 17 }} className="text-gray-900 mb-3">About this Pod</p>
              <p style={{ fontSize: 15 }} className="text-gray-600 whitespace-pre-line">{pod.description}</p>
            </section>

            {/* Members */}
            <section className="pb-7">
              <p style={{ fontSize: 17 }} className="text-gray-900 mb-4">Members ({pod.members.length})</p>
              <div className="flex flex-col gap-3">
                {pod.members.map(member => (
                  <button
                    key={member.id}
                    onClick={() => onNavigate?.('PersonProfile', { personId: member.id })}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left w-full group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      <ImageWithFallback src={member.avatarUrl} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14 }} className="text-gray-900 group-hover:text-teal-600 transition-colors truncate">
                        {member.name}
                      </p>
                      <p style={{ fontSize: 12 }} className="text-gray-500 truncate">{member.specialization} · {member.careerStage}</p>
                    </div>
                    {member.role === 'Creator' && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                        Creator
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* At a Glance */}
              <div>
                <div className="flex flex-col gap-3.5">
                  {[
                    { l: 'Pod Type', v: pod.podType },
                    { l: 'Duration', v: pod.duration },
                    { l: 'Career Stage', v: pod.careerStage },
                    { l: 'Primary Goal', v: pod.primaryGoal },
                    { l: 'Availability', v: pod.availability },
                  ].map(s => (
                    <div key={s.l}>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">{s.l}</span>
                      <span className="text-[13px] font-semibold text-gray-800">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Created by */}
              <div>
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Created By</span>
                <p style={{ fontSize: 13 }} className="text-gray-800">{pod.createdBy}</p>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Confidentiality note */}
              <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={14} className="text-teal-600" />
                  <span style={{ fontSize: 12 }} className="text-teal-700 font-bold uppercase tracking-wide">Confidential Space</span>
                </div>
                <p style={{ fontSize: 12 }} className="text-teal-700/80">
                  All pod discussions are confidential. Joining requires agreeing to the confidentiality agreement.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Confidentiality Modal */}
      <ConfidentialityModal
        isOpen={showConfidentiality}
        onClose={() => setShowConfidentiality(false)}
        onAgree={handleConfidentialityAgree}
        podTitle={pod.title}
      />
    </div>
  );
}