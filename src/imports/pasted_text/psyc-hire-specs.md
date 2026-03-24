# PsycHIRE — Complete Platform Specification Sheet

**Last Updated:** March 16, 2026
**Stack:** React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui primitives
**Architecture:** Single-page app, state-driven routing via `currentPage` + `handleNavigate` in `App.tsx`, `navHistoryRef` + `goBack()` history stack

---

## 1. DESIGN SYSTEM

### 1.1 Brand Colors
| Token | Value | Usage |
|---|---|---|
| `--brand-primary` | `#1e40af` (Royal Blue) | Primary buttons, links, active nav, focus rings |
| `--brand-secondary` | `#14b8a6` (Teal) | Accent highlights, featured badges, secondary CTAs |
| `--brand-secondary-hover` | `#0d9488` | Hover state for teal elements |
| `--background` | `#f0f4f8` (Bluish Grey) | Page background |
| `--foreground` | `#0F172A` (Slate 900) | Primary text |

### 1.2 Typography
- Font: `Inter` (sans-serif)
- Base size: `16px` via CSS custom property
- No Tailwind font-size/weight/line-height classes used (inline `style` attributes for explicit sizing)
- `<p>` tags used instead of `<h1>`/`<h3>` inside cards

### 1.3 Component Patterns
| Pattern | Detail |
|---|---|
| Cards | "Hero Card" aesthetic — white bg, rounded-xl, border, shadow-sm, hover:shadow-lg, responsive padding `p-4 sm:p-6` or `p-5 sm:p-7` |
| Chips | `<Chip>` component with variants: `mint`, `blue`, `rose`, `amber`, `purple`, `gray` |
| Featured | `<FeaturedChip>` + `ring-1 ring-brand-secondary border-brand-secondary` on card |
| Modals | All render via `<Portal>` component using `ReactDOM.createPortal`, z-index `z-[9999]` |
| Animation | `animate-fade-in` keyframe (opacity only, no `translateY`), `forwards` fill mode |
| Lists | `<div className="contents">` instead of `React.Fragment` in `.map()` |
| Empty States | `<EmptyState>` shared component with icon, title, description, optional CTA |
| Skeleton Loading | `<SkeletonCards>` component for card loading placeholders |
| Success | `<SuccessCelebration>` component for post-action celebrations |
| Toasts | Sonner toast library, position bottom-right |

### 1.4 Dark Mode
- CSS custom properties defined for `.dark` class
- `next-themes` installed but dark mode not actively toggled in UI

### 1.5 Custom CSS Utilities
- `.scrollbar-hide` — hides scrollbar for horizontal scroll tabs
- `slideInLeft` / `slideInRight` keyframes for drawer animations

---

## 2. USER ROLES & AUTH

### 2.1 Four Roles
| Role | Mock User | Email |
|---|---|---|
| **Student** | Jane Doe | jane.doe@university.edu |
| **Professional** | Dr. Arjun Mehta | arjun.mehta@serenityhealth.in |
| **Company** | MindCare Clinic | admin@mindcareclinic.com |
| **Admin** | Rajesh Kumar | rajesh.kumar@psychire.com |

### 2.2 Auth Flow (3 pages)
| Page | File | Features |
|---|---|---|
| **Login** | `LoginPage.tsx` | Email/password form, "Sign Up" link |
| **Signup** | `SignupPage.tsx` | Registration form, redirects to onboarding |
| **Onboarding** | `OnboardingPage.tsx` | Multi-step profile setup for new users |

### 2.3 Role Switching
- Dropdown in Header profile menu
- Switches between Student / Professional / Company / Admin
- Each role sees different nav items and permissions
- Company sees "My Listings" nav link
- Admin sees "Admin Dashboard" nav link

### 2.4 Role-Based Restrictions
- Students: can only search internships, volunteering, early career jobs
- Students: cannot create listings in any module
- Company/Professional: can create listings (Jobs, Projects, Courses, Events, Supervision, Mentoring)
- Admin: access to admin dashboard, review queues, reports, taxonomy, statistics

---

## 3. NAVIGATION

### 3.1 Header (`Header.tsx`)
- Logo + brand name
- Desktop: horizontal nav bar with pill-style active state
- Mobile: hamburger menu opens drawer (rendered **outside** `<header>` element)
- Nav items adapt per role
- Profile dropdown: role switcher, settings, messages, logout
- Connection requests popover with accept/reject
- Inbox/notification bell

### 3.2 Mobile Bottom Nav (`MobileBottomNav.tsx`)
- Fixed bottom bar on screens < `lg` breakpoint
- 5 tabs: Home, Opportunities, Learning, Network, Community
- Active state with brand-primary color
- Hidden on desktop (`lg:pb-0` on main container)

### 3.3 Navigation Architecture
- State-driven: `currentPage` string + `handleNavigate(page, params?)` function
- History stack: `navHistoryRef` (useRef) + `goBack()` callback
- `resolvePageName()` for alias redirects (e.g., 'Home' -> 'Dashboard', 'Jobs' -> 'Opportunities')
- `restoreTabState()` preserves sub-tab state when navigating back
- `getActiveNavItem()` maps sub-pages to parent nav items

