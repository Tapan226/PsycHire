import React from 'react';
import { Company } from '@/app/data/companies';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ArrowRight, Plus, CheckCircle2, Building2, Briefcase } from 'lucide-react';

interface FollowedCompaniesListProps {
  companies: Company[];
  onNavigate: (companyId: string) => void;
  onDiscover: () => void;
  onViewAll: () => void;
}

export const FollowedCompaniesList = ({ companies, onNavigate, onDiscover, onViewAll }: FollowedCompaniesListProps) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-24 overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Building2 size={12} className="text-cyan-600" />
            </div>
            <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 700 }}>
              Following
            </p>
            {companies.length > 0 && (
              <span className="min-w-[20px] h-[20px] rounded-full bg-cyan-50 text-cyan-700 flex items-center justify-center px-1.5"
                style={{ fontSize: 11, fontWeight: 700 }}
              >
                {companies.length}
              </span>
            )}
          </div>
          {companies.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-cyan-700 hover:text-cyan-800 flex items-center gap-1 transition-colors"
              style={{ fontSize: 12, fontWeight: 600 }}
            >
              View All
              <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="px-3 py-2">
        {companies.length > 0 ? (
          <div className="flex flex-col gap-0.5">
            {companies.map(company => {
              const openings = company.stats.activeJobs + company.stats.activeProjects;
              return (
                <div
                  key={company.id}
                  onClick={() => onNavigate(company.id)}
                  className="flex items-center gap-3 px-2.5 py-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 shadow-sm">
                    <ImageWithFallback src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-gray-900 truncate group-hover:text-cyan-700 transition-colors"
                        style={{ fontSize: 13, fontWeight: 700 }}
                      >
                        {company.name}
                      </p>
                      {company.isVerified && <CheckCircle2 size={11} className="text-blue-500 shrink-0" fill="currentColor" />}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-gray-400 truncate" style={{ fontSize: 11 }}>
                        {company.industry}
                      </span>
                      {openings > 0 && (
                        <>
                          <span className="w-0.5 h-0.5 rounded-full bg-gray-300 shrink-0" />
                          <span className="text-blue-600 shrink-0 flex items-center gap-0.5" style={{ fontSize: 10, fontWeight: 600 }}>
                            <Briefcase size={9} />
                            {openings}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowRight size={13} className="text-gray-300 group-hover:text-cyan-500 transition-colors shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
              <Building2 size={20} />
            </div>
            <p className="text-gray-900 mb-1" style={{ fontSize: 13, fontWeight: 700 }}>
              No companies followed
            </p>
            <p className="text-gray-400 mb-4" style={{ fontSize: 12 }}>
              Follow companies to see their updates here.
            </p>
            <button
              onClick={onDiscover}
              className="text-cyan-700 hover:text-cyan-800 hover:underline transition-colors"
              style={{ fontSize: 12, fontWeight: 700 }}
            >
              Start Exploring
            </button>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      {companies.length > 0 && (
        <div className="px-4 pb-4">
          <button
            onClick={onDiscover}
            className="w-full py-2.5 flex items-center justify-center gap-2 rounded-lg text-gray-500 hover:text-cyan-700 hover:bg-cyan-50 border border-dashed border-gray-200 hover:border-cyan-200 transition-all"
            style={{ fontSize: 12, fontWeight: 700 }}
          >
            <Plus size={14} />
            Discover more companies
          </button>
        </div>
      )}
    </div>
  );
};
