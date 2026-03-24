import React, { useState } from 'react';
import {
  ArrowLeft, Users, Clock, Calendar, CheckCircle2, MessageSquare,
  FileText, Award, BookOpen, Link2, Plus, X, Video, Download,
  ClipboardList, Globe, MapPin, ChevronDown, ChevronUp, Send,
  BarChart3, Eye, Paperclip, Star, AlertCircle, Upload,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { downloadICS } from '@/app/utils/calendar';
import { QAForum } from '@/app/components/shared/QAForum';
import { Portal } from '@/app/components/shared/Portal';
import {
  MOCK_ACTIVE_SUPERVISIONS, MOCK_SUPERVISORS, getTotalHours,
  type ActiveSupervision, type SupervisionSession,
} from '@/app/data/supervision';

/* ═══ Types ═══ */

type HubTab = 'overview' | 'sessions' | 'participants' | 'guidelines' | 'attendance' | 'discussion' | 'resources' | 'assessment' | 'qna';

interface DiscussionPost {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  replies: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'Video' | 'Link' | 'Document';
  uploadedBy: string;
  date: string;
  size?: string;
}

const MOCK_DISCUSSIONS: DiscussionPost[] = [
  { id: 'd1', author: 'Dr. Anita Sharma', avatar: '', content: 'Reminder: Please submit your case formulation drafts before our next session. Focus on the Persons model framework we discussed.', date: 'Mar 14, 2026', replies: 3 },
  { id: 'd2', author: 'Meera Iyer', avatar: '', content: 'I have a question about applying the maintenance cycle model to a client with co-morbid anxiety and depression. Can we discuss this in our next session?', date: 'Mar 12, 2026', replies: 2 },
  { id: 'd3', author: 'Vikram Das', avatar: '', content: 'Shared my reflective journal entry for Session 1. Feedback welcome!', date: 'Mar 10, 2026', replies: 1 },
];

const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', title: 'CBT Case Formulation Template', type: 'PDF', uploadedBy: 'Dr. Anita Sharma', date: 'Nov 20, 2025', size: '245 KB' },
  { id: 'r2', title: 'Reflective Practice Journal Template', type: 'Document', uploadedBy: 'Dr. Anita Sharma', date: 'Nov 20, 2025', size: '120 KB' },
  { id: 'r3', title: 'RCI Supervisor Guidelines 2025', type: 'PDF', uploadedBy: 'Dr. Anita Sharma', date: 'Nov 15, 2025', size: '1.2 MB' },
  { id: 'r4', title: 'Ethics in Supervision — Video Lecture', type: 'Video', uploadedBy: 'Dr. Anita Sharma', date: 'Jan 5, 2026' },
  { id: 'r5', title: 'Supervision Competency Framework', type: 'Link', uploadedBy: 'Dr. Anita Sharma', date: 'Dec 1, 2025' },
];

const GUIDELINES = [
  { title: 'Confidentiality', text: 'All case material discussed in supervision is strictly confidential. Do not share client details outside the supervision context.' },
  { title: 'Session Attendance', text: 'Supervisees are expected to attend all scheduled sessions. Inform supervisor at least 24 hours in advance if unable to attend.' },
  { title: 'Preparation', text: 'Come prepared with case notes, reflective journals, and any recorded sessions (with client consent) for review.' },
  { title: 'Communication', text: 'Use the discussion forum for non-urgent questions. For urgent clinical matters, contact the supervisor directly.' },
  { title: 'Ethics', text: 'Adhere to the RCI Code of Ethics at all times. Report any ethical concerns to the supervisor immediately.' },
  { title: 'Documentation', text: 'Maintain a supervision log documenting topics covered, feedback received, and action items from each session.' },
];

const HUB_TABS: { id: HubTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'participants', label: 'Participants', icon: Users },
  { id: 'guidelines', label: 'Guidelines', icon: ClipboardList },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
  { id: 'discussion', label: 'Discussion', icon: MessageSquare },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'assessment', label: 'Assessment', icon: BarChart3 },
  { id: 'qna', label: 'Q&A', icon: MessageSquare },
];

/* ═══ Component ═══ */

interface SupervisionHubPageProps {
  supervisionId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function SupervisionHubPage({ supervisionId, onBack, onNavigate }: SupervisionHubPageProps) {
  const [activeTab, setActiveTab] = useState<HubTab>('overview');
  const [newPost, setNewPost] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', duration: '1', meetingLink: '' });

  // Find supervision data
  const supervision = MOCK_ACTIVE_SUPERVISIONS.find(s => s.id === supervisionId) || MOCK_ACTIVE_SUPERVISIONS[0];
  const supervisor = MOCK_SUPERVISORS.find(s => s.id === supervision.supervisorId) || MOCK_SUPERVISORS[0];
  const completedSessions = supervision.sessions.filter(s => s.status === 'Completed');
  const upcomingSessions = supervision.sessions.filter(s => s.status === 'Scheduled');
  const totalHours = getTotalHours(supervision.sessions);

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-cyan-900 via-cyan-800 to-teal-700 pt-8 pb-0 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-cyan-200 hover:text-white mb-4 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Learning
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>SUPERVISION HUB</span>
              </div>
              <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>{supervision.goal}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <ImageWithFallback src={supervisor.avatarUrl} alt={supervisor.name} className="w-7 h-7 rounded-full border-2 border-white/30 object-cover" />
                  <span className="text-cyan-100" style={{ fontSize: 13, fontWeight: 600 }}>{supervisor.name}</span>
                </div>
                <span className="text-white/30">|</span>
                <span className="text-cyan-200" style={{ fontSize: 12 }}>{supervision.purpose} · {supervision.frequency} · {supervision.sessionType}</span>
              </div>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{completedSessions.length}</p>
                <p className="text-cyan-200" style={{ fontSize: 11 }}>Sessions</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{totalHours}h</p>
                <p className="text-cyan-200" style={{ fontSize: 11 }}>Hours</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 overflow-x-auto pb-0 -mb-px scrollbar-hide">
            {HUB_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#f0f4f8] text-cyan-800 border-t-2 border-x border-cyan-400 border-gray-200'
                    : 'text-cyan-200 hover:text-white hover:bg-white/5'
                }`}
                style={{ fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500 }}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-8 w-full">

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 16, fontWeight: 700 }}>Progress Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Sessions', value: supervision.sessions.length, color: 'text-cyan-600' },
                    { label: 'Completed', value: completedSessions.length, color: 'text-emerald-600' },
                    { label: 'Upcoming', value: upcomingSessions.length, color: 'text-blue-600' },
                    { label: 'Hours Logged', value: `${totalHours}h`, color: 'text-purple-600' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-xl">
                      <p className={stat.color} style={{ fontSize: 24, fontWeight: 800 }}>{stat.value}</p>
                      <p className="text-gray-500" style={{ fontSize: 11 }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Session */}
              {upcomingSessions.length > 0 && (
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-2xl border border-cyan-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Next Session</p>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700" style={{ fontSize: 10, fontWeight: 700 }}>UPCOMING</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Session #{upcomingSessions[0].sessionNumber}</p>
                      <div className="flex items-center gap-3 text-gray-600" style={{ fontSize: 12 }}>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {upcomingSessions[0].date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {upcomingSessions[0].time}</span>
                      </div>
                    </div>
                    {upcomingSessions[0].meetingLink && (
                      <a href={upcomingSessions[0].meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                        <Video size={16} /> Join Session
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Sessions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>Recent Sessions</p>
                <div className="flex flex-col gap-3">
                  {completedSessions.slice(-3).reverse().map(session => (
                    <div key={session.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 700 }}>Session #{session.sessionNumber}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500" style={{ fontSize: 11 }}>{session.date}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600" style={{ fontSize: 10, fontWeight: 600 }}>Completed</span>
                        </div>
                      </div>
                      {session.notes && <p className="text-gray-600 mb-2" style={{ fontSize: 12, lineHeight: 1.5 }}>{session.notes}</p>}
                      {session.feedback && (
                        <div className="flex items-start gap-2 p-2.5 bg-cyan-50 rounded-lg">
                          <Star size={12} className="text-cyan-600 mt-0.5 shrink-0" />
                          <p className="text-cyan-700" style={{ fontSize: 11, lineHeight: 1.4 }}>{session.feedback}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Supervisor Card */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>Supervisor</p>
                <div className="flex items-center gap-3 mb-4">
                  <ImageWithFallback src={supervisor.avatarUrl} alt={supervisor.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{supervisor.name}</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>{supervisor.domain}</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('SupervisorProfile', { supervisorId: supervisor.id })} className="w-full px-4 py-2.5 rounded-xl bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-all" style={{ fontSize: 12, fontWeight: 600 }}>
                  View Profile
                </button>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>Quick Actions</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Schedule Session', icon: Calendar, onClick: () => setShowScheduleModal(true) },
                    { label: 'View Resources', icon: FileText, onClick: () => setActiveTab('resources') },
                    { label: 'Discussion Forum', icon: MessageSquare, onClick: () => setActiveTab('discussion') },
                    { label: 'Download Hours Log', icon: Download, onClick: () => {} },
                  ].map(action => (
                    <button key={action.label} onClick={action.onClick} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-cyan-50 text-gray-700 hover:text-cyan-700 transition-all text-left" style={{ fontSize: 13, fontWeight: 500 }}>
                      <action.icon size={16} /> {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Supervision Details */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Details</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Purpose', value: supervision.purpose },
                    { label: 'Frequency', value: supervision.frequency },
                    { label: 'Session Type', value: supervision.sessionType },
                    { label: 'Mode', value: supervision.mode },
                    { label: 'Started', value: supervision.startDate },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-gray-500" style={{ fontSize: 12 }}>{item.label}</span>
                      <span className="text-gray-900" style={{ fontSize: 12, fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Sessions Tab ── */}
        {activeTab === 'sessions' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>All Sessions</p>
              <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                <Plus size={16} /> Schedule Session
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {supervision.sessions.map(session => (
                <div key={session.id} className={`bg-white rounded-2xl border p-6 shadow-sm ${session.status === 'Scheduled' ? 'border-cyan-200 bg-cyan-50/30' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : session.status === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-cyan-100 text-cyan-600'}`}>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>#{session.sessionNumber}</span>
                      </div>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Session #{session.sessionNumber}</p>
                        <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: 12 }}>
                          <Calendar size={12} /> {session.date} <Clock size={12} /> {session.time} {session.duration && <span>· {session.duration}h</span>}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full ${session.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : session.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-cyan-50 text-cyan-600'}`} style={{ fontSize: 11, fontWeight: 600 }}>
                      {session.status}
                    </span>
                  </div>
                  {session.notes && <p className="text-gray-600 mb-3" style={{ fontSize: 13, lineHeight: 1.5 }}>{session.notes}</p>}
                  {session.feedback && (
                    <div className="flex items-start gap-2 p-3 bg-cyan-50 rounded-xl mb-3">
                      <Star size={14} className="text-cyan-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-cyan-800" style={{ fontSize: 11, fontWeight: 600 }}>Supervisor Feedback</p>
                        <p className="text-cyan-700 mt-0.5" style={{ fontSize: 12 }}>{session.feedback}</p>
                      </div>
                    </div>
                  )}
                  {session.meetingLink && session.status === 'Scheduled' && (
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all" style={{ fontSize: 12, fontWeight: 600 }}>
                      <Video size={14} /> Join Meeting
                    </a>
                  )}
                  {session.status === 'Scheduled' && (
                    <button
                      onClick={() => {
                        const start = new Date(`${session.date.replace(/(\w+)\s(\d+),\s(\d+)/, '$1 $2, $3')} ${session.time || '10:00'}`);
                        const end = new Date(start.getTime() + (session.duration || 1) * 60 * 60 * 1000);
                        downloadICS({ title: `Supervision Session #${session.sessionNumber}`, description: session.notes || supervision.goal, location: supervision.mode === 'Online' ? 'Online' : '', startDate: start, endDate: end, organizer: supervisor.name });
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${session.meetingLink ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`}
                      style={{ fontSize: 12, fontWeight: 600 }}
                    >
                      <Calendar size={14} /> Add to Calendar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Participants Tab ── */}
        {activeTab === 'participants' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Participants</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Supervisor */}
              <div className="bg-white rounded-2xl border border-cyan-200 p-6 shadow-sm">
                <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700" style={{ fontSize: 10, fontWeight: 700 }}>SUPERVISOR</span>
                <div className="flex items-center gap-3 mt-3">
                  <ImageWithFallback src={supervisor.avatarUrl} alt={supervisor.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{supervisor.name}</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>{supervisor.domain}</p>
                    <p className="text-gray-400 mt-1" style={{ fontSize: 11 }}>{supervisor.yearsOfSupervisionExperience} years experience</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('SupervisorProfile', { supervisorId: supervisor.id })} className="mt-4 w-full px-4 py-2 rounded-xl bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition-all" style={{ fontSize: 12, fontWeight: 600 }}>
                  View Full Profile
                </button>
              </div>
              {/* Supervisee */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700" style={{ fontSize: 10, fontWeight: 700 }}>SUPERVISEE</span>
                <div className="flex items-center gap-3 mt-3">
                  <ImageWithFallback src={supervision.superviseeAvatar} alt={supervision.superviseeName} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{supervision.superviseeName}</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>{supervision.superviseeCareerStage}</p>
                    <p className="text-gray-400 mt-1" style={{ fontSize: 11 }}>Started {supervision.startDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Guidelines Tab ── */}
        {activeTab === 'guidelines' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Supervision Guidelines</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col gap-5">
                {GUIDELINES.map((g, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0" style={{ fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</p>
                      <p className="text-gray-600 mt-1" style={{ fontSize: 13, lineHeight: 1.5 }}>{g.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {supervision.legalAgreed && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <p className="text-emerald-700" style={{ fontSize: 13, fontWeight: 600 }}>Supervision agreement signed and accepted</p>
              </div>
            )}
          </div>
        )}

        {/* ── Attendance Tab ── */}
        {activeTab === 'attendance' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Attendance Log</p>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Session', 'Date', 'Duration', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {supervision.sessions.map(session => (
                    <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>#{session.sessionNumber}</td>
                      <td className="px-6 py-4 text-gray-600" style={{ fontSize: 13 }}>{session.date}</td>
                      <td className="px-6 py-4 text-gray-600" style={{ fontSize: 13 }}>{session.duration}h</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full ${session.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : session.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-cyan-50 text-cyan-600'}`} style={{ fontSize: 11, fontWeight: 600 }}>
                          {session.status === 'Completed' ? 'Present' : session.status === 'Cancelled' ? 'Absent' : 'Upcoming'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Attendance Rate', value: `${Math.round((completedSessions.length / Math.max(supervision.sessions.filter(s => s.status !== 'Scheduled').length, 1)) * 100)}%`, color: 'text-emerald-600' },
                { label: 'Sessions Attended', value: completedSessions.length, color: 'text-cyan-600' },
                { label: 'Total Hours', value: `${totalHours}h`, color: 'text-purple-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-center">
                  <p className={stat.color} style={{ fontSize: 28, fontWeight: 800 }}>{stat.value}</p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Discussion Tab ── */}
        {activeTab === 'discussion' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Discussion Forum</p>
            {/* New Post */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <textarea
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-400 resize-none"
                style={{ fontSize: 13 }}
                rows={3}
                placeholder="Share an update, question, or resource..."
              />
              <div className="flex items-center justify-between mt-3">
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600 transition-colors" style={{ fontSize: 12 }}>
                  <Paperclip size={14} /> Attach file
                </button>
                <button
                  onClick={() => setNewPost('')}
                  disabled={!newPost.trim()}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${newPost.trim() ? 'bg-cyan-600 text-white hover:bg-cyan-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  style={{ fontSize: 12, fontWeight: 700 }}
                >
                  <Send size={14} /> Post
                </button>
              </div>
            </div>
            {/* Posts */}
            <div className="flex flex-col gap-4">
              {MOCK_DISCUSSIONS.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700" style={{ fontSize: 12, fontWeight: 700 }}>
                      {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 700 }}>{post.author}</p>
                      <p className="text-gray-400" style={{ fontSize: 11 }}>{post.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700" style={{ fontSize: 13, lineHeight: 1.6 }}>{post.content}</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-cyan-600 transition-colors" style={{ fontSize: 12, fontWeight: 500 }}>
                      <MessageSquare size={14} /> {post.replies} {post.replies === 1 ? 'reply' : 'replies'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Resources Tab ── */}
        {activeTab === 'resources' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Shared Resources</p>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                <Upload size={16} /> Upload Resource
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_RESOURCES.map(resource => {
                const typeIcons: Record<string, React.ReactNode> = {
                  'PDF': <FileText size={18} className="text-red-500" />,
                  'Video': <Video size={18} className="text-purple-500" />,
                  'Link': <Link2 size={18} className="text-blue-500" />,
                  'Document': <FileText size={18} className="text-cyan-500" />,
                };
                return (
                  <div key={resource.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between hover:border-cyan-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                        {typeIcons[resource.type] || <FileText size={18} />}
                      </div>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{resource.title}</p>
                        <p className="text-gray-400" style={{ fontSize: 11 }}>{resource.uploadedBy} · {resource.date} {resource.size && `· ${resource.size}`}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-cyan-600 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Assessment Tab ── */}
        {activeTab === 'assessment' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Competency Assessment</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <p className="text-gray-700 mb-6" style={{ fontSize: 13, lineHeight: 1.6 }}>
                Track supervisee competency development across key clinical domains. Assessment is updated progressively based on supervisor evaluations after each session.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  { skill: 'Clinical Assessment & Intake', level: 4, max: 5 },
                  { skill: 'Case Formulation (CBT)', level: 3, max: 5 },
                  { skill: 'Therapeutic Alliance Building', level: 4, max: 5 },
                  { skill: 'Ethical Reasoning', level: 3, max: 5 },
                  { skill: 'Self-Reflection & Awareness', level: 5, max: 5 },
                  { skill: 'Treatment Planning', level: 3, max: 5 },
                  { skill: 'Documentation & Report Writing', level: 4, max: 5 },
                ].map(item => (
                  <div key={item.skill}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-gray-700" style={{ fontSize: 13, fontWeight: 600 }}>{item.skill}</p>
                      <p className="text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{item.level}/{item.max}</p>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full transition-all" style={{ width: `${(item.level / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {!supervision.certificateIssued && completedSessions.length >= 5 && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <AlertCircle size={18} className="text-amber-600" />
                <p className="text-amber-700" style={{ fontSize: 13, fontWeight: 600 }}>Certificate will be issued upon completion of all required sessions and final assessment.</p>
              </div>
            )}
            {supervision.certificateIssued && (
              <button className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all self-start" style={{ fontSize: 13, fontWeight: 700 }}>
                <Download size={16} /> Download Certificate
              </button>
            )}
          </div>
        )}

        {/* ── Q&A Tab ── */}
        {activeTab === 'qna' && (
          <QAForum
            items={[
              { id: 'sq1', question: 'How should I approach case formulation for a client with trauma and substance use comorbidity?', askedBy: 'Meera Iyer', date: 'Mar 5, 2026', answer: 'Start with a shared formulation approach — use the 5Ps model (Presenting, Predisposing, Precipitating, Perpetuating, Protective factors). For trauma-substance comorbidity, the Seeking Safety model provides a good integrated framework. We can discuss this in detail next session.', replies: [{ id: 'sr1', author: 'Vikram Das', text: 'I found the Persons model helpful for mapping out the interaction between trauma responses and substance use maintenance cycles.', date: 'Mar 6, 2026' }], upvotes: 4, isResolved: true },
              { id: 'sq2', question: 'What are the RCI documentation requirements for supervision hours?', askedBy: 'Vikram Das', date: 'Mar 8, 2026', answer: 'RCI requires a minimum of 100 hours of supervised practice. Each session must be documented with date, duration, topics covered, and supervisor signature. I will share the official template in the Resources tab.', replies: [], upvotes: 6, isResolved: true },
              { id: 'sq3', question: 'Can we dedicate a session to practicing motivational interviewing techniques?', askedBy: 'Meera Iyer', date: 'Mar 12, 2026', replies: [{ id: 'sr2', author: 'Vikram Das', text: 'Great idea — I would love a role-play session on this.', date: 'Mar 12, 2026' }], upvotes: 3 },
              { id: 'sq4', question: 'Is there guidance on how to handle boundary violations reported by clients about previous therapists?', askedBy: 'Ananya Reddy', date: 'Mar 14, 2026', replies: [], upvotes: 2 },
            ]}
            accentColor="cyan"
            instructorLabel="Supervisor Response"
          />
        )}
      </div>

      {/* ═══ Schedule Session Modal ═══ */}
      {showScheduleModal && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Schedule New Session</p>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Date *</p>
                  <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white" style={{ fontSize: 13 }} />
                </div>
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Time *</p>
                  <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm(p => ({ ...p, time: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white" style={{ fontSize: 13 }} />
                </div>
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Duration (hours)</p>
                  <select value={scheduleForm.duration} onChange={e => setScheduleForm(p => ({ ...p, duration: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white" style={{ fontSize: 13 }}>
                    <option value="0.5">30 minutes</option>
                    <option value="1">1 hour</option>
                    <option value="1.5">1.5 hours</option>
                    <option value="2">2 hours</option>
                  </select>
                </div>
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Meeting Link</p>
                  <input type="url" value={scheduleForm.meetingLink} onChange={e => setScheduleForm(p => ({ ...p, meetingLink: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white" style={{ fontSize: 13 }} placeholder="https://meet.google.com/..." />
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="mt-5 w-full py-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                Schedule Session
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}