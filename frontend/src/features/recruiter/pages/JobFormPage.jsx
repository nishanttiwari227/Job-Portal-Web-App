import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { createJob, updateJob, getRecruiterJobs, getRecruiterProfile } from '../services/recruiterApi.js';
import DashboardPlaceholder from '../../candidate/components/DashboardPlaceholder.jsx';

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short"),
  location: z.string().optional(),
});

const JobFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: jobsData } = useQuery({ queryKey: ['recruiterJobs'], queryFn: () => getRecruiterJobs({ page: 1, limit: 50 }) });
  const { data: profileData } = useQuery({ queryKey: ['recruiterProfile'], queryFn: getRecruiterProfile });
  
  const profile = profileData?.profile || profileData || {};
  const companyId = profile.company?._id || profile.company || null;
  
  const jobs = jobsData?.jobs || jobsData?.data?.jobs || [];
  const existing = jobs.find((j) => j._id === id) || null;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ 
    resolver: zodResolver(schema), 
    defaultValues: { title: existing?.title || '', description: existing?.description || '', location: existing?.location || '' } 
  });

  React.useEffect(() => {
    if (existing) {
      reset({ title: existing.title, description: existing.description, location: existing.location || '' });
    }
  }, [existing, reset]);

  const handleError = (err) => {
    const backendErrors = err?.response?.data?.errors;
    if (backendErrors && backendErrors.length > 0) {
      toast.error(backendErrors[0].msg);
    } else {
      toast.error(err?.response?.data?.message || 'Failed to save job');
    }
  };

  const createMut = useMutation({ 
    mutationFn: (p) => createJob(p), 
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recruiterJobs'] }); toast.success('Job created'); navigate('/recruiter/jobs'); },
    onError: handleError
  });
  
  const updateMut = useMutation({ 
    mutationFn: ({ id, payload }) => updateJob(id, payload), 
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['recruiterJobs'] }); toast.success('Job updated'); navigate('/recruiter/jobs'); },
    onError: handleError
  });

  const onSubmit = async (values) => {
    if (!companyId) {
      toast.error('Please create your Company profile first!');
      return;
    }
    
    // FIX: Clean payload logic
    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      company: companyId
    };

    if (values.location?.trim()) {
      payload.location = values.location.trim();
    }

    if (existing) {
      await updateMut.mutateAsync({ id: existing._id, payload });
    } else {
      await createMut.mutateAsync(payload);
    }
  };

  if (!existing && jobsData === undefined) {
    return <DashboardPlaceholder message="Loading..." />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{existing ? 'Edit job' : 'Create job'}</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Job Title *</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('title')} />
            {errors.title && <p className="text-sm text-rose-600 mt-1">{errors.title.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Description *</span>
            <textarea className="mt-2 w-full rounded-lg border px-3 py-2" rows={6} {...register('description')} />
            {errors.description && <p className="text-sm text-rose-600 mt-1">{errors.description.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('location')} />
          </label>

          <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-6 py-2 text-white font-medium hover:bg-slate-800 transition-colors">
            {isSubmitting ? 'Saving...' : 'Save Job'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobFormPage;