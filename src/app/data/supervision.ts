// Supervision Module — Mock Data
import type { UserGroup, CareerStage } from './profile';

/* ── Types ── */

export type SupervisionDomain =
  | 'Clinical Psychology'
  | 'Counseling Psychology'
  | 'Neuropsychology'
  | 'Child & Adolescent'
  | 'Trauma & PTSD'
  | 'Health Psychology'
  | 'Organizational Psychology';

export type SupervisionPurpose = 'Licensure' | 'Skill Building' | 'Case Review';
export type SupervisionMode = 'Online' | 'Offline' | 'Both';
export type SupervisionSessionType = '1:1' | 'Group' | 'Both';
export type SupervisionFrequency = 'Weekly' | 'Biweekly' | 'Monthly';
export type SupervisionStatus = 'Pending' | 'Active' | 'Completed' | 'Declined';
export type SessionStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface Supervisor {
  id: string;
  name: string;
  avatarUrl: string;
  userGroup: UserGroup;
  isVerified: boolean;
  isVerifiedSupervisor: boolean;
  domain: SupervisionDomain;
  specializations: string[];
  yearsOfSupervisionExperience: number;
  supervisionStyle: string;
  purposes: SupervisionPurpose[];
  mode: SupervisionMode;
  isPaid: boolean;
  feePerSession: number;
  currency: string;
  sessionType: SupervisionSessionType;
  location: string;
  bio: string;
  credentials: string[];
  availability: string;
  languages: string[];
  totalSupervisees: number;
  activeSupervisees: number;
  isFeatured?: boolean;
}

export interface SupervisionRequest {
  id: string;
  supervisorId: string;
  superviseeId: string;
  superviseeName: string;
  superviseeAvatar: string;
  superviseeCareerStage: CareerStage;
  goal: string;
  purpose: SupervisionPurpose;
  domain: SupervisionDomain;
  frequency: SupervisionFrequency;
  sessionType: SupervisionSessionType;
  status: SupervisionStatus;
  createdAt: string;
}

export interface SupervisionSession {
  id: string;
  sessionNumber: number;
  date: string;
  time: string;
  duration: number; // hours
  meetingLink?: string;
  notes: string;
  feedback: string;
  status: SessionStatus;
}

export interface ActiveSupervision {
  id: string;
  supervisorId: string;
  superviseeId: string;
  superviseeName: string;
  superviseeAvatar: string;
  superviseeCareerStage: CareerStage;
  supervisorName: string;
  supervisorAvatar: string;
  goal: string;
  purpose: SupervisionPurpose;
  frequency: SupervisionFrequency;
  mode: SupervisionMode;
  sessionType: SupervisionSessionType;
  status: SupervisionStatus;
  startDate: string;
  endDate?: string;
  sessions: SupervisionSession[];
  certificateIssued: boolean;
  legalAgreed: boolean;
}

/* ── Filter options ── */

export const SUPERVISION_DOMAINS: SupervisionDomain[] = [
  'Clinical Psychology',
  'Counseling Psychology',
  'Neuropsychology',
  'Child & Adolescent',
  'Trauma & PTSD',
  'Health Psychology',
  'Organizational Psychology',
];

export const SUPERVISION_PURPOSES: SupervisionPurpose[] = ['Licensure', 'Skill Building', 'Case Review'];
export const SUPERVISION_MODES: SupervisionMode[] = ['Online', 'Offline', 'Both'];
export const SUPERVISION_SESSION_TYPES: SupervisionSessionType[] = ['1:1', 'Group', 'Both'];

/* ── Mock Supervisors ── */

