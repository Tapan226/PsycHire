import React, { useState, useRef, useCallback } from 'react';
import { Header } from "@/app/components/Header";
import { HomePage } from "@/app/pages/HomePage";
import { OpportunitiesPage } from "@/app/pages/OpportunitiesPage";
import { JobDetailsPage } from "@/app/pages/JobDetailsPage";
import { ProjectDetailsPage } from "@/app/pages/ProjectDetailsPage";
import { LearningPage } from "@/app/pages/LearningPage";
import { CourseDetailsPage } from "@/app/pages/CourseDetailsPage";
import { EventDetailsPage } from "@/app/pages/EventDetailsPage";
import { MyCommunityPage } from "@/app/pages/MyCommunityPage";
import type { CommunityTab } from "@/app/pages/MyCommunityPage";
import { CommunityCirclePage } from "@/app/pages/CommunityCirclePage";
import { MyNetworkPage } from "@/app/pages/MyNetworkPage";
import { CompanyProfilePage } from "@/app/pages/CompanyProfilePage";
import { FundingPage } from "@/app/pages/FundingPage";
import { FundingDetailPage } from "@/app/pages/FundingDetailPage";
import { ProfilePage } from "@/app/pages/ProfilePage";
import { ReferralDetailPage } from "@/app/pages/ReferralDetailPage";
import { MessagesPage } from "@/app/pages/MessagesPage";
import { MentorProfilePage } from "@/app/pages/MentorProfilePage";
import { SupervisorProfilePage } from "@/app/pages/SupervisorProfilePage";
import { PodDetailPage } from "@/app/pages/PodDetailPage";
import { InsidePodPage } from "@/app/pages/InsidePodPage";
import { OpenMicPostDetailPage } from "@/app/pages/OpenMicPostDetailPage";
import { CompanyDashboardPage } from "@/app/pages/CompanyDashboardPage";
import { AdminDashboardPage } from "@/app/pages/AdminDashboardPage";
import { CreateJobPage } from "@/app/pages/CreateJobPage";
import { CreateProjectPage } from "@/app/pages/CreateProjectPage";
import { JobApplicationsPage } from "@/app/pages/JobApplicationsPage";
import { CreateEventPage } from "@/app/pages/CreateEventPage";
import { EventRegistrationsPage } from "@/app/pages/EventRegistrationsPage";
import { CreateCoursePage } from "@/app/pages/CreateCoursePage";
import { CourseEnrollmentsPage } from "@/app/pages/CourseEnrollmentsPage";
import { CreateSupervisionPage } from "@/app/pages/CreateSupervisionPage";
import { CreateCohortPage } from "@/app/pages/CreateCohortPage";
import { SupervisionApplicantsPage } from "@/app/pages/SupervisionApplicantsPage";
import { CohortApplicantsPage } from "@/app/pages/CohortApplicantsPage";
import { SupervisionHubPage } from "@/app/pages/SupervisionHubPage";
import { CohortHubPage } from "@/app/pages/CohortHubPage";
import { CandidateSearchPage } from "@/app/pages/CandidateSearchPage";
import { NotificationSettingsPage } from "@/app/pages/NotificationSettingsPage";
import { RequestFormPage } from "@/app/pages/RequestFormPage";
import type { RequestType } from "@/app/pages/RequestFormPage";
import { CreateReferralPage } from "@/app/pages/CreateReferralPage";
import { ReferralRespondentsPage } from "@/app/pages/ReferralRespondentsPage";
import { getPersonById } from "@/app/data/people";
import { Toaster } from "@/app/components/ui/sonner";
import { MobileBottomNav } from "@/app/components/MobileBottomNav";

// Auth Pages
import { LoginPage } from "@/app/pages/LoginPage";
import { SignupPage } from "@/app/pages/SignupPage";
import { OnboardingPage } from "@/app/pages/OnboardingPage";

import type { UserGroup } from '@/app/data/profile';

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: UserGroup;
}

