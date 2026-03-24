import React, { useState } from "react";
import {
  Search,
  Briefcase,
  Users,
  Layout,
  UserCheck,
  ChevronRight,
  ChevronLeft,
  Clock,
  ArrowRight,
  BookOpen,
  MapPin,
  Banknote,
  Calendar,
  Globe,
} from "lucide-react";
import { User } from "@/app/App";
import { Chip } from "@/app/components/Chip";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

/* ─── MOCK DATA ─── */

const IN_PROGRESS_ITEMS = [
  {
    id: "ip1",
    type: "Mentorship",
    title: "Clinical Psychology Mentorship",
    meta: "with Dr. Aditi Verma",
    dot: "bg-blue-500",
    page: "Learning",
  },
  {
    id: "ip2",
    type: "Supervision",
    title: "Clinical Supervision — RCI Track",
    meta: "42 / 100 hours logged",
    dot: "bg-teal-500",
    page: "Learning",
  },
  {
    id: "ip3",
    type: "Project",
    title: "AI-Driven Mental Health Chatbot",
    meta: "3 collaborators · Due Apr 2026",
    dot: "bg-amber-500",
    page: "Opportunities",
  },
  {
    id: "ip4",
    type: "Event",
    title: "Child Development Workshop",
    meta: "Mar 15 · Online (Zoom)",
    dot: "bg-purple-500",
    page: "Network",
  },
];

const PROF_IN_PROGRESS = [
  {
    id: "pip1",
    type: "Supervision",
    title: "4 Active Supervisees",
    meta: "860 total hours · Next: Today 4 PM",
    dot: "bg-teal-500",
    page: "Learning",
  },
  {
    id: "pip2",
    type: "Mentoring",
    title: "3 Active Mentees",
    meta: "18 mentored total · 1 milestone due",
    dot: "bg-blue-500",
    page: "Learning",
  },
  {
    id: "pip3",
    type: "Project",
    title: "Workplace Wellness Framework",
    meta: "Lead Researcher · Due Jun 2026",
    dot: "bg-amber-500",
    page: "Opportunities",
  },
];

const UPCOMING_ITEMS = [
  { id: "u1", day: "15", month: "FEB", title: "Supervision Session", detail: "4:00 PM · Dr. Puneet" },
  { id: "u2", day: "18", month: "FEB", title: "Mentorship Check-in", detail: "11:00 AM · Dr. Aditi Verma" },
  { id: "u3", day: "20", month: "FEB", title: "RSVP Deadline — Psych Conference", detail: "All day" },
];

const SUGGESTED_JOBS = [
  { id: "sj1", title: "Junior Child Psychologist", org: "Fortis Healthcare", logoUrl: "https://images.unsplash.com/photo-1769698678497-c41f0ab47c3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3NwaXRhbCUyMGhlYWx0aGNhcmUlMjBidWlsZGluZyUyMG1vZGVybnxlbnwxfHx8fDE3NzEyMzUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", location: "Mumbai, MH", employmentType: "Full-time", tag: "Clinical", level: "Entry-level", salary: "₹45–60K/mo", page: "Opportunities" },
  { id: "sj2", title: "School Counselor", org: "DPS International", logoUrl: "https://images.unsplash.com/photo-1566796096874-dd14890c80b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBjYW1wdXMlMjBlZHVjYXRpb24lMjBidWlsZGluZ3xlbnwxfHx8fDE3NzEyMzUzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", location: "Delhi, DL", employmentType: "Full-time", tag: "Counselling", level: "Mid-level", salary: "₹35–50K/mo", page: "Opportunities" },
];

const SUGGESTED_PROJECTS = [
  { id: "sp1", title: "Community Resilience Mapping", org: "UNICEF India", logoUrl: "https://images.unsplash.com/photo-1758790636662-2f8eec12077e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bmljZWYlMjBodW1hbml0YXJpYW4lMjBvcmdhbml6YXRpb24lMjBvZmZpY2V8ZW58MXx8fHwxNzcxMjM1MzI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", projectType: "Field Work", segment: "Community Psychology", level: "Intermediate", format: "Offline" as const, duration: "2 months", page: "Opportunities" },
  { id: "sp2", title: "Youth Mental Health Survey", org: "TISS Mumbai", logoUrl: "https://images.unsplash.com/photo-1770721474002-adf21aa716e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwcmVzZWFyY2glMjBpbnN0aXR1dGUlMjBjYW1wdXN8ZW58MXx8fHwxNzcxMjM1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", projectType: "Research", segment: "Developmental Psych", level: "Beginner", format: "Online" as const, duration: "3 months", page: "Opportunities" },
];

const SUGGESTED_COURSES = [
  { id: "sc1", title: "CBT Fundamentals", provider: "Udemy", specialization: "Clinical", courseType: "Certificate", mode: "Online" as const, duration: "12 hours", page: "Learning" },
  { id: "sc2", title: "Child Psychology 101", provider: "Coursera", specialization: "Developmental", courseType: "Course", mode: "Online" as const, duration: "4 weeks", page: "Learning" },
];

const PROF_SUGGESTED_JOBS = [
  { id: "psj1", title: "Senior Clinical Consultant", org: "MindPeers", logoUrl: "https://images.unsplash.com/photo-1559310415-1e164ccd653a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBzdGFydHVwJTIwdGVjaG5vbG9neSUyMG9mZmljZXxlbnwxfHx8fDE3NzEyMzUzMzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", location: "Remote", employmentType: "Part-time", tag: "Clinical", level: "Senior", salary: "₹2L/mo", page: "Opportunities" },
  { id: "psj2", title: "Lead Psychologist — Corporate Wellness", org: "Deloitte India", logoUrl: "https://images.unsplash.com/photo-1748811371852-b27529c29546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBjb25zdWx0aW5nJTIwb2ZmaWNlJTIwc2t5c2NyYXBlcnxlbnwxfHx8fDE3NzEyMzUzMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", location: "Hyderabad, TS", employmentType: "Full-time", tag: "I/O Psychology", level: "Senior", salary: "₹1.8–2.5L/mo", page: "Opportunities" },
];

const PROF_SUGGESTED_PROJECTS = [
  { id: "psp1", title: "Psychometric Assessment Design", org: "IIT Delhi", logoUrl: "https://images.unsplash.com/photo-1645423660753-74c9121fe6dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdpbmVlcmluZyUyMHRlY2hub2xvZ3klMjBpbnN0aXR1dGUlMjBidWlsZGluZ3xlbnwxfHx8fDE3NzEyMzUzMzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", projectType: "Research", segment: "Psychometrics", level: "Advanced", format: "Hybrid" as const, duration: "6 months", page: "Opportunities" },
  { id: "psp2", title: "Workplace Burnout Study", org: "WHO South-East Asia", logoUrl: "https://images.unsplash.com/photo-1761301643716-1cf7a6ffb6fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3JsZCUyMGhlYWx0aCUyMG9yZ2FuaXphdGlvbiUyMGdsb2JhbCUyMGhlYWRxdWFydGVyc3xlbnwxfHx8fDE3NzEyMzUzMzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", projectType: "Field Research", segment: "Occupational Health", level: "Advanced", format: "Offline" as const, duration: "4 months", page: "Opportunities" },
];

const PROF_SUGGESTED_COURSES = [
  { id: "psc1", title: "Advanced DBT Certification", provider: "NIMHANS", specialization: "Clinical", courseType: "Certification", mode: "Online" as const, duration: "8 weeks", page: "Learning" },
  { id: "psc2", title: "Supervision Best Practices", provider: "APA", specialization: "Supervision", courseType: "Workshop", mode: "Online" as const, duration: "6 hours", page: "Learning" },
];

/* Calendar — days that have events */
const EVENT_DAYS = new Set([15, 18, 20, 24]);

/* ─── PAGE ─── */

interface HomePageProps {
  onNavigate: (page: string) => void;
  user?: User | null;
  isNewUser?: boolean;
}

