/**
 * NominateEmployeesModal — Company-only bulk nomination modal
 * for Events, Courses, Supervision, and Mentoring modules.
 * Lets company users select employees from a mock roster to nominate.
 */

import React, { useState, useMemo } from 'react';
import {
  X, CheckCircle2, Search, Users, Plus, Minus,
  Building2, Send, AlertCircle,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { toast } from 'sonner';
import { Portal } from '@/app/components/shared/Portal';

/* ═══ Mock Employee Roster ═══ */

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
  department: string;
  avatarUrl: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: 'emp1', name: 'Priya Sharma', email: 'priya.sharma@mindcare.com', designation: 'Clinical Psychologist', department: 'Clinical Services', avatarUrl: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBwc3ljaG9sb2d5fGVufDF8fHx8MTc3MDEwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'emp2', name: 'Arjun Mehta', email: 'arjun.mehta@mindcare.com', designation: 'Senior Therapist', department: 'Therapy', avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBibGF6ZXIlMjBjb25maWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzA3MTA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'emp3', name: 'Sneha Patel', email: 'sneha.patel@mindcare.com', designation: 'Counsellor', department: 'Student Services', avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHBzeWNob2xvZ3l8ZW58MXx8fHwxNzcwMTA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'emp4', name: 'Kavita Desai', email: 'kavita.desai@mindcare.com', designation: 'School Psychologist', department: 'Education Outreach', avatarUrl: 'https://images.unsplash.com/photo-1770627016447-cb9d29ed0398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbiUyMGNvcnBvcmF0ZSUyMGJ1c2luZXNzJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczNjY1MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'emp5', name: 'Rohan Kapoor', email: 'rohan.k@mindcare.com', designation: 'Research Analyst', department: 'R&D', avatarUrl: 'https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhZG1pbmlzdHJhdG9yJTIwZm9ybWFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM2NjUxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
  { id: 'emp6', name: 'Meera Iyer', email: 'meera.i@mindcare.com', designation: 'Clinical Intern', department: 'Clinical Services', avatarUrl: '' },
  { id: 'emp7', name: 'Vikram Das', email: 'vikram.d@mindcare.com', designation: 'Behavioural Therapist', department: 'Therapy', avatarUrl: '' },
  { id: 'emp8', name: 'Ananya Reddy', email: 'ananya.r@mindcare.com', designation: 'HR Coordinator', department: 'HR & Admin', avatarUrl: '' },
];

/* ═══ Component ═══ */

export type NominationContext = 'event' | 'course' | 'supervision' | 'mentoring';

interface NominateEmployeesModalProps {
  open: boolean;
  onClose: () => void;
  context: NominationContext;
  targetTitle: string;
}

const CONTEXT_CONFIG: Record<NominationContext, { label: string; verb: string; color: string; bg: string }> = {
  event:       { label: 'Event Registration', verb: 'Register', color: 'bg-rose-600 hover:bg-rose-700', bg: 'bg-rose-50' },
  course:      { label: 'Course Enrollment',  verb: 'Enroll',   color: 'bg-purple-600 hover:bg-purple-700', bg: 'bg-purple-50' },
  supervision: { label: 'Supervision Program', verb: 'Nominate', color: 'bg-cyan-700 hover:bg-cyan-800', bg: 'bg-cyan-50' },
  mentoring:   { label: 'Mentoring Cohort',    verb: 'Nominate', color: 'bg-indigo-600 hover:bg-indigo-700', bg: 'bg-indigo-50' },
};

export function NominateEmployeesModal({ open, onClose, context, targetTitle }: NominateEmployeesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const config = CONTEXT_CONFIG[context];

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return MOCK_EMPLOYEES;
    const q = searchQuery.toLowerCase();
    return MOCK_EMPLOYEES.filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.designation.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleEmployee = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selectedIds.size === 0) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success(`${selectedIds.size} employee${selectedIds.size > 1 ? 's' : ''} nominated!`, {
        description: `Nominations for "${targetTitle}" have been sent.`,
      });
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSubmitted(false);
      setSubmitting(false);
      setSelectedIds(new Set());
      setSearchQuery('');
      setNotes('');
    }, 300);
  };

  if (!open) return null;

  return (
    <Portal>
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
      onClick={e => e.target === e.currentTarget && handleClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center`}>
              <Users size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 17, fontWeight: 700 }}>{config.verb} Team Members</p>
              <p className="text-gray-500 mt-0.5 truncate max-w-[280px]" style={{ fontSize: 12 }}>{targetTitle}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <p className="text-gray-900 mb-1.5" style={{ fontSize: 18, fontWeight: 800 }}>Nominations Sent!</p>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto" style={{ fontSize: 13 }}>
              {selectedIds.size} team member{selectedIds.size > 1 ? 's have' : ' has'} been nominated. They'll receive email notifications with next steps.
            </p>
            <button onClick={handleClose} className={`px-6 py-2.5 text-white rounded-xl transition-colors ${config.color}`} style={{ fontSize: 13, fontWeight: 700 }}>
              Done
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Search */}
            <div className="px-6 pt-4 pb-2 shrink-0">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 transition-all"
                  style={{ fontSize: 13 }}
                />
              </div>
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>{selectedIds.size} selected</span>
                  <button onClick={() => setSelectedIds(new Set())} className="text-gray-400 hover:text-red-500 transition-colors" style={{ fontSize: 11, fontWeight: 600 }}>
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Employee List */}
            <div className="flex-1 overflow-y-auto px-6 pb-2" style={{ maxHeight: 280 }}>
              {filteredEmployees.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-gray-400" style={{ fontSize: 13 }}>No employees found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-1">
                  {filteredEmployees.map(emp => {
                    const isSelected = selectedIds.has(emp.id);
                    return (
                      <button
                        key={emp.id}
                        onClick={() => toggleEmployee(emp.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full ${
                          isSelected ? 'bg-cyan-50 border border-cyan-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        {/* Checkbox indicator */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          isSelected ? 'border-cyan-600 bg-cyan-600' : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 shrink-0">
                          {emp.avatarUrl ? (
                            <ImageWithFallback src={emp.avatarUrl} alt={emp.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400" style={{ fontSize: 12, fontWeight: 700 }}>
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 truncate" style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</p>
                          <p className="text-gray-400 truncate" style={{ fontSize: 11 }}>{emp.designation} · {emp.department}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notes + Submit */}
            <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-500" style={{ fontSize: 11, fontWeight: 600 }}>Additional Notes <span className="text-gray-400" style={{ fontWeight: 400 }}>(Optional)</span></label>
                <textarea
                  rows={2} value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g., Please prioritize clinical team members"
                  className="px-3.5 py-2 rounded-lg border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 transition-all resize-none"
                  style={{ fontSize: 12 }}
                />
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontSize: 13, fontWeight: 600 }}>
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={selectedIds.size === 0 || submitting}
                  className={`flex-1 py-2.5 rounded-xl text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${config.color}`}
                  style={{ fontSize: 13, fontWeight: 700 }}
                >
                  {submitting ? (
                    <div className="contents">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </div>
                  ) : (
                    <div className="contents">
                      <Send size={14} />
                      {config.verb} {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}