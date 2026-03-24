import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Search, MapPin, Briefcase, ArrowDown, Bookmark, CheckCircle2, LayoutGrid, SlidersHorizontal, Plus, X, ArrowLeft, ArrowRight, Building2, Star, Clock, TrendingUp, BookOpen, Compass, GraduationCap, FolderOpen, Calendar, ChevronDown, Check } from 'lucide-react';
import { JobCard } from '@/app/components/JobCard';
import type { JobStatusBadge } from '@/app/components/JobCard';
import { ApplicationTrackerItem, ApplicationStatus } from '@/app/components/jobs/ApplicationTrackerItem';
import { JobFilters, JobFilterState } from '@/app/components/jobs/JobFilters';
import type { JobSpecialization, JobType as FilterJobType, JobLevel, JobIndustry, SalaryBracket } from '@/app/components/jobs/JobFilters';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { EmptyStateNudge, LowResultsNudge } from '@/app/components/CrossLinkNudge';
import { ShareModal } from '@/app/components/shared/ShareModal';
import { toastBookmarkAdded, toastBookmarkRemoved } from '@/app/components/shared/toasts';
import { EmptyState } from '@/app/components/shared/EmptyState';
import { JobCardSkeleton, SkeletonGrid } from '@/app/components/shared/SkeletonCards';


interface JobsPageProps {
  onNavigate?: (page: string, params?: any) => void;
  userRole?: string;
  embedded?: boolean;
  externalSearchQuery?: string;
  onExternalSearchChange?: (query: string) => void;
  externalLocationQuery?: string;
  onExternalLocationChange?: (query: string) => void;
  externalSubTab?: 'all' | 'saved' | 'applied';
  onExternalSubTabChange?: (tab: 'all' | 'saved' | 'applied') => void;
}

// ── Browse by Category chip definitions ──

const SPECIALIZATIONS: JobSpecialization[] = [
  'Clinical', 'Counselling', 'Developmental', 'Social Psychology',
  'Industrial-Organizational', 'Neuropsychology', 'Sports Psychology',
  'Research', 'Academia', 'Others',
];

const EMPLOYMENT_TYPES: FilterJobType[] = [
  'Full-time', 'Part-time', 'Internship', 'Consulting', 'Remote', 'Volunteer',
];

const CAREER_STAGES: JobLevel[] = [
  'Entry Level', 'Mid Level', 'Senior Level', 'Expert',
];

const INDUSTRIES: JobIndustry[] = [
  'Hospital', 'School', 'Companies', 'Mental Health Startup',
];

// ── Top companies data ──

const TOP_COMPANIES = [
  { name: 'MindCare Clinic', logo: 'https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080', openRoles: 3, industry: 'Clinical Psychology' },
  { name: 'Serenity Health', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZm9yJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3Njk1ODA4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080', openRoles: 2, industry: 'Hospital' },
  { name: 'Hope Foundation', logo: 'https://images.unsplash.com/photo-1723401697762-2909ec2b377d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub24lMjBwcm9maXQlMjBvcmdhbml6YXRpb24lMjBsb2dvJTIwaGVhcnR8ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080', openRoles: 1, industry: 'NGO' },
  { name: 'Corporate Wellness Co', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBsb2dvfGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080', openRoles: 2, industry: 'Corporate' },
  { name: 'NeuroCare Institute', logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyb2xvZ3klMjBsb2dofGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080', openRoles: 1, industry: 'Research' },
];

// ── Testimonials ──

const TESTIMONIALS = [
  { name: 'Priya Nair', role: 'M.Phil Clinical Psychology', quote: 'PsycHIRE helped me land my first clinical role within weeks of graduating. The specialization filters made job hunting so much easier.', avatar: 'PN', photo: 'https://images.unsplash.com/photo-1770364021085-03e135f84231?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGZvcm1hbCUyMGJ1c2luZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwODAyOTM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { name: 'Arjun Mehta', role: 'Counselling Psychologist', quote: 'I found my dream consulting position through PsycHIRE. The platform truly understands the psychology job market in India.', avatar: 'AM' },
  { name: 'Sneha Patel', role: 'Research Assistant', quote: 'As a student, the internship listings were invaluable. I got matched with a neuropsychology lab that aligned perfectly with my interests.', avatar: 'SP' },
];

// ── Career insights ──

const CAREER_INSIGHTS = [
  { title: 'Top 5 In-Demand Psychology Specializations in 2026', category: 'Career Trends', readTime: '4 min read', thumbnail: 'https://images.unsplash.com/photo-1561993629-67302018480e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwY2FyZWVyJTIwY291bnNlbGluZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzA4MDE4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { title: 'How to Prepare for a Clinical Psychology Interview', category: 'Interview Tips', readTime: '6 min read', thumbnail: 'https://images.unsplash.com/photo-1758520144417-e1c432042dec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb2IlMjBpbnRlcnZpZXclMjBwcmVwYXJhdGlvbiUyMG9mZmljZXxlbnwxfHx8fDE3NzA4MDE4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
  { title: 'Navigating Your First Year as a Counselling Psychologist', category: 'Career Guide', readTime: '5 min read', thumbnail: 'https://images.unsplash.com/photo-1601128688653-7dc405e3ac4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBwcm9mZXNzaW9uYWwlMjB3cml0aW5nJTIwbm90ZXN8ZW58MXx8fHwxNzcwODAxODM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' },
];

// ══════════════════════════════════════════════
// Component
// ══════════════════════════════════════════════

export function JobsPage({ onNavigate, userRole, embedded, externalSearchQuery, onExternalSearchChange, externalLocationQuery, onExternalLocationChange, externalSubTab, onExternalSubTabChange }: JobsPageProps) {
  const isProfessional = userRole === 'Professional';
  const isStudent = userRole === 'Student';
  const STUDENT_ALLOWED_TYPES: FilterJobType[] = ['Internship', 'Volunteer', 'Remote'];
  const STUDENT_ALLOWED_LEVELS: JobLevel[] = ['Entry Level'];
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalLocationQuery, setInternalLocationQuery] = useState('');

  const searchQuery = embedded && externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = embedded && onExternalSearchChange ? onExternalSearchChange : setInternalSearchQuery;
  const locationQuery = embedded && externalLocationQuery !== undefined ? externalLocationQuery : internalLocationQuery;
  const setLocationQuery = embedded && onExternalLocationChange ? onExternalLocationChange : setInternalLocationQuery;

  const [internalTab, setInternalTab] = useState<'all' | 'saved' | 'applied'>('all');
  const activeTab = externalSubTab !== undefined ? externalSubTab : internalTab;
  const setActiveTab = onExternalSubTabChange ? onExternalSubTabChange : setInternalTab;
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const prevTab = useRef(activeTab);

  // Skeleton loading on tab switch
  useEffect(() => {
    if (prevTab.current !== activeTab) {
      setIsTabLoading(true);
      const timer = setTimeout(() => setIsTabLoading(false), 600);
      prevTab.current = activeTab;
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // Saved jobs state (local toggle by title — initialized from mock isSaved flags)
  const [savedJobTitles, setSavedJobTitles] = useState<Set<string>>(() => new Set([
    'Junior Child Psychologist',
    'Clinical Psychologist',
    'Research Assistant',
    'Psychometrics Analyst',
  ]));

  const toggleSaveJob = (jobTitle: string) => {
    setSavedJobTitles(prev => {
      const next = new Set(prev);
      if (next.has(jobTitle)) {
        next.delete(jobTitle);
        toastBookmarkRemoved('job');
      } else {
        next.add(jobTitle);
        toastBookmarkAdded('job');
      }
      return next;
    });
  };

  // Share modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareJobTitle, setShareJobTitle] = useState('');

  const handleShareJob = (title: string) => {
    setShareJobTitle(title);
    setShareModalOpen(true);
  };

  const [filters, setFilters] = useState<JobFilterState>({
    specializations: [],
    types: [],
    levels: [],
    industries: [],
    country: '',
    state: '',
    city: '',
    salaryBrackets: [],
  });

  // Scroll ref for listings area
  const listingsRef = useRef<HTMLDivElement>(null);

  // Toggle a filter value (works for both category chips and sidebar)
  const toggleFilter = useCallback(<T extends string>(key: keyof JobFilterState, value: T) => {
    setFilters(prev => {
      const arr = (prev[key] as T[]) || [];
      const next = arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];
      return { ...prev, [key]: next };
    });
  }, []);


  
  const allJobs = [
    {
      companyName: "MindCare Clinic",
      logoUrl: "https://images.unsplash.com/photo-1704121112762-86661f0ae5a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZW50YWwlMjBoZWFsdGglMjBjbGluaWMlMjBsb2dvJTIwYWJzdHJhY3QlMjBtaW5pbWFsaXN0fGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Junior Child Psychologist",
      tag: "Developmental",
      specialization: "Developmental" as JobSpecialization,
      jobType: "Full-time" as FilterJobType,
      industry: "Hospital" as JobIndustry,
      chipVariant: "mint",
      description: "We are looking for a compassionate Junior Child Psychologist to join our pediatric mental health team. You will work under supervision to provide assessments...",
      location: "Mumbai, MH",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      level: "Entry Level" as JobLevel,
      salary: "₹40k - ₹60k/mo",
      salaryMin: 40000,
      isSaved: true,
      isApplied: false,
      isFeatured: true,
      statusBadge: undefined as JobStatusBadge | undefined,
    },
    {
      companyName: "Hope Foundation",
      logoUrl: "https://images.unsplash.com/photo-1723401697762-2909ec2b377d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub24lMjBwcm9maXQlMjBvcmdhbml6YXRpb24lMjBsb2dvJTIwaGVhcnR8ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Community Outreach Counselor",
      tag: "Counselling",
      specialization: "Counselling" as JobSpecialization,
      jobType: "Volunteer" as FilterJobType,
      industry: "Mental Health Startup" as JobIndustry,
      chipVariant: "blue",
      description: "Join our NGO to help bridge the gap in mental health accessibility. You will be conducting workshops and basic counseling sessions in rural areas...",
      location: "Pune, MH",
      country: "India",
      state: "Maharashtra",
      city: "Pune",
      level: "Mid Level" as JobLevel,
      salary: "₹35k - ₹50k/mo",
      salaryMin: 35000,
      isSaved: false,
      isApplied: true,
      isFeatured: true,
      appliedDate: "Feb 15, 2026",
      status: "Shortlisted" as ApplicationStatus,
      nextStep: "Awaiting HR Review",
      statusBadge: 'new' as JobStatusBadge,
    },
    {
      companyName: "Serenity Health",
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZm9yJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3Njk1ODA4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Clinical Psychologist",
      tag: "Clinical",
      specialization: "Clinical" as JobSpecialization,
      jobType: "Full-time" as FilterJobType,
      industry: "Hospital" as JobIndustry,
      chipVariant: "purple",
      description: "Seeking an experienced Clinical Psychologist to diagnose and treat patients with various mental health disorders. Must be licensed and have 3+ years experience.",
      location: "Bangalore, KA",
      country: "India",
      state: "Karnataka",
      city: "Bangalore",
      level: "Senior Level" as JobLevel,
      salary: "₹80k - ₹1.2L/mo",
      salaryMin: 80000,
      isSaved: true,
      isApplied: false,
      isFeatured: true,
      statusBadge: 'urgent' as JobStatusBadge,
    },
    {
      companyName: "EduSupport",
      logoUrl: "https://images.unsplash.com/photo-1541462608143-0af7558dc1e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsb2dvJTIwYWJzdHJhY3Q8ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "School Counselor",
      tag: "Counselling",
      specialization: "Counselling" as JobSpecialization,
      jobType: "Full-time" as FilterJobType,
      industry: "School" as JobIndustry,
      chipVariant: "amber",
      description: "Work with students to improve their academic achievement, personal and social development. Requires a Master's degree in School Counseling.",
      location: "Delhi, NCR",
      country: "India",
      state: "Delhi",
      city: "New Delhi",
      level: "Mid Level" as JobLevel,
      salary: "₹50k - ₹70k/mo",
      salaryMin: 50000,
      isSaved: false,
      isApplied: false,
      isFeatured: true,
      statusBadge: 'closing-soon' as JobStatusBadge,
    },
    {
      companyName: "Corporate Wellness Co",
      logoUrl: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjBsb2dvfGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Industrial Psychologist",
      tag: "Industrial-Organizational",
      specialization: "Industrial-Organizational" as JobSpecialization,
      jobType: "Consulting" as FilterJobType,
      industry: "Companies" as JobIndustry,
      chipVariant: "slate",
      description: "Apply psychological principles to the workplace to improve productivity and quality of work life. Help with recruitment and organizational development.",
      location: "Hyderabad, TS",
      country: "India",
      state: "Telangana",
      city: "Hyderabad",
      level: "Expert" as JobLevel,
      salary: "₹60k - ₹90k/mo",
      salaryMin: 60000,
      isSaved: false,
      isApplied: true,
      appliedDate: "Jan 28, 2026",
      status: "Interview" as ApplicationStatus,
      nextStep: "Technical Round scheduled for Feb 24"
    },
    {
      companyName: "NeuroCare Institute",
      logoUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyb2xvZ3klMjBsb2dofGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Neuropsychology Researcher",
      tag: "Neuropsychology",
      specialization: "Neuropsychology" as JobSpecialization,
      jobType: "Consulting" as FilterJobType,
      industry: "Hospital" as JobIndustry,
      chipVariant: "rose",
      description: "Excellent opportunity for professionals to lead neuropsychological testing and assessment research under expert supervision.",
      location: "Chennai, TN",
      country: "India",
      state: "Tamil Nadu",
      city: "Chennai",
      level: "Entry Level" as JobLevel,
      salary: "₹15k - ₹25k/mo",
      salaryMin: 15000,
      isSaved: false,
      isApplied: false,
      statusBadge: 'new' as JobStatusBadge,
    },
    {
      companyName: "Wellness Together",
      logoUrl: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGglMjBjbGluaWMlMjBsb2dvfGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Mental Health Counselor",
      tag: "Counselling",
      specialization: "Counselling" as JobSpecialization,
      jobType: "Remote" as FilterJobType,
      industry: "Mental Health Startup" as JobIndustry,
      chipVariant: "mint",
      description: "Join our vibrant team providing counseling services to diverse populations. We value empathy, continuous learning, and a holistic approach to mental health.",
      location: "Bangalore, KA",
      country: "India",
      state: "Karnataka",
      city: "Bangalore",
      level: "Mid Level" as JobLevel,
      salary: "₹45k - ₹65k/mo",
      salaryMin: 45000,
      isSaved: false,
      isApplied: false,
    },
    {
      companyName: "Cognitive Solutions",
      logoUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmFpbiUyMGxvZ298ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Research Assistant",
      tag: "Research",
      specialization: "Research" as JobSpecialization,
      jobType: "Part-time" as FilterJobType,
      industry: "Companies" as JobIndustry,
      chipVariant: "slate",
      description: "Assist in cutting-edge cognitive psychology research. Responsibilities include data collection, literature review, and participant coordination.",
      location: "Remote",
      country: "",
      state: "",
      city: "",
      level: "Entry Level" as JobLevel,
      salary: "₹25k - ₹40k/mo",
      salaryMin: 25000,
      isSaved: true,
      isApplied: true,
      appliedDate: "Dec 10, 2025",
      status: "Rejected" as ApplicationStatus,
      nextStep: "None"
    },
    {
      companyName: "Bright Future Schools",
      logoUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBsb2dvfGVufDF8fHx8MTc2OTU4MDg2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Educational Psychologist",
      tag: "Developmental",
      specialization: "Developmental" as JobSpecialization,
      jobType: "Full-time" as FilterJobType,
      industry: "School" as JobIndustry,
      chipVariant: "amber",
      description: "Partner with educators and parents to support students' learning and emotional needs. Help create inclusive learning environments.",
      location: "Hyderabad, TS",
      country: "India",
      state: "Telangana",
      city: "Hyderabad",
      level: "Senior Level" as JobLevel,
      salary: "₹70k - ₹95k/mo",
      salaryMin: 70000,
      isSaved: false,
      isApplied: true,
      appliedDate: "Feb 20, 2026",
      status: "In Review" as ApplicationStatus,
      nextStep: "Application sent"
    },
    {
      companyName: "ThrivePath Wellness",
      logoUrl: "https://images.unsplash.com/photo-1601128688653-7dc405e3ac4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW50YWwlMjBoZWFsdGglMjBwcm9mZXNzaW9uYWwlMjB3cml0aW5nJTIwbm90ZXN8ZW58MXx8fHwxNzcwODAxODM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Behavioral Health Specialist",
      tag: "Clinical",
      specialization: "Clinical" as JobSpecialization,
      jobType: "Full-time" as FilterJobType,
      industry: "Hospital" as JobIndustry,
      chipVariant: "purple",
      description: "Provide evidence-based behavioral health interventions. Collaborate with multidisciplinary teams to develop treatment plans for complex cases.",
      location: "Kolkata, WB",
      country: "India",
      state: "West Bengal",
      city: "Kolkata",
      level: "Mid Level" as JobLevel,
      salary: "₹55k - ₹75k/mo",
      salaryMin: 55000,
      isSaved: false,
      isApplied: false,
      statusBadge: 'new' as JobStatusBadge,
    },
    {
      companyName: "MindShift Labs",
      logoUrl: "https://images.unsplash.com/photo-1561993629-67302018480e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwY2FyZWVyJTIwY291bnNlbGluZyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzA4MDE4MzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Psychometrics Analyst",
      tag: "Research",
      specialization: "Research" as JobSpecialization,
      jobType: "Remote" as FilterJobType,
      industry: "Mental Health Startup" as JobIndustry,
      chipVariant: "blue",
      description: "Develop and validate psychometric instruments for digital mental health tools. Work with data scientists and clinicians to advance evidence-based assessment.",
      location: "Remote",
      country: "",
      state: "",
      city: "",
      level: "Mid Level" as JobLevel,
      salary: "₹60k - ₹85k/mo",
      salaryMin: 60000,
      isSaved: true,
      isApplied: false,
    },
    {
      companyName: "Inner Compass Center",
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2dvJTIwZm9yJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3Njk1ODA4Njd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Family Therapist",
      tag: "Counselling",
      specialization: "Counselling" as JobSpecialization,
      jobType: "Part-time" as FilterJobType,
      industry: "Hospital" as JobIndustry,
      chipVariant: "amber",
      description: "Provide family and couples therapy in our outpatient clinic. Flexible hours with opportunities for professional development and peer supervision.",
      location: "Ahmedabad, GJ",
      country: "India",
      state: "Gujarat",
      city: "Ahmedabad",
      level: "Senior Level" as JobLevel,
      salary: "₹50k - ₹70k/mo",
      salaryMin: 50000,
      isSaved: false,
      isApplied: false,
    },
    {
      companyName: "Campus Care",
      logoUrl: "https://images.unsplash.com/photo-1541462608143-0af7558dc1e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBsb2dvJTIwYWJzdHJhY3Q8ZW58MXx8fHwxNzY5NTgwODY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      jobTitle: "Student Wellness Coordinator",
      tag: "Counselling",
      specialization: "Counselling" as JobSpecialization,
      jobType: "Full-time" as FilterJobType,
      industry: "School" as JobIndustry,
      chipVariant: "mint",
      description: "Lead student wellness programs at a premier university campus. Design workshops, run counseling services, and train peer counselors.",
      location: "Jaipur, RJ",
      country: "India",
      state: "Rajasthan",
      city: "Jaipur",
      level: "Mid Level" as JobLevel,
      salary: "₹45k - ₹60k/mo",
      salaryMin: 45000,
      isSaved: false,
      isApplied: false,
    }
  ];

  // ── Derived state ──

  const getSalaryBracket = (salaryMin: number): SalaryBracket => {
    if (salaryMin < 25000) return 'Under ₹25k';
    if (salaryMin < 50000) return '₹25k – ₹50k';
    if (salaryMin < 75000) return '₹50k – ₹75k';
    if (salaryMin < 100000) return '₹75k – ₹1L';
    return 'Above ₹1L';
  };

  const hasActiveFilters = filters.specializations.length > 0 || filters.types.length > 0 || filters.levels.length > 0 || filters.industries.length > 0 || filters.country !== '' || filters.salaryBrackets.length > 0;
  const hasSearch = !!searchQuery || !!locationQuery;
  const isDiscoveryMode = activeTab === 'all' && !hasSearch && !hasActiveFilters && !showAllJobs;

  const jobs = useMemo(() => {
    return allJobs.filter(job => {
      if (activeTab === 'all' && job.isApplied) return false;
      if (activeTab === 'saved' && !savedJobTitles.has(job.jobTitle)) return false;
      if (activeTab === 'applied' && !job.isApplied) return false;

      // Student role restriction: only Internship/Volunteer/Remote + Entry Level
      if (isStudent && activeTab !== 'applied') {
        if (!STUDENT_ALLOWED_TYPES.includes(job.jobType) && !STUDENT_ALLOWED_LEVELS.includes(job.level)) return false;
      }

      const matchesSearch = job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.tag.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());

      if (activeTab !== 'applied') {
        if (filters.specializations.length > 0 && !filters.specializations.includes(job.specialization)) return false;
        if (filters.types.length > 0 && !filters.types.includes(job.jobType)) return false;
        if (filters.levels.length > 0 && !filters.levels.includes(job.level)) return false;
        if (filters.industries.length > 0 && !filters.industries.includes(job.industry)) return false;
        if (filters.country && job.country !== filters.country) return false;
        if (filters.state && job.state !== filters.state) return false;
        if (filters.city && job.city !== filters.city) return false;
        if (filters.salaryBrackets.length > 0 && !filters.salaryBrackets.includes(getSalaryBracket(job.salaryMin))) return false;
      }
      
      return matchesSearch && matchesLocation;
    }).sort((a, b) => {
      if (!searchQuery && !locationQuery && activeTab === 'all') {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
      }
      return 0;
    });
  }, [searchQuery, locationQuery, activeTab, filters, savedJobTitles]);

  const savedJobs = useMemo(() => allJobs.filter((j) => savedJobTitles.has(j.jobTitle)), [savedJobTitles]);
  const appliedJobs = useMemo(() => allJobs.filter((j) => j.isApplied), []);
  const appliedStats = useMemo(() => {
    const total = appliedJobs.length;
    const shortlisted = appliedJobs.filter((j) => j.status === 'Shortlisted' || j.status === 'Interview').length;
    const rejected = appliedJobs.filter((j) => j.status === 'Rejected').length;
    return { total, shortlisted, rejected };
  }, [appliedJobs]);

  const clearFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setFilters({ specializations: [], types: [], levels: [], industries: [], country: '', state: '', city: '', salaryBrackets: [] });
    setShowAllJobs(false);
  };

  // Discovery data
  const featuredJobs = useMemo(() => allJobs.filter(j => j.isFeatured && !j.isApplied), []);
  const latestJobs = useMemo(() => allJobs.filter(j => !j.isApplied && !j.isFeatured).slice(0, 6), []);

  // ── Collect active filter tags for removable pill display ──

  const activeFilterTags: { label: string; group: string; onRemove: () => void }[] = [];
  filters.specializations.forEach(s => activeFilterTags.push({ label: s, group: 'Specialization', onRemove: () => toggleFilter('specializations', s) }));
  filters.types.forEach(t => activeFilterTags.push({ label: t, group: 'Employment Type', onRemove: () => toggleFilter('types', t) }));
  filters.levels.forEach(l => activeFilterTags.push({ label: l, group: 'Career Stage', onRemove: () => toggleFilter('levels', l) }));
  filters.industries.forEach(i => activeFilterTags.push({ label: i, group: 'Industry', onRemove: () => toggleFilter('industries', i) }));
  filters.salaryBrackets.forEach(b => activeFilterTags.push({ label: b, group: 'Salary', onRemove: () => toggleFilter('salaryBrackets', b) }));
  if (filters.city) activeFilterTags.push({ label: filters.city, group: 'Location', onRemove: () => setFilters(p => ({ ...p, city: '' })) });
  else if (filters.state) activeFilterTags.push({ label: filters.state, group: 'Location', onRemove: () => setFilters(p => ({ ...p, state: '', city: '' })) });
  else if (filters.country) activeFilterTags.push({ label: filters.country, group: 'Location', onRemove: () => setFilters(p => ({ ...p, country: '', state: '', city: '' })) });

  // ── Dropdown browse chips state ──

  type DropdownKey = 'specializations' | 'types' | 'levels' | 'industries' | null;
  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click-outside
  useEffect(() => {
    if (!openDropdown) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openDropdown]);

  // Scroll to listings when dropdown closes after selections were made
  const prevOpenDropdown = useRef<DropdownKey>(null);
  useEffect(() => {
    if (prevOpenDropdown.current && !openDropdown && hasActiveFilters) {
      setTimeout(() => {
        listingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    prevOpenDropdown.current = openDropdown;
  }, [openDropdown, hasActiveFilters]);

  const BROWSE_CATEGORIES: { key: DropdownKey & string; label: string; icon: React.ReactNode; options: string[]; filterKey: keyof JobFilterState }[] = [
    { key: 'specializations', label: 'Specialization', icon: <GraduationCap size={14} />, options: SPECIALIZATIONS as unknown as string[], filterKey: 'specializations' },
    { key: 'types', label: 'Employment Type', icon: <Briefcase size={14} />, options: EMPLOYMENT_TYPES as unknown as string[], filterKey: 'types' },
    { key: 'levels', label: 'Career Stage', icon: <TrendingUp size={14} />, options: CAREER_STAGES as unknown as string[], filterKey: 'levels' },
    { key: 'industries', label: 'Industry', icon: <Building2 size={14} />, options: INDUSTRIES as unknown as string[], filterKey: 'industries' },
  ];

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════

  return (
    <div className={`flex flex-col w-full ${!embedded ? 'bg-[#f0f4f8] min-h-screen' : ''} font-sans animate-fade-in`}>
      {!embedded && (
      <div className="w-full bg-blue-800 pt-16 pb-12 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight leading-tight text-white">
                {isProfessional ? 'Job Opportunities' : 'Browse Job Opportunities'}
              </h1>
              <p className="text-blue-100 text-[15px] font-medium max-w-xl leading-relaxed opacity-90">
                {isProfessional ? 'Find consulting roles or post positions for your team.' : 'Find psychology roles that match your career goals.'}
              </p>
            </div>
            {isProfessional && (
              <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-sm shrink-0">
                <Plus size={16} strokeWidth={3} />
                Post a Job
              </button>
            )}
          </div>

          <div className="w-full bg-white rounded-2xl shadow-lg shadow-black/10 p-1.5 flex flex-col sm:flex-row items-stretch gap-1.5">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="Job title, company, or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
            <div className="w-px bg-gray-200 hidden sm:block my-2" />
            <div className="relative sm:w-72 group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-primary transition-colors" size={20} />
              <input
                type="text"
                placeholder="City, state, or remote..."
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 rounded-xl text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/20 transition-all"
              />
              {locationQuery && (
                <button onClick={() => setLocationQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
            <button className="flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-colors shrink-0 shadow-sm">
              <Search size={18} />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* ══ MAIN CONTENT ══ */}
      <div className={`w-full ${embedded ? '' : 'max-w-[1440px] mx-auto px-6 lg:px-10 py-10'} relative z-20`}>

        {/* Sub-navigation Tabs */}
        {!externalSubTab && (
        <div className="flex items-center p-1 bg-gray-100/80 rounded-lg self-start mb-8 w-fit">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === 'all' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Compass size={16} />
            Explore
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === 'saved' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bookmark size={16} />
            Saved
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
              activeTab === 'applied' ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <CheckCircle2 size={16} />
            Applied
          </button>
        </div>
        )}

        {/* ═══ EXPLORE TAB ═══ */}
        {activeTab === 'all' && (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">

            {/* ── Browse by Category — horizontal dropdown chips ── */}
            <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
              {BROWSE_CATEGORIES.map((cat) => {
                const selected = (filters[cat.filterKey] as string[]) || [];
                const count = selected.length;
                const isOpen = openDropdown === cat.key;
                return (
                  <div key={cat.key} className="relative">
                    <button
                      onClick={() => setOpenDropdown(isOpen ? null : cat.key as DropdownKey)}
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
                        <span className="min-w-[18px] h-[18px] rounded-full bg-white/25 text-[11px] font-bold flex items-center justify-center px-1">
                          {count}
                        </span>
                      )}
                      <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown popover */}
                    {isOpen && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                          {cat.options.map((option) => {
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

              {/* Clear All chip (only when filters active) */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-semibold text-brand-primary hover:bg-brand-primary/[0.06] transition-colors"
                >
                  <X size={14} strokeWidth={2.5} />
                  Clear All
                </button>
              )}
            </div>

            {/* ── Listings scroll target ── */}
            <div ref={listingsRef} className="-mt-4" />

            {/* Student Role Info Banner */}
            {isStudent && (
              <div className="flex items-start gap-3 px-4 py-3.5 bg-blue-50 border border-blue-100 rounded-xl">
                <GraduationCap size={18} className="text-[#1e40af] mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-900" style={{ fontSize: 13, fontWeight: 700 }}>Student View</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: 12 }}>
                    Showing internships, volunteering, remote, and entry-level roles suited for students.
                    Upgrade to a Professional account to access all listings.
                  </p>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════ */}
            {/* DISCOVERY SECTIONS (no filters active) */}
            {/* ═══════════════════════════════════════ */}
            {isDiscoveryMode && (
              <div className="flex flex-col gap-12">

                {/* ── Top Jobs (Featured only — equal priority) ── */}
                {featuredJobs.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Star size={18} className="text-amber-500" />
                        Top Jobs
                      </h2>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{featuredJobs.length} Featured</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {featuredJobs.map((job, idx) => (
                        <div key={`featured-${idx}`} className="h-full">
                          <JobCard {...job} isFeatured isSaved={savedJobTitles.has(job.jobTitle)} onSave={() => toggleSaveJob(job.jobTitle)} employmentType={job.jobType} onClick={() => onNavigate?.('JobDetails')} onShare={() => handleShareJob(job.jobTitle)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Top Companies Hiring Now ── */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Top Companies Hiring Now</h2>
                    <button onClick={() => onNavigate?.('Network')} className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {TOP_COMPANIES.map((company) => (
                      <div
                        key={company.name}
                        className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col items-center gap-3 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group text-center"
                        onClick={() => onNavigate?.('CompanyProfile', { companyId: 'co1' })}
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                          <ImageWithFallback src={company.logo} alt={company.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <h3 className="text-sm font-bold text-gray-900 group-hover:text-brand-primary transition-colors leading-tight">{company.name}</h3>
                          <p className="text-xs text-gray-400">{company.openRoles} open role{company.openRoles !== 1 ? 's' : ''}</p>
                        </div>
                        <span className="text-[11px] font-bold text-brand-primary hover:underline">View Jobs</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Latest Openings ── */}
                {latestJobs.length > 0 && (
                  <div className="flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900">Latest Openings</h2>
                      <button
                        onClick={() => setShowAllJobs(true)}
                        className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1"
                      >
                        View All <ArrowRight size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {latestJobs.map((job, index) => (
                        <div key={`latest-${index}`} className="h-full">
                          <JobCard {...job} isSaved={savedJobTitles.has(job.jobTitle)} onSave={() => toggleSaveJob(job.jobTitle)} employmentType={job.jobType} onClick={() => onNavigate?.('JobDetails')} onShare={() => handleShareJob(job.jobTitle)} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}



                {/* Testimonial Banner */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e3a5f] via-[#1a4b8c] to-[#0d7377]">
                  {/* Decorative shapes */}
                  <div className="absolute top-0 right-0 w-72 h-72 bg-white/[0.04] rounded-full -translate-y-1/3 translate-x-1/4" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/[0.03] rounded-full translate-y-1/3 -translate-x-1/4" />
                  <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-white/[0.03] rounded-full -translate-y-1/2" />

                  <div className="relative z-10 flex flex-col md:flex-row items-center">
                    {/* Photo side */}
                    <div className="shrink-0 pt-8 md:pt-0 md:pl-8 lg:pl-10">
                      <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg shadow-black/20">
                        <ImageWithFallback src={TESTIMONIALS[0].photo} alt={TESTIMONIALS[0].name} className="w-full h-full object-cover" />
                      </div>
                    </div>

                    {/* Content side */}
                    <div className="flex-1 p-8 md:py-10 md:px-10 flex flex-col gap-4 text-center md:text-left">
                      <p className="text-white/90 text-base md:text-lg leading-relaxed">
                        "{TESTIMONIALS[0].quote}"
                      </p>
                      <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3">
                        <span className="text-white font-bold text-sm">{TESTIMONIALS[0].name}</span>
                        <span className="hidden sm:inline text-white/30">|</span>
                        <span className="text-blue-200/80 text-xs">{TESTIMONIALS[0].role}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Career Insights — Blog Cards with Thumbnails */}
                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Career Insights</h2>
                    <button className="text-sm font-bold text-brand-primary hover:underline flex items-center gap-1">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {CAREER_INSIGHTS.map((insight) => (
                      <div key={insight.title} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col">
                        {/* Thumbnail */}
                        <div className="relative h-40 overflow-hidden bg-gray-100">
                          <ImageWithFallback
                            src={insight.thumbnail}
                            alt={insight.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-brand-primary uppercase tracking-wide">
                            <BookOpen size={10} />
                            {insight.category}
                          </span>
                        </div>
                        {/* Content */}
                        <div className="p-5 flex flex-col gap-3 flex-1">
                          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-brand-primary transition-colors line-clamp-2">{insight.title}</h3>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={11} />{insight.readTime}</span>
                            <span className="text-xs font-bold text-brand-primary flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              Read <ArrowRight size={12} />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════ */}
            {/* FILTERED RESULTS (search or filter on) */}
            {/* ═══════════════════════════════════════ */}
            {!isDiscoveryMode && (
              <div className="flex flex-col gap-4">

                {/* Active filter tags bar */}
                {(activeFilterTags.length > 0 || hasSearch) && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Active Filters:</span>
                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium">
                        "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    )}
                    {locationQuery && (
                      <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-teal-500/[0.07] text-teal-600 rounded-full text-[11px] font-medium">
                        <MapPin size={10} /> {locationQuery}
                        <button onClick={() => setLocationQuery('')} className="w-4 h-4 rounded-full hover:bg-teal-500/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    )}
                    {activeFilterTags.map(tag => (
                      <span
                        key={`${tag.group}-${tag.label}`}
                        className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-brand-primary/[0.07] text-brand-primary rounded-full text-[11px] font-medium"
                      >
                        {tag.label}
                        <button onClick={tag.onRemove} className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center transition-colors">
                          <X size={10} strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={clearFilters}
                      className="text-[12px] font-semibold text-gray-400 hover:text-brand-primary transition-colors ml-1"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Back to explore */}
                <button 
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-primary hover:underline self-start"
                >
                  <ArrowLeft size={16} />
                  Back to Explore Jobs
                </button>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Mobile Filter Toggle */}
                  <button
                    className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-semibold text-gray-700"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                  >
                    <SlidersHorizontal size={18} />
                    {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>

                  {/* Sidebar Filters (synced with category chips) */}
                  <div className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                    <JobFilters filters={filters} onChange={setFilters} />
                  </div>

                  {/* Results */}
                  <div className="flex-1">
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 hidden lg:block">{showAllJobs && !hasSearch && !hasActiveFilters ? 'All Jobs' : 'Search Results'}</h2>
                      <p className="text-sm font-medium text-gray-500 ml-auto">
                        Showing{' '}
                        <span className="text-gray-900 font-bold">{jobs.length}</span>{' '}
                        result{jobs.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    {jobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map((job, index) => (
                          <div key={`result-${index}`} className="h-full">
                            <JobCard {...job} isSaved={savedJobTitles.has(job.jobTitle)} onSave={() => toggleSaveJob(job.jobTitle)} employmentType={job.jobType} onClick={() => onNavigate?.('JobDetails')} onShare={() => handleShareJob(job.jobTitle)} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyStateNudge
                        module="jobs"
                        onNavigate={(page, params) => onNavigate?.(page, params)}
                        onClearFilters={clearFilters}
                      />
                    )}

                    {jobs.length > 0 && (
                      <>
                        <LowResultsNudge
                          module="jobs"
                          resultCount={jobs.length}
                          onNavigate={(page, params) => onNavigate?.(page, params)}
                        />
                        <div className="flex justify-center mt-8">
                          <button className="w-full md:w-auto px-8 py-3 text-sm font-medium text-gray-500 hover:text-brand-primary bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                            Load More Jobs
                            <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══ SAVED TAB ═══ */}
        {activeTab === 'saved' && (
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Saved Jobs</h2>
              <p className="text-sm font-medium text-gray-500 ml-auto">
                <span className="text-gray-900 font-bold">{savedJobs.length}</span> saved
              </p>
            </div>

            {isTabLoading ? (
              <SkeletonGrid count={4} columns={2}><JobCardSkeleton /></SkeletonGrid>
            ) : savedJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedJobs.map((job, index) => (
                  <div key={`saved-${index}`} className="h-full">
                    <JobCard {...job} isSaved={savedJobTitles.has(job.jobTitle)} onSave={() => toggleSaveJob(job.jobTitle)} employmentType={job.jobType} onClick={() => onNavigate?.('JobDetails')} onShare={() => handleShareJob(job.jobTitle)} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                variant="saved-jobs"
                onAction={() => setActiveTab('all')}
              />
            )}
          </div>
        )}

        {/* ═══ APPLIED TAB ═══ */}
        {activeTab === 'applied' && (
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 hidden lg:block">Applications Tracker</h2>
              <p className="text-sm font-medium text-gray-500 ml-auto">
                Showing <span className="text-gray-900 font-bold">{jobs.length}</span> results
              </p>
            </div>

            {isTabLoading ? (
              <SkeletonGrid count={4} columns={2}><JobCardSkeleton /></SkeletonGrid>
            ) : jobs.length > 0 ? (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-400 mb-1">Applied</p>
                    <p className="text-2xl font-bold text-gray-900">{appliedStats.total}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-400 mb-1">Shortlisted</p>
                    <p className="text-2xl font-bold text-gray-900">{appliedStats.shortlisted}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-400 mb-1">Rejected</p>
                    <p className="text-2xl font-bold text-gray-900">{appliedStats.rejected}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {jobs.map((job, index) => (
                    // @ts-ignore
                    <ApplicationTrackerItem 
                      key={`applied-${index}`}
                      // @ts-ignore
                      job={job}
                      onClick={() => onNavigate?.('JobDetails')} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                variant="applied"
                onAction={() => setActiveTab('all')}
              />
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={shareJobTitle}
        subtitle="Share this job opportunity"
      />
    </div>
  );
}
