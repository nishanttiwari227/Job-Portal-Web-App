import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { listSavedJobs, removeSavedJob } from '../services/candidateApi.js';
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx';

const SavedJobsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['savedJobs'], queryFn: () => listSavedJobs({ page: 1, limit: 20 }) });

  const jobs = data?.data?.savedJobs || [];

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
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Saved jobs</h2>
        <div className="mt-4 space-y-3">
          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No saved jobs.</div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-slate-600">{job.company?.name}</p>
                </div>
                <button onClick={() => removeMutation.mutate(job._id)} className="rounded-md border px-3 py-1">Remove</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobsPage;