export default function App() {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [authStep, setAuthStep] = useState<'Login' | 'Signup' | 'Onboarding'>('Login');
  const [isNewUser, setIsNewUser] = useState(false);
  
  // User Data — default to Student role
  const defaultUser: User = {
    name: 'Jane Doe',
    email: 'jane.doe@university.edu',
    avatar: 'https://images.unsplash.com/photo-1663670761152-3b9f3edfdefc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB5b3VuZyUyMGZlbWFsZSUyMHN0dWRlbnQlMjBwb3J0cmFpdCUyMHBzeWNob2xvZ3l8ZW58MXx8fHwxNzcwMTA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    role: 'Student',
  };

  const professionalUser: User = {
    name: 'Dr. Arjun Mehta',
    email: 'arjun.mehta@serenityhealth.in',
    avatar: 'https://images.unsplash.com/photo-1649433658557-54cf58577c68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBtYW4lMjBkb2N0b3IlMjBibGF6ZXIlMjBjb25maWRlbnQlMjBwb3J0cmFpdCUyMHN0dWRpb3xlbnwxfHx8fDE3NzA3MTA3MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    role: 'Professional',
  };

  const companyUser: User = {
    name: 'MindCare Clinic',
    email: 'admin@mindcareclinic.com',
    avatar: 'https://images.unsplash.com/photo-1770627016447-cb9d29ed0398?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjB3b21hbiUyMGNvcnBvcmF0ZSUyMGJ1c2luZXNzJTIwaGVhZHNob3R8ZW58MXx8fHwxNzczNjY1MTk2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    role: 'Company',
  };

  const adminUser: User = {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@psychire.com',
    avatar: 'https://images.unsplash.com/photo-1603252112050-5ee77b4b4fde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBhZG1pbmlzdHJhdG9yJTIwZm9ybWFsJTIwcG9ydHJhaXQlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzM2NjUxOTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    role: 'Admin',
  };

  const [user, setUser] = useState<User>(defaultUser);
  const [tempSignupData, setTempSignupData] = useState<{name: string, email: string} | null>(null);

  // App State
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCircleId, setSelectedCircleId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [messagePersonId, setMessagePersonId] = useState<string | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState<string | null>(null);
  const [selectedFundingId, setSelectedFundingId] = useState<string | null>(null);
  const [selectedPodId, setSelectedPodId] = useState<string | null>(null);
  const [selectedOpenMicPostId, setSelectedOpenMicPostId] = useState<string | null>(null);
  const [networkInitialTab, setNetworkInitialTab] = useState<'people' | 'companies' | 'events'>('companies');
  const [learningInitialTab, setLearningInitialTab] = useState<'courses' | 'mentorship' | 'supervision'>('courses');
  const [communityInitialTab, setCommunityInitialTab] = useState<CommunityTab>('circles');
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [selectedJobIdForApps, setSelectedJobIdForApps] = useState<string | null>(null);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [editEventId, setEditEventId] = useState<string | null>(null);
  const [selectedEventIdForRegs, setSelectedEventIdForRegs] = useState<string | null>(null);
  const [editCourseId, setEditCourseId] = useState<string | null>(null);
  const [selectedCourseIdForEnrollments, setSelectedCourseIdForEnrollments] = useState<string | null>(null);
  const [selectedSupervisionIdForApps, setSelectedSupervisionIdForApps] = useState<string | null>(null);
  const [selectedCohortIdForApps, setSelectedCohortIdForApps] = useState<string | null>(null);
  const [selectedSupervisionHubId, setSelectedSupervisionHubId] = useState<string | null>(null);
  const [selectedCohortHubId, setSelectedCohortHubId] = useState<string | null>(null);
  const [requestFormType, setRequestFormType] = useState<RequestType>('course');
  const [editReferralId, setEditReferralId] = useState<string | null>(null);
  const [selectedReferralIdForRespondents, setSelectedReferralIdForRespondents] = useState<string | null>(null);

  /* ═══ Navigation History Stack ═══ */
  const navHistoryRef = useRef<string[]>(['Dashboard']);

  /** Resolves the canonical page name (after alias redirects) */
  const resolvePageName = (page: string): string => {
    if (page === 'Home') return 'Dashboard';
    if (page === 'My Listings') return 'CompanyDashboard';
    if (page === 'Admin Dashboard') return 'AdminDashboard';
    if (page === 'Jobs' || page === 'Projects') return 'Opportunities';
    if (page === 'Events') return 'Network';
    if (page === 'Companies') return 'Network';
    if (page === 'PeerPods') return 'Community';
    if (page === 'OpenMic') return 'Community';
    return page;
  };

  /** Push to navigation history (called inside handleNavigate before setCurrentPage) */
  const pushHistory = useCallback((page: string) => {
    const resolved = resolvePageName(page);
    const stack = navHistoryRef.current;
    // Don't push duplicates at the top
    if (stack[stack.length - 1] !== resolved) {
      stack.push(resolved);
      // Cap at 50 entries to prevent memory leaks
      if (stack.length > 50) stack.splice(0, stack.length - 50);
    }
  }, []);

  /** Restore correct sub-tab state when navigating back to a tabbed page */
  const restoreTabState = useCallback((page: string) => {
    if (page === 'Community') setCommunityInitialTab('circles');
    if (page === 'Network') setNetworkInitialTab('companies');
    if (page === 'Learning') setLearningInitialTab('courses');
  }, []);

  /** Go back to the previous page in the history stack */
  const goBack = useCallback(() => {
    const stack = navHistoryRef.current;
    // Pop the current page
    if (stack.length > 1) stack.pop();
    // The new top is where we go
    const target = stack[stack.length - 1] || 'Dashboard';
    restoreTabState(target);
    setCurrentPage(target);
  }, [restoreTabState]);

  // Helper to determine active nav item
  const getActiveNavItem = (page: string) => {
    if (page === 'CompanyDashboard' || page === 'CreateJob' || page === 'EditJob' || page === 'JobApplications' || page === 'CreateProject' || page === 'EditProject' || page === 'CreateEvent' || page === 'EditEvent' || page === 'EventRegistrations' || page === 'CreateCourse' || page === 'EditCourse' || page === 'CourseEnrollments' || page === 'CreateSupervision' || page === 'CreateCohort' || page === 'SupervisionApplicants' || page === 'CohortApplicants' || page === 'CandidateSearch' || page === 'CreateReferral' || page === 'EditReferral' || page === 'ReferralRespondents') return 'My Listings';
    if (page === 'NotificationSettings') return 'Profile';
    if (page === 'AdminDashboard') return 'Admin Dashboard';
    if (page === 'JobDetails') return 'Opportunities';
    if (page === 'ProjectDetails') return 'Opportunities';
    if (page === 'ReferralDetail') return 'Opportunities';
    if (page === 'Jobs') return 'Opportunities';
    if (page === 'Projects') return 'Opportunities';
    if (page === 'CourseDetails') return 'Learning';
    if (page === 'MentorProfile') return 'Learning';
    if (page === 'SupervisorProfile') return 'Learning';
    if (page === 'SupervisionHub' || page === 'CohortHub') return 'Learning';
    if (page === 'RequestForm') return 'Learning';
    if (page === 'EventDetails') return 'Network';
    if (page === 'CommunityCircle') return 'Community';
    if (page === 'PeerPods' || page === 'PodDetail' || page === 'InsidePod') return 'Community';
    if (page === 'OpenMicPostDetail') return 'Community';
    if (page === 'CompanyProfile') return 'Network';
    if (page === 'PersonProfile') return 'Network';
    if (page === 'FundingDetail') return 'Funding';
    if (page === 'Profile') return 'Profile';
    return page;
  };

  const handleCourseSelect = (courseId: string) => {
    pushHistory('CourseDetails');
    setSelectedCourseId(courseId);
    setLearningInitialTab('courses');
    setCurrentPage('CourseDetails');
  };

  const handleNavigate = (page: string, params?: any) => {
      if (page === 'CommunityCircle' && params?.circleId) {
          setSelectedCircleId(params.circleId);
      }
      if (page === 'CompanyProfile' && params?.companyId) {
          setSelectedCompanyId(params.companyId);
      }
      if (page === 'EventDetails' && params?.eventId) {
          setSelectedEventId(params.eventId);
      }
      if (page === 'ReferralDetail' && params?.referralId) {
          setSelectedReferralId(params.referralId);
      }
      if (page === 'PersonProfile' && params?.personId) {
          setSelectedPersonId(params.personId);
      }
      if (page === 'MentorProfile' && params?.mentorId) {
          setSelectedMentorId(params.mentorId);
          setLearningInitialTab('mentorship');
      }
      if (page === 'SupervisorProfile' && params?.supervisorId) {
          setSelectedSupervisorId(params.supervisorId);
          setLearningInitialTab('supervision');
      }
      if (page === 'FundingDetail' && params?.fundingId) {
          setSelectedFundingId(params.fundingId);
      }
      if ((page === 'PodDetail' || page === 'InsidePod') && params?.podId) {
          setSelectedPodId(params.podId);
      }
      if (page === 'OpenMicPostDetail' && params?.postId) {
          setSelectedOpenMicPostId(params.postId);
      }
      if (page === 'Messages') {
          setMessagePersonId(params?.personId ?? null);
          setShowMessagesModal(true);
          return;
      }
      // Legacy navigation compatibility — redirect old names to new
      if (page === 'Home') {
        pushHistory('Dashboard');
        setCurrentPage('Dashboard');
        return;
      }
      if (page === 'My Listings') {
        pushHistory('CompanyDashboard');
        setCurrentPage('CompanyDashboard');
        return;
      }
      if (page === 'Admin Dashboard') {
        pushHistory('AdminDashboard');
        setCurrentPage('AdminDashboard');
        return;
      }
      if (page === 'CreateJob') {
        pushHistory('CreateJob');
        setCurrentPage('CreateJob');
        return;
      }
      if (page === 'EditJob' && params?.jobId) {
        setEditJobId(params.jobId);
        pushHistory('EditJob');
        setCurrentPage('EditJob');
        return;
      }
      if (page === 'JobApplications' && params?.jobId) {
        setSelectedJobIdForApps(params.jobId);
        pushHistory('JobApplications');
        setCurrentPage('JobApplications');
        return;
      }
      if (page === 'CreateProject') {
        pushHistory('CreateProject');
        setCurrentPage('CreateProject');
        return;
      }
      if (page === 'EditProject' && params?.projectId) {
        setEditProjectId(params.projectId);
        pushHistory('EditProject');
        setCurrentPage('EditProject');
        return;
      }
      if (page === 'CreateEvent') {
        pushHistory('CreateEvent');
        setCurrentPage('CreateEvent');
        return;
      }
      if (page === 'EditEvent' && params?.eventId) {
        setEditEventId(params.eventId);
        pushHistory('EditEvent');
        setCurrentPage('EditEvent');
        return;
      }
      if (page === 'EventRegistrations' && params?.eventId) {
        setSelectedEventIdForRegs(params.eventId);
        pushHistory('EventRegistrations');
        setCurrentPage('EventRegistrations');
        return;
      }
      if (page === 'CreateCourse') {
        pushHistory('CreateCourse');
        setCurrentPage('CreateCourse');
        return;
      }
      if (page === 'EditCourse' && params?.courseId) {
        setEditCourseId(params.courseId);
        pushHistory('EditCourse');
        setCurrentPage('EditCourse');
        return;
      }
      if (page === 'CourseEnrollments' && params?.courseId) {
        setSelectedCourseIdForEnrollments(params.courseId);
        pushHistory('CourseEnrollments');
        setCurrentPage('CourseEnrollments');
        return;
      }
      if (page === 'CreateSupervision') {
        pushHistory('CreateSupervision');
        setCurrentPage('CreateSupervision');
        return;
      }
      if (page === 'CreateCohort') {
        pushHistory('CreateCohort');
        setCurrentPage('CreateCohort');
        return;
      }
      if (page === 'SupervisionApplicants' && params?.supervisionId) {
        setSelectedSupervisionIdForApps(params.supervisionId);
        pushHistory('SupervisionApplicants');
        setCurrentPage('SupervisionApplicants');
        return;
      }
      if (page === 'CohortApplicants' && params?.cohortId) {
        setSelectedCohortIdForApps(params.cohortId);
        pushHistory('CohortApplicants');
        setCurrentPage('CohortApplicants');
        return;
      }
      if (page === 'SupervisionHub' && params?.supervisionId) {
        setSelectedSupervisionHubId(params.supervisionId);
        pushHistory('SupervisionHub');
        setCurrentPage('SupervisionHub');
        return;
      }
      if (page === 'CohortHub' && params?.mentorshipId) {
        setSelectedCohortHubId(params.mentorshipId);
        pushHistory('CohortHub');
        setCurrentPage('CohortHub');
        return;
      }
      if (page === 'CandidateSearch') {
        pushHistory('CandidateSearch');
        setCurrentPage('CandidateSearch');
        return;
      }
      if (page === 'NotificationSettings') {
        pushHistory('NotificationSettings');
        setCurrentPage('NotificationSettings');
        return;
      }
      if (page === 'RequestForm') {
        if (params?.requestType) setRequestFormType(params.requestType as RequestType);
        pushHistory('RequestForm');
        setCurrentPage('RequestForm');
        return;
      }
      if (page === 'CreateReferral') {
        pushHistory('CreateReferral');
        setCurrentPage('CreateReferral');
        return;
      }
      if (page === 'EditReferral' && params?.referralId) {
        setEditReferralId(params.referralId);
        pushHistory('EditReferral');
        setCurrentPage('EditReferral');
        return;
      }
      if (page === 'ReferralRespondents' && params?.referralId) {
        setSelectedReferralIdForRespondents(params.referralId);
        pushHistory('ReferralRespondents');
        setCurrentPage('ReferralRespondents');
        return;
      }
      if (page === 'Jobs' || page === 'Projects') {
        pushHistory('Opportunities');
        setCurrentPage('Opportunities');
        return;
      }
      if (page === 'Events') {
        setNetworkInitialTab('events');
        pushHistory('Network');
        setCurrentPage('Network');
        return;
      }
      if (page === 'Companies') {
        setNetworkInitialTab('companies');
        pushHistory('Network');
        setCurrentPage('Network');
        return;
      }
      if (page === 'PeerPods') {
        setCommunityInitialTab('peer-pods');
        pushHistory('Community');
        setCurrentPage('Community');
        return;
      }
      if (page === 'OpenMic') {
        setCommunityInitialTab('open-mic');
        pushHistory('Community');
        setCurrentPage('Community');
        return;
      }
      if (page === 'Network') {
        // Only reset tab if not explicitly set by back-navigation
        if (!params?.tab) setNetworkInitialTab('companies');
      }
      if (page === 'Community') {
        if (!params?.tab) setCommunityInitialTab('circles');
      }
      pushHistory(page);
      setCurrentPage(page);
  };

  // Role Switching
  const handleSwitchRole = (role: UserGroup) => {
    if (role === 'Professional') {
      setUser(professionalUser);
    } else if (role === 'Company') {
      setUser(companyUser);
    } else if (role === 'Admin') {
      setUser(adminUser);
    } else {
      setUser(defaultUser);
    }
    setCurrentPage('Dashboard');
  };

  // Auth Handlers
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsNewUser(false);
    setUser(defaultUser);
    setCurrentPage('Dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthStep('Login');
    setCurrentPage('Dashboard');
    setIsNewUser(false);
    setTempSignupData(null);
  };

  const handleSignupStart = () => {
    setAuthStep('Signup');
  };

  const handleSignupComplete = (data: {name: string, email: string}) => {
    setTempSignupData(data);
    setAuthStep('Onboarding');
  };

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
    setIsNewUser(true);
    
    if (tempSignupData) {
      setUser({
        name: tempSignupData.name,
        email: tempSignupData.email,
        avatar: 'https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBwc3ljaG9sb2d5fGVufDF8fHx8MTc3MDEwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        role: 'Student',
      });
    } else {
      setUser(defaultUser);
    }
    
    setCurrentPage('Dashboard');
  };

  // Render Auth Flow if not logged in
  if (!isLoggedIn) {
    if (authStep === 'Login') {
      return <LoginPage onLogin={handleLogin} onSignup={handleSignupStart} />;
    }
    if (authStep === 'Signup') {
      return (
        <SignupPage 
          onSignupComplete={handleSignupComplete} 
          onLogin={() => setAuthStep('Login')} 
        />
      );
    }
    if (authStep === 'Onboarding') {
      return <OnboardingPage onComplete={handleOnboardingComplete} />;
    }
  }

  const mainContainerClasses = "w-full flex-1 flex flex-col pb-[68px] lg:pb-0";

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-['Inter',sans-serif] text-gray-900 flex flex-col">
      <Header 
        currentPage={getActiveNavItem(currentPage)} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        user={user}
        onSwitchRole={handleSwitchRole}
      />
      
      <main className={mainContainerClasses}>
        
        {currentPage === 'Dashboard' && (
          <HomePage 
            onNavigate={handleNavigate} 
            user={user} 
            isNewUser={isNewUser}
          />
        )}

        {currentPage === 'CompanyDashboard' && (
          <CompanyDashboardPage onNavigate={handleNavigate} user={user} />
        )}

        {currentPage === 'AdminDashboard' && (
          <AdminDashboardPage onNavigate={handleNavigate} />
        )}
        
        {currentPage === 'CreateJob' && (
          <CreateJobPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'EditJob' && editJobId && (
          <CreateJobPage
            onBack={goBack}
            onNavigate={handleNavigate}
            editMode
            editJobId={editJobId}
          />
        )}

        {currentPage === 'CreateProject' && (
          <CreateProjectPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'EditProject' && editProjectId && (
          <CreateProjectPage
            onBack={goBack}
            onNavigate={handleNavigate}
            editMode
            editProjectId={editProjectId}
          />
        )}

        {currentPage === 'JobApplications' && selectedJobIdForApps && (
          <JobApplicationsPage
            jobId={selectedJobIdForApps}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'CreateEvent' && (
          <CreateEventPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'EditEvent' && editEventId && (
          <CreateEventPage
            onBack={goBack}
            onNavigate={handleNavigate}
            editMode
            editEventId={editEventId}
          />
        )}

        {currentPage === 'EventRegistrations' && selectedEventIdForRegs && (
          <EventRegistrationsPage
            eventId={selectedEventIdForRegs}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentPage === 'CreateCourse' && (
          <CreateCoursePage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'EditCourse' && editCourseId && (
          <CreateCoursePage
            onBack={goBack}
            onNavigate={handleNavigate}
            editMode
            editCourseId={editCourseId}
          />
        )}

        {currentPage === 'CourseEnrollments' && selectedCourseIdForEnrollments && (
          <CourseEnrollmentsPage
            courseId={selectedCourseIdForEnrollments}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentPage === 'CreateSupervision' && (
          <CreateSupervisionPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'CreateCohort' && (
          <CreateCohortPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'SupervisionApplicants' && selectedSupervisionIdForApps && (
          <SupervisionApplicantsPage
            supervisionId={selectedSupervisionIdForApps}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'CohortApplicants' && selectedCohortIdForApps && (
          <CohortApplicantsPage
            cohortId={selectedCohortIdForApps}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'SupervisionHub' && selectedSupervisionHubId && (
          <SupervisionHubPage
            supervisionId={selectedSupervisionHubId}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'CohortHub' && selectedCohortHubId && (
          <CohortHubPage
            mentorshipId={selectedCohortHubId}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}
        
        {currentPage === 'Opportunities' && (
          <OpportunitiesPage onNavigate={handleNavigate} userRole={user.role} />
        )}

        {currentPage === 'JobDetails' && (
          <JobDetailsPage onBack={goBack} onNavigate={handleNavigate} userRole={user.role} />
        )}

        {currentPage === 'ProjectDetails' && (
          <ProjectDetailsPage onBack={goBack} onNavigate={handleNavigate} userRole={user.role} />
        )}

        {currentPage === 'ReferralDetail' && selectedReferralId && (
          <ReferralDetailPage
            referralId={selectedReferralId}
            onBack={goBack}
            onNavigate={handleNavigate}
            userRole={user.role}
          />
        )}

        {currentPage === 'Learning' && (
          <LearningPage 
            onNavigate={handleNavigate} 
            onCourseSelect={handleCourseSelect}
            userRole={user.role}
            initialTab={learningInitialTab}
          />
        )}

        {currentPage === 'CourseDetails' && selectedCourseId && (
          <CourseDetailsPage 
            courseId={selectedCourseId} 
            onBack={goBack}
            onNavigate={handleNavigate}
            userRole={user.role}
          />
        )}

        {currentPage === 'Community' && (
          <MyCommunityPage onNavigate={handleNavigate} userRole={user.role} initialTab={communityInitialTab} />
        )}

        {currentPage === 'PodDetail' && selectedPodId && (
          <PodDetailPage
            podId={selectedPodId}
            onBack={goBack}
            onNavigate={handleNavigate}
            userRole={user.role}
          />
        )}

        {currentPage === 'InsidePod' && selectedPodId && (
          <InsidePodPage
            podId={selectedPodId}
            onBack={goBack}
            onNavigate={handleNavigate}
            userRole={user.role}
          />
        )}

        {currentPage === 'CommunityCircle' && selectedCircleId && (
          <CommunityCirclePage 
            circleId={selectedCircleId} 
            onBack={goBack}
            userRole={user.role}
          />
        )}

        {currentPage === 'Network' && (
          <MyNetworkPage onNavigate={handleNavigate} userRole={user.role} initialTab={networkInitialTab} />
        )}

        {currentPage === 'CompanyProfile' && selectedCompanyId && (
          <CompanyProfilePage 
            companyId={selectedCompanyId}
            onNavigate={handleNavigate}
            onBack={goBack}
          />
        )}

        {currentPage === 'EventDetails' && selectedEventId && (
          <EventDetailsPage 
            eventId={selectedEventId}
            onBack={goBack}
            onNavigate={handleNavigate}
            userRole={user.role}
          />
        )}

        {currentPage === 'Funding' && (
          <FundingPage onNavigate={handleNavigate} userRole={user.role} />
        )}

        {currentPage === 'FundingDetail' && selectedFundingId && (
          <FundingDetailPage 
            fundingId={selectedFundingId}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'Profile' && (
          <ProfilePage onNavigate={handleNavigate} user={user} />
        )}

        {currentPage === 'PersonProfile' && selectedPersonId && (() => {
          const person = getPersonById(selectedPersonId);
          if (!person) return null;
          const personUser = {
            name: person.name,
            email: '',
            avatar: person.avatarUrl,
            role: person.userGroup,
          };
          return (
            <ProfilePage
              onNavigate={handleNavigate}
              user={personUser}
              personId={selectedPersonId}
              onBack={goBack}
            />
          );
        })()}

        {currentPage === 'MentorProfile' && selectedMentorId && (
          <MentorProfilePage
            mentorId={selectedMentorId}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'SupervisorProfile' && selectedSupervisorId && (
          <SupervisorProfilePage
            supervisorId={selectedSupervisorId}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'OpenMicPostDetail' && selectedOpenMicPostId && (
          <OpenMicPostDetailPage
            postId={selectedOpenMicPostId}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'CandidateSearch' && (
          <CandidateSearchPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'NotificationSettings' && (
          <NotificationSettingsPage
            onBack={goBack}
          />
        )}

        {currentPage === 'RequestForm' && (
          <RequestFormPage
            onBack={goBack}
            onNavigate={handleNavigate}
            requestType={requestFormType}
          />
        )}

        {currentPage === 'CreateReferral' && (
          <CreateReferralPage
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'EditReferral' && editReferralId && (
          <CreateReferralPage
            onBack={goBack}
            onNavigate={handleNavigate}
            editMode
            editReferralId={editReferralId}
          />
        )}

        {currentPage === 'ReferralRespondents' && selectedReferralIdForRespondents && (
          <ReferralRespondentsPage
            referralId={selectedReferralIdForRespondents}
            onBack={goBack}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Messages Modal Overlay */}
      {showMessagesModal && (
        <MessagesPage
          onNavigate={handleNavigate}
          onClose={() => setShowMessagesModal(false)}
          initialConversationPersonId={messagePersonId}
        />
      )}

      {/* Global Toast Provider */}
      <Toaster position="bottom-right" richColors closeButton />
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={user.role}
      />
    </div>
  );
}