import React, { useState, useEffect } from "react";
import { Portal } from "@/app/components/shared/Portal";
import { X, User, FileText, ChevronRight, Zap, ExternalLink } from "lucide-react";

interface ApplyMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProfile: () => void;
  onSelectCustom: () => void;
  jobTitle: string;
  companyName: string;
  externalUrl?: string;
}

export function ApplyMethodModal({
  isOpen,
  onClose,
  onSelectProfile,
  onSelectCustom,
  jobTitle,
  companyName,
  externalUrl,
}: ApplyMethodModalProps) {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<"profile" | "custom" | "external">("profile");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelected("profile");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleContinue = () => {
    if (selected === "profile") {
      onSelectProfile();
    } else if (selected === "external" && externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
      onClose();
    } else {
      onSelectCustom();
    }
  };

  const content = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Apply to Job</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {jobTitle} at {companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 flex flex-col gap-3">
          <p className="text-sm text-gray-500 mb-1">
            How would you like to apply?
          </p>

          {/* Option 1: Apply with Profile */}
          <button
            onClick={() => setSelected("profile")}
            className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
              selected === "profile"
                ? "border-brand-primary bg-brand-primary/[0.03] shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  selected === "profile"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <User size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    Apply with Profile
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-brand-secondary bg-brand-secondary/10 px-1.5 py-0.5 rounded uppercase tracking-wide">
                    <Zap size={8} className="fill-current" />
                    Fast
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Auto-fill from your profile. Just add a cover letter and
                  submit.
                </p>
              </div>
            </div>
            {/* Selection indicator */}
            <div
              className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === "profile"
                  ? "border-brand-primary bg-brand-primary"
                  : "border-gray-300"
              }`}
            >
              {selected === "profile" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Option 2: Apply with Custom Details */}
          <button
            onClick={() => setSelected("custom")}
            className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
              selected === "custom"
                ? "border-brand-primary bg-brand-primary/[0.03] shadow-sm"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  selected === "custom"
                    ? "bg-brand-primary text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-gray-900">
                  Apply with Custom Details
                </span>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Fill out a detailed application form with your own inputs.
                </p>
              </div>
            </div>
            <div
              className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                selected === "custom"
                  ? "border-brand-primary bg-brand-primary"
                  : "border-gray-300"
              }`}
            >
              {selected === "custom" && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
          </button>

          {/* Option 3: Apply on External Site */}
          {externalUrl && (
            <button
              onClick={() => setSelected("external")}
              className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                selected === "external"
                  ? "border-brand-primary bg-brand-primary/[0.03] shadow-sm"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    selected === "external"
                      ? "bg-brand-primary text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <ExternalLink size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-bold text-gray-900">
                    Apply on External Site
                  </span>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    You'll be redirected to the company's application portal.
                  </p>
                </div>
              </div>
              <div
                className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === "external"
                    ? "border-brand-primary bg-brand-primary"
                    : "border-gray-300"
                }`}
              >
                {selected === "external" && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            className="flex-1 bg-brand-primary text-white px-4 py-3 rounded-xl font-bold text-sm hover:bg-[#1a3699] transition-all active:scale-[0.97] duration-200 flex items-center justify-center gap-2"
          >
            Continue
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return <Portal>{content}</Portal>;
}