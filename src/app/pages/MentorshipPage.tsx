import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  X, ChevronDown, Check, ArrowRight, ArrowLeft,
  Star, Users, Clock, Briefcase, MapPin, DollarSign,
  Layers, Globe, Calendar, CheckCircle2,
  MessageSquare, XCircle, Plus,
  Trash2, Link2, ClipboardList, LayoutList,
} from 'lucide-react';
import { MentorCard } from '@/app/components/MentorCard';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import {
  MOCK_MENTORS,
  MOCK_REQUESTS,
  MOCK_ACTIVE_MENTORSHIPS,
  MOCK_COMPLETED_MENTORSHIPS,
  MENTORSHIP_DOMAINS,
  MENTOR_CAREER_STAGES,
  FEE_RANGES,
  type MentorshipDomain,
  type MentorCareerStage,
  type ActiveMentorship,
  type MentorshipRequest,
  type MentorshipSession,
  type ActionItem,
} from '@/app/data/mentorship';
import { Portal } from '@/app/components/shared/Portal';

/* ── Filter state ── */
interface MentorFilterState {
  domains: MentorshipDomain[];
  careerStages: MentorCareerStage[];
  feeRange: string[];
}
const EMPTY_FILTERS: MentorFilterState = { domains: [], careerStages: [], feeRange: [] };

type DropdownKey = 'domains' | 'careerStages' | 'feeRange' | null;
type MyMentorshipTab = 'requests' | 'active' | 'completed';
type DetailTab = 'overview' | 'sessions' | 'actionPlan';

interface MentorshipPageProps {
  onNavigate: (page: string, params?: any) => void;
  onMentorSelect: (mentorId: string) => void;
  userRole?: string;
  activeSubTab: 'explore' | 'my';
  searchQuery: string;
}

