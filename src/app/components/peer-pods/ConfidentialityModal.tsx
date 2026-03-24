import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, ShieldCheck } from 'lucide-react';

interface ConfidentialityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  podTitle: string;
}

const AGREEMENTS = [
  {
    id: 'confidentiality',
    label: 'I agree to maintain strict confidentiality about everything shared within this pod. What is said in the pod stays in the pod.',
  },
  {
    id: 'no-client-info',
    label: 'I will not share any client-identifiable information. All case discussions will use de-identified or fictional scenarios only.',
  },
  {
    id: 'no-therapy',
    label: 'I understand this pod is a peer support space, not a therapy group. I will not provide or seek therapeutic intervention within this pod.',
  },
  {
    id: 'conduct',
    label: 'I commit to professional conduct, respectful communication, and maintaining the safety of this space for all members.',
  },
];

export function ConfidentialityModal({ isOpen, onClose, onAgree, podTitle }: ConfidentialityModalProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) return null;

  const allChecked = AGREEMENTS.every(a => checked[a.id]);

  const handleToggle = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-50 animate-fade-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
              <ShieldCheck size={18} className="text-teal-600" />
            </div>
            <p style={{ fontSize: 17 }} className="text-gray-900">Confidentiality Agreement</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5">
          <div className="bg-teal-50/50 border border-teal-100 rounded-xl p-4">
            <p style={{ fontSize: 14 }} className="text-teal-800">
              Before joining <span className="font-bold">{podTitle}</span>, please read and agree to each of the following commitments. These are essential for maintaining a safe peer support environment.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {AGREEMENTS.map(agreement => (
              <label
                key={agreement.id}
                className="flex items-start gap-3 cursor-pointer group py-1"
              >
                <input
                  type="checkbox"
                  checked={!!checked[agreement.id]}
                  onChange={() => handleToggle(agreement.id)}
                  className="hidden"
                />
                <div
                  className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center transition-all duration-150 shrink-0 mt-0.5 ${
                    checked[agreement.id]
                      ? 'bg-teal-600 border-teal-600 shadow-sm shadow-teal-600/25'
                      : 'bg-white border-gray-300 group-hover:border-teal-500/60'
                  }`}
                >
                  {checked[agreement.id] && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span
                  style={{ fontSize: 14 }}
                  className={`transition-colors ${
                    checked[agreement.id] ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-800'
                  }`}
                >
                  {agreement.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <p style={{ fontSize: 11 }} className="text-gray-400">
            All 4 agreements are required to proceed.
          </p>
          <button
            onClick={() => { if (allChecked) onAgree(); }}
            disabled={!allChecked}
            className="bg-teal-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            I Agree & Join
          </button>
        </div>
      </div>
    </div>
  );

  return <Portal>{modalContent}</Portal>;
}