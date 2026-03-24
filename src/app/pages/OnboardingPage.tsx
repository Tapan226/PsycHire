import React, { useState } from 'react';
import {
  ArrowRight,
  Check,
  GraduationCap,
  Briefcase,
  MapPin,
  FileText,
  Globe,
  User,
  Plus,
  X,
  Clock,
  BookOpen,
  Wallet,
  ChevronLeft,
} from 'lucide-react';
import { Chip } from '@/app/components/Chip';

interface OnboardingPageProps {
  onComplete: () => void;
}

// Steps:
// 1. Career Stage
// 2. Education
// 3. Career Info
// 4. Interests
// 5. Availability
// 6. Strengtheners
// 7. Completion

export function OnboardingPage({ onComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 7;

  // --- Mock Data States ---

  // Step 1: Career Stage
  const [careerStage, setCareerStage] = useState('post-grad');
  const stages = [
    { id: 'undergrad', label: 'Undergraduate', desc: 'B.A. / B.Sc Psychology student' },
    { id: 'graduation', label: 'Recent Graduate', desc: 'Completed Bachelor\'s degree' },
    { id: 'post-grad', label: 'Post-graduation', desc: 'M.A. / M.Sc student' },
    { id: 'mphil', label: 'M.Phil Student', desc: 'Pursuing clinical licensure' },
    { id: 'doctorate', label: 'Doctorate', desc: 'PhD candidate' },
  ];

  // Step 2: Education
  const [education, setEducation] = useState({
    degree: 'M.A. Clinical Psychology',
    institution: 'Tata Institute of Social Sciences',
    startYear: '2023',
    endYear: '2025'
  });

  // Step 3: Career Info
  const [specializations] = useState(['Clinical Psychology', 'Neuropsychology']);
  const [populations] = useState(['Adults', 'Adolescents']);
  const [languages] = useState(['English', 'Hindi', 'Marathi']);

  // Step 4: Interests
  const [interests, setInterests] = useState(['Clinical Research', 'Therapy', 'Workshops', 'Child Development']);
  const interestOptions = [
    "Clinical Research", "Therapy", "Workshops", "Child Development",
    "I/O Psychology", "Counseling", "Forensic Psychology", "School Psychology"
  ];

  // Step 5: Availability
  const [availability, setAvailability] = useState({
    status: 'Immediate',
    location: 'Mumbai, MH',
    relocate: 'Yes, willing to relocate',
    type: 'Full-time'
  });

  // Step 6: Profile Strengtheners (Mock status)
  const [strengtheners] = useState({
    cv: true,
    experience: true,
    supervision: false,
    portfolio: false,
    cost: false
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  const STEP_TITLES: Record<number, string> = {
    1: 'What is your current career stage?',
    2: 'Education Details',
    3: 'Professional Background',
    4: 'What are you interested in?',
    5: 'Availability & Location',
    6: 'Strengthen Your Profile',
    7: 'Setup Complete!',
  };

  const STEP_SUBTITLES: Record<number, string> = {
    1: 'This helps us tailor opportunities to your level.',
    2: 'Tell us about your academic background.',
    3: 'Share your areas of expertise and languages.',
    4: 'Select topics you want to see in your feed and recommendations.',
    5: 'Let employers know when and where you\'re available.',
    6: 'Adding these details boosts your visibility to recruiters by 40%.',
    7: '',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f4f8] p-4 font-['Inter']">

      {/* Top Bar Progress */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-brand-primary transition-all duration-500 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="w-full max-w-2xl pt-8">

        {/* Brand mark + step dots — above card */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white font-bold text-[14px]">P</div>
            <span className="text-[13px] font-bold text-gray-400 tracking-tight">PsycHIRE</span>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <div
                key={s}
                className={`rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-6 h-2 bg-brand-primary'
                    : s < step
                    ? 'w-2 h-2 bg-brand-primary/40'
                    : 'w-2 h-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 min-h-[520px] flex flex-col relative overflow-hidden animate-fade-in">

          {/* Header */}
          {step < 7 && (
            <div className="mb-8">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Step {step} of {totalSteps}
              </p>
              <p className="text-[22px] font-extrabold text-gray-900 tracking-tight leading-tight">
                {STEP_TITLES[step]}
              </p>
              {STEP_SUBTITLES[step] && (
                <p className="text-[14px] text-gray-500 font-medium mt-2 leading-relaxed">
                  {STEP_SUBTITLES[step]}
                </p>
              )}
            </div>
          )}

          <div className="flex-1">
            {/* Step 1: Career Stage */}
            {step === 1 && (
              <div className="grid grid-cols-1 gap-3 animate-fade-in">
                {stages.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setCareerStage(s.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      careerStage === s.id
                        ? 'border-blue-600 bg-blue-50/60'
                        : 'border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50/40'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      careerStage === s.id ? 'border-blue-600' : 'border-gray-300'
                    }`}>
                      {careerStage === s.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />}
                    </div>
                    <div>
                      <p className={`text-[14px] font-bold ${careerStage === s.id ? 'text-blue-800' : 'text-gray-900'}`}>{s.label}</p>
                      <p className="text-[12px] text-gray-500 font-medium mt-0.5">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Highest Degree</label>
                  <div className="relative">
                    <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => setEducation({...education, degree: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 outline-none transition-all text-[14px] text-gray-800"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Institution / University</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => setEducation({...education, institution: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 outline-none transition-all text-[14px] text-gray-800"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">Start Year</label>
                    <input
                      type="text"
                      value={education.startYear}
                      onChange={(e) => setEducation({...education, startYear: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 outline-none transition-all text-[14px] text-gray-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-gray-700">End Year (or Expected)</label>
                    <input
                      type="text"
                      value={education.endYear}
                      onChange={(e) => setEducation({...education, endYear: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 outline-none transition-all text-[14px] text-gray-800"
                    />
                  </div>
                </div>
                <button className="flex items-center gap-2 text-[13px] font-semibold text-brand-primary opacity-50 cursor-not-allowed">
                  <Plus size={14} />
                  Add another education
                </button>
              </div>
            )}

            {/* Step 3: Career Info */}
            {step === 3 && (
              <div className="flex flex-col gap-6 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-700">Specializations (Max 3)</label>
                  <div className="flex flex-wrap gap-2 p-3.5 border border-gray-200 rounded-lg min-h-[50px] bg-gray-50/30">
                    {specializations.map(tag => (
                      <Chip key={tag} label={tag} variant="blue" className="flex items-center gap-1">
                        <X size={12} className="cursor-pointer hover:text-white" />
                      </Chip>
                    ))}
                    <input type="text" placeholder="Add more..." className="bg-transparent text-[13px] outline-none flex-1 min-w-[80px]" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-700">Population Worked With</label>
                  <div className="flex flex-wrap gap-2 p-3.5 border border-gray-200 rounded-lg min-h-[50px] bg-gray-50/30">
                    {populations.map(tag => (
                      <Chip key={tag} label={tag} variant="slate" className="flex items-center gap-1">
                         <X size={12} className="cursor-pointer hover:text-gray-900" />
                      </Chip>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-gray-700">Languages</label>
                  <div className="flex flex-wrap gap-2 p-3.5 border border-gray-200 rounded-lg min-h-[50px] bg-gray-50/30">
                    {languages.map(tag => (
                      <Chip key={tag} label={tag} variant="slate" className="flex items-center gap-1">
                        <X size={12} className="cursor-pointer hover:text-gray-900" />
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Interests */}
            {step === 4 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="flex flex-wrap gap-3">
                  {interestOptions.map((item) => {
                    const isSelected = interests.includes(item);
                    return (
                      <button
                        key={item}
                        onClick={() => {
                          if (isSelected) setInterests(interests.filter(i => i !== item));
                          else setInterests([...interests, item]);
                        }}
                        className={`px-4 py-2.5 rounded-full text-[13px] font-semibold border transition-all ${
                          isSelected
                            ? 'bg-blue-700 text-white border-blue-700 shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: Availability */}
            {step === 5 && (
              <div className="flex flex-col gap-5 animate-fade-in">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Availability Status</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={availability.status}
                      onChange={(e) => setAvailability({...availability, status: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 appearance-none outline-none transition-all text-[14px] text-gray-800"
                    >
                      <option>Immediate</option>
                      <option>15 Days Notice</option>
                      <option>1 Month Notice</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Preferred Location</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={availability.location}
                      onChange={(e) => setAvailability({...availability, location: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 outline-none transition-all text-[14px] text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-gray-700">Willing to Relocate?</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select
                      value={availability.relocate}
                      onChange={(e) => setAvailability({...availability, relocate: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 bg-gray-50/50 appearance-none outline-none transition-all text-[14px] text-gray-800"
                    >
                      <option>Yes, willing to relocate</option>
                      <option>No, local only</option>
                      <option>Remote only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Strengtheners */}
            {step === 6 && (
              <div className="flex flex-col gap-3.5 animate-fade-in">
                {/* CV Upload Mock */}
                <div className="p-4 border border-green-200 rounded-xl flex items-center justify-between bg-green-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">Resume / CV</p>
                      <p className="text-[12px] text-green-600 font-medium mt-0.5">Uploaded: jane_cv_2026.pdf</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Change</button>
                </div>

                {/* Experience Mock */}
                <div className="p-4 border border-green-200 rounded-xl flex items-center justify-between bg-green-50/50">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <Briefcase size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">Work Experience</p>
                      <p className="text-[12px] text-green-600 font-medium mt-0.5">Added: 2 Internships</p>
                    </div>
                  </div>
                  <button className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Edit</button>
                </div>

                {/* Supervision Mock */}
                <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-white hover:border-blue-200 cursor-pointer group transition-all">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">Supervision Hours</p>
                      <p className="text-[12px] text-gray-400 font-medium mt-0.5">Not added yet</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    <Plus size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>

                {/* Portfolio Mock */}
                <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-white hover:border-blue-200 cursor-pointer group transition-all">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <BookOpen size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">Portfolio</p>
                      <p className="text-[12px] text-gray-400 font-medium mt-0.5">Publications, Workshops</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    <Plus size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>

                {/* Cost / Hour Mock */}
                <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between bg-white hover:border-blue-200 cursor-pointer group transition-all">
                   <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <Wallet size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-gray-900">Hourly Rate</p>
                      <p className="text-[12px] text-gray-400 font-medium mt-0.5">Set your consulting fee</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-200 transition-colors">
                    <Plus size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Completion */}
            {step === 7 && (
              <div className="flex flex-col items-center justify-center h-full gap-7 animate-fade-in text-center py-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-teal-50 border-2 border-teal-200 flex items-center justify-center text-teal-600 animate-bounce-small">
                    <Check size={40} strokeWidth={3} />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-md">
                    85% Strong
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[24px] font-extrabold text-gray-900 tracking-tight">You're all set!</p>
                  <p className="text-[14px] text-gray-500 font-medium max-w-md mx-auto leading-relaxed">
                    Your profile is live. Start applying to jobs, tracking projects, and connecting with mentors.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-xs text-left">
                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">Role</p>
                      <p className="text-[14px] font-bold text-gray-900">Student</p>
                   </div>
                   <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1.5">Location</p>
                      <p className="text-[14px] font-bold text-gray-900">Mumbai</p>
                   </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Controls */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
             {step > 1 && step < 7 ? (
               <button
                 onClick={handleBack}
                 className="text-[13px] font-semibold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
               >
                 <ChevronLeft size={15} />
                 Back
               </button>
             ) : (
               <div />
             )}

             <button
               onClick={handleNext}
               className="bg-brand-secondary text-white px-7 py-3 rounded-lg font-bold text-[14px] hover:bg-brand-secondary-hover transition-colors shadow-sm flex items-center gap-2 group"
             >
               {step === 7 ? 'Go to Dashboard' : 'Continue'}
               <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
             </button>
          </div>

        </div>

        {step === 6 && (
           <div className="mt-4 text-center animate-fade-in">
             <button onClick={handleNext} className="text-[13px] font-semibold text-gray-500 hover:text-gray-700 transition-colors">Skip for now</button>
           </div>
        )}
      </div>
    </div>
  );
}