export const MOCK_SUPERVISORS: Supervisor[] = [
  {
    id: 'sup-1',
    name: 'Dr. Anita Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNsaW5pY2FsJTIwcHN5Y2hvbG9naXN0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwOTg1NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    isVerified: true,
    isVerifiedSupervisor: true,
    domain: 'Clinical Psychology',
    specializations: ['CBT Supervision', 'Licensure Preparation', 'Case Formulation'],
    yearsOfSupervisionExperience: 12,
    supervisionStyle: 'Integrative — combines developmental and competency-based models with reflective practice.',
    purposes: ['Licensure', 'Skill Building'],
    mode: 'Online',
    isPaid: true,
    feePerSession: 1000,
    currency: 'INR',
    sessionType: '1:1',
    location: 'Mumbai, India',
    bio: 'RCI-registered clinical psychologist and approved supervisor with 12+ years of supervision experience. Specializes in preparing M.Phil. trainees for licensure through structured case-based supervision.',
    credentials: ['RCI Supervisor License (CLP/SUP/2014)', 'Ph.D. Clinical Psychology, NIMHANS', 'BCBA Certified'],
    availability: 'Weekday evenings (6\u20138 PM IST)',
    languages: ['English', 'Hindi', 'Marathi'],
    totalSupervisees: 38,
    activeSupervisees: 4,
    isFeatured: true,
  },
  {
    id: 'sup-2',
    name: 'Dr. Raghav Srinivasan',
    avatarUrl: 'https://images.unsplash.com/photo-1622460242126-e0a7f8b6f99c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzb3IlMjBzZW5pb3IlMjBhY2FkZW1pYyUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDk4NTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    isVerified: true,
    isVerifiedSupervisor: true,
    domain: 'Neuropsychology',
    specializations: ['Neuropsychological Assessment', 'Cognitive Rehabilitation', 'TBI Research'],
    yearsOfSupervisionExperience: 8,
    supervisionStyle: 'Competency-based — structured skill assessment with graded autonomy.',
    purposes: ['Skill Building', 'Case Review'],
    mode: 'Both',
    isPaid: true,
    feePerSession: 800,
    currency: 'INR',
    sessionType: 'Both',
    location: 'Bangalore, India',
    bio: 'Senior neuropsychologist at NIMHANS with a focus on training the next generation of neuropsychology practitioners. Supervises both 1:1 and group case review sessions.',
    credentials: ['RCI Supervisor License (NP/SUP/2018)', 'Ph.D. Neuropsychology, NIMHANS'],
    availability: 'Flexible \u2013 by appointment',
    languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
    totalSupervisees: 22,
    activeSupervisees: 3,
    isFeatured: true,
  },
  {
    id: 'sup-3',
    name: 'Dr. Prerna Malhotra',
    avatarUrl: 'https://images.unsplash.com/photo-1650546322568-de64777e4000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGFzaWFuJTIwd29tYW4lMjBjb3Vuc2Vsb3IlMjB0aGVyYXBpc3QlMjBwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA5ODU0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    isVerified: true,
    isVerifiedSupervisor: true,
    domain: 'Counseling Psychology',
    specializations: ['Person-Centered Therapy', 'Group Counseling', 'Career Counseling'],
    yearsOfSupervisionExperience: 10,
    supervisionStyle: 'Reflective \u2013 emphasis on self-awareness, therapeutic presence, and process-oriented learning.',
    purposes: ['Licensure', 'Skill Building', 'Case Review'],
    mode: 'Online',
    isPaid: true,
    feePerSession: 600,
    currency: 'INR',
    sessionType: 'Both',
    location: 'Delhi, India',
    bio: 'Counseling psychologist and supervisor with a reflective practice approach. Runs weekly group supervision for M.A. counseling psychology interns and offers individual licensure-track supervision.',
    credentials: ['RCI Supervisor License (COU/SUP/2016)', 'Ph.D. Counseling Psychology, Delhi University'],
    availability: 'Tuesday & Thursday 5\u20137 PM IST',
    languages: ['English', 'Hindi'],
    totalSupervisees: 30,
    activeSupervisees: 5,
    isFeatured: true,
  },
  {
    id: 'sup-4',
    name: 'Dr. Arun Pillai',
    avatarUrl: 'https://images.unsplash.com/photo-1659353887804-fc7f9313021a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBtYXR1cmUlMjBjb25maWRlbnQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcwOTg1NDc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    isVerified: true,
    isVerifiedSupervisor: true,
    domain: 'Trauma & PTSD',
    specializations: ['EMDR Supervision', 'Trauma-Focused CBT', 'Complex PTSD'],
    yearsOfSupervisionExperience: 14,
    supervisionStyle: 'Trauma-informed \u2013 prioritizes safety, emotional regulation, and structured debrief.',
    purposes: ['Skill Building', 'Case Review'],
    mode: 'Offline',
    isPaid: true,
    feePerSession: 1200,
    currency: 'INR',
    sessionType: '1:1',
    location: 'Chennai, India',
    bio: 'EMDR-accredited supervisor and trauma specialist. Provides intensive 1:1 supervision for clinicians working with complex trauma populations in hospital and community settings.',
    credentials: ['EMDR Approved Supervisor', 'RCI Supervisor License (CLP/SUP/2012)', 'Ph.D. Clinical Psychology, University of Madras'],
    availability: 'Saturdays 10 AM \u2013 2 PM IST',
    languages: ['English', 'Tamil', 'Hindi'],
    totalSupervisees: 18,
    activeSupervisees: 2,
  },
  {
    id: 'sup-5',
    name: 'Dr. Neha Bhatia',
    avatarUrl: 'https://images.unsplash.com/photo-1650546322568-de64777e4000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcmVzZWFyY2hlciUyMHBzeWNob2xvZ2lzdCUyMGFjYWRlbWljJTIwc3R1ZGlvfGVufDF8fHx8MTc3MDk4NTQ3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    isVerified: true,
    isVerifiedSupervisor: false,
    domain: 'Child & Adolescent',
    specializations: ['Play Therapy Supervision', 'School Psychology', 'Developmental Assessment'],
    yearsOfSupervisionExperience: 6,
    supervisionStyle: 'Developmental \u2013 scaffolded support that grows with the supervisee\u2019s skill level.',
    purposes: ['Licensure', 'Skill Building'],
    mode: 'Online',
    isPaid: false,
    feePerSession: 0,
    currency: 'INR',
    sessionType: 'Group',
    location: 'Pune, India',
    bio: 'Child psychologist offering pro-bono group supervision for M.A. and M.Phil. students specializing in child and adolescent mental health. Focuses on play therapy techniques and school-based interventions.',
    credentials: ['Ph.D. Child Psychology, SNDT University', 'Registered Play Therapist (APT)'],
    availability: 'Wednesday evenings 6\u20138 PM IST',
    languages: ['English', 'Hindi', 'Marathi'],
    totalSupervisees: 15,
    activeSupervisees: 6,
  },
  {
    id: 'sup-6',
    name: 'Dr. Vikrant Menon',
    avatarUrl: 'https://images.unsplash.com/photo-1737574994780-e31827afaed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBjbGluaWNhbCUyMHN1cGVydmlzb3IlMjBwcm9mZXNzaW9uYWwlMjBvZmZpY2V8ZW58MXx8fHwxNzcwOTg1NDc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    isVerified: true,
    isVerifiedSupervisor: true,
    domain: 'Health Psychology',
    specializations: ['Chronic Illness', 'Pain Management', 'Hospital Consultation'],
    yearsOfSupervisionExperience: 9,
    supervisionStyle: 'Collaborative \u2013 joint case analysis and co-formulation with gradual independence.',
    purposes: ['Case Review', 'Skill Building'],
    mode: 'Both',
    isPaid: true,
    feePerSession: 700,
    currency: 'INR',
    sessionType: '1:1',
    location: 'Hyderabad, India',
    bio: 'Health psychologist working at the intersection of psychology and medicine. Provides supervision for psychologists in hospital and rehabilitation settings.',
    credentials: ['RCI Supervisor License (HP/SUP/2017)', 'Ph.D. Health Psychology, Osmania University'],
    availability: 'Alternate Saturdays + Mondays',
    languages: ['English', 'Hindi', 'Telugu'],
    totalSupervisees: 12,
    activeSupervisees: 2,
  },
];

