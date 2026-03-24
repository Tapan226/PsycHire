// Shared Reviews & Feedback Data — cross-module review system

export type ReviewEntityType = 'course' | 'mentor' | 'supervisor' | 'event' | 'job' | 'project';

export interface Review {
  id: string;
  entityId: string;
  entityType: ReviewEntityType;
  userName: string;
  userAvatar: string;
  userRole: string;
  rating: number; // 1–5
  comment: string;
  date: string;
  helpful: number;
}

/* ── Mock Reviews: Mentors ── */
const MENTOR_REVIEWS: Review[] = [
  { id: 'mr-1', entityId: 'mentor-1', entityType: 'mentor', userName: 'Ananya Sharma', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Dr. Kapoor helped me navigate my RCI licensure process with incredible clarity. Her clinical insights are invaluable, and the structured session format made every meeting productive.', date: 'Feb 15, 2026', helpful: 14 },
  { id: 'mr-2', entityId: 'mentor-1', entityType: 'mentor', userName: 'Rohan Iyer', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Warm, structured, and incredibly knowledgeable. My understanding of case formulation improved dramatically after just a few sessions.', date: 'Jan 28, 2026', helpful: 11 },
  { id: 'mr-3', entityId: 'mentor-1', entityType: 'mentor', userName: 'Sneha Kulkarni', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Excellent mentorship. I appreciated the practical approach to clinical supervision prep. Would love more reading material recommendations.', date: 'Dec 10, 2025', helpful: 7 },
  { id: 'mr-4', entityId: 'mentor-2', entityType: 'mentor', userName: 'Priya Nair', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Dr. Mehta\'s guidance helped me transition from clinical work to corporate wellness seamlessly. His industry connections are a huge bonus.', date: 'Jan 15, 2026', helpful: 9 },
  { id: 'mr-5', entityId: 'mentor-2', entityType: 'mentor', userName: 'Arjun Deshmukh', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Great insights into I/O psychology career paths. Very practical and actionable advice. Responsive to messages between sessions too.', date: 'Dec 22, 2025', helpful: 6 },
  { id: 'mr-6', entityId: 'mentor-3', entityType: 'mentor', userName: 'Vikram Das', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Dr. Rajan transformed my approach to academic writing. I published my first paper within 6 months of mentorship. Her feedback is sharp and constructive.', date: 'Feb 1, 2026', helpful: 18 },
  { id: 'mr-7', entityId: 'mentor-3', entityType: 'mentor', userName: 'Sanya Gupta', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Her structured approach to research mentorship is exactly what every PhD student needs. Helped me develop a clear methodology framework.', date: 'Jan 5, 2026', helpful: 13 },
  { id: 'mr-8', entityId: 'mentor-3', entityType: 'mentor', userName: 'Kavitha Menon', userAvatar: '', userRole: 'Professional', rating: 4, comment: 'Very thorough in her review of research proposals. Sometimes sessions run over the scheduled time, which shows her dedication.', date: 'Nov 20, 2025', helpful: 5 },
  { id: 'mr-9', entityId: 'mentor-4', entityType: 'mentor', userName: 'Aisha Khan', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Dr. Joshi gave me a clear roadmap into neuropsychology. His clinical exposure advice was spot on and helped me secure a competitive internship.', date: 'Jan 10, 2026', helpful: 10 },
  { id: 'mr-10', entityId: 'mentor-5', entityType: 'mentor', userName: 'Meera Venkatesh', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Compassionate and knowledgeable mentor. Sessions on school-based intervention design were particularly valuable for my practicum.', date: 'Feb 5, 2026', helpful: 8 },
  { id: 'mr-11', entityId: 'mentor-5', entityType: 'mentor', userName: 'Rahul Bose', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Outstanding mentorship in child psychology assessment. Dr. Agarwal\'s practical wisdom from decades of practice is unmatched.', date: 'Dec 18, 2025', helpful: 12 },
];

/* ── Mock Reviews: Supervisors ── */
const SUPERVISOR_REVIEWS: Review[] = [
  { id: 'sr-1', entityId: 'sup-1', entityType: 'supervisor', userName: 'Neha Patel', userAvatar: '', userRole: 'Student', rating: 5, comment: 'An outstanding supervisor for clinical licensure. The structured approach to case conceptualization and ethical dilemmas was transformative for my practice.', date: 'Feb 20, 2026', helpful: 16 },
  { id: 'sr-2', entityId: 'sup-1', entityType: 'supervisor', userName: 'Amit Kumar', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Rigorous but supportive supervision. Helped me develop strong clinical competencies and navigate complex transference dynamics with confidence.', date: 'Jan 30, 2026', helpful: 12 },
  { id: 'sr-3', entityId: 'sup-1', entityType: 'supervisor', userName: 'Farah Sheikh', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Very thorough in reviewing session recordings. Provided detailed feedback that improved my therapeutic technique significantly. Scheduling was sometimes tricky.', date: 'Dec 12, 2025', helpful: 8 },
  { id: 'sr-4', entityId: 'sup-2', entityType: 'supervisor', userName: 'Karthik Rao', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Exceptional supervision in neuropsych assessment. The hands-on approach to test administration and interpretation was exactly what I needed for my practicum.', date: 'Feb 10, 2026', helpful: 11 },
  { id: 'sr-5', entityId: 'sup-2', entityType: 'supervisor', userName: 'Divya Nambiar', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Very knowledgeable and patient. Group supervision sessions provided diverse perspectives that enriched my learning. Highly recommended.', date: 'Jan 18, 2026', helpful: 7 },
  { id: 'sr-6', entityId: 'sup-3', entityType: 'supervisor', userName: 'Riya Saxena', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Incredibly insightful supervisor for trauma work. The emphasis on self-care alongside clinical skill development showed genuine care for supervisees.', date: 'Feb 8, 2026', helpful: 14 },
  { id: 'sr-7', entityId: 'sup-3', entityType: 'supervisor', userName: 'Manish Thakur', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Completed my RCI supervision hours under their guidance. The balance of challenge and support accelerated my professional growth tremendously.', date: 'Dec 28, 2025', helpful: 19 },
  { id: 'sr-8', entityId: 'sup-4', entityType: 'supervisor', userName: 'Anjali Mishra', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Great expertise in family systems work. Sessions were well-structured with clear learning objectives. Would appreciate more time for role-play exercises.', date: 'Jan 22, 2026', helpful: 6 },
  { id: 'sr-9', entityId: 'sup-5', entityType: 'supervisor', userName: 'Siddharth Jain', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Best supervisor for health psychology fieldwork. Practical, evidence-based, and deeply committed to supervisee development. A true role model.', date: 'Feb 14, 2026', helpful: 10 },
];

/* ── Mock Reviews: Events ── */
const EVENT_REVIEWS: Review[] = [
  { id: 'er-1', entityId: 'e1', entityType: 'event', userName: 'Dr. Sandeep Rajan', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Brilliantly organized conference. The keynote on cultural adaptations in CBT was outstanding. Networking opportunities were excellent.', date: 'Mar 10, 2026', helpful: 22 },
  { id: 'er-2', entityId: 'e1', entityType: 'event', userName: 'Priya Krishnan', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Great lineup of speakers and relevant topics. The poster session was particularly valuable for early-career researchers. Food could have been better.', date: 'Mar 9, 2026', helpful: 15 },
  { id: 'er-3', entityId: 'e1', entityType: 'event', userName: 'Rahul Verma', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Best psychology conference I have attended. The workshop on EMDR was hands-on and practical. Already planning to attend next year.', date: 'Mar 8, 2026', helpful: 18 },
  { id: 'er-4', entityId: 'e2', entityType: 'event', userName: 'Meera Iyer', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'This workshop changed my approach to psychometric testing. The hands-on practice with standardized instruments was invaluable.', date: 'Feb 25, 2026', helpful: 13 },
  { id: 'er-5', entityId: 'e2', entityType: 'event', userName: 'Arjun Patel', userAvatar: '', userRole: 'Student', rating: 4, comment: 'Very informative workshop. Small group size allowed for personalized attention. Could use more time for Q&A with the facilitators.', date: 'Feb 24, 2026', helpful: 9 },
  { id: 'er-6', entityId: 'e3', entityType: 'event', userName: 'Kavitha Reddy', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Insightful webinar on teletherapy ethics. The panel discussion was engaging and addressed real-world challenges we face daily.', date: 'Mar 5, 2026', helpful: 11 },
  { id: 'er-7', entityId: 'e4', entityType: 'event', userName: 'Nisha Sharma', userAvatar: '', userRole: 'Student', rating: 5, comment: 'The research symposium was incredibly well-organized. Got to present my pilot study and received constructive feedback from senior researchers.', date: 'Feb 28, 2026', helpful: 16 },
];

/* ── Mock Reviews: Profiles (general peer reviews) ── */
const PROFILE_REVIEWS: Review[] = [
  { id: 'pr-1', entityId: 'profile-professional', entityType: 'mentor', userName: 'Ananya Sharma', userAvatar: '', userRole: 'Student', rating: 5, comment: 'An incredibly supportive professional who goes above and beyond. Always willing to share resources and provide constructive guidance.', date: 'Feb 20, 2026', helpful: 11 },
  { id: 'pr-2', entityId: 'profile-professional', entityType: 'supervisor', userName: 'Rohan Iyer', userAvatar: '', userRole: 'Student', rating: 5, comment: 'Exceptional clinical expertise paired with genuine empathy. Supervision sessions are structured yet adaptive to individual learning needs.', date: 'Jan 15, 2026', helpful: 14 },
  { id: 'pr-3', entityId: 'profile-professional', entityType: 'mentor', userName: 'Priya Nair', userAvatar: '', userRole: 'Professional', rating: 4, comment: 'Very insightful and well-connected in the field. Mentorship provided a clear pathway for career advancement. Highly recommended.', date: 'Dec 8, 2025', helpful: 9 },
  { id: 'pr-4', entityId: 'profile-professional', entityType: 'course', userName: 'Vikram Das', userAvatar: '', userRole: 'Student', rating: 5, comment: 'The advanced psychometrics workshop was outstanding. Content was rigorous yet accessible, and the hands-on exercises were invaluable.', date: 'Jan 28, 2026', helpful: 16 },
  { id: 'pr-5', entityId: 'profile-professional', entityType: 'supervisor', userName: 'Sneha Kulkarni', userAvatar: '', userRole: 'Student', rating: 4, comment: 'A thoughtful supervisor who balances theoretical grounding with practical application. Always makes time for additional questions.', date: 'Nov 30, 2025', helpful: 7 },
  { id: 'pr-6', entityId: 'profile-student', entityType: 'project', userName: 'Dr. Meera Kapoor', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Exceptional research assistant — meticulous with data collection, proactive in literature reviews, and consistently meets deadlines. A pleasure to collaborate with.', date: 'Feb 10, 2026', helpful: 8 },
  { id: 'pr-7', entityId: 'profile-student', entityType: 'project', userName: 'Dr. Arjun Mehta', userAvatar: '', userRole: 'Professional', rating: 4, comment: 'Strong analytical skills and genuine curiosity. Contributed meaningfully to our community mental health assessment project.', date: 'Jan 5, 2026', helpful: 6 },
  { id: 'pr-8', entityId: 'profile-student', entityType: 'job', userName: 'Riya Saxena', userAvatar: '', userRole: 'Professional', rating: 5, comment: 'Impressive work ethic and excellent communication skills during the internship. Adapted quickly and delivered quality work.', date: 'Dec 20, 2025', helpful: 10 },
];

/* ── Helpers ── */
export function getReviewsForEntity(entityId: string, entityType: ReviewEntityType): Review[] {
  const all = [...MENTOR_REVIEWS, ...SUPERVISOR_REVIEWS, ...EVENT_REVIEWS, ...PROFILE_REVIEWS];
  return all.filter(r => r.entityId === entityId && r.entityType === entityType);
}

/** Get all reviews for a profile (aggregates across entity types) */
export function getProfileReviews(profileId: string): Review[] {
  const all = [...MENTOR_REVIEWS, ...SUPERVISOR_REVIEWS, ...EVENT_REVIEWS, ...PROFILE_REVIEWS];
  return all.filter(r => r.entityId === profileId).sort((a, b) => {
    // Sort most recent first
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export function getRatingDistribution(reviews: Review[]): number[] {
  const dist = [0, 0, 0, 0, 0]; // index 0 = 5-star count, index 4 = 1-star count
  reviews.forEach(r => { dist[5 - r.rating] += 1; });
  return dist;
}