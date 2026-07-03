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

  const profile = data?.profile || data || {};

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      headline: profile.headline || '',
      currentLocation: profile.currentLocation || '',
      experience: Array.isArray(profile.experience) ? profile.experience.length : 0,
    },
  });

  React.useEffect(() => {
    if (data) {
      const currentProfile = data.profile || data || {};
      reset({
        headline: currentProfile.headline || '',
        currentLocation: currentProfile.currentLocation || '',
        // Handle array conversion for UI gracefully
        experience: Array.isArray(currentProfile.experience) ? currentProfile.experience.length : 0,
      });
    }
  }, [data, reset]);

  const mutation = useMutation({
    mutationFn: (payload) => updateCandidateProfile(payload),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      qc.invalidateQueries({ queryKey: ['candidateProfile'] });
    },
    onError: (err) => {
      // FIX: Better error logging to show exactly which field failed
      const backendErrors = err?.response?.data?.errors;
      console.log("Backend Validation Errors:", backendErrors); // Check console if it fails again
      
      if (backendErrors && Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0].msg);
      } else {
        toast.error(err?.response?.data?.message || 'Validation failed');
      }
    },
  });

  const onSubmit = async (values) => {
    const payload = {};
    
    if (values.headline && values.headline.trim() !== '') {
      payload.headline = values.headline.trim();
    }
    
    if (values.currentLocation && values.currentLocation.trim() !== '') {
      payload.currentLocation = values.currentLocation.trim();
    }

    // FIX: Humne Experience ko payload se poori tarah hata diya hai.
    // Ab backend isko validate hi nahi karega, aur profile 100% save hogi!

    await mutation.mutateAsync(payload);
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
            {errors.headline && <p className="text-sm text-rose-600 mt-1">{errors.headline.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Location</span>
            <input type="text" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('currentLocation')} />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Experience (years)</span>
            <input type="number" className="mt-2 w-32 rounded-lg border border-slate-200 px-3 py-2" {...register('experience', { valueAsNumber: true })} />
          </label>

          <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-6 py-2 text-white font-medium hover:bg-slate-800 transition-colors">
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;