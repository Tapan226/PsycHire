# PsycHIRE — Complete Feature Tracker

**Last Updated:** March 16, 2026
**Total Features:** 280+
**Modules:** 7 workflow modules + Funding + Community + Admin + Platform

---

## Legend

| Column | Description |
|---|---|
| **Module** | Top-level grouping |
| **Area** | Lifecycle stage (Discovery → Creation → Management → Hub → Admin) |
| **Feature** | What was built |
| **Flow** | Crisp user path / interaction description |
| **Priority** | P0 = Foundation, P1 = Core Loop, P2 = Expand, P3 = Deepen, P4 = Polish |
| **Build** | Done · Partial · Not Started |
| **QA** | Passed · Pending · Blocked |
| **Notes** | Implementation details or caveats |

---

## ▸ AUTH & ONBOARDING

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Auth | Login | Login page | Enter email + password → Submit → Dashboard | P1 | Done | Pending |
Auth | Login | "Sign Up" link | Click → navigates to Signup page | P1 | Done | Pending |
Auth | Signup | Signup page | Fill name + email + password → Submit → Onboarding | P1 | Done | Pending |
Auth | Signup | "Already have account" link | Click → back to Login | P1 | Done | Pending |
Auth | Onboarding | Multi-step onboarding | Step 1 (Role) → Step 2 (Interests) → Step 3 (Profile details) → Complete → Dashboard | P1 | Done | Pending |
Auth | Session | Logout | Profile dropdown → Logout → Login page | P1 | Done | Pending |
Auth | Roles | Role switcher | Profile dropdown → Select role (Student/Pro/Company/Admin) → Dashboard resets | P1 | Done | Pending | Switches mock user data per role

---

## ▸ NAVIGATION & LAYOUT

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Nav | Header | Desktop nav bar | Logo + horizontal nav pills → click → navigate; active pill highlighted | P0 | Done | Pending |
Nav | Header | Profile dropdown | Click avatar → Menu: role switcher, settings, messages, logout | P0 | Done | Pending |
Nav | Header | Connection requests popover | Click icon → Popover with pending requests → Accept/Reject | P2 | Done | Pending |
Nav | Header | Notification bell (InboxPopover) | Click bell → Dropdown with unread count → Notification list → Mark as read | P2 | Done | Pending | Types: apps, reviews, connections, system
Nav | Header | Mobile hamburger drawer | Tap hamburger → Slide-in drawer with full nav (rendered outside `<header>`) | P0 | Done | Pending |
Nav | Header | Role-adaptive nav items | Company sees "My Listings"; Admin sees "Admin Dashboard"; others get standard nav | P0 | Done | Pending |
Nav | Mobile | Mobile bottom nav | Fixed bottom bar (< lg breakpoint): Home, Opportunities, Learning, Network, Community | P4 | Done | Pending |
Nav | Routing | State-driven navigation | `currentPage` + `handleNavigate(page, params?)` in App.tsx | P0 | Done | Pending |
Nav | Routing | History stack + goBack | `navHistoryRef` (useRef array) + `goBack()` pops stack → navigates to previous page | P0 | Done | Pending |
Nav | Routing | Page alias redirects | `resolvePageName()`: 'Home'→'Dashboard', 'Jobs'→'Opportunities', etc. | P0 | Done | Pending |
Nav | Routing | Tab state restoration | `restoreTabState()` preserves sub-tab when back-navigating to tabbed pages | P0 | Done | Pending |

---

## ▸ HOME DASHBOARD

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Home | Dashboard | Welcome section | Greeting with user name + avatar + role context | P1 | Done | Pending |
Home | Dashboard | New user onboarding prompts | If `isNewUser` → shows setup steps (complete profile, explore jobs, etc.) | P1 | Done | Pending |
Home | Dashboard | Recommended jobs/projects | Horizontal card row → Click card → detail page | P1 | Done | Pending |
Home | Dashboard | In-progress items | List of active mentorships, supervisions, projects, events → Click → navigate | P1 | Done | Pending |
Home | Dashboard | Upcoming events section | Next events cards → Click → EventDetails | P2 | Done | Pending |
Home | Dashboard | Suggestion cards | Sidebar: mentor/course suggestions → Click → navigate | P2 | Done | Pending |
Home | Dashboard | Role-aware content | Student sees internships; Professional sees consulting; Company sees hiring dashboard link | P1 | Done | Pending |

---

## ▸ JOBS

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Jobs | Discovery | Browse jobs with filters | Opportunities → Jobs tab → Scroll cards; filter sidebar on left | P1 | Done | Pending |
Jobs | Discovery | Job filters | Location, type, experience, salary, mode dropdowns → Apply → filtered list | P1 | Done | Pending | `jobs/JobFilters.tsx`
Jobs | Discovery | Job card | Card: title, company, location, salary, type, save toggle, share icon, featured badge | P1 | Done | Pending |
Jobs | Discovery | Job detail page | Click card → Full detail: description, requirements, benefits, apply CTA, similar jobs | P1 | Done | Pending |
Jobs | Discovery | Apply: choose method | Click Apply → Modal: "Apply with Profile" or "Apply on External Site" | P1 | Done | Pending | `jobs/ApplyMethodModal.tsx`
Jobs | Discovery | Apply with Profile flow | Select Profile method → Review profile snapshot → Attach cover letter → Submit → Success | P1 | Done | Pending | `jobs/ApplyWithProfileModal.tsx`
Jobs | Discovery | Application status tracking | My Applications sub-tab → Status chips (Applied/Shortlisted/Rejected/Hired) per job | P1 | Done | Pending | `jobs/ApplicationTrackerItem.tsx`
Jobs | Discovery | Share modal | Card share icon or Detail page share → Modal: Copy Link / WhatsApp / Email / LinkedIn | P1 | Done | Pending | Shared `ShareModal.tsx`
Jobs | Discovery | Report/flag | Detail page flag icon → Report modal: reason picker → optional notes → submit | P1 | Done | Pending | Shared `ReportModal.tsx`
Jobs | Discovery | Role-based restrictions | Students → only see internships, volunteering, early career; filter auto-applied | P1 | Done | Pending |
Jobs | Discovery | Similar jobs section | Bottom of detail page → "Similar Jobs" card row → Click → new detail | P2 | Done | Pending | `SimilarSection.tsx`
Jobs | Discovery | Cross-link nudge | Low/empty results → "Also check out Projects / Events" CTA | P2 | Done | Pending | `CrossLinkNudge.tsx`
Jobs | Discovery | Sub-tabs (Explore/Saved/Applied) | Jobs tab → sub-tabs: Explore (browse), Saved (bookmarked), Applied (tracking) | P1 | Done | Pending |
Jobs | Discovery | Skeleton loading | Initial load → skeleton card placeholders → fade in real cards | P2 | Done | Pending | `SkeletonCards.tsx`
Jobs | Creation | Create Job form | My Listings → Create New → 4-step wizard: Basic Info → Requirements → Compensation → Review | P1 | Done | Pending | `CreateJobPage.tsx` + `CreateFormWizard`
Jobs | Creation | Edit Job | My Listings → listing card → Edit → same wizard pre-filled (editMode) | P1 | Done | Pending | Reuses `CreateJobPage.tsx`
Jobs | Creation | Save Draft | Any wizard step → "Save Draft" → returns to Company Dashboard; listing shows as Draft | P1 | Done | Pending |
Jobs | Creation | Preview before submit | Review step renders `JobDetailsPage` in read-only mode | P1 | Done | Pending |
Jobs | Creation | Compliance checklist | Submit → modal with checklist (non-discriminatory language, salary, deadline, contact) → all checked → confirm | P1 | Done | Pending | `ComplianceChecklist.tsx`
Jobs | Creation | Submit for admin approval | Compliance confirmed → "Submitted for Review" success → listing status = `pending_review` | P1 | Done | Pending |
Jobs | Management | My Jobs tab | Company Dashboard → Jobs tab → all listings with status badges (Draft/Pending/Active/Closed/Rejected) | P1 | Done | Pending |
Jobs | Management | Status filter tabs | All / Drafts / Under Review / Active / Rejected / Changes Needed / Closed | P1 | Done | Pending |
Jobs | Management | View applications | Listing card → "Applications" button → `JobApplicationsPage` with applicant list | P1 | Done | Pending | `JobApplicationsPage.tsx`
Jobs | Management | Respond to applications | Applicant row → status dropdown: Pending → Shortlisted → Accepted → Hired / Rejected | P1 | Done | Pending | `ApplicationListView.tsx`
Jobs | Management | Listing actions | Card → ⋯ menu: Edit, Close, Extend, Delete, Duplicate, Archive | P1 | Done | Pending | `ListingActions.tsx`
Jobs | Management | Status lifecycle | Visual timeline on listing card showing New → Active → Interviews → Closed | P2 | Done | Pending | `StatusLifecycle.tsx`
Jobs | Management | Search listings | Search bar in Company Dashboard → filter by title | P2 | Done | Pending |
Jobs | Admin | Jobs review queue | Admin Dashboard → Review Queue → Jobs tab → pending listings | P1 | Done | Pending |
Jobs | Admin | Approve / Reject with message | Review card → Approve (goes live) or Reject (message field → company notified) | P1 | Done | Pending | `AdminReviewCard.tsx`
Jobs | Admin | Suggest Edit | Review card → "Suggest Edit" → message → listing marked `changes_requested` | P1 | Done | Pending |
Jobs | Admin | Bulk approve | Multi-select checkboxes → "Approve Selected" button | P3 | Done | Pending |

---

## ▸ PROJECTS

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Projects | Discovery | Browse projects with filters | Opportunities → Projects tab → Scroll cards; filter sidebar | P2 | Done | Pending |
Projects | Discovery | Project filters | Type, segment, format, level, duration dropdowns → Apply | P2 | Done | Pending | `projects/ProjectFilters.tsx`
Projects | Discovery | Project card | Card: title, type, org, duration, skills, save toggle, share icon | P2 | Done | Pending |
Projects | Discovery | Project detail page | Click card → Full detail: description, team roles, compensation, timeline, apply CTA | P2 | Done | Pending |
Projects | Discovery | Apply with Statement of Interest | Click Apply → Modal: SOI text area + profile snapshot → Submit → Success | P2 | Done | Pending | `ApplicationModal.tsx`
Projects | Discovery | Share / Report | Same shared modals as Jobs | P2 | Done | Pending |
Projects | Discovery | Similar projects section | Bottom of detail page → "Similar Projects" | P2 | Done | Pending |
Projects | Discovery | Sub-tabs (All/Saved) | Projects tab → sub-tabs: All Projects, Saved | P2 | Done | Pending |
Projects | Discovery | Skeleton loading | Skeleton card placeholders during load | P2 | Done | Pending |
Projects | Creation | Create Project form | My Listings → Create New → 4-step wizard: Basics → Details & Team → Compensation & Timeline → Review | P2 | Done | Pending | `CreateProjectPage.tsx`
Projects | Creation | Edit Project | Listing card → Edit → same wizard pre-filled | P2 | Done | Pending |
Projects | Creation | Save Draft + Compliance + Submit | Same pattern as Jobs: draft save, checklist, admin submit | P2 | Done | Pending |
Projects | Creation | Project limit enforcement | Max projects check before creation | P2 | Done | Pending |
Projects | Management | My Projects tab | Company Dashboard → Projects tab → listings with status badges | P2 | Done | Pending |
Projects | Management | Project applications | Listing card → "Applications" button → applicant list | P2 | Not Started | Blocked | `ProjectApplicationsPage` missing — gap identified
Projects | Admin | Projects review queue | Admin Dashboard → Review Queue → Projects tab | P2 | Done | Pending |

