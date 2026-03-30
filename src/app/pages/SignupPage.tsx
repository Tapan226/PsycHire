import React, { useState } from 'react';
import { ArrowRight, User, Mail, Lock, Phone, CheckCircle2, ShieldCheck, Eye, EyeOff, ChevronDown, Briefcase, Users, BookOpen, GraduationCap } from 'lucide-react';

interface SignupPageProps {
  onSignupComplete: (userData: { name: string; email: string }) => void;
  onLogin: () => void;
}

const COUNTRY_CODES = [
  { code: '+91', label: 'IN', flag: '🇮🇳' },
  { code: '+1', label: 'US', flag: '🇺🇸' },
  { code: '+44', label: 'UK', flag: '🇬🇧' },
  { code: '+61', label: 'AU', flag: '🇦🇺' },
  { code: '+971', label: 'AE', flag: '🇦🇪' },
  { code: '+65', label: 'SG', flag: '🇸🇬' },
  { code: '+49', label: 'DE', flag: '🇩🇪' },
  { code: '+33', label: 'FR', flag: '🇫🇷' },
  { code: '+81', label: 'JP', flag: '🇯🇵' },
  { code: '+86', label: 'CN', flag: '🇨🇳' },
];

function getPasswordStrength(pw: string): { level: number; label: string; color: string } {
  if (pw.length === 0) return { level: 0, label: '', color: 'bg-gray-200' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-amber-500' };
  if (score <= 3) return { level: 3, label: 'Good', color: 'bg-blue-500' };
  return { level: 4, label: 'Strong', color: 'bg-green-500' };
}

const PLATFORM_BENEFITS = [
  { icon: Briefcase, title: 'Career Opportunities', desc: 'Browse jobs, projects, and referrals tailored for psychology professionals' },
  { icon: Users, title: 'Professional Network', desc: 'Connect with supervisors, mentors, and peers across India' },
  { icon: BookOpen, title: 'Learning & Growth', desc: 'Access courses, events, supervision, and mentoring programs' },
  { icon: GraduationCap, title: 'Profile & Credentials', desc: 'Build a verified professional profile with certifications and reviews' },
];

export function SignupPage({ onSignupComplete, onLogin }: SignupPageProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);

  const [formData, setFormData] = useState({
    name: 'Riya Sharma',
    email: 'riya.sharma@university.edu',
    phone: '98765 43210',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    terms: true,
    ethics: true,
  });

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (step === 'details') {
        setStep('otp');
      } else {
        onSignupComplete({ name: formData.name, email: formData.email });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex bg-[#f0f4f8] font-['Inter']">

      {/* ═══ LEFT — BRANDING PANEL ═══ */}
      <div className="hidden lg:flex w-[480px] shrink-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-bold text-xl backdrop-blur-sm border border-white/10">P</div>
            <span className="text-white font-bold text-xl tracking-tight">PsycHIRE</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white leading-tight tracking-tight mb-4">
            India's Professional Network for Psychology
          </h2>
          <p className="text-blue-200/80 text-[15px] leading-relaxed mb-10">
            Connect with opportunities, mentors, and a community dedicated to advancing mental health careers.
          </p>

          <div className="flex flex-col gap-5">
            {PLATFORM_BENEFITS.map(b => (
              <div key={b.title} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-white/[0.08] flex items-center justify-center shrink-0 border border-white/[0.06]">
                  <b.icon size={17} className="text-blue-200" />
                </div>
                <div>
                  <p className="text-white font-semibold text-[14px]">{b.title}</p>
                  <p className="text-blue-300/60 text-[13px] leading-relaxed mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-blue-300/40 text-[12px] font-medium">
          Trusted by 1,200+ psychology professionals across India
        </p>
      </div>

      {/* ═══ RIGHT — FORM PANEL ═══ */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[440px]">

          {/* Mobile branding */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-2xl mb-3">P</div>
            <h1 className="text-xl font-bold text-brand-primary">PsycHIRE</h1>
            <p className="text-gray-500 text-sm mt-1">India's Professional Network for Psychology</p>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">

            {/* Progress */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
              <div className="h-full bg-brand-primary transition-all duration-500" style={{ width: step === 'details' ? '50%' : '100%' }} />
            </div>

            <div className="flex flex-col mb-7 mt-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {step === 'details' ? 'Create Account' : 'Verify Identity'}
              </h1>
              <p className="text-gray-500 text-sm mt-1.5">
                {step === 'details' ? 'Join the community of psychology professionals' : `We sent a code to ${countryCode} ${formData.phone.slice(0, 3)}** **${formData.phone.slice(-3)}`}
              </p>
            </div>

            <form onSubmit={handleContinue} className="flex flex-col gap-5">

              {step === 'details' && (
                <div className="flex flex-col gap-4 animate-fade-in">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Phone with Country Code */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                    <div className="flex gap-2">
                      {/* Country Code Selector */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowCodeDropdown(!showCodeDropdown)}
                          className="flex items-center gap-1.5 px-3 py-3 rounded-lg border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors min-w-[90px]"
                        >
                          <span>{COUNTRY_CODES.find(c => c.code === countryCode)?.flag}</span>
                          <span>{countryCode}</span>
                          <ChevronDown size={14} className="text-gray-400" />
                        </button>
                        {showCodeDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-[160px] bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-[200px] overflow-y-auto">
                            {COUNTRY_CODES.map(cc => (
                              <button
                                key={cc.code}
                                type="button"
                                onClick={() => { setCountryCode(cc.code); setShowCodeDropdown(false); }}
                                className={`w-full text-left px-3 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 ${countryCode === cc.code ? 'bg-blue-50 text-brand-primary font-semibold' : 'text-gray-700'}`}
                              >
                                <span>{cc.flag}</span>
                                <span>{cc.code}</span>
                                <span className="text-gray-400 text-xs ml-auto">{cc.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {/* Phone Input */}
                      <div className="relative flex-1">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          placeholder="98765 43210"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 bg-gray-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 bg-gray-50/50"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {/* Strength Meter */}
                    {formData.password.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 flex gap-1">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <span className={`text-[11px] font-semibold ${passwordStrength.level <= 1 ? 'text-red-500' : passwordStrength.level <= 2 ? 'text-amber-500' : passwordStrength.level <= 3 ? 'text-blue-500' : 'text-green-500'}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Confirm Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full pl-10 pr-10 py-3 rounded-lg border outline-none transition-all text-gray-800 bg-gray-50/50 ${
                          formData.confirmPassword.length > 0 && !passwordsMatch
                            ? 'border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                            : 'border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {formData.confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-[11px] text-red-500 font-medium mt-1">Passwords do not match</p>
                    )}
                    {formData.confirmPassword.length > 0 && passwordsMatch && (
                      <p className="text-[11px] text-green-600 font-medium mt-1 flex items-center gap-1"><CheckCircle2 size={11} /> Passwords match</p>
                    )}
                  </div>

                  {/* Checkboxes */}
                  <div className="pt-1 flex flex-col gap-3">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.terms ? 'bg-brand-primary border-brand-primary' : 'border-gray-300 bg-white'}`}
                        onClick={() => setFormData({...formData, terms: !formData.terms})}
                      >
                        {formData.terms && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-600 leading-snug group-hover:text-gray-900 transition-colors">
                        I agree to the <span className="text-brand-primary font-semibold underline">Terms of Service</span> & <span className="text-brand-primary font-semibold underline">Privacy Policy</span>.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.ethics ? 'bg-brand-primary border-brand-primary' : 'border-gray-300 bg-white'}`}
                        onClick={() => setFormData({...formData, ethics: !formData.ethics})}
                      >
                        {formData.ethics && <ShieldCheck size={14} className="text-white" />}
                      </div>
                      <span className="text-sm text-gray-600 leading-snug group-hover:text-gray-900 transition-colors">
                        I pledge to adhere to the <span className="text-brand-primary font-semibold underline">Professional Code of Ethics</span>.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 'otp' && (
                <div className="flex flex-col gap-6 animate-fade-in py-4">
                  <div className="flex justify-between gap-2">
                    {[4, 8, 1, 2].map((digit, i) => (
                      <div key={i} className="flex-1 aspect-square max-w-[60px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-xl font-bold text-brand-primary shadow-inner">
                        {digit}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg text-sm font-medium">
                    <CheckCircle2 size={16} />
                    <span>Verified automatically</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-1 w-full bg-brand-secondary text-white py-3.5 rounded-lg font-bold hover:bg-brand-secondary-hover transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-80 disabled:cursor-wait"
              >
                {isLoading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{step === 'details' ? 'Verify & Continue' : 'Complete Sign Up'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <button onClick={onLogin} className="text-brand-primary font-bold hover:underline">
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
