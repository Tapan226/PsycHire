import React from 'react';
import { Course, courses, COURSE_REVIEWS } from '@/app/data/courses';
import {
  ChevronLeft, Clock, Globe, MapPin, ExternalLink, CheckCircle2, ShieldCheck,
  Languages, ClipboardCheck, BarChart3, Users, Calendar, Download, Share2,
  Bookmark, Award, BookOpen, Star, Tag, UserPlus, CalendarPlus, Flag,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Tooltip } from '@/app/components/Tooltip';
import { ConfirmDialog } from '@/app/components/shared/ConfirmDialog';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { ReportModal } from '@/app/components/shared/ReportModal';
import { toastBookmarkAdded, toastBookmarkRemoved, toastCourseEnrolled } from '@/app/components/shared/toasts';
import { downloadICS } from '@/app/utils/calendar';
import { SimilarSection } from '@/app/components/SimilarSection';
import { CourseCard } from '@/app/components/courses/CourseCard';
import { EnrollmentModal } from '@/app/components/courses/EnrollmentModal';
import { RatingsReviews } from '@/app/components/courses/RatingsReviews';
import { NominateEmployeesModal } from '@/app/components/courses/NominateEmployeesModal';

interface CourseDetailsPageProps {
  courseId: string;
  onBack: () => void;
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; border: string }> = {
  'Open':            { color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200' },
  'Filling Up Soon': { color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200' },
  'Closed':          { color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200' },
  'Upcoming':        { color: 'text-blue-700',  bg: 'bg-blue-50',   border: 'border-blue-200' },
};

export function CourseDetailsPage({ courseId, onBack, onNavigate, userRole }: CourseDetailsPageProps) {
  const course = courses.find(c => c.id === courseId);
  const [isSaved, setIsSaved] = React.useState(false);
  const [showUnsaveConfirm, setShowUnsaveConfirm] = React.useState(false);
  const [showEnrollment, setShowEnrollment] = React.useState(false);
  const [isEnrolled, setIsEnrolled] = React.useState(false);
  const [showNominate, setShowNominate] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showReportModal, setShowReportModal] = React.useState(false);

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
        <button onClick={onBack} className="mt-4 text-brand-primary hover:underline">Go Back</button>
      </div>
    );
  }

  const currencySymbol = course.currency === 'USD' ? '$' : course.currency === 'GBP' ? '£' : course.currency === 'INR' ? '₹' : course.currency;
  const statusStyle = course.enrollmentStatus ? STATUS_CONFIG[course.enrollmentStatus] || STATUS_CONFIG['Open'] : null;

  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">
      {/* ═══ COLORED HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-[#312e81] via-[#3730a3] to-[#1e3a5f]">
        {/* ── Zone 1: Nav bar ── */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1.5 text-indigo-200/70 hover:text-white transition-colors text-[13px] group">
              <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Courses
            </button>
            <div className="flex items-center gap-0.5">
              <Tooltip content={isSaved ? 'Saved' : 'Save Course'}>
                <button onClick={() => { if (isSaved) { setShowUnsaveConfirm(true); } else { setIsSaved(true); toastBookmarkAdded('course'); } }} className={`p-2 rounded-lg transition-all ${isSaved ? 'text-white bg-white/15' : 'text-indigo-200/50 hover:text-white hover:bg-white/10'}`}>
                  <Bookmark size={17} fill={isSaved ? 'currentColor' : 'none'} />
                </button>
              </Tooltip>
              <Tooltip content="Add to Calendar">
                <button onClick={() => {
                  const start = new Date(course.startDate || '2026-06-01');
                  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
                  downloadICS({ title: course.title, description: course.description || '', location: course.location || 'Online', startDate: start, endDate: end, organizer: course.instructor?.name });
                }} className="p-2 text-indigo-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><CalendarPlus size={17} /></button>
              </Tooltip>
              <Tooltip content="Share Course">
                <button onClick={() => setShowShareModal(true)} className="p-2 text-indigo-200/50 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Share2 size={17} /></button>
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
                  <ImageWithFallback src={course.provider.logoUrl} alt={course.provider.name} className="w-full h-full object-cover" />
                </button>
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="text-[14px] font-semibold text-white/90 hover:text-white hover:underline transition-colors">
                  {course.provider.name}
                </button>
              </div>

              <h1 className="text-[26px] md:text-[30px] font-extrabold text-white tracking-tight leading-tight mb-2.5">{course.title}</h1>

              <div className="flex items-center gap-2 flex-wrap">
                {course.accreditationStatus === 'Accredited' && (
                  <span className="inline-flex items-center gap-1 bg-green-400/20 text-green-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-400/25">
                    <ShieldCheck size={9} /> Accredited
                  </span>
                )}
                {course.isFeatured && (
                  <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/25">
                    <Star size={9} className="fill-current" /> Featured
                  </span>
                )}
              </div>
            </div>

            {/* Right — CTA panel */}
            <div className="lg:w-[220px] shrink-0 mt-6 lg:mt-0 flex flex-col items-start lg:items-end gap-3">
              {isEnrolled ? (
                <div className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-emerald-500/20 text-emerald-200 border border-emerald-400/20">
                  <CheckCircle2 size={15} />
                  <span className="text-[14px]" style={{ fontWeight: 700 }}>Enrolled</span>
                </div>
              ) : (
                <button onClick={() => setShowEnrollment(true)}
                  className="bg-white text-[#3730a3] px-8 py-2.5 rounded-lg text-[14px] hover:bg-indigo-50 transition-all shadow-sm tracking-wide active:scale-[0.97] duration-200 inline-flex items-center gap-2 w-full lg:w-auto justify-center lg:justify-start"
                  style={{ fontWeight: 700 }}
                >
                  Enroll Now <ExternalLink size={15} />
                </button>
              )}
              {userRole === 'Company' && (
                <button onClick={() => setShowNominate(true)}
                  className="text-indigo-200/70 hover:text-white transition-colors text-[12px] inline-flex items-center gap-1.5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
                  style={{ fontWeight: 600 }}
                >
                  <UserPlus size={13} /> Nominate Employees
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto px-6 w-full py-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
          {/* Main */}
          <div>
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-gray-500 mb-8 pb-7 border-b border-gray-100">
              <Globe size={14} className="text-gray-400 shrink-0" />
              <span className="font-medium text-gray-700">{course.mode}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{course.courseType}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{course.courseFormat}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span>{course.duration}</span>
            </div>

            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-3">About this Course</h2>
              <p className="text-[15px] text-gray-600 leading-[1.75] whitespace-pre-line">{course.description}</p>
            </section>

            {course.learningOutcomes.length > 0 && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">What You'll Learn</h2>
                <ul className="space-y-2.5">
                  {course.learningOutcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2.5"><CheckCircle2 size={16} className="text-green-500 shrink-0 mt-[3px]" /><span className="text-[15px] text-gray-600 leading-relaxed">{o}</span></li>
                  ))}
                </ul>
              </section>
            )}

            <section className="pb-7 mb-7 border-b border-gray-100">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Course Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
                {course.location && <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Location</span><div className="flex items-center gap-1.5 text-[13px] text-gray-800 font-medium"><span className="text-gray-400"><MapPin size={12} /></span>{course.location}</div></div>}
                {course.maxParticipants && <div className="flex flex-col gap-0.5"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Max Participants</span><div className="flex items-center gap-1.5 text-[13px] text-gray-800 font-medium"><span className="text-gray-400"><Users size={12} /></span>{String(course.maxParticipants)}</div></div>}
              </div>
              {course.targetAudience && (
                <div className="mt-6 pt-5 border-t border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Who is this for?</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">{course.targetAudience}</p>
                </div>
              )}
              {course.prerequisites && (
                <div className="mt-6 pt-5 border-t border-gray-50">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Prerequisites</h3>
                  <p className="text-[14px] text-gray-600 leading-relaxed">{course.prerequisites}</p>
                </div>
              )}
            </section>

            {course.instructor && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900 mb-4">Instructor</h2>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                    <ImageWithFallback src={course.instructor.imageUrl} alt={course.instructor.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-gray-900">{course.instructor.name}</h3>
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wide">Lead</span>
                    </div>
                    <p className="text-[13px] text-indigo-600 font-medium mb-1.5">{course.instructor.title}</p>
                    <p className="text-[14px] text-gray-600 leading-relaxed">{course.instructor.bio}</p>
                  </div>
                </div>
                {course.additionalInstructors && course.additionalInstructors.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-50">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">Additional Instructors</h4>
                    <div className="flex flex-wrap gap-3">
                      {course.additionalInstructors.map((inst, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-[10px] border border-indigo-100">{inst.name.split(' ').map(n => n[0]).join('')}</div>
                          <div><p className="text-[13px] font-bold text-gray-900">{inst.name}</p><p className="text-[11px] text-gray-400">{inst.title}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            <section className="pb-7">
              <h2 className="text-[17px] font-bold text-gray-900 mb-4">Pricing</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className={`p-4 rounded-xl flex flex-col gap-1 ${course.isFree ? 'bg-green-50/60 border border-green-100' : course.fees === 'Sponsored' ? 'bg-purple-50/60 border border-purple-100' : 'bg-gray-50 border border-gray-100'}`}>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Fees</span>
                  <span className={`text-[14px] font-bold ${course.isFree ? 'text-green-700' : course.fees === 'Sponsored' ? 'text-purple-700' : 'text-gray-900'}`}>
                    {course.isFree ? 'Free' : course.fees === 'Sponsored' ? 'Sponsored' : `${currencySymbol}${course.price.toLocaleString()}`}
                  </span>
                </div>
                {course.earlyBirdDiscount && <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 flex flex-col gap-1"><span className="text-[10px] font-semibold text-amber-600/60 uppercase tracking-wider">Early Bird</span><span className="text-[14px] text-gray-900 font-bold">{course.earlyBirdDiscount}</span></div>}
                {course.sponsorship && <div className="p-4 rounded-xl bg-purple-50/40 border border-purple-100 flex flex-col gap-1"><span className="text-[10px] font-semibold text-purple-600/60 uppercase tracking-wider">Sponsorship</span><span className="text-[14px] text-gray-900 font-bold">{course.sponsorship}</span></div>}
              </div>
            </section>

            {/* ═══ Ratings & Reviews Section ═══ */}
            <section className="pt-4">
              <RatingsReviews
                courseId={courseId}
                reviews={COURSE_REVIEWS.filter(r => r.courseId === courseId)}
                avgRating={course.avgRating || 4.5}
                totalRatings={course.totalRatings || COURSE_REVIEWS.filter(r => r.courseId === courseId).length}
                canReview={isEnrolled}
                courseTitle={course.title}
              />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-7">
              {/* At a Glance */}
              <div>
                <div className="flex flex-col gap-3.5">
                  {[
                    { l: 'Duration', v: course.duration },
                    { l: 'Category', v: course.category },
                    { l: 'Fee', v: course.isFree ? 'Free' : course.fees === 'Sponsored' ? 'Sponsored' : `${currencySymbol}${course.price.toLocaleString()}` },
                    ...(course.outcomes.length > 0 ? [{ l: 'Outcome', v: course.outcomes.join(', ') }] : []),
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
                <button onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })} className="flex items-center gap-2.5 mb-3 group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0 group-hover:border-indigo-200 transition-colors">
                    <ImageWithFallback src={course.provider.logoUrl} alt={course.provider.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{course.provider.name}</h3>
                    <span className="text-[11px] text-gray-400">{course.providerType}</span>
                  </div>
                </button>
                <a href={course.externalUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-indigo-600 text-[13px] font-medium hover:underline"><Globe size={13} /> Visit Provider</a>
              </div>

              {(course.lastDateToApply || course.enrollmentStatus || course.brochureUrl) && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <h3 className="text-[14px] font-bold text-gray-900 mb-3">Key Dates</h3>
                    <div className="flex flex-col gap-3">
                      {course.lastDateToApply && <div><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Last Date to Apply</p><p className="text-[13px] text-gray-900 font-semibold">{course.lastDateToApply}</p></div>}
                      {course.enrollmentStatus && statusStyle && (
                        <div><p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Enrollment Status</p>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[12px] font-bold border ${statusStyle.bg} ${statusStyle.color} ${statusStyle.border}`}>{course.enrollmentStatus}</span>
                        </div>
                      )}
                      {course.brochureUrl && (
                        <><div className="h-px bg-gray-100" /><a href={course.brochureUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[13px] font-bold text-indigo-600 hover:underline self-start"><Download size={13} /> Download Brochure</a></>
                      )}
                    </div>
                  </div>
                </>
              )}

              {course.tags && course.tags.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <div className="flex items-center gap-1.5 mb-2.5"><Tag size={11} className="text-gray-400" /><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tags</span></div>
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags.map((t, i) => <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">{t}</span>)}
                    </div>
                  </div>
                </>
              )}
              <div className="h-px bg-gray-100" />
              <div className="flex items-center"><button onClick={() => setShowReportModal(true)} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-red-600 transition-colors"><Flag size={12} /> Report this course</button></div>
            </div>
          </aside>
        </div>
      </div>

      {/* Similar Courses */}
      <SimilarSection
        title="Similar Courses"
        accent="indigo"
        exploreLabel="Explore more in Courses"
        onExploreClick={() => onNavigate?.('Learning')}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses
            .filter(c => c.id !== course.id && (c.specialization === course.specialization || c.category === course.category))
            .slice(0, 2)
            .map(c => (
              <CourseCard
                key={c.id}
                course={c}
                onClick={(id) => onNavigate?.('CourseDetails', { courseId: id })}
                compact
              />
            ))}
        </div>
      </SimilarSection>

      {/* Confirm Dialog for Unsaving */}
      <ConfirmDialog
        isOpen={showUnsaveConfirm}
        onClose={() => setShowUnsaveConfirm(false)}
        onConfirm={() => { setIsSaved(false); toastBookmarkRemoved('course'); }}
        title="Remove from Saved?"
        description="This course will be removed from your saved items. You can always save it again later."
        confirmLabel="Unsave"
        variant="warning"
        icon={Bookmark}
      />

      {/* Enrollment Modal */}
      <EnrollmentModal
        isOpen={showEnrollment}
        onClose={() => setShowEnrollment(false)}
        onEnroll={() => { setIsEnrolled(true); toastCourseEnrolled(course.title); }}
        course={course}
      />

      {/* Nominate Employees Modal */}
      <NominateEmployeesModal
        isOpen={showNominate}
        onClose={() => setShowNominate(false)}
        courseTitle={course.title}
      />
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title={course.title} subtitle="Share this course" />
      <ReportModal isOpen={showReportModal} onClose={() => setShowReportModal(false)} entityType="Course" entityTitle={course.title} />
    </div>
  );
}