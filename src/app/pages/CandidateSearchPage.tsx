import React, { useState, useMemo } from 'react';
import {
  Search, MapPin, Briefcase, GraduationCap, Star, Download, Bookmark,
  MessageSquare, Filter, ChevronDown, X, ArrowLeft, Users, BookOpen,
  ExternalLink, CheckCircle2, Shield, SlidersHorizontal,
} from 'lucide-react';

/* ═══ Types ═══ */

interface Candidate {
  id: string;
  name: string;
  avatarUrl: string;
  headline: string;
  location: string;
  specialization: string;
  experience: string;
  skills: string[];
  education: string;
  availability: 'Immediate' | 'Within 1 Month' | 'Within 3 Months' | 'Not Looking';
  hasConsent: boolean;
  isSaved: boolean;
  rating: number;
  completedProjects: number;
}

/* ═══ Mock Data ═══ */

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'c1', name: 'Dr. Priya Sharma', avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    headline: 'Clinical Psychologist · CBT & Trauma Specialist', location: 'Mumbai, MH',
    specialization: 'Clinical Psychology', experience: '8 years', skills: ['CBT', 'Trauma-Informed Care', 'EMDR', 'Research'],
    education: 'PhD Clinical Psychology, TISS Mumbai', availability: 'Within 1 Month', hasConsent: true, isSaved: false, rating: 4.9, completedProjects: 12,
  },
  {
    id: 'c2', name: 'Arjun Mehta', avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    headline: 'I/O Psychologist · Organizational Development', location: 'Bangalore, KA',
    specialization: 'I/O Psychology', experience: '5 years', skills: ['Assessment Centers', 'Leadership Dev', 'Employee Engagement', 'SPSS'],
    education: 'M.Phil I/O Psychology, Christ University', availability: 'Immediate', hasConsent: true, isSaved: false, rating: 4.7, completedProjects: 8,
  },
  {
    id: 'c3', name: 'Sneha Patel', avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    headline: 'Counseling Psychology Student · Mental Health Advocate', location: 'Delhi NCR',
    specialization: 'Counseling Psychology', experience: '1 year', skills: ['Active Listening', 'Group Therapy', 'Research Methods', 'Hindi Fluent'],
    education: 'MA Counseling Psychology, Delhi University', availability: 'Immediate', hasConsent: true, isSaved: true, rating: 4.5, completedProjects: 3,
  },
  {
    id: 'c4', name: 'Dr. Rakesh Sinha', avatarUrl: 'https://images.unsplash.com/photo-1584827172806-ea64d6d30fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    headline: 'Neuropsychologist · Brain Imaging Research', location: 'Hyderabad, TS',
    specialization: 'Neuropsychology', experience: '12 years', skills: ['fMRI Analysis', 'Neuropsych Assessment', 'R', 'Scientific Writing'],
    education: 'PhD Neuropsychology, NIMHANS', availability: 'Within 3 Months', hasConsent: true, isSaved: false, rating: 4.8, completedProjects: 18,
  },
  {
    id: 'c5', name: 'Meera Kapoor', avatarUrl: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    headline: 'Child & Adolescent Psychologist · Play Therapy', location: 'Chennai, TN',
    specialization: 'Child & Adolescent', experience: '6 years', skills: ['Play Therapy', 'Family Systems', 'ASD Assessment', 'DBT-A'],
    education: 'M.Phil Child Psychology, NIEPMD Chennai', availability: 'Within 1 Month', hasConsent: true, isSaved: false, rating: 4.6, completedProjects: 9,
  },
  {
    id: 'c6', name: 'Vikram Rao', avatarUrl: 'https://images.unsplash.com/photo-1659353887804-fc7f9313021a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=100',
    headline: 'Health Psychologist · Chronic Pain & Wellness', location: 'Pune, MH',
    specialization: 'Health Psychology', experience: '4 years', skills: ['Pain Management', 'Biofeedback', 'Wellness Programs', 'Mindfulness'],
    education: 'MA Health Psychology, Pune University', availability: 'Immediate', hasConsent: true, isSaved: false, rating: 4.4, completedProjects: 5,
  },
];

const SPECIALIZATION_OPTIONS = ['All', 'Clinical Psychology', 'Counseling Psychology', 'I/O Psychology', 'Neuropsychology', 'Child & Adolescent', 'Health Psychology', 'Forensic Psychology'];
const AVAILABILITY_OPTIONS = ['All', 'Immediate', 'Within 1 Month', 'Within 3 Months'];
const EXPERIENCE_OPTIONS = ['All', '0–2 years', '3–5 years', '6–10 years', '10+ years'];

/* ═══ Component ═══ */