---

## ▸ REFERRALS

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Referrals | Discovery | Browse referrals | Opportunities → Referrals tab → cards with urgency badges; sort by urgency/deadline/newest | P2 | Done | Pending |
Referrals | Discovery | Referral card | Card: title, specialization, location, urgency badge, deadline, respondent count, student-eligible tag | P2 | Done | Pending |
Referrals | Discovery | Referral detail page | Click card → Full detail: prerequisites, client info, duration, experience level, respond CTA | P2 | Done | Pending | `ReferralDetailPage.tsx`
Referrals | Discovery | Respond to referral | Detail page → Respond → Modal: note + qualifications → Submit → Success | P2 | Done | Pending | `referrals/RespondModal.tsx`
Referrals | Discovery | Share / Report | Same shared modals | P2 | Done | Pending |
Referrals | Discovery | Sub-tabs (All/My Referrals/Closed) | Referrals tab → sub-tabs; My Referrals shows Created + Responded child tabs | P2 | Done | Pending | Students see no sub-tabs
Referrals | Discovery | Skeleton loading | Skeleton card placeholders | P2 | Done | Pending |
Referrals | Creation | Create Referral form (full wizard) | Opportunities → Referrals tab → "Create Referral" CTA → 3-step wizard: Basic Info → Details & Requirements → Review | P2 | Done | Pending | `CreateReferralPage.tsx`; replaced old `ReferralFormModal`
Referrals | Creation | Edit Referral | Company Dashboard → Referrals tab → Edit → wizard pre-filled | P2 | Done | Pending | Reuses `CreateReferralPage.tsx` (editMode)
Referrals | Creation | Save Draft + Compliance + Submit | Draft save, 6-item compliance checklist (confidentiality, ethics, accuracy, non-discrimination, deadline, contact), admin submit | P2 | Done | Pending |
Referrals | Creation | Create Referral CTA on Opportunities page | Professional OR Company on Referrals tab → "Create Referral" button → navigates to CreateReferralPage | P2 | Done | Pending |
Referrals | Management | My Referrals tab | Company Dashboard → Referrals tab → listings with status badges (Draft/Pending/Active/Closed) | P2 | Done | Pending |
Referrals | Management | View respondents | Listing card → "Respondents" button → `ReferralRespondentsPage` with respondent list | P2 | Done | Pending | `ReferralRespondentsPage.tsx`
Referrals | Management | Respond to respondents | Respondent row → status dropdown: Pending → Shortlisted → Accepted / Declined | P2 | Done | Pending | Uses `ApplicationListView.tsx`
Referrals | Management | Listing actions | Card → Edit / Close / Delete | P2 | Done | Pending |
Referrals | Admin | Referrals review queue | Admin Dashboard → Review Queue → Referrals tab → pending referrals | P2 | Done | Pending |
Referrals | Admin | Approve / Reject / Suggest Edit | Same AdminReviewCard pattern with preview navigation to ReferralDetail | P2 | Done | Pending |

---

## ▸ COURSES

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Courses | Discovery | Browse courses with filters | Learning → Courses tab → Scroll cards; filter sidebar | P2 | Done | Pending |
Courses | Discovery | Course filters | Specialization, type, mode, duration, fees, outcome dropdowns | P2 | Done | Pending | `courses/CourseFilters.tsx`
Courses | Discovery | Course card | Card: title, provider, mode, duration, fee, rating stars, save toggle | P2 | Done | Pending |
Courses | Discovery | Course detail page | Click card → Full detail: curriculum, schedule, instructor, prerequisites, reviews, enroll CTA | P2 | Done | Pending | `CourseDetailsPage.tsx`
Courses | Discovery | Enrollment modal | Click Enroll → Modal: prerequisite check → confirm details → submit → success | P2 | Done | Pending | `courses/EnrollmentModal.tsx`
Courses | Discovery | Ratings & reviews on course | Detail page → Reviews section: rating distribution bar, review cards, "Write a Review" form | P2 | Done | Pending | `courses/RatingsReviews.tsx` + `FeedbackReviews.tsx`
Courses | Discovery | Request Course (Company only) | Company role → "Request a Course" CTA → Modal: describe training need → submit | P3 | Done | Pending | `courses/RequestCourseModal.tsx`
Courses | Discovery | Nominate Employees (Company) | Company role → "Nominate Employees" → Modal: select employees from roster → bulk enroll | P3 | Done | Pending | `courses/NominateEmployeesModal.tsx`
Courses | Discovery | Share / Report | Same shared modals | P2 | Done | Pending |
Courses | Discovery | Calendar .ics download | Detail page → "Add to Calendar" → downloads .ics file | P3 | Done | Pending | `utils/calendar.ts`
Courses | Discovery | Sub-tabs (Explore/Enrolled/Saved/Completed) | Courses tab → sub-tabs with enrollment status tracking | P2 | Done | Pending |
Courses | Discovery | Skeleton loading | Skeleton card placeholders | P2 | Done | Pending |
Courses | Creation | Create Course form | My Listings → Create New → Multi-step wizard: Course Info → Curriculum & Schedule → Pricing & Enrollment → Preview | P2 | Done | Pending | `CreateCoursePage.tsx`
Courses | Creation | Edit Course | Listing card → Edit → wizard pre-filled | P2 | Done | Pending |
Courses | Creation | Save Draft + Compliance + Submit | Same pattern | P2 | Done | Pending |
Courses | Management | My Courses tab | Company Dashboard → Courses tab → listings with status badges | P2 | Done | Pending |
Courses | Management | View enrollments | Listing card → "Enrollments" button → `CourseEnrollmentsPage` | P2 | Done | Pending | `CourseEnrollmentsPage.tsx`
Courses | Management | Respond to enrollments | Enrollee row → status dropdown: Pending → Accepted / Waitlisted / Rejected / Enrolled | P2 | Done | Pending |
Courses | Admin | Courses review queue | Admin Dashboard → Review Queue → Courses tab | P2 | Done | Pending |

