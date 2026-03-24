import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  X, ChevronDown, Check, ArrowRight, ArrowLeft,
  Star, Users, Clock, Briefcase, DollarSign,
  Layers, Globe, Calendar, CheckCircle2,
  MessageSquare, XCircle, Plus, Wifi,
  Link2, LayoutList, Download, Award,
} from 'lucide-react';
import { SupervisorCard } from '@/app/components/SupervisorCard';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Chip } from '@/app/components/Chip';
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import {
  MOCK_SUPERVISORS,
  MOCK_SUPERVISION_REQUESTS,
  MOCK_ACTIVE_SUPERVISIONS,
  MOCK_COMPLETED_SUPERVISIONS,
  SUPERVISION_DOMAINS,
  SUPERVISION_PURPOSES,
  getTotalHours,
  type SupervisionDomain,
  type SupervisionPurpose,
  type SupervisionSessionType,
  type ActiveSupervision,
  type SupervisionRequest,
  type SupervisionSession,
} from '@/app/data/supervision';

import { Portal } from '@/app/components/shared/Portal';

/* ── Filter state ── */
interface SupervisorFilterState {
  domains: SupervisionDomain[];
  purposes: SupervisionPurpose[];
  modes: string[];
  payment: string[];
  sessionTypes: string[];
}
const EMPTY_FILTERS: SupervisorFilterState = { domains: [], purposes: [], modes: [], payment: [], sessionTypes: [] };

type DropdownKey = 'domains' | 'purposes' | 'modes' | 'payment' | 'sessionTypes' | null;
type MySupervisionTab = 'active' | 'requests' | 'completed';
type DetailTab = 'overview' | 'sessions' | 'hoursLog' | 'certificate';

interface SupervisionPageProps {
  onNavigate: (page: string, params?: any) => void;
  onSupervisorSelect: (supervisorId: string) => void;
  userRole?: string;
  activeSubTab: 'explore' | 'my';
  searchQuery: string;
}

export function SupervisionPage({ onNavigate, onSupervisorSelect, userRole, activeSubTab, searchQuery }: SupervisionPageProps) {
  const isProfessional = userRole === 'Professional';

  /* ── Explore state ── */
  const [filters, setFilters] = useState<SupervisorFilterState>(EMPTY_FILTERS);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [showAllSupervisors, setShowAllSupervisors] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listingsRef = useRef<HTMLDivElement>(null);

  /* ── My Supervision state ── */
  const [myTab, setMyTab] = useState<MySupervisionTab>('active');
  const [requests, setRequests] = useState<SupervisionRequest[]>(MOCK_SUPERVISION_REQUESTS);
  const [activeSupervisions, setActiveSupervisions] = useState<ActiveSupervision[]>(MOCK_ACTIVE_SUPERVISIONS);
  const [completedSupervisions] = useState<ActiveSupervision[]>(MOCK_COMPLETED_SUPERVISIONS);

  /* ── Detail view state ── */
  const [selectedSupervisionId, setSelectedSupervisionId] = useState<string | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('overview');
  const [legalAgreed, setLegalAgreed] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', time: '', duration: '1', meetingLink: '' });

  /* ── Toggle filter ── */
  const toggleFilter = useCallback(<T extends string>(key: keyof SupervisorFilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);

  /* ── Derived flags ── */
  const hasActiveFilters = (Object.values(filters) as string[][]).some(arr => arr.length > 0);
  const hasSearch = !!searchQuery;
  const isDiscoveryMode = !hasSearch && !hasActiveFilters && !showAllSupervisors;

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

  useEffect(() => {
    if (activeSubTab === 'explore') setSelectedSupervisionId(null);
  }, [activeSubTab]);

  /* ── Filter supervisors ── */
  const filteredSupervisors = useMemo(() => {
    let result = MOCK_SUPERVISORS.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || s.name.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q) || s.specializations.some(sp => sp.toLowerCase().includes(q));
      if (!matchesSearch) return false;
      if (filters.domains.length > 0 && !filters.domains.includes(s.domain)) return false;
      if (filters.purposes.length > 0 && !s.purposes.some(p => filters.purposes.includes(p))) return false;
      if (filters.modes.length > 0 && !filters.modes.includes(s.mode) && !(s.mode === 'Both' && filters.modes.length > 0)) return false;
      if (filters.payment.length > 0) {
        const wantsPaid = filters.payment.includes('Paid');
        const wantsFree = filters.payment.includes('Unpaid');
        if (wantsPaid && !s.isPaid && !wantsFree) return false;
        if (wantsFree && s.isPaid && !wantsPaid) return false;
      }
      if (filters.sessionTypes.length > 0 && !filters.sessionTypes.includes(s.sessionType) && !(s.sessionType === 'Both' && filters.sessionTypes.length > 0)) return false;
      return true;
    });
    result.sort((a, b) => (a.isFeatured ? -1 : 0) - (b.isFeatured ? -1 : 0));
    return result;
  }, [searchQuery, filters]);

  const featuredSupervisors = useMemo(() => MOCK_SUPERVISORS.filter(s => s.isFeatured), []);

  const clearFilters = () => { setFilters(EMPTY_FILTERS); setShowAllSupervisors(false); };

  /* ── Primary filter chips ── */
  const PRIMARY_CHIPS: { key: DropdownKey & string; label: string; icon: React.ReactNode; options: string[]; filterKey: keyof SupervisorFilterState }[] = [
    { key: 'domains', label: 'Domain', icon: <Layers size={14} />, options: SUPERVISION_DOMAINS, filterKey: 'domains' },
    { key: 'purposes', label: 'Purpose', icon: <Briefcase size={14} />, options: SUPERVISION_PURPOSES, filterKey: 'purposes' },
    { key: 'modes', label: 'Mode', icon: <Wifi size={14} />, options: ['Online', 'Offline'], filterKey: 'modes' },
    { key: 'payment', label: 'Payment', icon: <DollarSign size={14} />, options: ['Paid', 'Unpaid'], filterKey: 'payment' },
    { key: 'sessionTypes', label: 'Session Type', icon: <Users size={14} />, options: ['1:1', 'Group'], filterKey: 'sessionTypes' },
  ];

  /* ── Active filter tags ── */
  const activeFilterTags: { label: string; group: string; onRemove: () => void }[] = [];
  filters.domains.forEach(d => activeFilterTags.push({ label: d, group: 'Domain', onRemove: () => toggleFilter('domains', d) }));
  filters.purposes.forEach(p => activeFilterTags.push({ label: p, group: 'Purpose', onRemove: () => toggleFilter('purposes', p) }));
  filters.modes.forEach(m => activeFilterTags.push({ label: m, group: 'Mode', onRemove: () => toggleFilter('modes', m) }));
  filters.payment.forEach(p => activeFilterTags.push({ label: p, group: 'Payment', onRemove: () => toggleFilter('payment', p) }));
  filters.sessionTypes.forEach(st => activeFilterTags.push({ label: st, group: 'Session Type', onRemove: () => toggleFilter('sessionTypes', st) }));

  /* ── Request handlers ── */
  const handleAcceptRequest = (reqId: string) => {
    const req = requests.find(r => r.id === reqId);
    if (!req) return;
    setRequests(prev => prev.filter(r => r.id !== reqId));
    const newSup: ActiveSupervision = {
      id: `asup-new-${Date.now()}`,
      supervisorId: req.supervisorId,
      superviseeId: req.superviseeId,
      superviseeName: req.superviseeName,
      superviseeAvatar: req.superviseeAvatar,
      superviseeCareerStage: req.superviseeCareerStage,
      supervisorName: MOCK_SUPERVISORS[0].name,
      supervisorAvatar: MOCK_SUPERVISORS[0].avatarUrl,
      goal: req.goal,
      purpose: req.purpose,
      frequency: req.frequency,
      mode: 'Online',
      sessionType: req.sessionType,
      status: 'Active',
      startDate: new Date().toISOString().split('T')[0],
      sessions: [],
      certificateIssued: false,
      legalAgreed: false,
    };
    setActiveSupervisions(prev => [...prev, newSup]);
    setMyTab('active');
  };

  const handleDeclineRequest = (reqId: string) => {
    setRequests(prev => prev.filter(r => r.id !== reqId));
  };

  /* ── Session handlers ── */
  const selectedSupervision = activeSupervisions.find(s => s.id === selectedSupervisionId) || completedSupervisions.find(s => s.id === selectedSupervisionId);

  const handleMarkSessionComplete = (sessionId: string) => {
    setActiveSupervisions(prev => prev.map(s => {
      if (s.id !== selectedSupervisionId) return s;
      return { ...s, sessions: s.sessions.map(ss => ss.id === sessionId ? { ...ss, status: 'Completed' as const } : ss) };
    }));
  };

  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newSession: SupervisionSession = {
      id: `ss-${Date.now()}`,
      sessionNumber: (selectedSupervision?.sessions.length || 0) + 1,
      date: scheduleForm.date,
      time: scheduleForm.time,
      duration: parseFloat(scheduleForm.duration) || 1,
      meetingLink: scheduleForm.meetingLink || undefined,
      notes: '', feedback: '', status: 'Scheduled',
    };
    setActiveSupervisions(prev => prev.map(s => {
      if (s.id !== selectedSupervisionId) return s;
      return { ...s, sessions: [...s.sessions, newSession] };
    }));
    setShowScheduleModal(false);
    setScheduleForm({ date: '', time: '', duration: '1', meetingLink: '' });
  };

  const handleAgreeToLegal = () => {
    setLegalAgreed(true);
    setActiveSupervisions(prev => prev.map(s => {
      if (s.id !== selectedSupervisionId) return s;
      return { ...s, legalAgreed: true };
    }));
  };

  const handleIssueCertificate = () => {
    setActiveSupervisions(prev => prev.map(s => {
      if (s.id !== selectedSupervisionId) return s;
      return { ...s, certificateIssued: true };
    }));
  };

  const handleExportHours = () => {
    if (!selectedSupervision) return;
    const completedSessions = selectedSupervision.sessions.filter(s => s.status === 'Completed');
    let csv = 'Session #,Date,Time,Duration (hrs),Status\n';
    completedSessions.forEach(s => {
      csv += `${s.sessionNumber},${s.date},${s.time},${s.duration},${s.status}\n`;
    });
    csv += `\nTotal Hours,${getTotalHours(selectedSupervision.sessions)}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `supervision-hours-${selectedSupervision.superviseeName.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ══════════════════════════════════════════════════════
     RENDER: Active Supervision Detail View
     ══════════════════════════════════════════════════════ */
  if (activeSubTab === 'my' && selectedSupervision) {
    const sv = selectedSupervision;
    const completedSessions = sv.sessions.filter(s => s.status === 'Completed').length;
    const totalHours = getTotalHours(sv.sessions);

    return (
      <div className="flex flex-col gap-6 animate-in slide-in-from-left-4 duration-300">
        <button
          onClick={() => { setSelectedSupervisionId(null); setDetailTab('overview'); setLegalAgreed(sv.legalAgreed); }}
          className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline self-start"
        >
          <ArrowLeft size={16} /> Back to My Supervision
        </button>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 shrink-0">
              <ImageWithFallback
                src={isProfessional ? sv.superviseeAvatar : sv.supervisorAvatar}
                alt={isProfessional ? sv.superviseeName : sv.supervisorName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{isProfessional ? sv.superviseeName : sv.supervisorName}</h2>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <Chip label={sv.purpose} variant="purple" />
                <Chip label={sv.frequency} variant="blue" />
                <Chip label={sv.sessionType} variant="mint" />
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sv.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                  {sv.status === 'Active' && <CheckCircle2 size={10} />}
                  {sv.status}
                </span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('Messages', { personId: 'p-1' })}
              className="px-4 py-2 text-[13px] font-semibold text-brand-primary bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <MessageSquare size={14} /> Message
            </button>
            {sv.status === 'Active' && (
              <button
                onClick={() => onNavigate('SupervisionHub', { supervisionId: sv.id })}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-1.5 shrink-0"
              >
                <LayoutList size={14} /> Open Hub
              </button>
            )}
          </div>

          {/* Legal agreement */}
          {!sv.legalAgreed && !legalAgreed && (
            <div className="mt-4 p-3.5 rounded-lg bg-amber-50 border border-amber-200">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={legalAgreed} onChange={handleAgreeToLegal} className="mt-0.5 rounded" />
                <span className="text-[12px] text-amber-700 leading-relaxed">
                  I understand supervision is professional guidance and not therapy.
                </span>
              </label>
            </div>
          )}
          {(sv.legalAgreed || legalAgreed) && (
            <div className="mt-4 p-2.5 rounded-lg bg-green-50 border border-green-100 flex items-center gap-2 text-[12px] text-green-700 font-medium">
              <CheckCircle2 size={13} className="text-green-500" /> Professional guidance agreement acknowledged
            </div>
          )}
        </div>

        {/* Detail tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 self-start flex-wrap">
          {([
            { key: 'overview' as DetailTab, label: 'Overview', icon: <LayoutList size={14} /> },
            { key: 'sessions' as DetailTab, label: `Sessions (${sv.sessions.length})`, icon: <Calendar size={14} /> },
            { key: 'hoursLog' as DetailTab, label: `Hours (${totalHours})`, icon: <Clock size={14} /> },
            { key: 'certificate' as DetailTab, label: 'Certificate', icon: <Award size={14} /> },
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
                { label: 'Goal', value: sv.goal },
                { label: 'Purpose', value: sv.purpose },
                { label: 'Started', value: new Date(sv.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
                { label: 'Frequency', value: sv.frequency },
                { label: 'Mode', value: sv.mode },
                { label: 'Session Type', value: sv.sessionType },
                { label: 'Sessions Completed', value: `${completedSessions} of ${sv.sessions.length}` },
                { label: 'Total Hours Logged', value: `${totalHours} hrs` },
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
            {sv.status === 'Active' && (
              <button
                onClick={() => setShowScheduleModal(true)}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 bg-brand-primary text-white font-semibold text-[13px] rounded-lg hover:bg-brand-primary/90 transition-all shadow-sm"
              >
                <Plus size={14} /> Schedule Session
              </button>
            )}

            {sv.sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
                <Calendar size={24} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No sessions yet. Schedule your first one!</p>
              </div>
            ) : (
              sv.sessions.map(session => (
                <div key={session.id} className={`bg-white rounded-xl border p-4 shadow-sm ${session.status === 'Scheduled' ? 'border-blue-200' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-indigo-50 flex items-center justify-center text-[11px] font-bold text-indigo-600">#{session.sessionNumber}</span>
                      <div>
                        <p className="text-[14px] font-bold text-gray-900">Session {session.sessionNumber}</p>
                        <p className="text-[12px] text-gray-500">
                          {new Date(session.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} &middot; {session.time} &middot; {session.duration}h
                        </p>
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
                    <div className="pl-9 mb-2">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Notes</p>
                      <p className="text-[13px] text-gray-600 leading-relaxed">{session.notes}</p>
                    </div>
                  )}

                  {session.feedback && (
                    <div className="pl-9 mb-2">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Feedback</p>
                      <p className="text-[13px] text-gray-600 leading-relaxed italic">{session.feedback}</p>
                    </div>
                  )}

                  {session.status === 'Scheduled' && sv.status === 'Active' && (
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

        {/* ── Hours Log ── */}
        {detailTab === 'hoursLog' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-brand-primary/[0.08] px-4 py-2.5 rounded-lg">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Total Hours</span>
                  <span className="text-[22px] font-extrabold text-brand-primary">{totalHours}</span>
                </div>
                <div className="bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">Sessions</span>
                  <span className="text-[22px] font-extrabold text-gray-900">{completedSessions}</span>
                </div>
              </div>
              <button
                onClick={handleExportHours}
                className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-brand-primary bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Download size={14} /> Export CSV
              </button>
            </div>

            {sv.sessions.filter(s => s.status === 'Completed').length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
                <Clock size={24} className="text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No completed sessions to log yet.</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">#</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Cumulative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sv.sessions.filter(s => s.status === 'Completed').map((session, i, arr) => {
                      const cumulative = arr.slice(0, i + 1).reduce((sum, s) => sum + s.duration, 0);
                      return (
                        <tr key={session.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 text-[13px] text-gray-500 font-medium">{session.sessionNumber}</td>
                          <td className="px-4 py-3 text-[13px] text-gray-900 font-medium">{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="px-4 py-3 text-[13px] text-gray-600">{session.time}</td>
                          <td className="px-4 py-3 text-[13px] text-gray-900 font-medium">{session.duration} hr{session.duration !== 1 ? 's' : ''}</td>
                          <td className="px-4 py-3 text-[13px] text-brand-primary font-bold text-right">{cumulative} hrs</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Certificate ── */}
        {detailTab === 'certificate' && (
          <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            {sv.certificateIssued ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Award size={28} className="text-green-600" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">Certificate Issued</h3>
                <p className="text-[14px] text-gray-500 mb-6 text-center max-w-sm">
                  Supervision certificate has been issued for {sv.superviseeName}. {totalHours} hours logged.
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-semibold text-[13px] rounded-lg hover:bg-brand-primary/90 transition-all">
                  <Download size={14} /> Download Certificate
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Award size={28} className="text-gray-400" />
                </div>
                <h3 className="text-[18px] font-bold text-gray-900 mb-1">No Certificate Yet</h3>
                <p className="text-[14px] text-gray-500 mb-6 text-center max-w-sm">
                  {isProfessional
                    ? `Issue a certificate once ${sv.superviseeName} has completed the required supervision hours.`
                    : 'Your supervisor will issue a certificate once you complete the required hours.'
                  }
                </p>
                {isProfessional && sv.status === 'Active' && (
                  <button
                    onClick={handleIssueCertificate}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white font-semibold text-[13px] rounded-lg hover:bg-brand-primary/90 transition-all"
                  >
                    <Award size={14} /> Issue Certificate
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Schedule Session Modal */}
        {showScheduleModal && (
          <Portal>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowScheduleModal(false)}>
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
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-gray-500">Time *</label>
                        <input type="time" required value={scheduleForm.time} onChange={e => setScheduleForm(p => ({ ...p, time: e.target.value }))} className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-gray-500">Duration (hrs) *</label>
                        <select required value={scheduleForm.duration} onChange={e => setScheduleForm(p => ({ ...p, duration: e.target.value }))} className="px-3.5 py-2.5 rounded-lg border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all bg-white">
                          <option value="0.5">0.5 hrs</option>
                          <option value="1">1 hr</option>
                          <option value="1.5">1.5 hrs</option>
                          <option value="2">2 hrs</option>
                          <option value="3">3 hrs</option>
                        </select>
                      </div>
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
            </div>
          </Portal>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
     RENDER: Explore Supervisors
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

          {hasActiveFilters && (
            <button onClick={clearFilters} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-semibold text-brand-primary hover:bg-brand-primary/[0.06] transition-colors">
              <X size={14} strokeWidth={2.5} /> Clear All
            </button>
          )}
        </div>

        <div ref={listingsRef} className="-mt-4" />

        {/* Company: Request Supervision Banner */}
        {userRole === 'Company' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center shrink-0">
                <Users size={18} className="text-cyan-700" />
              </div>
              <div>
                <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>Need supervision for your team?</p>
                <p className="text-gray-500" style={{ fontSize: 12 }}>Submit a request and qualified supervisors will apply to work with your organization.</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('RequestForm', { requestType: 'supervision' })}
              className="px-5 py-2.5 bg-cyan-700 text-white rounded-xl hover:bg-cyan-800 transition-colors shrink-0 flex items-center gap-2"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <Plus size={14} /> Request Supervision
            </button>
          </div>
        )}

        {/* DISCOVERY MODE */}
        {isDiscoveryMode && (
          <div className="flex flex-col gap-12">
            {featuredSupervisors.length > 0 && (
              <div className="flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Star size={18} className="text-amber-500" /> Featured Supervisors
                  </h2>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{featuredSupervisors.length} Featured</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {featuredSupervisors.map(s => (
                    <div key={s.id} className="h-full">
                      <SupervisorCard supervisor={s} onClick={() => onSupervisorSelect(s.id)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">All Supervisors</h2>
                <button onClick={() => setShowAllSupervisors(true)} className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {MOCK_SUPERVISORS.slice(0, 6).map(s => (
                  <div key={s.id} className="h-full">
                    <SupervisorCard supervisor={s} onClick={() => onSupervisorSelect(s.id)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FILTERED / SEARCH / VIEW-ALL */}
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
                  {showAllSupervisors && !hasSearch && !hasActiveFilters ? 'All Supervisors' : 'Search Results'}
                </h2>
                <p className="text-sm font-medium text-gray-500">
                  Showing <span className="text-gray-900 font-bold">{filteredSupervisors.length}</span> result{filteredSupervisors.length !== 1 ? 's' : ''}
                </p>
              </div>

              {filteredSupervisors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSupervisors.map(s => (
                    <div key={s.id} className="h-full">
                      <SupervisorCard supervisor={s} onClick={() => onSupervisorSelect(s.id)} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyStateNudge
                  module="supervision"
                  onNavigate={onNavigate}
                  onClearFilters={clearFilters}
                />
              )}

              {/* Low results cross-link nudge */}
              {filteredSupervisors.length > 0 && filteredSupervisors.length < 3 && (
                <LowResultsNudge
                  module="supervision"
                  resultCount={filteredSupervisors.length}
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
     RENDER: My Supervision
     ══════════════════════════════════════════════════════ */
  return (
    <div className="animate-in slide-in-from-right-4 duration-300 flex flex-col gap-6">
      {/* Sub-tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {([
          { key: 'active' as MySupervisionTab, label: `Active (${activeSupervisions.length})` },
          { key: 'requests' as MySupervisionTab, label: `Requests (${requests.length})` },
          { key: 'completed' as MySupervisionTab, label: `Completed (${completedSupervisions.length})` },
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
          {activeSupervisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
              <Users size={24} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No active supervisions yet.</p>
            </div>
          ) : (
            activeSupervisions.map(sv => {
              const done = sv.sessions.filter(s => s.status === 'Completed').length;
              const hours = getTotalHours(sv.sessions);
              return (
                <div
                  key={sv.id}
                  onClick={() => { setSelectedSupervisionId(sv.id); setDetailTab('overview'); setLegalAgreed(sv.legalAgreed); }}
                  className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                      <ImageWithFallback
                        src={isProfessional ? sv.superviseeAvatar : sv.supervisorAvatar}
                        alt={isProfessional ? sv.superviseeName : sv.supervisorName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-[14px] font-bold text-gray-900 group-hover:text-brand-primary transition-colors truncate">{isProfessional ? sv.superviseeName : sv.supervisorName}</h3>
                        <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 shrink-0">
                          <CheckCircle2 size={9} /> Active
                        </span>
                      </div>
                      <p className="text-[12px] text-gray-500 truncate">{sv.goal}</p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                        <span>{sv.purpose}</span>
                        <span className="text-gray-300">&middot;</span>
                        <span>{done}/{sv.sessions.length} sessions</span>
                        <span className="text-gray-300">&middot;</span>
                        <span>{hours} hrs</span>
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
                    <ImageWithFallback src={req.superviseeAvatar} alt={req.superviseeName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-gray-900">{req.superviseeName}</h3>
                      <Chip label={req.superviseeCareerStage} variant="blue" />
                    </div>
                    <p className="text-[13px] text-gray-600 mb-1">{req.goal}</p>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                      <span>{req.purpose}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{req.frequency}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{req.sessionType}</span>
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
          {completedSupervisions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
              <CheckCircle2 size={24} className="text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No completed supervisions.</p>
            </div>
          ) : (
            completedSupervisions.map(sv => (
              <div key={sv.id} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm opacity-75">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback
                      src={isProfessional ? sv.superviseeAvatar : sv.supervisorAvatar}
                      alt={isProfessional ? sv.superviseeName : sv.supervisorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-[14px] font-bold text-gray-900">{isProfessional ? sv.superviseeName : sv.supervisorName}</h3>
                      <span className="inline-flex items-center px-1.5 py-px rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 border border-gray-200">Completed</span>
                      {sv.certificateIssued && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-px rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                          <Award size={9} /> Certified
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-gray-500 truncate">{sv.goal}</p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span>{sv.startDate} &mdash; {sv.endDate}</span>
                      <span className="text-gray-300">&middot;</span>
                      <span>{sv.purpose}</span>
                    </div>
                  </div>
                  {sv.certificateIssued && (
                    <button className="p-1.5 text-brand-primary bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-colors shrink-0">
                      <Download size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}