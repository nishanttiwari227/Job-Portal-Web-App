import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { getRecruiterProfile, createCompany, updateCompany } from '../services/recruiterApi.js';
import DashboardPlaceholder from '../../candidate/components/DashboardPlaceholder.jsx';

const schema = z.object({
  name: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')).optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

const CompanyPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['recruiterProfile'], queryFn: getRecruiterProfile });
  const profile = data?.data?.profile || {};
  const company = profile.company || null;

  const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company?.name || '',
      website: company?.website || '',
      industry: company?.industry || '',
      location: company?.location || '',
    },
  });

  React.useEffect(() => {
    reset({
      name: company?.name || '',
      website: company?.website || '',
      industry: company?.industry || '',
      location: company?.location || '',
    });
  }, [company, reset]);

  const createMut = useMutation({
    mutationFn: (payload) => createCompany(payload),
    onSuccess: () => {
      toast.success('Company created');
      qc.invalidateQueries({ queryKey: ['recruiterProfile'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateCompany(id, payload),
    onSuccess: () => {
      toast.success('Company updated');
      qc.invalidateQueries({ queryKey: ['recruiterProfile'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  });

  const onSubmit = async (values) => {
    if (company?._id) {
      await updateMut.mutateAsync({ id: company._id, payload: values });
    } else {
      await createMut.mutateAsync(values);
    }
  };

  if (isLoading) return <DashboardPlaceholder message="Loading company..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Company</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm text-slate-700">Name</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('name')} />
            {errors.name && <p className="text-sm text-rose-600">{errors.name.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm text-slate-700">Website</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('website')} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-slate-700">Industry</span>
              <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('industry')} />
            </label>
            <label className="block">
              <span className="text-sm text-slate-700">Location</span>
              <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('location')} />
            </label>
          </div>

          <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-4 py-2 text-white">
            {isSubmitting ? 'Saving...' : company ? 'Update company' : 'Create company'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyPage;
