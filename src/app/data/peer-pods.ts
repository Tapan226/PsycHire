// ── Peer Pods Data Types & Mock Data ──

export type PodType = 'Resilience' | 'Practice' | 'Research' | 'Founder';
export type PodStatus = 'Open' | 'Full';
export type CareerStage = 'Student' | 'Early Career' | 'Mid Career' | 'Senior';
export type PrimaryGoal = 'Accountability' | 'Skill Building' | 'Peer Support' | 'Networking';
export type Specialization = 'Clinical' | 'Counselling' | 'I/O Psychology' | 'Neuropsychology' | 'Developmental' | 'Research Methods';
export type Duration = '8 weeks' | '12 weeks';

export interface PodMember {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'Creator' | 'Member';
  careerStage: CareerStage;
  specialization: string;
}

export interface CheckInPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  comments: { id: string; authorName: string; authorAvatar: string; content: string; timestamp: string }[];
}

export interface PodGoal {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatar: string;
  professionalGoal: string;
  wellbeingGoal: string;
  weeklyCommitment: string;
}

export interface PodSession {
  id: string;
  title: string;
  date: string;
  time: string;
  externalLink: string;
  notes: string;
}

export interface PeerPod {
  id: string;
  title: string;
  podType: PodType;
  duration: Duration;
  careerStage: CareerStage;
  primaryGoal: PrimaryGoal;
  description: string;
  memberCount: number;
  maxMembers: number;
  status: PodStatus;
  availability: string;
  createdBy: string;
  isJoined?: boolean;
  members: PodMember[];
  checkIns: CheckInPost[];
  goals: PodGoal[];
  sessions: PodSession[];
}

export const POD_TYPE_OPTIONS: PodType[] = ['Resilience', 'Practice', 'Research', 'Founder'];
export const POD_STATUS_OPTIONS: PodStatus[] = ['Open', 'Full'];
export const CAREER_STAGE_OPTIONS: CareerStage[] = ['Student', 'Early Career', 'Mid Career', 'Senior'];
export const PRIMARY_GOAL_OPTIONS: PrimaryGoal[] = ['Accountability', 'Skill Building', 'Peer Support', 'Networking'];
export const SPECIALIZATION_OPTIONS: Specialization[] = ['Clinical', 'Counselling', 'I/O Psychology', 'Neuropsychology', 'Developmental', 'Research Methods'];
export const DURATION_OPTIONS: Duration[] = ['8 weeks', '12 weeks'];
export const AVAILABILITY_OPTIONS = ['Weekdays', 'Weekends', 'Evenings', 'Flexible'];

export const POD_TYPE_COLOR: Record<PodType, { bg: string; text: string; border: string }> = {
  Resilience: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  Practice: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200' },
  Research: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  Founder: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
};