export function HomePage({ onNavigate, user }: HomePageProps) {
  const firstName = user?.name.split(" ")[0] || "Jane";
  const isProfessional = user?.role === "Professional";

  const inProgress = isProfessional ? PROF_IN_PROGRESS : IN_PROGRESS_ITEMS;
  const recJobs = isProfessional ? PROF_SUGGESTED_JOBS : SUGGESTED_JOBS;
  const recProjects = isProfessional ? PROF_SUGGESTED_PROJECTS : SUGGESTED_PROJECTS;
  const recCourses = isProfessional ? PROF_SUGGESTED_COURSES : SUGGESTED_COURSES;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-blue-800 pt-12 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">

          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                Hello, {firstName}
              </h1>
              <p className="text-blue-100 text-[15px] font-medium max-w-xl leading-relaxed opacity-90">
                {isProfessional
                  ? "Here's what needs your attention today."
                  : "Here's your daily summary and next steps."}
              </p>
            </div>
            <div className="relative group w-full sm:w-72 shrink-0">
              <input
                type="text"
                placeholder="Search PsycHIRE..."
                className="w-full bg-white/10 border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-[13px] font-medium text-white placeholder-blue-200/60 focus:outline-none focus:bg-white/20 focus:border-white/30 transition-all"
              />
              <Search className="absolute left-3.5 top-3 text-blue-200/60 group-hover:text-white transition-colors" size={15} />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pb-10">
            {isProfessional ? (
              <>
                <StatCard value="04" label="Active Projects" icon={<Layout size={18} />} />
                <StatCard value="08" label="Supervisees & Mentees" icon={<Users size={18} />} />
                <StatCard value="860" label="Supervision Hrs" icon={<Clock size={18} />} />
                <ProfileCard percent={92} onClick={() => onNavigate("Profile")} />
              </>
            ) : (
              <>
                <StatCard value="12" label="Active Applications" icon={<Briefcase size={18} />} />
                <StatCard value="05" label="Interviews" icon={<Users size={18} />} />
                <StatCard value="02" label="Ongoing Projects" icon={<Layout size={18} />} />
                <ProfileCard percent={85} onClick={() => onNavigate("Profile")} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 w-full py-10 pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* ── LEFT COLUMN ── */}
          <div className="flex flex-col gap-10">

            {/* In Progress — flat list with colored dots */}
            <section>
              <SectionLabel title="In Progress" />
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100/70">
                {inProgress.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.page)}
                    className="w-full flex items-center gap-4 px-6 py-5 text-left group hover:bg-gray-50/50 transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    <div className={`w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[13px] text-gray-500 font-medium mt-1">
                        {item.meta}
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                  </button>
                ))}
              </div>
            </section>

            {/* Recommended Jobs */}
            <section>
              <SectionLabel title="Recommended Jobs" actionLabel="View All Jobs" onAction={() => onNavigate("Opportunities")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recJobs.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.page)}
                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all duration-300 h-full group cursor-pointer hover:border-blue-200"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <ImageWithFallback
                        src={item.logoUrl}
                        alt={`${item.org} logo`}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{item.org}</span>
                    </div>
                    <p className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[color:var(--color-brand-primary)] transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip label={item.tag} variant="mint" />
                      <Chip label={item.level} variant="slate" />
                      <Chip label={item.employmentType} variant="slate" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-between text-[13px] font-medium">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1.5 text-[12px]">
                          <MapPin size={15} className="text-gray-400" />
                          {item.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-[12px]">
                          <Banknote size={15} className="text-gray-400" />
                          {item.salary}
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[color:var(--color-brand-primary)] font-semibold shrink-0">
                        View Details <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Projects */}
            <section>
              <SectionLabel title="Recommended Projects" actionLabel="View All Projects" onAction={() => onNavigate("Opportunities")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recProjects.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.page)}
                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all duration-300 h-full group cursor-pointer hover:border-teal-200"
                  >
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                      <ImageWithFallback
                        src={item.logoUrl}
                        alt={`${item.org} logo`}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{item.org}</span>
                    </div>
                    <p className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[color:var(--color-brand-primary)] transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip label={item.segment} variant="mint" />
                      <Chip label={item.level} variant={item.level === "Beginner" ? "blue" : item.level === "Intermediate" ? "blue" : "amber"} />
                      <Chip label={item.format} variant="slate" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-between text-[13px] font-medium">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1.5">
                          {item.format === "Online" ? <Globe size={15} className="text-gray-400" /> : <MapPin size={15} className="text-gray-400" />}
                          {item.format}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={15} className="text-gray-400" />
                          {item.duration}
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[color:var(--color-brand-primary)] font-semibold shrink-0">
                        View Details <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            <section>
              <SectionLabel title="Recommended Courses" actionLabel="View All Courses" onAction={() => onNavigate("Learning")} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recCourses.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate(item.page)}
                    className="bg-white rounded-xl border border-gray-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-lg transition-all duration-300 h-full group cursor-pointer hover:border-indigo-200"
                  >
                    <span className="text-sm text-gray-500 font-medium">{item.provider}</span>
                    <p className="text-[17px] font-bold text-gray-900 leading-snug group-hover:text-[color:var(--color-brand-primary)] transition-colors">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Chip label={item.specialization} variant="mint" />
                      <Chip label={item.courseType} variant="slate" />
                      <Chip label={item.mode} variant="slate" />
                    </div>
                    <div className="mt-auto pt-4 border-t border-gray-100 w-full flex items-center justify-between text-[13px] font-medium">
                      <div className="flex items-center gap-4 text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock size={15} className="text-gray-400" />
                          {item.duration}
                        </span>
                      </div>
                      <span className="flex items-center gap-1.5 text-[color:var(--color-brand-primary)] font-semibold shrink-0">
                        View Details <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <aside className="flex flex-col gap-6">
            {/* Upcoming: compact calendar at top, event list below */}
            <section>
              <SectionLabel title="Upcoming" />
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Compact inline calendar */}
                <CompactCalendar />

                {/* Event list */}
                <div className="divide-y divide-gray-100/70">
                  {UPCOMING_ITEMS.map((item) => (
                    <div key={item.id} className="px-6 py-5 flex items-center gap-4 hover:bg-gray-50/40 transition-colors">
                      <div className="w-13 h-13 rounded-xl bg-gray-50 border border-gray-100 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">{item.month}</span>
                        <span className="text-[17px] font-extrabold text-gray-800 leading-none mt-0.5">{item.day}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-bold text-gray-900 leading-snug truncate">{item.title}</p>
                        <p className="text-[12px] text-gray-500 font-medium mt-1 flex items-center gap-1.5">
                          <Clock size={11} className="shrink-0 text-gray-400" /> {item.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Links */}
            <section>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400 mb-4">
                  Quick Links
                </p>
                <div className="flex flex-col gap-1">
                  {[
                    { label: "My Applications", page: "Opportunities", icon: <Briefcase size={15} /> },
                    { label: "My Mentorship", page: "Learning", icon: <BookOpen size={15} /> },
                    { label: "My Supervision", page: "Learning", icon: <UserCheck size={15} /> },
                  ].map((link) => (
                    <button
                      key={link.label}
                      onClick={() => onNavigate(link.page)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all group"
                    >
                      <span className="text-gray-400 group-hover:text-blue-500 transition-colors">{link.icon}</span>
                      {link.label}
                      <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ─── Compact Calendar (no legends, single accent color, no black) ─── */

function CompactCalendar() {
  const [monthOffset, setMonthOffset] = useState(0);

  const baseYear = 2026;
  const baseMonth = 1; // Feb
  const date = new Date(baseYear, baseMonth + monthOffset, 1);
  const year = date.getFullYear();
  const month = date.getMonth();
  const monthName = date.toLocaleString("en-US", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayJS = new Date(year, month, 1).getDay();
  const blanks = firstDayJS === 0 ? 6 : firstDayJS - 1;
  const isBase = monthOffset === 0;

  const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div>
      {/* Month nav */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50/60 border-b border-gray-100">
        <button
          onClick={() => setMonthOffset((p) => p - 1)}
          className="p-1 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-[13px] font-bold text-gray-700">
          {monthName} {year}
        </span>
        <button
          onClick={() => setMonthOffset((p) => p + 1)}
          className="p-1 rounded-lg hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-7 gap-y-0.5 text-center mb-2">
          {DAYS.map((d) => (
            <div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-0.5 text-center">
          {Array.from({ length: blanks }).map((_, i) => (
            <div key={`b-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const hasEvent = isBase && EVENT_DAYS.has(day);
            const isToday = isBase && day === 13;
            return (
              <div key={day} className="flex flex-col items-center py-0.5">
                <span
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-[12px] font-medium transition-colors ${
                    isToday
                      ? "bg-blue-600 text-white font-bold"
                      : hasEvent
                      ? "bg-blue-100 text-blue-700 font-bold"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider before event list */}
      <div className="border-b border-gray-100" />
    </div>
  );
}

/* ─── Sub-components ─── */

function SectionLabel({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <p className="text-[17px] font-bold text-gray-900 tracking-tight">{title}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="text-[13px] font-bold text-[color:var(--color-brand-primary)] hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          {actionLabel}
          <ArrowRight size={13} />
        </button>
      )}
    </div>
  );
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/10 border border-white/10 p-5 rounded-xl flex flex-col justify-between h-[108px] hover:bg-white/[0.15] transition-all cursor-default">
      <div className="flex justify-between items-start">
        <span className="text-[26px] font-extrabold text-white tracking-tight leading-none">{value}</span>
        <div className="p-2 bg-white/10 rounded-lg text-white/80">{icon}</div>
      </div>
      <span className="text-blue-200/70 text-[11px] font-bold uppercase tracking-widest">{label}</span>
    </div>
  );
}

function ProfileCard({ percent, onClick }: { percent: number; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-br from-teal-500 to-teal-600 border border-teal-400/50 p-5 rounded-xl flex items-center gap-4 h-[108px] cursor-pointer hover:shadow-lg hover:shadow-teal-900/20 transition-all group relative overflow-hidden"
    >
      <div className="w-12 h-12 shrink-0 relative">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${percent * 0.88} 88`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-white">{percent}%</span>
      </div>
      <div className="min-w-0">
        <span className="text-white text-[15px] font-bold leading-tight block">Profile</span>
        <span className="text-teal-100/80 text-[11px] font-bold uppercase tracking-wider block mt-1">Complete</span>
      </div>
      <ArrowRight size={16} className="ml-auto text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover:bg-white/15 transition-colors" />
    </div>
  );
}