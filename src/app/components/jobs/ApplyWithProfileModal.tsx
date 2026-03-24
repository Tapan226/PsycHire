import React, { useState, useEffect } from "react";
import { Portal } from "@/app/components/shared/Portal";
import {
  X,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Link2,
  Calendar,
  Banknote,
  ChevronDown,
  AlertCircle,
  Upload,
  ExternalLink,
} from "lucide-react";

import { SuccessCelebration } from "@/app/components/shared/SuccessCelebration";

interface ApplyWithProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  jobTitle: string;
  companyName: string;
}

/* Mock user profile */
const userProfile = {
  fullName: "Jane Doe",
  email: "jane.doe@university.edu",
  phone: "+91 98765 43210",
  location: "Mumbai, MH, India",
  experience: "1 Year",
  specialization: "Child Psychology",
  education: "M.A. Clinical Psychology, Mumbai University (2025)",
  resumeUrl: "JaneDoe_Resume_2026.pdf",
  linkedinUrl: "linkedin.com/in/janedoe",
  portfolioUrl: "",
  avatarInitials: "JD",
};

/* Profile completeness check */
const requiredFields: { key: keyof typeof userProfile; label: string }[] = [
  { key: "fullName", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "location", label: "Location" },
  { key: "experience", label: "Experience" },
  { key: "specialization", label: "Specialization" },
  { key: "education", label: "Education" },
];

function getMissingFields() {
  return requiredFields.filter(
    (f) => !userProfile[f.key] || userProfile[f.key].trim() === ""
  );
}