/* ── Mock Supervision Requests ── */

export const MOCK_SUPERVISION_REQUESTS: SupervisionRequest[] = [
  {
    id: 'sreq-1',
    supervisorId: 'sup-1',
    superviseeId: 'svisee-1',
    superviseeName: 'Sneha Patel',
    superviseeAvatar: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwd2FybXxlbnwxfHx8fDE3NzA5ODQwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    superviseeCareerStage: 'Post-grad',
    goal: 'Complete 200 clinical hours required for RCI licensure.',
    purpose: 'Licensure',
    domain: 'Clinical Psychology',
    frequency: 'Weekly',
    sessionType: '1:1',
    status: 'Pending',
    createdAt: '2026-02-10',
  },
  {
    id: 'sreq-2',
    supervisorId: 'sup-1',
    superviseeId: 'svisee-2',
    superviseeName: 'Rohan Gupta',
    superviseeAvatar: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwc3ljaG9sb2dpc3QlMjBjb25maWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA5NzI3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    superviseeCareerStage: 'Early Career',
    goal: 'Develop group therapy facilitation skills under supervision.',
    purpose: 'Skill Building',
    domain: 'Clinical Psychology',
    frequency: 'Biweekly',
    sessionType: '1:1',
    status: 'Pending',
    createdAt: '2026-02-08',
  },
];

/* ── Mock Active Supervisions ── */