export const MOCK_PODS: PeerPod[] = [
  {
    id: 'pod-1',
    title: 'Resilience in Clinical Practice',
    podType: 'Resilience',
    duration: '12 weeks',
    careerStage: 'Early Career',
    primaryGoal: 'Peer Support',
    description: 'A confidential peer group for early-career clinical psychologists navigating the emotional demands of practice. We meet weekly to share strategies for maintaining resilience and support each other through difficult cases.',
    memberCount: 5,
    maxMembers: 6,
    status: 'Open',
    availability: 'Weekday Evenings',
    createdBy: 'Dr. Meera Sharma',
    isJoined: true,
    members: [
      { id: 'm1', name: 'Dr. Meera Sharma', avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964f1aa?w=100&h=100&fit=crop&crop=face', role: 'Creator', careerStage: 'Mid Career', specialization: 'Clinical Psychology' },
      { id: 'm2', name: 'Priya Nair', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'Clinical Psychology' },
      { id: 'm3', name: 'Arun Desai', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'Clinical Psychology' },
      { id: 'm4', name: 'Sneha Kulkarni', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'Counselling' },
      { id: 'm5', name: 'Rohit Menon', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Clinical Psychology' },
    ],
    checkIns: [
      {
        id: 'ci1',
        authorId: 'm2',
        authorName: 'Priya Nair',
        authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
        content: 'This week I focused on setting better boundaries around work hours. I noticed I was checking emails past 9pm — managed to stop that 4 out of 5 days. Small win but meaningful.',
        timestamp: '2 hours ago',
        comments: [
          { id: 'cc1', authorName: 'Arun Desai', authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', content: 'That is a great step. I struggle with the same thing. Any specific strategies that helped?', timestamp: '1 hour ago' },
        ],
      },
      {
        id: 'ci2',
        authorId: 'm3',
        authorName: 'Arun Desai',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        content: 'Guided prompt: What is one thing you learned about yourself as a practitioner this week?\n\nI realized I tend to over-prepare for sessions when I am anxious about a particular case. This week I tried a more present-focused approach and it actually went better.',
        timestamp: '1 day ago',
        comments: [],
      },
    ],
    goals: [
      { id: 'g1', memberId: 'm2', memberName: 'Priya Nair', memberAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', professionalGoal: 'Complete 3 CPD modules on trauma-informed care', wellbeingGoal: 'Maintain a daily 10-minute mindfulness practice', weeklyCommitment: '2 hours study + 10min daily mindfulness' },
      { id: 'g2', memberId: 'm3', memberName: 'Arun Desai', memberAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', professionalGoal: 'Draft a case study for peer review by end of pod', wellbeingGoal: 'Exercise 3 times a week', weeklyCommitment: '3 hours writing + 3 exercise sessions' },
    ],
    sessions: [
      { id: 's1', title: 'Week 8 Check-In: Midpoint Reflection', date: 'Feb 20, 2026', time: '7:00 PM – 8:30 PM IST', externalLink: 'https://zoom.us/j/example', notes: 'Focus: Mid-pod reflection. Each member shares progress on goals and one insight from practice.' },
      { id: 's2', title: 'Week 9: Ethical Dilemmas Discussion', date: 'Feb 27, 2026', time: '7:00 PM – 8:30 PM IST', externalLink: 'https://zoom.us/j/example', notes: 'Bring a de-identified scenario for group discussion.' },
    ],
  },
  {
    id: 'pod-2',
    title: 'Research Methods Peer Lab',
    podType: 'Research',
    duration: '8 weeks',
    careerStage: 'Student',
    primaryGoal: 'Skill Building',
    description: 'A structured study group for psychology students working on their thesis or research proposals. Members share methodology challenges, review each other\'s work, and build accountability around research milestones.',
    memberCount: 6,
    maxMembers: 6,
    status: 'Full',
    availability: 'Weekends',
    createdBy: 'Prof. Vikram Patel',
    members: [
      { id: 'rm1', name: 'Prof. Vikram Patel', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face', role: 'Creator', careerStage: 'Senior', specialization: 'Research Methods' },
      { id: 'rm2', name: 'Kavita Iyer', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Developmental' },
      { id: 'rm3', name: 'Sameer Khan', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'I/O Psychology' },
      { id: 'rm4', name: 'Anita Rao', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Clinical' },
      { id: 'rm5', name: 'Deepak Joshi', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Research Methods' },
      { id: 'rm6', name: 'Riya Sen', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Neuropsychology' },
    ],
    checkIns: [],
    goals: [],
    sessions: [
      { id: 'rs1', title: 'Week 4: Qualitative vs Quantitative Design', date: 'Mar 1, 2026', time: '10:00 AM – 11:30 AM IST', externalLink: 'https://meet.google.com/example', notes: 'Discuss mixed-methods approaches. Bring your research question for group feedback.' },
    ],
  },
  {
    id: 'pod-3',
    title: 'Private Practice Founders Circle',
    podType: 'Founder',
    duration: '12 weeks',
    careerStage: 'Mid Career',
    primaryGoal: 'Accountability',
    description: 'For psychologists building or scaling their private practice. We discuss business challenges, marketing, and the unique ethical considerations of running a mental health business — while holding each other accountable.',
    memberCount: 4,
    maxMembers: 5,
    status: 'Open',
    availability: 'Flexible',
    createdBy: 'Dr. Arjun Mehta',
    members: [
      { id: 'fm1', name: 'Dr. Arjun Mehta', avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=100&h=100&fit=crop&crop=face', role: 'Creator', careerStage: 'Mid Career', specialization: 'Counselling' },
      { id: 'fm2', name: 'Dr. Lakshmi Rao', avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Mid Career', specialization: 'Clinical' },
      { id: 'fm3', name: 'Nikhil Gupta', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'Counselling' },
      { id: 'fm4', name: 'Sania Mirza', avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Mid Career', specialization: 'I/O Psychology' },
    ],
    checkIns: [],
    goals: [],
    sessions: [],
  },
  {
    id: 'pod-4',
    title: 'Developmental Psychology Practice Group',
    podType: 'Practice',
    duration: '8 weeks',
    careerStage: 'Student',
    primaryGoal: 'Skill Building',
    description: 'A hands-on practice group for students specializing in developmental psychology. Each week we work through case vignettes, practice assessment interpretation, and discuss developmental milestones.',
    memberCount: 5,
    maxMembers: 6,
    status: 'Open',
    availability: 'Weekday Evenings',
    createdBy: 'Dr. Sunita Verma',
    members: [
      { id: 'dm1', name: 'Dr. Sunita Verma', avatarUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop&crop=face', role: 'Creator', careerStage: 'Senior', specialization: 'Developmental' },
      { id: 'dm2', name: 'Isha Kapoor', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Developmental' },
      { id: 'dm3', name: 'Varun Sharma', avatarUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Developmental' },
      { id: 'dm4', name: 'Nandini Das', avatarUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Clinical' },
      { id: 'dm5', name: 'Arjun Pillai', avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Student', specialization: 'Developmental' },
    ],
    checkIns: [],
    goals: [],
    sessions: [],
  },
  {
    id: 'pod-5',
    title: 'I/O Psychology Networking Pod',
    podType: 'Practice',
    duration: '8 weeks',
    careerStage: 'Early Career',
    primaryGoal: 'Networking',
    description: 'Connect with fellow I/O psychology professionals to share industry insights, discuss workplace assessment tools, and build a referral network.',
    memberCount: 4,
    maxMembers: 8,
    status: 'Open',
    availability: 'Evenings',
    createdBy: 'Rajesh Kumar',
    members: [
      { id: 'io1', name: 'Rajesh Kumar', avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face', role: 'Creator', careerStage: 'Mid Career', specialization: 'I/O Psychology' },
      { id: 'io2', name: 'Fatima Sheikh', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'I/O Psychology' },
      { id: 'io3', name: 'Karthik Reddy', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'I/O Psychology' },
      { id: 'io4', name: 'Maya Patel', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face', role: 'Member', careerStage: 'Early Career', specialization: 'I/O Psychology' },
    ],
    checkIns: [],
    goals: [],
    sessions: [],
  },
];

export const CHECK_IN_PROMPTS = [
  'What is one thing you learned about yourself as a practitioner this week?',
  'What professional challenge are you sitting with right now?',
  'What boundary did you set (or need to set) this week?',
  'Share one moment from this week where you felt competent in your role.',
  'What is one thing you are doing to take care of your wellbeing?',
];