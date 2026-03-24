import React from 'react';
import {
  ChevronLeft, Share2, Bookmark, Users, Clock, Calendar, CalendarPlus, MapPin, Globe,
  CheckCircle2, Mail, Award, Star, FileText, Download, Tag, Flag,
} from 'lucide-react';
import { Tooltip } from '@/app/components/Tooltip';
import { Chip } from '@/app/components/Chip';
import { ApplicationModal } from '@/app/components/ApplicationModal';
import { SimilarSection } from '@/app/components/SimilarSection';
import { ProjectCard } from '@/app/components/ProjectCard';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { ReportModal } from '@/app/components/shared/ReportModal';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { toastBookmarkAdded, toastBookmarkRemoved, toastApplicationSubmitted } from '@/app/components/shared/toasts';
import { downloadICS } from '@/app/utils/calendar';

interface ProjectDetailsPageProps {
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

export function ProjectDetailsPage({ onBack, onNavigate, userRole }: ProjectDetailsPageProps) {
  const [isApplicationModalOpen, setIsApplicationModalOpen] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [hasApplied, setHasApplied] = React.useState(false);
  const [shareModalOpen, setShareModalOpen] = React.useState(false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);

  const project = {
    title: 'AI-Driven Mental Health Chatbot Analysis',
    projectType: 'Research & Pilot Studies',
    segment: 'Startups',
    offeredBy: { name: 'Dr. Neha Kapoor', type: 'Individual' as const, role: 'Associate Professor, Clinical Psychology' },
    format: 'Online' as const,
    location: 'Bangalore, India',
    duration: { label: '3 Months', startDate: 'April 1, 2026', endDate: 'June 30, 2026' },
    stage: 'Planning',
    isFeatured: true,
    description: 'We are analyzing the efficacy of current AI chatbots in providing initial mental health support. Looking for students to help code qualitative data and run statistical analysis.',
    fullDescription: `The rapid rise of AI chatbots in mental health care presents both opportunities and challenges. This project aims to rigorously evaluate the effectiveness, safety, and user experience of leading mental health chatbots.

As a collaborator, you will be involved in:
1. Conducting a literature review on AI in therapy.
2. Analyzing de-identified conversation logs for sentiment and therapeutic alliance.
3. Helping design a survey for user feedback.
4. Assisting in the preparation of the final research paper for publication.

This is a unique opportunity to work at the intersection of technology and clinical psychology.`,
    expectedOutcome: 'A peer-reviewed research paper evaluating AI chatbot efficacy, accompanied by a standardized evaluation framework and dataset that can be used by future researchers.',
    structure: { stage: 'Planning', mode: 'Online', duration: '3 Months', timeCommitment: '10 hrs/week', estimatedTotalHours: 120, segment: 'Startups' },
    teamRoles: [
      { designation: 'Research Assistant – Data Coding', participants: 2, experienceLevel: 'Intermediate', skills: ['Qualitative Analysis', 'NVivo', 'SPSS/R'], notes: 'Experience with thematic analysis preferred.' },
      { designation: 'Survey Design & Distribution Lead', participants: 1, experienceLevel: 'Beginner', skills: ['Google Forms / Qualtrics', 'Communication', 'Tech-savvy'], notes: null },
    ],
    compensation: {
      isPaid: true,
      fees: { fixed: '$500', variable: '$300 (performance-based)' },
      currency: 'USD',
      paymentTerms: 'Monthly upon milestone completion',
      otherBenefits: ['Access to premium research tools', 'Networking with senior researchers'],
      fundingSource: 'University Research Grant',
      recognition: ['Certificate', 'Co-authorship', 'LOR'] as const,
    },
    contractUrl: 'ProjectAgreement_AIChat_2026.pdf',
    applicationDeadline: 'March 15, 2026',
    applications: 12,
    contactEmail: 'neha.kapoor@researchlab.in',
    tags: ['Artificial Intelligence', 'Clinical Psychology', 'Digital Health', 'Remote Research'],
  };

  const handleApplicationSubmitted = () => { setHasApplied(true); toastApplicationSubmitted(project.title); };
  const totalSlots = project.teamRoles.reduce((sum, r) => sum + r.participants, 0);

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-teal-800 via-teal-900 to-teal-950">
        {/* ── Zone 1: Nav bar ── */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-teal-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Projects
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content={isSaved ? 'Saved' : 'Save Project'}>
                <button onClick={() => { if (isSaved) { setShowUnsaveConfirm(true); } else { setIsSaved(true); toastBookmarkAdded('project'); } }} className={`p-2 rounded-lg transition-all ${isSaved ? 'text-white bg-white/15' : 'text-teal-200/50 hover:text-white hover:bg-white/10'}`}>
                  <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>
              <Tooltip content="Share Project">
                <button onClick={() => setShareModalOpen(true)} className="p-2 text-teal-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Share2 size={17} /></button>
              </Tooltip>
              <Tooltip content="Add Deadline to Calendar">
                <button
                  onClick={() => {
                    const deadlineDate = new Date(project.applicationDeadline);
                    deadlineDate.setHours(23, 59, 0);
                    const reminderDate = new Date(deadlineDate.getTime() - 24 * 60 * 60 * 1000);
                    reminderDate.setHours(9, 0, 0);
                    downloadICS({
                      title: `Application Deadline: ${project.title}`,
                      description: `Deadline to apply for project "${project.title}" by ${project.offeredBy.name}`,
                      location: project.format === 'Online' ? 'Online' : project.location,
                      startDate: reminderDate,
                      endDate: deadlineDate,
                      organizer: project.offeredBy.name,
                    });
                  }}
                  className="p-2 text-teal-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"
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
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-white/[0.1] flex items-center justify-center text-[11px] font-bold text-white/90 shrink-0 border border-white/[0.08]">
                  {project.offeredBy.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </div>
                <span className="text-[14px] font-semibold text-white/90">{project.offeredBy.name}</span>
              </div>

              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2.5">{project.title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                {project.isFeatured && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/25">
                    <Star size={9} className="fill-current" /> Featured
                  </span>
                )}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              {hasApplied ? (
                <button className="bg-white/10 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-bold text-[14px] border border-white/15 flex items-center gap-2.5 cursor-default">
                  <CheckCircle2 size={15} className="text-green-400" /> Applied
                </button>
              ) : (
                <button onClick={() => setIsApplicationModalOpen(true)} className="bg-white text-teal-800 px-8 py-2.5 rounded-lg font-bold text-[14px] hover:bg-teal-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 w-full lg:w-auto text-center">
                  Apply Now
                </button>
              )}
              <div className="flex flex-col gap-1 text-[12px] text-white/45 lg:text-right">
                <span className="flex items-center lg:justify-end gap-1.5"><Calendar size={12} /> Deadline: <span className="text-white/80 font-medium">{project.applicationDeadline}</span></span>
                <span className="flex items-center lg:justify-end gap-1.5"><Users size={12} /> <span className="text-white/80 font-medium">{project.applications}</span> applicants</span>
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
            {/* Context bar */}
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-8 pb-7 border-b border-gray-100">
              {project.format === 'Online' ? <Globe size={14} className="text-gray-400 shrink-0" /> : <MapPin size={14} className="text-gray-400 shrink-0" />}
              <span className="font-medium text-gray-700">{project.format}{project.format !== 'Online' && project.location ? ` · ${project.location}` : ''}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{project.projectType}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{project.segment}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{project.duration.label}</span>
            </div>

            {/* About */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">About the Project</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{project.description}</p>
              <div className="mt-5 whitespace-pre-line text-[15px] text-gray-600 leading-[1.75]">{project.fullDescription}</div>
            </section>

            {/* Expected Outcome */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">Expected Outcome</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{project.expectedOutcome}</p>
            </section>

            {/* Team & Roles */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Team & Roles</h2>
              <p className="text-[13px] text-gray-400 mb-5">{project.teamRoles.length} role{project.teamRoles.length > 1 ? 's' : ''} · {totalSlots} open slot{totalSlots > 1 ? 's' : ''}</p>
              <div className="space-y-4">
                {project.teamRoles.map((role, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-[14px] font-bold text-gray-900 leading-tight">{role.designation}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[12px] text-gray-500">{role.participants} position{role.participants > 1 ? 's' : ''}</span>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                          <Chip label={role.experienceLevel} variant="mint" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Skills Required</span>
                      <div className="flex flex-wrap gap-1.5">
                        {role.skills.map((skill, i) => <span key={i} className="px-2.5 py-1 rounded-md text-[12px] font-medium bg-white border border-gray-200/80 text-gray-600">{skill}</span>)}
                      </div>
                    </div>
                    {role.notes && <p className="mt-3 text-[13px] text-gray-400 italic">{role.notes}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* Compensation */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Compensation</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-5">
                {project.compensation.fees.fixed && (
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fixed</span>
                    <span className="text-sm text-gray-900 font-semibold">{project.compensation.fees.fixed}</span>
                  </div>
                )}
                {project.compensation.fees.variable && (
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Variable</span>
                    <span className="text-sm text-gray-900 font-semibold">{project.compensation.fees.variable}</span>
                  </div>
                )}
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Payment Terms</span>
                  <span className="text-sm text-gray-900 font-semibold">{project.compensation.paymentTerms}</span>
                </div>
              </div>

              {project.compensation.otherBenefits.length > 0 && (
                <div className="mb-5">
                  <span className="text-sm font-semibold text-gray-500 block mb-3">Other Benefits</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.compensation.otherBenefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-teal-50/50 border border-teal-100/60">
                        <CheckCircle2 size={14} className="text-teal-600 shrink-0" />
                        <span className="text-sm text-gray-700 font-medium">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.compensation.fundingSource && (
                <div className="mb-5">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Funding Source</span>
                  <span className="text-[13px] text-gray-700 font-medium">{project.compensation.fundingSource}</span>
                </div>
              )}

              <div className="pt-5 border-t border-gray-50">
                <span className="text-sm font-semibold text-gray-500 block mb-3">Recognition</span>
                <div className="flex flex-wrap gap-2">
                  {project.compensation.recognition.map((r, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold bg-amber-50/70 text-amber-700 border border-amber-200/60">
                      <Award size={13} /> {r}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            {/* Contract / Additional Details */}
            {project.contractUrl && (
              <section className="pb-7">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Additional Details</h2>
                <div className="flex items-center gap-3.5 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0"><FileText size={16} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-gray-800">Project Contract</p>
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">{project.contractUrl}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Download size={13} /> Download</button>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* At a Glance */}
              <div>
                <div className="flex flex-col gap-3.5">
                  {[
                    { l: 'Stage', v: project.stage },
                    { l: 'Time Commitment', v: project.structure.timeCommitment },
                    { l: 'Est. Hours', v: `~${project.structure.estimatedTotalHours} hrs` },
                    { l: 'Compensation', v: project.compensation.isPaid ? project.compensation.fees.fixed : 'Unpaid' },
                  ].map(s => (
                    <div key={s.l}>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">{s.l}</span>
                      <span className="text-[13px] font-semibold text-gray-800">{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Timeline */}
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-4">Timeline</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: 'Application Deadline', value: project.applicationDeadline, active: true },
                    { label: 'Project Start', value: project.duration.startDate, active: false },
                    { label: 'Project End', value: project.duration.endDate, active: false },
                  ].map((item, i) => (
                    <div key={i}>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">{item.label}</span>
                      <span className={`text-[13px] font-semibold ${item.active ? 'text-gray-900' : 'text-gray-800'}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Project Lead */}
              <div>
                <h3 className="text-[14px] font-bold text-gray-900 mb-3">Project Lead</h3>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-[11px] font-bold text-teal-700 border border-teal-100 shrink-0">
                    {project.offeredBy.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-gray-900 leading-tight">{project.offeredBy.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{project.offeredBy.role}</p>
                  </div>
                </div>
                <a href={`mailto:${project.contactEmail}`} className="inline-flex items-center gap-1.5 text-teal-600 text-[13px] font-medium hover:underline"><Mail size={13} /> Contact</a>
              </div>

              {project.tags.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5"><Tag size={11} className="text-gray-400" /><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tags</span></div>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((t, i) => <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">{t}</span>)}
                    </div>
                  </div>
                </>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex items-center"><button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-red-600 transition-colors"><Flag size={12} /> Report this project</button></div>
            </div>
          </aside>
        </div>
      </div>

      {/* ═══ SIMILAR PROJECTS ═══ */}
      <SimilarSection
        title="Similar Projects"
        accent="teal"
        exploreLabel="Explore more in Projects"
        onExploreClick={() => onNavigate?.('Opportunities', { tab: 'projects' })}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ProjectCard
            id="sp1"
            title="Digital Therapy Platform – UX Research"
            projectType="Research & Pilot Studies"
            segment="Startups"
            offeredByName="Dr. Ananya Rao"
            offeredByType="Individual"
            format="Online"
            duration="< 3 Months"
            durationLabel="2 Months"
            timeCommitment="8 hrs/week"
            level="Beginner"
            isPaid={false}
            recognition={['Certificate', 'LOR']}
            compact
            onClick={() => onNavigate?.('ProjectDetails')}
          />
          <ProjectCard
            id="sp2"
            title="AI Sentiment Analysis for Therapy Transcripts"
            projectType="Research & Pilot Studies"
            segment="Startups"
            offeredByName="Prof. Vikram Patel"
            offeredByType="Individual"
            format="Online"
            duration="3–6 Months"
            durationLabel="4 Months"
            timeCommitment="10 hrs/week"
            level="Intermediate"
            isPaid={true}
            recognition={['Co-authorship', 'Certificate']}
            compact
            onClick={() => onNavigate?.('ProjectDetails')}
          />
        </div>
      </SimilarSection>

      <ApplicationModal isOpen={isApplicationModalOpen} onClose={() => setIsApplicationModalOpen(false)} onSubmitted={handleApplicationSubmitted} projectTitle={project.title} />

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={project.title}
        subtitle="Share this project opportunity"
      />

      <ConfirmDialog
        isOpen={showUnsaveConfirm}
        onClose={() => setShowUnsaveConfirm(false)}
        onConfirm={() => { setIsSaved(false); toastBookmarkRemoved('project'); }}
        title="Remove from Saved?"
        description="This project will be removed from your saved items. You can always save it again later."
        confirmLabel="Unsave"
        variant="warning"
        icon={Bookmark}
      />
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} entityType="Project" entityTitle={project.title} />
    </div>
  );
}