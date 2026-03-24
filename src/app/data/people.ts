import type { UserGroup, CareerStage } from './profile';
import type { StudentProfile } from './profile';

export interface Person {
  id: string;
  name: string;
  avatarUrl: string;
  userGroup: UserGroup;
  careerStage: CareerStage;
  title: string;
  location: string;
  city: string;
  specializations: string[];
  interests: string[];
  researchTopics: string[];
  bio: string;
  isVerified: boolean;
  isConnected: boolean;
  isPending: boolean;
  mutualConnections: number;
  openTo: string[];
  openToCollaboration: boolean;
  activityStatus: 'Active Recently' | 'Active Contributor' | null;
}

export const MOCK_PEOPLE: Person[] = [
  {
    id: 'p-1',
    name: 'Dr. Meera Kapoor',
    avatarUrl: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMGRvY3RvciUyMG1hdHVyZSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwY2xpbmljfGVufDF8fHx8MTc3MDk3Mjc4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Supervisor',
    title: 'Clinical Psychologist & Supervisor',
    location: 'Mumbai, India',
    city: 'Mumbai',
    specializations: ['Clinical Supervision', 'CBT', 'Trauma & PTSD'],
    interests: ['Trauma Recovery', 'Supervision Models', 'Mindfulness'],
    researchTopics: ['CBT Outcomes in Indian Populations', 'Supervisor Competency Frameworks'],
    bio: 'RCI-licensed clinical psychologist and supervisor with 15+ years of experience. Passionate about training early-career clinicians.',
    isVerified: true,
    isConnected: true,
    isPending: false,
    mutualConnections: 12,
    openTo: ['Offer Supervision', 'Research Collaboration', 'Workshops & Talks'],
    openToCollaboration: true,
    activityStatus: 'Active Contributor',
  },
  {
    id: 'p-2',
    name: 'Rohan Iyer',
    avatarUrl: 'https://images.unsplash.com/photo-1766716946027-824630dd85f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBwc3ljaG9sb2dpc3QlMjBjb25maWRlbnQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzA5NzI3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Student',
    careerStage: 'Post-grad',
    title: 'M.Phil. Clinical Trainee',
    location: 'Bangalore, India',
    city: 'Bangalore',
    specializations: ['Neuropsychology', 'Research Methods'],
    interests: ['Cognitive Rehabilitation', 'Brain Imaging', 'Assessment Tools'],
    researchTopics: ['Neuropsychological Rehabilitation', 'Cognitive Assessment Validity'],
    bio: 'M.Phil. trainee at NIMHANS exploring neuropsychological rehabilitation. Looking for research collaborators.',
    isVerified: true,
    isConnected: true,
    isPending: false,
    mutualConnections: 5,
    openTo: ['Research & Publications', 'Internships', 'Mentoring'],
    openToCollaboration: true,
    activityStatus: 'Active Recently',
  },
  {
    id: 'p-3',
    name: 'Priya Sharma',
    avatarUrl: 'https://images.unsplash.com/photo-1664636124899-4a121f1ce449?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZGlhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwcG9ydHJhaXQlMjBzdHVkaW98ZW58MXx8fHwxNzcwOTcyNzU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Mid',
    title: 'I/O Psychologist · Deloitte India',
    location: 'Delhi, India',
    city: 'Delhi',
    specializations: ['Organizational Psychology', 'Leadership Development'],
    interests: ['Workplace Wellbeing', 'Diversity & Inclusion', 'Executive Coaching'],
    researchTopics: ['Employee Burnout Prevention', 'Organizational Culture Assessment'],
    bio: 'I/O psychologist helping organizations build healthier workplaces. Consultant at Deloitte India.',
    isVerified: true,
    isConnected: false,
    isPending: false,
    mutualConnections: 3,
    openTo: ['Consulting', 'Workshops & Talks', 'Hiring'],
    openToCollaboration: false,
    activityStatus: 'Active Recently',
  },
  {
    id: 'p-4',
    name: 'Aditya Nair',
    avatarUrl: 'https://images.unsplash.com/photo-1698465281093-9f09159733b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBhY2FkZW1pYyUyMHJlc2VhcmNoZXIlMjBwb3J0cmFpdCUyMGdsYXNzZXN8ZW58MXx8fHwxNzcwOTcyNzY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Expert',
    title: 'Professor of Psychometrics',
    location: 'Pune, India',
    city: 'Pune',
    specializations: ['Psychometrics', 'Assessment Design', 'Educational Psychology'],
    interests: ['Test Development', 'Cultural Adaptation', 'Statistical Modeling'],
    researchTopics: ['Standardized Test Development', 'Cross-Cultural Assessment Validity'],
    bio: 'Professor and psychometrician specializing in standardized test development for Indian populations.',
    isVerified: true,
    isConnected: false,
    isPending: true,
    mutualConnections: 7,
    openTo: ['Research Collaboration', 'Lead Projects'],
    openToCollaboration: true,
    activityStatus: 'Active Contributor',
  },
  {
    id: 'p-5',
    name: 'Ananya Reddy',
    avatarUrl: 'https://images.unsplash.com/photo-1763830469330-476e79913f1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZGlhbiUyMHdvbWFuJTIwdGhlcmFwaXN0JTIwd2FybSUyMHNtaWxlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwOTcyNzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Student',
    careerStage: 'Undergrad',
    title: 'B.A. Psychology Student',
    location: 'Hyderabad, India',
    city: 'Hyderabad',
    specializations: ['Child Psychology', 'Play Therapy'],
    interests: ['Early Intervention', 'Trauma-Informed Care', 'NGO Work'],
    researchTopics: [],
    bio: 'B.A. Psychology final year at Osmania University. Aspiring child psychologist volunteering at an NGO.',
    isVerified: false,
    isConnected: false,
    isPending: false,
    mutualConnections: 1,
    openTo: ['Internships', 'Mentoring', 'Volunteering / CSR'],
    openToCollaboration: true,
    activityStatus: null,
  },
  {
    id: 'p-6',
    name: 'Dr. Vikram Singh',
    avatarUrl: 'https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb3V0aCUyMGFzaWFuJTIwbWFuJTIwcHJvZmVzc2lvbmFsJTIwYmxhemVyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwOTcyNzc5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Professional',
    careerStage: 'Founder',
    title: 'Founder · MindBridge Foundation',
    location: 'Chennai, India',
    city: 'Chennai',
    specializations: ['De-addiction', 'Community Mental Health', 'Program Design'],
    interests: ['Community Outreach', 'Policy Advocacy', 'Social Enterprise'],
    researchTopics: ['Community Mental Health Models', 'Substance Abuse Prevention Programs'],
    bio: 'Founder of MindBridge Foundation. Building affordable community mental health programs across Tamil Nadu.',
    isVerified: true,
    isConnected: true,
    isPending: false,
    mutualConnections: 9,
    openTo: ['Pro Bono / CSR', 'Hiring', 'Events & Conferences'],
    openToCollaboration: true,
    activityStatus: 'Active Contributor',
  },
  {
    id: 'p-7',
    name: 'Kavya Menon',
    avatarUrl: 'https://images.unsplash.com/photo-1761125135368-f13b3a427631?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHNvdXRoJTIwYXNpYW4lMjB3b21hbiUyMHN0dWRlbnQlMjBzbWlsaW5nJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwOTcyNzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Student',
    careerStage: 'Early Career',
    title: 'Counsellor · Expressive Arts Therapist',
    location: 'Kochi, India',
    city: 'Kochi',
    specializations: ['Art Therapy', 'Expressive Arts', 'Adolescent Counseling'],
    interests: ['Creative Therapies', 'Youth Mental Health', 'Self-Expression'],
    researchTopics: ['Art Therapy Outcomes in Adolescents'],
    bio: 'Recently licensed counselor integrating expressive arts into adolescent therapy. Seeking supervision hours.',
    isVerified: true,
    isConnected: false,
    isPending: false,
    mutualConnections: 4,
    openTo: ['Supervision', 'Courses', 'Mentoring'],
    openToCollaboration: true,
    activityStatus: 'Active Recently',
  },
  {
    id: 'p-8',
    name: 'Siddharth Das',
    avatarUrl: 'https://images.unsplash.com/photo-1756367141220-570ab35ec2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMGluZGlhbiUyMHdvbWFuJTIwZ3JhZHVhdGUlMjBzdHVkZW50JTIwc21pbGluZyUyMG91dGRvb3JzfGVufDF8fHx8MTc3MDk3Mjc4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    userGroup: 'Student',
    careerStage: 'Post-grad',
    title: 'M.A. Health Psychology Researcher',
    location: 'Kolkata, India',
    city: 'Kolkata',
    specializations: ['Health Psychology', 'Behavioral Medicine'],
    interests: ['Chronic Illness', 'Behavioral Interventions', 'Public Health'],
    researchTopics: ['Treatment Adherence in Chronic Illness', 'Health Behavior Change Models'],
    bio: 'M.A. Psychology student at Jadavpur University researching adherence behavior in chronic illness patients.',
    isVerified: false,
    isConnected: true,
    isPending: false,
    mutualConnections: 2,
    openTo: ['Research & Publications', 'Micro-projects / Pilots', 'Courses'],
    openToCollaboration: false,
    activityStatus: 'Active Recently',
  },
];