### 3.4 All Navigable Pages (50 pages)
| Page Name (state) | Component File | Parent Nav |
|---|---|---|
| `Dashboard` | `HomePage.tsx` | Home |
| `Opportunities` | `OpportunitiesPage.tsx` | Opportunities |
| `JobDetails` | `JobDetailsPage.tsx` | Opportunities |
| `ProjectDetails` | `ProjectDetailsPage.tsx` | Opportunities |
| `ReferralDetail` | `ReferralDetailPage.tsx` | Opportunities |
| `Learning` | `LearningPage.tsx` | Learning |
| `CourseDetails` | `CourseDetailsPage.tsx` | Learning |
| `MentorProfile` | `MentorProfilePage.tsx` | Learning |
| `SupervisorProfile` | `SupervisorProfilePage.tsx` | Learning |
| `SupervisionHub` | `SupervisionHubPage.tsx` | Learning |
| `CohortHub` | `CohortHubPage.tsx` | Learning |
| `RequestForm` | `RequestFormPage.tsx` | Learning |
| `Network` | `MyNetworkPage.tsx` | Network |
| `EventDetails` | `EventDetailsPage.tsx` | Network |
| `CompanyProfile` | `CompanyProfilePage.tsx` | Network |
| `PersonProfile` | `ProfilePage.tsx` (reused) | Network |
| `Community` | `MyCommunityPage.tsx` | Community |
| `CommunityCircle` | `CommunityCirclePage.tsx` | Community |
| `PodDetail` | `PodDetailPage.tsx` | Community |
| `InsidePod` | `InsidePodPage.tsx` | Community |
| `OpenMicPostDetail` | `OpenMicPostDetailPage.tsx` | Community |
| `Funding` | `FundingPage.tsx` | Funding |
| `FundingDetail` | `FundingDetailPage.tsx` | Funding |
| `Profile` | `ProfilePage.tsx` | Profile |
| `NotificationSettings` | `NotificationSettingsPage.tsx` | Profile |
| `CompanyDashboard` | `CompanyDashboardPage.tsx` | My Listings |
| `AdminDashboard` | `AdminDashboardPage.tsx` | Admin Dashboard |
| `CreateJob` | `CreateJobPage.tsx` | My Listings |
| `EditJob` | `CreateJobPage.tsx` (editMode) | My Listings |
| `JobApplications` | `JobApplicationsPage.tsx` | My Listings |
| `CreateProject` | `CreateProjectPage.tsx` | My Listings |
| `EditProject` | `CreateProjectPage.tsx` (editMode) | My Listings |
| `CreateEvent` | `CreateEventPage.tsx` | My Listings |
| `EditEvent` | `CreateEventPage.tsx` (editMode) | My Listings |
| `EventRegistrations` | `EventRegistrationsPage.tsx` | My Listings |
| `CreateCourse` | `CreateCoursePage.tsx` | My Listings |
| `EditCourse` | `CreateCoursePage.tsx` (editMode) | My Listings |
| `CourseEnrollments` | `CourseEnrollmentsPage.tsx` | My Listings |
| `CreateSupervision` | `CreateSupervisionPage.tsx` | My Listings |
| `SupervisionApplicants` | `SupervisionApplicantsPage.tsx` | My Listings |
| `CreateCohort` | `CreateCohortPage.tsx` | My Listings |
| `CohortApplicants` | `CohortApplicantsPage.tsx` | My Listings |
| `CandidateSearch` | `CandidateSearchPage.tsx` | My Listings |
| `Messages` | `MessagesPage.tsx` (modal overlay) | — |

---

## 4. SHARED COMPONENT LIBRARY

### 4.1 Workflow Components (`/src/app/components/shared/`)
| Component | File | Purpose |
|---|---|---|
| **CreateFormWizard** | `CreateFormWizard.tsx` | Reusable multi-step form: step indicators, prev/next, save draft, preview step. Used by all 6 create forms |
| **ComplianceChecklist** | `ComplianceChecklist.tsx` | Modal with configurable checklist items. Blocks submit until all checked |
| **ShareModal** | `ShareModal.tsx` | Copy Link / WhatsApp / Email / LinkedIn / in-app message. Wired to all cards + detail pages |
| **ReportModal** | `ReportModal.tsx` | Reason picker + optional notes + confirm. Wired to all detail pages |
| **StatusLifecycle** | `StatusLifecycle.tsx` | Visual timeline showing status progression (configurable per module) |
| **StatusLifecycleDropdown** | `StatusLifecycleDropdown.tsx` | Dropdown for changing listing status |
| **ApplicationListView** | `ApplicationListView.tsx` | Table/list of applicants with avatar, name, date, status dropdown, actions. Used by all application management pages |
| **AdminReviewCard** | `AdminReviewCard.tsx` | Card showing pending listing with Preview / Approve / Reject / Suggest Edit actions |
| **FeedbackReviews** | `FeedbackReviews.tsx` | Full review display: rating summary bar, review cards, "Write a Review" form, helpful votes |
| **ListingActions** | `ListingActions.tsx` | Action buttons for listing management (Edit, Close, Delete, etc.) |
| **NominateEmployeesModal** | `NominateEmployeesModal.tsx` | Bulk employee nomination form for companies |
| **QAForum** | `QAForum.tsx` | Question & answer forum component (used in Hubs) |
| **Portal** | `Portal.tsx` | `ReactDOM.createPortal` wrapper — all modals render through this to avoid stacking context issues |
| **ConfirmDialog** | `ConfirmDialog.tsx` | Reusable confirmation dialog |
| **EmptyState** | `EmptyState.tsx` | Empty state with icon, title, description, optional CTA |
| **SkeletonCards** | `SkeletonCards.tsx` | Loading skeleton placeholders |
| **SuccessCelebration** | `SuccessCelebration.tsx` | Post-action success celebration component |
| **Toasts** | `toasts.tsx` | Toast notification helpers |

