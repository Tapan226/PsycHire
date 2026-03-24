import React, { useState } from 'react';
import { ArrowRight, User, Mail, Lock, Phone, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SignupPageProps {
  onSignupComplete: (userData: { name: string; email: string }) => void;
  onLogin: () => void;
}

export function SignupPage({ onSignupComplete, onLogin }: SignupPageProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);

  // Prefilled Data with a different persona than the default login
  const [formData, setFormData] = useState({
    name: 'Riya Sharma',
    email: 'riya.sharma@university.edu',
    phone: '+91 98765 43210',
    password: 'password123',
    terms: true,
    ethics: true
  });

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      if (step === 'details') {
        setStep('otp');
      } else {
        // Pass the collected data back to App
        onSignupComplete({
          name: formData.name,
          email: formData.email
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4 font-['Inter']">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-gray-100 animate-fade-in relative overflow-hidden">
        
        {/* Progress Indicator for Step 1 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
          <div 
            className="h-full bg-brand-primary transition-all duration-500"
            style={{ width: step === 'details' ? '50%' : '100%' }}
          />
        </div>

        <div className="flex flex-col items-center mb-8 mt-2">
          <div className="w-12 h-12 rounded-xl bg-brand-primary flex items-center justify-center text-white font-bold text-2xl mb-4">P</div>
          <h1 className="text-2xl font-bold text-brand-primary">
            {step === 'details' ? 'Create Account' : 'Verify Identity'}
          </h1>
          <p className="text-gray-500 text-sm mt-2 text-center">
            {step === 'details' ? 'Join the community of psychology professionals' : 'We sent a code to +91 98*** **210'}
          </p>
        </div>

        <form onSubmit={handleContinue} className="flex flex-col gap-5">
          
          {step === 'details' && (
            <div className="flex flex-col gap-4 animate-fade-in">
              <div className="space-y-4">
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

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all text-gray-800 bg-gray-50/50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-3">
                 <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.terms ? 'bg-brand-primary border-brand-primary' : 'border-gray-300 bg-white'}`}>
                      {formData.terms && <CheckCircle2 size={14} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-600 leading-snug group-hover:text-gray-900 transition-colors">
                      I agree to the <span className="text-brand-primary font-semibold underline">Terms of Service</span> & <span className="text-brand-primary font-semibold underline">Privacy Policy</span>.
                    </span>
                 </label>

                 <label className="flex items-start gap-3 cursor-pointer group">
                    <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.ethics ? 'bg-brand-primary border-brand-primary' : 'border-gray-300 bg-white'}`}>
                      {formData.ethics && <ShieldCheck size={14} className="text-white" />}
                    </div>
                    <span className="text-sm text-gray-600 leading-snug group-hover:text-gray-900 transition-colors">
                      I pledge to adhere to the <span className="text-brand-primary font-semibold underline">RCI Code of Conduct</span>.
                    </span>
                 </label>
              </div>
            </div>
          )}

          {step === 'otp' && (
             <div className="flex flex-col gap-6 animate-fade-in py-4">
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4].map((digit) => (
                    <div key={digit} className="flex-1 aspect-square max-w-[60px] bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-xl font-bold text-brand-primary shadow-inner">
                      {digit === 1 ? '4' : digit === 2 ? '8' : digit === 3 ? '1' : '2'}
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
            className="mt-2 w-full bg-brand-secondary text-white py-3.5 rounded-lg font-bold hover:bg-brand-secondary-hover transition-all shadow-md flex items-center justify-center gap-2 group disabled:opacity-80 disabled:cursor-wait"
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

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={onLogin} 
              className="text-brand-primary font-bold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
