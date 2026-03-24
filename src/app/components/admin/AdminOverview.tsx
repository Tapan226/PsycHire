import React from 'react';
import {
  Shield, Briefcase, FolderKanban, BookOpen, Calendar, Users, GraduationCap,
  Clock, CheckCircle2, XCircle, Flag, TrendingUp, AlertTriangle, ArrowUpRight,
  UserPlus, FileText, Eye, Zap, BarChart3,
} from 'lucide-react';

/* ═══ Types ═══ */

interface StatCard {
  label: string;
  value: number;
  change: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

interface ActivityItem {
  id: string;
  type: 'approved' | 'rejected' | 'flagged' | 'submitted' | 'user_joined';
  title: string;
  module: string;
  actor: string;
  time: string;
}

interface AdminOverviewProps {
  onNavigateToTab: (tab: string) => void;
}

/* ═══ Mock Data ═══ */

const STATS: StatCard[] = [
  { label: 'Pending Review', value: 14, change: 3, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-50' },
  { label: 'Approved This Week', value: 28, change: 12, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { label: 'Rejected This Week', value: 4, change: -2, icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-50' },
  { label: 'Open Reports', value: 3, change: 1, icon: Flag, color: 'text-orange-500', bgColor: 'bg-orange-50' },
  { label: 'New Users (7d)', value: 156, change: 24, icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { label: 'Active Listings', value: 342, change: 18, icon: FileText, color: 'text-teal-600', bgColor: 'bg-teal-50' },
];

const MODULE_PENDING: { module: string; icon: React.ElementType; count: number; color: string }[] = [
  { module: 'Jobs', icon: Briefcase, count: 3, color: 'text-blue-600' },
  { module: 'Projects', icon: FolderKanban, count: 2, color: 'text-teal-600' },
  { module: 'Courses', icon: BookOpen, count: 2, color: 'text-purple-600' },
  { module: 'Events', icon: Calendar, count: 3, color: 'text-rose-600' },
  { module: 'Supervision', icon: Users, count: 2, color: 'text-cyan-600' },
  { module: 'Mentoring', icon: GraduationCap, count: 2, color: 'text-indigo-600' },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'a1', type: 'submitted', title: 'Neuropsychology Intern', module: 'Jobs', actor: 'MindCare Clinic', time: '2 hours ago' },
  { id: 'a2', type: 'approved', title: 'CBT Workshop — Advanced', module: 'Events', actor: 'Admin', time: '3 hours ago' },
  { id: 'a3', type: 'flagged', title: 'Unlicensed Therapy Position', module: 'Jobs', actor: 'Dr. Priya Nair', time: '5 hours ago' },
  { id: 'a4', type: 'user_joined', title: 'Sneha Patel', module: 'Users', actor: 'System', time: '6 hours ago' },
  { id: 'a5', type: 'submitted', title: 'Community Resilience Mapping', module: 'Projects', actor: 'UNICEF India', time: '1 day ago' },
  { id: 'a6', type: 'rejected', title: 'Dubious Online Certification', module: 'Courses', actor: 'Admin', time: '1 day ago' },
  { id: 'a7', type: 'approved', title: 'Trauma-Informed Care Certification', module: 'Courses', actor: 'Admin', time: '1 day ago' },
  { id: 'a8', type: 'submitted', title: 'Clinical Supervision — CBT Track', module: 'Supervision', actor: 'Dr. Anita Sharma', time: '2 days ago' },
];

const ACTIVITY_ICON: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  submitted: { icon: ArrowUpRight, color: 'text-blue-600', bg: 'bg-blue-50' },
  approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50' },
  flagged: { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50' },
  user_joined: { icon: UserPlus, color: 'text-indigo-500', bg: 'bg-indigo-50' },
};

/* ═══ Component ═══ */

export function AdminOverview({ onNavigateToTab }: AdminOverviewProps) {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STATS.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-4 flex flex-col gap-2 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
            <p className="text-gray-900" style={{ fontSize: 24, fontWeight: 800 }}>{stat.value}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-gray-500 truncate" style={{ fontSize: 11, fontWeight: 500 }}>{stat.label}</p>
              <span className={`shrink-0 ${stat.change >= 0 ? 'text-emerald-600' : 'text-red-500'}`} style={{ fontSize: 10, fontWeight: 700 }}>
                {stat.change >= 0 ? '+' : ''}{stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Pending By Module ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Pending by Module</p>
            <button
              onClick={() => onNavigateToTab('jobs')}
              className="text-brand-primary hover:underline"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              View All
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {MODULE_PENDING.map(m => (
              <button
                key={m.module}
                onClick={() => onNavigateToTab(m.module.toLowerCase())}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-white flex items-center justify-center transition-colors">
                  <m.icon size={16} className={m.color} />
                </div>
                <span className="flex-1 text-left text-gray-700" style={{ fontSize: 13, fontWeight: 500 }}>{m.module}</span>
                <span className={`px-2 py-0.5 rounded-md ${m.count > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-400'}`} style={{ fontSize: 12, fontWeight: 700 }}>
                  {m.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-4" style={{ fontSize: 15, fontWeight: 700 }}>Quick Actions</p>
          <div className="flex flex-col gap-2">
            {[
              { label: 'Review Pending Listings', icon: Eye, action: () => onNavigateToTab('jobs'), color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Handle Open Reports', icon: Flag, action: () => onNavigateToTab('reports'), color: 'text-red-500', bg: 'bg-red-50' },
              { label: 'View Platform Statistics', icon: BarChart3, action: () => onNavigateToTab('statistics'), color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Manage Taxonomy', icon: Zap, action: () => onNavigateToTab('taxonomy'), color: 'text-purple-600', bg: 'bg-purple-50' },
            ].map(action => (
              <button
                key={action.label}
                onClick={action.action}
                className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left group"
              >
                <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}>
                  <action.icon size={16} className={action.color} />
                </div>
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>{action.label}</span>
                <ArrowUpRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-500 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        {/* ── Recent Activity ── */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-4" style={{ fontSize: 15, fontWeight: 700 }}>Recent Activity</p>
          <div className="flex flex-col gap-1">
            {RECENT_ACTIVITY.slice(0, 6).map(item => {
              const style = ACTIVITY_ICON[item.type];
              return (
                <div key={item.id} className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50/50 transition-colors">
                  <div className={`w-7 h-7 rounded-md ${style.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <style.icon size={13} className={style.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 truncate" style={{ fontSize: 12, fontWeight: 600 }}>{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-gray-400" style={{ fontSize: 11 }}>{item.module}</span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400" style={{ fontSize: 11 }}>{item.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Platform Health Banner ── */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <TrendingUp size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-emerald-900" style={{ fontSize: 14, fontWeight: 700 }}>Platform Health: Excellent</p>
            <p className="text-emerald-600 mt-0.5" style={{ fontSize: 12 }}>Average review turnaround: 4.2 hours · Report resolution: 96%</p>
          </div>
        </div>
        <button
          onClick={() => onNavigateToTab('statistics')}
          className="sm:ml-auto px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-sm shrink-0"
          style={{ fontSize: 12, fontWeight: 700 }}
        >
          View Full Statistics
        </button>
      </div>
    </div>
  );
}
