import React from 'react';
import { Home, Briefcase, BookOpen, Users, Globe, Heart, Building2, Shield, CalendarDays } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
}

interface NavTab {
  id: string;
  label: string;
  icon: React.ElementType;
  page: string;
}

export function MobileBottomNav({ currentPage, onNavigate, userRole }: MobileBottomNavProps) {
  const isCompany = userRole === 'Company';
  const isAdmin = userRole === 'Admin';

  const tabs: NavTab[] = [
    { id: 'home', label: 'Home', icon: Home, page: 'Dashboard' },
    ...(isAdmin ? [{ id: 'admin', label: 'Admin', icon: Shield, page: 'AdminDashboard' }] : []),
    ...(isCompany ? [{ id: 'listings', label: 'Listings', icon: Building2, page: 'CompanyDashboard' }] : []),
    { id: 'opportunities', label: 'Jobs', icon: Briefcase, page: 'Opportunities' },
    { id: 'learning', label: 'Learn', icon: BookOpen, page: 'Learning' },
    { id: 'community', label: 'Community', icon: Users, page: 'Community' },
    { id: 'events', label: 'Events', icon: CalendarDays, page: 'Events' },
    { id: 'network', label: 'Network', icon: Globe, page: 'Network' },
    { id: 'funding', label: 'Funding', icon: Heart, page: 'Funding' },
  ];

  const getActivePage = (page: string): string => {
    if (['CompanyDashboard', 'CreateJob', 'EditJob', 'JobApplications', 'ProjectApplications', 'CreateProject', 'EditProject', 'CreateEvent', 'EditEvent', 'EventRegistrations', 'CreateCourse', 'EditCourse', 'CourseEnrollments', 'CreateSupervision', 'CreateCohort', 'SupervisionApplicants', 'CohortApplicants', 'CandidateSearch'].includes(page)) return 'CompanyDashboard';
    if (page === 'AdminDashboard') return 'AdminDashboard';
    if (['JobDetails', 'ProjectDetails', 'ReferralDetail'].includes(page)) return 'Opportunities';
    if (['CourseDetails', 'MentorProfile', 'SupervisorProfile', 'SupervisionHub', 'CohortHub', 'RequestForm'].includes(page)) return 'Learning';
    if (['CommunityCircle', 'PodDetail', 'InsidePod', 'OpenMicPostDetail'].includes(page)) return 'Community';
    if (['EventDetails', 'EventRegistrations'].includes(page)) return 'Events';
    if (['CompanyProfile', 'PersonProfile'].includes(page)) return 'Network';
    if (['FundingDetail'].includes(page)) return 'Funding';
    return page;
  };

  const activePage = getActivePage(currentPage);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden safe-area-bottom"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center h-[60px] overflow-x-auto scrollbar-hide">
        {tabs.map(tab => {
          const isActive = activePage === tab.page;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.page === 'CompanyDashboard' ? 'My Listings' : tab.page === 'AdminDashboard' ? 'Admin Dashboard' : tab.page)}
              className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] px-2 h-full shrink-0 transition-colors ${
                isActive ? 'text-[#1e40af]' : 'text-gray-400'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, whiteSpace: 'nowrap' }}>{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#1e40af]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}