import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { updateRecruiterProfile, getRecruiterProfile } from '../services/recruiterApi.js';

const schema = z.object({
  headline: z.string().optional(),
});

const RecruiterSettings = () => {
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ resolver: zodResolver(schema) });

  const { data } = useQuery({ queryKey: ['recruiterProfile'], queryFn: getRecruiterProfile });
  const profile = data?.data?.profile || {};

  const mutation = useMutation({
    mutationFn: (payload) => updateRecruiterProfile(payload),
    onSuccess: () => {
      toast.success('Settings saved');
      qc.invalidateQueries({ queryKey: ['recruiterProfile'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const onSubmit = async (values) => {
    await mutation.mutateAsync(values);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Recruiter settings</h2>
        <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm text-slate-700">Public headline</span>
            <input defaultValue={profile.headline || ''} className="mt-2 w-full rounded-lg border px-3 py-2" {...register('headline')} />
          </label>

          <button disabled={isSubmitting} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">Save</button>
        </form>
      </div>
    </div>
  );
};

export default RecruiterSettings;
