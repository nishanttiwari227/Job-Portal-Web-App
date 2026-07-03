import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listJobs } from '../services/jobsApi.js';
import { Link } from 'react-router-dom';

// Polished Skeleton Loader
const JobCardSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="h-10 w-10 rounded-lg bg-slate-100"></div>
      <div className="h-5 w-16 rounded-full bg-slate-100"></div>
    </div>
    <div className="h-5 w-3/4 rounded bg-slate-200 mb-3"></div>
    <div className="h-4 w-1/2 rounded bg-slate-100 mb-5"></div>
    <div className="flex gap-2">
      <div className="h-6 w-20 rounded-md bg-slate-100"></div>
      <div className="h-6 w-20 rounded-md bg-slate-100"></div>
    </div>
  </div>
);

const JobsListPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['jobs', { page: 1 }], queryFn: () => listJobs({ page: 1 }) });

  // FIX: Properly unwrap the API data
  const jobs = data?.jobs || data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Explore Jobs</h2>
          <p className="text-sm text-slate-500 mt-1">Discover your next career opportunity.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((n) => <JobCardSkeleton key={n} />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(jobs) && jobs.map((job) => (
            <Link 
              key={job._id} 
              to={`/candidate/jobs/${job.slug}`} 
              className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-card-hover"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  {/* Company Avatar Substitute */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-lg font-bold text-brand-600 transition-colors group-hover:bg-brand-100 group-hover:text-brand-700">
                    {job.company?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  {/* Status Badge */}
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                    Active
                  </span>
                </div>
                
                <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors duration-200">
                  {job.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{job.company?.name}</p>
              </div>
              
              {/* Tags / Badges */}
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                  📍 {job.location || 'Remote'}
                </span>
                {job.jobType && (
                  <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">
                    💼 {job.jobType}
                  </span>
                )}
              </div>
            </Link>
          ))}
          
          {/* Polished Empty State */}
          {(!Array.isArray(jobs) || jobs.length === 0) && (
            <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 px-4 text-center shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 mb-4 text-2xl">
                🔍
              </div>
              <h3 className="text-base font-semibold text-slate-900">No jobs found</h3>
              <p className="text-sm font-medium text-slate-500 mt-1 max-w-sm">
                We couldn't find any job postings at the moment. Please check back later for new opportunities.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsListPage;