// --- Type Definitions ---

export type CourseType = 'Webinar' | 'Workshop' | 'Certification Course';

export type CourseSpecialization =
  | 'Clinical'
  | 'Counselling'
  | 'Developmental'
  | 'Social Psychology'
  | 'Industrial-Organizational'
  | 'Neuropsychology'
  | 'Sports Psychology'
  | 'Research'
  | 'Academia'
  | 'Others';

export const SPECIALIZATION_OPTIONS: CourseSpecialization[] = [
  'Clinical',
  'Counselling',
  'Developmental',
  'Social Psychology',
  'Industrial-Organizational',
  'Neuropsychology',
  'Sports Psychology',
  'Research',
  'Academia',
  'Others',
];

export type ProviderType =
  | 'University'
  | 'NGO'
  | 'Hospital'
  | 'Clinic'
  | 'Corporate'
  | 'Private Trainer'
  | 'Research Institute'
  | 'Other';

export type CourseMode = 'Online' | 'Offline' | 'Hybrid';

export type CourseFormat =
  | 'Self-paced'
  | 'Live online'
  | 'Workshop'
  | 'Webinar'
  | 'Seminar'
  | 'Bootcamp'
  | 'Retreat'
  | 'Course';

export type CourseDuration = 'Short' | 'Medium' | 'Long';

export type CourseFees = 'Free' | 'Paid' | 'Sponsored';

export type CourseOutcome = 'Degree' | 'Diploma' | 'Certificate' | 'E-Certificate' | 'Participation Only';

// Legacy compat
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export type AccreditationStatus = 'Accredited' | 'Pending' | 'Not Accredited';

export type CourseLanguage = 'English' | 'Hindi' | 'Tamil' | 'Kannada' | 'Telugu' | 'Bengali' | 'Marathi' | 'Other';

export type AssessmentMethod = 'Exam' | 'Assignment' | 'Project' | 'Viva' | 'Portfolio' | 'Attendance Only' | 'None';

export type CourseBadge = 'Accredited' | 'Most Popular' | 'Starting Soon' | 'Latest Added';

export type EnrollmentStatus = 'Open' | 'Filling Up Soon' | 'Closed' | 'Upcoming';

export const LEVEL_OPTIONS: CourseLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
export const ACCREDITATION_OPTIONS: AccreditationStatus[] = ['Accredited', 'Pending', 'Not Accredited'];
export const LANGUAGE_OPTIONS: CourseLanguage[] = ['English', 'Hindi', 'Tamil', 'Kannada', 'Telugu', 'Bengali', 'Marathi', 'Other'];
export const ASSESSMENT_METHOD_OPTIONS: AssessmentMethod[] = ['Exam', 'Assignment', 'Project', 'Viva', 'Portfolio', 'Attendance Only', 'None'];
export const DURATION_OPTIONS: { value: CourseDuration; label: string }[] = [
  { value: 'Short', label: 'Short (≤ 2 weeks)' },
  { value: 'Medium', label: 'Medium (1–3 months)' },
  { value: 'Long', label: 'Long (3+ months)' },
];
export const FEES_OPTIONS: CourseFees[] = ['Free', 'Paid', 'Sponsored'];
export const OUTCOME_OPTIONS: CourseOutcome[] = ['Degree', 'Diploma', 'Certificate', 'E-Certificate', 'Participation Only'];
export const COURSE_TYPE_OPTIONS: CourseType[] = ['Webinar', 'Workshop', 'Certification Course'];
export const MODE_OPTIONS: CourseMode[] = ['Online', 'Offline', 'Hybrid'];
export const FORMAT_OPTIONS: CourseFormat[] = ['Self-paced', 'Live online', 'Workshop', 'Webinar', 'Seminar', 'Bootcamp', 'Retreat', 'Course'];
export const PROVIDER_TYPE_OPTIONS: ProviderType[] = ['University', 'NGO', 'Hospital', 'Clinic', 'Corporate', 'Private Trainer', 'Research Institute', 'Other'];

