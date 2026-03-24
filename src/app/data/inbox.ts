import { UserProfile, MOCK_USERS } from './community';

export type InboxContextType = 'Job' | 'Project' | 'Mentoring' | 'Community' | 'System';
export type SenderRole = 'Student' | 'Expert' | 'Company' | 'Admin' | 'System';

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO string
  attachments?: {
    name: string;
    type: 'document' | 'image';
    url: string;
  }[];
}

export interface Conversation {
  id: string;
  participants: UserProfile[]; // Excluding current user usually, or all
  context: {
    type: InboxContextType;
    label: string; // e.g., "Senior UX Researcher Application", "Open Mic: Psychology Today"
    id?: string; // Reference ID (jobId, projectId, etc.)
  };
  messages: Message[];
  lastMessageAt: string;
  unreadCount: number;
  isFlagged?: boolean;
  status: 'active' | 'archived' | 'blocked';
}

// Mock Data
export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participants: [MOCK_USERS.admin1], // Dr. Sarah
    context: {
      type: 'Mentoring',
      label: 'Mentorship Request: Clinical Psychology Path',
      id: 'm1'
    },
    messages: [
      {
        id: 'm1-1',
        senderId: 'user_admin_1',
        content: "Hi Jane, I'd be happy to discuss your career goals in clinical psychology. Your background looks promising.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        id: 'm1-2',
        senderId: 'me',
        content: "Thank you Dr. Sarah! I'm available anytime this week after 4 PM.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unreadCount: 0,
    status: 'active'
  },
  {
    id: 'c2',
    participants: [{ 
        id: 'comp_1', 
        name: 'MindWell Health', 
        role: 'Company', 
        avatarUrl: '',
        title: 'Recruitment Team'
    } as any], 
    context: {
      type: 'Job',
      label: 'Application: Junior Psychologist',
      id: 'j1'
    },
    messages: [
      {
        id: 'm2-1',
        senderId: 'comp_1',
        content: "Hello Jane, we've reviewed your application and would like to schedule a screening call.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unreadCount: 1,
    status: 'active'
  },
  {
    id: 'c3',
    participants: [{
        id: 'sys',
        name: 'PsycHIRE System',
        role: 'System',
        avatarUrl: '',
        title: 'Platform'
    } as any],
    context: {
      type: 'System',
      label: 'Profile Verification',
    },
    messages: [
      {
        id: 'm3-1',
        senderId: 'sys',
        content: "Your student verification has been approved. You now have full access to apply for jobs and mentorships.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unreadCount: 0,
    status: 'active'
  },
  {
    id: 'c4',
    participants: [
        { id: 'u2', name: 'Alex Rivera', role: 'Student', title: 'Cognitive Science Student', avatarUrl: '' } as any
    ],
    context: {
      type: 'Project',
      label: 'Project: Cognitive Behavioral Study',
      id: 'p1'
    },
    messages: [
      {
        id: 'm4-1',
        senderId: 'u2',
        content: "Hey, are you still looking for collaborators on the CBT study? I have some experience with data analysis.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      }
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    unreadCount: 1,
    status: 'active'
  }
];