interface CandidateSearchPageProps {
  onBack: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export function CandidateSearchPage({ onBack, onNavigate }: CandidateSearchPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [specFilter, setSpecFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [candidates, setCandidates] = useState(MOCK_CANDIDATES);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = candidates;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.headline.toLowerCase().includes(q) || c.skills.some(s => s.toLowerCase().includes(q)));
    }
    if (specFilter !== 'All') result = result.filter(c => c.specialization === specFilter);
    if (availFilter !== 'All') result = result.filter(c => c.availability === availFilter);
    if (expFilter !== 'All') {
      result = result.filter(c => {
        const years = parseInt(c.experience);
        if (expFilter === '0–2 years') return years <= 2;
        if (expFilter === '3–5 years') return years >= 3 && years <= 5;
        if (expFilter === '6–10 years') return years >= 6 && years <= 10;
        if (expFilter === '10+ years') return years > 10;
        return true;
      });
    }
    return result;
  }, [candidates, searchQuery, specFilter, availFilter, expFilter]);

  const toggleSave = (id: string) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, isSaved: !c.isSaved } : c));
  };

  const hasFilters = specFilter !== 'All' || availFilter !== 'All' || expFilter !== 'All';

  const availColor: Record<string, string> = {
    'Immediate': 'bg-emerald-50 text-emerald-700',
    'Within 1 Month': 'bg-blue-50 text-blue-700',
    'Within 3 Months': 'bg-amber-50 text-amber-700',
    'Not Looking': 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-cyan-800 via-cyan-700 to-teal-700 pt-10 pb-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-6">
          <button onClick={onBack} className="flex items-center gap-1.5 text-cyan-200 hover:text-white transition-colors self-start -mb-2" style={{ fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <Users size={24} className="text-white" />
              </div>
              <div>
                <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>Candidate Directory</p>
                <p className="text-cyan-100 mt-1" style={{ fontSize: 14, fontWeight: 500 }}>
                  Search and connect with psychology professionals and students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
                <Shield size={13} className="text-emerald-300" />
                <span className="text-white" style={{ fontSize: 11, fontWeight: 500 }}>Consent-gated profiles only</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-6 flex flex-col gap-5">
        {/* Search + Filter Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, skill, or specialization..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 transition-all"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Desktop Filters */}
          <div className="hidden sm:flex items-center gap-2">
            {[
              { label: 'Specialization', value: specFilter, options: SPECIALIZATION_OPTIONS, onChange: setSpecFilter },
              { label: 'Availability', value: availFilter, options: AVAILABILITY_OPTIONS, onChange: setAvailFilter },
              { label: 'Experience', value: expFilter, options: EXPERIENCE_OPTIONS, onChange: setExpFilter },
            ].map(f => (
              <div key={f.label} className="relative">
                <select
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  className={`appearance-none pl-3 pr-8 py-2.5 rounded-xl border text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 transition-all cursor-pointer ${
                    f.value !== 'All' ? 'bg-cyan-50 border-cyan-200' : 'bg-white border-gray-200'
                  }`}
                  style={{ fontSize: 12 }}
                >
                  {f.options.map(o => (
                    <option key={o} value={o}>{o === 'All' ? `${f.label}: All` : o}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            ))}
            {hasFilters && (
              <button
                onClick={() => { setSpecFilter('All'); setAvailFilter('All'); setExpFilter('All'); }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                style={{ fontSize: 12, fontWeight: 600 }}
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <SlidersHorizontal size={15} />
            Filters
            {hasFilters && <span className="w-2 h-2 rounded-full bg-cyan-500" />}
          </button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="sm:hidden flex flex-col gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4 animate-fade-in">
            {[
              { label: 'Specialization', value: specFilter, options: SPECIALIZATION_OPTIONS, onChange: setSpecFilter },
              { label: 'Availability', value: availFilter, options: AVAILABILITY_OPTIONS, onChange: setAvailFilter },
              { label: 'Experience', value: expFilter, options: EXPERIENCE_OPTIONS, onChange: setExpFilter },
            ].map(f => (
              <div key={f.label} className="flex flex-col gap-1">
                <label className="text-gray-600" style={{ fontSize: 12, fontWeight: 600 }}>{f.label}</label>
                <select
                  value={f.value}
                  onChange={e => f.onChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700"
                  style={{ fontSize: 13 }}
                >
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 500 }}>
          {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Candidate Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
              <Users size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-900" style={{ fontSize: 16, fontWeight: 700 }}>No candidates found</p>
            <p className="text-gray-500 text-center max-w-sm" style={{ fontSize: 13 }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(candidate => (
              <div key={candidate.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md transition-shadow group">
                {/* Header */}
                <div className="flex items-start gap-3">
                  <img src={candidate.avatarUrl} alt={candidate.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 truncate" style={{ fontSize: 14, fontWeight: 700 }}>{candidate.name}</p>
                    <p className="text-gray-500 truncate mt-0.5" style={{ fontSize: 12 }}>{candidate.headline}</p>
                  </div>
                  <button
                    onClick={() => toggleSave(candidate.id)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      candidate.isSaved ? 'bg-cyan-50 text-cyan-600' : 'text-gray-300 hover:text-cyan-500 hover:bg-cyan-50'
                    }`}
                  >
                    <Bookmark size={16} fill={candidate.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin size={12} />
                    <span style={{ fontSize: 11 }}>{candidate.location}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Briefcase size={12} />
                    <span style={{ fontSize: 11 }}>{candidate.experience}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star size={12} fill="currentColor" />
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{candidate.rating}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.slice(0, 4).map(skill => (
                    <span key={skill} className="px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100" style={{ fontSize: 11 }}>
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Availability + Education */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md ${availColor[candidate.availability]}`} style={{ fontSize: 10, fontWeight: 700 }}>
                    {candidate.availability}
                  </span>
                  <span className="text-gray-400" style={{ fontSize: 11 }}>·</span>
                  <span className="text-gray-500 truncate" style={{ fontSize: 11 }}>{candidate.education}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => onNavigate('PersonProfile', { personId: candidate.id })}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
                    style={{ fontSize: 12, fontWeight: 700 }}
                  >
                    <ExternalLink size={13} /> View Profile
                  </button>
                  {candidate.hasConsent && (
                    <button
                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                      style={{ fontSize: 12, fontWeight: 600 }}
                      title="Download CV (consent granted)"
                    >
                      <Download size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => onNavigate('Messages', { personId: candidate.id })}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    style={{ fontSize: 12, fontWeight: 600 }}
                    title="Message"
                  >
                    <MessageSquare size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
