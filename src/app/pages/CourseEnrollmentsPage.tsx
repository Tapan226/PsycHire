import React, { useState } from 'react';
import {
  ChevronLeft, BookOpen, Users, Clock, MapPin, Search,
  CheckCircle2, XCircle, AlertCircle, UserPlus, Download,
  Mail, MoreHorizontal, Filter, Star, Award,
} from 'lucide-react';
import { ApplicationListView, type Applicant, type ApplicationStatusType } from '@/app/components/shared/ApplicationListView';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

/* ═══ Mock Data ═══ */

const MOCK_COURSE = {
  id: 'c1',
  title: 'CBT Fundamentals Workshop',
  type: 'Workshop',
  mode: 'Hybrid',
  duration: '4 weeks',
  maxParticipants: 30,
  enrolled: 22,
  pendingReview: 8,
  startDate: 'Apr 15, 2026',
};

const MOCK_ENROLLMENTS: Applicant[] = [
  {
    id: 'en1', name: 'Priya Nair', email: 'priya.nair@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop',
    appliedDate: 'Mar 10, 2026', status: 'pending',
    headline: 'M.A. Psychology (Clinical) · 3 years clinical experience',
  },
  {
    id: 'en2', name: 'Rahul Verma', email: 'rahul.verma@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    appliedDate: 'Mar 9, 2026', status: 'pending',
    headline: 'M.Sc. Psychology · 1 year internship',
  },
  {
    id: 'en3', name: 'Dr. Meera Sharma', email: 'meera.sharma@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop',
    appliedDate: 'Mar 8, 2026', status: 'accepted',
    headline: 'Ph.D. Clinical Psychology · 15 years experience',
  },
  {
    id: 'en4', name: 'Ananya Reddy', email: 'ananya.reddy@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    appliedDate: 'Mar 7, 2026', status: 'accepted',
    headline: 'M.A. Counselling Psychology · 2 years counselling',
  },
  {
    id: 'en5', name: 'Vikram Singh', email: 'vikram.singh@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    appliedDate: 'Mar 6, 2026', status: 'waitlisted',
    headline: 'B.A. Psychology (final year) · Student',
  },
  {
    id: 'en6', name: 'Sneha Patel', email: 'sneha.patel@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    appliedDate: 'Mar 5, 2026', status: 'rejected',
    headline: 'Diploma in Counselling · Career counsellor',
  },
  {
    id: 'en7', name: 'Arjun Mehta', email: 'arjun.mehta@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=100&h=100&fit=crop',
    appliedDate: 'Mar 4, 2026', status: 'enrolled',
    headline: 'M.Phil. Clinical Psychology · 8 years experience',
  },
  {
    id: 'en8', name: 'Kavya Iyer', email: 'kavya.iyer@email.com',
    avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    appliedDate: 'Mar 3, 2026', status: 'enrolled',
    headline: 'Ph.D. Psychology · Trauma Specialist · 10 years',
  },
];

const COURSE_STATUS_OPTIONS: { value: ApplicationStatusType; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'waitlisted', label: 'Waitlisted' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'rejected', label: 'Rejected' },
];

/* ═══ Component ═══ */

interface CourseEnrollmentsPageProps {
  courseId: string;
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function CourseEnrollmentsPage({ courseId, onBack, onNavigate }: CourseEnrollmentsPageProps) {
  const [enrollments, setEnrollments] = useState(MOCK_ENROLLMENTS);

  const handleStatusChange = (id: string, newStatus: ApplicationStatusType) => {
    setEnrollments(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
  };

  const stats = [
    { label: 'Total', value: enrollments.length, color: 'text-gray-700' },
    { label: 'Pending', value: enrollments.filter(e => e.status === 'pending').length, color: 'text-amber-600' },
    { label: 'Accepted', value: enrollments.filter(e => e.status === 'accepted').length, color: 'text-emerald-600' },
    { label: 'Enrolled', value: enrollments.filter(e => e.status === 'enrolled').length, color: 'text-purple-600' },
    { label: 'Waitlisted', value: enrollments.filter(e => e.status === 'waitlisted').length, color: 'text-blue-600' },
  ];

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 pt-6 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-6xl mx-auto px-6 lg:px-10 relative z-10">
          <button onClick={onBack} className="flex items-center gap-1.5 text-purple-200/70 hover:text-white transition-colors mb-4 group" style={{ fontSize: 13 }}>
            <ChevronLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={16} className="text-purple-300" />
                <p className="text-purple-200" style={{ fontSize: 12, fontWeight: 600 }}>{MOCK_COURSE.type} · {MOCK_COURSE.mode}</p>
              </div>
              <p className="text-white" style={{ fontSize: 22, fontWeight: 800 }}>{MOCK_COURSE.title}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-purple-200" style={{ fontSize: 12 }}>
                <span className="flex items-center gap-1"><Clock size={12} /> {MOCK_COURSE.duration}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {MOCK_COURSE.enrolled}/{MOCK_COURSE.maxParticipants} enrolled</span>
                <span className="flex items-center gap-1"><AlertCircle size={12} /> {MOCK_COURSE.pendingReview} pending</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3 mt-5">
            {stats.map(stat => (
              <div key={stat.label} className="px-4 py-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
                <p className="text-purple-200" style={{ fontSize: 10, fontWeight: 600 }}>{stat.label}</p>
                <p className="text-white" style={{ fontSize: 18, fontWeight: 800 }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ APPLICATION LIST ═══ */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 w-full py-8">
        <ApplicationListView
          applicants={enrollments}
          onStatusChange={handleStatusChange}
          entityType="Course"
          statusOptions={COURSE_STATUS_OPTIONS}
          accentColor="purple"
        />
      </div>
    </div>
  );
}