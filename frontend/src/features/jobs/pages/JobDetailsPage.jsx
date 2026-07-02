import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getJobBySlug, applyToJob, saveJob, unsaveJob } from '../services/jobsApi.js';

const JobDetailsPage = () => {
  const { slug } = useParams();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['job', slug], queryFn: () => getJobBySlug(slug), enabled: !!slug });

  const applyMutation = useMutation({ mutationFn: (jobId) => applyToJob(jobId), onSuccess: () => { qc.invalidateQueries(['applications']); alert('Applied successfully'); } });
  const saveMutation = useMutation({ mutationFn: (jobId) => saveJob(jobId), onSuccess: () => { qc.invalidateQueries(['savedJobs']); alert('Job saved'); } });
  const unsaveMutation = useMutation({ mutationFn: (jobId) => unsaveJob(jobId), onSuccess: () => { qc.invalidateQueries(['savedJobs']); alert('Job unsaved'); } });

  if (isLoading) return <div className="p-4">Loading...</div>;

  const job = data?.data?.job;

  if (!job) return <div className="p-4">Job not found</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{job.company?.name} • {job.location}</p>
      <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: job.description }} />

      <div className="flex gap-2">
        <button onClick={() => applyMutation.mutate(job._id)} disabled={applyMutation.isLoading} className="px-4 py-2 bg-blue-600 text-white rounded">{applyMutation.isLoading ? 'Applying...' : 'Apply'}</button>
        <button onClick={() => saveMutation.mutate(job._id)} disabled={saveMutation.isLoading} className="px-4 py-2 border rounded">Save</button>
        <button onClick={() => unsaveMutation.mutate(job._id)} disabled={unsaveMutation.isLoading} className="px-4 py-2 border rounded">Unsave</button>
      </div>
    </div>
  );
};

export default JobDetailsPage;
