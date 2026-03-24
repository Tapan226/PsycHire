import { MOCK_PEOPLE, type Person } from './people';

export interface ChatMessage {
  id: string;
  senderId: string; // 'me' or person id
  text: string;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  person: Person;
  messages: ChatMessage[];
  lastMessageAt: string;
  unreadCount: number;
}

export interface ConnectionRequest {
  id: string;
  person: Person;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected';
}

// Build conversations from connected people
const connectedPeople = MOCK_PEOPLE.filter(p => p.isConnected);

export const MOCK_CHAT_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat-1',
    person: connectedPeople[0], // Dr. Meera Kapoor
    messages: [
      {
        id: 'msg-1-1',
        senderId: connectedPeople[0].id,
        text: 'Hi Jane! I saw your interest in clinical supervision. I have an opening for a trainee this semester.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      },
      {
        id: 'msg-1-2',
        senderId: 'me',
        text: "That sounds wonderful, Dr. Kapoor! I'd love to learn more about the opportunity.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
      {
        id: 'msg-1-3',
        senderId: connectedPeople[0].id,
        text: "Great! Let's schedule a call this week. Are you free on Thursday afternoon?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'chat-2',
    person: connectedPeople[1], // Rohan Iyer
    messages: [
      {
        id: 'msg-2-1',
        senderId: 'me',
        text: 'Hey Rohan, are you attending the neuropsych workshop next month?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: 'msg-2-2',
        senderId: connectedPeople[1].id,
        text: "Yes! I'm presenting a poster on my rehab research. Would be great to catch up there.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
      },
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    unreadCount: 0,
  },
  {
    id: 'chat-3',
    person: connectedPeople[2], // Dr. Vikram Singh
    messages: [
      {
        id: 'msg-3-1',
        senderId: connectedPeople[2].id,
        text: 'Jane, we have a volunteer position open at MindBridge Foundation for community outreach. Thought you might be interested.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    unreadCount: 1,
  },
  {
    id: 'chat-4',
    person: connectedPeople[3], // Siddharth Das
    messages: [
      {
        id: 'msg-4-1',
        senderId: connectedPeople[3].id,
        text: 'Hi! I came across your profile. Would love to discuss potential collaboration on health psychology research.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      },
      {
        id: 'msg-4-2',
        senderId: 'me',
        text: "Sure, I'd be happy to chat! What area are you focusing on?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
      },
      {
        id: 'msg-4-3',
        senderId: connectedPeople[3].id,
        text: 'Primarily adherence behavior in chronic illness — specifically diabetes management in rural populations.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
      },
    ],
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 68).toISOString(),
    unreadCount: 0,
  },
];

// Non-connected people who sent connection requests
const nonConnectedPeople = MOCK_PEOPLE.filter(p => !p.isConnected && !p.isPending);

export const MOCK_CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: 'req-1',
    person: nonConnectedPeople[0], // Priya Sharma
    message: "Hi Jane, I'm an I/O psychologist and noticed your interest in organizational behavior. Would love to connect!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    status: 'pending',
  },
  {
    id: 'req-2',
    person: nonConnectedPeople[1], // Ananya Reddy
    message: "Hey! Fellow psych student here. I'd love to connect and share resources.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    status: 'pending',
  },
  {
    id: 'req-3',
    person: nonConnectedPeople[2], // Kavya Menon
    message: 'Hi Jane, I saw your work in CBT research. Really interesting — would love to stay connected!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'pending',
  },
];
