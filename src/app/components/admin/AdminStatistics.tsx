import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  TrendingUp, BarChart3, PieChart as PieIcon, Users, Briefcase,
  FolderKanban, BookOpen, Calendar as CalIcon, GraduationCap,
} from 'lucide-react';

/* ═══ Mock Data ═══ */

const LISTINGS_PER_MONTH = [
  { month: 'Oct', jobs: 42, projects: 18, courses: 12, events: 8, supervision: 6, mentoring: 4 },
  { month: 'Nov', jobs: 56, projects: 22, courses: 15, events: 14, supervision: 9, mentoring: 7 },
  { month: 'Dec', jobs: 38, projects: 16, courses: 10, events: 6, supervision: 5, mentoring: 3 },
  { month: 'Jan', jobs: 64, projects: 28, courses: 18, events: 16, supervision: 12, mentoring: 8 },
  { month: 'Feb', jobs: 72, projects: 32, courses: 22, events: 20, supervision: 14, mentoring: 11 },
  { month: 'Mar', jobs: 85, projects: 38, courses: 26, events: 24, supervision: 18, mentoring: 14 },
];

const APPLICATIONS_PER_LISTING = [
  { month: 'Oct', avg: 8.2 },
  { month: 'Nov', avg: 9.5 },
  { month: 'Dec', avg: 7.1 },
  { month: 'Jan', avg: 11.3 },
  { month: 'Feb', avg: 12.8 },
  { month: 'Mar', avg: 14.2 },
];

const APPROVAL_TURNAROUND = [
  { month: 'Oct', hours: 8.5 },
  { month: 'Nov', hours: 6.2 },
  { month: 'Dec', hours: 5.8 },
  { month: 'Jan', hours: 4.8 },
  { month: 'Feb', hours: 4.5 },
  { month: 'Mar', hours: 4.2 },
];

const TOP_CATEGORIES = [
  { name: 'Clinical Psychology', value: 142 },
  { name: 'Counseling', value: 98 },
  { name: 'I/O Psychology', value: 76 },
  { name: 'Neuropsychology', value: 54 },
  { name: 'Child & Adolescent', value: 48 },
  { name: 'Research', value: 42 },
];

const USER_GROWTH = [
  { month: 'Oct', students: 820, professionals: 340, companies: 45 },
  { month: 'Nov', students: 960, professionals: 410, companies: 52 },
  { month: 'Dec', students: 1040, professionals: 450, companies: 58 },
  { month: 'Jan', students: 1280, professionals: 540, companies: 68 },
  { month: 'Feb', students: 1520, professionals: 620, companies: 78 },
  { month: 'Mar', students: 1780, professionals: 720, companies: 92 },
];

const PIE_COLORS = ['#1e40af', '#14b8a6', '#7c3aed', '#f43f5e', '#f59e0b', '#6366f1'];

const MODULE_BREAKDOWN = [
  { name: 'Jobs', value: 285, icon: Briefcase, color: '#1e40af' },
  { name: 'Projects', value: 154, icon: FolderKanban, color: '#14b8a6' },
  { name: 'Courses', value: 103, icon: BookOpen, color: '#7c3aed' },
  { name: 'Events', value: 88, icon: CalIcon, color: '#f43f5e' },
  { name: 'Supervision', value: 64, icon: Users, color: '#0891b2' },
  { name: 'Mentoring', value: 47, icon: GraduationCap, color: '#6366f1' },
];

type TimeRange = '7d' | '30d' | '90d' | '6m';

/* ═══ Component ═══ */

export function AdminStatistics() {
  const [timeRange, setTimeRange] = useState<TimeRange>('6m');

  const totalListings = MODULE_BREAKDOWN.reduce((sum, m) => sum + m.value, 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">

      {/* ── Time Range Selector ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 size={18} className="text-brand-primary" />
          <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Platform Analytics</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(['7d', '30d', '90d', '6m'] as TimeRange[]).map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeRange === r ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? '90 Days' : '6 Months'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Row 1: Listings + Applications ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Listings Per Month */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>Listings Created Per Month</p>
          <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Across all modules</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={LISTINGS_PER_MONTH} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="jobs" fill="#1e40af" radius={[3, 3, 0, 0]} name="Jobs" />
                <Bar dataKey="projects" fill="#14b8a6" radius={[3, 3, 0, 0]} name="Projects" />
                <Bar dataKey="courses" fill="#7c3aed" radius={[3, 3, 0, 0]} name="Courses" />
                <Bar dataKey="events" fill="#f43f5e" radius={[3, 3, 0, 0]} name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Applications Per Listing */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>Avg. Applications Per Listing</p>
          <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Average across all modules</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={APPLICATIONS_PER_LISTING}>
                <defs>
                  <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
                />
                <Area type="monotone" dataKey="avg" stroke="#14b8a6" strokeWidth={2.5} fill="url(#avgGrad)" name="Avg Applications" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Row 2: Approval Turnaround + Top Categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Turnaround */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>Review Turnaround Time</p>
          <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Average hours from submission to decision</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={APPROVAL_TURNAROUND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} unit="h" />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
                  formatter={(value: number) => [`${value}h`, 'Turnaround']}
                />
                <Line type="monotone" dataKey="hours" stroke="#1e40af" strokeWidth={2.5} dot={{ r: 4, fill: '#1e40af' }} name="Hours" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories (Pie) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>Top Specializations</p>
          <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>By total listings across all modules</p>
          <div className="flex items-center gap-6">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_CATEGORIES}
                    cx="50%" cy="50%"
                    innerRadius={50} outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {TOP_CATEGORIES.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              {TOP_CATEGORIES.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-gray-600 truncate" style={{ fontSize: 12 }}>{cat.name}</span>
                  <span className="ml-auto text-gray-900 shrink-0" style={{ fontSize: 12, fontWeight: 700 }}>{cat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 3: User Growth + Module Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>User Growth</p>
          <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Total registered users by role</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_GROWTH}>
                <defs>
                  <linearGradient id="studGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="students" stroke="#1e40af" strokeWidth={2} fill="url(#studGrad)" name="Students" />
                <Area type="monotone" dataKey="professionals" stroke="#14b8a6" strokeWidth={2} fill="url(#profGrad)" name="Professionals" />
                <Area type="monotone" dataKey="companies" stroke="#f59e0b" strokeWidth={2} fill="url(#compGrad)" name="Companies" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Module Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-gray-900 mb-1" style={{ fontSize: 14, fontWeight: 700 }}>Active Listings by Module</p>
          <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>Total: {totalListings}</p>
          <div className="flex flex-col gap-3">
            {MODULE_BREAKDOWN.map(mod => {
              const pct = Math.round((mod.value / totalListings) * 100);
              return (
                <div key={mod.name} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <mod.icon size={14} style={{ color: mod.color }} />
                    <span className="text-gray-700" style={{ fontSize: 12, fontWeight: 600 }}>{mod.name}</span>
                    <span className="ml-auto text-gray-900" style={{ fontSize: 12, fontWeight: 700 }}>{mod.value}</span>
                    <span className="text-gray-400" style={{ fontSize: 10 }}>({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: mod.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