### 4.2 Card Components (`/src/app/components/`)
| Card | File | Used In | Responsive |
|---|---|---|---|
| **JobCard** | `JobCard.tsx` | OpportunitiesPage, HomePage, CompanyDashboard | p-5 sm:p-7, stacked footer |
| **ProjectCard** | `ProjectCard.tsx` | OpportunitiesPage, HomePage, CompanyDashboard | p-4 sm:p-6, stacked footer |
| **CourseCard** | `courses/CourseCard.tsx` | LearningPage, HomePage, CompanyDashboard | p-4 sm:p-6, stacked footer |
| **EventCard** | `events/EventCard.tsx` | MyNetworkPage, HomePage, CompanyDashboard | p-5 sm:p-7, stacked footer |
| **MentorCard** | `MentorCard.tsx` | LearningPage (Mentorship tab) | p-5 sm:p-7, star rating aggregate |
| **SupervisorCard** | `SupervisorCard.tsx` | LearningPage (Supervision tab) | p-5 sm:p-7, star rating aggregate |
| **ReferralCard** | `ReferralCard.tsx` | OpportunitiesPage (Referrals tab) | p-4 sm:p-6, stacked footer |
| **CompanyCard** | `CompanyCard.tsx` | MyNetworkPage (Companies tab) | — |
| **PersonCard** | `PersonCard.tsx` | MyNetworkPage (People tab), CandidateSearch | — |
| **SuggestionCard** | `SuggestionCard.tsx` | HomePage sidebar suggestions | — |
| **FundingCard** | `funding/FundingCard.tsx` | FundingPage | — |
| **PodCard** | `peer-pods/PodCard.tsx` | MyCommunityPage (Peer Pods tab) | — |
| **OpenMicCard** | `open-mic/OpenMicCard.tsx` | MyCommunityPage (Open Mic tab) | — |
| **CommunityCircleCard** | `community/CommunityCircleCard.tsx` | MyCommunityPage (Circles tab) | — |
| **PostCard** | `community/PostCard.tsx` | CommunityCirclePage feed | — |
| **CompanyUpdateCard** | `companies/CompanyUpdateCard.tsx` | CompanyProfilePage | — |

