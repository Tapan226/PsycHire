export type ReferralUrgency = 'Immediate' | 'Scheduled' | 'Exploratory';
export type ReferralStatus = 'Open' | 'Matched' | 'Closed' | 'Expired';
export type ReferralMode = 'Remote' | 'In-person' | 'Hybrid';
export type ExperienceLevel = 'Student' | 'Early Career' | 'Mid-level' | 'Senior' | 'Expert';
export type ReferralListingStatus = 'draft' | 'pending_review' | 'active' | 'matched' | 'closed' | 'rejected' | 'changes_requested' | 'expired';

export interface ReferralPerson {
  name: string;
  role: 'Student' | 'Professional' | 'Company' | 'Admin';
}

export interface ReferralClient {
  name: string;
  industry?: string;
  description?: string;
  website?: string;
}

export interface Referral {
  id: string;
  title: string;
  specialization: string;
  location: string;
  urgency: ReferralUrgency;
  deadline: string;
  status: ReferralStatus;
  postedBy: ReferralPerson;
  postedDate: string;
  studentEligible: boolean;
  respondents: number;
  // Optional detail fields
  domain?: string;
  duration?: string;
  prerequisites?: string[];
  clientSummary?: string;
  client?: ReferralClient;
  experienceLevel?: ExperienceLevel;
  language?: string;
  population?: string;
  mode?: ReferralMode;
  // Ownership flags
  isCreatedByMe?: boolean;
  isRespondedByMe?: boolean;
}

export const SPECIALIZATIONS = [
  'Child & Adolescent Therapy', 'Substance Abuse', 'Trauma & PTSD',
  'Cognitive Behavioral Therapy', 'Family Therapy', 'Psychometric Assessment',
  'Organizational Development', 'Career Counseling', 'Grief Counseling',
  'Neuropsychological Testing', 'Sports Performance', 'Academic Research',
  'Clinical Psychology', 'Counselling Psychology', 'Developmental Psychology',
];

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Student', 'Early Career', 'Mid-level', 'Senior', 'Expert',
];

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'ref-1',
    title: 'Child psychologist needed for developmental assessment',
    specialization: 'Child & Adolescent Therapy',
    location: 'Mumbai, MH',
    urgency: 'Immediate',
    deadline: '2026-02-18',
    status: 'Open',
    postedBy: { name: 'Dr. Meera Sharma', role: 'Professional' },
    postedDate: '2026-02-09',
    studentEligible: false,
    respondents: 3,
    domain: 'Clinical Psychology',
    duration: '3 sessions over 2 weeks',
    prerequisites: ['RCI-licensed', '2+ years with children', 'English & Hindi fluency'],
    client: {
      name: 'MindCare Clinic',
      industry: 'Pediatric Mental Health',
      description: 'A leading pediatric mental health center in Mumbai providing comprehensive developmental assessments and therapeutic interventions for children.',
      website: 'www.mindcareclinic.com',
    },
    experienceLevel: 'Mid-level',
    mode: 'In-person',
  },
  {
    id: 'ref-2',
    title: 'Trauma-focused internship supervisor needed',
    specialization: 'Trauma & PTSD',
    location: 'Bangalore, KA',
    urgency: 'Scheduled',
    deadline: '2026-03-15',
    status: 'Open',
    postedBy: { name: 'Dr. Rajesh Iyer', role: 'Professional' },
    postedDate: '2026-02-10',
    studentEligible: true,
    respondents: 1,
    domain: 'Clinical Psychology',
    duration: '6 months',
    client: {
      name: 'St. Martha\'s Hospital',
      industry: 'Hospital & Healthcare',
      description: 'A multi-specialty hospital with a dedicated psychiatry department offering supervised clinical placements for psychology trainees.',
    },
    experienceLevel: 'Student',
    mode: 'Hybrid',
    language: 'English, Kannada',
    population: 'Adolescents & Adults',
    prerequisites: ['Psychology student (final year or postgraduate)', 'Basic understanding of trauma-informed care'],
  },
  {
    id: 'ref-3',
    title: 'CBT specialist for adult anxiety case',
    specialization: 'Cognitive Behavioral Therapy',
    location: 'Remote',
    urgency: 'Scheduled',
    deadline: '2026-03-01',
    status: 'Open',
    postedBy: { name: 'Dr. Rajesh Iyer', role: 'Professional' },
    postedDate: '2026-02-08',
    studentEligible: false,
    respondents: 5,
    domain: 'Counselling Psychology',
    duration: '12 sessions over 3 months',
    prerequisites: ['CBT certification', 'Licensed practitioner', '3+ years experience'],
    client: {
      name: 'Serenity Health',
      industry: 'Teletherapy & Digital Health',
      description: 'An online mental health platform connecting licensed therapists with clients seeking evidence-based care.',
      website: 'www.serenityhealth.in',
    },
    experienceLevel: 'Senior',
    mode: 'Remote',
  },
  {
    id: 'ref-4',
    title: 'Shadowing opportunity at family therapy clinic',
    specialization: 'Family Therapy',
    location: 'Pune, MH',
    urgency: 'Exploratory',
    deadline: '2026-04-01',
    status: 'Open',
    postedBy: { name: 'Dr. Priya Nair', role: 'Professional' },
    postedDate: '2026-02-07',
    studentEligible: true,
    respondents: 8,
    duration: '3 months',
    prerequisites: ['Psychology student (final year or above)'],
    client: {
      name: 'Nair Family Therapy Centre',
      industry: 'Family & Couples Counseling',
      description: 'A private practice specializing in systemic family therapy, couples counseling, and mediation services.',
    },
    experienceLevel: 'Student',
    mode: 'In-person',
    language: 'English, Marathi',
    population: 'Families & Couples',
  },
  {
    id: 'ref-5',
    title: 'Neuropsychological testing — post-TBI evaluation',
    specialization: 'Neuropsychological Testing',
    location: 'Delhi, NCR',
    urgency: 'Immediate',
    deadline: '2026-02-16',
    status: 'Open',
    postedBy: { name: 'Dr. Arjun Mehta', role: 'Professional' },
    postedDate: '2026-02-10',
    studentEligible: false,
    respondents: 1,
    domain: 'Neuropsychology',
    duration: '2 sessions',
    prerequisites: ['RCI-licensed', 'Neuropsych testing certification', 'Experience with TBI'],
    client: {
      name: 'NeuroCare Institute',
      industry: 'Neurology & Rehabilitation',
      description: 'A specialized neurorehabilitation center providing comprehensive assessment and recovery programs for patients with brain injuries.',
      website: 'www.neurocareinstitute.in',
    },
    experienceLevel: 'Expert',
    mode: 'In-person',
  },
  {
    id: 'ref-6',
    title: 'Organizational psychologist for team diagnostic',
    specialization: 'Organizational Development',
    location: 'Hyderabad, TS',
    urgency: 'Scheduled',
    deadline: '2026-03-10',
    status: 'Open',
    postedBy: { name: 'Vikram Desai', role: 'Professional' },
    postedDate: '2026-02-06',
    studentEligible: false,
    respondents: 2,
    duration: '4 weeks',
    prerequisites: ['5+ years I/O experience', 'Psychometric tool proficiency'],
    client: {
      name: 'TechNova Solutions Pvt. Ltd.',
      industry: 'Information Technology',
      description: 'A mid-size IT product company looking to improve team dynamics and reduce attrition in their product engineering division.',
      website: 'www.technovasolutions.com',
    },
    experienceLevel: 'Senior',
    mode: 'Hybrid',
  },
  {
    id: 'ref-7',
    title: 'Career counselor for university program',
    specialization: 'Career Counseling',
    location: 'Ahmedabad, GJ',
    urgency: 'Exploratory',
    deadline: '2026-04-15',
    status: 'Open',
    postedBy: { name: 'Dr. Sneha Patel', role: 'Professional' },
    postedDate: '2026-02-05',
    studentEligible: false,
    respondents: 0,
    duration: 'Ongoing (semester-based)',
    client: {
      name: 'Gujarat University',
      industry: 'Higher Education',
      description: 'The university\'s student services department is seeking a career counselor to guide final-year psychology students on postgraduate and career pathways.',
    },
    experienceLevel: 'Mid-level',
    mode: 'In-person',
  },
  {
    id: 'ref-8',
    title: 'Grief counseling co-facilitator for bereavement group',
    specialization: 'Grief Counseling',
    location: 'Kochi, KL',
    urgency: 'Scheduled',
    deadline: '2026-03-20',
    status: 'Open',
    postedBy: { name: 'Dr. Kavitha Menon', role: 'Professional' },
    postedDate: '2026-02-04',
    studentEligible: false,
    respondents: 2,
    duration: '8 sessions over 2 months',
    prerequisites: ['Grief/loss specialization', 'Group facilitation experience'],
    client: {
      name: 'Kochi Community Health Centre',
      industry: 'Community Healthcare',
      description: 'A government-supported community health center running ongoing bereavement support groups for residents.',
    },
    experienceLevel: 'Mid-level',
    mode: 'In-person',
  },
  // "My Referrals" — created by current user (Professional view)
  {
    id: 'ref-9',
    title: 'Substance abuse counselor for de-addiction center',
    specialization: 'Substance Abuse',
    location: 'Delhi, NCR',
    urgency: 'Immediate',
    deadline: '2026-02-20',
    status: 'Matched',
    postedBy: { name: 'Dr. Arjun Mehta', role: 'Professional' },
    postedDate: '2026-01-28',
    studentEligible: false,
    respondents: 4,
    duration: '6 months contract',
    prerequisites: ['RCI-licensed', 'Addiction counseling training'],
    client: {
      name: 'Hope De-Addiction Centre',
      industry: 'Addiction & Recovery',
      description: 'An inpatient facility specializing in alcohol and substance dependence treatment, detoxification, and relapse prevention programs.',
    },
    experienceLevel: 'Mid-level',
    mode: 'In-person',
    isCreatedByMe: true,
  },
  // "My Referrals" — responded to by current user
  {
    id: 'ref-10',
    title: 'Sports psychologist for national athlete program',
    specialization: 'Sports Performance',
    location: 'Hyderabad, TS',
    urgency: 'Scheduled',
    deadline: '2026-03-25',
    status: 'Open',
    postedBy: { name: 'Dr. Vikram Desai', role: 'Professional' },
    postedDate: '2026-02-03',
    studentEligible: false,
    respondents: 1,
    duration: '1 year',
    client: {
      name: 'National Sports Federation of India',
      industry: 'Sports & Athletics',
      description: 'The national federation is building a sports psychology support program for elite athletes across multiple disciplines.',
    },
    experienceLevel: 'Senior',
    mode: 'In-person',
    isRespondedByMe: true,
  },
  {
    id: 'ref-11',
    title: 'Psychometric assessor for school screening',
    specialization: 'Psychometric Assessment',
    location: 'Mumbai, MH',
    urgency: 'Exploratory',
    deadline: '2026-03-30',
    status: 'Open',
    postedBy: { name: 'Dr. Meera Sharma', role: 'Professional' },
    postedDate: '2026-02-08',
    studentEligible: true,
    respondents: 2,
    duration: '2 weeks',
    experienceLevel: 'Student',
    mode: 'In-person',
    language: 'English, Hindi',
    population: 'Children (ages 6-12)',
    client: {
      name: 'Sunrise International School',
      industry: 'Education',
      description: 'A CBSE-affiliated primary school seeking psychometric screenings for students to identify learning difficulties and developmental concerns.',
    },
    prerequisites: ['Enrolled in psychology program', 'Basic psychometrics coursework completed'],
    isRespondedByMe: true,
  },
  // Closed referrals
  {
    id: 'ref-12',
    title: 'School counselor for inclusive education program',
    specialization: 'Child & Adolescent Therapy',
    location: 'Pune, MH',
    urgency: 'Scheduled',
    deadline: '2026-01-15',
    status: 'Closed',
    postedBy: { name: 'Dr. Priya Nair', role: 'Professional' },
    postedDate: '2025-12-10',
    studentEligible: false,
    respondents: 7,
    client: {
      name: 'Pune Inclusive Education Trust',
      industry: 'Education & NGO',
    },
  },
  {
    id: 'ref-13',
    title: 'Research assistant for longitudinal study',
    specialization: 'Academic Research',
    location: 'Remote',
    urgency: 'Exploratory',
    deadline: '2026-01-20',
    status: 'Expired',
    postedBy: { name: 'Dr. Rajesh Iyer', role: 'Professional' },
    postedDate: '2025-12-15',
    studentEligible: true,
    respondents: 3,
    client: {
      name: 'NIMHANS Research Division',
      industry: 'Research & Academia',
    },
  },
];