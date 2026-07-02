import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { getRecruiterJobs, createJob, updateJob, deleteJob } from '../services/recruiterApi.js';
import DashboardPlaceholder from '../../candidate/components/DashboardPlaceholder.jsx';

const JobsPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['recruiterJobs'], queryFn: () => getRecruiterJobs({ page: 1, limit: 20 }) });
  const jobs = data?.data?.jobs || [];

  const createMut = useMutation({ mutationFn: (p) => createJob(p), onSuccess: () => qc.invalidateQueries({ queryKey: ['recruiterJobs'] }) });
  const updateMut = useMutation({ mutationFn: ({ id, payload }) => updateJob(id, payload), onSuccess: () => qc.invalidateQueries({ queryKey: ['recruiterJobs'] }) });
  const deleteMut = useMutation({ mutationFn: (id) => deleteJob(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['recruiterJobs'] }) });

  if (isLoading) return <DashboardPlaceholder message="Loading jobs..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Jobs</h2>
        <Link to="/recruiter/jobs/new" className="rounded-lg bg-slate-900 px-4 py-2 text-white">Create job</Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {jobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">No jobs found.</div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job._id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-slate-600">{job.company?.name} • {job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link to={`/recruiter/jobs/${job._id}/edit`} className="rounded-md border px-3 py-1">Edit</Link>
                  <button onClick={() => deleteMut.mutate(job._id)} className="rounded-md border px-3 py-1">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