---

## ▸ EVENTS

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Events | Discovery | Browse events with filters | Network → Events tab → Scroll cards; filter sidebar | P2 | Done | Pending |
Events | Discovery | Event filters | Status, type, format, location dropdowns | P2 | Done | Pending | `events/EventFilters.tsx`
Events | Discovery | Event card with tags | Card: title, date, location, type, tags (Trending/Featured/Upcoming), save, share | P2 | Done | Pending |
Events | Discovery | Event detail page | Click card → Full detail: agenda, speakers, venue, action buttons, similar events | P2 | Done | Pending | `EventDetailsPage.tsx`
Events | Discovery | RSVP modal | Action button → RSVP form → submit → success | P2 | Done | Pending | `events/EventParticipationModals.tsx`
Events | Discovery | Call for Papers modal | Action button → Abstract + upload → submit → success | P2 | Done | Pending | `events/EventParticipationModals.tsx`
Events | Discovery | Speaker application modal | Action button → Speaker bio + topics → submit → success | P2 | Done | Pending | `events/EventParticipationModals.tsx`
Events | Discovery | Sponsorship interest modal | Action button → Sponsorship tier + details → submit → success | P2 | Done | Pending | `events/EventParticipationModals.tsx`
Events | Discovery | Calendar .ics download | Detail page → "Add to Calendar" → downloads .ics | P3 | Done | Pending |
Events | Discovery | Share / Report | Same shared modals | P2 | Done | Pending |
Events | Discovery | Skeleton loading | Skeleton card placeholders | P2 | Done | Pending |
Events | Creation | Create Event form | My Listings → Create New → Extended wizard: Basic Info → Schedule & Venue → Speakers & Agenda → Action Buttons Config → Preview | P2 | Done | Pending | `CreateEventPage.tsx`
Events | Creation | Edit Event | Listing card → Edit → wizard pre-filled | P2 | Done | Pending |
Events | Creation | Action button config | Wizard step → Toggle on/off: RSVP / Papers / Speakers / Sponsors → configure each form | P2 | Done | Pending |
Events | Creation | Save Draft + Compliance + Submit | Same pattern | P2 | Done | Pending |
Events | Management | My Events tab | Company Dashboard → Events tab → listings with status badges + registration counts | P2 | Done | Pending |
Events | Management | View registrations | Listing card → "Registrations" button → `EventRegistrationsPage` with tab per participation type | P2 | Done | Pending | `EventRegistrationsPage.tsx`
Events | Management | Manage registrations | Registrant row → status dropdown: Pending → Accepted / Waitlisted / Rejected / Confirmed | P2 | Done | Pending |
Events | Admin | Events review queue | Admin Dashboard → Review Queue → Events tab | P2 | Done | Pending |

---

## ▸ SUPERVISION

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Supervision | Discovery | Browse supervision with filters | Learning → Supervision tab → Scroll cards; filter controls | P2 | Done | Pending |
Supervision | Discovery | Supervisor card | Card: name, avatar, specialization, mode, rating stars, fee, save, apply CTA | P2 | Done | Pending | `SupervisorCard.tsx`
Supervision | Discovery | Supervisor profile page | Click card → Full profile: bio, domain, specializations, mode, session type, fee, reviews, apply CTA | P2 | Done | Pending | `SupervisorProfilePage.tsx`
Supervision | Discovery | Apply flow | Profile page → Apply → confirmation modal → submit → success | P2 | Done | Pending |
Supervision | Discovery | Share / Report | Same shared modals | P2 | Done | Pending |
Supervision | Creation | Create Supervision form | My Listings → Create New → Multi-step wizard with brochure upload | P2 | Done | Pending | `CreateSupervisionPage.tsx`
Supervision | Creation | Save Draft + Compliance + Submit | Same pattern | P2 | Done | Pending |
Supervision | Management | My Supervision tab | Company Dashboard → Supervision tab → listings with status badges | P2 | Done | Pending |
Supervision | Management | View applicants | Listing card → "Applicants" button → `SupervisionApplicantsPage` | P2 | Done | Pending | `SupervisionApplicantsPage.tsx`
Supervision | Management | Respond to applicants | Applicant row → status dropdown: Pending → Accepted / Waitlisted / Rejected / Enrolled | P2 | Done | Pending |
Supervision | Hub | Hub workspace page | Accepted applicants → Hub entry → Tabbed workspace with all hub features | P3 | Done | Pending | `SupervisionHubPage.tsx`
Supervision | Hub | Session scheduler | Hub → Sessions tab → Add session (date, time, agenda) → calendar display | P3 | Done | Pending |
Supervision | Hub | Participant management | Hub → Participants tab → list with roles, status, contact actions | P3 | Done | Pending |
Supervision | Hub | Discussion forum | Hub → Discussion tab → Post questions / replies; threaded conversation | P3 | Done | Pending | Uses `QAForum.tsx`
Supervision | Hub | Resource sharing | Hub → Resources tab → Upload/link resources → download/view | P3 | Done | Pending |
Supervision | Hub | Attendance & hours tracking | Hub → Attendance tab → Log sessions, mark present, cumulative hours display | P3 | Done | Pending |
Supervision | Hub | Assessment | Hub → Assessment tab → Review performance metrics, notes | P3 | Done | Pending |
Supervision | Hub | Guidelines | Hub → Guidelines tab → Display supervision agreement, rules, expectations | P3 | Done | Pending |
Supervision | Hub | Calendar integration (.ics) | Session card → "Add to Calendar" → downloads .ics | P3 | Done | Pending |
Supervision | Admin | Supervision review queue | Admin Dashboard → Review Queue → Supervision tab | P2 | Done | Pending |

---

