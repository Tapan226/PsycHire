import React from 'react';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { Calendar, MapPin, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle, FileText, UserCheck } from 'lucide-react';

export type ApplicationStatus = 'In Review' | 'Shortlisted' | 'Interview' | 'Accepted' | 'Rejected';

export interface ApplicationJob {
  companyName: string;
  logoUrl: string;
  jobTitle: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  nextStep?: string;
}

interface ApplicationTrackerItemProps {
  job: ApplicationJob;
  onClick: () => void;
}

export const ApplicationTrackerItem = ({ job, onClick }: ApplicationTrackerItemProps) => {
  
  const getStatusConfig = (status: ApplicationStatus) => {
    switch (status) {
      case 'In Review': 
        return { 
          color: 'bg-yellow-50 text-yellow-700 border-yellow-200', 
          icon: FileText, 
          label: 'In Review' 
        };
      case 'Shortlisted': 
        return { 
          color: 'bg-purple-50 text-purple-700 border-purple-200', 
          icon: UserCheck, 
          label: 'Shortlisted' 
        };
      case 'Interview': 
        return { 
          color: 'bg-blue-50 text-blue-700 border-blue-200', 
          icon: Calendar, 
          label: 'Interview' 
        };
      case 'Accepted': 
        return { 
          color: 'bg-green-50 text-green-700 border-green-200', 
          icon: CheckCircle2, 
          label: 'Accepted' 
        };
      case 'Rejected': 
        return { 
          color: 'bg-red-50 text-red-700 border-red-200', 
          icon: XCircle, 
          label: 'Rejected' 
        };
      default: 
        return { 
          color: 'bg-gray-50 text-gray-700 border-gray-200', 
          icon: AlertCircle, 
          label: status 
        };
    }
  };

  const statusConfig = getStatusConfig(job.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        
        {/* Job Info */}
        <div className="flex-1 flex gap-4 min-w-0">
           <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
              <ImageWithFallback src={job.logoUrl} alt={job.companyName} className="w-full h-full object-cover" />
           </div>
           <div className="flex flex-col min-w-0 justify-center">
              <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-brand-primary transition-colors">
                {job.jobTitle}
              </h3>
              <p className="text-gray-500 font-medium text-sm truncate">{job.companyName}</p>
              
              <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                     <MapPin size={12} />
                     {job.location}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300" />
                  <div className="flex items-center gap-1">
                     <Calendar size={12} />
                     Applied on {job.appliedDate}
                  </div>
              </div>
           </div>
        </div>

        {/* Status Badge & Next Step */}
        <div className="flex flex-col items-start md:items-end gap-3 min-w-0">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold border ${statusConfig.color}`}>
               <StatusIcon size={14} />
               <span>{statusConfig.label}</span>
            </div>
        </div>

        {/* Action Chevron */}
        <div className="hidden md:flex items-center justify-center pl-2">
            <ChevronRight className="text-gray-300 group-hover:text-brand-primary transition-colors" />
        </div>
      </div>
    </div>
  );
};
