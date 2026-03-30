import React, { useState } from 'react';
import {
  ChevronLeft, MapPin, ShieldCheck, Star, Briefcase,
  Clock, Globe, Users, MessageSquare, CheckCircle2, X, Send,
  DollarSign, Target, Wifi, Award,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import { Chip } from '@/app/components/Chip';
import { getSupervisorById } from '@/app/data/supervision';
import type { SupervisionPurpose, SupervisionDomain, SupervisionFrequency, SupervisionSessionType } from '@/app/data/supervision';
import { SUPERVISION_DOMAINS, SUPERVISION_PURPOSES } from '@/app/data/supervision';
import { Portal } from '@/app/components/shared/Portal';
import { RUPEE } from '@/app/utils/currency';
import { getReviewsForEntity } from '@/app/data/reviews';
import { FeedbackReviews } from '@/app/components/shared/FeedbackReviews';

interface SupervisorProfilePageProps {
  supervisorId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

type RequestStep = 'form' | 'confirmed';

export function SupervisorProfilePage({ supervisorId, onBack, onNavigate, userRole }: SupervisorProfilePageProps) {
  const supervisor = getSupervisorById(supervisorId);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStep, setRequestStep] = useState<RequestStep>('form');
  const [requestForm, setRequestForm] = useState({
    goal: '',
    purpose: '' as SupervisionPurpose | '',
    domain: '' as SupervisionDomain | '',
    frequency: '' as SupervisionFrequency | '',
    sessionType: '' as SupervisionSessionType | '',
  });

  if (!supervisor) return <div className="p-10 text-center text-gray-500">Supervisor not found.</div>;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStep('confirmed');
  };

  const closeModal = () => {
    setShowRequestModal(false);
    setRequestStep('form');
    setRequestForm({ goal: '', purpose: '', domain: '', frequency: '', sessionType: '' });
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* COLORED HEADER */}
      <div className="w-full bg-gradient-to-br from-teal-800 via-teal-700 to-emerald-800">
        {/* Zone 1: Nav bar */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-teal-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Supervisors
            </button>
            <button
              onClick={() => onNavigate?.('Messages', { personId: 'p-1' })}
              className="p-2 text-teal-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              title="Message"
            >
              <MessageSquare size={17} />
            </button>
          </div>
        </div>

        {/* Zone 2: Identity + Action */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left — Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/[0.1] border-2 border-white/[0.15] shrink-0">
                  <ImageWithFallback src={supervisor.avatarUrl} alt={supervisor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-semibold text-white">{supervisor.name}</span>
                    {supervisor.isVerified && <ShieldCheck size={14} className="text-green-300" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <UserGroupBadge group={supervisor.userGroup} size="sm" />
                    {supervisor.isVerifiedSupervisor && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-purple-200 bg-purple-400/20 px-1.5 py-px rounded-full border border-purple-400/25">
                        <Star size={8} className="fill-purple-300 text-purple-300" /> Approved Supervisor
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2">{supervisor.domain}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {supervisor.specializations.map(s => (
                  <span key={s} className="text-[11px] font-medium text-teal-200 bg-white/[0.08] px-2.5 py-1 rounded-full border border-white/[0.1]">{s}</span>
                ))}
              </div>
            </div>

            {/* Right — CTA */}
            <div className="lg:w-auto shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              <div className="flex flex-col items-start lg:items-end gap-1">
                <span className="text-[22px] font-extrabold text-white">
                  {supervisor.isPaid ? `${RUPEE}${supervisor.feePerSession}` : 'Free'}
                </span>
                <span className="text-[12px] text-teal-200/70 font-medium">per session</span>
              </div>
              {userRole !== 'Admin' && userRole !== 'Company' && (
                <button
                  onClick={() => setShowRequestModal(true)}
                  className="px-8 py-2.5 rounded-lg font-bold text-[14px] transition-all tracking-wide bg-white text-teal-800 hover:bg-teal-50 shadow-sm active:scale-[0.97] duration-200 flex items-center gap-2 whitespace-nowrap"
                >
                  <Send size={15} /> Request Supervision
                </button>
              )}
              <span className="text-[12px] text-white/50 font-medium">
                <span className="text-white/80 font-semibold">{supervisor.totalSupervisees}</span> guided &middot; <span className="text-white/80 font-semibold">{supervisor.activeSupervisees}</span> active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-5xl mx-auto px-6 w-full py-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main */}
          <div>
            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-7 pb-7 border-b border-gray-100">
              <Briefcase size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{supervisor.yearsOfSupervisionExperience} years of supervision</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span>{supervisor.location}</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <Wifi size={14} className="text-gray-400 shrink-0" />
              <span>{supervisor.mode}</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <Users size={14} className="text-gray-400 shrink-0" />
              <span>{supervisor.sessionType}</span>
            </div>

            {/* About */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">About</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{supervisor.bio}</p>
            </section>

            {/* Supervision Style */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Supervision Style</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{supervisor.supervisionStyle}</p>
            </section>

            {/* Credentials */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Credentials</h2>
              <div className="flex flex-col gap-2.5">
                {supervisor.credentials.map((cred, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50/70 border border-gray-100">
                    <Award size={14} className="text-brand-primary mt-0.5 shrink-0" />
                    <span className="text-[14px] text-gray-700 font-medium">{cred}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Supervision Focus */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Supervision Purposes</h2>
              <div className="flex flex-wrap gap-2">
                {supervisor.purposes.map(purpose => (
                  <div key={purpose} className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50/70 border border-gray-100">
                    <Target size={14} className="text-brand-primary mt-0.5 shrink-0" />
                    <span className="text-[14px] text-gray-700 font-medium">{purpose}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Ratings & Reviews */}
            <section className="pb-7">
              <FeedbackReviews
                entityId={supervisorId}
                entityType="supervisor"
                entityName={supervisor.name}
                entityLabel="supervisor"
                reviews={getReviewsForEntity(supervisorId, 'supervisor')}
                canReview
              />
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Supervisor Details</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Clock size={11} /> Availability</div>
                    <p className="text-[13px] text-gray-900 font-medium">{supervisor.availability}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><DollarSign size={11} /> Fee</div>
                    <p className="text-[13px] text-gray-900 font-semibold">{supervisor.isPaid ? `${RUPEE}${supervisor.feePerSession} per session` : 'Free (Pro Bono)'}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Globe size={11} /> Mode</div>
                    <p className="text-[13px] text-gray-900 font-medium">{supervisor.mode}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Users size={11} /> Session Type</div>
                    <p className="text-[13px] text-gray-900 font-medium">{supervisor.sessionType}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Languages</div>
                    <div className="flex flex-wrap gap-1.5">
                      {supervisor.languages.map(lang => (
                        <span key={lang} className="text-[12px] font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{lang}</span>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Users size={11} /> Supervisees</div>
                    <p className="text-[13px] text-gray-900 font-medium">{supervisor.totalSupervisees} total &middot; {supervisor.activeSupervisees} active</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* REQUEST SUPERVISION MODAL */}
      {showRequestModal && (
        <Portal><div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={(e) => e.target === e.currentTarget && requestStep !== 'confirmed' && closeModal()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[17px] font-bold text-gray-900">
                  {requestStep === 'form' ? 'Request Supervision' : 'Request Sent!'}
                </h2>
                <p className="text-[12px] text-gray-500 mt-0.5 truncate">{supervisor.name} &middot; {supervisor.domain}</p>
              </div>
              {requestStep !== 'confirmed' && (
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"><X size={18} /></button>
              )}
            </div>

            {requestStep === 'form' && (
              <form onSubmit={handleSubmitRequest} className="px-6 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Goal *</label>
                    <input
                      type="text" required
                      value={requestForm.goal}
                      onChange={e => setRequestForm(p => ({ ...p, goal: e.target.value }))}
                      placeholder="e.g., Complete 200 clinical hours for RCI licensure"
                      className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Purpose *</label>
                      <select
                        required
                        value={requestForm.purpose}
                        onChange={e => setRequestForm(p => ({ ...p, purpose: e.target.value as SupervisionPurpose }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        {SUPERVISION_PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Domain *</label>
                      <select
                        required
                        value={requestForm.domain}
                        onChange={e => setRequestForm(p => ({ ...p, domain: e.target.value as SupervisionDomain }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        {SUPERVISION_DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Frequency *</label>
                      <select
                        required
                        value={requestForm.frequency}
                        onChange={e => setRequestForm(p => ({ ...p, frequency: e.target.value as SupervisionFrequency }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Biweekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Session Type *</label>
                      <select
                        required
                        value={requestForm.sessionType}
                        onChange={e => setRequestForm(p => ({ ...p, sessionType: e.target.value as SupervisionSessionType }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="1:1">1:1 Individual</option>
                        <option value="Group">Group</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-teal-600 text-white font-bold text-[14px] rounded-xl hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
                >
                  <Send size={15} /> Send Request
                </button>
              </form>
            )}

            {requestStep === 'confirmed' && (
              <div className="px-6 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} className="text-green-500" />
                </div>
                <h3 className="text-[20px] font-extrabold text-gray-900 mb-1.5">Request Sent!</h3>
                <p className="text-[14px] text-gray-500 mb-6 max-w-[320px] mx-auto">
                  Your supervision request has been sent to {supervisor.name}. You'll be notified when they respond.
                </p>
                <button
                  onClick={closeModal}
                  className="w-full max-w-[300px] mx-auto py-2.5 bg-gray-100 text-gray-700 font-semibold text-[13px] rounded-xl hover:bg-gray-200 transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div></Portal>
      )}
    </div>
  );
}