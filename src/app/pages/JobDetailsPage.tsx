import React from "react";
import {
  Briefcase,
  Banknote,
  Clock,
  Globe,
  Building2,
  Share2,
  Bookmark,
  ChevronLeft,
  CheckCircle2,
  Users,
  Languages,
  Zap,
  UserPlus,
  Calendar,
  CalendarPlus,
  Tag,
  MapPin,
  Star,
  AlertTriangle,
  Heart,
  Eye,
  GraduationCap,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { Chip } from "@/app/components/Chip";
import { Tooltip } from "@/app/components/Tooltip";
import { ApplyJobModal } from "@/app/components/ApplyJobModal";
import { ApplyMethodModal } from "@/app/components/jobs/ApplyMethodModal";
import { ApplyWithProfileModal } from "@/app/components/jobs/ApplyWithProfileModal";
import { SimilarSection } from "@/app/components/SimilarSection";
import { JobCard } from "@/app/components/JobCard";
import { ShareModal } from "@/app/components/shared/ShareModal";
import { ReportModal } from "@/app/components/shared/ReportModal";
import { ConfirmDialog } from "@/app/components/shared/ConfirmDialog";
import { toastBookmarkAdded, toastBookmarkRemoved, toastApplicationSubmitted } from "@/app/components/shared/toasts";
import { downloadICS } from '@/app/utils/calendar';

interface JobDetailsPageProps {
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

type ApplicationStatus = "new" | "under_review" | "interview" | "hired" | "closed";

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  new:          { label: "Submitted",            color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  under_review: { label: "Under Review",      color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  interview:    { label: "Interview Initiated",color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  hired:        { label: "Hired",              color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  closed:       { label: "Closed",             color: "text-gray-600",   bg: "bg-gray-50",   border: "border-gray-200" },
};

export function JobDetailsPage({ onBack, onNavigate, userRole }: JobDetailsPageProps) {
  const [showMethodModal, setShowMethodModal] = React.useState(false);
  const [showProfileApply, setShowProfileApply] = React.useState(false);
  const [showCustomApply, setShowCustomApply] = React.useState(false);
  const [hasApplied, setHasApplied] = React.useState(false);
  const [applicationStatus, setApplicationStatus] = React.useState<ApplicationStatus>("new");
  const [showStatusDetail, setShowStatusDetail] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = React.useState(false);

  const statusRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!showStatusDetail) return;
    const handler = (e: MouseEvent) => {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusDetail(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showStatusDetail]);

  const handleApplyClick = () => { if (hasApplied) { setShowStatusDetail(!showStatusDetail); return; } setShowMethodModal(true); };
  const handleSelectProfile = () => { setShowMethodModal(false); setShowProfileApply(true); };
  const handleSelectCustom  = () => { setShowMethodModal(false); setShowCustomApply(true); };
  const handleApplicationSubmitted = () => { setHasApplied(true); setApplicationStatus("new"); toastApplicationSubmitted(); };

  const handleToggleSave = () => {
    if (isSaved) {
      setShowUnsaveConfirm(true);
    } else {
      setIsSaved(true);
      toastBookmarkAdded('job');
    }
  };

  const job = {
    title: "Junior Child Psychologist",
    companyName: "MindCare Clinic",
    logoUrl: "https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBhbWVyaWNhbCUyMGRlcGFydG1lbnQlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: "Full-time", workType: "On-site", location: "Mumbai, MH, India", postedDate: "2 days ago",
    featured: true, stats: { applications: 45 },
    overview: { experience: "0-2 years", specialization: "Child Psychology", salary: "₹40k - ₹60k/mo", industry: "Healthcare", urgency: "High Priority" },
    description: "We are looking for a compassionate and dedicated Junior Child Psychologist to join our pediatric mental health team. In this role, you will work under the supervision of senior psychologists to provide assessments, counseling, and therapeutic interventions for children and adolescents. You will play a crucial role in helping young minds navigate emotional, behavioral, and developmental challenges.",
    responsibilities: [
      "Conduct initial screenings and assessments for children and adolescents.",
      "Develop and implement individualized treatment plans under supervision.",
      "Facilitate individual and group therapy sessions.",
      "Collaborate with parents, teachers, and other healthcare professionals.",
      "Maintain accurate and confidential client records.",
      "Participate in case conferences and continuous professional development.",
    ],
    requirements: [
      "Master's degree in Psychology (specialization in Child Psychology preferred).",
      "Valid RCI license or eligibility for licensure is a plus.",
      "Strong understanding of child development and therapeutic modalities.",
      "Excellent communication and interpersonal skills.",
      "Ability to build rapport with children and families.",
      "Proficiency in English and Hindi.",
    ],
    competencies: ["Play therapy techniques","Cognitive-behavioral interventions for children","Developmental assessment tools (BSID, VSMS)","Parent counseling and psychoeducation","Report writing and case documentation"],
    specialRequirements: ["Willingness to work with children with special needs","Comfortable with home visits if required"],
    benefits: ["Comprehensive health insurance","Professional development allowance","Supervision hours for licensure","Flexible working hours","Paid time off"],
    context: { population: ["Children (3-12)","Adolescents (13-18)"], languages: ["English","Hindi","Marathi (Preferred)"] },
    company: { description: "MindCare Clinic is a leading pediatric mental health center dedicated to providing holistic and evidence-based care. Our team of experts works tirelessly to support the emotional well-being of the next generation.", website: "www.mindcareclinic.com" },
    externalUrl: "https://mindcareclinic.com/careers/junior-child-psychologist",
    deadline: "February 15, 2026",
    roleDetails: { designation: "Junior Child Psychologist", reportingTo: "Dr. Meera Sharma, Senior Clinical Psychologist", openPositions: 2, dateOfPosting: "February 9, 2026" },
    salaryBreakdown: { fixed: "₹35,000/mo", variable: "₹5,000 - ₹25,000/mo (performance-based)", paymentTerms: "Monthly Fixed" },
    tags: ["Child Psychology","Pediatric","Assessment","Therapy","Entry Level","Mumbai","Healthcare","RCI"],
    educationBackground: [
      "Master's degree (M.A. / M.Sc.) in Psychology — specialization in Clinical or Child Psychology preferred.",
      "Bachelor's degree (B.A. / B.Sc.) in Psychology from a recognized university.",
      "Additional certifications in Play Therapy, CBT for Children, or Developmental Assessment are a plus.",
    ],
  };

  const statusCfg = STATUS_CONFIG[applicationStatus];

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#1e40af] via-[#1e3a8a] to-[#1a327a]">
        {/* ── Zone 1: Nav bar ── */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-blue-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Jobs
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content={isSaved ? "Saved" : "Save Job"}>
                <button onClick={handleToggleSave} className={`p-2 rounded-lg transition-all ${isSaved ? "text-white bg-white/15" : "text-blue-200/50 hover:text-white hover:bg-white/10"}`}>
                  <Bookmark size={17} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </Tooltip>
              <Tooltip content="Share Job">
                <button onClick={() => setShowShareModal(true)} className="p-2 text-blue-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Share2 size={17} /></button>
              </Tooltip>
              <Tooltip content="Add Deadline to Calendar">
                <button
                  onClick={() => {
                    const deadlineDate = new Date(job.deadline);
                    deadlineDate.setHours(23, 59, 0);
                    const reminderDate = new Date(deadlineDate.getTime() - 24 * 60 * 60 * 1000);
                    reminderDate.setHours(9, 0, 0);
                    downloadICS({
                      title: `Application Deadline: ${job.title}`,
                      description: `Deadline to apply for ${job.title} at ${job.companyName}`,
                      location: job.location,
                      startDate: reminderDate,
                      endDate: deadlineDate,
                      organizer: job.companyName,
                    });
                  }}
                  className="p-2 text-blue-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  <CalendarPlus size={17} />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* ── Zone 2: Identity + Action ── */}
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {/* Left — Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 border border-white/[0.12] shrink-0 hover:border-white/30 transition-colors">
                  <ImageWithFallback src={job.logoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                </button>
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="text-[14px] font-semibold text-white/90 hover:text-white hover:underline transition-colors">
                  {job.companyName}
                </button>
              </div>

              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2.5">{job.title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                {job.featured && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/25">
                    <Star size={9} className="fill-current" /> Featured
                  </span>
                )}
                {job.overview.urgency && (
                  <span className="inline-flex items-center gap-1 bg-red-400/20 text-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-red-400/25">
                    <Zap size={9} className="fill-current" /> {job.overview.urgency}
                  </span>
                )}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              {hasApplied ? (
                <div className="flex flex-col items-start lg:items-end gap-2">
                  <div className="relative">
                    <button onClick={handleApplyClick} className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-bold text-[14px] border border-white/15 flex items-center gap-2.5 hover:bg-white/15 transition-all">
                      <CheckCircle2 size={16} className="text-green-400" /> Applied
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${statusCfg.bg} ${statusCfg.color} border ${statusCfg.border}`}>{statusCfg.label}</span>
                    </button>
                    {showStatusDetail && (
                      <div ref={statusRef} className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-3">Application Status</h4>
                        <div className="flex flex-col gap-2">
                          {(Object.entries(STATUS_CONFIG) as [ApplicationStatus, (typeof STATUS_CONFIG)[ApplicationStatus]][]).map(([key, cfg]) => (
                            <div key={key} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${key === applicationStatus ? `${cfg.bg} ${cfg.color} border ${cfg.border}` : "text-gray-400"}`}>
                              <div className={`w-2 h-2 rounded-full ${key === applicationStatus ? "bg-current" : "bg-gray-200"}`} />
                              {cfg.label}
                              {key === applicationStatus && <span className="ml-auto text-[10px] font-semibold opacity-70">Current</span>}
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100"><p className="text-[11px] text-gray-400">Applied on February 11, 2026</p></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <button onClick={handleApplyClick} className="bg-white text-[#1e40af] px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-blue-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 w-full lg:w-auto text-center">
                  Apply Now
                </button>
              )}
              <div className="flex flex-col gap-1 text-[12px] text-white/45 lg:text-right">
                <span className="flex items-center lg:justify-end gap-1.5"><Calendar size={12} /> Deadline: <span className="text-white/80 font-medium">{job.deadline}</span></span>
                <span className="flex items-center lg:justify-end gap-1.5"><Users size={12} /> <span className="text-white/80 font-medium">{job.stats.applications}</span> applicants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto w-full px-[24px] pt-[48px] pb-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-8 pb-7 border-b border-gray-100">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{job.location}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{job.type}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{job.workType}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>Posted {job.postedDate}</span>
            </div>

            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">About the Role</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{job.description}</p>
            </section>

            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Key Responsibilities</h2>
              <ul className="space-y-2.5">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-bold flex items-center justify-center shrink-0 mt-[2px]">{i + 1}</span>
                    <span className="text-[15px] text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2.5">
                {job.requirements.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-[3px]" />
                    <span className="text-[15px] text-gray-600 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              {job.competencies.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Key Competencies</h3>
                  <ul className="space-y-2">
                    {job.competencies.map((c, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-[7px]" />
                        <span className="text-[15px] text-gray-600 leading-relaxed">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {job.specialRequirements.length > 0 && (
                <div className="mt-5 pt-5 border-t border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">Special Requirements</h3>
                  <ul className="space-y-2">
                    {job.specialRequirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5"><AlertTriangle size={14} className="text-amber-500 shrink-0 mt-[3px]" /><span className="text-sm text-gray-600 leading-relaxed">{item}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {job.educationBackground && job.educationBackground.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Education Background</h2>
                <ul className="space-y-2.5">
                  {job.educationBackground.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <GraduationCap size={16} className="text-indigo-500 shrink-0 mt-[3px]" />
                      <span className="text-[15px] text-gray-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {(job.roleDetails || job.salaryBreakdown) && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                {job.roleDetails && (
                  <div className="mb-6">
                    <h2 className="text-[17px] font-bold text-gray-900 mb-4">Role Details</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                      {job.roleDetails.designation && <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Designation</span><span className="text-[13px] text-gray-800 font-medium">{job.roleDetails.designation}</span></div>}
                      {job.roleDetails.reportingTo && <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Reporting To</span><span className="text-[13px] text-gray-800 font-medium">{job.roleDetails.reportingTo}</span></div>}
                    </div>
                  </div>
                )}
                {job.salaryBreakdown && (
                  <div className={job.roleDetails ? "pt-5 border-t border-gray-50" : ""}>
                    <h2 className="text-[17px] font-bold text-gray-900 mb-4">Compensation</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {job.salaryBreakdown.fixed && <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fixed</span><span className="text-sm text-gray-900 font-semibold">{job.salaryBreakdown.fixed}</span></div>}
                      {job.salaryBreakdown.variable && <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Variable</span><span className="text-sm text-gray-900 font-semibold">{job.salaryBreakdown.variable}</span></div>}
                      {job.salaryBreakdown.paymentTerms && <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Payment Terms</span><span className="text-sm text-gray-900 font-semibold">{job.salaryBreakdown.paymentTerms}</span></div>}
                    </div>
                  </div>
                )}
              </section>
            )}

            <section className="pb-7">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-teal-50/50 border border-teal-100/60">
                    <Heart size={14} className="text-teal-600 shrink-0" />
                    <span className="text-sm text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* At a Glance */}
              <div>
                <div className="flex flex-col gap-3.5">
                  {[
                    { l: "Salary", v: job.overview.salary },
                    { l: "Experience", v: job.overview.experience },
                    { l: "Specialization", v: job.overview.specialization },
                    ...(job.roleDetails?.openPositions ? [{ l: "Open Positions", v: `${job.roleDetails.openPositions} positions` }] : []),
                  ].map(s => (
                    <div key={s.l}>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">{s.l}</span>
                      <span className="text-[13px] font-semibold text-gray-800">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Role Context</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Users size={11} /> Population Served</div>
                    <div className="flex flex-wrap gap-1.5">{job.context.population.map((p, i) => <Chip key={i} label={p} variant="blue" />)}</div>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Languages size={11} /> Languages Required</div>
                    <div className="flex flex-wrap gap-1.5">{job.context.languages.map((l, i) => <Chip key={i} label={l} variant="slate" />)}</div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              <div>
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="flex items-center gap-2.5 mb-3 group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:border-blue-200 transition-colors">
                    <ImageWithFallback src={job.logoUrl} alt={job.companyName} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-[13px] font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{job.companyName}</h3>
                </button>
                <p className="text-[13px] text-gray-500 leading-relaxed mb-3">{job.company.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <a href={`https://${job.company.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 text-[13px] font-medium hover:underline"><Globe size={13} /> Visit Website</a>
                  <span className="text-gray-200">·</span>
                  <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="inline-flex items-center gap-1.5 text-blue-600 text-[13px] font-medium hover:underline"><Building2 size={13} /> Visit Page</button>
                </div>
              </div>

              {/* Contact Person */}
              {job.roleDetails.reportingTo && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider"><Users size={11} /> Contact Person</div>
                    <button
                      onClick={() => onNavigate?.('SupervisorProfile', { supervisorId: 'sup1' })}
                      className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 w-full text-left hover:bg-blue-50/50 hover:border-blue-100 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 font-bold text-[12px]">
                        {job.roleDetails.reportingTo.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{job.roleDetails.reportingTo.split(',')[0]}</p>
                        {job.roleDetails.reportingTo.includes(',') && (
                          <p className="text-[11px] text-gray-500 truncate">{job.roleDetails.reportingTo.split(',').slice(1).join(',').trim()}</p>
                        )}
                      </div>
                    </button>
                  </div>
                </>
              )}

              {job.tags.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5"><Tag size={11} className="text-gray-400" /><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tags</span></div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.tags.map((t, i) => <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">{t}</span>)}
                    </div>
                  </div>
                </>
              )}

              {/* Report */}
              <div className="h-px bg-gray-100" />
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 text-gray-400 hover:text-red-500 transition-colors py-1"
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                <AlertTriangle size={13} />
                Report this listing
              </button>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ SIMILAR JOBS ═══ */}
      <SimilarSection
        title="Similar Jobs"
        accent="blue"
        exploreLabel="Explore more in Jobs"
        onExploreClick={() => onNavigate?.('Opportunities', { tab: 'jobs' })}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <JobCard
            companyName="BrightMinds Foundation"
            jobTitle="Child Psychologist – Early Intervention"
            tag="Child Psychology"
            description="Join our early intervention unit working with children aged 2-6 with developmental delays. Conduct assessments and design play-based therapy plans."
            location="Delhi, India"
            level="0-2 years"
            salary="₹45k - ₹65k/mo"
            chipVariant="blue"
            statusBadge="new"
            employmentType="Full-time"
            compact
            onClick={() => onNavigate?.('JobDetails')}
          />
          <JobCard
            companyName="Apollo Hospitals"
            jobTitle="Clinical Psychologist – Pediatric Ward"
            tag="Child Psychology"
            description="Provide psychological support to hospitalized children and their families. Collaborate with the multidisciplinary pediatric team."
            location="Pune, India"
            level="1-3 years"
            salary="₹50k - ₹70k/mo"
            chipVariant="blue"
            employmentType="Full-time"
            compact
            onClick={() => onNavigate?.('JobDetails')}
          />
        </div>
      </SimilarSection>

      {/* Modals */}
      <ApplyMethodModal isOpen={showMethodModal} onClose={() => setShowMethodModal(false)} onSelectProfile={handleSelectProfile} onSelectCustom={handleSelectCustom} jobTitle={job.title} companyName={job.companyName} externalUrl={job.externalUrl} />
      <ApplyWithProfileModal isOpen={showProfileApply} onClose={() => setShowProfileApply(false)} onSubmitted={handleApplicationSubmitted} jobTitle={job.title} companyName={job.companyName} />
      <ApplyJobModal isOpen={showCustomApply} onClose={() => setShowCustomApply(false)} onSubmitted={handleApplicationSubmitted} jobTitle={job.title} companyName={job.companyName} />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={`${job.title} at ${job.companyName}`} subtitle="Share this job opportunity" />
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} entityType="Job" entityTitle={job.title} />
      <ConfirmDialog
        isOpen={showUnsaveConfirm}
        onClose={() => setShowUnsaveConfirm(false)}
        onConfirm={() => { setIsSaved(false); toastBookmarkRemoved('job'); }}
        title="Remove from Saved?"
        description="This job will be removed from your saved items. You can always save it again later."
        confirmLabel="Unsave"
        variant="warning"
        icon={Bookmark}
      />
    </div>
  );
}