export interface Course {
  id: string;
  title: string;
  provider: {
    name: string;
    logoUrl: string;
  };
  // Filter dimensions
  courseType: CourseType;
  specializations: CourseSpecialization[];
  providerType: ProviderType;
  mode: CourseMode;
  courseFormat: CourseFormat;
  durationCategory: CourseDuration;
  fees: CourseFees;
  outcomes: CourseOutcome[];
  // Display fields
  category: string;
  specialization: string;
  level: CourseLevel;
  duration: string;
  format: string;
  location?: string;
  price: number;
  currency: string;
  isFree: boolean;
  tags: string[];
  description: string;
  targetAudience: string;
  prerequisites?: string;
  learningOutcomes: string[];
  instructor?: {
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
  };
  additionalInstructors?: { name: string; title: string }[];
  externalUrl: string;
  platformName: string;
  isFeatured?: boolean;
  isSaved?: boolean;
  // New fields
  badge?: CourseBadge;
  accreditationStatus?: AccreditationStatus;
  language?: CourseLanguage;
  assessmentMethod?: AssessmentMethod;
  maxParticipants?: number;
  earlyBirdDiscount?: string;
  paymentPlans?: string;
  sponsorship?: string;
  brochureUrl?: string;
  lastDateToApply?: string;
  enrollmentStatus?: EnrollmentStatus;
  // Enrollment tracking fields
  isEnrolled?: boolean;
  isCompleted?: boolean;
  enrollmentDate?: string;
  completionDate?: string;
  progress?: number; // 0-100
  rating?: number; // user's rating (1-5)
  // Aggregate ratings
  avgRating?: number;
  totalRatings?: number;
  totalEnrolled?: number;
  // Curriculum
  curriculum?: { week: number; title: string; topics: string[] }[];
  schedule?: string;
  startDate?: string;
  endDate?: string;
}

// --- Mock Data ---

export const courses: Course[] = [
  {
    id: 'c1',
    title: 'Introduction to Clinical Psychology',
    provider: {
      name: 'Stanford University',
      logoUrl: 'https://images.unsplash.com/photo-1637433496890-ee4eb1aecf4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYnVpbGRpbmclMjBtb2Rlcm58ZW58MXx8fHwxNzY5NTk2MzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Certification Course',
    specializations: ['Clinical'],
    providerType: 'University',
    mode: 'Online',
    courseFormat: 'Self-paced',
    durationCategory: 'Medium',
    fees: 'Free',
    outcomes: ['Certificate'],
    category: 'Clinical',
    specialization: 'General Clinical Practice',
    level: 'Beginner',
    duration: '8 weeks',
    format: 'Online',
    price: 0,
    currency: 'USD',
    isFree: true,
    tags: ['Self-paced', 'Certificate'],
    description: 'This course provides a comprehensive overview of clinical psychology, covering the history, major theories, and evidence-based practices used in the field.',
    targetAudience: 'Undergraduate students, career switchers, and healthcare enthusiasts.',
    learningOutcomes: [
      'Understand the history and scope of clinical psychology',
      'Identify major mental health disorders and diagnostic criteria',
      'Explain evidence-based therapeutic interventions',
      'Analyze ethical considerations in clinical practice'
    ],
    instructor: {
      name: 'Dr. Sarah Jenkins',
      title: 'Professor of Psychology',
      bio: 'Dr. Jenkins is a licensed clinical psychologist with over 15 years of experience.',
      imageUrl: 'https://images.unsplash.com/photo-1758685734503-58a8accc24e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwcHJvZmVzc29yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY5NTk2MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    externalUrl: 'https://coursera.org',
    platformName: 'Coursera',
    isFeatured: true,
    isSaved: true,
    badge: 'Accredited',
    accreditationStatus: 'Accredited',
    language: 'English',
    assessmentMethod: 'Assignment',
    maxParticipants: 500,
    lastDateToApply: 'March 30, 2026',
    enrollmentStatus: 'Open',
    avgRating: 4.7,
    totalRatings: 312,
    totalEnrolled: 480,
  },
  {
    id: 'c2',
    title: 'Advanced Cognitive Behavioral Therapy',
    provider: {
      name: 'Beck Institute',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY5NTk2MzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Workshop',
    specializations: ['Clinical', 'Counselling'],
    providerType: 'Research Institute',
    mode: 'Offline',
    courseFormat: 'Workshop',
    durationCategory: 'Short',
    fees: 'Paid',
    outcomes: ['Certificate'],
    category: 'Therapy',
    specialization: 'CBT',
    level: 'Advanced',
    duration: '4 days',
    format: 'Offline',
    location: 'Philadelphia, PA',
    price: 899,
    currency: 'USD',
    isFree: false,
    tags: ['Workshop', 'CE Credits'],
    description: 'An intensive workshop for licensed mental health professionals who want to deepen their understanding and application of CBT.',
    targetAudience: 'Licensed psychologists, social workers, and counselors.',
    prerequisites: "Master's degree in a mental health field and basic CBT training.",
    learningOutcomes: [
      'Apply advanced CBT techniques to complex cases',
      'Troubleshoot common challenges in therapy',
      'Develop personalized case conceptualizations',
      'Enhance therapeutic alliance skills'
    ],
    externalUrl: 'https://beckinstitute.org',
    platformName: 'Beck Institute',
    isFeatured: true,
    badge: 'Most Popular',
    accreditationStatus: 'Accredited',
    language: 'English',
    assessmentMethod: 'Viva',
    maxParticipants: 30,
    earlyBirdDiscount: '10% off before March 1',
    lastDateToApply: 'March 15, 2026',
    enrollmentStatus: 'Filling Up Soon',
    avgRating: 4.8,
    totalRatings: 45,
    totalEnrolled: 28,
  },
  {
    id: 'c3',
    title: 'Child Development & Psychology',
    provider: {
      name: 'Yale University',
      logoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsZWdlJTIwY2FtcHVzfGVufDF8fHx8fDE3Njk1OTYzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Webinar',
    specializations: ['Developmental'],
    providerType: 'University',
    mode: 'Online',
    courseFormat: 'Course',
    durationCategory: 'Medium',
    fees: 'Paid',
    outcomes: ['E-Certificate'],
    category: 'Developmental',
    specialization: 'Child Psychology',
    level: 'Intermediate',
    duration: '6 weeks',
    format: 'Online',
    price: 49,
    currency: 'USD',
    isFree: false,
    tags: ['Self-paced'],
    description: 'Explore the fascinating world of child development, from infancy through adolescence.',
    targetAudience: 'Parents, educators, and psychology students.',
    learningOutcomes: [
      'Describe key developmental milestones',
      'Understand attachment theory and its implications',
      'Identify factors influencing child behavior',
      'Apply developmental principles to real-world scenarios'
    ],
    externalUrl: 'https://coursera.org',
    platformName: 'Coursera',
    badge: 'Latest Added',
    accreditationStatus: 'Pending',
    language: 'English',
    assessmentMethod: 'Assignment',
    enrollmentStatus: 'Open',
    avgRating: 4.3,
    totalRatings: 89,
    totalEnrolled: 215,
  },
  {
    id: 'c4',
    title: 'Neuroscience of Mental Health',
    provider: {
      name: 'Johns Hopkins University',
      logoUrl: 'https://images.unsplash.com/photo-1592280771884-f36829705a63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc2Nob29sJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY5NTk2MzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Certification Course',
    specializations: ['Neuropsychology', 'Research'],
    providerType: 'University',
    mode: 'Online',
    courseFormat: 'Live online',
    durationCategory: 'Long',
    fees: 'Free',
    outcomes: ['Diploma', 'Certificate'],
    category: 'Neuroscience',
    specialization: 'Biological Psychology',
    level: 'Expert',
    duration: '10 weeks',
    format: 'Online',
    price: 0,
    currency: 'USD',
    isFree: true,
    tags: ['Research', 'Biology'],
    description: 'Dive deep into the biological underpinnings of mental health disorders, bridging neuroscience and clinical practice.',
    targetAudience: 'Medical students, psychiatry residents, and neuroscientists.',
    prerequisites: 'Basic knowledge of biology and psychology.',
    learningOutcomes: [
      'Explain the neural mechanisms of major psychiatric disorders',
      'Understand the mechanism of action of psychotropic medications',
      'Critically evaluate neuroscientific research',
      'Integrate biological findings with clinical presentation'
    ],
    externalUrl: 'https://coursera.org',
    platformName: 'Coursera',
    badge: 'Starting Soon',
    accreditationStatus: 'Accredited',
    language: 'English',
    assessmentMethod: 'Exam',
    maxParticipants: 200,
    brochureUrl: 'https://example.com/neuro-brochure.pdf',
    lastDateToApply: 'March 20, 2026',
    enrollmentStatus: 'Open',
    avgRating: 4.5,
    totalRatings: 178,
    totalEnrolled: 195,
  },
  {
    id: 'c5',
    title: 'Forensic Psychology Essentials',
    provider: {
      name: 'FutureLearn',
      logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3Njk1OTYzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Webinar',
    specializations: ['Clinical', 'Others'],
    providerType: 'Corporate',
    mode: 'Online',
    courseFormat: 'Self-paced',
    durationCategory: 'Short',
    fees: 'Paid',
    outcomes: ['E-Certificate'],
    category: 'Forensic',
    specialization: 'Criminal Psychology',
    level: 'Beginner',
    duration: '4 weeks',
    format: 'Online',
    price: 39,
    currency: 'GBP',
    isFree: false,
    tags: ['Short Course'],
    description: 'An introduction to the intersection of psychology and the legal system. Learn about criminal profiling, eyewitness testimony, and the role of psychologists in court.',
    targetAudience: 'Law students, true crime enthusiasts, and psychology majors.',
    learningOutcomes: [
      'Define the role of a forensic psychologist',
      'Understand the psychology of criminal behavior',
      'Evaluate the reliability of eyewitness testimony',
      'Discuss ethical issues in forensic practice'
    ],
    externalUrl: 'https://futurelearn.com',
    platformName: 'FutureLearn',
    language: 'English',
    assessmentMethod: 'Assignment',
    enrollmentStatus: 'Open',
    avgRating: 4.2,
    totalRatings: 67,
    totalEnrolled: 120,
  },
  {
    id: 'c6',
    title: 'Mindfulness-Based Stress Reduction Retreat',
    provider: {
      name: 'NIMHANS Wellness',
      logoUrl: 'https://images.unsplash.com/photo-1592280771884-f36829705a63?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc2Nob29sJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY5NTk2MzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Workshop',
    specializations: ['Counselling', 'Clinical'],
    providerType: 'Hospital',
    mode: 'Offline',
    courseFormat: 'Retreat',
    durationCategory: 'Short',
    fees: 'Paid',
    outcomes: ['Participation Only'],
    category: 'Wellness',
    specialization: 'Mindfulness & Well-being',
    level: 'Beginner',
    duration: '5 days',
    format: 'Offline',
    location: 'Bangalore, India',
    price: 15000,
    currency: 'INR',
    isFree: false,
    tags: ['Retreat', 'In-person'],
    description: 'A residential retreat combining mindfulness practices with clinical psychology frameworks for stress reduction and emotional regulation.',
    targetAudience: 'Mental health professionals and students seeking experiential learning.',
    learningOutcomes: [
      'Practice mindfulness-based stress reduction techniques',
      'Understand the neuroscience of mindfulness',
      'Apply mindfulness in clinical settings',
      'Develop a personal practice plan'
    ],
    externalUrl: 'https://nimhans.ac.in',
    platformName: 'NIMHANS',
    isFeatured: true,
    badge: 'Starting Soon',
    accreditationStatus: 'Accredited',
    language: 'English',
    assessmentMethod: 'Attendance Only',
    maxParticipants: 25,
    earlyBirdDiscount: '20% off before Feb 28',
    paymentPlans: '2 installments available',
    lastDateToApply: 'March 10, 2026',
    enrollmentStatus: 'Filling Up Soon',
    avgRating: 4.9,
    totalRatings: 23,
    totalEnrolled: 22,
  },
  {
    id: 'c7',
    title: 'I-O Psychology Bootcamp',
    provider: {
      name: 'PsychEdge Corp',
      logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBidWlsZGluZ3xlbnwxfHx8fDE3Njk1OTYzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Certification Course',
    specializations: ['Industrial-Organizational'],
    providerType: 'Corporate',
    mode: 'Hybrid',
    courseFormat: 'Bootcamp',
    durationCategory: 'Medium',
    fees: 'Sponsored',
    outcomes: ['Certificate', 'E-Certificate'],
    category: 'I-O Psychology',
    specialization: 'Workplace Psychology',
    level: 'Intermediate',
    duration: '6 weeks',
    format: 'Hybrid',
    price: 0,
    currency: 'INR',
    isFree: true,
    tags: ['Bootcamp', 'Sponsored'],
    description: 'An intensive bootcamp covering selection, training, leadership, and organizational development with real-world case studies from Indian corporates.',
    targetAudience: 'HR professionals, psychology graduates transitioning to I-O roles.',
    learningOutcomes: [
      'Conduct job analysis and competency mapping',
      'Design evidence-based selection systems',
      'Understand organizational culture diagnostics',
      'Apply psychometric principles in HR contexts'
    ],
    externalUrl: 'https://psychedge.in',
    platformName: 'PsychEdge',
    badge: 'Accredited',
    accreditationStatus: 'Accredited',
    language: 'English',
    assessmentMethod: 'Project',
    sponsorship: 'Fully sponsored by PsychEdge Corp',
    enrollmentStatus: 'Open',
    avgRating: 4.4,
    totalRatings: 56,
    totalEnrolled: 85,
  },
  {
    id: 'c8',
    title: 'Sports Psychology Webinar Series',
    provider: {
      name: 'National Sports Academy',
      logoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY5NTk2MzA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    courseType: 'Webinar',
    specializations: ['Sports Psychology'],
    providerType: 'NGO',
    mode: 'Online',
    courseFormat: 'Webinar',
    durationCategory: 'Short',
    fees: 'Free',
    outcomes: ['Participation Only', 'E-Certificate'],
    category: 'Sports',
    specialization: 'Performance Psychology',
    level: 'Beginner',
    duration: '3 sessions',
    format: 'Online',
    price: 0,
    currency: 'INR',
    isFree: true,
    tags: ['Webinar', 'Free'],
    description: 'A 3-part webinar series exploring the fundamentals of sports psychology — from mental toughness and visualization to team dynamics and injury rehabilitation.',
    targetAudience: 'Sports coaches, athletes, and psychology students.',
    learningOutcomes: [
      'Understand key mental skills for athletic performance',
      'Apply visualization and goal-setting techniques',
      'Recognize signs of burnout in athletes',
      'Support team cohesion through psychological principles'
    ],
    externalUrl: 'https://nsa.org.in',
    platformName: 'NSA',
    language: 'Hindi',
    assessmentMethod: 'Attendance Only',
    enrollmentStatus: 'Open',
    avgRating: 4.6,
    totalRatings: 34,
    totalEnrolled: 60,
  },
];

/* ── Enrolled / Completed mock data for student dashboard ── */
export const ENROLLED_COURSES: (Course & { isEnrolled: true; progress: number; enrollmentDate: string })[] = [
  {
    ...courses[0],
    isEnrolled: true,
    progress: 65,
    enrollmentDate: 'Feb 1, 2026',
    avgRating: 4.7,
    totalRatings: 312,
    totalEnrolled: 480,
    curriculum: [
      { week: 1, title: 'History of Clinical Psychology', topics: ['Origins', 'Key figures', 'Evolution'] },
      { week: 2, title: 'Diagnostic Frameworks', topics: ['DSM-5', 'ICD-11', 'Assessment tools'] },
      { week: 3, title: 'Therapeutic Approaches', topics: ['CBT', 'Psychodynamic', 'Humanistic'] },
      { week: 4, title: 'Ethics & Practice', topics: ['Confidentiality', 'Dual relationships', 'Supervision'] },
    ],
    startDate: 'Feb 3, 2026',
    endDate: 'Mar 28, 2026',
  },
  {
    ...courses[3],
    isEnrolled: true,
    progress: 30,
    enrollmentDate: 'Feb 15, 2026',
    avgRating: 4.5,
    totalRatings: 178,
    totalEnrolled: 195,
    startDate: 'Feb 17, 2026',
    endDate: 'Apr 25, 2026',
  },
];

export const COMPLETED_COURSES: (Course & { isCompleted: true; completionDate: string; rating?: number })[] = [
  {
    ...courses[4],
    isCompleted: true,
    completionDate: 'Jan 20, 2026',
    rating: 4,
    avgRating: 4.2,
    totalRatings: 89,
    totalEnrolled: 120,
  },
  {
    ...courses[7],
    isCompleted: true,
    completionDate: 'Dec 10, 2025',
    rating: 5,
    avgRating: 4.8,
    totalRatings: 45,
    totalEnrolled: 60,
  },
];

/* ── Mock reviews for courses ── */
export interface CourseReview {
  id: string;
  courseId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export const COURSE_REVIEWS: CourseReview[] = [
  { id: 'rev1', courseId: 'c1', userName: 'Priya Nair', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Excellent introduction! Dr. Jenkins explains complex concepts clearly. The assignments were challenging but rewarding.', date: 'Mar 5, 2026', helpful: 12 },
  { id: 'rev2', courseId: 'c1', userName: 'Rahul Verma', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Great course content, though I wish there were more case studies. The ethical considerations module was outstanding.', date: 'Feb 28, 2026', helpful: 8 },
  { id: 'rev3', courseId: 'c1', userName: 'Dr. Meera Sharma', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Recommended this to my interns. Comprehensive and well-structured for beginners entering clinical work.', date: 'Feb 20, 2026', helpful: 15 },
  { id: 'rev4', courseId: 'c4', userName: 'Ananya Reddy', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Fascinating content bridging neuroscience and clinical practice. The live sessions with Dr. Hopkins were the highlight.', date: 'Mar 10, 2026', helpful: 6 },
  { id: 'rev5', courseId: 'c5', userName: 'Vikram Singh', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Really engaging for a self-paced course. The criminal profiling module was fascinating.', date: 'Jan 15, 2026', helpful: 4 },
  { id: 'rev6', courseId: 'c8', userName: 'Arjun Mehta', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'As a sports psychologist, I found the webinar series to be well-structured and practical.', date: 'Dec 8, 2025', helpful: 7 },
];