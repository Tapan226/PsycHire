import React, { useState } from 'react';
import { ArrowLeft, Users, MapPin, Clock, Zap, Share2 } from 'lucide-react';
import { ApplicationListView } from '@/app/components/shared/ApplicationListView';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { MOCK_REFERRALS } from '@/app/data/referrals';

/* ═══ Mock Respondents ═══ */

const MOCK_RESPONDENTS: Record<string, any[]> = {
  'ref-9': [
    {
      id: 'resp-1',
      name: 'Dr. Kavitha Menon',
      avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Jan 30, 2026',
      status: 'accepted',
      subtitle: 'Clinical Psychologist · 8 yrs experience',
      note: 'I have extensive experience with substance abuse counseling and currently work with a de-addiction program in Kerala. Happy to relocate for 6 months.',
    },
    {
      id: 'resp-2',
      name: 'Riya Sharma',
      avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Feb 1, 2026',
      status: 'shortlisted',
      subtitle: 'Counselling Psychologist · 4 yrs experience',
      note: 'I hold certification in addiction counseling from NIMHANS and have worked at two rehabilitation centers.',
    },
    {
      id: 'resp-3',
      name: 'Dr. Arun Pillai',
      avatarUrl: 'https://images.unsplash.com/photo-1659353887804-fc7f9313021a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Feb 3, 2026',
      status: 'pending',
      subtitle: 'Psychiatrist · 12 yrs experience',
      note: 'Currently heading the addiction psychiatry unit at AIIMS Delhi. Can provide both counseling and medical oversight.',
    },
    {
      id: 'resp-4',
      name: 'Sneha Gupta',
      avatarUrl: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Feb 5, 2026',
      status: 'rejected',
      subtitle: 'Psychology Graduate · 1 yr experience',
      note: 'Looking for hands-on experience in addiction counseling.',
    },
  ],
  'ref-1': [
    {
      id: 'resp-5',
      name: 'Dr. Priya Nair',
      avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Feb 11, 2026',
      status: 'shortlisted',
      subtitle: 'Child Psychologist · 6 yrs experience',
      note: 'I specialize in developmental assessments using WISC-V and Bayley-4 protocols.',
    },
    {
      id: 'resp-6',
      name: 'Dr. Anita Verma',
      avatarUrl: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Feb 12, 2026',
      status: 'pending',
      subtitle: 'Developmental Psychologist · 10 yrs experience',
      note: 'Currently running a developmental assessment clinic in Navi Mumbai. Available for the specified timeframe.',
    },
    {
      id: 'resp-7',
      name: 'Vikram Singh',
      avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
      appliedAt: 'Feb 14, 2026',
      status: 'pending',
      subtitle: 'Clinical Psychologist · 3 yrs experience',
      note: 'Completed my MPhil in Clinical Psychology with child psych specialization.',
    },
  ],
};

/* ═══ Component ═══ */

interface ReferralRespondentsPageProps {
  referralId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function ReferralRespondentsPage({ referralId, onBack, onNavigate }: ReferralRespondentsPageProps) {
  const referral = MOCK_REFERRALS.find(r => r.id === referralId);
  const respondents = MOCK_RESPONDENTS[referralId] || [];
  const [showShare, setShowShare] = useState(false);

  if (!referral) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f4f8] font-sans animate-fade-in px-4">
        <p className="text-gray-500" style={{ fontSize: 15 }}>Referral not found.</p>
        <button onClick={onBack} className="mt-4 text-brand-primary" style={{ fontSize: 14, fontWeight: 600 }}>Go back</button>
      </div>
    );
  }

  const urgencyColor = referral.urgency === 'Immediate' ? 'text-red-600 bg-red-50' : referral.urgency === 'Scheduled' ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50';

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f0f4f8] font-sans animate-fade-in">
      {/* ═══ Header ═══ */}
      <div className="w-full bg-white border-b border-gray-100 sticky top-[72px] z-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10 py-4 sm:py-5">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="mt-1 p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-gray-900 min-w-0 truncate" style={{ fontSize: 18, fontWeight: 700 }}>
                  {referral.title}
                </p>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${urgencyColor}`} style={{ fontSize: 11, fontWeight: 600 }}>
                  <Zap size={10} />
                  {referral.urgency}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                  <MapPin size={12} />
                  {referral.location}
                </span>
                <span className="inline-flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                  <Clock size={12} />
                  Deadline: {referral.deadline}
                </span>
                <span className="inline-flex items-center gap-1 text-gray-500" style={{ fontSize: 12 }}>
                  <Users size={12} />
                  {respondents.length} respondent{respondents.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowShare(true)}
              className="p-2 rounded-lg text-gray-500 hover:text-brand-primary hover:bg-blue-50 transition-colors shrink-0"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Content ═══ */}
      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
        <ApplicationListView
          applicants={respondents}
          entityType="Referral"
          statusOptions={[
            { value: 'pending', label: 'Pending', color: 'amber' },
            { value: 'shortlisted', label: 'Shortlisted', color: 'blue' },
            { value: 'accepted', label: 'Accepted', color: 'emerald' },
            { value: 'rejected', label: 'Declined', color: 'red' },
          ]}
          onViewProfile={(id) => onNavigate('PersonProfile', { personId: id })}
          emptyTitle="No respondents yet"
          emptyDescription="Share this referral to get responses from qualified professionals."
        />
      </div>

      {showShare && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          title={referral.title}
          entityType="Referral"
        />
      )}
    </div>
  );
}
