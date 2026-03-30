import { useState, useRef, useEffect } from 'react';
import { MessageSquare, LogOut, User, Settings, HelpCircle, UserPlus, Check, X, ArrowLeft, Users, Shield, Building2, GraduationCap, Stethoscope, Menu, Home, Briefcase, BookOpen, Heart, Globe, Bell, CalendarDays } from 'lucide-react';
import { NotificationDropdown } from '@/app/components/NotificationDropdown';
import { MOCK_NOTIFICATIONS } from '@/app/data/notifications';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import {
  MOCK_CONNECTION_REQUESTS,
  type ConnectionRequest,
} from '@/app/data/messaging';
import logo from "@/assets/2fd24bdfa9a1550b5d535dd08073fdb193dd71ec.png";
import type { UserGroup } from '@/app/data/profile';

// Improved NavItem with a "Pill" design for the selected state
const NavItem = ({ 
  label, 
  active = false,
  onClick
}: { 
  label: string; 
  active?: boolean;
  onClick: () => void;
}) => (
  <button 
    onClick={onClick}
    className={`
      relative px-4 py-2.5 rounded-full text-[13px] lg:text-[15px] font-semibold transition-all duration-200 ease-in-out whitespace-nowrap
      ${active 
        ? 'bg-brand-primary/10 text-brand-primary' 
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
  >
    {label}
  </button>
);

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, params?: any) => void;
  onLogout?: () => void;
  onSwitchRole?: (role: UserGroup) => void;
  user?: {
    name: string;
    email: string;
    avatar: string;
    role?: UserGroup;
  };
}

export function Header({ currentPage, onNavigate, onLogout, onSwitchRole, user }: HeaderProps) {
  const isCompany = user?.role === 'Company';
  const isAdmin = user?.role === 'Admin';

  // Different nav for different roles — Dashboard always first
  const navItems = isAdmin
    ? ["Dashboard", "Admin Dashboard", "Opportunities", "Learning", "Community", "Events", "Network", "Funding"]
    : isCompany
      ? ["Dashboard", "My Listings", "Opportunities", "Learning", "Community", "Events", "Network", "Funding"]
      : ["Dashboard", "Opportunities", "Learning", "Community", "Events", "Network", "Funding"];

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [profileView, setProfileView] = useState<'menu' | 'requests'>('menu');
  const [requests, setRequests] = useState<ConnectionRequest[]>(MOCK_CONNECTION_REQUESTS);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  const userRole = user?.role || 'Student';
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const resolvedRequests = requests.filter(r => r.status !== 'pending');

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
        setProfileView('menu');
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleAccept = (id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'accepted' as const } : r))
    );
  };

  const handleReject = (id: string) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'rejected' as const } : r))
    );
  };

  const handleToggleMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
    if (isProfileMenuOpen) {
      setProfileView('menu');
    }
  };
  
  const defaultAvatar = "https://images.unsplash.com/photo-1707876447570-d2225b758f5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBpbmRpYW4lMjBmZW1hbGUlMjBzdHVkZW50JTIwcG9ydHJhaXQlMjBwc3ljaG9sb2d5fGVufDF8fHx8MTc3MDEwNjQ0MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

  const switchTarget: UserGroup = userRole === 'Professional' ? 'Student' : userRole === 'Student' ? 'Professional' : userRole === 'Company' ? 'Student' : 'Student';

  // Role options for role switcher
  const roleOptions: UserGroup[] = (['Student', 'Professional', 'Company', 'Admin'] as UserGroup[]).filter(r => r !== userRole);

  return (
    <>
    <header className="flex flex-col w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-[72px] flex items-center justify-between w-full">
        
        {/* 1. Left: Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer shrink-0"
          onClick={() => onNavigate('Dashboard')}
        >
           <ImageWithFallback src={logo} alt="PsycHire" className="h-8 w-auto object-contain" />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <Menu size={20} />
        </button>

        {/* 2. Center: Navigation Links */}
        <nav className="hidden lg:flex items-center justify-center gap-2 h-full flex-1">
          {navItems.map((item) => (
            <NavItem 
              key={item} 
              label={item} 
              active={currentPage === item}
              onClick={() => onNavigate(item)}
            />
          ))}
        </nav>
        
        {/* 3. Right: Actions & Profile */}
        <div className="hidden lg:flex items-center justify-end gap-5 w-[200px]">
          <div className="flex items-center gap-1">
             <div className="relative" ref={notifRef}>
               <button
                 onClick={() => { setIsNotifOpen(!isNotifOpen); setIsProfileMenuOpen(false); }}
                 className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100 ${isNotifOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                 title="Notifications"
               >
                 <Bell size={18} strokeWidth={2} />
               </button>
               {unreadNotifCount > 0 && (
                 <span
                   className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-red-500 text-white flex items-center justify-center px-1 border-2 border-white pointer-events-none"
                   style={{ fontSize: 9, fontWeight: 800 }}
                 >
                   {unreadNotifCount}
                 </span>
               )}
               {isNotifOpen && (
                 <NotificationDropdown
                   onNavigate={(page, params) => { setIsNotifOpen(false); onNavigate(page, params); }}
                   onClose={() => setIsNotifOpen(false)}
                 />
               )}
             </div>
             <button
               onClick={() => onNavigate('Messages')}
               className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100 text-gray-500 hover:text-gray-900"
               title="Messages"
             >
               <MessageSquare size={18} strokeWidth={2} />
             </button>
          </div>

          <div className="h-6 w-px bg-gray-200" />
          
          <div className="relative" ref={menuRef}>
            <button 
              className="flex items-center gap-2 cursor-pointer group outline-none relative"
              onClick={handleToggleMenu}
            >
              <div className={`w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent transition-all ${isProfileMenuOpen ? 'ring-brand-primary' : 'group-hover:ring-gray-200'}`}>
                 <ImageWithFallback 
                    src={user?.avatar || defaultAvatar} 
                    alt={user?.name || "User"} 
                    className="w-full h-full object-cover"
                 />
              </div>
              {/* Pending badge on avatar */}
              {pendingRequests.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] rounded-full bg-red-500 text-white flex items-center justify-center px-1 border-2 border-white"
                  style={{ fontSize: 9, fontWeight: 800 }}
                >
                  {pendingRequests.length}
                </span>
              )}
            </button>

            {/* Profile Popover — Menu View */}
            {isProfileMenuOpen && profileView === 'menu' && (
              <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-200/60 animate-fade-in origin-top-right overflow-hidden z-50"
                style={{ boxShadow: '0 12px 40px -8px rgba(0,0,0,0.12), 0 4px 12px -4px rgba(0,0,0,0.06)' }}
              >
                 {/* User info card */}
                 <div className="px-5 py-4 bg-gradient-to-br from-blue-50/80 to-white border-b border-gray-100">
                   <div className="flex items-center gap-3">
                     <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                       <ImageWithFallback src={user?.avatar || defaultAvatar} alt={user?.name || "User"} className="w-full h-full object-cover" />
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-2">
                         <p style={{ fontSize: 14, fontWeight: 700 }} className="text-gray-900 truncate">{user?.name || "Jane Doe"}</p>
                         <UserGroupBadge group={userRole} size="sm" />
                       </div>
                       <p className="text-gray-500 truncate mt-0.5" style={{ fontSize: 12 }}>{user?.email || "jane.doe@university.edu"}</p>
                     </div>
                   </div>
                 </div>
                 
                 {/* Menu items */}
                 <div className="px-2 py-2">
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setProfileView('menu');
                        onNavigate('Profile');
                      }}
                      className="w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl flex items-center gap-3 transition-all duration-150"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <User size={15} className="text-blue-600" />
                      </div>
                      <span>View Profile</span>
                    </button>

                    <button
                      onClick={() => setProfileView('requests')}
                      className="w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl flex items-center gap-3 transition-all duration-150"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <UserPlus size={15} className="text-emerald-600" />
                      </div>
                      <span className="flex-1">Connection Requests</span>
                      {pendingRequests.length > 0 && (
                        <span className="min-w-[20px] h-[20px] rounded-full bg-red-500 text-white flex items-center justify-center px-1"
                          style={{ fontSize: 10, fontWeight: 800 }}
                        >
                          {pendingRequests.length}
                        </span>
                      )}
                    </button>

                    <button className="w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl flex items-center gap-3 transition-all duration-150"
                      style={{ fontSize: 13, fontWeight: 600 }}
                      onClick={() => { onNavigate('NotificationSettings'); setIsProfileMenuOpen(false); }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        <Settings size={15} className="text-gray-500" />
                      </div>
                      <span>Settings</span>
                    </button>
                    <button className="w-full text-left px-3 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl flex items-center gap-3 transition-all duration-150"
                      style={{ fontSize: 13, fontWeight: 600 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                        <HelpCircle size={15} className="text-amber-600" />
                      </div>
                      <span>Help & Support</span>
                    </button>
                 </div>
                 
                 {/* Role Switcher */}
                 {onSwitchRole && (
                   <>
                     <div className="h-px bg-gray-100 mx-4" />
                     <div className="px-2 py-2">
                       <div className="px-3 py-1.5">
                         <p className="text-gray-400 uppercase tracking-wider" style={{ fontSize: 10, fontWeight: 700 }}>Switch Role</p>
                       </div>
                       {roleOptions.map(role => {
                         const RoleIcon = role === 'Student' ? GraduationCap : role === 'Professional' ? Stethoscope : role === 'Company' ? Building2 : Shield;
                         const iconBg = role === 'Student' ? 'bg-indigo-50' : role === 'Professional' ? 'bg-teal-50' : role === 'Company' ? 'bg-cyan-50' : 'bg-violet-50';
                         const iconColor = role === 'Student' ? 'text-indigo-600' : role === 'Professional' ? 'text-teal-600' : role === 'Company' ? 'text-cyan-600' : 'text-violet-600';
                         return (
                         <button
                           key={role}
                           onClick={() => {
                             setIsProfileMenuOpen(false);
                             setProfileView('menu');
                             onSwitchRole(role);
                           }}
                           className="w-full text-left px-3 py-2.5 text-brand-primary hover:bg-blue-50/60 rounded-xl flex items-center gap-3 transition-all duration-150"
                           style={{ fontSize: 13, fontWeight: 600 }}
                         >
                           <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
                             <RoleIcon size={15} className={iconColor} />
                           </div>
                           <span>{role}</span>
                         </button>
                         );
                       })}
                     </div>
                   </>
                 )}
                 
                 <div className="h-px bg-gray-100 mx-4" />
                 
                 <div className="px-2 py-2">
                    <button 
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setProfileView('menu');
                        if (onLogout) onLogout();
                      }}
                      className="w-full text-left px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl flex items-center gap-3 transition-all duration-150"
                      style={{ fontSize: 13, fontWeight: 700 }}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                        <LogOut size={15} className="text-red-500" />
                      </div>
                      <span>Sign Out</span>
                    </button>
                 </div>
              </div>
            )}

            {/* Profile Popover — Connection Requests View */}
            {isProfileMenuOpen && profileView === 'requests' && (
              <div className="absolute top-full right-0 mt-3 w-[calc(100vw-2rem)] sm:w-[400px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <button
                    onClick={() => setProfileView('menu')}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="flex items-center gap-2 flex-1">
                    <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>Connection Requests</p>
                    {pendingRequests.length > 0 && (
                      <span className="min-w-[20px] h-[20px] rounded-full bg-brand-primary text-white flex items-center justify-center px-1"
                        style={{ fontSize: 10, fontWeight: 800 }}
                      >
                        {pendingRequests.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-[480px] overflow-y-auto">

                  {/* Pending */}
                  {pendingRequests.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50/30 border-b border-gray-50">
                        <p className="text-gray-400 uppercase tracking-wider" style={{ fontSize: 10, fontWeight: 700 }}>
                          Pending · {pendingRequests.length}
                        </p>
                      </div>
                      {pendingRequests.map(req => (
                        <div key={req.id} className="px-4 py-4 border-b border-gray-50 hover:bg-gray-50/40 transition-colors">
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-100 shrink-0 cursor-pointer"
                              onClick={() => {
                                setIsProfileMenuOpen(false);
                                setProfileView('menu');
                                onNavigate('PersonProfile', { personId: req.person.id });
                              }}
                            >
                              <ImageWithFallback
                                src={req.person.avatarUrl}
                                alt={req.person.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className="text-gray-900 cursor-pointer hover:text-brand-primary transition-colors"
                                  style={{ fontSize: 13, fontWeight: 700 }}
                                  onClick={() => {
                                    setIsProfileMenuOpen(false);
                                    setProfileView('menu');
                                    onNavigate('PersonProfile', { personId: req.person.id });
                                  }}
                                >
                                  {req.person.name}
                                </span>
                                <UserGroupBadge group={req.person.userGroup} size="sm" />
                              </div>
                              <p className="text-gray-500 mt-1 line-clamp-2" style={{ fontSize: 12, lineHeight: '18px' }}>
                                {req.message}
                              </p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-gray-400" style={{ fontSize: 11, fontWeight: 500 }}>
                                  {timeAgo(req.timestamp)}
                                </span>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleReject(req.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                    style={{ fontSize: 11, fontWeight: 700 }}
                                  >
                                    <X size={12} />
                                    Decline
                                  </button>
                                  <button
                                    onClick={() => handleAccept(req.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
                                    style={{ fontSize: 11, fontWeight: 700 }}
                                  >
                                    <Check size={12} />
                                    Accept
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resolved */}
                  {resolvedRequests.length > 0 && (
                    <div>
                      <div className="px-4 py-2 bg-gray-50/30 border-b border-gray-50">
                        <p className="text-gray-400 uppercase tracking-wider" style={{ fontSize: 10, fontWeight: 700 }}>
                          Earlier
                        </p>
                      </div>
                      {resolvedRequests.map(req => (
                        <div
                          key={req.id}
                          className="px-4 py-3 border-b border-gray-50 flex items-center gap-3 opacity-60"
                        >
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 border border-gray-100 shrink-0">
                            <ImageWithFallback
                              src={req.person.avatarUrl}
                              alt={req.person.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-600" style={{ fontSize: 12 }}>
                              You {req.status === 'accepted' ? 'accepted' : 'declined'}{' '}
                              <span style={{ fontWeight: 700 }}>{req.person.name}</span>'s request
                            </p>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded ${
                              req.status === 'accepted'
                                ? 'bg-green-50 text-green-600'
                                : 'bg-gray-100 text-gray-500'
                            }`}
                            style={{ fontSize: 10, fontWeight: 700 }}
                          >
                            {req.status === 'accepted' ? 'Connected' : 'Declined'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty states */}
                  {pendingRequests.length === 0 && resolvedRequests.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center">
                        <Users size={20} className="text-gray-300" />
                      </div>
                      <p className="text-gray-500" style={{ fontSize: 13, fontWeight: 600 }}>No connection requests</p>
                      <p className="text-gray-400 text-center max-w-[240px]" style={{ fontSize: 12 }}>
                        When people want to connect with you, their requests will appear here.
                      </p>
                    </div>
                  )}

                  {pendingRequests.length === 0 && resolvedRequests.length > 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2 border-b border-gray-50">
                      <Check size={20} className="text-green-400" />
                      <p className="text-gray-500" style={{ fontSize: 12, fontWeight: 600 }}>All caught up!</p>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setProfileView('menu');
                      onNavigate('Network');
                    }}
                    className="w-full flex items-center justify-center gap-2 text-brand-primary hover:bg-brand-primary/5 py-2 rounded-lg transition-colors"
                    style={{ fontSize: 12, fontWeight: 700 }}
                  >
                    <Users size={14} />
                    Go to My Network
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* ═══ MOBILE NAVIGATION DRAWER ═══ */}
    {isMobileMenuOpen && (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        {/* Drawer */}
        <div className="fixed inset-y-0 right-0 w-[280px] bg-white shadow-2xl z-[101] lg:hidden flex flex-col" style={{ animation: 'slideInRight 200ms ease-out' }}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 h-[72px] border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setIsMobileMenuOpen(false); onNavigate('Dashboard'); }}>
              <ImageWithFallback src={logo} alt="PsycHire" className="h-7 w-auto object-contain" />
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* User Card */}
          <div className="px-4 py-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                <ImageWithFallback src={user?.avatar || defaultAvatar} alt={user?.name || "User"} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-gray-900 truncate" style={{ fontSize: 13, fontWeight: 700 }}>{user?.name || "Jane Doe"}</p>
                  <UserGroupBadge group={userRole} size="sm" />
                </div>
                <p className="text-gray-500 truncate" style={{ fontSize: 11 }}>{user?.email || "jane.doe@university.edu"}</p>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-3 px-3">
            <div className="flex flex-col gap-0.5">
              {navItems.map(item => {
                const isActive = currentPage === item;
                const iconMap: Record<string, React.ReactNode> = {
                  'Dashboard': <Home size={18} />,
                  'My Listings': <Building2 size={18} />,
                  'Admin Dashboard': <Shield size={18} />,
                  'Opportunities': <Briefcase size={18} />,
                  'Learning': <BookOpen size={18} />,
                  'Community': <Users size={18} />,
                  'Events': <CalendarDays size={18} />,
                  'Network': <Globe size={18} />,
                  'Funding': <Heart size={18} />,
                };
                return (
                  <button
                    key={item}
                    onClick={() => { setIsMobileMenuOpen(false); onNavigate(item); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-blue-50 text-brand-primary'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    style={{ fontSize: 14, fontWeight: isActive ? 700 : 500 }}
                  >
                    <span className={isActive ? 'text-brand-primary' : 'text-gray-400'}>{iconMap[item] || <Briefcase size={18} />}</span>
                    {item}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-3 mx-2" />

            {/* Quick Actions */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('Messages'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                <span className="text-gray-400"><MessageSquare size={18} /></span>
                Messages
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('Profile'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                <span className="text-gray-400"><User size={18} /></span>
                My Profile
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('Network'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                <span className="text-gray-400 relative">
                  <UserPlus size={18} />
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1">{pendingRequests.length}</span>
                  )}
                </span>
                Connection Requests
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); onNavigate('NotificationSettings'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                <span className="text-gray-400"><Settings size={18} /></span>
                Settings
              </button>
              <button
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                style={{ fontSize: 14, fontWeight: 500 }}
              >
                <span className="text-gray-400"><HelpCircle size={18} /></span>
                Help & Support
              </button>
            </div>
          </div>

          {/* Bottom — Role Switch + Sign Out */}
          <div className="border-t border-gray-100 px-3 py-3 shrink-0">
            {onSwitchRole && (
              <div className="mb-2">
                <p className="px-4 py-1 text-gray-400 uppercase tracking-wider" style={{ fontSize: 9, fontWeight: 700 }}>Switch Role</p>
                <div className="flex flex-wrap gap-1.5 px-3 mt-1">
                  {roleOptions.map(role => {
                    const RoleIcon = role === 'Student' ? GraduationCap : role === 'Professional' ? Stethoscope : role === 'Company' ? Building2 : Shield;
                    return (
                      <button
                        key={role}
                        onClick={() => { setIsMobileMenuOpen(false); onSwitchRole(role); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-brand-primary transition-all"
                        style={{ fontSize: 11, fontWeight: 600 }}
                      >
                        <RoleIcon size={13} /> {role}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <button
              onClick={() => { setIsMobileMenuOpen(false); if (onLogout) onLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
      </>
    )}
    </>
  );
}