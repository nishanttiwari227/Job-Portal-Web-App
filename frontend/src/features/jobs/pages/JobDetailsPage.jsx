import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getJobBySlug, applyToJob, saveJob, unsaveJob } from '../services/jobsApi.js';
import { toast } from 'react-hot-toast';

const JobDetailsPage = () => {
  const { slug } = useParams();
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({ 
    queryKey: ['job', slug], 
    queryFn: () => getJobBySlug(slug), 
    enabled: !!slug 
  });

  // Mutations with global toast notifications
  const applyMutation = useMutation({ 
    mutationFn: (jobId) => applyToJob(jobId), 
    onSuccess: () => { 
      qc.invalidateQueries(['applications']); 
      toast.success('Applied successfully!'); 
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to apply')
  });

  const saveMutation = useMutation({ 
    mutationFn: (jobId) => saveJob(jobId), 
    onSuccess: () => { 
      qc.invalidateQueries(['savedJobs']); 
      toast.success('Job saved successfully!'); 
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to save job')
  });

  const unsaveMutation = useMutation({ 
    mutationFn: (jobId) => unsaveJob(jobId), 
    onSuccess: () => { 
      qc.invalidateQueries(['savedJobs']); 
      toast.success('Job removed from saved list!'); 
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed to unsave job')
  });

  if (isLoading) return <div className="p-8 text-center text-slate-500 font-medium">Loading job details...</div>;
  if (error) return <div className="p-8 text-center text-red-600 font-medium">Error loading job: {error.message}</div>;

  // Unwrap target job details object safely
  const job = data?.job || data || null;

  if (!job) return <div className="p-8 text-center text-slate-500 font-medium">Job not found.</div>;

  // FIX: Safely extract ID from public schema transformed by backend toPublicJSON()
  const targetJobId = job.id || job._id;

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto bg-white shadow-sm border border-slate-200 rounded-2xl mt-4 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-slate-950 mb-2">{job.title}</h2>
      
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 mb-6 font-medium">
        <span>🏢 {job.company?.name || 'Company'}</span>
        <span>•</span>
        <span>📍 {job.location || 'Remote'}</span>
        <span>•</span>
        <span className="capitalize">💼 {job.jobType || 'Full-time'}</span>
      </div>
      
      <div className="prose max-w-none text-slate-700 mb-8 leading-relaxed">
        <h3 className="text-base font-bold text-slate-900 mb-2">Job Description</h3>
        <div dangerouslySetInnerHTML={{ __html: job.description || '<p>No description provided.</p>' }} />
      </div>

      {/* FIX: Full Mobile-Responsive Button Controls Container */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6 border-t border-slate-100 pt-6">
        <button 
          onClick={() => applyMutation.mutate(targetJobId)} 
          disabled={applyMutation.isPending} 
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          {applyMutation.isPending ? 'Applying...' : 'Apply Now'}
        </button>
        
        <button 
          onClick={() => saveMutation.mutate(targetJobId)} 
          disabled={saveMutation.isPending} 
          className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Save Job
        </button>
        
        <button 
          onClick={() => unsaveMutation.mutate(targetJobId)} 
          disabled={unsaveMutation.isPending} 
          className="w-full sm:w-auto px-6 py-2.5 border border-slate-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 active:scale-[0.98] transition-all disabled:opacity-50 sm:ml-auto"
        >
          Unsave
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPage;