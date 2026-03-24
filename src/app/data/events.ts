/* ══════════════════════════════════════════════
   PsycHIRE Events – Phase 2 Data Model
   ══════════════════════════════════════════════ */

export type EventStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Live'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Event Completed'
  | 'Review Phase';

export type EventType = 'Webinar' | 'Workshop' | 'Certification Course' | 'Panel Discussion' | 'Research Presentation' | 'Seminar' | 'Conference / Summit' | 'Supervision Circle' | 'Mental Health Awareness Event' | 'Peer Sharing Circle' | 'PsycHIRE Verified Event' | 'Award';
export type EventFormat = 'Virtual' | 'In-Person' | 'Hybrid';
export type TargetAudience = 'Students' | 'Professionals' | 'Both';

/* ── Sub-models ── */

export interface Speaker {
  name: string;
  role: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
}

export type SponsorTier = 'Gold' | 'Silver' | 'Knowledge Partner' | 'Custom';

export interface SponsorshipTier {
  tier: SponsorTier;
  amount: number;
  currency: string;
  benefits: string[];
  maxSpots: number;
  filledSpots: number;
}

export interface Sponsor {
  name: string;
  logoUrl?: string;
  tier: SponsorTier;
  contactPerson: string;
}

export interface TicketCategory {
  id: string;
  name: string;  // Student, Early Bird, General, Group
  price: number;
  currency: string;
  maxQuantity: number;
  soldCount: number;
  description?: string;
  couponCode?: string;
  discountPercent?: number;
}

export interface EventReview {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1–5
  comment: string;
  date: string;
}

export interface PostEventData {
  averageRating?: number;
  totalReviews?: number;
  reviews?: EventReview[];
  mediaLinks?: { label: string; url: string }[];
  testimonials?: { name: string; quote: string }[];
}

/* ── Main Event ── */

export interface Event {
  id: string;
  title: string;
  status: EventStatus;
  type: EventType;
  format: EventFormat;
  startDate: string;
  startTime: string;
  endDate?: string;
  endTime: string;
  timezone: string;
  location?: string;
  platformLink?: string;
  bannerUrl?: string;
  host: {
    id: string;
    name: string;
    avatarUrl?: string;
    type: 'Expert' | 'Company' | 'Community' | 'Admin';
    isVerified: boolean;
  };
  price: number;
  currency: string;
  isFree: boolean;
  description: string;
  objective?: string;
  agenda?: AgendaItem[];
  tags: string[];
  attendeesCount: number;
  maxAttendees?: number;
  registrationUrl?: string;
  registrationDeadline?: string;
  targetAudience: TargetAudience;
  isRegistered?: boolean;
  isFeatured?: boolean;
  isSaved?: boolean;
  isTrending?: boolean;
  isSponsored?: boolean;
  languages: string[];
  specialization: string;
  speakers?: Speaker[];

  // Phase 2 additions
  ticketCategories?: TicketCategory[];
  sponsorshipTiers?: SponsorshipTier[];
  sponsors?: Sponsor[];
  postEvent?: PostEventData;

  // Analytics (organizer-facing)
  analytics?: {
    totalRSVPs: number;
    paidConversions: number;
    revenueCollected: number;
    pageViews: number;
    uniqueVisitors: number;
  };
}

/* ── Filter Options ── */

export const EVENT_STATUS_OPTIONS: EventStatus[] = [
  'Live', 'Registration Open', 'Registration Closed', 'Event Completed',
];
export const EVENT_TYPE_OPTIONS: EventType[] = ['Webinar', 'Workshop', 'Certification Course', 'Panel Discussion', 'Research Presentation', 'Seminar', 'Conference / Summit', 'Supervision Circle', 'Mental Health Awareness Event', 'Peer Sharing Circle', 'PsycHIRE Verified Event', 'Award'];
export const EVENT_FORMAT_OPTIONS: EventFormat[] = ['Virtual', 'In-Person', 'Hybrid'];

