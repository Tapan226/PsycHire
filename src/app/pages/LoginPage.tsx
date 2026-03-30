import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Briefcase, Users, BookOpen, GraduationCap } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

const PLATFORM_BENEFITS = [
  { icon: Briefcase, title: 'Career Opportunities', desc: 'Browse jobs, projects, and referrals tailored for psychology professionals' },
  { icon: Users, title: 'Professional Network', desc: 'Connect with supervisors, mentors, and peers across India' },
  { icon: BookOpen, title: 'Learning & Growth', desc: 'Access courses, events, supervision, and mentoring programs' },
  { icon: GraduationCap, title: 'Profile & Credentials', desc: 'Build a verified professional profile with certifications and reviews' },
];

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [email, setEmail] = useState("jane.doe@university.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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

          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 animate-fade-in">
            <div className="flex flex-col mb-7">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1.5">Please sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 bg-gray-50/50"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Password</label>
                  <button type="button" className="text-xs font-semibold text-brand-primary hover:underline">Forgot Password?</button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 pr-10 bg-gray-50/50"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full bg-brand-secondary text-white py-3.5 rounded-lg font-bold hover:bg-brand-secondary-hover transition-colors shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Sign In</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500">
                New to PsycHIRE?{' '}
                <button onClick={onSignup} className="text-brand-primary font-bold hover:underline">
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
