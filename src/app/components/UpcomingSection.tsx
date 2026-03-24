import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Chip } from '@/app/components/Chip';

export const UpcomingItem = ({ 
  title, 
  subtitle,
  date,
  type = "session"
}: { 
  title: string; 
  subtitle: string;
  date: string;
  type?: "session" | "deadline" | "event";
}) => {
  const getIconColor = () => {
    switch(type) {
      case "session": return "bg-[#D7E7C9] text-green-900";
      case "deadline": return "bg-[#FFD6D6] text-red-900";
      case "event": return "bg-[#E6F0FF] text-blue-900";
      default: return "bg-gray-100 text-gray-900";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-300 group cursor-pointer">
      <div className={`w-12 h-12 rounded-xl ${getIconColor()} shrink-0 flex flex-col items-center justify-center shadow-sm`}>
        <span className="text-[10px] font-bold uppercase">{date.split(' ')[0]}</span>
        <span className="text-base font-bold leading-none">{date.split(' ')[1]}</span>
      </div>
      
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-gray-900 group-hover:text-brand-primary transition-colors truncate">{title}</h3>
        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1 truncate">
             <Clock size={12} /> {subtitle}
          </span>
          {type === 'deadline' && (
             <Chip label="Due Soon" variant="rose" className="!px-1.5 !py-0.5 !text-[9px]" />
          )}
        </div>
      </div>
    </div>
  );
};

export const CalendarWidget = ({ className, clean = false }: { className?: string, clean?: boolean }) => {
  const days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  // Starting July 2023. July 1st was a Saturday.
  const dates = [
    // Blank for Mo, Tu, We, Th, Fr
    null, null, null, null, null, 
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 
    { day: 12, active: true }, 
    13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31
  ];

  return (
    <div className={`${!clean ? 'bg-white rounded-xl p-5 border border-gray-200 shadow-sm' : ''} w-full flex flex-col ${className || ''}`}>
      <div className="flex items-center justify-between mb-4 px-1">
        <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft size={16} className="text-gray-600" /></button>
        <div className="flex items-center gap-2">
           <CalendarIcon size={14} className="text-brand-primary" />
           <span className="font-semibold text-gray-900 text-sm">July 2023</span>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight size={16} className="text-gray-600" /></button>
      </div>
      
      <div className="grid grid-cols-7 gap-y-2 text-center flex-1 content-center">
        {days.map(d => (
          <div key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{d}</div>
        ))}
        {dates.map((d, i) => {
          if (d === null) return <div key={i} />;
          if (typeof d === 'object') {
            return (
              <div key={i} className="flex justify-center items-center">
                <span className="w-7 h-7 flex items-center justify-center bg-brand-primary text-white rounded-md text-xs font-bold shadow-md transform scale-105">
                  {d.day}
                </span>
              </div>
            );
          }
          return (
            <div key={i} className="flex justify-center items-center">
              <span className="w-7 h-7 flex items-center justify-center text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-brand-primary rounded-md cursor-pointer transition-colors">
                {d}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export function UpcomingSection() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Upcoming Schedule</h2>
        <a href="#" className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1 group">
          View Calendar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 flex flex-col gap-4">
          <UpcomingItem 
            title="Supervision session with Dr. Puneet" 
            subtitle="4:00 PM - 5:00 PM (1 hr)"
            date="JUL 12"
            type="session"
          />
          <UpcomingItem 
            title="EWT Project - Psychology App Development" 
            subtitle="Submission Deadline: 11:59 PM"
            date="OCT 28"
            type="deadline"
          />
          <UpcomingItem 
            title="Cognitive Behavioral Therapy Workshop" 
            subtitle="10:00 AM - 2:00 PM (4 hrs) • Online"
            date="MAR 15"
            type="event"
          />
        </div>
        <div className="md:col-span-4">
          <CalendarWidget />
        </div>
      </div>
    </div>
  );
}