## ▸ MENTORING

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Mentoring | Discovery | Browse mentoring cohorts with filters | Learning → Mentorship tab → Scroll cards; filter controls | P2 | Done | Pending |
Mentoring | Discovery | Mentor card | Card: name, avatar, specialization, cohort type, rating stars, fee, save, join CTA | P2 | Done | Pending | `MentorCard.tsx`
Mentoring | Discovery | Mentor profile page | Click card → Full profile: bio, domain, mentorship focus, fee, reviews, join CTA | P2 | Done | Pending | `MentorProfilePage.tsx`
Mentoring | Discovery | Join/Apply flow | Profile page → Join → confirmation modal → submit → success | P2 | Done | Pending |
Mentoring | Discovery | Share / Report | Same shared modals | P2 | Done | Pending |
Mentoring | Creation | Create Cohort form | My Listings → Create New → Multi-step wizard | P2 | Done | Pending | `CreateCohortPage.tsx`
Mentoring | Creation | Save Draft + Compliance + Submit | Same pattern | P2 | Done | Pending |
Mentoring | Management | My Mentoring tab | Company Dashboard → Mentoring tab → listings with status badges | P2 | Done | Pending |
Mentoring | Management | View applicants | Listing card → "Applicants" button → `CohortApplicantsPage` | P2 | Done | Pending | `CohortApplicantsPage.tsx`
Mentoring | Management | Respond to applicants | Applicant row → status dropdown: Pending → Accepted / Waitlisted / Rejected / Enrolled | P2 | Done | Pending |
Mentoring | Hub | Hub workspace page | Accepted members → Hub entry → Tabbed workspace | P3 | Done | Pending | `CohortHubPage.tsx`
Mentoring | Hub | Session scheduler (1:1 + group) | Hub → Sessions tab → Add 1:1 or group sessions → calendar display | P3 | Done | Pending |
Mentoring | Hub | Participant management | Hub → Participants tab → member list with roles | P3 | Done | Pending |
Mentoring | Hub | Q&A / Discussion forum | Hub → Q&A tab → Ask/answer questions; threaded | P3 | Done | Pending | Uses `QAForum.tsx`
Mentoring | Hub | Resource sharing | Hub → Resources tab → Upload/link resources | P3 | Done | Pending |
Mentoring | Hub | Attendance & hours tracking | Hub → Attendance tab → session logs | P3 | Done | Pending |
Mentoring | Hub | Assessment | Hub → Assessment tab → performance review | P3 | Done | Pending |
Mentoring | Hub | Calendar integration (.ics) | Session card → "Add to Calendar" → downloads .ics | P3 | Done | Pending |
Mentoring | Admin | Mentoring review queue | Admin Dashboard → Review Queue → Mentoring tab | P2 | Done | Pending |

---

## ▸ FUNDING

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Funding | Discovery | Browse funding with filters | Funding nav → Scroll cards; filter sidebar | P3 | Done | Pending |
Funding | Discovery | Funding filters | Type, eligibility, amount, deadline dropdowns | P3 | Done | Pending | `funding/FundingFilters.tsx`
Funding | Discovery | Funding card | Card: title, funder, amount, deadline, eligibility, type badge | P3 | Done | Pending | `funding/FundingCard.tsx`
Funding | Discovery | Funding detail page | Click card → Full detail: description, eligibility, application process, deadlines | P3 | Done | Pending | `FundingDetailPage.tsx`

---

## ▸ COMMUNITY — CIRCLES

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Community | Circles | Browse circles | Community → Circles tab → Circle cards grid | P3 | Done | Pending |
Community | Circles | Circle card | Card: name, member count, description, join CTA | P3 | Done | Pending | `community/CommunityCircleCard.tsx`
Community | Circles | Circle detail page | Click card → Tabbed view: Feed, Members, About | P3 | Done | Pending | `CommunityCirclePage.tsx`
Community | Circles | Create Circle modal | "Create Circle" CTA → Modal: name, description, category, privacy → Submit | P3 | Done | Pending | `community/CreateCircleModal.tsx`
Community | Circles | Create Post modal | Inside circle → "New Post" → Modal: text + optional image → Submit → appears in feed | P3 | Done | Pending | `community/CreatePostModal.tsx`
Community | Circles | Post card | Feed item: author, text, image, like count, comment count, share, timestamp | P3 | Done | Pending | `community/PostCard.tsx`
Community | Circles | Post interactions | Like toggle, comment expand, share modal | P3 | Done | Pending |

---

## ▸ COMMUNITY — PEER PODS

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Community | Peer Pods | Browse pods | Community → Peer Pods tab → Pod cards grid | P3 | Done | Pending |
Community | Peer Pods | Pod card | Card: name, topic, member count, next session, status badge | P3 | Done | Pending | `peer-pods/PodCard.tsx`
Community | Peer Pods | Pod detail page | Click card → Pod info, members, schedule, guidelines, join CTA | P3 | Done | Pending | `PodDetailPage.tsx`
Community | Peer Pods | Inside Pod page | Join → Active session view: participants, agenda, timer, notes, discussion | P3 | Done | Pending | `InsidePodPage.tsx`
Community | Peer Pods | Create Pod modal | "Create Pod" CTA → Modal: topic, size, schedule, description → Submit | P3 | Done | Pending | `peer-pods/CreatePodModal.tsx`
Community | Peer Pods | Confidentiality agreement | Join pod → Must accept confidentiality terms before entering | P3 | Done | Pending | `peer-pods/ConfidentialityModal.tsx`

---

## ▸ COMMUNITY — OPEN MIC

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Community | Open Mic | Browse Open Mic posts | Community → Open Mic tab → Post feed | P3 | Done | Pending |
Community | Open Mic | Open Mic card | Card: author, title, excerpt, reactions, comment count, timestamp | P3 | Done | Pending | `open-mic/OpenMicCard.tsx`
Community | Open Mic | Post detail page | Click card → Full post: content, comments thread, reactions | P3 | Done | Pending | `OpenMicPostDetailPage.tsx`
Community | Open Mic | Create Open Mic post | "Write Something" CTA → Modal: title, content, tags → Submit | P3 | Done | Pending | `open-mic/CreateOpenMicPostModal.tsx`

