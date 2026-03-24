import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toastReportSubmitted } from '@/app/components/shared/toasts';

export interface ReportReason {
  id: string;
  label: string;
  description?: string;
}

const DEFAULT_REASONS: ReportReason[] = [
  { id: 'misleading', label: 'Misleading Information', description: 'Inaccurate details, false claims, or exaggerated descriptions' },
  { id: 'discriminatory', label: 'Discriminatory Content', description: 'Content that discriminates based on gender, caste, religion, etc.' },
  { id: 'spam', label: 'Spam or Duplicate', description: 'Repetitive, irrelevant, or promotional content' },
  { id: 'fraud', label: 'Fraud or Scam', description: 'Suspicious activity, fake listings, or phishing attempts' },
  { id: 'inappropriate', label: 'Inappropriate Content', description: 'Offensive, harmful, or violating community guidelines' },
  { id: 'other', label: 'Other', description: 'Something else not listed above' },
];

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string; // "Job", "Project", "Course", etc.
  entityTitle: string;
  reasons?: ReportReason[];
  accentColor?: string;
}

export function ReportModal({
  isOpen,
  onClose,
  entityType,
  entityTitle,
  reasons = DEFAULT_REASONS,
  accentColor = 'text-red-600',
}: ReportModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [step, setStep] = useState<'form' | 'success'>('form');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedReason(null);
      setAdditionalNotes('');
      setStep('form');
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    setStep('success');
    toastReportSubmitted();
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[440px] animate-fade-in overflow-hidden">
        {step === 'form' ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <Flag size={18} className="text-red-500" />
                </div>
                <div>
                  <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Report {entityType}</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>Help us keep PsycHIRE safe</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Entity being reported */}
            <div className="mx-6 mb-4 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
              <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-800 line-clamp-2" style={{ fontSize: 12, fontWeight: 500 }}>{entityTitle}</p>
            </div>

            {/* Reason Selection */}
            <div className="px-6 pb-3">
              <p className="text-gray-700 mb-3" style={{ fontSize: 13, fontWeight: 600 }}>Why are you reporting this?</p>
              <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto">
                {reasons.map(reason => (
                  <button
                    key={reason.id}
                    onClick={() => setSelectedReason(reason.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 ${
                      selectedReason === reason.id
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        selectedReason === reason.id ? 'border-red-500 bg-red-500' : 'border-gray-300'
                      }`}>
                        {selectedReason === reason.id && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`${selectedReason === reason.id ? 'text-red-700' : 'text-gray-800'}`} style={{ fontSize: 13, fontWeight: 600 }}>
                          {reason.label}
                        </p>
                        {reason.description && (
                          <p className="text-gray-500 mt-0.5 line-clamp-1" style={{ fontSize: 11 }}>{reason.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Notes */}
            {selectedReason && (
              <div className="px-6 pb-4 animate-fade-in">
                <p className="text-gray-600 mb-2" style={{ fontSize: 12, fontWeight: 600 }}>Additional details (optional)</p>
                <textarea
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Provide any additional context..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-300 transition-all"
                  style={{ fontSize: 13 }}
                  rows={3}
                />
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
                style={{ fontSize: 13, fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedReason}
                className={`px-5 py-2.5 rounded-xl text-white transition-all shadow-sm ${
                  selectedReason
                    ? 'bg-red-600 hover:bg-red-700 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Submit Report
              </button>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-green-500" />
            </div>
            <p className="text-gray-900 mb-2" style={{ fontSize: 18, fontWeight: 700 }}>Report Submitted</p>
            <p className="text-gray-500 max-w-[280px]" style={{ fontSize: 13 }}>
              Thank you for helping keep PsycHIRE safe. Our team will review this report within 24-48 hours.
            </p>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}