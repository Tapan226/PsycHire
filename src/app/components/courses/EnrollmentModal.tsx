import React, { useState } from 'react';
import {
  X, CheckCircle2, AlertTriangle, BookOpen, Clock, MapPin, Banknote,
  GraduationCap, ChevronRight, Shield, Sparkles, Users, Award,
} from 'lucide-react';
import type { Course } from '@/app/data/courses';
import { Portal } from '@/app/components/shared/Portal';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: () => void;
  course: Course;
}

type Step = 'prerequisites' | 'confirm' | 'success';

export function EnrollmentModal({ isOpen, onClose, onEnroll, course }: EnrollmentModalProps) {
  const [step, setStep] = useState<Step>('prerequisites');
  const [prereqsChecked, setPrereqsChecked] = useState<Record<number, boolean>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!isOpen) return null;

  const prereqItems = course.prerequisites
    ? course.prerequisites.split(/[.,;]/).map(s => s.trim()).filter(Boolean)
    : [];

  const hasPrereqs = prereqItems.length > 0;
  const allPrereqsMet = !hasPrereqs || prereqItems.every((_, i) => prereqsChecked[i]);

  const handleProceed = () => {
    if (step === 'prerequisites') setStep('confirm');
    else if (step === 'confirm') {
      setStep('success');
      onEnroll();
    }
  };

  const handleClose = () => {
    setStep('prerequisites');
    setPrereqsChecked({});
    setAgreedToTerms(false);
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 px-6 py-5 rounded-t-2xl z-10">
          <button onClick={handleClose} className="absolute top-4 right-4 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"><X size={18} /></button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              {step === 'success' ? <CheckCircle2 size={16} className="text-emerald-300" /> : <BookOpen size={16} className="text-purple-200" />}
            </div>
            <p className="text-purple-200" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em' }}>
              {step === 'prerequisites' ? 'STEP 1: PREREQUISITES' : step === 'confirm' ? 'STEP 2: CONFIRM ENROLLMENT' : 'ENROLLMENT CONFIRMED'}
            </p>
          </div>
          <p className="text-white" style={{ fontSize: 17, fontWeight: 700 }}>{course.title}</p>
          <p className="text-purple-200 mt-1" style={{ fontSize: 12 }}>{course.provider.name} {course.duration && `· ${course.duration}`}</p>
        </div>

        <div className="p-6">
          {/* ═══ PREREQUISITES STEP ═══ */}
          {step === 'prerequisites' && (
            <div className="flex flex-col gap-5">
              {hasPrereqs ? (
                <>
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <AlertTriangle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-amber-900" style={{ fontSize: 13, fontWeight: 600 }}>Prerequisite Check</p>
                      <p className="text-amber-700 mt-0.5" style={{ fontSize: 12 }}>Please confirm you meet the following requirements before enrolling.</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    {prereqItems.map((prereq, i) => (
                      <label key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${prereqsChecked[i] ? 'bg-purple-50/50 border-purple-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                        <input type="checkbox" checked={!!prereqsChecked[i]} onChange={e => setPrereqsChecked(prev => ({ ...prev, [i]: e.target.checked }))} className="mt-0.5 w-4 h-4 accent-purple-600 rounded" />
                        <p className="text-gray-700" style={{ fontSize: 13 }}>{prereq}</p>
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-emerald-900" style={{ fontSize: 13, fontWeight: 600 }}>No Prerequisites Required</p>
                    <p className="text-emerald-700 mt-0.5" style={{ fontSize: 12 }}>This course is open to all learners. You can proceed to enrollment.</p>
                  </div>
                </div>
              )}

              {/* Course summary */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { icon: <Clock size={13} />, label: 'Duration', value: course.duration },
                  { icon: <MapPin size={13} />, label: 'Mode', value: course.mode },
                  { icon: <Banknote size={13} />, label: 'Price', value: course.isFree ? 'Free' : `${course.currency} ${course.price.toLocaleString()}` },
                  { icon: <Award size={13} />, label: 'Outcome', value: course.outcomes?.join(', ') || 'Certificate' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-400">{item.icon}</span>
                    <div>
                      <p className="text-gray-400" style={{ fontSize: 10, fontWeight: 600 }}>{item.label}</p>
                      <p className="text-gray-700" style={{ fontSize: 12, fontWeight: 600 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={handleProceed} disabled={!allPrereqsMet} className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${allPrereqsMet ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} style={{ fontSize: 13, fontWeight: 700 }}>
                Continue to Enrollment <ChevronRight size={15} />
              </button>
            </div>
          )}

          {/* ═══ CONFIRM STEP ═══ */}
          {step === 'confirm' && (
            <div className="flex flex-col gap-5">
              <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100">
                <p className="text-purple-900" style={{ fontSize: 14, fontWeight: 700 }}>Enrollment Summary</p>
                <div className="mt-3 flex flex-col gap-2">
                  <div className="flex justify-between">
                    <p className="text-gray-600" style={{ fontSize: 13 }}>Course</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{course.title}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600" style={{ fontSize: 13 }}>Provider</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{course.provider.name}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600" style={{ fontSize: 13 }}>Duration</p>
                    <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{course.duration}</p>
                  </div>
                  <div className="border-t border-purple-200/50 my-1" />
                  <div className="flex justify-between">
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Total</p>
                    <p className="text-purple-700" style={{ fontSize: 14, fontWeight: 700 }}>{course.isFree ? 'Free' : `${course.currency} ${course.price.toLocaleString()}`}</p>
                  </div>
                </div>
                {course.earlyBirdDiscount && (
                  <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 rounded-lg border border-amber-100">
                    <Sparkles size={13} className="text-amber-600" />
                    <p className="text-amber-700" style={{ fontSize: 11, fontWeight: 600 }}>{course.earlyBirdDiscount}</p>
                  </div>
                )}
              </div>

              {!course.isFree && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-gray-700 mb-2" style={{ fontSize: 13, fontWeight: 600 }}>Payment</p>
                  <p className="text-gray-500" style={{ fontSize: 12 }}>Payment will be processed after admin approval of your enrollment. You will receive payment instructions via email.</p>
                  {course.paymentPlans && <p className="text-purple-600 mt-2" style={{ fontSize: 12, fontWeight: 600 }}>{course.paymentPlans}</p>}
                </div>
              )}

              <label className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-all">
                <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="mt-0.5 w-4 h-4 accent-purple-600 rounded" />
                <p className="text-gray-600" style={{ fontSize: 12 }}>
                  I agree to the course terms and conditions, including the refund policy and code of conduct. I confirm that all information provided is accurate.
                </p>
              </label>

              <div className="flex gap-3">
                <button onClick={() => setStep('prerequisites')} className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all" style={{ fontSize: 13, fontWeight: 600 }}>Back</button>
                <button onClick={handleProceed} disabled={!agreedToTerms} className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${agreedToTerms ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} style={{ fontSize: 13, fontWeight: 700 }}>
                  <Shield size={14} /> Confirm Enrollment
                </button>
              </div>
            </div>
          )}

          {/* ═══ SUCCESS STEP ═══ */}
          {step === 'success' && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <p className="text-gray-900 mb-1" style={{ fontSize: 18, fontWeight: 800 }}>You're Enrolled!</p>
              <p className="text-gray-500 max-w-sm" style={{ fontSize: 13 }}>
                Your enrollment in <span className="text-gray-700" style={{ fontWeight: 600 }}>{course.title}</span> has been confirmed.
                {!course.isFree && ' Payment instructions will be sent to your email.'}
              </p>
              <div className="flex items-center gap-3 mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100 w-full">
                <Users size={16} className="text-purple-600" />
                <div className="text-left">
                  <p className="text-purple-900" style={{ fontSize: 12, fontWeight: 600 }}>What's next?</p>
                  <p className="text-purple-700" style={{ fontSize: 11 }}>Check your enrolled courses in the Learning tab to track progress.</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-full mt-5 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>Done</button>
            </div>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}