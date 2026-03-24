import { Briefcase, Users, GraduationCap, Calendar, ArrowRight } from 'lucide-react';

const CornerPattern = () => (
  <svg 
    className="absolute top-0 right-0 w-20 h-20 opacity-[0.05] text-black pointer-events-none" 
    viewBox="0 0 100 100" 
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="0" r="90" stroke="currentColor" strokeWidth="8" />
    <circle cx="100" cy="0" r="65" stroke="currentColor" strokeWidth="8" />
    <circle cx="100" cy="0" r="40" stroke="currentColor" strokeWidth="8" />
    <circle cx="100" cy="0" r="15" stroke="currentColor" strokeWidth="8" />
  </svg>
);

const ActionCard = ({ 
  icon: Icon, 
  label, 
  colorClass,
  hoverColorClass,
  onClick
}: { 
  icon: any; 
  label: string; 
  colorClass: string;
  hoverColorClass: string;
  onClick?: () => void;
}) => (
  <div 
    onClick={onClick}
    className={`${colorClass} rounded-xl p-6 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 h-28 w-full group relative overflow-hidden`}
  >
    {/* Subtle Pattern Decoration */}
    <CornerPattern />

    <div className="flex items-center gap-4 z-10">
      <div className="p-3 bg-white/60 rounded-lg backdrop-blur-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-gray-900" strokeWidth={2} />
      </div>
      <span className="font-sans text-lg font-semibold text-gray-900">{label}</span>
    </div>
    
    <div className={`p-2 rounded-full bg-white/30 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 z-10`}>
      <ArrowRight className="w-5 h-5 text-gray-900" />
    </div>
  </div>
);

interface HeroSectionProps {
  onNavigate?: (page: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  return (
    <div className="grid grid-cols-4 gap-6">
      <ActionCard 
        icon={Briefcase} 
        label="Recommended jobs" 
        colorClass="bg-[#E6F0FF]" 
        hoverColorClass="hover:bg-[#dbe9ff]"
        onClick={() => onNavigate?.('Opportunities')}
      />
      <ActionCard 
        icon={Users} 
        label="Community" 
        colorClass="bg-[#E9F5E6]" 
        hoverColorClass="hover:bg-[#dbeed6]"
        onClick={() => onNavigate?.('Community')}
      />
      <ActionCard 
        icon={GraduationCap} 
        label="Explore courses" 
        colorClass="bg-[#FDF2E9]" 
        hoverColorClass="hover:bg-[#fae9db]"
        onClick={() => onNavigate?.('Learning')}
      />
      <ActionCard 
        icon={Calendar} 
        label="Browse events" 
        colorClass="bg-[#F5E6FF]" 
        hoverColorClass="hover:bg-[#ebd6fa]"
        onClick={() => onNavigate?.('Network')}
      />
    </div>
  );
}