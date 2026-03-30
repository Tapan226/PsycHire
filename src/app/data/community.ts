// Community / Circles Data — Types & Mock Data

export type UserGroup = 'Student' | 'Professional' | 'Expert' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserGroup;
  specialization?: string;
  bio?: string;
}

/* ─── Circle ─── */

export type CircleStatus = 'Approved' | 'Pending Approval' | 'Rejected';
export type CircleRole = 'Circle Leader' | 'Moderator' | 'Active Contributor';

export interface CircleMember {
  id: string;
  name: string;
  avatarUrl?: string;
  role: CircleRole;
  isVerified?: boolean;
}

export interface CommunityCircle {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  category: string;
  specialization: string;
  location: string;
  careerStage: string;
  focusArea: string;
  memberCount: number;
  leader: CircleMember;
  moderators: CircleMember[];
  guidelines: string[];
  isJoined?: boolean;
  status: CircleStatus;
}

/* ─── Discussion Thread ─── */

export type DiscussionTag = 'Case Discussion' | 'Tools' | 'Ethical Dilemma' | 'Publication' | 'Q&A';

export interface DiscussionComment {
  id: string;
  author: UserProfile;
  content: string;
  timestamp: string;
}

export interface DiscussionThread {
  id: string;
  circleId: string;
  author: UserProfile;
  tag: DiscussionTag;
  title: string;
  content: string;
  timestamp: string;
  comments: DiscussionComment[];
  isSaved?: boolean;
}

/* ─── Resource ─── */

export type ResourceType = 'Template' | 'Research Paper' | 'Assessment Tool';

export interface CircleResource {
  id: string;
  circleId: string;
  title: string;
  type: ResourceType;
  description: string;
  author: string;
  timestamp: string;
  fileSize: string;
  isSaved?: boolean;
}

/* ─── Announcement ─── */

export interface CircleAnnouncement {
  id: string;
  circleId: string;
  author: UserProfile;
  title: string;
  content: string;
  timestamp: string;
  isSaved?: boolean;
}

/* ─── Circle Event ─── */

export interface CircleEvent {
  id: string;
  circleId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  format: 'Online' | 'Offline' | 'Hybrid';
  isSaved?: boolean;
  isJoined?: boolean;
}

/* ─── Post type (legacy compat) ─── */

export type PostType = 'Text' | 'OpenMic' | 'Announcement' | 'Expert';

export interface Post {
  id: string;
  circleId?: string;
  author: UserProfile;
  type: PostType;
  title?: string;
  content: string;
  timestamp: string;
  comments: DiscussionComment[];
  isFlagged?: boolean;
  likes?: number;
  imageUrl?: string;
  circle?: { id: string; name: string };
}

/* ─── Filter options ─── */

export const SPECIALIZATION_OPTIONS = [
  'Clinical Psychology',
  'Developmental Psychology',
  'Neuropsychology',
  'I/O Psychology',
  'Counselling Psychology',
  'Social Psychology',
] as const;

export const LOCATION_OPTIONS = [
  'Pan-India',
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Global',
] as const;

export const CAREER_STAGE_OPTIONS = [
  'Undergrad',
  'Post-grad',
  'Early Career',
  'Mid Career',
  'Senior',
] as const;

export const FOCUS_AREA_OPTIONS = [
  'Case Discussions',
  'Research',
  'Ethics & Practice',
  'Career Development',
  'Tools & Techniques',
  'Wellness',
] as const;

/* ═══════════════════════════════
   MOCK DATA
   ═══════════════════════════════ */