export function MentorshipPage({ onNavigate, onMentorSelect, userRole, activeSubTab, searchQuery }: MentorshipPageProps) {
  const isProfessional = userRole === 'Professional';

  /* ── Explore state ── */
  const [filters, setFilters] = useState<MentorFilterState>(EMPTY_FILTERS);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [showAllMentors, setShowAllMentors] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  /* ── My Mentorship state ── */
  const [myTab, setMyTab] = useState<MyMentorshipTab>('active');
  const [requests, setRequests] = useState<MentorshipRequest[]>(MOCK_REQUESTS);
  const [activeMentorships, setActiveMentorships] = useState<ActiveMentorship[]>(MOCK_ACTIVE_MENTORSHIPS);
  const [completedMentorships] = useState<ActiveMentorship[]>(MOCK_COMPLETED_MENTORSHIPS);

  /* ── Detail view state ── */
  const [selectedMentorshipId, setSelectedMentorshipId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [legalAgreed, setLegalAgreed] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', meetingLink: '' });
  const [newTaskText, setNewTaskText] = useState('');

  /* ── Toggle filter ── */
  const toggleFilter = useCallback(<T extends string>(key: keyof MentorFilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  /* ── Derived flags ── */
  const hasActiveFilters = (Object.values(filters) as string[][]).some(arr => arr.length > 0);
  const hasSearch = !!searchQuery;
  const isDiscoveryMode = !hasSearch && !hasActiveFilters && !showAllMentors;

  /* ── Close dropdown on outside click ── */
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  /* ── Scroll on filter close ── */
  const prevOpen = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpen.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
    prevOpen.current = openDropdown;
  }, [openDropdown, hasActiveFilters]);

  /* ── Reset detail view when switching tabs ── */
  useEffect(() => {
    if (activeSubTab === 'explore') {
      setSelectedMentorshipId(null);
    }
  }, [activeSubTab]);

  /* ── Filter mentors ── */
  const filteredMentors = useMemo(() => {
    let result = MOCK_MENTORS.filter(m => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.domain.toLowerCase().includes(q) || m.specializations.some(s => s.toLowerCase().includes(q));
      if (!matchesSearch) return false;
      if (filters.domains.length > 0 && !filters.domains.includes(m.domain)) return false;
      if (filters.careerStages.length > 0 && !filters.careerStages.includes(m.careerStage)) return false;
      if (filters.feeRange.length > 0) {
        const matchesFee = filters.feeRange.some(label => {
          const range = FEE_RANGES.find(r => r.label === label);
          if (!range) return false;
          return m.feePerSession >= range.min && m.feePerSession <= range.max;
        });
        if (!matchesFee) return false;
      }
      return true;
    });
    result.sort((a, b) => (a.isFeatured ? -1 : 0) - (b.isFeatured ? -1 : 0));
    return result;
  }, [searchQuery, filters]);

  const featuredMentors = useMemo(() => MOCK_MENTORS.filter(m => m.isFeatured), []);

  const clearFilters = () => { setFilters(EMPTY_FILTERS); setShowAllMentors(false); };

  /* ── Primary filter chips ── */
  const PRIMARY_CHIPS: { key: DropdownKey & string; label: string; icon: React.ReactNode; options: string[]; filterKey: keyof MentorFilterState }[] = [
    { key: 'domains', label: 'Domain', icon: <Layers size={14} />, options: MENTORSHIP_DOMAINS, filterKey: 'domains' },
    { key: 'careerStages', label: 'Career Stage', icon: <Briefcase size={14} />, options: MENTOR_CAREER_STAGES, filterKey: 'careerStages' },
    { key: 'feeRange', label: 'Fee Range', icon: <DollarSign size={14} />, options: FEE_RANGES.map(r => r.label), filterKey: 'feeRange' },
  ];

  /* ── Active filter tags ── */
  const activeFilterTags: { label: string; group: string; onRemove: () => void }[] = [];
  filters.domains.forEach(d => activeFilterTags.push({ label: d, group: 'Domain', onRemove: () => toggleFilter('domains', d) }));
  filters.careerStages.forEach(s => activeFilterTags.push({ label: s, group: 'Career Stage', onRemove: () => toggleFilter('careerStages', s) }));
  filters.feeRange.forEach(f => activeFilterTags.push({ label: f, group: 'Fee', onRemove: () => toggleFilter('feeRange', f) }));

  /* ── Request handlers ── */
  const handleAcceptRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    setRequests(prev => prev.filter(r => r.id !== reqId));
    const newMentorship: ActiveMentorship = {
      id: `am-new-${Date.now()}`,
      mentorId: req.mentorId,
      menteeId: req.menteeId,
      menteeName: req.menteeName,
      menteeAvatar: req.menteeAvatar,
      menteeCareerStage: req.menteeCareerStage,
      mentorName: 'Dr. Meera Kapoor',
      mentorAvatar: MOCK_MENTORS[0].avatarUrl,
      goal: req.goal,
      frequency: req.frequency,
      commitment: req.commitment,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      sessions: [],
      actionPlan: [],
      legalAgreed: false,
    };
    setActiveMentorships(prev => [...prev, newMentorship]);
    setMyTab('active');
  };

  const handleDeclineRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
  };

  /* ── Session / Action Plan handlers ── */
  const selectedMentorship = activeMentorships.find(m => m.id === selectedMentorshipId) || completedMentorships.find(m => m.id === selectedMentorshipId);

  const handleMarkSessionComplete = (sessionId: string) => {
    setActiveMentorships(prev => prev.map(m => {
      if (m.id !== selectedMentorshipId) return m;
      return { ...m, sessions: m.sessions.map(s => s.id === sessionId ? { ...s, status: 'Completed' as const } : s) };
    }));
  };

  const handleToggleTask = (taskId: string) => {
    setActiveMentorships(prev => prev.map(m => {
      if (m.id !== selectedMentorshipId) return m;
      return { ...m, actionPlan: m.actionPlan.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t) };
    }));
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    const newTask: ActionItem = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      isCompleted: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setActiveMentorships(prev => prev.map(m => {
      if (m.id !== selectedMentorshipId) return m;
      return { ...m, actionPlan: [...m.actionPlan, newTask] };
    }));
    setNewTaskText('');
  };

  const handleDeleteTask = (taskId: string) => {
    setActiveMentorships(prev => prev.map(m => {
      if (m.id !== selectedMentorshipId) return m;
      return { ...m, actionPlan: m.actionPlan.filter(t => t.id !== taskId) };
    }));
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: MentorshipSession = {
      id: `s-${Date.now()}`,
      sessionNumber: (selectedMentorship?.sessions.length || 0) + 1,
      date: scheduleForm.date,
      time: scheduleForm.time,
      meetingLink: scheduleForm.meetingLink || undefined,
      notes: '',
      actionItems: [],
      status: 'Scheduled',
    };
    setActiveMentorships(prev => prev.map(m => {
      if (m.id !== selectedMentorshipId) return m;
      return { ...m, sessions: [...m.sessions, newSession] };
    }));
    setShowScheduleModal(false);
    setScheduleForm({ date: '', time: '', meetingLink: '' });
  };

  const handleAgreeToLegal = () => {
    setLegalAgreed(true);
    setActiveMentorships(prev => prev.map(m => {
      if (m.id !== selectedMentorshipId) return m;
      return { ...m, legalAgreed: true };
    }));
  };

  /* ══════════════════════════════════════════════════════
     RENDER: Active Mentorship Detail View
     ══════════════════════════════════════════════════════ */
  if (activeSubTab === 'my' && selectedMentorship) {
    const ms = selectedMentorship;
    const completedSessions = ms.sessions.filter(s => s.status === 'Completed').length;
    const completedTasks = ms.actionPlan.filter(t => t.isCompleted).length;

    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-300">
        <button
          onClick={() => { setSelectedMentorshipId(null); setDetailTab('overview'); setLegalAgreed(ms.legalAgreed); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline self-start"
        >
          <ArrowLeft size={16} /> Back to My Mentors
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
              <ImageWithFallback
                src={isProfessional ? ms.menteeAvatar : ms.mentorAvatar}
                alt={isProfessional ? ms.menteeName : ms.mentorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{isProfessional ? ms.menteeName : ms.mentorName}</h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <Chip label={ms.frequency} variant="blue" />
                <Chip label={ms.commitment} variant="mint" />
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${ms.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  {ms.status === 'Active' && <CheckCircle2 size={10} />}
                  {ms.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('Messages', { personId: 'p-1' })}
              className="px-4 py-2 text-[13px] font-semibold text-brand-primary bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <MessageSquare size={14} /> Message
            </button>
            {ms.status === 'Active' && (
              <button
                onClick={() => onNavigate('CohortHub', { mentorshipId: ms.id })}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <LayoutList size={14} /> Open Hub
              </button>
            )}
          </div>

          {/* Legal agreement */}
          {!ms.legalAgreed && !legalAgreed && (
            <div className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={legalAgreed} onChange={handleAgreeToLegal} className="mt-0.5 rounded" />
                <span className="text-[12px] text-amber-700 leading-relaxed">
                  I understand this mentorship is professional guidance and not therapy or clinical supervision.
                </span>
              </label>
            </div>
          )}
          {(ms.legalAgreed || legalAgreed) && (
            <div className="mt-4 p-2.5 rounded-lg bg-green-50 border border-green-100 flex items-center gap-2 text-[12px] text-green-700 font-medium">
              <CheckCircle2 size={13} className="text-green-500" /> Professional guidance agreement acknowledged
            </div>
          )}
        </div>

        {/* Detail tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 self-start">
          {([
            { key: 'overview' as DetailTab, label: 'Overview', icon: <LayoutList size={14} /> },
            { key: 'sessions' as DetailTab, label: `Sessions (${ms.sessions.length})`, icon: <Calendar size={14} /> },
            { key: 'actionPlan' as DetailTab, label: `Action Plan (${ms.actionPlan.length})`, icon: <ClipboardList size={14} /> },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setDetailTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-[13px] font-semibold transition-all ${
                detailTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {detailTab === 'overview' && (
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { label: 'Goal', value: ms.goal },
                { label: 'Started', value: new Date(ms.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                { label: 'Frequency', value: ms.frequency },
                { label: 'Commitment', value: ms.commitment },
                { label: 'Sessions Completed', value: `${completedSessions} of ${ms.sessions.length}` },
                { label: 'Tasks Completed', value: `${completedTasks} of ${ms.actionPlan.length}` },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">{item.label}</div>
                  <p className="text-[14px] text-gray-900 font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Sessions ── */}
        {detailTab === 'sessions' && (
          <div className="flex flex-col gap-3">
            {ms.status === 'Active' && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-semibold text-[13px] rounded-lg hover:bg-brand-primary/90 transition-all shadow-sm"
              >
                <Plus size={14} /> Schedule Session
              </button>
            )}

            {ms.sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
                <Calendar size={24} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No sessions yet. Schedule your first one!</p>
              </div>
            ) : (
              ms.sessions.map(session => (
                <div key={session.id} className={`bg-white rounded-xl border p-4 shadow-sm ${session.status === 'Scheduled' ? 'border-blue-200' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-[11px] font-bold text-indigo-600">#{session.sessionNumber}</span>
                      <div>
                        <p className="text-[14px] font-bold text-gray-900">Session {session.sessionNumber}</p>
                        <p className="text-[12px] text-gray-500">{new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &middot; {session.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.meetingLink && (
                        <a href={session.meetingLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] font-medium text-brand-primary hover:underline">
                          <Link2 size={12} /> Join
                        </a>
                      )}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        session.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200'
                        : session.status === 'Scheduled' ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {session.status === 'Completed' && <CheckCircle2 size={10} />}
                        {session.status === 'Scheduled' && <Clock size={10} />}
                        {session.status}
                      </span>
                    </div>
                  </div>

                  {session.notes && (
                    <p className="text-[13px] text-gray-600 leading-relaxed mb-2 pl-9">{session.notes}</p>
                  )}

                  {session.actionItems.length > 0 && (
                    <ul className="flex flex-col gap-1 pl-9 mb-2">
                      {session.actionItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[12px] text-gray-500">
                          <CheckCircle2 size={11} className="text-green-400 mt-0.5 shrink-0" /> {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {session.status === 'Scheduled' && ms.status === 'Active' && (
                    <button
                      onClick={() => handleMarkSessionComplete(session.id)}
                      className="text-[12px] font-semibold text-brand-primary hover:underline flex items-center gap-1 pl-9"
                    >
                      <CheckCircle2 size={12} /> Mark Complete
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Action Plan ── */}
        {detailTab === 'actionPlan' && (
          <div className="flex flex-col gap-3">
            {ms.status === 'Active' && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddTask()}
                  placeholder="Add a new task..."
                  className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary/40 transition-all"
                />
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskText.trim()}
                  className="px-4 py-2.5 bg-brand-primary text-white font-semibold text-[13px] rounded-lg hover:bg-brand-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            )}

            {ms.actionPlan.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
                <ClipboardList size={24} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No tasks yet. Add your first action item above.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
                {ms.actionPlan.map(task => (
                  <div key={task.id} className="flex items-center gap-3 px-4 py-3 group">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                        task.isCompleted ? 'bg-brand-primary border-brand-primary' : 'bg-white border-gray-300 hover:border-brand-primary/60'
                      }`}
                    >
                      {task.isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                    </button>
                    <span className={`flex-1 text-[14px] ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-700'}`}>{task.text}</span>
                    <span className="text-[11px] text-gray-400 shrink-0 hidden sm:inline">{task.createdAt}</span>
                    {ms.status === 'Active' && (
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Schedule Session Modal */}
        {showScheduleModal && (
          <Portal><div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowScheduleModal(false)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-[17px] font-bold text-gray-900">Schedule Session</h2>
                <button onClick={() => setShowScheduleModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"><X size={18} /></button>
              </div>
              <form onSubmit={handleScheduleSession} className="px-6 py-5">
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Date *</label>
                    <input type="date" required value={scheduleForm.date} onChange={e => setScheduleForm(p => ({ ...p, date: e.target.value }))} className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Time *</label>
                    <input type="time" required value={scheduleForm.time} onChange={e => setScheduleForm(p => ({ ...p, time: e.target.value }))} className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-semibold text-gray-500">Meeting Link</label>
                    <input type="url" value={scheduleForm.meetingLink} onChange={e => setScheduleForm(p => ({ ...p, meetingLink: e.target.value }))} placeholder="https://meet.google.com/..." className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                  </div>
                </div>
                <button type="submit" className="w-full py-3 bg-brand-primary text-white font-bold text-[14px] rounded-xl hover:bg-brand-primary/90 transition-all flex items-center justify-center gap-2">
                  <Calendar size={15} /> Confirm Session
                </button>
              </form>
            </div>
          </div></Portal>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     RENDER: Explore Mentors
     ══════════════════════════════════════════════════════ */
  if (activeSubTab === 'explore') {
    return (
      <div className="animate-in slide-in-from-left-4 duration-300 flex flex-col gap-8">

        {/* Primary filter chips */}
        <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
          {PRIMARY_CHIPS.map(cat => {
            const selected = (filters[cat.filterKey] as string[]) || [];
            const count = selected.length;
            const isOpen = openDropdown === cat.key;
            return (
              <div key={cat.key} className="relative">
                <button
                  onClick={() => setOpenDropdown(isOpen ? null : cat.key)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all border shadow-sm ${
                    count > 0
                      ? 'bg-brand-primary text-white border-brand-primary shadow-brand-primary/20'
                      : isOpen
                      ? 'bg-white text-brand-primary border-brand-primary/40 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-primary/40 hover:text-brand-primary hover:shadow-md'
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                  {count > 0 && (
                    <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">{count}</span>
                  )}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                      {cat.options.map(option => {
                        const isSelected = selected.includes(option);
                        return (
                          <button
                            key={option}
                            onClick={() => toggleFilter(cat.filterKey, option)}
                            className={`w-full text-left px-4 py-2.5 text-[13px] flex items-center gap-3 transition-colors ${
                              isSelected ? 'bg-brand-primary/5 text-brand-primary font-semibold' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                              isSelected ? 'bg-brand-primary border-brand-primary' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check size={10} className="text-white" strokeWidth={3} />}
                            </div>
                            {option}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Mode chip (static for Phase 1) */}
          <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold bg-gray-50 text-gray-400 border border-gray-200 cursor-default">
            <Globe size={14} /> Online Only
          </span>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-semibold text-brand-primary hover:bg-brand-primary/[0.06] transition-colors">
              <X size={14} strokeWidth={2.5} /> Clear All
            </button>
          )}
        </div>

        <div ref={listingsRef} className="-mt-4" />

        {/* Company: Request Mentoring Banner */}
        {userRole === 'Company' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <Users size={18} className="text-indigo-700" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Need mentoring for your team?</p>
                <p className="text-gray-500" style={{ fontSize: 12 }}>Submit a request and qualified mentors will apply to work with your organization.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('RequestForm', { requestType: 'mentoring' })}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shrink-0 flex items-center gap-2"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <Plus size={14} /> Request Mentoring
            </button>
          </div>
        )}

        {/* ═══ DISCOVERY MODE ═══ */}
        {isDiscoveryMode && (
          <div className="flex flex-col gap-12">
            {featuredMentors.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Star size={18} className="text-amber-500" /> Featured Mentors
                  </h2>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{featuredMentors.length} Featured</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredMentors.map(m => (
                    <div key={m.id} className="h-full">
                      <MentorCard mentor={m} onClick={() => onMentorSelect(m.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">All Mentors</h2>
                <button onClick={() => setShowAllMentors(true)} className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_MENTORS.slice(0, 6).map(m => (
                  <div key={m.id} className="h-full">
                    <MentorCard mentor={m} onClick={() => onMentorSelect(m.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ FILTERED / SEARCH / VIEW-ALL ═══ */}
        {!isDiscoveryMode && (
          <div className="flex flex-col gap-4">
            {(activeFilterTags.length > 0 || hasSearch) && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Active Filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium">
                    &quot;{searchQuery}&quot;
                  </span>
                )}
                {activeFilterTags.map(tag => (
                  <span key={`${tag.group}-${tag.label}`} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium">
                    {tag.label}
                    <button onClick={tag.onRemove} className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors"><X size={10} strokeWidth={2.5} /></button>
                  </span>
                ))}
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-[12px] font-semibold text-gray-400 hover:text-brand-primary transition-colors ml-1">Clear All</button>
                )}
              </div>
            )}

            <button onClick={clearFilters} className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline self-start">
              <ArrowLeft size={16} /> Back to Explore
            </button>

            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  {showAllMentors && !hasSearch && !hasActiveFilters ? 'All Mentors' : 'Search Results'}
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="text-gray-900 font-bold">{filteredMentors.length}</span> result{filteredMentors.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredMentors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredMentors.map(m => (
                    <div key={m.id} className="h-full">
                      <MentorCard mentor={m} onClick={() => onMentorSelect(m.id)} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyStateNudge
                  module="mentoring"
                  onNavigate={onNavigate}
                  onClearFilters={clearFilters}
                />
              )}

              {/* Low results cross-link nudge */}
              {filteredMentors.length > 0 && filteredMentors.length < 3 && (
                <LowResultsNudge
                  module="mentoring"
                  resultCount={filteredMentors.length}
                  onNavigate={onNavigate}
                />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     RENDER: My Mentors
     ══════════════════════════════════════════════════════ */
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col gap-6">
      {/* Sub-tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {([
          { key: 'active' as MyMentorshipTab, label: `Active (${activeMentorships.length})` },
          { key: 'requests' as MyMentorshipTab, label: `Requests (${requests.length})` },
          { key: 'completed' as MyMentorshipTab, label: `Completed (${completedMentorships.length})` },
        ]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setMyTab(tab.key)}
            className={`pb-3 text-[13px] font-bold whitespace-nowrap border-b-2 transition-all ${
              myTab === tab.key ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Active ── */}
      {myTab === 'active' && (
        <div className="flex flex-col gap-3">
          {activeMentorships.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
              <Users size={24} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No active mentorships yet.</p>
            </div>
          ) : (
            activeMentorships.map(ms => {
              const done = ms.sessions.filter(s => s.status === 'Completed').length;
              return (
                <div
                  key={ms.id}
                  onClick={() => { setSelectedMentorshipId(ms.id); setDetailTab('overview'); setLegalAgreed(ms.legalAgreed); }}
                  className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <ImageWithFallback
                        src={isProfessional ? ms.menteeAvatar : ms.mentorAvatar}
                        alt={isProfessional ? ms.menteeName : ms.mentorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate">{isProfessional ? ms.menteeName : ms.mentorName}</h3>
                        <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 shrink-0">
                          <CheckCircle2 size={9} /> Active
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-500 truncate">{ms.goal}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span>{ms.frequency}</span>
                        <span className="text-gray-300">&middot;</span>
                        <span>{done}/{ms.sessions.length} sessions</span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-300 group-hover:text-brand-primary transition-colors shrink-0" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ── Pending Requests ── */}
      {myTab === 'requests' && (
        <div className="flex flex-col gap-3">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
              <Clock size={24} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No pending requests.</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback src={req.menteeAvatar} alt={req.menteeName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-gray-900">{req.menteeName}</h3>
                      <Chip label={req.menteeCareerStage} variant="blue" />
                    </div>
                    <p className="text-[13px] text-gray-600 mb-1">{req.goal}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span>{req.frequency}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{req.commitment}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleAcceptRequest(req.id)} className="px-3 py-1.5 text-[12px] font-bold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1">
                      <CheckCircle2 size={11} /> Accept
                    </button>
                    <button onClick={() => handleDeclineRequest(req.id)} className="px-3 py-1.5 text-[12px] font-bold text-red-600 bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1">
                      <XCircle size={11} /> Decline
                    </button>
                    <button onClick={() => onNavigate('Messages', { personId: 'p-1' })} className="p-1.5 text-gray-400 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                      <MessageSquare size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── Completed ── */}
      {myTab === 'completed' && (
        <div className="flex flex-col gap-3">
          {completedMentorships.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
              <CheckCircle2 size={24} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No completed mentorships.</p>
            </div>
          ) : (
            completedMentorships.map(ms => (
              <div key={ms.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm opacity-75">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback
                      src={isProfessional ? ms.menteeAvatar : ms.mentorAvatar}
                      alt={isProfessional ? ms.menteeName : ms.mentorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[14px] font-bold text-gray-900">{isProfessional ? ms.menteeName : ms.mentorName}</h3>
                      <span className="inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">Completed</span>
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">{ms.goal}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{ms.startDate} &mdash; {ms.endDate}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{ms.commitment}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}