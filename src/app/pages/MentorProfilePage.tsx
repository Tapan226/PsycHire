import React, { useState } from 'react';
import {
  ChevronLeft, MapPin, ShieldCheck, Star, Briefcase, GraduationCap,
  Clock, Globe, Calendar, Users, MessageSquare, CheckCircle2, X, Send,
  DollarSign, BookOpen, Target, Quote,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import { Chip } from '@/app/components/Chip';
import { getMentorById } from '@/app/data/mentorship';
import { Portal } from '@/app/components/shared/Portal';
import type { MentorshipFrequency, MentorshipCommitment } from '@/app/data/mentorship';
import { RUPEE } from '@/app/utils/currency';
import { getReviewsForEntity } from '@/app/data/reviews';
import { FeedbackReviews } from '@/app/components/shared/FeedbackReviews';

interface MentorProfilePageProps {
  mentorId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
}

type RequestStep = 'form' | 'confirmed';

export function MentorProfilePage({ mentorId, onBack, onNavigate }: MentorProfilePageProps) {
  const mentor = getMentorById(mentorId);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStep, setRequestStep] = useState<RequestStep>('form');
  const [requestForm, setRequestForm] = useState({
    goal: '',
    whyThisMentor: '',
    frequency: '' as MentorshipFrequency | '',
    commitment: '' as MentorshipCommitment | '',
  });

  if (!mentor) return <div className="p-10 text-center text-gray-500">Mentor not found.</div>;

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestStep('confirmed');
  };

  const closeModal = () => {
    setShowRequestModal(false);
    setRequestStep('form');
    setRequestForm({ goal: '', whyThisMentor: '', frequency: '', commitment: '' });
  };

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#4338ca] via-[#3730a3] to-[#312e81]">
        {/* Zone 1: Nav bar */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-indigo-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Mentors
            </button>
            <button
              onClick={() => onNavigate?.('Messages', { personId: 'p-1' })}
              className="p-2 text-indigo-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
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
                  <ImageWithFallback src={mentor.avatarUrl} alt={mentor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-semibold text-white">{mentor.name}</span>
                    {mentor.isVerified && <ShieldCheck size={14} className="text-green-300" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <UserGroupBadge group={mentor.userGroup} size="sm" />
                    {mentor.isVerifiedMentor && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-200 bg-amber-400/20 px-1.5 py-px rounded-full border border-amber-400/25">
                        <Star size={8} className="fill-amber-300 text-amber-300" /> Verified Mentor
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2">{mentor.domain}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {mentor.specializations.map(s => (
                  <span key={s} className="text-[11px] font-medium text-indigo-200 bg-white/[0.08] px-2.5 py-1 rounded-full border border-white/[0.1]">{s}</span>
                ))}
              </div>
            </div>

            {/* Right — CTA */}
            <div className="lg:w-auto shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              <div className="flex flex-col items-start lg:items-end gap-1">
                <span className="text-[22px] font-extrabold text-white">
                  {mentor.feePerSession === 0 ? 'Free' : `${RUPEE}${mentor.feePerSession}`}
                </span>
                <span className="text-[12px] text-indigo-200/70 font-medium">per session</span>
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-8 py-2.5 rounded-lg font-bold text-[14px] transition-all tracking-wide bg-white text-[#3730a3] hover:bg-indigo-50 shadow-sm active:scale-[0.97] duration-200 flex items-center gap-2 whitespace-nowrap"
              >
                <Send size={15} /> Request Mentorship
              </button>
              <span className="text-[12px] text-white/50 font-medium">
                <span className="text-white/80 font-semibold">{mentor.totalMentees}</span> guided &middot; <span className="text-white/80 font-semibold">{mentor.activeMentees}</span> active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto px-6 w-full py-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main */}
          <div>
            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-7 pb-7 border-b border-gray-100">
              <Briefcase size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{mentor.yearsOfExperience} years of experience</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span>{mentor.location}</span>
              <span className="text-gray-300 mx-1">&middot;</span>
              <span>{mentor.careerStage} Stage</span>
            </div>

            {/* About */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">About</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{mentor.bio}</p>
            </section>

            {/* Mentorship Focus Areas */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Mentorship Focus Areas</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mentor.focusAreas.map(area => (
                  <div key={area} className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50/70 border border-gray-100">
                    <Target size={14} className="text-brand-primary mt-0.5 shrink-0" />
                    <span className="text-[14px] text-gray-700 font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Experience</h2>
              <div className="flex flex-col gap-3">
                {mentor.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Briefcase size={14} className="text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">{exp.title}</p>
                      <p className="text-[13px] text-gray-500">{exp.organization}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{exp.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Education</h2>
              <div className="flex flex-col gap-3">
                {mentor.education.map((edu, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 mt-0.5">
                      <GraduationCap size={14} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">{edu.degree}</p>
                      <p className="text-[13px] text-gray-500">{edu.institution}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials */}
            {mentor.testimonials.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Testimonials</h2>
                <div className="flex flex-col gap-3">
                  {mentor.testimonials.map(t => (
                    <div key={t.id} className="p-4 rounded-xl bg-gray-50/70 border border-gray-100">
                      <div className="flex items-start gap-2.5">
                        <Quote size={16} className="text-gray-300 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[14px] text-gray-600 leading-relaxed italic">{t.text}</p>
                          <p className="text-[12px] font-semibold text-gray-800 mt-2">&mdash; {t.menteeName}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Ratings & Reviews */}
            <section className="pb-7">
              <FeedbackReviews
                entityId={mentorId}
                entityType="mentor"
                entityName={mentor.name}
                entityLabel="mentor"
                reviews={getReviewsForEntity(mentorId, 'mentor')}
                canReview
              />
            </section>
          </div>

          {/* ═══ SIDEBAR ═══ */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* Details */}
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Mentor Details</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Clock size={11} /> Availability</div>
                    <p className="text-[13px] text-gray-900 font-medium">{mentor.availability}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><DollarSign size={11} /> Fee</div>
                    <p className="text-[13px] text-gray-900 font-semibold">{mentor.feePerSession === 0 ? 'Free' : `${RUPEE}${mentor.feePerSession} per session`}</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Globe size={11} /> Mode</div>
                    <p className="text-[13px] text-gray-900 font-medium">Online Only</p>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Languages</div>
                    <div className="flex flex-wrap gap-1.5">
                      {mentor.languages.map(lang => (
                        <span key={lang} className="text-[12px] font-medium text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{lang}</span>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Users size={11} /> Mentees</div>
                    <p className="text-[13px] text-gray-900 font-medium">{mentor.totalMentees} total &middot; {mentor.activeMentees} active</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ REQUEST MENTORSHIP MODAL ═══ */}
      {showRequestModal && (
        <Portal><div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={(e) => e.target === e.currentTarget && requestStep !== 'confirmed' && closeModal()}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-[17px] font-bold text-gray-900">
                  {requestStep === 'form' ? 'Request Mentorship' : 'Request Sent!'}
                </h2>
                <p className="text-[12px] text-gray-500 mt-0.5 truncate">{mentor.name} &middot; {mentor.domain}</p>
              </div>
              {requestStep !== 'confirmed' && (
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"><X size={18} /></button>
              )}
            </div>

            {requestStep === 'form' && (
              <form onSubmit={handleSubmitRequest} className="px-6 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Your Goal *</label>
                    <input
                      type="text" required
                      value={requestForm.goal}
                      onChange={e => setRequestForm(p => ({ ...p, goal: e.target.value }))}
                      placeholder="e.g., Prepare for RCI licensure exam"
                      className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Why this mentor? *</label>
                    <textarea
                      required rows={3}
                      value={requestForm.whyThisMentor}
                      onChange={e => setRequestForm(p => ({ ...p, whyThisMentor: e.target.value }))}
                      placeholder="What about this mentor's background resonates with your goals?"
                      className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Preferred Frequency *</label>
                      <select
                        required
                        value={requestForm.frequency}
                        onChange={e => setRequestForm(p => ({ ...p, frequency: e.target.value as MentorshipFrequency }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="Weekly">Weekly</option>
                        <option value="Biweekly">Biweekly</option>
                        <option value="Monthly">Monthly</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-semibold text-gray-500">Commitment *</label>
                      <select
                        required
                        value={requestForm.commitment}
                        onChange={e => setRequestForm(p => ({ ...p, commitment: e.target.value as MentorshipCommitment }))}
                        className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white"
                      >
                        <option value="">Select...</option>
                        <option value="1 Session">1 Session (Trial)</option>
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white font-bold text-[14px] rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
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
                  Your mentorship request has been sent to {mentor.name}. You'll be notified when they respond.
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