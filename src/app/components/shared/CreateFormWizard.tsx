import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Save, Eye, Send, Check, AlertCircle, ArrowLeft, AlertTriangle } from 'lucide-react';

export interface WizardStep {
  id: string;
  label: string;
  shortLabel?: string;
  icon?: React.ReactNode;
}

interface CreateFormWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
  onSaveDraft: () => void;
  onPreview: () => void;
  onSubmit: () => void;
  onBack?: () => void; // Back to parent page
  accentColor?: string;
  accentHex?: string;
  children: React.ReactNode;
  isLastStepPreview?: boolean;
  canSubmit?: boolean;
  isDraft?: boolean;
  entityType: string;
  missingFields?: string[];
}

export function CreateFormWizard({
  steps,
  currentStep,
  onStepChange,
  onSaveDraft,
  onPreview,
  onSubmit,
  onBack,
  accentColor = 'blue',
  accentHex = '#1e40af',
  children,
  isLastStepPreview = true,
  canSubmit = true,
  isDraft = true,
  entityType,
  missingFields = [],
}: CreateFormWizardProps) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;
  const isPreviewStep = isLastStepPreview && isLast;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f0f4f8] animate-fade-in">
      {/* ═══ PROGRESS HEADER ═══ */}
      <div className="w-full bg-white border-b border-gray-100 sticky top-[72px] z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              {steps.map((step, i) => {
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;

                return (
                  <div key={step.id} className="flex items-center gap-2 sm:gap-3">
                    {i > 0 && (
                      <div className={`hidden sm:block h-px flex-1 max-w-8 transition-colors duration-300 ${
                        isCompleted ? 'bg-brand-primary' : 'bg-gray-200'
                      }`} />
                    )}
                    <button
                      onClick={() => i <= currentStep && onStepChange(i)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 shrink-0 ${
                        isCurrent
                          ? 'bg-blue-50 text-brand-primary'
                          : isCompleted
                            ? 'text-brand-primary hover:bg-blue-50/50 cursor-pointer'
                            : 'text-gray-400 cursor-default'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-brand-primary text-white'
                          : isCurrent
                            ? 'bg-brand-primary text-white'
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {isCompleted ? (
                          <Check size={12} strokeWidth={3} />
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>
                        )}
                      </div>
                      <span className="hidden md:inline" style={{ fontSize: 12, fontWeight: isCurrent ? 700 : 500 }}>
                        {step.label}
                      </span>
                      <span className="inline md:hidden" style={{ fontSize: 11, fontWeight: isCurrent ? 700 : 500 }}>
                        {step.shortLabel || step.label}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Save Draft button */}
            {isDraft && (
              <button
                onClick={onSaveDraft}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors ml-4 shrink-0"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                <Save size={14} />
                Save Draft
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-0.5 bg-gray-100 -mx-4 sm:-mx-6">
            <div
              className="h-full bg-brand-primary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ═══ FORM CONTENT ═══ */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        {children}

        {/* Validation warnings on preview step */}
        {isPreviewStep && !canSubmit && missingFields.length > 0 && (
          <div className="mt-6 flex items-start gap-3 px-5 py-4 rounded-xl bg-amber-50 border border-amber-200">
            <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800" style={{ fontSize: 13, fontWeight: 700 }}>Please complete required fields before submitting</p>
              <p className="text-amber-600 mt-1" style={{ fontSize: 12, lineHeight: 1.5 }}>
                Missing: {missingFields.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <div className="sticky bottom-0 w-full bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Left — Back */}
          <button
            onClick={() => {
              if (isFirst && onBack) {
                onBack();
              } else if (!isFirst) {
                onStepChange(currentStep - 1);
              }
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition-all ${
              isFirst && !onBack
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
            }`}
            disabled={isFirst && !onBack}
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            {isFirst && onBack ? <ArrowLeft size={16} /> : <ChevronLeft size={16} />}
            {isFirst && onBack ? 'Back to Listings' : 'Back'}
          </button>

          {/* Center — Mobile Save Draft */}
          {isDraft && (
            <button
              onClick={onSaveDraft}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              <Save size={14} />
            </button>
          )}

          {/* Right — Next / Preview / Submit */}
          <div className="flex items-center gap-3">
            {!isLast && (
              <button
                onClick={() => onStepChange(currentStep + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-sm"
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            )}

            {isLast && !isPreviewStep && (
              <>
                <button
                  onClick={onPreview}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                  style={{ fontSize: 13, fontWeight: 600 }}
                >
                  <Eye size={15} />
                  Preview
                </button>
                <button
                  onClick={onSubmit}
                  disabled={!canSubmit}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white transition-all shadow-sm ${
                    canSubmit
                      ? 'bg-brand-secondary hover:bg-brand-secondary-hover cursor-pointer'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  <Send size={14} />
                  Submit for Review
                </button>
              </>
            )}

            {isPreviewStep && (
              <button
                onClick={onSubmit}
                disabled={!canSubmit}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white transition-all shadow-sm ${
                  canSubmit
                    ? 'bg-brand-secondary hover:bg-brand-secondary-hover cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                <Send size={14} />
                Submit for Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