### 4.3 UI Primitives (`/src/app/components/ui/`) — shadcn/ui
Full set of 46 shadcn/ui components installed:
`accordion`, `alert-dialog`, `alert`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input-otp`, `input`, `label`, `menubar`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `toggle-group`, `toggle`, `tooltip`

Plus: `use-mobile.ts` (hook), `utils.ts` (cn helper)

### 4.4 Other Shared Components
| Component | File | Purpose |
|---|---|---|
| **Chip** | `Chip.tsx` | Tag/badge with color variants |
| **FeaturedChip** | `FeaturedChip.tsx` | "Featured" badge for promoted listings |
| **UserGroupBadge** | `profile/UserGroupBadge.tsx` | Role badge (Student/Professional/Company/Admin) |
| **CrossLinkNudge** | `CrossLinkNudge.tsx` | "Also check out..." cross-module suggestions |
| **SimilarSection** | `SimilarSection.tsx` | "Similar listings" section on detail pages |
| **UpcomingSection** | `UpcomingSection.tsx` | "Upcoming events/sessions" section |
| **HeroSection** | `HeroSection.tsx` | Page hero banners |
| **WelcomeSection** | `WelcomeSection.tsx` | Dashboard welcome greeting |
| **InboxPopover** | `InboxPopover.tsx` | Header notification/inbox dropdown |
| **Tooltip** | `Tooltip.tsx` | Custom tooltip wrapper |
| **Icon** | `Icon.tsx` | Icon helper component |
| **ImageWithFallback** | `figma/ImageWithFallback.tsx` | Image with fallback placeholder (protected file) |

---

## 5. MODULE INVENTORY

### 5.1 JOBS

**Data:** `/src/app/data/` (job data embedded in page files)

**Discovery & Application (Applicant Side):**
| Feature | Status | Location |
|---|---|---|
| Browse jobs with filters | Done | `OpportunitiesPage.tsx` > Jobs tab |
| Job filters (location, type, experience, salary, mode) | Done | `jobs/JobFilters.tsx` |
| Job card with save, share, featured badge | Done | `JobCard.tsx` |
| Job detail page | Done | `JobDetailsPage.tsx` |
| Apply: choose method (Profile or External) | Done | `jobs/ApplyMethodModal.tsx` |
| Apply with Profile flow | Done | `jobs/ApplyWithProfileModal.tsx` |
| Application status tracking | Done | `jobs/ApplicationTrackerItem.tsx` |
| Share modal on card + detail | Done | `shared/ShareModal.tsx` |
| Report/flag on detail page | Done | `shared/ReportModal.tsx` |
| Role-based restrictions (Students = internships only) | Done | `OpportunitiesPage.tsx` |
| Similar jobs section | Done | `SimilarSection.tsx` |
| Cross-link nudge to Projects/Events | Done | `CrossLinkNudge.tsx` |

**Creation & Management (Poster Side):**
| Feature | Status | Location |
|---|---|---|
| Create Job form (multi-step wizard) | Done | `CreateJobPage.tsx` |
| Edit Job (reuses create form with editMode) | Done | `CreateJobPage.tsx` (editMode) |
| Save Draft | Done | `CreateFormWizard.tsx` |
| Preview before submit | Done | Wizard preview step |
| Compliance checklist before submit | Done | `ComplianceChecklist.tsx` |
| Submit for admin approval | Done | Workflow in CreateJobPage |
| Company: My Jobs tab in dashboard | Done | `CompanyDashboardPage.tsx` |
| View applications on a job | Done | `JobApplicationsPage.tsx` |
| Respond to applications (Accept/Shortlist/Reject/Hired) | Done | `ApplicationListView.tsx` |
| Application status dropdown | Done | `ApplicationListView.tsx` |

**Admin:**
| Feature | Status | Location |
|---|---|---|
| Jobs review queue | Done | `AdminDashboardPage.tsx` > Jobs tab |
| Approve / Reject with message | Done | `AdminReviewCard.tsx` |
| Suggest Edit | Done | `AdminReviewCard.tsx` |
| Bulk approve (multi-select) | Done | `AdminDashboardPage.tsx` |

---

### 5.2 PROJECTS

**Discovery & Application (Applicant Side):**
| Feature | Status | Location |
|---|---|---|
| Browse projects with filters | Done | `OpportunitiesPage.tsx` > Projects tab |
| Project filters | Done | `projects/ProjectFilters.tsx` |
| Project card with save, share | Done | `ProjectCard.tsx` |
| Project detail page | Done | `ProjectDetailsPage.tsx` |
| Apply with Statement of Interest | Done | `ApplicationModal.tsx` |
| Share / Report | Done | Shared modals |
| Similar projects section | Done | `SimilarSection.tsx` |

**Creation & Management (Poster Side):**
| Feature | Status | Location |
|---|---|---|
| Create Project form (multi-step wizard) | Done | `CreateProjectPage.tsx` |
| Edit Project | Done | `CreateProjectPage.tsx` (editMode) |
| Save Draft + Compliance + Submit | Done | Shared components |
| Company: My Projects tab in dashboard | Done | `CompanyDashboardPage.tsx` |
| Project limit enforcement | Done | `CreateProjectPage.tsx` |

**Admin:**
| Feature | Status | Location |
|---|---|---|
| Projects review queue | Done | `AdminDashboardPage.tsx` > Projects tab |

---

### 5.3 REFERRALS

**Discovery (User Side):**
| Feature | Status | Location |
|---|---|---|
| Browse referrals | Done | `OpportunitiesPage.tsx` > Referrals tab |
| Referral card | Done | `ReferralCard.tsx` |
| Referral detail page | Done | `ReferralDetailPage.tsx` |
| Respond to referral modal | Done | `referrals/RespondModal.tsx` |
| Share / Report | Done | Shared modals |

**Creation:**
| Feature | Status | Location |
|---|---|---|
| Referral form modal (partial) | Partial | `referrals/ReferralFormModal.tsx` |

---

### 5.4 COURSES

**Discovery & Enrollment (User Side):**
| Feature | Status | Location |
|---|---|---|
| Browse courses with filters | Done | `LearningPage.tsx` > Courses tab |
| Course filters | Done | `courses/CourseFilters.tsx` |
| Course card | Done | `courses/CourseCard.tsx` |
| Course detail page | Done | `CourseDetailsPage.tsx` |
| Enrollment modal | Done | `courses/EnrollmentModal.tsx` |
| Ratings & reviews on course | Done | `courses/RatingsReviews.tsx` + `FeedbackReviews.tsx` |
| Request Course modal (Company only) | Done | `courses/RequestCourseModal.tsx` |
| Nominate Employees modal (Company) | Done | `courses/NominateEmployeesModal.tsx` |
| Share / Report | Done | Shared modals |

**Creation & Management (Poster Side):**
| Feature | Status | Location |
|---|---|---|
| Create Course form (multi-step wizard) | Done | `CreateCoursePage.tsx` |
| Edit Course | Done | `CreateCoursePage.tsx` (editMode) |
| Save Draft + Compliance + Submit | Done | Shared components |
| Company: My Courses tab in dashboard | Done | `CompanyDashboardPage.tsx` |
| View enrollments | Done | `CourseEnrollmentsPage.tsx` |
| Respond to enrollments (Accept/Waitlist/Reject/Enrolled) | Done | `ApplicationListView.tsx` |

**Admin:**
| Feature | Status | Location |
|---|---|---|
| Courses review queue | Done | `AdminDashboardPage.tsx` > Courses tab |

---

### 5.5 EVENTS

**Discovery & Registration (User Side):**
| Feature | Status | Location |
|---|---|---|
| Browse events with filters | Done | `MyNetworkPage.tsx` > Events tab |
| Event filters | Done | `events/EventFilters.tsx` |
| Event card with tags (Trending, Featured, Upcoming) | Done | `events/EventCard.tsx` |
| Event detail page | Done | `EventDetailsPage.tsx` |
| Participation modals (RSVP, Call for Paper, Speaker, Sponsor) | Done | `events/EventParticipationModals.tsx` |
| Calendar .ics download | Done | `utils/calendar.ts` |
| Share / Report | Done | Shared modals |

**Creation & Management (Poster Side):**
| Feature | Status | Location |
|---|---|---|
| Create Event form (multi-step wizard) | Done | `CreateEventPage.tsx` |
| Edit Event | Done | `CreateEventPage.tsx` (editMode) |
| Action button config (RSVP / Papers / Speakers / Sponsors) | Done | `CreateEventPage.tsx` |
| Save Draft + Compliance + Submit | Done | Shared components |
| Company: My Events tab in dashboard | Done | `CompanyDashboardPage.tsx` |
| View registrations | Done | `EventRegistrationsPage.tsx` |
| Manage registrations (Accept/Waitlist/Reject/Confirm) | Done | `ApplicationListView.tsx` |

**Admin:**
| Feature | Status | Location |
|---|---|---|
| Events review queue | Done | `AdminDashboardPage.tsx` > Events tab |

---

### 5.6 SUPERVISION

**Discovery & Application (User Side):**
| Feature | Status | Location |
|---|---|---|
| Browse supervision listings with filters | Done | `LearningPage.tsx` > Supervision tab |
| Supervisor card with star ratings | Done | `SupervisorCard.tsx` |
| Supervisor profile page | Done | `SupervisorProfilePage.tsx` |
| Apply flow | Done | Detail page apply action |
| Share / Report | Done | Shared modals |

**Creation & Management (Poster Side):**
| Feature | Status | Location |
|---|---|---|
| Create Supervision form (multi-step wizard) | Done | `CreateSupervisionPage.tsx` |
| Save Draft + Compliance + Submit | Done | Shared components |
| Company: My Supervision tab in dashboard | Done | `CompanyDashboardPage.tsx` |
| View applicants | Done | `SupervisionApplicantsPage.tsx` |
| Respond to applicants (Accept/Waitlist/Reject/Enrolled) | Done | `ApplicationListView.tsx` |

**Supervision Hub:**
| Feature | Status | Location |
|---|---|---|
| Hub workspace page | Done | `SupervisionHubPage.tsx` |
| Session scheduler | Done | Hub component |
| Participant management | Done | Hub component |
| Discussion forum | Done | `QAForum.tsx` |
| Resource sharing | Done | Hub component |
| Attendance & hours tracking | Done | Hub component |
| Assessment | Done | Hub component |
| Guidelines | Done | Hub component |
| Calendar integration (.ics) | Done | `utils/calendar.ts` |

**Admin:**
| Feature | Status | Location |
|---|---|---|
| Supervision review queue | Done | `AdminDashboardPage.tsx` > Supervision tab |

---

### 5.7 MENTORING

**Discovery & Application (User Side):**
| Feature | Status | Location |
|---|---|---|
| Browse mentoring cohorts with filters | Done | `LearningPage.tsx` > Mentorship tab |
| Mentor card with star ratings | Done | `MentorCard.tsx` |
| Mentor profile page | Done | `MentorProfilePage.tsx` |
| Join/Apply flow | Done | Detail page apply action |
| Share / Report | Done | Shared modals |

**Creation & Management (Poster Side):**
| Feature | Status | Location |
|---|---|---|
| Create Cohort form (multi-step wizard) | Done | `CreateCohortPage.tsx` |
| Save Draft + Compliance + Submit | Done | Shared components |
| Company: My Mentoring tab in dashboard | Done | `CompanyDashboardPage.tsx` |
| View applicants | Done | `CohortApplicantsPage.tsx` |
| Respond to applicants | Done | `ApplicationListView.tsx` |

**Cohort Hub:**
| Feature | Status | Location |
|---|---|---|
| Hub workspace page | Done | `CohortHubPage.tsx` |
| Session scheduler (1:1 + group) | Done | Hub component |
| Participant management | Done | Hub component |
| Q&A / Discussion forum | Done | `QAForum.tsx` |
| Resource sharing | Done | Hub component |
| Attendance & hours tracking | Done | Hub component |
| Assessment | Done | Hub component |
| Guidelines | Done | Hub component |
| Calendar integration (.ics) | Done | `utils/calendar.ts` |

**Admin:**
| Feature | Status | Location |
|---|---|---|
| Mentoring review queue | Done | `AdminDashboardPage.tsx` > Mentoring tab |

---

### 5.8 FUNDING (Additional Module — not in original 7)

| Feature | Status | Location |
|---|---|---|
| Browse funding opportunities with filters | Done | `FundingPage.tsx` |
| Funding filters | Done | `funding/FundingFilters.tsx` |
| Funding card | Done | `funding/FundingCard.tsx` |
| Funding detail page | Done | `FundingDetailPage.tsx` |

---

## 6. COMMUNITY FEATURES

### 6.1 Community Circles
| Feature | Status | Location |
|---|---|---|
| Browse circles | Done | `MyCommunityPage.tsx` > Circles tab |
| Circle card | Done | `community/CommunityCircleCard.tsx` |
| Circle detail page (feed, members, about) | Done | `CommunityCirclePage.tsx` |
| Create Circle modal | Done | `community/CreateCircleModal.tsx` |
| Create Post modal | Done | `community/CreatePostModal.tsx` |
| Post card (likes, comments, share) | Done | `community/PostCard.tsx` |

### 6.2 Peer Pods
| Feature | Status | Location |
|---|---|---|
| Browse pods | Done | `MyCommunityPage.tsx` > Peer Pods tab |
| Pod card | Done | `peer-pods/PodCard.tsx` |
| Pod detail page | Done | `PodDetailPage.tsx` |
| Inside Pod page (active session view) | Done | `InsidePodPage.tsx` |
| Create Pod modal | Done | `peer-pods/CreatePodModal.tsx` |
| Confidentiality agreement modal | Done | `peer-pods/ConfidentialityModal.tsx` |

### 6.3 Open Mic
| Feature | Status | Location |
|---|---|---|
| Browse Open Mic posts | Done | `MyCommunityPage.tsx` > Open Mic tab |
| Open Mic card | Done | `open-mic/OpenMicCard.tsx` |
| Post detail page | Done | `OpenMicPostDetailPage.tsx` |
| Create Open Mic post modal | Done | `open-mic/CreateOpenMicPostModal.tsx` |

---

## 7. DASHBOARDS

### 7.1 Home Dashboard (`HomePage.tsx`)
| Feature | Status |
|---|---|
| Welcome section with user greeting | Done |
| New user onboarding prompts | Done |
| Recommended jobs/projects cards | Done |
| Upcoming events section | Done |
| Suggestion cards (mentors, courses) | Done |
| Role-aware content | Done |

### 7.2 Company Dashboard (`CompanyDashboardPage.tsx`)
| Feature | Status |
|---|---|
| Tab-based layout: Jobs / Projects / Courses / Events / Supervision / Mentoring | Done |
| Per-tab: Drafts / Active / Closed listings | Done |
| Quick actions: Create new, View applications, Edit, Close | Done |
| Applicant count badges on listings | Done |
| Navigate to create forms | Done |
| Navigate to application management pages | Done |

### 7.3 Admin Dashboard (`AdminDashboardPage.tsx`)
| Section | Component | Features |
|---|---|---|
| **Overview** | `admin/AdminOverview.tsx` | Pending counts per module, recent activity, flagged items |
| **Review Queue** | `AdminDashboardPage.tsx` | Tabs per module, filter by status (All/Pending/Approved/Rejected), bulk select + approve, individual review cards |
| **Reports** | `AdminDashboardPage.tsx` | Flagged listings with context, reporter info, actions (warn/remove/dismiss) |
| **Statistics** | `admin/AdminStatistics.tsx` | Charts (recharts): listings/month, applications/listing, approval turnaround, category breakdown, user growth |
| **Taxonomy** | `admin/AdminTaxonomy.tsx` | CRUD for specializations, skills, categories, filter options |

---

## 8. PROFILE SYSTEM

### 8.1 Profile Page (`ProfilePage.tsx`)
| Tab | Features |
|---|---|
| **About** | Bio, education, experience, skills, certifications, publications, languages, work preferences |
| **Activity** | Application history, saved listings, recent actions |
| **Connections** | Connected people, pending requests |
| **Settings** | Account settings, notification preferences link |
| **Reviews** | Full `FeedbackReviews` component with rating summary, review cards, write review form |

### 8.2 Profile Data (`/src/app/data/profile.ts`)
- Types: `UserGroup`, `StudentCareerStage`, `ProfessionalCareerStage`, `CareerStage`, `VerificationStatus`, `WorkMode`
- Interfaces: `EducationEntry`, `ExperienceEntry`, full profile model
- Mock profiles for Student + Professional

### 8.3 Specialized Profile Pages
| Page | File | Features |
|---|---|---|
| **Mentor Profile** | `MentorProfilePage.tsx` | Mentor bio, domain, specializations, mentorship focus, fee, reviews, request mentorship CTA |
| **Supervisor Profile** | `SupervisorProfilePage.tsx` | Supervisor bio, domain, specializations, mode, session type, fee, reviews |
| **Company Profile** | `CompanyProfilePage.tsx` | Company overview, active listings, team, updates, follow |
| **Person Profile** | `ProfilePage.tsx` (reused with `personId`) | View another user's profile |

---

## 9. MESSAGING & NOTIFICATIONS

### 9.1 Messages (`MessagesPage.tsx`)
| Feature | Status |
|---|---|
| Modal overlay (not a routed page) | Done |
| Conversation list with search | Done |
| Chat view with message bubbles | Done |
| Send text messages | Done |
| Initial conversation from profile/card | Done |

### 9.2 Inbox/Notifications (`InboxPopover.tsx`)
| Feature | Status |
|---|---|
| Header bell icon with unread count | Done |
| Popover dropdown with notification list | Done |
| Notification types: applications, reviews, connections, system | Done |
| Mark as read | Done |

### 9.3 Notification Settings (`NotificationSettingsPage.tsx`)
| Feature | Status |
|---|---|
| Toggle email preferences per notification type | Done |
| Category grouping (Jobs, Projects, Courses, etc.) | Done |

---

## 10. CROSS-CUTTING FEATURES

### 10.1 Feedback & Reviews System
| Feature | Status | Location |
|---|---|---|
| Shared `FeedbackReviews` component | Done | `shared/FeedbackReviews.tsx` |
| Rating summary bar (5-star distribution) | Done | Component |
| Individual review cards with helpful votes | Done | Component |
| Write a Review form (star rating + comment) | Done | Component |
| Reviews data store with helpers | Done | `data/reviews.ts` |
| `getReviewsForEntity()` — per entity type | Done | `data/reviews.ts` |
| `getProfileReviews()` — aggregate for profile | Done | `data/reviews.ts` |
| `getAverageRating()` / `getRatingDistribution()` | Done | `data/reviews.ts` |
| Star rating on MentorCard | Done | `MentorCard.tsx` |
| Star rating on SupervisorCard | Done | `SupervisorCard.tsx` |
| Reviews tab on ProfilePage | Done | `ProfilePage.tsx` |
| Mock reviews: mentors, supervisors, events, profiles | Done | `data/reviews.ts` |

### 10.2 Calendar Integration
| Feature | Status | Location |
|---|---|---|
| `.ics` file generation utility | Done | `utils/calendar.ts` |
| "Add to Calendar" on Events | Done | `EventDetailsPage.tsx` |
| "Add to Calendar" on Course sessions | Done | `CourseDetailsPage.tsx` |
| "Add to Calendar" on Supervision sessions | Done | `SupervisionHubPage.tsx` |
| "Add to Calendar" on Cohort sessions | Done | `CohortHubPage.tsx` |

### 10.3 Currency
| Feature | Status | Location |
|---|---|---|
| Currency symbols (INR, USD, GBP, EUR) | Done | `utils/currency.ts` |
| `formatCurrency()` helper | Done | `utils/currency.ts` |
| Rupee symbol used across all Indian-market listings | Done | All cards/details |

---

## 11. DATA LAYER

All mock data files in `/src/app/data/`:

| File | Contents |
|---|---|
| `profile.ts` | User profile types + mock Student/Professional profiles |
| `people.ts` | `MOCK_PEOPLE` array, `Person` type, `getPersonById()` |
| `companies.ts` | `MOCK_COMPANIES` array, company profiles |
| `courses.ts` | Course data types + mock courses |
| `events.ts` | Event data types + mock events |
| `mentorship.ts` | Mentor/Cohort data types + mock mentors |
| `supervision.ts` | Supervisor data types + mock supervisors |
| `referrals.ts` | Referral data types + mock referrals |
| `funding.ts` | Funding opportunity types + mock data |
| `community.ts` | Community circles, posts, members |
| `peer-pods.ts` | Pod data types + mock pods |
| `open-mic.ts` | Open Mic post types + mock posts |
| `reviews.ts` | Review types + mock reviews (mentors, supervisors, events, profiles) + helper functions |
| `inbox.ts` | Inbox/notification types + mock notifications |
| `messaging.ts` | Chat conversation types + mock conversations + connection requests |

---

## 12. INSTALLED PACKAGES

### Production Dependencies
| Package | Version | Purpose |
|---|---|---|
| `react` / `react-dom` | 18.3.1 | Core framework |
| `lucide-react` | 0.487.0 | Icon library |
| `recharts` | 2.15.2 | Charts (Admin Statistics) |
| `motion` | 12.23.24 | Animations |
| `sonner` | 2.0.3 | Toast notifications |
| `date-fns` | 3.6.0 | Date utilities |
| `react-hook-form` | 7.55.0 | Form management |
| `react-day-picker` | 8.10.1 | Calendar date picker |
| `react-dnd` + `html5-backend` | 16.0.1 | Drag and drop |
| `react-slick` | 0.31.0 | Carousel |
| `react-responsive-masonry` | 2.7.1 | Masonry grid |
| `react-resizable-panels` | 2.1.7 | Resizable panels |
| `@mui/material` + deps | 7.3.5 | Material UI (selective use) |
| `@popperjs/core` + `react-popper` | 2.11.8 / 2.3.0 | Popovers/positioning |
| `cmdk` | 1.1.1 | Command palette |
| `vaul` | 1.1.2 | Drawer component |
| `embla-carousel-react` | 8.6.0 | Carousel engine |
| `input-otp` | 1.4.2 | OTP input |
| `next-themes` | 0.4.6 | Theme management |
| `class-variance-authority` | 0.7.1 | CVA for component variants |
| `clsx` + `tailwind-merge` | 2.1.1 / 3.2.0 | Class name utilities |
| `tw-animate-css` | 1.3.8 | Tailwind animation classes |

### All 46 Radix UI primitives installed (shadcn/ui foundation):
`accordion`, `alert-dialog`, `aspect-ratio`, `avatar`, `checkbox`, `collapsible`, `context-menu`, `dialog`, `dropdown-menu`, `hover-card`, `label`, `menubar`, `navigation-menu`, `popover`, `progress`, `radio-group`, `scroll-area`, `select`, `separator`, `slider`, `slot`, `switch`, `tabs`, `toggle-group`, `toggle`, `tooltip`

---

## 13. FILE STRUCTURE SUMMARY

```
/src
  /app
    App.tsx                          # Main app shell, routing, role management
    design-system.ts                 # Design system tokens reference
    /components
      Header.tsx                     # Top navigation + mobile drawer
      MobileBottomNav.tsx            # Mobile bottom tab bar
      JobCard.tsx                    # Job listing card
      ProjectCard.tsx                # Project listing card
      MentorCard.tsx                 # Mentor card with rating
      SupervisorCard.tsx             # Supervisor card with rating
      ReferralCard.tsx               # Referral card
      CompanyCard.tsx                # Company card
      PersonCard.tsx                 # Person/user card
      SuggestionCard.tsx             # Sidebar suggestion card
      Chip.tsx                       # Tag/badge component
      FeaturedChip.tsx               # Featured badge
      HeroSection.tsx                # Page hero banner
      WelcomeSection.tsx             # Dashboard welcome
      SimilarSection.tsx             # Similar listings
      UpcomingSection.tsx            # Upcoming items
      CrossLinkNudge.tsx             # Cross-module suggestions
      InboxPopover.tsx               # Notification dropdown
      ApplicationModal.tsx           # Generic application modal
      ApplyJobModal.tsx              # Job application modal
      Tooltip.tsx                    # Tooltip wrapper
      Icon.tsx                       # Icon helper
      /admin
        AdminOverview.tsx            # Admin dashboard overview
        AdminStatistics.tsx          # Admin charts & stats
        AdminTaxonomy.tsx            # Category/skill management
      /community
        CommunityCircleCard.tsx      # Circle card
        CreateCircleModal.tsx        # New circle form
        CreatePostModal.tsx          # New post form
        PostCard.tsx                 # Community post card
      /companies
        CompanyUpdateCard.tsx        # Company update card
        FollowedCompaniesList.tsx    # Followed companies list
      /courses
        CourseCard.tsx               # Course card
        CourseFilters.tsx            # Course filter sidebar
        EnrollmentModal.tsx          # Course enrollment form
        NominateEmployeesModal.tsx   # Bulk nomination (Company)
        RatingsReviews.tsx           # Course ratings display
        RequestCourseModal.tsx       # Request course (Company)
      /events
        EventCard.tsx                # Event card
        EventFilters.tsx             # Event filter sidebar
        EventParticipationModals.tsx # RSVP/Paper/Speaker/Sponsor modals
      /figma
        ImageWithFallback.tsx        # Image with fallback (PROTECTED)
      /funding
        FundingCard.tsx              # Funding opportunity card
        FundingFilters.tsx           # Funding filter sidebar
      /jobs
        ApplicationTrackerItem.tsx   # Application status tracker
        ApplyMethodModal.tsx         # Apply method chooser
        ApplyWithProfileModal.tsx    # Apply with profile form
        JobFilters.tsx               # Job filter sidebar
      /open-mic
        CreateOpenMicPostModal.tsx   # New Open Mic post form
        OpenMicCard.tsx              # Open Mic post card
      /peer-pods
        ConfidentialityModal.tsx     # Pod confidentiality agreement
        CreatePodModal.tsx           # New pod form
        PodCard.tsx                  # Pod card
      /profile
        UserGroupBadge.tsx           # Role badge
      /projects
        ProjectFilters.tsx           # Project filter sidebar
      /referrals
        ReferralFormModal.tsx        # Create/edit referral form
        RespondModal.tsx             # Respond to referral
      /shared
        AdminReviewCard.tsx          # Admin review card
        ApplicationListView.tsx      # Applicant list table
        ComplianceChecklist.tsx      # Pre-submit checklist
        ConfirmDialog.tsx            # Confirmation dialog
        CreateFormWizard.tsx         # Multi-step form wizard
        EmptyState.tsx               # Empty state display
        FeedbackReviews.tsx          # Reviews & ratings system
        ListingActions.tsx           # Listing action buttons
        NominateEmployeesModal.tsx   # Bulk nomination modal
        Portal.tsx                   # ReactDOM.createPortal wrapper
        QAForum.tsx                  # Q&A forum component
        ReportModal.tsx              # Report/flag modal
        ShareModal.tsx               # Share (WhatsApp/Email/LinkedIn/Copy)
        SkeletonCards.tsx            # Loading skeletons
        StatusLifecycle.tsx          # Status timeline
        StatusLifecycleDropdown.tsx  # Status change dropdown
        SuccessCelebration.tsx       # Success celebration
        toasts.tsx                   # Toast helpers
      /ui
        (46 shadcn/ui components)    # Full primitive library
    /data
      community.ts                   # Circles & posts data
      companies.ts                   # Company profiles data
      courses.ts                     # Course data
      events.ts                      # Event data
      funding.ts                     # Funding data
      inbox.ts                       # Notification data
      mentorship.ts                  # Mentor/cohort data
      messaging.ts                   # Chat & connection data
      open-mic.ts                    # Open Mic data
      peer-pods.ts                   # Pod data
      people.ts                      # People directory data
      profile.ts                     # Profile types & mock data
      referrals.ts                   # Referral data
      reviews.ts                     # Reviews & ratings data
      supervision.ts                 # Supervision data
    /pages
      (50 page components)           # All navigable pages
    /utils
      calendar.ts                    # .ics file generation
      currency.ts                    # Currency symbols & formatting
  /styles
    fonts.css                        # Font imports
    index.css                        # Main CSS entry
    tailwind.css                     # Tailwind directives
    theme.css                        # Design tokens, animations, utilities
```

---

## 14. DESIGN RULES & CONVENTIONS

| Rule | Detail |
|---|---|
| No Tailwind font-size/weight/line-height classes | Use inline `style` attributes unless explicitly asked |
| `<p>` in cards, not `<h1>`/`<h3>` | Semantic card text uses paragraph tags |
| `animate-fade-in` | Must NOT use `transform: translateY()` — opacity only |
| `.map()` wrapper | Use `<div className="contents">` instead of `React.Fragment` |
| Modal z-index | Platform standard: `z-[9999]` |
| Mobile nav drawer | Rendered **outside** `<header>` element in `Header.tsx` |
| Portal pattern | All modals render through `<Portal>` component to avoid stacking context from `animate-fade-in forwards` |
| Card padding | Responsive: `p-4 sm:p-6` or `p-5 sm:p-7` |
| Card footers | Stack on mobile: `flex-col sm:flex-row` |
| Text overflow | `min-w-0` + `truncate` on text containers |
| Tab bars | `scrollbar-hide` for horizontal scroll on mobile |

---

*Total: ~130 component files, ~50 pages, 15 data files, 2 utility files, 46 UI primitives*