export const MOCK_USERS: Record<string, UserProfile> = {
  me: {
    id: 'u1',
    name: 'Alex Johnson',
    role: 'Student',
    specialization: 'Clinical Psychology',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1c2VyJTIwcHJvZmlsZXxlbnwxfHx8fDE3Njk2MDEwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  expert1: {
    id: 'u2',
    name: 'Dr. Sarah Miller',
    role: 'Expert',
    specialization: 'Neuropsychology',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3Njk2MDEwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  admin1: {
    id: 'u3',
    name: 'Dr. Rohan Kapoor',
    role: 'Professional',
    specialization: 'Clinical Psychology',
    avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc2OTYwMTA1NXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  student1: {
    id: 'u4',
    name: 'Jordan Lee',
    role: 'Student',
    specialization: 'Child Psychology',
  },
};

export const circles: CommunityCircle[] = [
  {
    id: 'c1',
    name: 'Clinical Psychology Network',
    description: 'A dedicated space for clinical psychology students and practitioners to discuss case studies (anonymized), therapeutic modalities, and licensure requirements.',
    bannerUrl: 'https://images.unsplash.com/photo-1593444286621-98245b7d4530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwc3ljaG9sb2d5JTIwdGhlcmFweSUyMHNlc3Npb24lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzcxMjM2Mjc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Clinical',
    specialization: 'Clinical Psychology',
    location: 'Pan-India',
    careerStage: 'Early Career',
    focusArea: 'Case Discussions',
    memberCount: 1250,
    leader: { id: 'l1', name: 'Dr. Sarah Miller', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbnxlbnwxfHx8fDE3Njk2MDEwNTV8MA&ixlib=rb-4.1.0&q=80&w=1080', role: 'Circle Leader', isVerified: true },
    moderators: [
      { id: 'm1', name: 'Dr. Rohan Kapoor', role: 'Moderator', isVerified: true },
      { id: 'm2', name: 'Priya Sharma', role: 'Moderator' },
    ],
    guidelines: [
      'Strict patient confidentiality is mandatory.',
      'Be respectful of diverse therapeutic approaches.',
      'No medical advice to non-professionals.',
    ],
    isJoined: true,
    status: 'Approved',
  },
  {
    id: 'c2',
    name: 'Child & Adolescent Development',
    description: 'Discussing developmental milestones, pediatric mental health challenges, and school psychology interventions.',
    bannerUrl: 'https://images.unsplash.com/photo-1761208662734-fb46f1398551?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMGRldmVsb3BtZW50JTIwY2xhc3Nyb29tJTIwZWR1Y2F0aW9ufGVufDF8fHx8MTc3MTIzNjI3OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Developmental',
    specialization: 'Developmental Psychology',
    location: 'Mumbai',
    careerStage: 'Post-grad',
    focusArea: 'Research',
    memberCount: 840,
    leader: { id: 'l2', name: 'Dr. Anita Desai', role: 'Circle Leader', isVerified: true },
    moderators: [
      { id: 'm3', name: 'Jordan Lee', role: 'Moderator' },
    ],
    guidelines: [
      'Focus on evidence-based developmental theories.',
      'Respect privacy of minors in any case discussions.',
      'Constructive feedback only.',
    ],
    isJoined: false,
    status: 'Approved',
  },
  {
    id: 'c3',
    name: 'Neuroscience Research Hub',
    description: 'For those interested in the biological basis of behavior, brain imaging, and cognitive neuroscience research.',
    bannerUrl: 'https://images.unsplash.com/photo-1758691463110-697a814b2033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXVyb3NjaWVuY2UlMjBicmFpbiUyMHNjYW4lMjBtZWRpY2FsJTIwcmVzZWFyY2h8ZW58MXx8fHwxNzcxMjM2MjgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Research',
    specialization: 'Neuropsychology',
    location: 'Global',
    careerStage: 'Mid Career',
    focusArea: 'Tools & Techniques',
    memberCount: 450,
    leader: { id: 'l3', name: 'Dr. Vikram Patel', role: 'Circle Leader', isVerified: true },
    moderators: [],
    guidelines: [
      'Cite sources when discussing research findings.',
      'Keep discussions relevant to neuroscience.',
      'Open to questions from beginners.',
    ],
    isJoined: false,
    status: 'Approved',
  },
  {
    id: 'c4',
    name: 'Industrial-Organizational Psychology',
    description: 'Connect with professionals working in HR, organizational behavior, and workplace mental health.',
    bannerUrl: 'https://images.unsplash.com/photo-1769740333462-9a63bfa914bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBvZmZpY2UlMjB0ZWFtJTIwd29ya3BsYWNlJTIwbWVldGluZ3xlbnwxfHx8fDE3NzEyMzYyNzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Industry',
    specialization: 'I/O Psychology',
    location: 'Bangalore',
    careerStage: 'Senior',
    focusArea: 'Career Development',
    memberCount: 620,
    leader: { id: 'l4', name: 'Dr. Meera Iyer', role: 'Circle Leader', isVerified: true },
    moderators: [
      { id: 'm4', name: 'Arjun Mehta', role: 'Moderator' },
    ],
    guidelines: [
      'Professional networking etiquette applies.',
      'No direct solicitation of services.',
      'Focus on workplace psychology trends.',
    ],
    isJoined: true,
    status: 'Approved',
  },
  {
    id: 'c5',
    name: 'Counselling & Well-being',
    description: 'A supportive space for counselling psychology practitioners to exchange tools, discuss client engagement strategies, and explore wellness approaches.',
    bannerUrl: 'https://images.unsplash.com/photo-1758273240360-76b908e7582a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Vuc2VsaW5nJTIwbWVudGFsJTIwaGVhbHRoJTIwd2VsbG5lc3MlMjBzdXBwb3J0fGVufDF8fHx8MTc3MTIzNjI3OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Counselling',
    specialization: 'Counselling Psychology',
    location: 'Delhi',
    careerStage: 'Undergrad',
    focusArea: 'Wellness',
    memberCount: 960,
    leader: { id: 'l5', name: 'Dr. Kavita Reddy', role: 'Circle Leader', isVerified: true },
    moderators: [
      { id: 'm5', name: 'Sneha Patel', role: 'Moderator' },
    ],
    guidelines: [
      'Maintain respectful and empathetic discourse.',
      'No therapy or clinical advice in comments.',
      'Protect client confidentiality at all times.',
    ],
    isJoined: false,
    status: 'Approved',
  },
  {
    id: 'c6',
    name: 'Ethics & Practice Standards',
    description: 'Engage in nuanced discussions around ethical dilemmas, professional boundaries, and evolving practice standards in psychology.',
    bannerUrl: 'https://images.unsplash.com/photo-1588618319407-948d4424befd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHJlc2VhcmNoJTIwbGlicmFyeSUyMHVuaXZlcnNpdHklMjBzdHVkeXxlbnwxfHx8fDE3NzEyMzYyODB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Ethics',
    specialization: 'Clinical Psychology',
    location: 'Pan-India',
    careerStage: 'Early Career',
    focusArea: 'Ethics & Practice',
    memberCount: 380,
    leader: { id: 'l6', name: 'Prof. Sunil Joshi', role: 'Circle Leader', isVerified: true },
    moderators: [],
    guidelines: [
      'Reference official ethics codes where possible.',
      'No personal attacks or judgment.',
      'Maintain academic rigor in discourse.',
    ],
    isJoined: false,
    status: 'Approved',
  },
];

/* ─── Discussion Threads ─── */

export const mockDiscussions: DiscussionThread[] = [
  {
    id: 'd1',
    circleId: 'c1',
    author: MOCK_USERS.expert1,
    tag: 'Case Discussion',
    title: 'Adapting CBT for Tele-health: Shorter, Focused Sessions',
    content: 'I have been reviewing the latest literature on Cognitive Behavioral Therapy adaptations for tele-health. It seems we are moving towards shorter, more focused sessions. What are your thoughts on micro-interventions and their efficacy rates compared to traditional 50-min sessions?',
    timestamp: '2 hours ago',
    comments: [
      { id: 'cm1', author: MOCK_USERS.student1 as UserProfile, content: 'This is fascinating! I would love to read more about the efficacy rates compared to traditional 50-min sessions.', timestamp: '1 hour ago' },
    ],
  },
  {
    id: 'd2',
    circleId: 'c1',
    author: MOCK_USERS.me,
    tag: 'Q&A',
    title: 'Resources for DBT with Adolescents?',
    content: 'Can anyone recommend good resources for learning about Dialectical Behavior Therapy (DBT) specifically for adolescents? I am struggling to find age-appropriate worksheets and structured activities.',
    timestamp: '5 hours ago',
    comments: [],
  },
  {
    id: 'd3',
    circleId: 'c1',
    author: MOCK_USERS.admin1,
    tag: 'Ethical Dilemma',
    title: 'Dual Relationships in Rural Practice',
    content: 'In small towns, dual relationships are sometimes unavoidable. A colleague recently encountered a situation where a client was also a neighbor. How do you navigate these boundaries while maintaining therapeutic alliance?',
    timestamp: '1 day ago',
    comments: [
      { id: 'cm2', author: MOCK_USERS.expert1, content: 'Transparency is key. Establishing clear boundaries early and documenting the discussion is critical. The APA guidelines have a helpful framework for this.', timestamp: '20 hours ago' },
      { id: 'cm3', author: MOCK_USERS.me, content: 'We discussed this in our ethics class. Referral is the ideal option, but when that is not feasible, structured boundary management works.', timestamp: '18 hours ago' },
    ],
  },
  {
    id: 'd4',
    circleId: 'c4',
    author: MOCK_USERS.expert1,
    tag: 'Tools',
    title: 'Best Psychometric Tools for Employee Engagement Surveys',
    content: 'We are looking to revamp our employee engagement measurement toolkit. Currently using a modified version of the Gallup Q12, but want something more granular. Any recommendations for validated instruments that capture psychological safety and intrinsic motivation?',
    timestamp: '3 hours ago',
    comments: [],
  },
];

/* ─── Resources ─── */

export const mockResources: CircleResource[] = [
  {
    id: 'r1',
    circleId: 'c1',
    title: 'CBT Session Plan Template',
    type: 'Template',
    description: 'A structured template for planning 12-session CBT interventions. Includes session goals, homework assignments, and progress tracking.',
    author: 'Dr. Sarah Miller',
    timestamp: '3 days ago',
    fileSize: '245 KB',
  },
  {
    id: 'r2',
    circleId: 'c1',
    title: 'Meta-analysis: Tele-therapy Outcomes 2024–2025',
    type: 'Research Paper',
    description: 'A comprehensive meta-analysis covering 42 studies on tele-therapy effectiveness across anxiety, depression, and PTSD treatments.',
    author: 'Dr. Rohan Kapoor',
    timestamp: '1 week ago',
    fileSize: '1.8 MB',
  },
  {
    id: 'r3',
    circleId: 'c1',
    title: 'PHQ-9 Scoring Guide & Interpretation',
    type: 'Assessment Tool',
    description: 'Detailed scoring guide for the PHQ-9 depression screening tool with clinical interpretation thresholds and follow-up protocols.',
    author: 'Priya Sharma',
    timestamp: '2 weeks ago',
    fileSize: '120 KB',
  },
];

/* ─── Announcements ─── */

export const mockAnnouncements: CircleAnnouncement[] = [
  {
    id: 'a1',
    circleId: 'c1',
    author: MOCK_USERS.expert1,
    title: 'Updated Community Guidelines',
    content: 'Please review our updated community guidelines regarding case study discussions. We are enforcing stricter anonymization rules starting next week to ensure ethical compliance. All members are expected to review and acknowledge.',
    timestamp: '1 day ago',
  },
  {
    id: 'a2',
    circleId: 'c1',
    author: MOCK_USERS.admin1,
    title: 'Monthly Theme: Trauma-Informed Care',
    content: 'This month, we will be focusing our discussions on trauma-informed care approaches. Share your experiences, recommended readings, and questions related to this theme.',
    timestamp: '3 days ago',
  },
];

/* ─── Circle Events ─── */

export const mockCircleEvents: CircleEvent[] = [
  {
    id: 'ce1',
    circleId: 'c1',
    title: 'Clinical Case Roundtable',
    description: 'Monthly anonymized case discussion with senior clinicians. Bring your challenging cases and ethical dilemmas.',
    date: 'Mar 8, 2026',
    time: '6:00 PM IST',
    format: 'Online',
  },
  {
    id: 'ce2',
    circleId: 'c1',
    title: 'CBT Workshop: Advanced Techniques',
    description: 'Hands-on workshop covering exposure therapy, behavioral experiments, and third-wave CBT adaptations.',
    date: 'Mar 22, 2026',
    time: '10:00 AM IST',
    format: 'Hybrid',
  },
  {
    id: 'ce3',
    circleId: 'c1',
    title: 'Ethics in Practice Meetup',
    description: 'Informal meetup to discuss real-world ethical challenges. Open to all career stages.',
    date: 'Apr 5, 2026',
    time: '5:00 PM IST',
    format: 'Online',
  },
];

/* ─── Legacy compat: mockPosts ─── */

const MOCK_LIKES = [14, 8, 23, 5, 31, 2, 17, 9, 12, 6];

export const mockPosts: Post[] = mockDiscussions.map((d, i) => ({
  id: d.id,
  circleId: d.circleId,
  author: d.author,
  type: 'Text' as PostType,
  title: d.title,
  content: d.content,
  timestamp: d.timestamp,
  comments: d.comments,
  likes: MOCK_LIKES[i % MOCK_LIKES.length],
}));