/* Profile field display row */
function ProfileRow({
  icon,
  label,
  value,
  missing,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  missing?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 text-gray-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
          {label}
        </span>
        {missing ? (
          <span className="text-xs text-amber-600 font-medium flex items-center gap-1 mt-0.5">
            <AlertCircle size={11} /> Not provided
          </span>
        ) : (
          <span className="text-sm text-gray-800 font-medium block mt-0.5 truncate">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export function ApplyWithProfileModal({
  isOpen,
  onClose,
  onSubmitted,
  jobTitle,
  companyName,
}: ApplyWithProfileModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [coverLetter, setCoverLetter] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [availableFrom, setAvailableFrom] = useState("");

  const missingFields = getMissingFields();
  const hasResume = !!userProfile.resumeUrl;
  const isProfileComplete = missingFields.length === 0;
  const canSubmit =
    isProfileComplete && hasResume && coverLetter.trim().length > 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setIsSubmitting(false);
      setCoverLetter("");
      setExpectedSalary("");
      setAvailableFrom("");
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  /* Success state */
  if (isSuccess) {
    return (
      <Portal>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-md p-8 flex flex-col items-center text-center shadow-2xl animate-in slide-in-from-bottom-4 fade-in duration-300">
          <SuccessCelebration
            title="Application Submitted!"
            subtitle={`Your application for ${jobTitle} at ${companyName} has been submitted successfully. Track your status in My Opportunities → Jobs → Applied.`}
            actionLabel="Done"
            onAction={() => {
              onSubmitted();
              onClose();
            }}
          />
        </div>
      </div>
      </Portal>
    );
  }

  /* Main modal */
  const modalContent = (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
        {/* Header */}
        <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Apply with Profile
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {jobTitle} &middot; {companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-7">
          <div className="flex flex-col gap-7">
            {/* Section A: Profile Preview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  Your Profile
                </h3>
                {isProfileComplete ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
                    <CheckCircle2 size={12} /> Complete
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                    <AlertCircle size={12} /> Incomplete
                  </span>
                )}
              </div>

              <div className="bg-gray-50/70 rounded-xl border border-gray-100 p-5">
                {/* Avatar + Name header */}
                <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-gray-100">
                  <div className="w-11 h-11 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {userProfile.avatarInitials}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-gray-900">
                      {userProfile.fullName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {userProfile.specialization} &middot;{" "}
                      {userProfile.experience}
                    </p>
                  </div>
                </div>

                {/* Profile fields grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
                  <ProfileRow
                    icon={<Mail size={14} />}
                    label="Email"
                    value={userProfile.email}
                    missing={!userProfile.email}
                  />
                  <ProfileRow
                    icon={<Phone size={14} />}
                    label="Phone"
                    value={userProfile.phone}
                    missing={!userProfile.phone}
                  />
                  <ProfileRow
                    icon={<MapPin size={14} />}
                    label="Location"
                    value={userProfile.location}
                    missing={!userProfile.location}
                  />
                  <ProfileRow
                    icon={<Briefcase size={14} />}
                    label="Experience"
                    value={userProfile.experience}
                    missing={!userProfile.experience}
                  />
                  <ProfileRow
                    icon={<GraduationCap size={14} />}
                    label="Education"
                    value={userProfile.education}
                    missing={!userProfile.education}
                  />
                  <ProfileRow
                    icon={<Link2 size={14} />}
                    label="LinkedIn"
                    value={userProfile.linkedinUrl}
                    missing={!userProfile.linkedinUrl}
                  />
                </div>

                {/* Resume status */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  {hasResume ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary/[0.06] flex items-center justify-center text-brand-primary shrink-0">
                        <FileText size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                          Resume
                        </span>
                        <span className="text-sm text-brand-primary font-medium flex items-center gap-1.5">
                          {userProfile.resumeUrl}
                          <ExternalLink size={11} className="text-gray-400" />
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-amber-50/80 rounded-lg px-4 py-3 border border-amber-100">
                      <Upload size={16} className="text-amber-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-amber-700">
                          Resume required
                        </p>
                        <p className="text-[11px] text-amber-600">
                          Upload your resume on your profile to continue.
                        </p>
                      </div>
                      <button className="text-xs font-semibold text-brand-primary hover:underline shrink-0">
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Missing fields warning */}
              {!isProfileComplete && (
                <div className="mt-3 flex items-center gap-3 bg-amber-50/80 rounded-lg px-4 py-3 border border-amber-100">
                  <AlertCircle
                    size={16}
                    className="text-amber-500 shrink-0"
                  />
                  <p className="text-xs text-amber-700 flex-1">
                    <span className="font-semibold">
                      Complete your profile to continue.
                    </span>{" "}
                    Missing:{" "}
                    {missingFields.map((f) => f.label).join(", ")}
                  </p>
                  <button className="text-xs font-semibold text-brand-primary hover:underline shrink-0">
                    Go to Profile
                  </button>
                </div>
              )}
            </div>

            {/* Section B: Job-Specific Inputs */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">
                Application Details
              </h3>

              <div className="flex flex-col gap-5">
                {/* Cover Letter (Required) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">
                    Cover Letter{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us why you're a great fit for this role..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all resize-none"
                  />
                  <p className="text-[11px] text-gray-400">
                    Briefly describe your relevant experience and motivation.
                  </p>
                </div>

                {/* Optional fields row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Expected Salary */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Expected Salary{" "}
                      <span className="font-normal text-gray-400 text-xs">
                        (Optional)
                      </span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="pl-3 pr-7 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary appearance-none cursor-pointer font-medium"
                        >
                          <option value="INR">INR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                        <ChevronDown
                          size={13}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                      </div>
                      <div className="relative flex-1">
                        <Banknote
                          size={15}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="e.g. 50,000/mo"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Available From */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-700">
                      Available From{" "}
                      <span className="font-normal text-gray-400 text-xs">
                        (Optional)
                      </span>
                    </label>
                    <div className="relative">
                      <Calendar
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="date"
                        value={availableFrom}
                        onChange={(e) => setAvailableFrom(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
            className="bg-brand-primary text-white px-8 py-2.5 rounded-xl font-bold text-sm hover:bg-[#1a3699] transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
    </Portal>
  );

  return modalContent;
}