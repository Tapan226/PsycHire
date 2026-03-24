import React, { useState } from 'react';
import { MOCK_COMPANIES } from '@/app/data/companies';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import {
  CheckCircle2, MapPin, Globe, Users, Briefcase, ChevronLeft, Building2,
  BellRing, Star, Share2, UserPlus, Check, ExternalLink, FolderGit2,
  Megaphone, BookOpen, Calendar, Banknote, ArrowRight,
} from 'lucide-react';

interface CompanyProfilePageProps {
  companyId?: string;
  onNavigate: (page: string, params?: any) => void;
  onBack?: () => void;
}

type CompanyTab = 'about' | 'jobs' | 'projects' | 'updates';

export function CompanyProfilePage({ companyId, onNavigate, onBack }: CompanyProfilePageProps) {
  const company = MOCK_COMPANIES.find(c => c.id === companyId) || MOCK_COMPANIES[0];
  const [activeTab, setActiveTab] = useState<CompanyTab>('about');
  const [isFollowed, setIsFollowed] = useState(company.isFollowed);

  const TABS: { id: CompanyTab; label: string; count?: number }[] = [
    { id: 'about', label: 'About' },
    { id: 'jobs', label: 'Jobs', count: company.jobs.length },
    { id: 'projects', label: 'Projects', count: company.projects.length },
    { id: 'updates', label: 'Updates', count: company.updates.length },
  ];

  const openings = company.stats.activeJobs + company.stats.activeProjects;

  if (!company) return <div>Company not found</div>;

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-in fade-in duration-500">

      {/* ── HEADER ZONE ── */}
      <div className="w-full bg-cyan-800 pt-8 pb-0 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-6">

          {/* Back button */}
          <button
            onClick={onBack || (() => onNavigate('Network'))}
            className="flex items-center gap-1.5 text-cyan-200 hover:text-white transition-colors w-fit group"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Companies
          </button>

          {/* Profile card */}
          <div className="flex items-start gap-5">
            {/* Logo */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-white border-2 border-white/20 shadow-lg shrink-0">
              <ImageWithFallback src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-white truncate" style={{ fontSize: 22, fontWeight: 800 }}>
                  {company.name}
                </p>
                {company.isVerified && (
                  <CheckCircle2 size={18} className="text-cyan-300 shrink-0" />
                )}
              </div>
              <p className="text-cyan-200 mt-0.5 line-clamp-1" style={{ fontSize: 14 }}>
                {company.industry} · {company.location}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {company.rating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10" style={{ fontSize: 12, fontWeight: 600 }}>
                    <Star size={11} className="text-amber-300 fill-amber-300" />
                    {company.rating}
                    <span className="text-cyan-200 ml-0.5" style={{ fontSize: 11 }}>({company.reviews})</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10" style={{ fontSize: 12, fontWeight: 600 }}>
                  <Users size={11} />
                  {company.stats.followers.toLocaleString()} followers
                </span>
                {openings > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10" style={{ fontSize: 12, fontWeight: 600 }}>
                    <Briefcase size={11} />
                    {openings} opening{openings !== 1 ? 's' : ''}
                  </span>
                )}
                {company.size && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-cyan-200 border border-white/10" style={{ fontSize: 12, fontWeight: 500 }}>
                    <Building2 size={11} />
                    {company.size}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsFollowed(!isFollowed)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-lg transition-all shadow-sm ${
                  isFollowed
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    : 'bg-white text-cyan-800 hover:bg-cyan-50 border border-transparent'
                }`}
                style={{ fontSize: 13, fontWeight: 700 }}
              >
                {isFollowed ? <><Check size={14} /> Following</> : <><UserPlus size={14} /> Follow</>}
              </button>
              <button className="w-9 h-9 rounded-lg flex items-center justify-center text-cyan-200 hover:text-white hover:bg-white/10 border border-white/10 transition-colors">
                <Share2 size={15} />
              </button>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar -mb-px mt-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[13px] font-bold whitespace-nowrap border-b-4 transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-white text-white opacity-100'
                    : 'border-transparent text-cyan-200 hover:text-white hover:opacity-100'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`min-w-[18px] h-[18px] rounded-full text-[11px] font-bold flex items-center justify-center px-1 ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 w-full py-8">

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-6">
                  {/* About */}
                  <section className="pb-6 mb-6 border-b border-gray-100">
                    <p className="text-gray-900 mb-4" style={{ fontSize: 17, fontWeight: 700 }}>About</p>
                    <p className="text-gray-600 leading-[1.75]" style={{ fontSize: 15 }}>
                      {company.description}
                    </p>
                    <p className="text-gray-600 leading-[1.75] mt-4" style={{ fontSize: 15 }}>
                      We are committed to excellence in the field of {company.industry}. Our team works tirelessly to advance research and provide top-tier services to our community.
                    </p>
                    <p className="text-gray-600 leading-[1.75] mt-4" style={{ fontSize: 15 }}>
                      Founded with a vision to make psychology accessible and impactful, {company.name} has grown into a trusted name in {company.location} and beyond.
                    </p>
                  </section>

                  {/* Key numbers */}
                  <section>
                    <p className="text-gray-900 mb-4" style={{ fontSize: 17, fontWeight: 700 }}>At a Glance</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: 'Followers', value: company.stats.followers.toLocaleString() },
                        { label: 'Active Jobs', value: String(company.stats.activeJobs) },
                        { label: 'Active Projects', value: String(company.stats.activeProjects) },
                        { label: 'Reviews', value: String(company.reviews) },
                      ].map(stat => (
                        <div key={stat.label} className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                          <p className="text-gray-900" style={{ fontSize: 20, fontWeight: 800 }}>{stat.value}</p>
                          <p className="text-gray-500 mt-0.5" style={{ fontSize: 12, fontWeight: 500 }}>{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-5">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <p className="text-gray-900 mb-4" style={{ fontSize: 15, fontWeight: 700 }}>Details</p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: <Building2 size={15} className="text-gray-400" />, label: 'Industry', value: company.industry },
                    { icon: <MapPin size={15} className="text-gray-400" />, label: 'Headquarters', value: company.location },
                    { icon: <Users size={15} className="text-gray-400" />, label: 'Company Size', value: company.size },
                    ...(company.website ? [{ icon: <Globe size={15} className="text-gray-400" />, label: 'Website', value: company.website, isLink: true }] : []),
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-400 uppercase tracking-wider block" style={{ fontSize: 10, fontWeight: 700 }}>{item.label}</span>
                        {'isLink' in item && item.isLink ? (
                          <a href={`https://${item.value}`} target="_blank" rel="noreferrer" className="text-cyan-700 hover:underline truncate block" style={{ fontSize: 13, fontWeight: 600 }}>
                            {item.value} <ExternalLink size={10} className="inline ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-gray-900 truncate block" style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>Open Positions</p>
              {company.jobs.length > 0 && (
                <span className="text-gray-400" style={{ fontSize: 13, fontWeight: 500 }}>{company.jobs.length} job{company.jobs.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            {company.jobs.length > 0 ? (
              <div className="flex flex-col gap-3">
                {company.jobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => onNavigate('JobDetails')}
                    className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-cyan-200/60 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                      <Briefcase size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 group-hover:text-cyan-700 transition-colors truncate" style={{ fontSize: 14, fontWeight: 700 }}>{job.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-gray-500 flex items-center gap-1" style={{ fontSize: 12 }}><MapPin size={11} /> {job.location}</span>
                        <span className="text-gray-400" style={{ fontSize: 12 }}>·</span>
                        <span className="text-gray-500" style={{ fontSize: 12 }}>{job.type}</span>
                        {job.salary && (
                          <>
                            <span className="text-gray-400" style={{ fontSize: 12 }}>·</span>
                            <span className="text-gray-500 flex items-center gap-1" style={{ fontSize: 12 }}><Banknote size={11} /> {job.salary}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-gray-400" style={{ fontSize: 11, fontWeight: 500 }}>{job.postedAt}</span>
                      <ArrowRight size={14} className="text-gray-300 group-hover:text-cyan-600 transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <Briefcase size={24} />
                </div>
                <p className="text-gray-900 mb-1" style={{ fontSize: 15, fontWeight: 700 }}>No open positions</p>
                <p className="text-gray-500" style={{ fontSize: 13 }}>Check back later for new opportunities.</p>
              </div>
            )}
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-5 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>Research & Projects</p>
              {company.projects.length > 0 && (
                <span className="text-gray-400" style={{ fontSize: 13, fontWeight: 500 }}>{company.projects.length} project{company.projects.length !== 1 ? 's' : ''}</span>
              )}
            </div>
            {company.projects.length > 0 ? (
              <div className="flex flex-col gap-3">
                {company.projects.map(project => (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-4 hover:shadow-md hover:border-cyan-200/60 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                      <FolderGit2 size={16} className="text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 group-hover:text-cyan-700 transition-colors truncate" style={{ fontSize: 14, fontWeight: 700 }}>{project.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {project.role && <span className="text-gray-500" style={{ fontSize: 12 }}>{project.role}</span>}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full border ${
                          project.status === 'Active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'
                        }`} style={{ fontSize: 10, fontWeight: 700 }}>{project.status}</span>
                      </div>
                    </div>
                    <span className="text-gray-400 shrink-0" style={{ fontSize: 11, fontWeight: 500 }}>{project.postedAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <FolderGit2 size={24} />
                </div>
                <p className="text-gray-900 mb-1" style={{ fontSize: 15, fontWeight: 700 }}>No active projects</p>
                <p className="text-gray-500" style={{ fontSize: 13 }}>This organization hasn't listed any projects yet.</p>
              </div>
            )}
          </div>
        )}

        {/* UPDATES TAB */}
        {activeTab === 'updates' && (
          <div className="flex flex-col gap-5 max-w-3xl animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>Latest Updates</p>
            </div>
            {company.updates.length > 0 ? (
              <div className="flex flex-col gap-4">
                {company.updates.map(update => {
                  const typeStyles: Record<string, { icon: React.ReactNode; label: string; bg: string; text: string; border: string }> = {
                    JOB_POST: { icon: <Briefcase size={12} />, label: 'Job', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
                    PROJECT_POST: { icon: <FolderGit2 size={12} />, label: 'Project', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
                    EVENT_POST: { icon: <Calendar size={12} />, label: 'Event', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100' },
                    COURSE_POST: { icon: <BookOpen size={12} />, label: 'Course', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100' },
                    ANNOUNCEMENT: { icon: <Megaphone size={12} />, label: 'Announcement', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200' },
                  };
                  const ts = typeStyles[update.type] || typeStyles.ANNOUNCEMENT;

                  return (
                    <div key={update.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                          <ImageWithFallback src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 truncate" style={{ fontSize: 13, fontWeight: 700 }}>{company.name}</p>
                          <p className="text-gray-400" style={{ fontSize: 11 }}>{update.timestamp}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border ${ts.bg} ${ts.text} ${ts.border}`} style={{ fontSize: 10, fontWeight: 700 }}>
                          {ts.icon} {ts.label}
                        </span>
                      </div>
                      <p className="text-gray-900 mb-1.5" style={{ fontSize: 15, fontWeight: 700 }}>{update.title}</p>
                      <p className="text-gray-600 leading-[1.7] line-clamp-3" style={{ fontSize: 14 }}>{update.content}</p>
                      {update.metadata && (
                        <div className="flex items-center gap-4 mt-3">
                          {update.metadata.location && (
                            <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: 12 }}><MapPin size={11} /> {update.metadata.location}</span>
                          )}
                          {update.metadata.salary && (
                            <span className="text-gray-400 flex items-center gap-1" style={{ fontSize: 12 }}><Banknote size={11} /> {update.metadata.salary}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <BellRing size={24} />
                </div>
                <p className="text-gray-900 mb-1" style={{ fontSize: 15, fontWeight: 700 }}>No recent updates</p>
                <p className="text-gray-500" style={{ fontSize: 13 }}>Stay tuned for news and announcements.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}