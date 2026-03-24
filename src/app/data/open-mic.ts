// ── Open Mic Data Types & Mock Data ──

export const OPEN_MIC_CATEGORIES = [
  '#LivedExperiences',
  '#WhatIWishIKnew',
  '#BehindTheScene',
  '#EthicsInPractice',
  '#FailureStories',
  '#SuccessStories',
  '#ThoughtLeadership',
  '#Ideas',
  '#CaseReflections',
  '#ResearchInsights',
  '#FYI',
  '#Poll',
  '#Bulletin',
] as const;

export type OpenMicCategory = (typeof OPEN_MIC_CATEGORIES)[number];

export type PostFormat = 'text' | 'image' | 'video' | 'audio' | 'link';

export interface OpenMicAuthor {
  id: string;
  name: string;
  avatarUrl: string;
  role: 'Student' | 'Professional' | 'Expert';
  title?: string;
}

export interface OpenMicComment {
  id: string;
  author: OpenMicAuthor;
  content: string;
  timestamp: string;
}

export interface OpenMicPost {
  id: string;
  category: OpenMicCategory;
  title: string;
  content: string;
  format: PostFormat;
  mediaUrl?: string;
  linkUrl?: string;
  tags: string[];
  author: OpenMicAuthor;
  timestamp: string;
  views: number;
  saves: number;
  isSaved: boolean;
  isOwn?: boolean;
  comments: OpenMicComment[];
  isReported?: boolean;
}

export const WORD_LIMIT = 2000;

// ── Mock Data ──

