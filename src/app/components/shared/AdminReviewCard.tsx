import React, { useState } from 'react';
import { Check, X, Edit3, Eye, Clock, Building2, MapPin, Calendar, ChevronDown, Send, AlertTriangle } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export interface ReviewItem {
  id: string;
  title: string;
  type: string; // "Job", "Project", "Course", etc.
  submittedBy: {
    name: string;
    avatarUrl: string;
    organization?: string;
  };
  submittedAt: string;
  location?: string;
  deadline?: string;
  highlights?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
  rejectionMessage?: string;
}

interface AdminReviewCardProps {
  item: ReviewItem;
  onApprove: (id: string) => void;
  onReject: (id: string, message: string) => void;
  onSuggestEdit: (id: string, message: string) => void;
  onPreview: (id: string) => void;
  accentColor?: string;
}

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending Review' },
  approved: { bg: 'bg-green-50', text: 'text-green-700', label: 'Approved' },
  rejected: { bg: 'bg-red-50', text: 'text-red-600', label: 'Rejected' },
  changes_requested: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'Changes Requested' },
};

export function AdminReviewCard({
  item,
  onApprove,
  onReject,
  onSuggestEdit,
  onPreview,
}: AdminReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [actionMode, setActionMode] = useState<'none' | 'reject' | 'suggest_edit'>('none');
  const [message, setMessage] = useState('');

  const badge = STATUS_BADGE[item.status] || STATUS_BADGE.pending;

  const handleSubmitAction = () => {
    if (actionMode === 'reject') {
      onReject(item.id, message);
    } else if (actionMode === 'suggest_edit') {
      onSuggestEdit(item.id, message);
    }
    setActionMode('none');
    setMessage('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Main Row */}
      <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        {/* Submitter Avatar + Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
            <ImageWithFallback src={item.submittedBy.avatarUrl} alt={item.submittedBy.name} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 700 }}>
                {item.title}
              </p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md ${badge.bg} ${badge.text}`} style={{ fontSize: 10, fontWeight: 700 }}>
                {badge.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="flex items-center gap-1 text-gray-500" style={{ fontSize: 11, fontWeight: 500 }}>
                <Building2 size={11} />
                {item.submittedBy.organization || item.submittedBy.name}
              </span>
              {item.location && (
                <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: 11 }}>
                  <MapPin size={11} />
                  {item.location}
                </span>
              )}
              <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: 11 }}>
                <Clock size={11} />
                {item.submittedAt}
              </span>
            </div>
          </div>
        </div>

        {/* Type Badge */}
        <div className="hidden sm:flex items-center">
          <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600" style={{ fontSize: 11, fontWeight: 600 }}>
            {item.type}
          </span>
        </div>

        {/* Action Buttons */}
        {item.status === 'pending' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPreview(item.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-blue-50 transition-colors"
              title="Preview"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => setActionMode(actionMode === 'suggest_edit' ? 'none' : 'suggest_edit')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                actionMode === 'suggest_edit'
                  ? 'text-orange-600 bg-orange-50'
                  : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
              }`}
              title="Suggest Edits"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => setActionMode(actionMode === 'reject' ? 'none' : 'reject')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                actionMode === 'reject'
                  ? 'text-red-600 bg-red-50'
                  : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
              }`}
              title="Reject"
            >
              <X size={16} />
            </button>
            <button
              onClick={() => onApprove(item.id)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              <Check size={14} />
              Approve
            </button>
          </div>
        )}

        {/* Resolved Status Actions */}
        {item.status !== 'pending' && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onPreview(item.id)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-brand-primary hover:bg-blue-50 transition-colors"
              title="Preview"
            >
              <Eye size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Highlights Strip */}
      {item.highlights && item.highlights.length > 0 && (
        <div className="px-5 pb-3 flex items-center gap-2 overflow-x-auto">
          {item.highlights.map((h, i) => (
            <span key={i} className="shrink-0 px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100" style={{ fontSize: 10, fontWeight: 500 }}>
              {h}
            </span>
          ))}
        </div>
      )}

      {/* Rejection/Edit Message Display */}
      {(item.status === 'rejected' || item.status === 'changes_requested') && item.rejectionMessage && (
        <div className="px-5 pb-3">
          <div className={`px-4 py-3 rounded-xl border flex items-start gap-2.5 ${
            item.status === 'rejected' ? 'bg-red-50/50 border-red-100' : 'bg-orange-50/50 border-orange-100'
          }`}>
            <AlertTriangle size={13} className={`mt-0.5 shrink-0 ${item.status === 'rejected' ? 'text-red-400' : 'text-orange-400'}`} />
            <div className="min-w-0">
              <p className={item.status === 'rejected' ? 'text-red-600' : 'text-orange-600'} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.03em' }}>
                {item.status === 'rejected' ? 'REJECTION REASON' : 'CHANGES REQUESTED'}
              </p>
              <p className={item.status === 'rejected' ? 'text-red-700' : 'text-orange-700'} style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.5 }}>
                {item.rejectionMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Action Panel — Reject / Suggest Edit */}
      {actionMode !== 'none' && (
        <div className="px-5 pb-4 animate-fade-in">
          <div className={`p-4 rounded-xl border ${
            actionMode === 'reject'
              ? 'bg-red-50/50 border-red-100'
              : 'bg-orange-50/50 border-orange-100'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              {actionMode === 'reject' ? (
                <AlertTriangle size={14} className="text-red-500" />
              ) : (
                <Edit3 size={14} className="text-orange-500" />
              )}
              <p style={{ fontSize: 13, fontWeight: 700 }} className={actionMode === 'reject' ? 'text-red-700' : 'text-orange-700'}>
                {actionMode === 'reject' ? 'Rejection Reason' : 'Suggested Edits'}
              </p>
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={actionMode === 'reject' ? 'Explain why this listing is being rejected...' : 'Describe what changes are needed for compliance...'}
              className={`w-full px-4 py-3 rounded-lg border bg-white text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 transition-all ${
                actionMode === 'reject'
                  ? 'border-red-200 focus:ring-red-200 focus:border-red-300'
                  : 'border-orange-200 focus:ring-orange-200 focus:border-orange-300'
              }`}
              style={{ fontSize: 13 }}
              rows={3}
            />
            <div className="flex items-center justify-end gap-2 mt-3">
              <button
                onClick={() => { setActionMode('none'); setMessage(''); }}
                className="px-4 py-2 rounded-lg text-gray-500 hover:bg-white/80 transition-colors"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                disabled={!message.trim()}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-white transition-all shadow-sm ${
                  message.trim()
                    ? actionMode === 'reject'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                <Send size={12} />
                {actionMode === 'reject' ? 'Reject' : 'Send Suggestions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}