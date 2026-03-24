import React, { useState } from 'react';
import { Star, ThumbsUp, Send, X, ChevronDown } from 'lucide-react';
import type { Review, ReviewEntityType } from '@/app/data/reviews';
import { getAverageRating, getRatingDistribution } from '@/app/data/reviews';
import { Portal } from '@/app/components/shared/Portal';

/* ═══ Star Rating Input ═══ */
function StarRating({ rating, onChange, size = 20, readonly = false }: { rating: number; onChange?: (r: number) => void; size?: number; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <button
          key={i}
          onClick={() => !readonly && onChange?.(i)}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          disabled={readonly}
          type="button"
        >
          <Star size={size} fill={(hover || rating) >= i ? '#f59e0b' : 'none'} className={(hover || rating) >= i ? 'text-amber-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  );
}

/* ═══ Rating Summary Bar ═══ */
function RatingSummary({ avgRating, totalRatings, distribution }: { avgRating: number; totalRatings: number; distribution: number[] }) {
  const maxCount = Math.max(...distribution, 1);
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center">
      <div className="flex flex-col items-center">
        <p className="text-gray-900" style={{ fontSize: 40, fontWeight: 800 }}>{avgRating.toFixed(1)}</p>
        <StarRating rating={Math.round(avgRating)} readonly size={16} />
        <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>{totalRatings} {totalRatings === 1 ? 'review' : 'reviews'}</p>
      </div>
      <div className="flex-1 flex flex-col gap-1.5">
        {[5, 4, 3, 2, 1].map(star => {
          const count = distribution[5 - star] || 0;
          return (
            <div key={star} className="flex items-center gap-2">
              <p className="text-gray-500 w-3 text-right" style={{ fontSize: 11, fontWeight: 600 }}>{star}</p>
              <Star size={11} fill="#f59e0b" className="text-amber-400 shrink-0" />
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${(count / maxCount) * 100}%` }} />
              </div>
              <p className="text-gray-400 w-6 text-right" style={{ fontSize: 11 }}>{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ Single Review Card ═══ */
function ReviewCard({ review }: { review: Review }) {
  const [liked, setLiked] = useState(false);
  const initials = review.userName.split(' ').map(n => n[0]).join('').slice(0, 2);

  const roleColors: Record<string, { bg: string; text: string }> = {
    Student: { bg: 'bg-blue-100', text: 'text-blue-700' },
    Professional: { bg: 'bg-purple-100', text: 'text-purple-700' },
    Company: { bg: 'bg-teal-100', text: 'text-teal-700' },
  };
  const rc = roleColors[review.userRole] || roleColors.Student;

  return (
    <div className="p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full ${rc.bg} ${rc.text} flex items-center justify-center shrink-0`} style={{ fontSize: 12, fontWeight: 700 }}>
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{review.userName}</p>
              <p className="text-gray-400" style={{ fontSize: 11 }}>{review.userRole} · {review.date}</p>
            </div>
            <StarRating rating={review.rating} readonly size={13} />
          </div>
          <p className="text-gray-600 mt-2" style={{ fontSize: 13 }}>{review.comment}</p>
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1.5 mt-2 px-2 py-1 rounded-md transition-all ${liked ? 'text-[#1e40af] bg-blue-50' : 'text-gray-400 hover:text-gray-600'}`}
            style={{ fontSize: 11, fontWeight: 600 }}
          >
            <ThumbsUp size={12} fill={liked ? 'currentColor' : 'none'} /> Helpful ({review.helpful + (liked ? 1 : 0)})
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══ Write Review Modal ═══ */
function WriteReviewModal({ isOpen, onClose, onSubmit, entityName, entityLabel }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  entityName: string;
  entityLabel: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Rate & Review</p>
              <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>{entityName}</p>
            </div>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><X size={18} /></button>
          </div>
          <div className="p-6 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>How would you rate this {entityLabel}?</p>
              <StarRating rating={rating} onChange={setRating} size={28} />
              <p className="text-gray-400" style={{ fontSize: 12 }}>{rating === 0 ? 'Tap a star to rate' : ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>Your Review</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder={`Share your experience...`}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                style={{ fontSize: 13 }}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!rating || !comment.trim()}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${rating && comment.trim() ? 'bg-[#1e40af] text-white hover:bg-[#1e3a8a]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <Send size={14} /> Submit Review
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

/* ═══ Main Component ═══ */
export interface FeedbackReviewsProps {
  entityId: string;
  entityType: ReviewEntityType;
  entityName: string;
  /** Label shown in the modal, e.g. "mentor", "supervisor", "event" */
  entityLabel: string;
  reviews: Review[];
  /** Can the current user write a review? */
  canReview?: boolean;
  /** Called after a review is submitted */
  onReviewSubmitted?: (rating: number, comment: string) => void;
  /** Optional accent color override (defaults to brand primary) */
  accentColor?: string;
  /** Section title override */
  title?: string;
}

export function FeedbackReviews({
  entityId,
  entityType,
  entityName,
  entityLabel,
  reviews: initialReviews,
  canReview = false,
  onReviewSubmitted,
  title = 'Ratings & Reviews',
}: FeedbackReviewsProps) {
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [localReviews, setLocalReviews] = useState(initialReviews);

  const avgRating = getAverageRating(localReviews);
  const distribution = getRatingDistribution(localReviews);
  const displayReviews = showAll ? localReviews : localReviews.slice(0, 3);

  const handleSubmit = (rating: number, comment: string) => {
    const newReview: Review = {
      id: `rev-new-${Date.now()}`,
      entityId,
      entityType,
      userName: 'You',
      userAvatar: '',
      userRole: 'Student',
      rating,
      comment,
      date: 'Just now',
      helpful: 0,
    };
    setLocalReviews([newReview, ...localReviews]);
    onReviewSubmitted?.(rating, comment);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>{title}</p>
        {canReview && (
          <button onClick={() => setShowWriteReview(true)} className="px-4 py-2 rounded-xl bg-[#1e40af] text-white hover:bg-[#1e3a8a] transition-all flex items-center gap-2" style={{ fontSize: 12, fontWeight: 700 }}>
            <Star size={13} /> Write a Review
          </button>
        )}
      </div>

      {/* Summary */}
      {localReviews.length > 0 && (
        <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <RatingSummary avgRating={avgRating} totalRatings={localReviews.length} distribution={distribution} />
        </div>
      )}

      {/* Reviews List */}
      <div className="flex flex-col gap-3">
        {displayReviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {localReviews.length > 3 && !showAll && (
        <button onClick={() => setShowAll(true)} className="self-center flex items-center gap-1.5 px-4 py-2 text-[#1e40af] hover:text-[#1e3a8a] hover:bg-blue-50 rounded-xl transition-all" style={{ fontSize: 13, fontWeight: 600 }}>
          Show all {localReviews.length} reviews <ChevronDown size={14} />
        </button>
      )}

      {localReviews.length === 0 && (
        <div className="flex flex-col items-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <Star size={24} className="text-gray-300 mb-2" />
          <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 600 }}>No reviews yet</p>
          <p className="text-gray-400 mt-1" style={{ fontSize: 12 }}>Be the first to review this {entityLabel}</p>
        </div>
      )}

      <WriteReviewModal
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onSubmit={handleSubmit}
        entityName={entityName}
        entityLabel={entityLabel}
      />
    </div>
  );
}