export const MOCK_OPEN_MIC_POSTS: OpenMicPost[] = [
  {
    id: 'om-1',
    category: '#LivedExperiences',
    title: 'What Burnout Taught Me About Boundaries',
    content: 'Three years into my clinical practice, I hit a wall I didn\'t see coming. I was taking on too many clients, saying yes to every supervision request, and ignoring my own signs of exhaustion.\n\nThe turning point came when a colleague gently pointed out that I was giving advice about self-care that I wasn\'t following myself. That moment of cognitive dissonance was uncomfortable but necessary.\n\nHere\'s what I learned: Boundaries aren\'t selfish — they\'re the foundation of sustainable practice. I now block two hours every afternoon for documentation and personal reset. My client outcomes actually improved once I started modeling the boundaries I was recommending.',
    format: 'text',
    tags: ['burnout', 'boundaries', 'self-care'],
    author: {
      id: 'a1',
      name: 'Dr. Amara Osei',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face',
      role: 'Professional',
      title: 'Clinical Psychologist',
    },
    timestamp: '2 days ago',
    views: 342,
    saves: 47,
    isSaved: false,
    comments: [
      {
        id: 'c1-1',
        author: { id: 'ca1', name: 'Jordan Lee', avatarUrl: '', role: 'Student' },
        content: 'This resonates deeply. As a student, I\'m already noticing these patterns forming. Thank you for sharing.',
        timestamp: '1 day ago',
      },
      {
        id: 'c1-2',
        author: { id: 'ca2', name: 'Dr. Priya Mehta', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face', role: 'Professional' },
        content: 'The cognitive dissonance point is so important. We often overlook our own needs while helping others recognize theirs.',
        timestamp: '1 day ago',
      },
    ],
  },
  {
    id: 'om-2',
    category: '#WhatIWishIKnew',
    title: 'The Gap Between Training and Practice',
    content: 'Nobody told me that graduate school would prepare me for the theory but not the messy reality of clinical work. The first time a client challenged my approach mid-session, I froze.\n\nWhat I wish someone had told me: It\'s okay to say "I need to think about that" in session. Clients respect honesty more than performance. The best therapists I\'ve observed aren\'t the ones with perfect interventions — they\'re the ones who can sit with uncertainty.',
    format: 'text',
    tags: ['training', 'early-career', 'clinical'],
    author: {
      id: 'a2',
      name: 'Marcus Chen',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      role: 'Student',
      title: 'Clinical Psychology Intern',
    },
    timestamp: '3 days ago',
    views: 518,
    saves: 89,
    isSaved: true,
    isOwn: true,
    comments: [
      {
        id: 'c2-1',
        author: { id: 'ca3', name: 'Dr. Ruth Adeyemi', avatarUrl: '', role: 'Expert' },
        content: 'Beautifully put, Marcus. Sitting with uncertainty is perhaps the most important clinical skill we can develop.',
        timestamp: '2 days ago',
      },
    ],
  },
  {
    id: 'om-3',
    category: '#EthicsInPractice',
    title: 'When a Client Asks to Be Friends on Social Media',
    content: 'This came up recently and I was surprised how little my training addressed it. A long-term client found my personal Instagram and sent a follow request.\n\nThe ethical guidelines are clear about dual relationships, but the emotional complexity of declining — and explaining why — required more nuance than any textbook prepared me for. I ended up having one of the most productive sessions we\'d ever had, exploring what that request meant within our therapeutic relationship.',
    format: 'text',
    tags: ['ethics', 'dual-relationships', 'social-media'],
    author: {
      id: 'a3',
      name: 'Dr. Sarah Kline',
      avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=100&h=100&fit=crop&crop=face',
      role: 'Professional',
      title: 'Counselling Psychologist',
    },
    timestamp: '4 days ago',
    views: 276,
    saves: 34,
    isSaved: false,
    comments: [],
  },
  {
    id: 'om-4',
    category: '#FailureStories',
    title: 'The Research Proposal That Got Rejected Three Times',
    content: 'My longitudinal study on adolescent resilience was rejected by three funding bodies before it finally got approved. Each rejection felt personal.\n\nWhat changed wasn\'t the core idea — it was how I framed the practical impact. Reviewers wanted to see how the research would translate into actionable interventions, not just contribute to literature. The final version had a community partnership component that made all the difference.\n\nFailure taught me that good science needs good storytelling.',
    format: 'text',
    tags: ['research', 'rejection', 'resilience', 'funding'],
    author: {
      id: 'a4',
      name: 'Prof. David Nkomo',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      role: 'Expert',
      title: 'Research Professor',
    },
    timestamp: '5 days ago',
    views: 412,
    saves: 61,
    isSaved: false,
    comments: [
      {
        id: 'c4-1',
        author: { id: 'ca4', name: 'Lisa Huang', avatarUrl: '', role: 'Student' },
        content: 'The "good science needs good storytelling" line is going on my wall. Thank you for normalizing rejection.',
        timestamp: '4 days ago',
      },
      {
        id: 'c4-2',
        author: { id: 'ca5', name: 'Dr. James Okafor', avatarUrl: '', role: 'Professional' },
        content: 'Community partnerships changed my research trajectory too. Such an underrated approach.',
        timestamp: '3 days ago',
      },
    ],
  },
  {
    id: 'om-5',
    category: '#ResearchInsights',
    title: 'Why Mixed Methods Changed How I Think About Evidence',
    content: 'I was a hard quantitative researcher until I supervised a student who used mixed methods for their thesis. Watching qualitative data illuminate what the numbers couldn\'t capture was humbling.\n\nNow I advocate for methodological pluralism. The "best" method is the one that answers your question most honestly — not the one that produces the most impressive p-values.',
    format: 'text',
    tags: ['research-methods', 'mixed-methods', 'evidence'],
    author: {
      id: 'a5',
      name: 'Dr. Elena Vasquez',
      avatarUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&h=100&fit=crop&crop=face',
      role: 'Professional',
      title: 'Research Psychologist',
    },
    timestamp: '1 week ago',
    views: 203,
    saves: 28,
    isSaved: false,
    comments: [],
  },
  {
    id: 'om-6',
    category: '#SuccessStories',
    title: 'From Imposter Syndrome to Published Author',
    content: 'Two years ago I almost didn\'t submit my manuscript because I was convinced it wasn\'t good enough. My mentor pushed me to send it anyway.\n\nIt was accepted with minor revisions. The reviewers called it "a refreshing perspective on community mental health." I share this not to brag, but because I know there are others sitting on brilliant work, paralyzed by self-doubt.\n\nSubmit the paper. Apply for the grant. Raise your hand. The worst they can say is no.',
    format: 'text',
    tags: ['imposter-syndrome', 'publishing', 'mentorship'],
    author: {
      id: 'a6',
      name: 'Thandiwe Moyo',
      avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face',
      role: 'Student',
      title: 'Doctoral Candidate',
    },
    timestamp: '1 week ago',
    views: 687,
    saves: 112,
    isSaved: true,
    isOwn: true,
    comments: [
      {
        id: 'c6-1',
        author: { id: 'ca6', name: 'Dr. Amara Osei', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', role: 'Professional' },
        content: 'Congratulations, Thandiwe! This is such an important message for our community.',
        timestamp: '6 days ago',
      },
    ],
  },
  {
    id: 'om-7',
    category: '#ThoughtLeadership',
    title: 'Psychology Needs to Reckon With Its Colonial Roots',
    content: 'Most assessment tools we use were developed in Western, educated, industrialized contexts. When we apply them uncritically across cultures, we risk pathologizing normal variations in human experience.\n\nI\'m not suggesting we abandon standardized assessment — I\'m suggesting we develop it further. We need more culturally-grounded frameworks, developed with communities rather than imposed upon them.',
    format: 'text',
    tags: ['decolonization', 'cultural-psychology', 'assessment'],
    author: {
      id: 'a7',
      name: 'Dr. Kwame Asante',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      role: 'Expert',
      title: 'Community Psychologist',
    },
    timestamp: '1 week ago',
    views: 534,
    saves: 78,
    isSaved: false,
    comments: [
      {
        id: 'c7-1',
        author: { id: 'ca7', name: 'Marcus Chen', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', role: 'Student' },
        content: 'This is the conversation we need to be having. Thank you for framing it so constructively.',
        timestamp: '5 days ago',
      },
    ],
  },
  {
    id: 'om-8',
    category: '#BehindTheScene',
    title: 'A Day in the Life of a School Psychologist',
    content: 'People think I sit in an office and do assessments all day. Here\'s what yesterday actually looked like:\n\n8:00 — Crisis consultation for a student who disclosed self-harm\n9:30 — Teacher training on trauma-informed classroom practices\n11:00 — Three back-to-back cognitive assessments\n1:00 — Lunch (ate at my desk while writing IEP reports)\n2:00 — Parent meeting about accommodations\n3:30 — Supervision with my intern\n4:30 — Finally started the documentation I planned to do at 9am\n\nIt\'s chaotic, exhausting, and the most meaningful work I\'ve ever done.',
    format: 'text',
    tags: ['school-psychology', 'day-in-life', 'assessment'],
    author: {
      id: 'a8',
      name: 'Nadia Petrov',
      avatarUrl: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?w=100&h=100&fit=crop&crop=face',
      role: 'Professional',
      title: 'School Psychologist',
    },
    timestamp: '2 weeks ago',
    views: 445,
    saves: 53,
    isSaved: false,
    comments: [],
  },
  {
    id: 'om-9',
    category: '#Ideas',
    title: 'What If We Had Peer Debriefing as Standard Practice?',
    content: 'In medicine, morbidity and mortality conferences are standard. In psychology, we mostly process difficult cases alone or in sporadic supervision.\n\nWhat if every practice had a monthly, structured peer debriefing session? Not for pathology, but for professional growth and emotional processing. I think it would dramatically reduce burnout and improve clinical outcomes.',
    format: 'text',
    tags: ['peer-support', 'innovation', 'professional-development'],
    author: {
      id: 'a9',
      name: 'Dr. Rachel Kim',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      role: 'Professional',
      title: 'Clinical Psychologist',
    },
    timestamp: '2 weeks ago',
    views: 298,
    saves: 42,
    isSaved: false,
    comments: [
      {
        id: 'c9-1',
        author: { id: 'ca8', name: 'Prof. David Nkomo', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', role: 'Expert' },
        content: 'This aligns with the peer pod model. Structured reflection is powerful.',
        timestamp: '1 week ago',
      },
    ],
  },
  {
    id: 'om-10',
    category: '#FYI',
    title: 'New APA Guidelines on Digital Mental Health Released',
    content: 'The APA just released updated practice guidelines for digital mental health services, including telehealth, app-based interventions, and AI-assisted tools.\n\nKey takeaways: informed consent requirements for digital tools, data privacy standards, and a framework for evaluating app effectiveness. Worth reading if you do any remote work.\n\nLink to the full guidelines in the comments.',
    format: 'text',
    tags: ['APA', 'guidelines', 'digital-health', 'telehealth'],
    author: {
      id: 'a10',
      name: 'Dr. Michael Torres',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      role: 'Professional',
      title: 'Digital Health Psychologist',
    },
    timestamp: '2 weeks ago',
    views: 621,
    saves: 94,
    isSaved: false,
    comments: [],
  },
];