// Mentorship Module — Mock Data
import type { UserGroup, CareerStage } from './profile';

/* ── Types ── */

export type MentorshipDomain =
  | 'Clinical Psychology'
  | 'Counseling Psychology'
  | 'Neuropsychology'
  | 'Organizational Psychology'
  | 'Child & Adolescent'
  | 'Trauma & PTSD'
  | 'Research & Academia'
  | 'Health Psychology';

export type MentorCareerStage = 'Mid' | 'Supervisor' | 'Expert' | 'Founder';

export type MentorshipFrequency = 'Weekly' | 'Biweekly' | 'Monthly';
export type MentorshipCommitment = '1 Session' | '3 Months' | '6 Months';
export type MentorshipStatus = 'Pending' | 'Active' | 'Completed' | 'Declined';
export type SessionStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface MentorTestimonial {
  id: string;
  menteeName: string;
  text: string;
  date: string;
}

export interface Mentor {
  id: string;
  name: string;
  avatarUrl: string;
  userGroup: UserGroup;
  careerStage: MentorCareerStage;
  isVerified: boolean;
  isVerifiedMentor: boolean;
  domain: MentorshipDomain;
  specializations: string[];
  yearsOfExperience: number;
  mentorshipFocus: string;
  feePerSession: number;
  currency: string;
  location: string;
  bio: string;
  focusAreas: string[];
  experience: { title: string; organization: string; duration: string }[];
  education: { degree: string; institution: string; year: string }[];
  availability: string;
  languages: string[];
  totalMentees: number;
  activeMentees: number;
  testimonials: MentorTestimonial[];
  isFeatured?: boolean;
}

export interface MentorshipRequest {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  menteeCareerStage: CareerStage;
  goal: string;
  whyThisMentor: string;
  frequency: MentorshipFrequency;
  commitment: MentorshipCommitment;
  status: MentorshipStatus;
  createdAt: string;
}

export interface ActionItem {
  id: string;
  text: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface MentorshipSession {
  id: string;
  sessionNumber: number;
  date: string;
  time: string;
  meetingLink?: string;
  notes: string;
  actionItems: string[];
  status: SessionStatus;
}

export interface ActiveMentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  menteeName: string;
  menteeAvatar: string;
  menteeCareerStage: CareerStage;
  mentorName: string;
  mentorAvatar: string;
  goal: string;
  frequency: MentorshipFrequency;
  commitment: MentorshipCommitment;
  status: MentorshipStatus;
  startDate: string;
  endDate?: string;
  sessions: MentorshipSession[];
  actionPlan: ActionItem[];
  legalAgreed: boolean;
}

/* ── Domain / Filter options ── */

export const MENTORSHIP_DOMAINS: MentorshipDomain[] = [
  'Clinical Psychology',
  'Counseling Psychology',
  'Neuropsychology',
  'Organizational Psychology',
  'Child & Adolescent',
  'Trauma & PTSD',
  'Research & Academia',
  'Health Psychology',
];

export const MENTOR_CAREER_STAGES: MentorCareerStage[] = ['Mid', 'Supervisor', 'Expert', 'Founder'];

export const FEE_RANGES = [
  { label: 'Free', min: 0, max: 0 },
  { label: 'Under \u20B9500', min: 1, max: 500 },
  { label: '\u20B9500 \u2013 \u20B91,000', min: 500, max: 1000 },
  { label: '\u20B91,000+', min: 1000, max: Infinity },
];

/* ── Mock Mentors ── */

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Meera Kapoor',
    avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGRvY3RvciUyMG1hdHVyZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwY2xpbmljfGVufDF8fHx8MTc3MDk3Mjc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Supervisor',
    isVerified: true,
    isVerifiedMentor: true,
    domain: 'Clinical Psychology',
    specializations: ['CBT', 'Trauma & PTSD', 'Clinical Supervision'],
    yearsOfExperience: 15,
    mentorshipFocus: 'Guiding early-career clinicians through licensure and clinical practice development.',
    feePerSession: 800,
    currency: 'INR',
    location: 'Mumbai, India',
    bio: 'RCI-licensed clinical psychologist and supervisor with 15+ years of experience. Passionate about training early-career clinicians in evidence-based practice.',
    focusAreas: ['Licensure Preparation', 'Clinical Case Conceptualization', 'Building a Private Practice', 'Evidence-Based Interventions'],
    experience: [
      { title: 'Senior Clinical Psychologist', organization: 'Serenity Health Center', duration: '2015 \u2013 Present' },
      { title: 'Clinical Supervisor', organization: 'NIMHANS', duration: '2010 \u2013 2015' },
    ],
    education: [
      { degree: 'Ph.D. Clinical Psychology', institution: 'University of Mumbai', year: '2009' },
      { degree: 'M.Phil. Clinical Psychology', institution: 'NIMHANS', year: '2005' },
    ],
    availability: 'Weekday evenings (6\u20138 PM IST)',
    languages: ['English', 'Hindi', 'Marathi'],
    totalMentees: 24,
    activeMentees: 3,
    testimonials: [
      { id: 't1', menteeName: 'Ananya Sharma', text: 'Dr. Kapoor helped me navigate my RCI licensure process with clarity and confidence. Her clinical insights are invaluable.', date: '2025-09-15' },
      { id: 't2', menteeName: 'Rohan Iyer', text: 'Structured, warm, and incredibly knowledgeable. My understanding of case formulation improved dramatically.', date: '2025-07-22' },
    ],
    isFeatured: true,
  },
  {
    id: 'mentor-2',
    name: 'Dr. Arjun Mehta',
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjB0aGVyYXBpc3QlMjBjb3Vuc2Vsb3IlMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA5ODQxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Expert',
    isVerified: true,
    isVerifiedMentor: true,
    domain: 'Counseling Psychology',
    specializations: ['Career Counseling', 'Psychometric Assessment', 'Positive Psychology'],
    yearsOfExperience: 12,
    mentorshipFocus: 'Helping psychology graduates build careers in corporate wellness and counseling.',
    feePerSession: 600,
    currency: 'INR',
    location: 'Delhi, India',
    bio: 'Counseling psychologist specializing in career transitions, corporate wellness programs, and psychometric assessments. Former Head of Wellness at a Fortune 500.',
    focusAreas: ['Corporate Psychology Careers', 'Psychometric Test Development', 'Wellness Program Design', 'Career Transitions'],
    experience: [
      { title: 'Chief Wellness Officer', organization: 'MindSpace Wellness', duration: '2018 \u2013 Present' },
      { title: 'Head of Wellness', organization: 'Infosys BPO', duration: '2013 \u2013 2018' },
    ],
    education: [
      { degree: 'Ph.D. Counseling Psychology', institution: 'Delhi University', year: '2012' },
      { degree: 'M.A. Applied Psychology', institution: 'Jamia Millia Islamia', year: '2008' },
    ],
    availability: 'Saturdays 10 AM \u2013 1 PM IST',
    languages: ['English', 'Hindi'],
    totalMentees: 18,
    activeMentees: 2,
    testimonials: [
      { id: 't3', menteeName: 'Priya Nair', text: 'Dr. Mehta\u2019s guidance helped me transition from clinical work to corporate wellness seamlessly.', date: '2025-11-01' },
    ],
    isFeatured: true,
  },
  {
    id: 'mentor-3',
    name: 'Dr. Kavitha Rajan',
    avatarUrl: 'https://images.unsplash.com/photo-1664382951821-8151535191e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGFzaWFuJTIwd29tYW4lMjBwcm9mZXNzb3IlMjBhY2FkZW1pYyUyMG1lbnRvciUyMGNvbmZpZGVudHxlbnwxfHx8fDE3NzA5ODQxMDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Expert',
    isVerified: true,
    isVerifiedMentor: true,
    domain: 'Research & Academia',
    specializations: ['Qualitative Research', 'Academic Publishing', 'Grant Writing'],
    yearsOfExperience: 20,
    mentorshipFocus: 'Supporting early researchers in publishing, conference presentations, and PhD navigation.',
    feePerSession: 500,
    currency: 'INR',
    location: 'Chennai, India',
    bio: 'Professor of Psychology with 20+ years in academia. Published 45+ peer-reviewed papers. Passionate about making research accessible and mentoring the next generation of scholars.',
    focusAreas: ['Research Methodology', 'Academic Publishing', 'PhD Navigation', 'Conference Presentations'],
    experience: [
      { title: 'Professor of Psychology', organization: 'University of Madras', duration: '2010 \u2013 Present' },
      { title: 'Associate Professor', organization: 'IIT Madras (HSS)', duration: '2005 \u2013 2010' },
    ],
    education: [
      { degree: 'Ph.D. Psychology', institution: 'University of Cambridge', year: '2004' },
      { degree: 'M.Sc. Psychology', institution: 'University of Madras', year: '1999' },
    ],
    availability: 'Tuesday & Thursday evenings',
    languages: ['English', 'Tamil', 'Hindi'],
    totalMentees: 32,
    activeMentees: 4,
    testimonials: [
      { id: 't4', menteeName: 'Vikram Das', text: 'Dr. Rajan transformed my approach to academic writing. I published my first paper within 6 months of mentorship.', date: '2025-08-10' },
      { id: 't5', menteeName: 'Sanya Gupta', text: 'Her structured approach to research mentorship is exactly what every PhD student needs.', date: '2025-06-20' },
    ],
  },
  {
    id: 'mentor-4',
    name: 'Dr. Nikhil Joshi',
    avatarUrl: 'https://images.unsplash.com/photo-1659353887617-8cf154b312c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwcm9mZXNzb3IlMjBjbGluaWNhbCUyMHJlc2VhcmNoZXIlMjBvZmZpY2UlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA5ODQxMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Supervisor',
    isVerified: true,
    isVerifiedMentor: true,
    domain: 'Neuropsychology',
    specializations: ['Cognitive Rehabilitation', 'Neuroimaging', 'Assessment Batteries'],
    yearsOfExperience: 10,
    mentorshipFocus: 'Mentoring students interested in neuropsychological assessment and rehabilitation.',
    feePerSession: 700,
    currency: 'INR',
    location: 'Bangalore, India',
    bio: 'Neuropsychologist working at NIMHANS with expertise in cognitive rehabilitation and neuroimaging. Active researcher with a focus on traumatic brain injury outcomes.',
    focusAreas: ['Neuropsychological Assessment', 'Cognitive Rehabilitation', 'Neuroimaging Research', 'Clinical Neuropsychology Careers'],
    experience: [
      { title: 'Senior Neuropsychologist', organization: 'NIMHANS', duration: '2016 \u2013 Present' },
      { title: 'Research Fellow', organization: 'AIIMS Delhi', duration: '2013 \u2013 2016' },
    ],
    education: [
      { degree: 'Ph.D. Neuropsychology', institution: 'NIMHANS', year: '2015' },
      { degree: 'M.Phil. Clinical Psychology', institution: 'CIP Ranchi', year: '2011' },
    ],
    availability: 'Flexible \u2013 by appointment',
    languages: ['English', 'Hindi', 'Kannada'],
    totalMentees: 12,
    activeMentees: 2,
    testimonials: [
      { id: 't6', menteeName: 'Aisha Khan', text: 'Dr. Joshi gave me a clear roadmap into neuropsychology. His clinical exposure advice was spot on.', date: '2025-10-05' },
    ],
  },
  {
    id: 'mentor-5',
    name: 'Dr. Sunita Desai',
    avatarUrl: 'https://images.unsplash.com/photo-1765248148309-69d900a5bc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwY2xpbmljYWwlMjBwc3ljaG9sb2dpc3QlMjBwcm9mZXNzaW9uYWwlMjBzdHVkaW98ZW58MXx8fHwxNzcwOTg0MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Expert',
    isVerified: true,
    isVerifiedMentor: true,
    domain: 'Child & Adolescent',
    specializations: ['Play Therapy', 'Developmental Assessment', 'School Psychology'],
    yearsOfExperience: 16,
    mentorshipFocus: 'Guiding professionals into child and adolescent mental health practice.',
    feePerSession: 900,
    currency: 'INR',
    location: 'Pune, India',
    bio: 'Child psychologist and play therapist with 16 years of experience across clinical and school settings. Trains school counselors and early-career child psychologists.',
    focusAreas: ['Play Therapy Techniques', 'Developmental Assessment', 'School-Based Interventions', 'Working with Parents'],
    experience: [
      { title: 'Director', organization: 'Little Minds Child Psychology Center', duration: '2014 \u2013 Present' },
      { title: 'School Psychologist', organization: 'DPS Pune', duration: '2009 \u2013 2014' },
    ],
    education: [
      { degree: 'Ph.D. Child Psychology', institution: 'SNDT University', year: '2013' },
      { degree: 'M.A. Clinical Psychology', institution: 'Fergusson College', year: '2007' },
    ],
    availability: 'Weekday mornings (9\u201311 AM IST)',
    languages: ['English', 'Hindi', 'Marathi'],
    totalMentees: 20,
    activeMentees: 3,
    testimonials: [],
  },
  {
    id: 'mentor-6',
    name: 'Dr. Rajesh Venkataraman',
    avatarUrl: 'https://images.unsplash.com/photo-1584827172806-ea64d6d30fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBpbmRpYW4lMjBtYW4lMjBjb3Vuc2VsaW5nJTIwcHN5Y2hvbG9neSUyMG1lbnRvciUyMHdhcm18ZW58MXx8fHwxNzcwOTg0MTExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Founder',
    isVerified: true,
    isVerifiedMentor: true,
    domain: 'Organizational Psychology',
    specializations: ['Leadership Assessment', 'Executive Coaching', 'Organizational Development'],
    yearsOfExperience: 22,
    mentorshipFocus: 'Mentoring psychologists entering the corporate consulting and I/O psychology space.',
    feePerSession: 1200,
    currency: 'INR',
    location: 'Hyderabad, India',
    bio: 'Founder of PsychEdge Consulting. 22 years in organizational psychology, executive coaching, and leadership development across India and Southeast Asia.',
    focusAreas: ['I/O Psychology Careers', 'Executive Coaching Certification', 'Starting a Consulting Practice', 'Leadership Assessment Tools'],
    experience: [
      { title: 'Founder & CEO', organization: 'PsychEdge Consulting', duration: '2012 \u2013 Present' },
      { title: 'VP \u2013 People Strategy', organization: 'Wipro', duration: '2004 \u2013 2012' },
    ],
    education: [
      { degree: 'Ph.D. Organizational Psychology', institution: 'IIT Bombay', year: '2003' },
      { degree: 'M.B.A. (HR)', institution: 'XLRI Jamshedpur', year: '1999' },
    ],
    availability: 'Alternate Saturdays',
    languages: ['English', 'Hindi', 'Telugu'],
    totalMentees: 35,
    activeMentees: 2,
    testimonials: [
      { id: 't7', menteeName: 'Deepak Pillai', text: 'Dr. Venkataraman\u2019s industry connections and strategic thinking helped me land my first consulting role.', date: '2025-12-01' },
    ],
    isFeatured: true,
  },
];

/* ── Mock Mentorship Requests (for Mentor Dashboard) ── */

export const MOCK_REQUESTS: MentorshipRequest[] = [
  {
    id: 'req-1',
    mentorId: 'mentor-1',
    menteeId: 'mentee-current',
    menteeName: 'Ananya Sharma',
    menteeAvatar: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwd2FybXxlbnwxfHx8fDE3NzA5ODQwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    menteeCareerStage: 'Post-grad',
    goal: 'Prepare for RCI licensure examination and build case conceptualization skills.',
    whyThisMentor: 'Your background in clinical supervision and licensure guidance aligns perfectly with my current needs.',
    frequency: 'Biweekly',
    commitment: '3 Months',
    status: 'Pending',
    createdAt: '2026-02-10',
  },
  {
    id: 'req-2',
    mentorId: 'mentor-1',
    menteeId: 'mentee-2',
    menteeName: 'Vikram Das',
    menteeAvatar: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwc3ljaG9sb2dpc3QlMjBjb25maWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA5NzI3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    menteeCareerStage: 'Early Career',
    goal: 'Transition from hospital setting to private practice.',
    whyThisMentor: 'I admire your journey from institutional work to independent practice.',
    frequency: 'Monthly',
    commitment: '6 Months',
    status: 'Pending',
    createdAt: '2026-02-08',
  },
];

/* ── Mock Active Mentorships ── */

export const MOCK_ACTIVE_MENTORSHIPS: ActiveMentorship[] = [
  {
    id: 'am-1',
    mentorId: 'mentor-1',
    menteeId: 'mentee-3',
    menteeName: 'Priya Nair',
    menteeAvatar: 'https://images.unsplash.com/photo-1544264796-acfb69e05b37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHBzeWNob2xvZ2lzdCUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwd2FybXxlbnwxfHx8fDE3NzA5ODQwOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    menteeCareerStage: 'Post-grad',
    mentorName: 'Dr. Meera Kapoor',
    mentorAvatar: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGRvY3RvciUyMG1hdHVyZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwY2xpbmljfGVufDF8fHx8MTc3MDk3Mjc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    goal: 'Develop clinical case formulation skills and prepare for independent practice.',
    frequency: 'Biweekly',
    commitment: '3 Months',
    status: 'Active',
    startDate: '2025-12-01',
    sessions: [
      {
        id: 's1',
        sessionNumber: 1,
        date: '2025-12-15',
        time: '6:00 PM',
        notes: 'Discussed current clinical caseload and identified areas for growth. Reviewed CBT case formulation framework.',
        actionItems: ['Read Persons (2008) Ch. 3\u20134', 'Draft case formulation for current client'],
        status: 'Completed',
      },
      {
        id: 's2',
        sessionNumber: 2,
        date: '2026-01-05',
        time: '6:00 PM',
        notes: 'Reviewed case formulation draft. Discussed therapeutic alliance challenges. Introduced maintenance cycle mapping.',
        actionItems: ['Revise formulation with maintenance cycles', 'Practice Socratic questioning techniques'],
        status: 'Completed',
      },
      {
        id: 's3',
        sessionNumber: 3,
        date: '2026-01-19',
        time: '6:00 PM',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: 'Explored supervision readiness. Discussed ethical considerations in dual relationships.',
        actionItems: ['Review RCI code of ethics, Ch. 5', 'Prepare mock supervision session'],
        status: 'Completed',
      },
      {
        id: 's4',
        sessionNumber: 4,
        date: '2026-02-16',
        time: '6:00 PM',
        meetingLink: 'https://meet.google.com/abc-defg-hij',
        notes: '',
        actionItems: [],
        status: 'Scheduled',
      },
    ],
    actionPlan: [
      { id: 'ap1', text: 'Complete 3 case formulations using the Persons model', isCompleted: true, createdAt: '2025-12-15' },
      { id: 'ap2', text: 'Read "Cognitive Behavior Therapy: Basics and Beyond" chapters 1\u20136', isCompleted: true, createdAt: '2025-12-15' },
      { id: 'ap3', text: 'Practice Socratic questioning with 5 different scenarios', isCompleted: false, createdAt: '2026-01-05' },
      { id: 'ap4', text: 'Prepare a mock supervision session recording', isCompleted: false, createdAt: '2026-01-19' },
      { id: 'ap5', text: 'Draft private practice business plan outline', isCompleted: false, createdAt: '2026-01-19' },
    ],
    legalAgreed: true,
  },
  {
    id: 'am-2',
    mentorId: 'mentor-1',
    menteeId: 'mentee-4',
    menteeName: 'Rohan Iyer',
    menteeAvatar: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwc3ljaG9sb2dpc3QlMjBjb25maWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA5NzI3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    menteeCareerStage: 'Post-grad',
    mentorName: 'Dr. Meera Kapoor',
    mentorAvatar: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGRvY3RvciUyMG1hdHVyZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwY2xpbmljfGVufDF8fHx8MTc3MDk3Mjc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    goal: 'Explore neuropsychological rehabilitation research opportunities.',
    frequency: 'Monthly',
    commitment: '6 Months',
    status: 'Active',
    startDate: '2025-11-01',
    sessions: [
      {
        id: 's5',
        sessionNumber: 1,
        date: '2025-11-15',
        time: '7:00 PM',
        notes: 'Discussed research interests and potential thesis directions. Identified 3 key labs to explore.',
        actionItems: ['Review lab publications', 'Draft research proposal outline'],
        status: 'Completed',
      },
    ],
    actionPlan: [
      { id: 'ap6', text: 'Review 10 recent papers on cognitive rehabilitation', isCompleted: true, createdAt: '2025-11-15' },
      { id: 'ap7', text: 'Draft research proposal for thesis', isCompleted: false, createdAt: '2025-11-15' },
    ],
    legalAgreed: true,
  },
];

/* ── Completed Mentorships ── */

export const MOCK_COMPLETED_MENTORSHIPS: ActiveMentorship[] = [
  {
    id: 'cm-1',
    mentorId: 'mentor-1',
    menteeId: 'mentee-5',
    menteeName: 'Sanya Gupta',
    menteeAvatar: 'https://images.unsplash.com/photo-1765248148309-69d900a5bc17?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwY2xpbmljYWwlMjBwc3ljaG9sb2dpc3QlMjBwcm9mZXNzaW9uYWwlMjBzdHVkaW98ZW58MXx8fHwxNzcwOTg0MTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    menteeCareerStage: 'Early Career',
    mentorName: 'Dr. Meera Kapoor',
    mentorAvatar: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGRvY3RvciUyMG1hdHVyZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwY2xpbmljfGVufDF8fHx8MTc3MDk3Mjc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    goal: 'Build foundational CBT skills for anxiety disorders.',
    frequency: 'Biweekly',
    commitment: '3 Months',
    status: 'Completed',
    startDate: '2025-06-01',
    endDate: '2025-08-30',
    sessions: [],
    actionPlan: [],
    legalAgreed: true,
  },
];

/* ── Helper ── */

export function getMentorById(id: string): Mentor | undefined {
  return MOCK_MENTORS.find(m => m.id === id);
}