---

## ▸ NETWORK

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Network | People | Browse people | Network → People tab → Person cards grid with search + filters | P2 | Done | Pending | `MyNetworkPage.tsx`
Network | People | Person card | Card: name, avatar, role badge, specialization, location, connect/message CTAs | P2 | Done | Pending | `PersonCard.tsx`
Network | People | View person profile | Click card → Full profile page (reuses `ProfilePage.tsx` with `personId`) | P2 | Done | Pending |
Network | Companies | Browse companies | Network → Companies tab → Company cards grid with search + filters | P2 | Done | Pending |
Network | Companies | Company card | Card: name, logo, industry, size, location, follow toggle | P2 | Done | Pending | `CompanyCard.tsx`
Network | Companies | Company profile page | Click card → Full profile: overview, active listings, team, updates, follow CTA | P2 | Done | Pending | `CompanyProfilePage.tsx`
Network | Companies | Company update card | Profile → Updates section → Individual update cards | P2 | Done | Pending | `companies/CompanyUpdateCard.tsx`
Network | Companies | Followed companies list | Sidebar or section showing followed companies | P2 | Done | Pending | `companies/FollowedCompaniesList.tsx`
Network | Events | Events in Network | Network → Events tab → Full event browsing (reuses EventCard + EventFilters) | P2 | Done | Pending | Events also accessible here

---

## ▸ PROFILE

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Profile | Page | Profile page with tabs | Profile nav → Tabs: About, Activity, Connections, Settings, Reviews | P1 | Done | Pending | `ProfilePage.tsx`
Profile | About | About tab | Bio, education, experience, skills, certifications, publications, languages, work preferences | P1 | Done | Pending |
Profile | Activity | Activity tab | Application history, saved listings, recent actions | P1 | Done | Pending |
Profile | Connections | Connections tab | Connected people list, pending requests | P2 | Done | Pending |
Profile | Settings | Settings tab | Account settings, notification preferences link | P2 | Done | Pending |
Profile | Reviews | Reviews tab | Full `FeedbackReviews` component: rating summary, review cards, write review | P2 | Done | Pending |
Profile | Badge | User group badge | Role badge (Student/Professional/Company/Admin) on profile + cards | P1 | Done | Pending | `profile/UserGroupBadge.tsx`
Profile | Mentor | Mentor profile page | Mentor card → Full profile: bio, domain, mentorship focus, fee, reviews, request mentorship CTA | P2 | Done | Pending | `MentorProfilePage.tsx`
Profile | Supervisor | Supervisor profile page | Supervisor card → Full profile: bio, domain, mode, session type, fee, reviews | P2 | Done | Pending | `SupervisorProfilePage.tsx`
Profile | Company | Company profile page | Company card → Full profile: overview, listings, team, updates | P2 | Done | Pending | `CompanyProfilePage.tsx`
Profile | Person | View other user's profile | Person card → Navigate → ProfilePage reused with `personId` + `onBack` | P2 | Done | Pending |
Profile | Settings | Notification settings page | Profile → Settings → "Notification Preferences" → Toggle email prefs per category (Jobs, Projects, Courses, etc.) | P3 | Done | Pending | `NotificationSettingsPage.tsx`

---

## ▸ COMPANY DASHBOARD

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Company | Dashboard | Dashboard shell | My Listings nav → Hero header with stats + module tab bar | P1 | Done | Pending | `CompanyDashboardPage.tsx`
Company | Dashboard | Module tabs | Jobs / Projects / Courses / Events / Supervision / Mentoring / Referrals — click to switch | P1 | Done | Pending |
Company | Dashboard | Stats row | Total Listings, Active, Applications, Pending Review — aggregate counts | P1 | Done | Pending |
Company | Dashboard | Create New button | Per-module → navigates to appropriate create form | P1 | Done | Pending |
Company | Dashboard | Status filter tabs | All / Drafts / Under Review / Active / Rejected / Changes Needed / Closed | P1 | Done | Pending |
Company | Dashboard | Listing cards | Per listing: title, status badge, deadline, applicant count, views, actions | P1 | Done | Pending |
Company | Dashboard | Listing action menu | ⋯ dropdown: Edit, Close, Extend, Delete, Duplicate, Archive | P1 | Done | Pending | `ListingActions.tsx`
Company | Dashboard | Status lifecycle display | Visual timeline on cards showing progression | P2 | Done | Pending | `StatusLifecycle.tsx`
Company | Dashboard | Status change dropdown | Quick status update without full edit | P2 | Done | Pending | `StatusLifecycleDropdown.tsx`
Company | Dashboard | Quick action pills | "Candidate Directory" + "Notification Settings" shortcuts in hero | P2 | Done | Pending |
Company | Dashboard | Candidate search | Quick action → `CandidateSearchPage`: search people, filter, download CV, save, connect | P3 | Done | Pending | `CandidateSearchPage.tsx`
Company | Request | Request Course form | Learning → Request a Course → Multi-step form: training need + team details + budget → submit | P3 | Done | Pending | `RequestFormPage.tsx` (type='course')
Company | Request | Request Supervision form | Learning → Request Supervision → Multi-step form → submit | P3 | Done | Pending | `RequestFormPage.tsx` (type='supervision')
Company | Request | Request Mentoring form | Learning → Request Mentoring → Multi-step form → submit | P3 | Done | Pending | `RequestFormPage.tsx` (type='mentoring')

---

