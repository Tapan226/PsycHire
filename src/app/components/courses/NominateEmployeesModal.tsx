import React, { useState } from 'react';
import { Portal } from '@/app/components/shared/Portal';
import {
  X, CheckCircle2, Users, UserPlus, Search, Plus, Trash2, Send,
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

const MOCK_ROSTER: Employee[] = [
  { id: 'emp1', name: 'Dr. Meera Sharma', email: 'meera@mindcare.com', department: 'Clinical' },
  { id: 'emp2', name: 'Priya Nair', email: 'priya@mindcare.com', department: 'Counselling' },
  { id: 'emp3', name: 'Rahul Verma', email: 'rahul@mindcare.com', department: 'Research' },
  { id: 'emp4', name: 'Ananya Reddy', email: 'ananya@mindcare.com', department: 'Clinical' },
  { id: 'emp5', name: 'Vikram Singh', email: 'vikram@mindcare.com', department: 'Community' },
  { id: 'emp6', name: 'Sneha Patel', email: 'sneha@mindcare.com', department: 'HR' },
  { id: 'emp7', name: 'Arjun Mehta', email: 'arjun@mindcare.com', department: 'Clinical' },
  { id: 'emp8', name: 'Kavya Iyer', email: 'kavya@mindcare.com', department: 'Training' },
];

interface NominateEmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
}

export function NominateEmployeesModal({ isOpen, onClose, courseTitle }: NominateEmployeesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const filteredRoster = MOCK_ROSTER.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleEmployee = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => setSubmitted(true);

  const handleClose = () => {
    setSubmitted(false);
    setSelected(new Set());
    setSearchQuery('');
    onClose();
  };

  return (
    <Portal>
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>Nominate Employees</p>
              <p className="text-gray-500 truncate max-w-[280px]" style={{ fontSize: 12 }}>{courseTitle}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {submitted ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 size={28} className="text-emerald-600" />
              </div>
              <p className="text-gray-900" style={{ fontSize: 18, fontWeight: 800 }}>{selected.size} Employees Nominated!</p>
              <p className="text-gray-500 mt-2 max-w-sm" style={{ fontSize: 13 }}>
                Enrollment requests have been sent. The course provider will review and confirm nominations.
              </p>
              <button onClick={handleClose} className="mt-6 px-6 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-all" style={{ fontSize: 13, fontWeight: 700 }}>Done</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300"
                  style={{ fontSize: 13 }}
                />
              </div>

              {/* Selected count */}
              {selected.size > 0 && (
                <div className="flex items-center justify-between px-3 py-2 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-purple-700" style={{ fontSize: 12, fontWeight: 600 }}>{selected.size} employee{selected.size > 1 ? 's' : ''} selected</p>
                  <button onClick={() => setSelected(new Set())} className="text-purple-500 hover:text-purple-700" style={{ fontSize: 11, fontWeight: 600 }}>Clear all</button>
                </div>
              )}

              {/* Employee list */}
              <div className="flex flex-col gap-1.5">
                {filteredRoster.map(emp => {
                  const isSelected = selected.has(emp.id);
                  const initials = emp.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                  return (
                    <button
                      key={emp.id}
                      onClick={() => toggleEmployee(emp.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isSelected ? 'bg-purple-50 border-purple-200' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                    >
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`} style={{ fontSize: 12, fontWeight: 700 }}>
                        {isSelected ? <CheckCircle2 size={16} /> : initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900 truncate" style={{ fontSize: 13, fontWeight: 600 }}>{emp.name}</p>
                        <p className="text-gray-500 truncate" style={{ fontSize: 11 }}>{emp.email} · {emp.department}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-6 py-4 border-t border-gray-100 shrink-0">
            <button
              onClick={handleSubmit}
              disabled={selected.size === 0}
              className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${selected.size > 0 ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <Send size={14} /> Nominate {selected.size > 0 ? `${selected.size} Employee${selected.size > 1 ? 's' : ''}` : 'Employees'}
            </button>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}