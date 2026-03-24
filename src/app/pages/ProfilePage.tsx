import React, { useState, useCallback, useEffect } from 'react';
import {
  MapPin,
  ShieldCheck,
  GraduationCap,
  Pencil,
  FileText,
  Clock,
  Globe,
  Briefcase,
  Award,
  AlertCircle,
  Check,
  CheckCircle2,
  X,
  Plus,
  Trash2,
  Save,
  Camera,
  Share2,
  MessageSquare,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { RUPEE } from '@/app/utils/currency';
import { Tooltip } from '@/app/components/Tooltip';
import { UserGroupBadge } from '@/app/components/profile/UserGroupBadge';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Switch } from '@/app/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  mockProfile,
  mockProfessionalProfile,
  getOpenToOptions,
  calculateProfileCompletion,
  type StudentProfile,
  type ExperienceEntry,
  type RecognitionEntry,
  type TalkEntry,
  type WorkMode,
} from '@/app/data/profile';
import { getPersonById, personToProfile } from '@/app/data/people';
import { FeedbackReviews } from '@/app/components/shared/FeedbackReviews';
import { getProfileReviews, getAverageRating } from '@/app/data/reviews';
import { Star } from 'lucide-react';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
  user?: { name: string; email: string; avatar: string; role?: string };
  personId?: string;
  onBack?: () => void;
}

type EditSection =
  | 'header' | 'about' | 'education' | 'specialization' | 'experience'
  | 'supervision' | 'recognition' | 'openTo' | 'availability'
  | 'publications' | 'talks' | 'supervisionGiven' | 'mentoring' | null;

type ProfileTab = 'overview' | 'experience' | 'credentials' | 'preferences' | 'reviews';

const expTypeStyles: Record<string, string> = {
  Work: 'bg-blue-50 text-blue-700 border-blue-100',
  Research: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  Volunteering: 'bg-green-50 text-green-700 border-green-100',
  CSR: 'bg-amber-50 text-amber-700 border-amber-100',
};

const recTypeStyles: Record<string, string> = {
  Certification: 'bg-purple-50 text-purple-700 border-purple-100',
  Achievement: 'bg-blue-50 text-blue-700 border-blue-100',
  Award: 'bg-amber-50 text-amber-700 border-amber-100',
};

const talkTypeStyles: Record<string, string> = {
  Talk: 'bg-blue-50 text-blue-700 border-blue-100',
  Workshop: 'bg-purple-50 text-purple-700 border-purple-100',
  Keynote: 'bg-amber-50 text-amber-700 border-amber-100',
  Panel: 'bg-teal-50 text-teal-700 border-teal-100',
};

// ═══════════════════════════════════════════════════════════
// MAIN PROFILE PAGE
// ═══════════════════════════════════════════════════════════
export function ProfilePage({ onNavigate, user, personId, onBack }: ProfilePageProps) {
  const isProfessional = user?.role === 'Professional';
  const isOwner = !personId;

  // When viewing another person's profile, use their data
  const getBaseProfile = () => {
    if (personId) {
      const person = getPersonById(personId);
      if (person) return personToProfile(person);
    }
    return isProfessional ? mockProfessionalProfile : mockProfile;
  };

  const baseProfile = getBaseProfile();

  const [profile, setProfile] = useState<StudentProfile>({
    ...baseProfile,
    fullName: user?.name || baseProfile.fullName,
    avatarUrl: user?.avatar || baseProfile.avatarUrl,
  });

  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  const [draft, setDraft] = useState<Partial<StudentProfile>>({});
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'connected'>('none');
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');

  useEffect(() => {
    const newBase = getBaseProfile();
    setProfile({
      ...newBase,
      fullName: user?.name || newBase.fullName,
      avatarUrl: user?.avatar || newBase.avatarUrl,
    });
    setEditingSection(null);
    setActiveTab('overview');
    // Set initial connection status from person data
    if (personId) {
      const person = getPersonById(personId);
      if (person?.isConnected) setConnectionStatus('connected');
      else if (person?.isPending) setConnectionStatus('pending');
      else setConnectionStatus('none');
    }
  }, [user?.role, personId]);

  const completion = calculateProfileCompletion(profile);

  const openEdit = useCallback((section: EditSection) => {
    setDraft({ ...profile });
    setEditingSection(section);
  }, [profile]);

  const closeEdit = useCallback(() => {
    setEditingSection(null);
    setDraft({});
  }, []);

  const saveEdit = useCallback(() => {
    setProfile((prev) => ({ ...prev, ...draft }));
    setEditingSection(null);
    setDraft({});
  }, [draft]);

  const updateDraft = useCallback(<K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }, []);

  const SectionEdit = ({ section }: { section: EditSection }) =>
    isOwner ? (
      <button
        onClick={() => openEdit(section)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-gray-200 text-gray-500 bg-white hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50/50 transition-all"
      >
        <Pencil size={12} /> Edit
      </button>
    ) : null;

  // Reviews data for this profile
  const profileReviewId = isProfessional ? 'profile-professional' : 'profile-student';
  const profileReviews = getProfileReviews(profileReviewId);
  const profileAvgRating = getAverageRating(profileReviews);

  const TABS: { id: ProfileTab; label: string; badge?: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'experience', label: 'Experience' },
    { id: 'credentials', label: 'Credentials' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'reviews', label: 'Reviews', badge: profileReviews.length > 0 ? (
      <span className="inline-flex items-center gap-0.5 ml-1.5 text-amber-500" style={{ fontSize: 11, fontWeight: 700 }}>
        <Star size={10} fill="currentColor" /> {profileAvgRating.toFixed(1)} ({profileReviews.length})
      </span>
    ) : undefined },
  ];

  // ═══════════════════════════════════════════════════════════
  // TAB CONTENT
  // ═══════════════════════════════════════════════════════════
  const renderTabContent = () => {
    switch (activeTab) {
      // ─── OVERVIEW ─────────────────────────────────────
      case 'overview':
        return (
          <>
            {/* About */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">About</h2>
                <SectionEdit section="about" />
              </div>
              <p className="text-[15px] text-gray-600 leading-[1.75]">{profile.bio}</p>
              {profile.careerVision && (
                <div className="mt-5 pt-5 border-t border-gray-50">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Career Vision</span>
                  <p className="text-[15px] text-gray-600 leading-[1.75]">{profile.careerVision}</p>
                </div>
              )}
            </section>

            {/* Education */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Education</h2>
                <SectionEdit section="education" />
              </div>
              <div className="space-y-4">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <GraduationCap size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-bold text-gray-900">{edu.degree}</p>
                      <p className="text-[13px] text-gray-500 mt-0.5">{edu.institution}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[12px] text-gray-400 font-medium">{edu.year}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${
                          edu.status === 'Ongoing' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                        }`}>{edu.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {profile.education.length === 0 && (
                  <p className="text-[13px] text-gray-400">No education entries yet.</p>
                )}
              </div>
            </section>

            {/* Specialization */}
            <section className="pb-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Specialization & Focus</h2>
                <SectionEdit section="specialization" />
              </div>
              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Areas of Specialization</span>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map((s) => (
                      <span key={s} className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-100">{s}</span>
                    ))}
                    {profile.specializations.length === 0 && <span className="text-[13px] text-gray-400">Not specified</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Population of Interest</span>
                  <p className="text-[13px] text-gray-700 font-medium">{profile.populationOfInterest || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Languages</span>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.languages.map((lang) => (
                      <span key={lang} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-gray-50 text-gray-600 border border-gray-100">
                        <Globe size={11} className="text-gray-400" />{lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        );

      // ─── EXPERIENCE ───────────────────────────────────
      case 'experience':
        return (
          <>
            {/* CV */}
            {profile.cvUploaded && (
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-7">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 truncate">{profile.cvFileName}</p>
                  <p className="text-[11px] text-gray-400">Resume / CV</p>
                </div>
                {isOwner && (
                  <button className="text-[12px] font-bold text-brand-primary hover:underline">Replace</button>
                )}
              </div>
            )}

            {/* Experience Entries */}
            <section className={`pb-7 ${(isProfessional && ((profile.publications || []).length > 0 || (profile.talks || []).length > 0)) ? 'mb-7 border-b border-gray-100' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Experience</h2>
                <SectionEdit section="experience" />
              </div>
              <div className="space-y-4">
                {profile.experience.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-[14px] font-bold text-gray-900">{exp.title}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${expTypeStyles[exp.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>{exp.type}</span>
                    </div>
                    <p className="text-[13px] text-gray-500">{exp.organization}</p>
                    <p className="text-[12px] text-gray-400 mt-0.5">{exp.duration}</p>
                    <p className="text-[13px] text-gray-600 leading-relaxed mt-2">{exp.description}</p>
                  </div>
                ))}
                {profile.experience.length === 0 && (
                  <p className="text-[13px] text-gray-400">No experience entries yet.</p>
                )}
              </div>
            </section>

            {/* Publications (Professional) */}
            {isProfessional && (profile.publications || []).length > 0 && (
              <section className={`pb-7 ${(profile.talks || []).length > 0 ? 'mb-7 border-b border-gray-100' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">Publications</h2>
                  <SectionEdit section="publications" />
                </div>
                <div className="space-y-4">
                  {(profile.publications || []).map((pub) => (
                    <div key={pub.id} className="p-5 rounded-xl bg-gray-50 border border-gray-100">
                      <p className="text-[14px] font-bold text-gray-900">{pub.title}</p>
                      <p className="text-[13px] text-gray-500 mt-1">{pub.journal}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[12px] text-gray-400 font-medium">{pub.year}</span>
                        {pub.coAuthors && <span className="text-[12px] text-gray-400">with {pub.coAuthors}</span>}
                      </div>
                      {pub.doi && <p className="text-[12px] text-brand-primary mt-1 font-medium">DOI: {pub.doi}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Talks (Professional) */}
            {isProfessional && (profile.talks || []).length > 0 && (
              <section className="pb-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">Talks & Workshops</h2>
                  <SectionEdit section="talks" />
                </div>
                <div className="space-y-3">
                  {(profile.talks || []).map((talk) => (
                    <div key={talk.id} className="flex items-start gap-3.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Globe size={16} className="text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[14px] font-bold text-gray-900">{talk.title}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${talkTypeStyles[talk.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>{talk.type}</span>
                        </div>
                        <p className="text-[13px] text-gray-500 mt-0.5">{talk.event}</p>
                        <p className="text-[12px] text-gray-400 mt-0.5">{talk.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        );

      // ─── CREDENTIALS ──────────────────────────────────
      case 'credentials':
        return (
          <>
            {/* Recognition */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Recognition</h2>
                <SectionEdit section="recognition" />
              </div>
              <div className="space-y-3">
                {profile.recognition.map((rec) => (
                  <div key={rec.id} className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Award size={16} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[14px] font-bold text-gray-900">{rec.title}</p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${recTypeStyles[rec.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>{rec.type}</span>
                      </div>
                      <p className="text-[13px] text-gray-500 mt-0.5">{rec.issuer}</p>
                      <p className="text-[12px] text-gray-400 mt-0.5">{rec.year}</p>
                    </div>
                  </div>
                ))}
                {profile.recognition.length === 0 && (
                  <p className="text-[13px] text-gray-400">No recognition entries yet.</p>
                )}
              </div>
            </section>

            {/* Supervision (Student) */}
            {!isProfessional && (
              <section className="pb-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">Supervision</h2>
                  <SectionEdit section="supervision" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Hours Completed</span>
                    <span className="text-[13px] font-semibold text-gray-800">{profile.supervision.hoursCompleted}</span>
                  </div>
                  {profile.supervision.supervisorName && (
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Supervisor</span>
                      <span className="text-[13px] font-semibold text-gray-800">{profile.supervision.supervisorName}</span>
                    </div>
                  )}
                </div>
                {profile.supervision.feedbackNotes && (
                  <p className="text-[13px] text-gray-500 italic leading-relaxed">&ldquo;{profile.supervision.feedbackNotes}&rdquo;</p>
                )}
              </section>
            )}

            {/* Supervision Given (Professional) */}
            {isProfessional && profile.supervisionGiven && (
              <section className="pb-7 mb-7 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">Supervision (Given)</h2>
                  <SectionEdit section="supervisionGiven" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Hours Given</span>
                    <span className="text-sm text-gray-900 font-semibold">{profile.supervisionGiven.totalHoursGiven}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Active Supervisees</span>
                    <span className="text-sm text-gray-900 font-semibold">{profile.supervisionGiven.activeSupervisees}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Certificates Issued</span>
                    <span className="text-sm text-gray-900 font-semibold">{profile.supervisionGiven.certificatesIssued}</span>
                  </div>
                </div>
                {profile.licenseNumber && (
                  <div className="mt-4">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">License Number</span>
                    <span className="text-[13px] font-semibold text-gray-800">{profile.licenseNumber}</span>
                  </div>
                )}
              </section>
            )}

            {/* Mentoring (Professional) */}
            {isProfessional && profile.mentoring && (
              <section className="pb-7">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[17px] font-bold text-gray-900">Mentoring</h2>
                  <SectionEdit section="mentoring" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                    <span className="text-sm text-gray-900 font-semibold">{profile.mentoring.isRegisteredMentor ? 'Registered Mentor' : 'Not Registered'}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Active Mentees</span>
                    <span className="text-sm text-gray-900 font-semibold">{profile.mentoring.activeMentees}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Total Mentored</span>
                    <span className="text-sm text-gray-900 font-semibold">{profile.mentoring.totalMentored}</span>
                  </div>
                </div>
                {profile.costPerHour && (
                  <div className="mt-4">
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">Cost per Hour</span>
                    <span className="text-[13px] font-semibold text-gray-800">{profile.currency === 'INR' ? RUPEE : '$'}{profile.costPerHour?.toLocaleString()}</span>
                  </div>
                )}
              </section>
            )}
          </>
        );

      // ─── PREFERENCES ──────────────────────────────────
      case 'preferences':
        return (
          <>
            {/* Open To */}
            <section className="pb-7 mb-7 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Open To</h2>
                <SectionEdit section="openTo" />
              </div>
              {profile.openTo.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.openTo.map((item) => (
                    <span key={item} className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-semibold bg-teal-50 text-teal-700 border border-teal-100">{item}</span>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-gray-400">Not specified</p>
              )}
            </section>

            {/* Availability */}
            <section className="pb-7">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[17px] font-bold text-gray-900">Availability</h2>
                <SectionEdit section="availability" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Hours / Week</span>
                  <span className="text-sm text-gray-900 font-semibold">{profile.availabilityHours}</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Work Mode</span>
                  <span className="text-sm text-gray-900 font-semibold">{profile.preferredWorkMode}</span>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Open to Relocate</span>
                  <span className="text-sm text-gray-900 font-semibold">
                    {profile.relocationReady ? (
                      <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 size={14} /> Yes</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-gray-500"><X size={14} /> No</span>
                    )}
                  </span>
                </div>
              </div>
            </section>
          </>
        );

      // ─── REVIEWS ───────────────────────────────────────
      case 'reviews':
        return (
          <FeedbackReviews
            entityId={profileReviewId}
            entityType="mentor"
            entityName={profile.fullName}
            entityLabel="professional"
            reviews={profileReviews}
            canReview={!isOwner}
            title={`Reviews (${profileReviews.length})`}
          />
        );
    }
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="flex flex-col w-full bg-white min-h-screen font-sans animate-fade-in">

      {/* ═══ BACK BUTTON (visitor mode) ═══ */}
      {onBack && (
        <div className="w-full bg-[#f0f4f8] border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-[13px] font-bold text-cyan-700 hover:text-cyan-800 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to People
            </button>
          </div>
        </div>
      )}

      {/* ═══ HEADER (white, clean) ═══ */}
      <div className="w-full border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-0">

          {/* Identity row */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                <ImageWithFallback src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
              </div>
              {isOwner && (
                <button
                  className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                  onClick={() => {/* trigger file upload */}}
                  title="Change profile photo"
                >
                  <Camera size={18} className="text-white" />
                </button>
              )}
            </div>

            {/* Info + Actions */}
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                {/* Name + badge */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-[26px] font-extrabold text-gray-900 tracking-tight leading-tight">{profile.fullName}</h1>
                  <UserGroupBadge group={profile.userGroup} />
                  {profile.verificationStatus === 'Verified' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-600">
                      <ShieldCheck size={14} /> Verified
                    </span>
                  )}
                </div>

                {/* Meta line */}
                <div className="flex items-center gap-2 flex-wrap mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[13px] text-gray-500">
                    <MapPin size={13} className="text-gray-400" />{profile.location}
                  </span>
                  <span className="text-gray-200">·</span>
                  <span className="text-[13px] text-gray-500">{profile.careerStage}</span>
                  {isProfessional && profile.yearsOfExperience && (
                    <>
                      <span className="text-gray-200">·</span>
                      <span className="text-[13px] text-gray-500">{profile.yearsOfExperience} yrs experience</span>
                    </>
                  )}
                </div>

                {/* Bio */}
                <p className="text-[14px] text-gray-500 leading-relaxed mt-3 max-w-2xl line-clamp-2">{profile.bio}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 sm:mt-1">
                {isOwner ? (
                  <button
                    onClick={() => openEdit('header')}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-[13px] border border-gray-200 text-gray-700 bg-white hover:border-brand-primary hover:text-brand-primary hover:bg-blue-50/50 transition-all shadow-sm"
                  >
                    <Pencil size={13} /> Edit Profile
                  </button>
                ) : (
                  <>
                    {connectionStatus === 'connected' ? (
                      <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-[13px] bg-green-50 text-green-600 border border-green-100">
                        <Check size={13} /> Connected
                      </span>
                    ) : connectionStatus === 'pending' ? (
                      <span className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-[13px] bg-amber-50 text-amber-600 border border-amber-100">
                        <Clock size={13} /> Pending
                      </span>
                    ) : (
                      <button
                        onClick={() => setShowConnectDialog(true)}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-[13px] bg-brand-primary text-white hover:bg-brand-primary/90 transition-all shadow-sm"
                      >
                        <UserPlus size={13} /> Connect
                      </button>
                    )}
                    <button 
                      onClick={() => onNavigate?.('Messages', { personId })}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-[13px] border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      <MessageSquare size={13} /> Message
                    </button>
                  </>
                )}
                <Tooltip content="Share Profile">
                  <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"><Share2 size={16} /></button>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-0 mt-7 -mb-px overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center ${
                  activeTab === tab.id
                    ? 'text-brand-primary border-brand-primary'
                    : 'text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-200'
                }`}
              >
                {tab.label}
                {tab.badge}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ BODY ═══ */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-8 pb-20">

        {/* Profile completion banner (owner only) */}
        {isOwner && completion.percentage < 100 && (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/60 border border-blue-100 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 border border-blue-100">
              <span className="text-xs font-bold text-brand-primary">{completion.percentage}%</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-gray-800">Profile {completion.percentage}% complete</p>
              <p className="text-[12px] text-gray-500 mt-0.5">{completion.missingSections.slice(0, 3).join(', ')}{completion.missingSections.length > 3 ? ` +${completion.missingSections.length - 3} more` : ''}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10">
          {/* Main Content */}
          <div key={activeTab} className="animate-fade-in">
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          <aside className="lg:border-l lg:border-gray-100 lg:pl-8">
            <div className="lg:sticky lg:top-6 flex flex-col gap-6">

              {/* Quick info */}
              <div className="flex flex-col gap-3.5">
                {[
                  { l: 'Career Stage', v: profile.careerStage },
                  { l: 'Location', v: profile.location },
                  { l: 'Work Mode', v: profile.preferredWorkMode },
                  ...(profile.availabilityHours > 0 ? [{ l: 'Availability', v: `${profile.availabilityHours} hrs/week` }] : []),
                  ...(isProfessional && profile.yearsOfExperience ? [{ l: 'Experience', v: `${profile.yearsOfExperience} years` }] : []),
                ].map(s => (
                  <div key={s.l}>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">{s.l}</span>
                    <span className="text-[13px] font-semibold text-gray-800">{s.v}</span>
                  </div>
                ))}
              </div>

              {profile.specializations.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">Specializations</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.specializations.map((s) => (
                        <span key={s} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">{s}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profile.openTo.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">Open To</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.openTo.map((item) => (
                        <span key={item} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-100">{item}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {profile.languages.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2.5">Languages</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.languages.map((lang) => (
                        <span key={lang} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100">{lang}</span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <>
                
                
              </>
            </div>
          </aside>
        </div>
      </div>

      {/* ─── CONNECT DIALOG ──────────────────────────────── */}
      {showConnectDialog && (
        <Dialog open onOpenChange={(open) => { if (!open) { setShowConnectDialog(false); setConnectMessage(''); } }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect with {profile.fullName}</DialogTitle>
              <DialogDescription>Add a note to your request (optional).</DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <Textarea
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                placeholder={`Hi ${profile.fullName.split(' ')[0]}, I'd like to connect...`}
                rows={3}
                className="resize-none"
              />
            </div>
            <DialogFooter>
              <button
                onClick={() => { setShowConnectDialog(false); setConnectMessage(''); }}
                className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConnectionStatus('pending');
                  setShowConnectDialog(false);
                  setConnectMessage('');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"
              >
                <UserPlus size={14} /> Send Request
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ─── EDIT MODALS ──────────────────────────────────── */}
      <EditModals
        editingSection={editingSection}
        closeEdit={closeEdit}
        saveEdit={saveEdit}
        draft={draft}
        profile={profile}
        updateDraft={updateDraft}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EDIT MODALS
// ═══════════════════════════════════════════════════════════
function EditModals({
  editingSection, closeEdit, saveEdit, draft, profile, updateDraft,
}: {
  editingSection: EditSection;
  closeEdit: () => void;
  saveEdit: () => void;
  draft: Partial<StudentProfile>;
  profile: StudentProfile;
  updateDraft: <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) => void;
}) {
  if (!editingSection) return null;

  const modalContent = (() => {
    switch (editingSection) {
      case 'header':
        return {
          title: 'Edit Profile', desc: 'Update your name, location and bio.',
          body: (
            <div className="flex flex-col gap-4">
              <FG label="Full Name"><Input value={draft.fullName || ''} onChange={(e) => updateDraft('fullName', e.target.value)} /></FG>
              <FG label="Location"><Input value={draft.location || ''} onChange={(e) => updateDraft('location', e.target.value)} /></FG>
              <FG label="Bio"><Textarea value={draft.bio || ''} onChange={(e) => updateDraft('bio', e.target.value)} rows={3} /></FG>
            </div>
          ),
        };
      case 'about':
        return {
          title: 'Edit About', desc: 'Update your bio and career vision.',
          body: (
            <div className="flex flex-col gap-4">
              <FG label="Bio"><Textarea value={draft.bio || ''} onChange={(e) => updateDraft('bio', e.target.value)} rows={3} /></FG>
              <FG label="Career Vision"><Textarea value={draft.careerVision || ''} onChange={(e) => updateDraft('careerVision', e.target.value)} rows={3} /></FG>
            </div>
          ),
        };
      case 'education':
        return {
          title: 'Edit Education', desc: 'Add, edit, or remove education entries.',
          body: (
            <div className="flex flex-col gap-4">
              {(draft.education || []).map((edu, idx) => (
                <div key={edu.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col gap-3 relative">
                  <button onClick={() => { const n = [...(draft.education || [])]; n.splice(idx, 1); updateDraft('education', n); }} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <FG label="Degree"><Input value={edu.degree} onChange={(e) => { const n = [...(draft.education || [])]; n[idx] = { ...n[idx], degree: e.target.value }; updateDraft('education', n); }} /></FG>
                  <FG label="Institution"><Input value={edu.institution} onChange={(e) => { const n = [...(draft.education || [])]; n[idx] = { ...n[idx], institution: e.target.value }; updateDraft('education', n); }} /></FG>
                  <div className="grid grid-cols-2 gap-3">
                    <FG label="Year"><Input value={edu.year} onChange={(e) => { const n = [...(draft.education || [])]; n[idx] = { ...n[idx], year: e.target.value }; updateDraft('education', n); }} /></FG>
                    <FG label="Status">
                      <Select value={edu.status} onValueChange={(val) => { const n = [...(draft.education || [])]; n[idx] = { ...n[idx], status: val as 'Ongoing' | 'Completed' }; updateDraft('education', n); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Ongoing">Ongoing</SelectItem><SelectItem value="Completed">Completed</SelectItem></SelectContent>
                      </Select>
                    </FG>
                  </div>
                </div>
              ))}
              <button onClick={() => { const n = [...(draft.education || [])]; n.push({ id: `edu-${Date.now()}`, degree: '', institution: '', year: '', status: 'Ongoing' }); updateDraft('education', n); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 py-2"><Plus size={14} /> Add Education</button>
            </div>
          ),
        };
      case 'specialization':
        return {
          title: 'Edit Specialization', desc: 'Update your specializations, population of interest, and languages.',
          body: (
            <div className="flex flex-col gap-4">
              <FG label="Specializations" hint="Comma separated"><Input value={(draft.specializations || []).join(', ')} onChange={(e) => updateDraft('specializations', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></FG>
              <FG label="Population of Interest"><Input value={draft.populationOfInterest || ''} onChange={(e) => updateDraft('populationOfInterest', e.target.value)} /></FG>
              <FG label="Languages" hint="Comma separated"><Input value={(draft.languages || []).join(', ')} onChange={(e) => updateDraft('languages', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} /></FG>
            </div>
          ),
        };
      case 'experience':
        return {
          title: 'Edit Experience', desc: 'Add, edit, or remove experience entries.',
          body: (
            <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
              {(draft.experience || []).map((exp, idx) => (
                <div key={exp.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col gap-3 relative">
                  <button onClick={() => { const n = [...(draft.experience || [])]; n.splice(idx, 1); updateDraft('experience', n); }} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <FG label="Title"><Input value={exp.title} onChange={(e) => { const n = [...(draft.experience || [])]; n[idx] = { ...n[idx], title: e.target.value }; updateDraft('experience', n); }} /></FG>
                  <FG label="Organization"><Input value={exp.organization} onChange={(e) => { const n = [...(draft.experience || [])]; n[idx] = { ...n[idx], organization: e.target.value }; updateDraft('experience', n); }} /></FG>
                  <div className="grid grid-cols-2 gap-3">
                    <FG label="Duration"><Input value={exp.duration} onChange={(e) => { const n = [...(draft.experience || [])]; n[idx] = { ...n[idx], duration: e.target.value }; updateDraft('experience', n); }} /></FG>
                    <FG label="Type">
                      <Select value={exp.type} onValueChange={(val) => { const n = [...(draft.experience || [])]; n[idx] = { ...n[idx], type: val as ExperienceEntry['type'] }; updateDraft('experience', n); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Work">Work</SelectItem><SelectItem value="Research">Research</SelectItem><SelectItem value="Volunteering">Volunteering</SelectItem><SelectItem value="CSR">CSR</SelectItem></SelectContent>
                      </Select>
                    </FG>
                  </div>
                  <FG label="Description"><Textarea value={exp.description} onChange={(e) => { const n = [...(draft.experience || [])]; n[idx] = { ...n[idx], description: e.target.value }; updateDraft('experience', n); }} rows={2} /></FG>
                </div>
              ))}
              <button onClick={() => { const n = [...(draft.experience || [])]; n.push({ id: `exp-${Date.now()}`, title: '', organization: '', duration: '', description: '', type: 'Work' }); updateDraft('experience', n); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 py-2"><Plus size={14} /> Add Experience</button>
            </div>
          ),
        };
      case 'supervision':
        return {
          title: 'Edit Supervision', desc: 'Update your supervision details.',
          body: (
            <div className="flex flex-col gap-4">
              <FG label="Hours Completed"><Input type="number" value={draft.supervision?.hoursCompleted ?? 0} onChange={(e) => updateDraft('supervision', { ...(draft.supervision || profile.supervision), hoursCompleted: parseInt(e.target.value) || 0 })} /></FG>
              <FG label="Supervisor Name"><Input value={draft.supervision?.supervisorName || ''} onChange={(e) => updateDraft('supervision', { ...(draft.supervision || profile.supervision), supervisorName: e.target.value })} /></FG>
              <FG label="Feedback / Notes"><Textarea value={draft.supervision?.feedbackNotes || ''} onChange={(e) => updateDraft('supervision', { ...(draft.supervision || profile.supervision), feedbackNotes: e.target.value })} rows={3} /></FG>
            </div>
          ),
        };
      case 'recognition':
        return {
          title: 'Edit Recognition', desc: 'Add, edit, or remove certifications, awards, and achievements.',
          body: (
            <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
              {(draft.recognition || []).map((rec, idx) => (
                <div key={rec.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col gap-3 relative">
                  <button onClick={() => { const n = [...(draft.recognition || [])]; n.splice(idx, 1); updateDraft('recognition', n); }} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <FG label="Title"><Input value={rec.title} onChange={(e) => { const n = [...(draft.recognition || [])]; n[idx] = { ...n[idx], title: e.target.value }; updateDraft('recognition', n); }} /></FG>
                  <div className="grid grid-cols-2 gap-3">
                    <FG label="Issuer"><Input value={rec.issuer} onChange={(e) => { const n = [...(draft.recognition || [])]; n[idx] = { ...n[idx], issuer: e.target.value }; updateDraft('recognition', n); }} /></FG>
                    <FG label="Year"><Input value={rec.year} onChange={(e) => { const n = [...(draft.recognition || [])]; n[idx] = { ...n[idx], year: e.target.value }; updateDraft('recognition', n); }} /></FG>
                  </div>
                  <FG label="Type">
                    <Select value={rec.type} onValueChange={(val) => { const n = [...(draft.recognition || [])]; n[idx] = { ...n[idx], type: val as RecognitionEntry['type'] }; updateDraft('recognition', n); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Certification">Certification</SelectItem><SelectItem value="Achievement">Achievement</SelectItem><SelectItem value="Award">Award</SelectItem></SelectContent>
                    </Select>
                  </FG>
                </div>
              ))}
              <button onClick={() => { const n = [...(draft.recognition || [])]; n.push({ id: `rec-${Date.now()}`, title: '', issuer: '', year: '', type: 'Achievement' }); updateDraft('recognition', n); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 py-2"><Plus size={14} /> Add Recognition</button>
            </div>
          ),
        };
      case 'openTo':
        return {
          title: 'Edit Open To', desc: 'Select what opportunities you\'re open to.',
          body: (
            <div className="grid grid-cols-1 gap-2">
              {getOpenToOptions(profile.userGroup).map((option) => {
                const sel = (draft.openTo || []).includes(option);
                return (
                  <label key={option} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border cursor-pointer transition-colors ${sel ? 'bg-teal-50/60 border-teal-200' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <Checkbox checked={sel} onCheckedChange={(checked) => { const prev = draft.openTo || []; updateDraft('openTo', checked ? [...prev, option] : prev.filter(o => o !== option)); }} />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                );
              })}
            </div>
          ),
        };
      case 'availability':
        return {
          title: 'Edit Availability', desc: 'Update your availability and work preferences.',
          body: (
            <div className="flex flex-col gap-5">
              <FG label="Hours Per Week"><Input type="number" value={draft.availabilityHours ?? 0} onChange={(e) => updateDraft('availabilityHours', parseInt(e.target.value) || 0)} /></FG>
              <FG label="Preferred Work Mode">
                <Select value={draft.preferredWorkMode || 'Remote'} onValueChange={(val) => updateDraft('preferredWorkMode', val as WorkMode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Remote">Remote</SelectItem><SelectItem value="Hybrid">Hybrid</SelectItem><SelectItem value="On-site">On-site</SelectItem></SelectContent>
                </Select>
              </FG>
              <div className="flex items-center justify-between py-1">
                <Label className="text-sm text-gray-700">Open to Relocation</Label>
                <Switch checked={draft.relocationReady ?? false} onCheckedChange={(checked) => updateDraft('relocationReady', checked)} />
              </div>
            </div>
          ),
        };
      case 'publications':
        return {
          title: 'Edit Publications', desc: 'Add, edit, or remove publication entries.',
          body: (
            <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
              {(draft.publications || []).map((pub, idx) => (
                <div key={pub.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col gap-3 relative">
                  <button onClick={() => { const n = [...(draft.publications || [])]; n.splice(idx, 1); updateDraft('publications', n); }} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <FG label="Title"><Input value={pub.title} onChange={(e) => { const n = [...(draft.publications || [])]; n[idx] = { ...n[idx], title: e.target.value }; updateDraft('publications', n); }} /></FG>
                  <FG label="Journal"><Input value={pub.journal} onChange={(e) => { const n = [...(draft.publications || [])]; n[idx] = { ...n[idx], journal: e.target.value }; updateDraft('publications', n); }} /></FG>
                  <div className="grid grid-cols-2 gap-3">
                    <FG label="Year"><Input value={pub.year} onChange={(e) => { const n = [...(draft.publications || [])]; n[idx] = { ...n[idx], year: e.target.value }; updateDraft('publications', n); }} /></FG>
                    <FG label="Co-Authors"><Input value={pub.coAuthors || ''} onChange={(e) => { const n = [...(draft.publications || [])]; n[idx] = { ...n[idx], coAuthors: e.target.value }; updateDraft('publications', n); }} /></FG>
                  </div>
                </div>
              ))}
              <button onClick={() => { const n = [...(draft.publications || [])]; n.push({ id: `pub-${Date.now()}`, title: '', journal: '', year: '' }); updateDraft('publications', n); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 py-2"><Plus size={14} /> Add Publication</button>
            </div>
          ),
        };
      case 'talks':
        return {
          title: 'Edit Talks & Workshops', desc: 'Add, edit, or remove talk entries.',
          body: (
            <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
              {(draft.talks || []).map((talk, idx) => (
                <div key={talk.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50/50 flex flex-col gap-3 relative">
                  <button onClick={() => { const n = [...(draft.talks || [])]; n.splice(idx, 1); updateDraft('talks', n); }} className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  <FG label="Title"><Input value={talk.title} onChange={(e) => { const n = [...(draft.talks || [])]; n[idx] = { ...n[idx], title: e.target.value }; updateDraft('talks', n); }} /></FG>
                  <FG label="Event"><Input value={talk.event} onChange={(e) => { const n = [...(draft.talks || [])]; n[idx] = { ...n[idx], event: e.target.value }; updateDraft('talks', n); }} /></FG>
                  <div className="grid grid-cols-2 gap-3">
                    <FG label="Year"><Input value={talk.year} onChange={(e) => { const n = [...(draft.talks || [])]; n[idx] = { ...n[idx], year: e.target.value }; updateDraft('talks', n); }} /></FG>
                    <FG label="Type">
                      <Select value={talk.type} onValueChange={(val) => { const n = [...(draft.talks || [])]; n[idx] = { ...n[idx], type: val as TalkEntry['type'] }; updateDraft('talks', n); }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Talk">Talk</SelectItem><SelectItem value="Workshop">Workshop</SelectItem><SelectItem value="Keynote">Keynote</SelectItem><SelectItem value="Panel">Panel</SelectItem></SelectContent>
                      </Select>
                    </FG>
                  </div>
                </div>
              ))}
              <button onClick={() => { const n = [...(draft.talks || [])]; n.push({ id: `talk-${Date.now()}`, title: '', event: '', year: '', description: '', type: 'Talk' }); updateDraft('talks', n); }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-primary hover:text-brand-primary/80 py-2"><Plus size={14} /> Add Talk</button>
            </div>
          ),
        };
      case 'supervisionGiven':
        return {
          title: 'Edit Supervision (Given)', desc: 'Update your supervision details.',
          body: (
            <div className="flex flex-col gap-4">
              <FG label="Total Hours Given"><Input type="number" value={draft.supervisionGiven?.totalHoursGiven ?? 0} onChange={(e) => updateDraft('supervisionGiven', { ...(draft.supervisionGiven || profile.supervisionGiven!), totalHoursGiven: parseInt(e.target.value) || 0 })} /></FG>
              <FG label="Active Supervisees"><Input type="number" value={draft.supervisionGiven?.activeSupervisees ?? 0} onChange={(e) => updateDraft('supervisionGiven', { ...(draft.supervisionGiven || profile.supervisionGiven!), activeSupervisees: parseInt(e.target.value) || 0 })} /></FG>
              <FG label="Certificates Issued"><Input type="number" value={draft.supervisionGiven?.certificatesIssued ?? 0} onChange={(e) => updateDraft('supervisionGiven', { ...(draft.supervisionGiven || profile.supervisionGiven!), certificatesIssued: parseInt(e.target.value) || 0 })} /></FG>
            </div>
          ),
        };
      case 'mentoring':
        return {
          title: 'Edit Mentoring', desc: 'Update your mentoring details.',
          body: (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between py-1">
                <Label className="text-sm text-gray-700">Registered Mentor</Label>
                <Switch checked={draft.mentoring?.isRegisteredMentor ?? false} onCheckedChange={(checked) => updateDraft('mentoring', { ...(draft.mentoring || profile.mentoring!), isRegisteredMentor: checked })} />
              </div>
              <FG label="Active Mentees"><Input type="number" value={draft.mentoring?.activeMentees ?? 0} onChange={(e) => updateDraft('mentoring', { ...(draft.mentoring || profile.mentoring!), activeMentees: parseInt(e.target.value) || 0 })} /></FG>
              <FG label="Total Mentored"><Input type="number" value={draft.mentoring?.totalMentored ?? 0} onChange={(e) => updateDraft('mentoring', { ...(draft.mentoring || profile.mentoring!), totalMentored: parseInt(e.target.value) || 0 })} /></FG>
            </div>
          ),
        };
      default: return null;
    }
  })();

  if (!modalContent) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && closeEdit()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{modalContent.title}</DialogTitle>
          <DialogDescription>{modalContent.desc}</DialogDescription>
        </DialogHeader>
        <div className="py-1">{modalContent.body}</div>
        <DialogFooter>
          <button onClick={closeEdit} className="px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={saveEdit} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors shadow-sm"><Save size={14} /> Save Changes</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FG({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <Label className="text-sm text-gray-700">{label}</Label>
        {hint && <span className="text-[11px] text-gray-400">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
