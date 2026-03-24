import React, { useState } from 'react';
import { Download, ChevronDown, Mail, Eye, MoreHorizontal, Search, Filter, CheckSquare, Users } from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

export type ApplicationStatusType = 'new' | 'pending' | 'shortlisted' | 'accepted' | 'rejected' | 'hired' | 'waitlisted' | 'enrolled' | 'interview';

export interface Applicant {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  appliedDate: string;
  status: ApplicationStatusType;
  matchScore?: number;
  headline?: string;
  resumeAvailable?: boolean;
}

interface ApplicationListViewProps {
  applicants: Applicant[];
  onStatusChange: (applicantId: string, newStatus: ApplicationStatusType) => void;
  onViewProfile?: (applicantId: string) => void;
  onDownloadCV?: (applicantId: string) => void;
  onEmailApplicant?: (applicantId: string) => void;
  accentColor?: string;
  statusOptions?: { value: ApplicationStatusType; label: string }[];
  entityType?: string;
}

const DEFAULT_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'pending', label: 'Pending' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'hired', label: 'Hired' },
];

const STATUS_STYLES: Record<ApplicationStatusType, { bg: string; text: string; dot: string }> = {
  new: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  shortlisted: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  interview: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
  accepted: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  rejected: { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
  hired: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  waitlisted: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  enrolled: { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
};

export function ApplicationListView({
  applicants,
  onStatusChange,
  onViewProfile,
  onDownloadCV,
  onEmailApplicant,
  statusOptions = DEFAULT_STATUS_OPTIONS,
  entityType = 'Job',
}: ApplicationListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApplicationStatusType | 'all'>('all');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = applicants.filter(a => {
    const matchesSearch = !searchQuery ||
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map(a => a.id)));
    }
  };

  const statusCounts = applicants.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search applicants..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
              filterStatus === 'all' ? 'bg-brand-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{ fontSize: 12, fontWeight: 600 }}
          >
            All ({applicants.length})
          </button>
          {statusOptions.map(opt => {
            const count = statusCounts[opt.value] || 0;
            if (count === 0) return null;
            const style = STATUS_STYLES[opt.value];
            return (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                className={`shrink-0 px-3 py-1.5 rounded-lg transition-all ${
                  filterStatus === opt.value ? `${style.bg} ${style.text}` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in">
          <p className="text-brand-primary" style={{ fontSize: 12, fontWeight: 700 }}>
            {selectedIds.size} selected
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 11, fontWeight: 600 }}>
              <Mail size={12} className="inline mr-1.5" />Email All
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 11, fontWeight: 600 }}>
              <Download size={12} className="inline mr-1.5" />Download CVs
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[40px_1fr_140px_120px_100px] items-center gap-3 px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <button onClick={toggleSelectAll} className="flex items-center justify-center">
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              selectedIds.size === filtered.length && filtered.length > 0 ? 'border-brand-primary bg-brand-primary' : 'border-gray-300'
            }`}>
              {selectedIds.size === filtered.length && filtered.length > 0 && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
          </button>
          <p className="text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>APPLICANT</p>
          <p className="text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>APPLIED</p>
          <p className="text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>STATUS</p>
          <p className="text-gray-500 text-right" style={{ fontSize: 11, fontWeight: 600 }}>ACTIONS</p>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
              <Users size={20} className="text-gray-300" />
            </div>
            <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 600 }}>No applicants found</p>
            <p className="text-gray-400 text-center max-w-[240px]" style={{ fontSize: 12 }}>
              {searchQuery || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'Applications will appear here once candidates apply.'}
            </p>
          </div>
        ) : (
          filtered.map(applicant => {
            const statusStyle = STATUS_STYLES[applicant.status];
            const statusLabel = statusOptions.find(o => o.value === applicant.status)?.label || applicant.status;
            const isSelected = selectedIds.has(applicant.id);

            return (
              <div
                key={applicant.id}
                className={`flex flex-col sm:grid sm:grid-cols-[40px_1fr_140px_120px_100px] items-start sm:items-center gap-2 sm:gap-3 px-4 py-4 border-b border-gray-50 hover:bg-gray-50/40 transition-colors ${
                  isSelected ? 'bg-blue-50/30' : ''
                }`}
              >
                {/* Checkbox */}
                <button onClick={() => toggleSelect(applicant.id)} className="hidden sm:flex items-center justify-center">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-brand-primary bg-brand-primary' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>
                </button>

                {/* Applicant Info */}
                <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    <ImageWithFallback src={applicant.avatarUrl} alt={applicant.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <button
                      onClick={() => onViewProfile?.(applicant.id)}
                      className="text-gray-900 hover:text-brand-primary transition-colors truncate block max-w-full text-left"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      {applicant.name}
                    </button>
                    <p className="text-gray-500 truncate" style={{ fontSize: 11 }}>
                      {applicant.headline || applicant.email}
                    </p>
                    {applicant.matchScore !== undefined && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: `${applicant.matchScore}%` }} />
                        </div>
                        <span className="text-teal-600" style={{ fontSize: 10, fontWeight: 600 }}>{applicant.matchScore}% match</span>
                      </div>
                    )}
                  </div>

                  {/* Mobile status badge */}
                  <div className="sm:hidden">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg ${statusStyle.bg} ${statusStyle.text}`} style={{ fontSize: 11, fontWeight: 600 }}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                      {statusLabel}
                    </span>
                  </div>
                </div>

                {/* Applied Date */}
                <p className="text-gray-500 hidden sm:block" style={{ fontSize: 12 }}>{applicant.appliedDate}</p>

                {/* Status Dropdown */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setOpenDropdownId(openDropdownId === applicant.id ? null : applicant.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${statusStyle.bg} ${statusStyle.text} hover:opacity-80 transition-opacity`}
                    style={{ fontSize: 11, fontWeight: 600 }}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {statusLabel}
                    <ChevronDown size={12} />
                  </button>

                  {openDropdownId === applicant.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setOpenDropdownId(null)} />
                      <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-fade-in">
                        {statusOptions.map(opt => {
                          const optStyle = STATUS_STYLES[opt.value];
                          return (
                            <button
                              key={opt.value}
                              onClick={() => {
                                onStatusChange(applicant.id, opt.value);
                                setOpenDropdownId(null);
                              }}
                              className={`w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                                applicant.status === opt.value ? optStyle.bg : ''
                              }`}
                              style={{ fontSize: 12, fontWeight: applicant.status === opt.value ? 700 : 500 }}
                            >
                              <span className={`w-2 h-2 rounded-full ${optStyle.dot}`} />
                              <span className={applicant.status === opt.value ? optStyle.text : 'text-gray-700'}>
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 justify-end w-full sm:w-auto">
                  {applicant.resumeAvailable !== false && (
                    <button
                      onClick={() => onDownloadCV?.(applicant.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Download CV"
                    >
                      <Download size={15} />
                    </button>
                  )}
                  <button
                    onClick={() => onEmailApplicant?.(applicant.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="Send Email"
                  >
                    <Mail size={15} />
                  </button>
                  <button
                    onClick={() => onViewProfile?.(applicant.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    title="View Profile"
                  >
                    <Eye size={15} />
                  </button>
                </div>

                {/* Mobile date */}
                <p className="text-gray-400 sm:hidden" style={{ fontSize: 11 }}>Applied {applicant.appliedDate}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Summary footer */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-gray-400" style={{ fontSize: 11 }}>
            Showing {filtered.length} of {applicants.length} applicants
          </p>
        </div>
      )}
    </div>
  );
}