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
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().optional(),
});

const JobFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: jobsData } = useQuery({ queryKey: ['recruiterJobs'], queryFn: () => getRecruiterJobs({ page: 1, limit: 50 }) });
  const { data: profileData } = useQuery({ queryKey: ['recruiterProfile'], queryFn: getRecruiterProfile });
  const companyId = profileData?.data?.profile?.company?._id || profileData?.data?.profile?.company || null;
  const jobs = jobsData?.data?.jobs || [];
  const existing = jobs.find((j) => j._id === id) || null;

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(schema), defaultValues: { title: existing?.title || '', description: existing?.description || '', location: existing?.location || '' } });

  React.useEffect(() => {
    if (existing) {
      reset({ title: existing.title, description: existing.description, location: existing.location });
    }
  }, [existing, reset]);

  const createMut = useMutation({ mutationFn: (p) => createJob(p), onSuccess: () => { qc.invalidateQueries({ queryKey: ['recruiterJobs'] }); toast.success('Job created'); navigate('/recruiter/jobs'); } });
  const updateMut = useMutation({ mutationFn: ({ id, payload }) => updateJob(id, payload), onSuccess: () => { qc.invalidateQueries({ queryKey: ['recruiterJobs'] }); toast.success('Job updated'); navigate('/recruiter/jobs'); } });

  const onSubmit = async (values) => {
    const payload = { ...values };
    if (!payload.company && companyId) payload.company = companyId;

    if (existing) {
      await updateMut.mutateAsync({ id: existing._id, payload });
    } else {
      await createMut.mutateAsync(payload);
    }
  };

  if (!existing && jobsData === undefined) {
    // wait for jobs list to populate for editing scenario
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{existing ? 'Edit job' : 'Create job'}</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm text-slate-700">Title</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('title')} />
            {errors.title && <p className="text-sm text-rose-600">{errors.title.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Description</span>
            <textarea className="mt-2 w-full rounded-lg border px-3 py-2" rows={6} {...register('description')} />
            {errors.description && <p className="text-sm text-rose-600">{errors.description.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Location</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('location')} />
          </label>

          <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-white">{isSubmitting ? 'Saving...' : 'Save'}</button>
        </form>
      </div>
    </div>
  );
};

export default JobFormPage;