export const SPECIALIZATION_OPTIONS = [
  'Clinical Psychology', 'Counseling Psychology', 'I/O Psychology',
  'Neuropsychology', 'Developmental Psychology', 'Social Psychology',
  'General Psychology', 'Sports Psychology', 'Research Methods',
];

/* ══════════════════════════════════════════════
   Mock Data
   ══════════════════════════════════════════════ */

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Cognitive Behavioral Therapy Workshop',
    status: 'Registration Open',
    type: 'Workshop',
    format: 'Virtual',
    startDate: '2026-03-15',
    startTime: '10:00 AM',
    endTime: '02:00 PM',
    timezone: 'IST (UTC+5:30)',
    host: {
      id: 'h1',
      name: 'Dr. Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      type: 'Expert',
      isVerified: true,
    },
    price: 49,
    currency: 'USD',
    isFree: false,
    description: 'A comprehensive workshop on the fundamentals of CBT, designed for students and early-career professionals. Learn practical techniques for anxiety and depression management with hands-on exercises and case studies.',
    objective: 'Master the core principles of CBT and apply them in clinical settings.',
    agenda: [
      { time: '10:00 AM', title: 'Introduction to CBT Framework', speaker: 'Dr. Sarah Jenkins' },
      { time: '11:00 AM', title: 'Cognitive Restructuring Techniques' },
      { time: '12:00 PM', title: 'Lunch Break' },
      { time: '12:30 PM', title: 'Case Study & Role Play' },
      { time: '01:30 PM', title: 'Q&A and Wrap-up' },
    ],
    tags: ['Clinical', 'CBT', 'Therapy', 'Mental Health'],
    attendeesCount: 45,
    maxAttendees: 50,
    registrationDeadline: 'March 12, 2026',
    targetAudience: 'Both',
    isFeatured: true,
    isSaved: true,
    languages: ['English'],
    specialization: 'Clinical Psychology',
    bannerUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    speakers: [
      {
        name: 'Dr. Sarah Jenkins',
        role: 'Clinical Psychologist',
        bio: 'Over 15 years of experience in CBT-based interventions for anxiety and mood disorders.',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      },
    ],
    ticketCategories: [
      { id: 't1', name: 'Student', price: 29, currency: 'USD', maxQuantity: 20, soldCount: 15, description: 'Discounted rate for students with valid ID' },
      { id: 't2', name: 'Early Bird', price: 39, currency: 'USD', maxQuantity: 10, soldCount: 10, description: 'Limited early bird pricing' },
      { id: 't3', name: 'General', price: 49, currency: 'USD', maxQuantity: 15, soldCount: 12 },
      { id: 't4', name: 'Group (5+)', price: 199, currency: 'USD', maxQuantity: 5, soldCount: 2, description: 'Pack of 5 tickets at reduced rate', discountPercent: 20 },
    ],
    analytics: { totalRSVPs: 45, paidConversions: 39, revenueCollected: 1895, pageViews: 1240, uniqueVisitors: 890 },
  },
  {
    id: 'e2',
    title: 'Future of I/O Psychology',
    status: 'Live',
    type: 'Webinar',
    format: 'Virtual',
    startDate: '2026-03-20',
    startTime: '05:00 PM',
    endTime: '06:30 PM',
    timezone: 'IST (UTC+5:30)',
    host: {
      id: 'co3',
      name: 'Corporate Wellness Co',
      avatarUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200',
      type: 'Company',
      isVerified: false,
    },
    price: 0,
    currency: 'USD',
    isFree: true,
    description: 'Join industry leaders as they discuss the evolving landscape of Industrial-Organizational Psychology in the post-pandemic workplace. Topics include remote team dynamics, AI in HR, and employee wellbeing.',
    objective: 'Understand future trends in workplace psychology and organizational behavior.',
    tags: ['I/O Psychology', 'Career', 'Trends'],
    attendeesCount: 120,
    maxAttendees: 500,
    targetAudience: 'Professionals',
    isTrending: true,
    languages: ['English'],
    specialization: 'I/O Psychology',
    bannerUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    speakers: [
      { name: 'James Wilson', role: 'HR Director, TechCorp', bio: 'Leading HR transformation initiatives across multinational organizations.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { name: 'Elena Rodriguez', role: 'Organizational Consultant', bio: 'Specialist in organizational design and change management for Fortune 500 companies.', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
    ],
    sponsorshipTiers: [
      { tier: 'Gold', amount: 2000, currency: 'USD', benefits: ['Logo on banner', 'Keynote intro', '10 free passes', 'Email blast inclusion'], maxSpots: 2, filledSpots: 1 },
      { tier: 'Silver', amount: 1000, currency: 'USD', benefits: ['Logo on event page', '5 free passes', 'Social media mention'], maxSpots: 5, filledSpots: 3 },
      { tier: 'Knowledge Partner', amount: 500, currency: 'USD', benefits: ['Logo on page', 'Content sharing slot'], maxSpots: 10, filledSpots: 2 },
    ],
    sponsors: [
      { name: 'TechCorp India', tier: 'Gold', contactPerson: 'Rahul Jain', logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=200' },
      { name: 'MindScope Labs', tier: 'Silver', contactPerson: 'Anita Reddy' },
      { name: 'WorkWell Co', tier: 'Silver', contactPerson: 'Dev Patel' },
    ],
    isSponsored: true,
    analytics: { totalRSVPs: 120, paidConversions: 0, revenueCollected: 0, pageViews: 3200, uniqueVisitors: 2100 },
  },
  {
    id: 'e3',
    title: 'Student Open Mic: Research Ideas',
    status: 'Registration Open',
    type: 'Peer Sharing Circle',
    format: 'Virtual',
    startDate: '2026-03-22',
    startTime: '07:00 PM',
    endTime: '09:00 PM',
    timezone: 'IST (UTC+5:30)',
    host: {
      id: 'comm1',
      name: 'Psych Students Community',
      type: 'Community',
      isVerified: true,
    },
    price: 0,
    currency: 'USD',
    isFree: true,
    description: 'A casual space for students to pitch their research ideas and get feedback from peers. No formal preparation required!',
    objective: 'Foster community collaboration and refine research proposals.',
    tags: ['Research', 'Student Life', 'Networking'],
    attendeesCount: 30,
    maxAttendees: 50,
    targetAudience: 'Students',
    languages: ['English', 'Hindi'],
    specialization: 'General Psychology',
  },
  {
    id: 'e4',
    title: 'Annual Neuropsychology Conference 2026',
    status: 'Registration Open',
    type: 'Conference / Summit',
    format: 'In-Person',
    startDate: '2026-04-10',
    startTime: '09:00 AM',
    endDate: '2026-04-12',
    endTime: '05:00 PM',
    timezone: 'IST (UTC+5:30)',
    location: 'Mumbai Convention Centre, Mumbai',
    host: {
      id: 'co4',
      name: 'NeuroCare Institute',
      avatarUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200',
      type: 'Company',
      isVerified: true,
    },
    price: 150,
    currency: 'USD',
    isFree: false,
    description: 'The biggest gathering of neuropsychologists in the region. Keynote speakers, panel discussions, networking opportunities, and sponsored exhibitions.',
    objective: 'Advance neuropsychology research and foster cross-institutional collaboration.',
    agenda: [
      { time: '09:00 AM', title: 'Opening Keynote', speaker: 'Dr. Alan Grant' },
      { time: '10:30 AM', title: 'Breakout Sessions' },
      { time: '12:00 PM', title: 'Networking Lunch' },
      { time: '01:30 PM', title: 'Panel: Future of Neuroimaging' },
      { time: '03:00 PM', title: 'Sponsor Showcase' },
      { time: '04:30 PM', title: 'Closing Remarks' },
    ],
    tags: ['Neuropsychology', 'Conference', 'Networking', 'Research'],
    attendeesCount: 250,
    maxAttendees: 300,
    registrationDeadline: 'March 25, 2026',
    targetAudience: 'Professionals',
    isFeatured: true,
    isSponsored: true,
    languages: ['English'],
    specialization: 'Neuropsychology',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    speakers: [
      { name: 'Dr. Alan Grant', role: 'Chief Neuroscientist, NeuroCare', bio: 'Pioneer in clinical neuropsychological assessment with over 20 years of research experience.', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
      { name: 'Dr. Priya Sharma', role: 'Research Director, AIIMS', bio: 'Leading expert in neuroimaging and cognitive rehabilitation.' },
    ],
    ticketCategories: [
      { id: 't5', name: 'Student', price: 75, currency: 'USD', maxQuantity: 100, soldCount: 68, description: 'Valid student ID required' },
      { id: 't6', name: 'Early Bird', price: 120, currency: 'USD', maxQuantity: 50, soldCount: 50, description: 'Sold Out' },
      { id: 't7', name: 'General', price: 150, currency: 'USD', maxQuantity: 100, soldCount: 82 },
      { id: 't8', name: 'Group (10+)', price: 1200, currency: 'USD', maxQuantity: 10, soldCount: 5, description: 'Corporate group rate – 10 passes', discountPercent: 20 },
    ],
    sponsorshipTiers: [
      { tier: 'Gold', amount: 5000, currency: 'USD', benefits: ['Main stage branding', 'Keynote introduction', '20 passes', 'Exhibition booth', 'Email blast feature'], maxSpots: 3, filledSpots: 2 },
      { tier: 'Silver', amount: 2500, currency: 'USD', benefits: ['Event page branding', '10 passes', 'Social media package'], maxSpots: 5, filledSpots: 3 },
      { tier: 'Knowledge Partner', amount: 1000, currency: 'USD', benefits: ['Logo on page', 'Presentation slot', '5 passes'], maxSpots: 10, filledSpots: 4 },
      { tier: 'Custom', amount: 0, currency: 'USD', benefits: ['Contact us for a tailored package'], maxSpots: 99, filledSpots: 0 },
    ],
    sponsors: [
      { name: 'NeuroCare Institute', tier: 'Gold', contactPerson: 'Dr. Alan Grant', logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=200' },
      { name: 'BrainTech Solutions', tier: 'Gold', contactPerson: 'Sanjay Mehta' },
      { name: 'AIIMS Research Fund', tier: 'Silver', contactPerson: 'Dr. Priya Sharma' },
    ],
    analytics: { totalRSVPs: 250, paidConversions: 205, revenueCollected: 28750, pageViews: 8400, uniqueVisitors: 5600 },
  },
  {
    id: 'e5',
    title: 'Mindfulness for Stress Reduction',
    status: 'Live',
    type: 'Seminar',
    format: 'In-Person',
    startDate: '2026-03-18',
    startTime: '06:00 PM',
    endTime: '07:00 PM',
    timezone: 'IST (UTC+5:30)',
    location: 'Community Hall, Delhi',
    host: { id: 'h2', name: 'Rajesh Kumar', type: 'Expert', isVerified: true },
    price: 0,
    currency: 'INR',
    isFree: true,
    description: 'Learn simple mindfulness techniques to manage daily stress and improve focus. Interactive session with guided meditation and take-home practices.',
    objective: 'Learn practical mindfulness techniques for daily life.',
    tags: ['Wellness', 'Mindfulness', 'Self-care'],
    attendeesCount: 60,
    maxAttendees: 80,
    targetAudience: 'Both',
    languages: ['Hindi', 'English'],
    specialization: 'Counseling Psychology',
  },
  {
    id: 'e6',
    title: 'Child Development Assessment Panel',
    status: 'Registration Open',
    type: 'Panel Discussion',
    format: 'Hybrid',
    startDate: '2026-04-25',
    startTime: '10:00 AM',
    endTime: '01:00 PM',
    timezone: 'IST (UTC+5:30)',
    location: 'Bangalore Psychology Institute',
    platformLink: 'https://zoom.us/meeting/xyz',
    host: { id: 'co5', name: 'Child Mind Foundation', type: 'Company', isVerified: true },
    price: 25,
    currency: 'USD',
    isFree: false,
    description: 'A panel discussion on modern approaches to child development assessment. Hear from leading practitioners and researchers working in developmental psychology.',
    objective: 'Share current research and best practices in child assessment.',
    registrationDeadline: 'April 10, 2026',
    tags: ['Developmental', 'Assessment', 'Children'],
    attendeesCount: 40,
    maxAttendees: 120,
    targetAudience: 'Both',
    languages: ['English'],
    specialization: 'Developmental Psychology',
    ticketCategories: [
      { id: 't9', name: 'Student', price: 15, currency: 'USD', maxQuantity: 50, soldCount: 18 },
      { id: 't10', name: 'General', price: 25, currency: 'USD', maxQuantity: 70, soldCount: 22 },
    ],
  },
  {
    id: 'e7',
    title: 'Sports Psychology Masterclass',
    status: 'Event Completed',
    type: 'Workshop',
    format: 'Virtual',
    startDate: '2026-02-10',
    startTime: '11:00 AM',
    endTime: '03:00 PM',
    timezone: 'IST (UTC+5:30)',
    host: { id: 'h3', name: 'Dr. Meera Iyer', type: 'Expert', isVerified: true },
    price: 75,
    currency: 'USD',
    isFree: false,
    description: 'An advanced workshop covering mental skills training for athletes. Topics included visualization, goal setting, arousal regulation, and performance anxiety management.',
    tags: ['Sports Psychology', 'Performance', 'Athletes'],
    attendeesCount: 50,
    maxAttendees: 50,
    targetAudience: 'Professionals',
    languages: ['English'],
    specialization: 'Sports Psychology',
    isRegistered: true,
    postEvent: {
      averageRating: 4.6,
      totalReviews: 32,
      reviews: [
        { id: 'r1', userName: 'Priya Nair', rating: 5, comment: 'Fantastic workshop – learned so much about visualization techniques.', date: 'Feb 11, 2026' },
        { id: 'r2', userName: 'Arjun Mehta', rating: 4, comment: 'Great content. Would have loved more time on arousal regulation.', date: 'Feb 12, 2026' },
        { id: 'r3', userName: 'Sneha Patel', rating: 5, comment: 'Dr. Meera is an incredible speaker. Highly recommend.', date: 'Feb 12, 2026' },
      ],
      mediaLinks: [
        { label: 'Event Recording', url: '#' },
        { label: 'Photo Gallery', url: '#' },
      ],
      testimonials: [
        { name: 'Priya Nair', quote: 'This was exactly what I needed to level up my practice.' },
        { name: 'Coach Ramesh', quote: 'Practical and applicable — my athletes are already benefiting.' },
      ],
    },
    analytics: { totalRSVPs: 50, paidConversions: 50, revenueCollected: 3750, pageViews: 2100, uniqueVisitors: 1450 },
  },
  {
    id: 'e8',
    title: 'Research Methods in Social Psychology',
    status: 'Registration Open',
    type: 'Webinar',
    format: 'Virtual',
    startDate: '2026-03-28',
    startTime: '04:00 PM',
    endTime: '05:30 PM',
    timezone: 'IST (UTC+5:30)',
    host: { id: 'co6', name: 'Indian Psych Society', type: 'Community', isVerified: true },
    price: 0,
    currency: 'INR',
    isFree: true,
    description: 'A beginner-friendly webinar on experimental and survey-based research methods in social psychology. Perfect for students planning their thesis.',
    objective: 'Build foundational knowledge in social psychology research design.',
    tags: ['Social Psychology', 'Research', 'Methodology'],
    attendeesCount: 85,
    maxAttendees: 200,
    isTrending: true,
    targetAudience: 'Students',
    languages: ['English', 'Hindi'],
    specialization: 'Social Psychology',
    speakers: [
      { name: 'Prof. Kavita Desai', role: 'Professor, Social Psychology, JNU', bio: 'Award-winning researcher specializing in social cognition and intergroup relations.' },
    ],
    analytics: { totalRSVPs: 85, paidConversions: 0, revenueCollected: 0, pageViews: 1800, uniqueVisitors: 1200 },
  },
];