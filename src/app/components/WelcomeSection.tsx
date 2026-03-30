import { ArrowRight, Check } from "lucide-react";

interface WelcomeSectionProps {
  userName?: string;
  showCompletionWidget?: boolean;
  onNavigate?: (page: string) => void;
}

export function WelcomeSection({ userName = "Jane", showCompletionWidget = false, onNavigate }: WelcomeSectionProps) {
  // Circular Progress Calculations
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const percentage = 85;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {userName}</h2>
        <p className="text-gray-500">Here's what's happening with your applications today.</p>
      </div>
      
      {/* Profile Completion Widget - Compact Version */}
      {showCompletionWidget && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-6 shadow-sm animate-fade-in">
             <div className="flex items-center gap-4">
                {/* Circular Progress */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                     {/* Track */}
                     <circle 
                       cx="24" 
                       cy="24" 
                       r={radius} 
                       stroke="#ececf0" 
                       strokeWidth="4" 
                       fill="none" 
                     />
                     {/* Progress */}
                     <circle 
                       cx="24" 
                       cy="24" 
                       r={radius} 
                       className="stroke-brand-secondary" 
                       strokeWidth="4" 
                       fill="none" 
                       strokeDasharray={circumference} 
                       strokeDashoffset={strokeDashoffset} 
                       strokeLinecap="round" 
                       className="transition-all duration-1000 ease-out"
                     />
                  </svg>
                  <span className="absolute text-xs font-bold text-gray-900">{percentage}%</span>
                </div>
                
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Complete your profile</span>
                    <span className="text-xs text-gray-500">Get better recommendations</span>
                </div>
             </div>
             
             <button className="bg-brand-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-primary/90 transition-colors shadow-sm text-xs whitespace-nowrap">
               Finish Setup
             </button>
          </div>
      )}
    </div>
  );
}
