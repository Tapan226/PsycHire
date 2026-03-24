// Profile Data Types & Mock Data — Students + Professionals

export type UserGroup = 'Student' | 'Professional' | 'Company' | 'Admin' | 'Expert';

// Student career stages
export type StudentCareerStage = 'Aspiring' | 'Undergrad' | 'Post-grad' | 'Early Career' | 'Licensed';

// Professional career stages
export type ProfessionalCareerStage = 'Early' | 'Mid' | 'Supervisor' | 'Expert' | 'Founder';

// Union type for all career stages
export type CareerStage = StudentCareerStage | ProfessionalCareerStage;

export type VerificationStatus = 'Verified' | 'Pending' | 'Unverified';

export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
  status: 'Ongoing' | 'Completed';
}

export interface ExperienceEntry {
  id: string;
  title: string;
  organization: string;
  duration: string;
  description: string;
  type: 'Work' | 'Research' | 'Volunteering' | 'CSR';
}

export interface RecognitionEntry {
  id: string;
  title: string;
  issuer: string;
  year: string;
  type: 'Certification' | 'Achievement' | 'Award';
}

export interface SupervisionInfo {
  hoursCompleted: number;
  supervisorName?: string;
  feedbackNotes?: string;
}

// ─── Professional-Specific Types ─────────────────────────────

export interface PublicationEntry {
  id: string;
  title: string;
  journal: string;
  year: string;
  coAuthors?: string;
  doi?: string;
}

export interface TalkEntry {
  id: string;
  title: string;
  event: string;
  year: string;
  type: 'Talk' | 'Workshop' | 'Keynote' | 'Panel';
}

export interface SupervisionGivenInfo {
  totalHoursGiven: number;
  activeSupervisees: number;
  certificatesIssued: number;
}

export interface MentoringInfo {
  isRegisteredMentor: boolean;
  activeMentees: number;
  totalMentored: number;
}

// ─── Profile Interface (unified) ─────────────────────────────

export interface StudentProfile {
  // Header
  fullName: string;
  avatarUrl: string;
  userGroup: UserGroup;
  careerStage: CareerStage;
  location: string;
  verificationStatus: VerificationStatus;

  // About
  bio: string;
  careerVision: string;

  // Education
  education: EducationEntry[];

  // Specialization & Focus
  specializations: string[];
  populationOfInterest: string;
  languages: string[];

  // Open To
  openTo: string[];

  // Availability & Preferences
  availabilityHours: number;
  relocationReady: boolean;
  preferredWorkMode: WorkMode;

  // Supervision (received — student)
  supervision: SupervisionInfo;

  // Experience & Portfolio
  cvUploaded: boolean;
  cvFileName?: string;
  experience: ExperienceEntry[];

  // Recognition
  recognition: RecognitionEntry[];

  // ─── Professional-Only Fields ────────────────────────────
  costPerHour?: number;
  currency?: string;
  offerSupervision?: boolean;
  offerMentoring?: boolean;
  publications?: PublicationEntry[];
  talks?: TalkEntry[];
  supervisionGiven?: SupervisionGivenInfo;
  mentoring?: MentoringInfo;
  licenseNumber?: string;
  yearsOfExperience?: number;
}

// ─── Open To Options ─────────────────────────────────────────

export const STUDENT_OPEN_TO_OPTIONS = [
  'Internships',
  'Fellowships',
  'Research & Publications',
  'Micro-projects / Pilots',
  'Supervision',
  'Mentoring',
  'Courses',
  'Events',
  'Volunteering / CSR',
];

export const PROFESSIONAL_OPEN_TO_OPTIONS = [
  'Lead Projects',
  'Offer Supervision',
  'Offer Mentoring',
  'Research Collaboration',
  'Consulting',
  'Workshops & Talks',
  'Hiring',
  'Pro Bono / CSR',
  'Events & Conferences',
];

// Keep backward compat
export const OPEN_TO_OPTIONS = STUDENT_OPEN_TO_OPTIONS;

export function getOpenToOptions(userGroup: UserGroup): string[] {
  return userGroup === 'Professional' ? PROFESSIONAL_OPEN_TO_OPTIONS : STUDENT_OPEN_TO_OPTIONS;
}

// ─── Student Mock ────────────────────────────────────────────

export const mockProfile: StudentProfile = {
  fullName: 'Jane Doe',
  avatarUrl: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHBzeWNob2xvZ3l8ZW58MXx8fHwxNzcwMTA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  userGroup: 'Student',
  careerStage: 'Post-grad',
  location: 'Mumbai, India',
  verificationStatus: 'Verified',

  bio: 'Psychology post-graduate passionate about child development and community mental health. Eager to contribute to evidence-based interventions.',
  careerVision: 'To become a licensed child psychologist working with underserved communities.',

  education: [
    {
      id: 'edu-1',
      degree: 'M.A. Clinical Psychology',
      institution: 'Tata Institute of Social Sciences (TISS)',
      year: '2024 – 2026',
      status: 'Ongoing',
    },
    {
      id: 'edu-2',
      degree: 'B.A. Psychology (Honours)',
      institution: 'St. Xavier\'s College, Mumbai',
      year: '2021 – 2024',
      status: 'Completed',
    },
  ],

  specializations: ['Child Psychology', 'Community Mental Health', 'CBT'],
  populationOfInterest: 'Children & Adolescents',
  languages: ['English', 'Hindi', 'Marathi'],

  openTo: [
    'Internships',
    'Research & Publications',
    'Mentoring',
    'Volunteering / CSR',
  ],

  availabilityHours: 20,
  relocationReady: true,
  preferredWorkMode: 'Hybrid',

  supervision: {
    hoursCompleted: 120,
    supervisorName: 'Dr. Meera Kapoor',
    feedbackNotes: 'Shows strong empathy and analytical skills. Recommended for advanced clinical training.',
  },

  cvUploaded: true,
  cvFileName: 'Jane_Doe_CV_2026.pdf',
  experience: [
    {
      id: 'exp-1',
      title: 'Clinical Intern',
      organization: 'MindCare Clinic, Mumbai',
      duration: 'Jun 2025 – Present',
      description: 'Conducting intake assessments, co-facilitating group therapy sessions for adolescents, and assisting in psychometric testing under supervision.',
      type: 'Work',
    },
    {
      id: 'exp-2',
      title: 'Research Assistant',
      organization: 'TISS – Dept. of Applied Psychology',
      duration: 'Jan 2025 – May 2025',
      description: 'Contributed to a study on screen time and adolescent well-being. Managed data collection and literature review.',
      type: 'Research',
    },
    {
      id: 'exp-3',
      title: 'Volunteer Counselor',
      organization: 'iCall – Psychosocial Helpline',
      duration: 'Aug 2024 – Dec 2024',
      description: 'Provided telephonic counseling support to individuals experiencing stress, anxiety, and relationship difficulties.',
      type: 'Volunteering',
    },
  ],

  recognition: [
    {
      id: 'rec-1',
      title: 'Youth Mental Health First Aid',
      issuer: 'Mental Health Foundation of India',
      year: '2025',
      type: 'Certification',
    },
    {
      id: 'rec-2',
      title: 'Best Paper Presentation',
      issuer: 'National Psychology Students Conference',
      year: '2025',
      type: 'Award',
    },
    {
      id: 'rec-3',
      title: 'Dean\'s List – Academic Excellence',
      issuer: 'St. Xavier\'s College',
      year: '2023',
      type: 'Achievement',
    },
  ],
};

// ─── Professional Mock ───────────────────────────────────────

export const mockProfessionalProfile: StudentProfile = {
  fullName: 'Dr. Arjun Mehta',
  avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBibGF6ZXIlMjBjb25maWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzA3MTA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  userGroup: 'Professional',
  careerStage: 'Supervisor',
  location: 'Bangalore, India',
  verificationStatus: 'Verified',

  bio: 'Licensed clinical psychologist with 12+ years of experience in cognitive-behavioral therapy and trauma-focused interventions. RCI-licensed supervisor passionate about training the next generation of clinicians.',
  careerVision: 'Building accessible, evidence-based mental health infrastructure across India through training, research, and community partnerships.',

  education: [
    {
      id: 'edu-1',
      degree: 'Ph.D. Clinical Psychology',
      institution: 'NIMHANS, Bangalore',
      year: '2016 – 2020',
      status: 'Completed',
    },
    {
      id: 'edu-2',
      degree: 'M.Phil. Clinical Psychology',
      institution: 'NIMHANS, Bangalore',
      year: '2014 – 2016',
      status: 'Completed',
    },
    {
      id: 'edu-3',
      degree: 'M.A. Applied Psychology',
      institution: 'University of Mumbai',
      year: '2012 – 2014',
      status: 'Completed',
    },
  ],

  specializations: ['CBT', 'Trauma & PTSD', 'Clinical Supervision', 'Neuropsychological Assessment'],
  populationOfInterest: 'Adults & Adolescents',
  languages: ['English', 'Hindi', 'Kannada'],

  openTo: [
    'Offer Supervision',
    'Offer Mentoring',
    'Research Collaboration',
    'Workshops & Talks',
    'Consulting',
  ],

  availabilityHours: 35,
  relocationReady: false,
  preferredWorkMode: 'Hybrid',

  supervision: {
    hoursCompleted: 2400,
    supervisorName: 'Prof. S. Ramanathan (Doctoral)',
    feedbackNotes: 'Completed doctoral supervision with distinction. Strong methodological rigor and clinical acumen.',
  },

  cvUploaded: true,
  cvFileName: 'Dr_Arjun_Mehta_CV_2026.pdf',
  experience: [
    {
      id: 'exp-1',
      title: 'Senior Clinical Psychologist',
      organization: 'Serenity Health, Bangalore',
      duration: 'Jan 2021 – Present',
      description: 'Leading a team of 6 psychologists providing CBT, DBT, and EMDR-based interventions. Supervising junior clinicians and M.Phil. trainees.',
      type: 'Work',
    },
    {
      id: 'exp-2',
      title: 'Principal Investigator',
      organization: 'NIMHANS – Dept. of Clinical Psychology',
      duration: '2022 – 2024',
      description: 'Led a multi-site RCT on digital CBT for treatment-resistant depression in young adults. Published in the Indian Journal of Psychiatry.',
      type: 'Research',
    },
    {
      id: 'exp-3',
      title: 'Consultant Psychologist',
      organization: 'Hope Foundation NGO',
      duration: '2019 – 2021',
      description: 'Designed community mental health programs in rural Karnataka. Trained 50+ community health workers in psychological first aid.',
      type: 'Volunteering',
    },
  ],

  recognition: [
    {
      id: 'rec-1',
      title: 'RCI Licensed Clinical Psychologist',
      issuer: 'Rehabilitation Council of India',
      year: '2016',
      type: 'Certification',
    },
    {
      id: 'rec-2',
      title: 'Excellence in Clinical Supervision Award',
      issuer: 'Indian Association of Clinical Psychologists',
      year: '2024',
      type: 'Award',
    },
    {
      id: 'rec-3',
      title: 'EMDR Level II Practitioner',
      issuer: 'EMDR India',
      year: '2021',
      type: 'Certification',
    },
    {
      id: 'rec-4',
      title: 'Young Researcher Award',
      issuer: 'NIMHANS Foundation',
      year: '2020',
      type: 'Award',
    },
  ],

  // Professional-specific fields
  costPerHour: 2500,
  currency: 'INR',
  offerSupervision: true,
  offerMentoring: true,
  licenseNumber: 'RCI/CLP/2016/4523',
  yearsOfExperience: 12,

  publications: [
    {
      id: 'pub-1',
      title: 'Digital CBT for Treatment-Resistant Depression: A Multi-Site RCT',
      journal: 'Indian Journal of Psychiatry',
      year: '2024',
      coAuthors: 'Sharma P., Iyer K., Das S.',
      doi: '10.4103/ijp.2024.0124',
    },
    {
      id: 'pub-2',
      title: 'Effectiveness of Community Health Worker Training in Rural Mental Health',
      journal: 'Asian Journal of Psychology',
      year: '2022',
      coAuthors: 'Reddy M., Gupta A.',
    },
    {
      id: 'pub-3',
      title: 'Neuropsychological Correlates of Childhood Trauma in Indian Adolescents',
      journal: 'Journal of Clinical Child Psychology',
      year: '2020',
    },
  ],

  talks: [
    {
      id: 'talk-1',
      title: 'Building Scalable Supervision Models for India',
      event: 'IACP National Conference 2025',
      year: '2025',
      type: 'Keynote',
    },
    {
      id: 'talk-2',
      title: 'EMDR for Complex Trauma: A Practical Workshop',
      event: 'PsycHIRE Learning Festival',
      year: '2024',
      type: 'Workshop',
    },
    {
      id: 'talk-3',
      title: 'Ethics in Digital Mental Health Interventions',
      event: 'WHO South-East Asia Regional Meet',
      year: '2023',
      type: 'Panel',
    },
  ],

  supervisionGiven: {
    totalHoursGiven: 860,
    activeSupervisees: 4,
    certificatesIssued: 12,
  },

  mentoring: {
    isRegisteredMentor: true,
    activeMentees: 3,
    totalMentored: 18,
  },
};

// ─── Profile Completion (works for both) ─────────────────────

export function calculateProfileCompletion(profile: StudentProfile): {
  percentage: number;
  missingSections: string[];
} {
  const baseSections = [
    { name: 'Profile Photo', filled: !!profile.avatarUrl },
    { name: 'Bio', filled: !!profile.bio },
    { name: 'Career Vision', filled: !!profile.careerVision },
    { name: 'Education', filled: profile.education.length > 0 },
    { name: 'Specializations', filled: profile.specializations.length > 0 },
    { name: 'Open To (Intent)', filled: profile.openTo.length > 0 },
    { name: 'Availability', filled: profile.availabilityHours > 0 },
    { name: 'Experience', filled: profile.experience.length > 0 },
    { name: 'CV Upload', filled: profile.cvUploaded },
    { name: 'Recognition', filled: profile.recognition.length > 0 },
  ];

  // Professional users have additional sections
  const professionalSections = profile.userGroup === 'Professional' ? [
    { name: 'Publications', filled: (profile.publications || []).length > 0 },
    { name: 'Talks & Workshops', filled: (profile.talks || []).length > 0 },
    { name: 'Cost per Hour', filled: (profile.costPerHour || 0) > 0 },
  ] : [];

  const sections = [...baseSections, ...professionalSections];
  const filled = sections.filter((s) => s.filled).length;
  const missing = sections.filter((s) => !s.filled).map((s) => s.name);

  return {
    percentage: Math.round((filled / sections.length) * 100),
    missingSections: missing,
  };
}