import React, { useState } from 'react';
import {
  Bell, Mail, ArrowLeft, Briefcase, FolderKanban, BookOpen, Calendar,
  Users, GraduationCap, MessageSquare, Flag, Star, CheckCircle2, Clock,
  Shield, Save, Globe,
} from 'lucide-react';

/* ═══ Types ═══ */

interface NotificationCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  preferences: NotificationPref[];
}

interface NotificationPref {
  id: string;
  label: string;
  description: string;
  email: boolean;
  inApp: boolean;
}

/* ═══ Mock Data ═══ */

const INITIAL_CATEGORIES: NotificationCategory[] = [
  {
    id: 'applications',
    label: 'Applications & Responses',
    icon: Briefcase,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    preferences: [
      { id: 'app_received', label: 'New application received', description: 'When someone applies to your listing', email: true, inApp: true },
      { id: 'app_status', label: 'Application status change', description: 'When your application is reviewed', email: true, inApp: true },
      { id: 'app_shortlisted', label: 'Shortlisted notification', description: 'When you are shortlisted for a position', email: true, inApp: true },
      { id: 'app_hired', label: 'Hired / Accepted notification', description: 'When you are accepted or hired', email: true, inApp: true },
    ],
  },
  {
    id: 'listings',
    label: 'Listings & Reviews',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    preferences: [
      { id: 'listing_approved', label: 'Listing approved', description: 'When your listing is approved by admin', email: true, inApp: true },
      { id: 'listing_rejected', label: 'Listing rejected', description: 'When your listing needs changes', email: true, inApp: true },
      { id: 'listing_expiring', label: 'Listing expiring soon', description: '7 days before your listing expires', email: true, inApp: false },
    ],
  },
  {
    id: 'events_courses',
    label: 'Events & Courses',
    icon: Calendar,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    preferences: [
      { id: 'event_reminder', label: 'Event reminders', description: '24 hours and 1 hour before registered events', email: true, inApp: true },
      { id: 'course_reminder', label: 'Course session reminders', description: 'Before enrolled course sessions', email: true, inApp: true },
      { id: 'rsvp_confirmation', label: 'RSVP confirmation', description: 'When your RSVP is confirmed', email: true, inApp: true },
      { id: 'event_updates', label: 'Event updates', description: 'When event details change after registration', email: true, inApp: true },
    ],
  },
  {
    id: 'supervision',
    label: 'Supervision & Mentoring',
    icon: Users,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    preferences: [
      { id: 'session_reminder', label: 'Session reminders', description: 'Before scheduled supervision/mentoring sessions', email: true, inApp: true },
      { id: 'session_scheduled', label: 'New session scheduled', description: 'When a new session is added to your calendar', email: true, inApp: true },
      { id: 'hub_activity', label: 'Hub activity', description: 'New discussions, resources, and updates in hubs', email: false, inApp: true },
    ],
  },
  {
    id: 'community',
    label: 'Community & Networking',
    icon: Globe,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    preferences: [
      { id: 'connection_request', label: 'Connection requests', description: 'When someone wants to connect with you', email: true, inApp: true },
      { id: 'message_received', label: 'New messages', description: 'When you receive a direct message', email: false, inApp: true },
      { id: 'circle_activity', label: 'Circle discussions', description: 'New posts in your circles', email: false, inApp: true },
      { id: 'mention', label: 'Mentions', description: 'When someone mentions you in a discussion', email: true, inApp: true },
    ],
  },
  {
    id: 'platform',
    label: 'Platform & Security',
    icon: Shield,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    preferences: [
      { id: 'security_alert', label: 'Security alerts', description: 'Login from new device, password changes', email: true, inApp: true },
      { id: 'platform_updates', label: 'Platform updates', description: 'New features and improvements', email: false, inApp: true },
      { id: 'weekly_digest', label: 'Weekly digest', description: 'Summary of activity and recommendations', email: true, inApp: false },
    ],
  },
];

/* ═══ Component ═══ */

interface NotificationSettingsPageProps {
  onBack: () => void;
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [saved, setSaved] = useState(false);