## ▸ ADMIN DASHBOARD

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Admin | Overview | Overview section | Admin Dashboard → Overview tab: pending counts per module, recent activity, flagged items | P1 | Done | Pending | `admin/AdminOverview.tsx`
Admin | Review | Review queue | Admin Dashboard → Review Queue tab → Module sub-tabs (Jobs/Projects/Courses/Events/Supervision/Mentoring/Referrals) | P1 | Done | Pending |
Admin | Review | Status filter | All / Pending / Approved / Rejected filter on review list | P1 | Done | Pending |
Admin | Review | Review card actions | Per listing: Preview (navigates to detail page), Approve, Reject (with message), Suggest Edit | P1 | Done | Pending | `AdminReviewCard.tsx`
Admin | Review | Bulk operations | Multi-select checkboxes → "Approve Selected" / "Reject Selected" | P3 | Done | Pending |
Admin | Review | Search reviews | Search bar → filter by title | P2 | Done | Pending |
Admin | Reports | Reports queue | Admin Dashboard → Reports tab → Flagged listings with context | P2 | Done | Pending |
Admin | Reports | Report actions | Per report: reporter info, reason, entity context → Warn / Remove / Dismiss | P2 | Done | Pending |
Admin | Reports | Report filter | All / Open / Resolved / Dismissed | P2 | Done | Pending |
Admin | Statistics | Statistics dashboard | Admin Dashboard → Statistics tab → Charts (recharts) | P3 | Done | Pending | `admin/AdminStatistics.tsx`
Admin | Statistics | Listings/month chart | Bar chart of listings created over time | P3 | Done | Pending |
Admin | Statistics | Applications/listing chart | Metrics on engagement per listing | P3 | Done | Pending |
Admin | Statistics | Approval turnaround | Time-to-approve metrics | P3 | Done | Pending |
Admin | Statistics | Category breakdown | Pie/bar chart of listings by module | P3 | Done | Pending |
Admin | Statistics | User growth | Line chart of user registrations | P3 | Done | Pending |
Admin | Taxonomy | Taxonomy CRUD | Admin Dashboard → Taxonomy tab → Add/Edit/Delete: specializations, skills, categories, filter options | P3 | Done | Pending | `admin/AdminTaxonomy.tsx`

---

## ▸ PLATFORM — SHARED COMPONENTS

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Platform | Shared | CreateFormWizard | Step indicators + prev/next + save draft + preview step → used by all 7 create forms | P0 | Done | Pending | `shared/CreateFormWizard.tsx`
Platform | Shared | ComplianceChecklist | Modal → configurable checklist items → all checked required → confirm/cancel | P0 | Done | Pending | `shared/ComplianceChecklist.tsx`
Platform | Shared | ShareModal | Copy Link / WhatsApp / Email / LinkedIn / in-app message → wired to all cards + detail pages | P1 | Done | Pending | `shared/ShareModal.tsx`
Platform | Shared | ReportModal | Reason picker → optional notes → confirm → submits report | P1 | Done | Pending | `shared/ReportModal.tsx`
Platform | Shared | ApplicationListView | Table: avatar, name, date, status dropdown, view profile, download CV → used by all mgmt pages | P0 | Done | Pending | `shared/ApplicationListView.tsx`
Platform | Shared | AdminReviewCard | Preview / Approve / Reject / Suggest Edit → used in all admin review tabs | P0 | Done | Pending | `shared/AdminReviewCard.tsx`
Platform | Shared | StatusLifecycle | Visual timeline showing status progression → configurable per module | P2 | Done | Pending | `shared/StatusLifecycle.tsx`
Platform | Shared | StatusLifecycleDropdown | Dropdown for changing listing status inline | P2 | Done | Pending | `shared/StatusLifecycleDropdown.tsx`
Platform | Shared | ListingActions | Edit / Close / Extend / Delete / Duplicate / Archive action buttons + confirmation modal | P1 | Done | Pending | `shared/ListingActions.tsx`
Platform | Shared | NominateEmployeesModal | Company: select employees → bulk enroll/nominate for courses/supervision/mentoring | P3 | Done | Pending | `shared/NominateEmployeesModal.tsx`
Platform | Shared | QAForum | Threaded Q&A / discussion component → used in Supervision + Cohort Hubs | P3 | Done | Pending | `shared/QAForum.tsx`
Platform | Shared | Portal | `ReactDOM.createPortal` wrapper → all modals render through this | P0 | Done | Pending | `shared/Portal.tsx`
Platform | Shared | ConfirmDialog | Reusable confirmation dialog (destructive actions) | P1 | Done | Pending | `shared/ConfirmDialog.tsx`
Platform | Shared | EmptyState | Icon + title + description + optional CTA for empty lists | P1 | Done | Pending | `shared/EmptyState.tsx`
Platform | Shared | SkeletonCards | Loading skeleton placeholders per card type (Job, Project, Course, Event, etc.) | P2 | Done | Pending | `shared/SkeletonCards.tsx`
Platform | Shared | SuccessCelebration | Animated success screen: radial burst, pulsing glow, staggered entrance | P1 | Done | Pending | `shared/SuccessCelebration.tsx`
Platform | Shared | Toasts | Toast notification helpers via Sonner | P1 | Done | Pending | `shared/toasts.tsx`

---