/* ── Derived filter option lists ── */

export const PEOPLE_SPECIALIZATIONS = Array.from(
  new Set(MOCK_PEOPLE.flatMap(p => p.specializations))
).sort();

export const PEOPLE_CITIES = Array.from(
  new Set(MOCK_PEOPLE.map(p => p.city))
).sort();

export const PEOPLE_INTERESTS = Array.from(
  new Set(MOCK_PEOPLE.flatMap(p => p.interests))
).sort();

export const PEOPLE_RESEARCH_TOPICS = Array.from(
  new Set(MOCK_PEOPLE.flatMap(p => p.researchTopics))
).sort();

export const PEOPLE_LOCATIONS = Array.from(
  new Set(MOCK_PEOPLE.map(p => p.location))
).sort();

export function getPersonById(id: string): Person | undefined {
  return MOCK_PEOPLE.find(p => p.id === id);
}

/** Convert a Person into a StudentProfile for the ProfilePage viewer */
export function personToProfile(person: Person): StudentProfile {
  return {
    fullName: person.name,
    avatarUrl: person.avatarUrl,
    userGroup: person.userGroup,
    careerStage: person.careerStage,
    location: person.location,
    verificationStatus: person.isVerified ? 'Verified' : 'Unverified',
    bio: person.bio,
    careerVision: '',
    education: [],
    specializations: person.specializations,
    populationOfInterest: '',
    languages: [],
    openTo: person.openTo,
    availabilityHours: 0,
    relocationReady: false,
    preferredWorkMode: 'Hybrid',
    supervision: { hoursCompleted: 0 },
    cvUploaded: false,
    experience: [],
    recognition: [],
  };
}