export const MOCK_ACTIVE_SUPERVISIONS: ActiveSupervision[] = [
  {
    id: 'asup-1',
    supervisorId: 'sup-1',
    superviseeId: 'svisee-3',
    superviseeName: 'Meera Iyer',
    superviseeAvatar: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwd2FybXxlbnwxfHx8fDE3NzA5ODQwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    superviseeCareerStage: 'Post-grad',
    supervisorName: 'Dr. Anita Sharma',
    supervisorAvatar: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNsaW5pY2FsJTIwcHN5Y2hvbG9naXN0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwOTg1NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    goal: 'Complete intake assessment training and case conceptualization for licensure hours.',
    purpose: 'Licensure',
    frequency: 'Weekly',
    mode: 'Online',
    sessionType: '1:1',
    status: 'Active',
    startDate: '2025-11-15',
    sessions: [
      {
        id: 'ss1', sessionNumber: 1, date: '2025-11-22', time: '6:00 PM', duration: 1.5,
        notes: 'Reviewed intake interview framework. Practiced structured clinical interview techniques. Identified areas for improvement in rapport-building.',
        feedback: 'Strong understanding of theoretical framework. Needs more practice with open-ended questioning.',
        status: 'Completed',
      },
      {
        id: 'ss2', sessionNumber: 2, date: '2025-12-06', time: '6:00 PM', duration: 1,
        notes: 'Discussed case #1 \u2014 generalized anxiety disorder. Reviewed CBT case formulation using the Persons model.',
        feedback: 'Good formulation structure. Work on linking maintaining factors to treatment targets.',
        status: 'Completed',
      },
      {
        id: 'ss3', sessionNumber: 3, date: '2025-12-20', time: '6:00 PM', duration: 1.5,
        notes: 'Reviewed recorded therapy session. Discussed therapeutic alliance challenges and countertransference.',
        feedback: 'Excellent self-awareness. Continue reflective journaling before each session.',
        status: 'Completed',
      },
      {
        id: 'ss4', sessionNumber: 4, date: '2026-01-10', time: '6:00 PM', duration: 1,
        notes: 'Case #2 presentation \u2014 social anxiety disorder. Practiced exposure hierarchy planning.',
        feedback: 'Well-structured hierarchy. Consider including behavioral experiments alongside exposure.',
        status: 'Completed',
      },
      {
        id: 'ss5', sessionNumber: 5, date: '2026-01-24', time: '6:00 PM', duration: 1.5,
        notes: 'Ethics discussion \u2014 dual relationships and boundary management in institutional settings.',
        feedback: 'Mature ethical reasoning. Review RCI guidelines Chapter 5 for additional scenarios.',
        status: 'Completed',
      },
      {
        id: 'ss6', sessionNumber: 6, date: '2026-02-14', time: '6:00 PM', duration: 1,
        meetingLink: 'https://meet.google.com/sup-abc-def',
        notes: '', feedback: '', status: 'Scheduled',
      },
    ],
    certificateIssued: false,
    legalAgreed: true,
  },
  {
    id: 'asup-2',
    supervisorId: 'sup-1',
    superviseeId: 'svisee-4',
    superviseeName: 'Vikram Das',
    superviseeAvatar: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwc3ljaG9sb2dpc3QlMjBjb25maWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA5NzI3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    superviseeCareerStage: 'Post-grad',
    supervisorName: 'Dr. Anita Sharma',
    supervisorAvatar: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNsaW5pY2FsJTIwcHN5Y2hvbG9naXN0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwOTg1NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    goal: 'Develop trauma processing skills and EMDR competency.',
    purpose: 'Skill Building',
    frequency: 'Biweekly',
    mode: 'Online',
    sessionType: '1:1',
    status: 'Active',
    startDate: '2026-01-01',
    sessions: [
      {
        id: 'ss7', sessionNumber: 1, date: '2026-01-10', time: '7:00 PM', duration: 1.5,
        notes: 'Orientation session. Discussed learning goals, supervision contract, and EMDR Phase 1\u20132 overview.',
        feedback: 'Clear goals and strong motivation. Start with Shapiro\u2019s textbook chapters 1\u20134.',
        status: 'Completed',
      },
    ],
    certificateIssued: false,
    legalAgreed: true,
  },
];

/* ── Mock Completed Supervisions ── */

export const MOCK_COMPLETED_SUPERVISIONS: ActiveSupervision[] = [
  {
    id: 'csup-1',
    supervisorId: 'sup-1',
    superviseeId: 'svisee-5',
    superviseeName: 'Priya Nair',
    superviseeAvatar: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwd2FybXxlbnwxfHx8fDE3NzA5ODQwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    superviseeCareerStage: 'Early Career',
    supervisorName: 'Dr. Anita Sharma',
    supervisorAvatar: 'https://images.unsplash.com/photo-1704927768421-bc9549b5097d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGNsaW5pY2FsJTIwcHN5Y2hvbG9naXN0JTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwOTg1NDc2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    goal: 'Complete 200 hours for RCI licensure in clinical psychology.',
    purpose: 'Licensure',
    frequency: 'Weekly',
    mode: 'Online',
    sessionType: '1:1',
    status: 'Completed',
    startDate: '2025-03-01',
    endDate: '2025-09-30',
    sessions: [],
    certificateIssued: true,
    legalAgreed: true,
  },
];

/* ── Helper ── */

export function getSupervisorById(id: string): Supervisor | undefined {
  return MOCK_SUPERVISORS.find(s => s.id === id);
}

export function getTotalHours(sessions: SupervisionSession[]): number {
  return sessions.filter(s => s.status === 'Completed').reduce((sum, s) => sum + s.duration, 0);
}