  const togglePref = (categoryId: string, prefId: string, channel: 'email' | 'inApp') => {
    setCategories(prev => prev.map(cat => {
      if (cat.id !== categoryId) return cat;
      return {
        ...cat,
        preferences: cat.preferences.map(p => p.id === prefId ? { ...p, [channel]: !p[channel] } : p),
      };
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const emailCount = categories.reduce((sum, cat) => sum + cat.preferences.filter(p => p.email).length, 0);
  const inAppCount = categories.reduce((sum, cat) => sum + cat.preferences.filter(p => p.inApp).length, 0);
  const totalPrefs = categories.reduce((sum, cat) => sum + cat.preferences.length, 0);

  return (
    <div className="flex flex-col w-full bg-[#f0f4f8] min-h-screen font-sans animate-fade-in">
      {/* ═══ HERO HEADER ═══ */}
      <div className="w-full bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-800 pt-10 pb-8 shadow-sm relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />
        <div className="max-w-3xl mx-auto px-6 relative z-10 flex flex-col gap-5">
          <button onClick={onBack} className="flex items-center gap-1.5 text-blue-200 hover:text-white transition-colors self-start -mb-2" style={{ fontSize: 13, fontWeight: 600 }}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
              <Bell size={24} className="text-white" />
            </div>
            <div>
              <p className="text-white" style={{ fontSize: 24, fontWeight: 800 }}>Notification Settings</p>
              <p className="text-blue-100 mt-1" style={{ fontSize: 14, fontWeight: 500 }}>
                Manage how and when PsycHIRE contacts you
              </p>
            </div>
          </div>

          {/* Summary Pills */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
              <Mail size={13} className="text-blue-300" />
              <span className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>{emailCount}/{totalPrefs} email notifications</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10">
              <Bell size={13} className="text-blue-300" />
              <span className="text-white" style={{ fontSize: 12, fontWeight: 500 }}>{inAppCount}/{totalPrefs} in-app notifications</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-3xl mx-auto w-full px-6 py-6 flex flex-col gap-5">
        {/* Column Headers */}
        <div className="flex items-center gap-3 px-5">
          <span className="flex-1" />
          <div className="flex items-center gap-8">
            <div className="w-16 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500">
                <Mail size={13} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>Email</span>
              </div>
            </div>
            <div className="w-16 text-center">
              <div className="flex items-center justify-center gap-1 text-gray-500">
                <Bell size={13} />
                <span style={{ fontSize: 11, fontWeight: 600 }}>In-App</span>
              </div>
            </div>
          </div>
        </div>

        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Category Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
              <div className={`w-9 h-9 rounded-lg ${category.bgColor} flex items-center justify-center`}>
                <category.icon size={16} className={category.color} />
              </div>
              <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>{category.label}</p>
            </div>

            {/* Preferences */}
            <div className="divide-y divide-gray-50">
              {category.preferences.map(pref => (
                <div key={pref.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800" style={{ fontSize: 13, fontWeight: 600 }}>{pref.label}</p>
                    <p className="text-gray-400 mt-0.5" style={{ fontSize: 11 }}>{pref.description}</p>
                  </div>
                  <div className="flex items-center gap-8 shrink-0">
                    <div className="w-16 flex justify-center">
                      <button
                        onClick={() => togglePref(category.id, pref.id, 'email')}
                        className={`w-10 h-6 rounded-full transition-all relative ${
                          pref.email ? 'bg-brand-primary' : 'bg-gray-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all ${
                          pref.email ? 'left-5' : 'left-1'
                        }`} />
                      </button>
                    </div>
                    <div className="w-16 flex justify-center">
                      <button
                        onClick={() => togglePref(category.id, pref.id, 'inApp')}
                        className={`w-10 h-6 rounded-full transition-all relative ${
                          pref.inApp ? 'bg-brand-primary' : 'bg-gray-200'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute top-1 transition-all ${
                          pref.inApp ? 'left-5' : 'left-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Save Button */}
        <div className="sticky bottom-0 bg-[#f0f4f8] py-4 -mx-6 px-6 border-t border-gray-200/50">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <p className="text-gray-400" style={{ fontSize: 12 }}>Changes are saved when you click Save.</p>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white transition-all shadow-sm ${
                saved ? 'bg-emerald-600' : 'bg-brand-primary hover:bg-brand-primary/90'
              }`}
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              {saved ? <><CheckCircle2 size={15} /> Saved!</> : <><Save size={15} /> Save Preferences</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
