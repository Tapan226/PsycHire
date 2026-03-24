import React, { useState, useEffect } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import { X, ShieldCheck, Check, AlertCircle, Send } from 'lucide-react';

export interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
  required?: boolean;
}

const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'non_disc', label: 'Non-discriminatory Language', description: 'Listing does not discriminate based on gender, caste, religion, disability, or other protected characteristics', required: true },
  { id: 'accurate', label: 'Accurate Information', description: 'All details are truthful and verifiable', required: true },
  { id: 'salary', label: 'Compensation Disclosed', description: 'Salary or compensation details are clearly mentioned', required: true },
  { id: 'contact', label: 'Valid Contact Information', description: 'Correct organizational contact details are provided', required: true },
  { id: 'deadline', label: 'Valid Deadline Set', description: 'Application deadline is set to a future date', required: true },
  { id: 'guidelines', label: 'Community Guidelines', description: 'Listing follows PsycHIRE community guidelines and terms of service', required: true },
];

interface ComplianceChecklistProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityType: string;
  items?: ChecklistItem[];
  accentColor?: string;
}

export function ComplianceChecklist({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  items = DEFAULT_CHECKLIST,
  accentColor,
}: ComplianceChecklistProps) {
  const [mounted, setMounted] = useState(false);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) {
      setChecked(new Set());
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const requiredItems = items.filter(i => i.required !== false);
  const allRequiredChecked = requiredItems.every(i => checked.has(i.id));
  const progress = (checked.size / items.length) * 100;

  const toggleItem = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShieldCheck size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Compliance Checklist</p>
              <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>
                Review before submitting your {entityType.toLowerCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mx-6 mb-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Checklist Items */}
        <div className="px-6 pb-4 flex flex-col gap-2 max-h-[360px] overflow-y-auto">
          {items.map(item => {
            const isChecked = checked.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                  isChecked
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isChecked
                      ? 'border-emerald-500 bg-emerald-500'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isChecked && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`${isChecked ? 'text-emerald-800' : 'text-gray-800'}`} style={{ fontSize: 13, fontWeight: 600 }}>
                      {item.label}
                      {item.required !== false && (
                        <span className="text-red-400 ml-0.5">*</span>
                      )}
                    </p>
                    {item.description && (
                      <p className={`mt-0.5 ${isChecked ? 'text-emerald-600' : 'text-gray-500'}`} style={{ fontSize: 11 }}>
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!allRequiredChecked && (
              <>
                <AlertCircle size={14} className="text-amber-500" />
                <p className="text-amber-600" style={{ fontSize: 11, fontWeight: 500 }}>
                  Complete all required items to proceed
                </p>
              </>
            )}
            {allRequiredChecked && (
              <>
                <Check size={14} className="text-emerald-500" />
                <p className="text-emerald-600" style={{ fontSize: 11, fontWeight: 600 }}>
                  All requirements met
                </p>
              </>
            )}
          </div>
          <button
            onClick={onConfirm}
            disabled={!allRequiredChecked}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white transition-all shadow-sm ${
              allRequiredChecked
                ? 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            style={{ fontSize: 13, fontWeight: 700 }}
          >
            <Send size={14} />
            Confirm & Submit
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );
}