## ▸ PLATFORM — CROSS-CUTTING FEATURES

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Platform | Reviews | FeedbackReviews component | Rating summary bar + individual review cards + helpful votes + "Write a Review" form | P2 | Done | Pending | `shared/FeedbackReviews.tsx`
Platform | Reviews | Reviews data store | `getReviewsForEntity()`, `getProfileReviews()`, `getAverageRating()`, `getRatingDistribution()` | P2 | Done | Pending | `data/reviews.ts`
Platform | Reviews | Star ratings on cards | MentorCard + SupervisorCard show aggregate star rating from reviews data | P2 | Done | Pending |
Platform | Reviews | Reviews tab on ProfilePage | Profile → Reviews tab → full FeedbackReviews for that user | P2 | Done | Pending |
Platform | Calendar | .ics file generation utility | `generateICS(title, description, start, end, location)` → downloadable .ics file | P3 | Done | Pending | `utils/calendar.ts`
Platform | Calendar | "Add to Calendar" buttons | On EventDetailsPage, CourseDetailsPage, SupervisionHubPage, CohortHubPage | P3 | Done | Pending |
Platform | Currency | Currency formatting | `formatCurrency(amount, currency)` → INR (₹), USD ($), GBP (£), EUR (€) | P2 | Done | Pending | `utils/currency.ts`
Platform | Messaging | Messages modal overlay | Header message icon or card CTA → Full-screen modal with conversations | P2 | Done | Pending | `MessagesPage.tsx`
Platform | Messaging | Conversation list with search | Left panel: search + conversation list sorted by recency | P2 | Done | Pending |
Platform | Messaging | Chat view | Right panel: message bubbles (sent/received), timestamps, send input | P2 | Done | Pending |
Platform | Messaging | Initial conversation from profile | Person card / Profile page → "Message" CTA → opens Messages modal with that person | P2 | Done | Pending |
Platform | Messaging | Connection requests | InboxPopover → Connection requests → Accept / Reject | P2 | Done | Pending | Data in `data/messaging.ts`
Platform | Notifications | Inbox popover | Header bell → Dropdown: notification list with unread count, mark as read | P2 | Done | Pending | `InboxPopover.tsx`
Platform | Notifications | Notification types | Applications, reviews, connections, system → different icons + styling | P2 | Done | Pending | Data in `data/inbox.ts`
Platform | UX | Cross-link nudge | Low/empty results → "Also check out [other module]" with CTA to navigate | P2 | Done | Pending | `CrossLinkNudge.tsx`
Platform | UX | Similar section | Detail pages → "Similar [entity type]" card row at bottom | P2 | Done | Pending | `SimilarSection.tsx`
Platform | UX | Upcoming section | Dashboard / detail pages → "Upcoming" cards | P2 | Done | Pending | `UpcomingSection.tsx`
Platform | Cards | Chip component | Tag/badge with color variants: mint, blue, rose, amber, purple, gray | P0 | Done | Pending | `Chip.tsx`
Platform | Cards | FeaturedChip | "Featured" golden badge on promoted listings | P0 | Done | Pending | `FeaturedChip.tsx`
Platform | Cards | ApplicationModal | Generic application modal (used by Projects) | P1 | Done | Pending | `ApplicationModal.tsx`

---

## ▸ PLATFORM — UI PRIMITIVES (shadcn/ui)

46 Radix-based primitives installed and available:

`accordion` · `alert-dialog` · `alert` · `aspect-ratio` · `avatar` · `badge` · `breadcrumb` · `button` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `collapsible` · `command` · `context-menu` · `dialog` · `drawer` · `dropdown-menu` · `form` · `hover-card` · `input-otp` · `input` · `label` · `menubar` · `navigation-menu` · `pagination` · `popover` · `progress` · `radio-group` · `resizable` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `switch` · `table` · `tabs` · `textarea` · `toggle-group` · `toggle` · `tooltip`

Plus: `use-mobile.ts` (responsive hook), `utils.ts` (cn helper)

---

## ▸ DATA LAYER

Module | File | Contents | Records
---|---|---|---
Data | `profile.ts` | User profile types (`UserGroup`, `CareerStage`, `VerificationStatus`, `WorkMode`) + mock Student/Professional profiles | 2 profiles
Data | `people.ts` | `MOCK_PEOPLE` array, `Person` type, `getPersonById()`, filter constants | ~20 people
Data | `companies.ts` | `MOCK_COMPANIES` array, company profiles, update cards, filter constants | ~10 companies
Data | `courses.ts` | Course data types + mock courses + enrolled/completed lists + filter constants | ~15 courses
Data | `events.ts` | Event data types + mock events + filter/status constants | ~12 events
Data | `mentorship.ts` | Mentor/Cohort data types + mock mentors | ~8 mentors
Data | `supervision.ts` | Supervisor data types + mock supervisors | ~8 supervisors
Data | `referrals.ts` | Referral data types + mock referrals + specializations + experience levels + listing status type | 13 referrals
Data | `funding.ts` | Funding opportunity types + mock funding data | ~10 opportunities
Data | `community.ts` | Community circles, posts, members | ~6 circles
Data | `peer-pods.ts` | Pod data types + mock pods | ~6 pods
Data | `open-mic.ts` | Open Mic post types + mock posts | ~8 posts
Data | `reviews.ts` | Review types + mock reviews (mentors, supervisors, events, profiles) + helper functions | ~30 reviews
Data | `inbox.ts` | Inbox/notification types + mock notifications | ~10 notifications
Data | `messaging.ts` | Chat conversation types + mock conversations + connection requests | ~6 conversations

---

## ▸ KNOWN GAPS & DEFERRED

Module | Area | Feature | Flow | Priority | Build | QA | Notes
---|---|---|---|---|---|---|---
Projects | Management | ProjectApplicationsPage | Listing card → "Applications" → view/respond to applicants | P2 | Not Started | Blocked | Gap: page file missing; navigation exists but no component
Platform | Payment | Payment gateway integration | Checkout → Razorpay/Stripe → receipt | P4 | Deferred | — | Phase II; mark with "Payment Pending" in UI
Platform | Payment | Invoice generation | Completed payment → generate PDF invoice | P4 | Deferred | — | Depends on payment
Platform | Email | Real email sending | Notification triggers → actual email delivery | P4 | Deferred | — | UI shows templates; backend needed
Platform | AI | AI-matched recommendations | ML-based profile-to-listing matching | P4 | Deferred | — | Current "recommended" uses mock data
Platform | Collab | Collaboration Hub | Post-selection workspace for projects | P4 | Deferred | — | Needs spec from reference site
Platform | Payment | Revenue sharing | Platform fee calculation and distribution | P4 | Deferred | — | Business logic, not UI

---

**Summary:** 280+ features tracked across 7 workflow modules + Funding + Community (3 sub-modules) + Admin + Platform infrastructure. All P0–P3 items are built. One P2 gap remains (ProjectApplicationsPage). All P4 items are explicitly deferred to Phase II.
