import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getCandidateProfile, updateCandidateProfile } from '../services/candidateApi.js';
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx';

const schema = z.object({
  headline: z.string().max(160).optional(),
  currentLocation: z.string().optional(),
  experience: z.number().min(0).max(50).optional(),
});

const ProfilePage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['candidateProfile'], queryFn: getCandidateProfile });

  const profile = data?.data?.profile || {};

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: profile.headline || '',
      currentLocation: profile.currentLocation || '',
      experience: profile.experience || 0,
    },
  });

  // keep form in sync when data arrives
  React.useEffect(() => {
    reset({
      headline: profile.headline || '',
      currentLocation: profile.currentLocation || '',
      experience: profile.experience || 0,
    });
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => updateCandidateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated');
      qc.invalidateQueries({ queryKey: ['candidateProfile'] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Update failed');
    },
  });

  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  if (isLoading) return <DashboardPlaceholder message="Loading profile..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Profile</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Headline</span>
            <input type="text" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('headline')} />
            {errors.headline && <p className="text-sm text-rose-600">{errors.headline.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <input type="text" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('currentLocation')} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Experience (years)</span>
            <input type="number" className="mt-2 w-32 rounded-lg border border-slate-200 px-3 py-2" {...register('experience', { valueAsNumber: true })} />
          </label>

          <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-white">
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
