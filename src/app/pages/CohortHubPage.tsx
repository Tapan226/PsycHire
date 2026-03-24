import React, { useState } from 'react';
import {
  ArrowLeft, Users, Clock, Calendar, CheckCircle2, MessageSquare,
  FileText, Award, BookOpen, Link2, Plus, X, Video, Download,
  ClipboardList, Globe, MapPin, Send, Eye, Paperclip, Star,
  BarChart3, Upload, Target, ListChecks, HelpCircle,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { downloadICS } from '@/app/utils/calendar';
import { QAForum, type QAItem } from '@/app/components/shared/QAForum';
import { Portal } from '@/app/components/shared/Portal';
import {
  MOCK_ACTIVE_MENTORSHIPS, MOCK_MENTORS,
  type ActiveMentorship, type MentorshipSession, type ActionItem,
} from '@/app/data/mentorship';

/* ═══ Types ═══ */

type HubTab = 'overview' | 'sessions' | 'participants' | 'guidelines' | 'attendance' | 'actionPlan' | 'discussion' | 'resources' | 'qna';

interface DiscussionPost {
  id: string; author: string; content: string; date: string; replies: number;
}

interface Resource {
  id: string; title: string; type: string; uploadedBy: string; date: string; size?: string;
}

const MOCK_DISCUSSIONS: DiscussionPost[] = [
  { id: 'd1', author: 'Dr. Meera Kapoor', content: 'Welcome to the cohort! Please introduce yourself and share your top goal for the next 3 months.', date: 'Dec 1, 2025', replies: 4 },
  { id: 'd2', author: 'Priya Nair', content: 'Working on my case formulation assignment. Has anyone tried the Persons model for anxiety-depression comorbidity?', date: 'Jan 8, 2026', replies: 3 },
  { id: 'd3', author: 'Rohan Iyer', content: 'Shared a great article on private practice business models in India. Check the resources tab!', date: 'Jan 20, 2026', replies: 1 },
];

const MOCK_RESOURCES: Resource[] = [
  { id: 'r1', title: 'Cohort Handbook & Welcome Guide', type: 'PDF', uploadedBy: 'Dr. Meera Kapoor', date: 'Dec 1, 2025', size: '350 KB' },
  { id: 'r2', title: 'Career Roadmap Template', type: 'Document', uploadedBy: 'Dr. Meera Kapoor', date: 'Dec 1, 2025', size: '180 KB' },
  { id: 'r3', title: 'Private Practice Business Plan Guide', type: 'PDF', uploadedBy: 'Rohan Iyer', date: 'Jan 20, 2026', size: '520 KB' },
  { id: 'r4', title: 'CBT Case Formulation Workshop Recording', type: 'Video', uploadedBy: 'Dr. Meera Kapoor', date: 'Jan 5, 2026' },
];

const HUB_TABS: { id: HubTab; label: string; icon: React.ElementType }[] = [
  { id: 'overview', label: 'Overview', icon: Eye },
  { id: 'sessions', label: 'Sessions', icon: Calendar },
  { id: 'participants', label: 'Participants', icon: Users },
  { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
  { id: 'attendance', label: 'Attendance', icon: ClipboardList },
  { id: 'actionPlan', label: 'Action Plan', icon: ListChecks },
  { id: 'discussion', label: 'Discussion', icon: MessageSquare },
  { id: 'resources', label: 'Resources', icon: FileText },
  { id: 'qna', label: 'Q&A', icon: HelpCircle },
];

/* ═══ Component ═══ */

interface CohortHubPageProps {
  mentorshipId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function CohortHubPage({ mentorshipId, onBack, onNavigate }: CohortHubPageProps) {
  const [activeTab, setActiveTab] = useState<HubTab>('overview');
  const [newPost, setNewPost] = useState('');
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', type: 'group', meetingLink: '' });

  const mentorship = MOCK_ACTIVE_MENTORSHIPS.find(m => m.id === mentorshipId) || MOCK_ACTIVE_MENTORSHIPS[0];
  const mentor = MOCK_MENTORS.find(m => m.id === mentorship.mentorId) || MOCK_MENTORS[0];
  const completedSessions = mentorship.sessions.filter(s => s.status === 'Completed');
  const upcomingSessions = mentorship.sessions.filter(s => s.status === 'Scheduled');
  const completedActions = mentorship.actionPlan.filter(a => a.isCompleted).length;
  const totalActions = mentorship.actionPlan.length;

  // Local action plan state
  const [localActionPlan, setLocalActionPlan] = useState<ActionItem[]>(mentorship.actionPlan);
  const toggleAction = (id: string) => {
    setLocalActionPlan(prev => prev.map(a => a.id === id ? { ...a, isCompleted: !a.isCompleted } : a));
  };

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-700 pt-8 pb-0 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 relative z-10">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-200 hover:text-white mb-4 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back to Learning
          </button>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-200" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>MENTORING COHORT HUB</span>
              </div>
              <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>{mentorship.goal}</p>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <div className="flex items-center gap-2">
                  <ImageWithFallback src={mentor.avatarUrl} alt={mentor.name} className="w-7 h-7 rounded-full border-2 border-white/30 object-cover" />
                  <span className="text-indigo-100" style={{ fontSize: 13, fontWeight: 600 }}>{mentor.name}</span>
                </div>
                <span className="text-white/30">|</span>
                <span className="text-indigo-200" style={{ fontSize: 12 }}>{mentorship.frequency} · {mentorship.commitment}</span>
              </div>
            </div>
            <div className="flex items-center gap-5 shrink-0">
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{completedSessions.length}</p>
                <p className="text-indigo-200" style={{ fontSize: 11 }}>Sessions</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-white" style={{ fontSize: 28, fontWeight: 800 }}>{localActionPlan.filter(a => a.isCompleted).length}/{totalActions}</p>
                <p className="text-indigo-200" style={{ fontSize: 11 }}>Actions</p>
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
                    ? 'bg-[#f0f4f8] text-indigo-800 border-t-2 border-x border-indigo-400 border-gray-200'
                    : 'text-indigo-200 hover:text-white hover:bg-white/5'
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
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Progress */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 16, fontWeight: 700 }}>Progress Summary</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: 'Sessions Done', value: completedSessions.length, color: 'text-emerald-600' },
                    { label: 'Upcoming', value: upcomingSessions.length, color: 'text-indigo-600' },
                    { label: 'Actions Done', value: localActionPlan.filter(a => a.isCompleted).length, color: 'text-purple-600' },
                    { label: 'Pending', value: localActionPlan.filter(a => !a.isCompleted).length, color: 'text-amber-600' },
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
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Next Session</p>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700" style={{ fontSize: 10, fontWeight: 700 }}>UPCOMING</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Session #{upcomingSessions[0].sessionNumber}</p>
                      <div className="flex items-center gap-3 text-gray-600" style={{ fontSize: 12 }}>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {upcomingSessions[0].date}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {upcomingSessions[0].time}</span>
                      </div>
                    </div>
                    {upcomingSessions[0].meetingLink && (
                      <a href={upcomingSessions[0].meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                        <Video size={16} /> Join Session
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Action Items */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>Action Items</p>
                <div className="flex flex-col gap-2">
                  {localActionPlan.slice(0, 5).map(item => (
                    <button key={item.id} onClick={() => toggleAction(item.id)} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all text-left">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${item.isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'}`}>
                        {item.isCompleted && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <p className={`${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`} style={{ fontSize: 13 }}>{item.text}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>Mentor</p>
                <div className="flex items-center gap-3 mb-4">
                  <ImageWithFallback src={mentor.avatarUrl} alt={mentor.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{mentor.name}</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>{mentor.domain}</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('MentorProfile', { mentorId: mentor.id })} className="w-full px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all" style={{ fontSize: 12, fontWeight: 600 }}>
                  View Profile
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-4" style={{ fontSize: 14, fontWeight: 700 }}>Quick Actions</p>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Book 1:1 Session', icon: Calendar, onClick: () => { setScheduleForm(p => ({ ...p, type: '1:1' })); setShowScheduleModal(true); } },
                    { label: 'View Action Plan', icon: ListChecks, onClick: () => setActiveTab('actionPlan') },
                    { label: 'Ask a Question', icon: HelpCircle, onClick: () => setActiveTab('qna') },
                    { label: 'View Resources', icon: FileText, onClick: () => setActiveTab('resources') },
                  ].map(action => (
                    <button key={action.label} onClick={action.onClick} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-all text-left" style={{ fontSize: 13, fontWeight: 500 }}>
                      <action.icon size={16} /> {action.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <p className="text-gray-900 mb-3" style={{ fontSize: 14, fontWeight: 700 }}>Details</p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: 'Frequency', value: mentorship.frequency },
                    { label: 'Commitment', value: mentorship.commitment },
                    { label: 'Started', value: mentorship.startDate },
                    { label: 'Status', value: mentorship.status },
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
              <button onClick={() => setShowScheduleModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                <Plus size={16} /> Book Session
              </button>
            </div>
            <div className="flex flex-col gap-4">
              {mentorship.sessions.map(session => (
                <div key={session.id} className={`bg-white rounded-2xl border p-6 shadow-sm ${session.status === 'Scheduled' ? 'border-indigo-200 bg-indigo-50/30' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        <span style={{ fontSize: 14, fontWeight: 800 }}>#{session.sessionNumber}</span>
                      </div>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Session #{session.sessionNumber}</p>
                        <div className="flex items-center gap-2 text-gray-500" style={{ fontSize: 12 }}>
                          <Calendar size={12} /> {session.date} <Clock size={12} /> {session.time}
                        </div>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full ${session.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`} style={{ fontSize: 11, fontWeight: 600 }}>
                      {session.status}
                    </span>
                  </div>
                  {session.notes && <p className="text-gray-600 mb-3" style={{ fontSize: 13, lineHeight: 1.5 }}>{session.notes}</p>}
                  {session.actionItems.length > 0 && (
                    <div className="p-3 bg-indigo-50 rounded-xl">
                      <p className="text-indigo-800 mb-2" style={{ fontSize: 11, fontWeight: 600 }}>Action Items from this session:</p>
                      <div className="flex flex-col gap-1">
                        {session.actionItems.map((item, i) => (
                          <div key={i} className="flex items-start gap-2 text-indigo-700" style={{ fontSize: 12 }}>
                            <Target size={12} className="mt-0.5 shrink-0" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {session.meetingLink && session.status === 'Scheduled' && (
                    <a href={session.meetingLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 mt-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all" style={{ fontSize: 12, fontWeight: 600 }}>
                      <Video size={14} /> Join Meeting
                    </a>
                  )}
                  {session.status === 'Scheduled' && (
                    <button
                      onClick={() => {
                        const start = new Date(`${session.date.replace(/(\w+)\s(\d+),\s(\d+)/, '$1 $2, $3')} ${session.time || '10:00'}`);
                        const end = new Date(start.getTime() + 60 * 60 * 1000);
                        downloadICS({ title: `Mentoring Session #${session.sessionNumber}`, description: session.notes || mentorship.goal, location: 'Online', startDate: start, endDate: end, organizer: mentor.name });
                      }}
                      className={`inline-flex items-center gap-2 px-4 py-2 mt-3 rounded-lg transition-all ${session.meetingLink ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
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
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Cohort Members</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Mentor */}
              <div className="bg-white rounded-2xl border border-indigo-200 p-6 shadow-sm">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700" style={{ fontSize: 10, fontWeight: 700 }}>MENTOR</span>
                <div className="flex items-center gap-3 mt-3">
                  <ImageWithFallback src={mentor.avatarUrl} alt={mentor.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{mentor.name}</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>{mentor.domain}</p>
                  </div>
                </div>
                <button onClick={() => onNavigate('MentorProfile', { mentorId: mentor.id })} className="mt-4 w-full px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all" style={{ fontSize: 12, fontWeight: 600 }}>
                  View Profile
                </button>
              </div>
              {/* Current mentee */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700" style={{ fontSize: 10, fontWeight: 700 }}>MENTEE</span>
                <div className="flex items-center gap-3 mt-3">
                  <ImageWithFallback src={mentorship.menteeAvatar} alt={mentorship.menteeName} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{mentorship.menteeName}</p>
                    <p className="text-gray-500" style={{ fontSize: 12 }}>{mentorship.menteeCareerStage}</p>
                    <p className="text-gray-400 mt-0.5" style={{ fontSize: 11 }}>Joined {mentorship.startDate}</p>
                  </div>
                </div>
              </div>
              {/* Other mentees (mock) */}
              {MOCK_ACTIVE_MENTORSHIPS.filter(m => m.id !== mentorship.id).map(m => (
                <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700" style={{ fontSize: 10, fontWeight: 700 }}>MENTEE</span>
                  <div className="flex items-center gap-3 mt-3">
                    <ImageWithFallback src={m.menteeAvatar} alt={m.menteeName} className="w-14 h-14 rounded-full object-cover" />
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>{m.menteeName}</p>
                      <p className="text-gray-500" style={{ fontSize: 12 }}>{m.menteeCareerStage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Guidelines Tab ── */}
        {activeTab === 'guidelines' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Cohort Guidelines</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col gap-5">
                {[
                  { title: 'Confidentiality', text: 'All discussions, case material, and personal goals shared within the cohort are strictly confidential. Do not share outside the group.' },
                  { title: 'Session Attendance', text: 'Mentees are expected to attend all group and 1:1 sessions. Notify the mentor at least 24 hours in advance if unable to attend.' },
                  { title: 'Active Participation', text: 'Come prepared with questions, reflections, and updates on action items. Engage constructively during group sessions.' },
                  { title: 'Communication', text: 'Use the Q&A forum for non-urgent questions. For urgent matters, contact the mentor directly via the messaging feature.' },
                  { title: 'Respect & Inclusivity', text: 'Respect diverse perspectives and experiences. Create a safe and supportive environment for all cohort members.' },
                  { title: 'Action Items', text: 'Complete action items between sessions. Track progress in the Action Plan tab and share updates during sessions.' },
                ].map((g, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0" style={{ fontSize: 12, fontWeight: 800 }}>{i + 1}</div>
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{g.title}</p>
                      <p className="text-gray-600 mt-1" style={{ fontSize: 13, lineHeight: 1.5 }}>{g.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <p className="text-emerald-700" style={{ fontSize: 13, fontWeight: 600 }}>Cohort agreement accepted upon enrollment</p>
            </div>
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
                    {['Session', 'Date', 'Type', 'Status'].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mentorship.sessions.map(session => (
                    <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-6 py-4 text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>#{session.sessionNumber}</td>
                      <td className="px-6 py-4 text-gray-600" style={{ fontSize: 13 }}>{session.date}</td>
                      <td className="px-6 py-4 text-gray-600" style={{ fontSize: 13 }}>{session.type === '1:1' ? '1:1' : 'Group'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full ${session.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : session.status === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`} style={{ fontSize: 11, fontWeight: 600 }}>
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
                { label: 'Attendance Rate', value: `${Math.round((completedSessions.length / Math.max(mentorship.sessions.filter(s => s.status !== 'Scheduled').length, 1)) * 100)}%`, color: 'text-emerald-600' },
                { label: 'Sessions Attended', value: completedSessions.length, color: 'text-indigo-600' },
                { label: 'Total Sessions', value: mentorship.sessions.length, color: 'text-purple-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm text-center">
                  <p className={stat.color} style={{ fontSize: 28, fontWeight: 800 }}>{stat.value}</p>
                  <p className="text-gray-500 mt-1" style={{ fontSize: 12 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Action Plan Tab ── */}
        {activeTab === 'actionPlan' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Action Plan</p>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-lg border border-indigo-200">
                <p className="text-indigo-700" style={{ fontSize: 12, fontWeight: 600 }}>{localActionPlan.filter(a => a.isCompleted).length}/{totalActions} completed</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${totalActions > 0 ? (localActionPlan.filter(a => a.isCompleted).length / totalActions) * 100 : 0}%` }} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex flex-col gap-3">
                {localActionPlan.map(item => (
                  <button key={item.id} onClick={() => toggleAction(item.id)} className={`flex items-start gap-4 p-4 rounded-xl border transition-all text-left ${item.isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-indigo-200'}`}>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${item.isCompleted ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 hover:border-indigo-400'}`}>
                      {item.isCompleted && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`${item.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`} style={{ fontSize: 14, fontWeight: 600 }}>{item.text}</p>
                      <p className="text-gray-400 mt-1" style={{ fontSize: 11 }}>Added {item.createdAt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Discussion Tab ── */}
        {activeTab === 'discussion' && (
          <div className="flex flex-col gap-6">
            <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 700 }}>Cohort Discussion</p>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <textarea value={newPost} onChange={e => setNewPost(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 resize-none" style={{ fontSize: 13 }} rows={3} placeholder="Share an update with the cohort..." />
              <div className="flex items-center justify-between mt-3">
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-gray-600" style={{ fontSize: 12 }}><Paperclip size={14} /> Attach</button>
                <button onClick={() => setNewPost('')} disabled={!newPost.trim()} className={`flex items-center gap-2 px-4 py-2 rounded-xl ${newPost.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`} style={{ fontSize: 12, fontWeight: 700 }}>
                  <Send size={14} /> Post
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {MOCK_DISCUSSIONS.map(post => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700" style={{ fontSize: 12, fontWeight: 700 }}>
                      {post.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 700 }}>{post.author}</p>
                      <p className="text-gray-400" style={{ fontSize: 11 }}>{post.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-700" style={{ fontSize: 13, lineHeight: 1.6 }}>{post.content}</p>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                    <button className="flex items-center gap-1 text-gray-400 hover:text-indigo-600" style={{ fontSize: 12 }}><MessageSquare size={14} /> {post.replies} replies</button>
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
              <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                <Upload size={16} /> Upload
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {MOCK_RESOURCES.map(resource => {
                const typeIcons: Record<string, React.ReactNode> = {
                  'PDF': <FileText size={18} className="text-red-500" />,
                  'Video': <Video size={18} className="text-purple-500" />,
                  'Link': <Link2 size={18} className="text-blue-500" />,
                  'Document': <FileText size={18} className="text-indigo-500" />,
                };
                return (
                  <div key={resource.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-between hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">{typeIcons[resource.type] || <FileText size={18} />}</div>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 600 }}>{resource.title}</p>
                        <p className="text-gray-400" style={{ fontSize: 11 }}>{resource.uploadedBy} · {resource.date} {resource.size && `· ${resource.size}`}</p>
                      </div>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-indigo-600"><Download size={16} /></button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Q&A Tab ── */}
        {activeTab === 'qna' && (
          <QAForum
            items={[
              { id: 'q1', question: 'How do I handle resistant clients in the first session?', askedBy: 'Priya Nair', date: 'Jan 12, 2026', answer: 'Great question! Start by validating their hesitation. Use motivational interviewing techniques — reflect their ambivalence without pushing. Build rapport first, and gently explore what brought them to therapy. Resistance often decreases when clients feel genuinely heard.', replies: [{ id: 'r1', author: 'Rohan Iyer', text: 'I found the "rolling with resistance" technique from MI really helpful in similar situations.', date: 'Jan 13, 2026' }], upvotes: 5, isResolved: true },
              { id: 'q2', question: 'What assessment tools do you recommend for adolescent anxiety in Indian context?', askedBy: 'Rohan Iyer', date: 'Jan 18, 2026', answer: 'The SCARED (Screen for Child Anxiety Related Disorders) has been validated in Indian populations. Also consider the Spence Children\'s Anxiety Scale. For qualitative assessment, semi-structured interviews adapted for cultural context work well.', replies: [], upvotes: 3, isResolved: true },
              { id: 'q3', question: 'Can we discuss ethical dilemmas in dual relationships for rural practice in the next session?', askedBy: 'Ananya Sharma', date: 'Feb 2, 2026', replies: [{ id: 'r2', author: 'Priya Nair', text: 'Yes! This is so relevant. In smaller towns it\'s almost unavoidable.', date: 'Feb 3, 2026' }], upvotes: 7 },
              { id: 'q4', question: 'Is there a recommended reading list for psychodynamic formulation beyond what was shared?', askedBy: 'Vikram Das', date: 'Feb 8, 2026', replies: [], upvotes: 2 },
            ]}
            accentColor="indigo"
            instructorLabel="Mentor Response"
          />
        )}
      </div>

      {/* ═══ Schedule Modal ═══ */}
      {showScheduleModal && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowScheduleModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between mb-5">
                <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Book a Session</p>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X size={16} /></button>
              </div>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Session Type</p>
                  <div className="flex gap-3">
                    {['group', '1:1'].map(t => (
                      <button key={t} onClick={() => setScheduleForm(p => ({ ...p, type: t }))} className={`flex-1 px-4 py-2.5 rounded-xl border text-[13px] font-semibold ${scheduleForm.type === t ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                        {t === 'group' ? 'Group Session' : '1:1 Session'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Date *</p>
                  <input type="date" value={scheduleForm.date} onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" style={{ fontSize: 13 }} />
                </div>
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Time *</p>
                  <input type="time" value={scheduleForm.time} onChange={e => setScheduleForm(p => ({ ...p, time: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" style={{ fontSize: 13 }} />
                </div>
                <div>
                  <p className="text-gray-700 mb-1" style={{ fontSize: 12, fontWeight: 600 }}>Meeting Link</p>
                  <input type="url" value={scheduleForm.meetingLink} onChange={e => setScheduleForm(p => ({ ...p, meetingLink: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-gray-200" style={{ fontSize: 13 }} placeholder="https://meet.google.com/..." />
                </div>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="mt-5 w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>
                Book Session
              </button>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}