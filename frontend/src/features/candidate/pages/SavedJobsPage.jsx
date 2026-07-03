import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { listSavedJobs, removeSavedJob } from '../services/candidateApi.js';
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx';

const SavedJobsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ 
    queryKey: ['savedJobs'], 
    queryFn: () => listSavedJobs({ page: 1, limit: 20 }) 
  });

  // FIX 1: Correct data unwrapping to safely catch the array
  const jobs = data?.savedJobs || data?.data?.savedJobs || data || [];

  const removeMutation = useMutation({
    mutationFn: (id) => removeSavedJob(id),
    onSuccess: () => {
      toast.success('Removed from saved jobs');
      qc.invalidateQueries({ queryKey: ['savedJobs'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Remove failed'),
  });

  if (isLoading) return <DashboardPlaceholder message="Loading saved jobs..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Saved Jobs</h2>
        <p className="text-sm text-slate-500 mt-1 mb-4">Keep track of opportunities you are interested in.</p>
        
        <div className="space-y-3">
          {jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500 font-medium">
              No saved jobs yet.
            </div>
          ) : (
            jobs.map((job) => {
              if (!job) return null;
              
              // FIX 2: Fallback for transformed backend schemas (id vs _id)
              const targetJobId = job.id || job._id;

              return (
                <div 
                  key={targetJobId} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 transition-all hover:border-slate-300"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900 text-base">{job.title}</p>
                    <p className="text-sm text-slate-500 font-medium">{job.company?.name || 'Company'}</p>
                  </div>
                  
                  {/* Responsive Button Control */}
                  <button 
                    onClick={() => removeMutation.mutate(targetJobId)} 
                    disabled={removeMutation.isPending}
                    className="w-full sm:w-auto text-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {removeMutation.isPending ? 'Removing...' : 'Remove'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobsPage;