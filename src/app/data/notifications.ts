export interface Notification {
  id: string;
  type: 'application_update' | 'connection_request' | 'message' | 'system' | 'community' | 'listing_review';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  link?: { page: string; params?: Record<string, string> };
  avatarUrl?: string;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'application_update',
    title: 'Application Shortlisted',
    body: 'Your application for Junior Child Psychologist at MindCare Clinic has been shortlisted.',
    timestamp: '2026-03-30T09:15:00Z',
    isRead: false,
    link: { page: 'Opportunities' },
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&h=80&fit=crop',
  },
  {
    id: 'n2',
    type: 'connection_request',
    title: 'New Connection Request',
    body: 'Dr. Ananya Rao wants to connect with you.',
    timestamp: '2026-03-30T08:30:00Z',
    isRead: false,
    link: { page: 'Network' },
    avatarUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=80&h=80&fit=crop',
  },
  {
    id: 'n3',
    type: 'community',
    title: 'New reply in Clinical Ethics Circle',
    body: 'Priya Sharma replied to your post: "Great perspective on informed consent..."',
    timestamp: '2026-03-29T18:45:00Z',
    isRead: false,
    link: { page: 'Community' },
    avatarUrl: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?w=80&h=80&fit=crop',
  },
  {
    id: 'n4',
    type: 'listing_review',
    title: 'Listing Approved',
    body: 'Your course "CBT Foundations for Early Career Professionals" is now live.',
    timestamp: '2026-03-29T14:20:00Z',
    isRead: true,
    link: { page: 'My Listings' },
  },
  {
    id: 'n5',
    type: 'system',
    title: 'Profile Incomplete',
    body: 'Complete your profile to get better recommendations. Add your education and skills.',
    timestamp: '2026-03-29T10:00:00Z',
    isRead: true,
    link: { page: 'Profile' },
  },
  {
    id: 'n6',
    type: 'application_update',
    title: 'New Applicant',
    body: 'Arjun Desai applied to your project "AI-Driven Mental Health Chatbot".',
    timestamp: '2026-03-28T16:30:00Z',
    isRead: true,
    link: { page: 'My Listings' },
    avatarUrl: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?w=80&h=80&fit=crop',
  },
  {
    id: 'n7',
    type: 'message',
    title: 'New Message',
    body: 'Dr. Mehta sent you a message about the supervision schedule.',
    timestamp: '2026-03-28T11:15:00Z',
    isRead: true,
    link: { page: 'Messages' },
    avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&h=80&fit=crop',
  },
  {
    id: 'n8',
    type: 'system',
    title: 'Event Reminder',
    body: 'RSVP deadline for "Annual Psychology Conference 2026" is tomorrow.',
    timestamp: '2026-03-27T09:00:00Z',
    isRead: true,
    link: { page: 'Opportunities' },
  },
];
