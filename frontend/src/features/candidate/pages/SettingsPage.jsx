import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateCandidateProfile } from '../services/candidateApi.js';

const schema = z.object({
  headline: z.string().max(160).optional(),
});

const SettingsPage = () => {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const mutation = useMutation({
    mutationFn: (payload) => updateCandidateProfile(payload),
    onSuccess: () => {
      toast.success('Settings saved');
      qc.invalidateQueries({ queryKey: ['candidateProfile'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Account settings</h2>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Headline (public)</span>
            <input type="text" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2" {...register('headline')} />
            {errors.headline && <p className="text-sm text-rose-600">{errors.headline.message}</p>}
          </label>

          <button disabled={isSubmitting} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">
            {isSubmitting ? 'Saving...' : 'Save settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
