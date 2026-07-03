import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { getRecruiterProfile, createCompany, updateCompany } from '../services/recruiterApi.js';
import DashboardPlaceholder from '../../candidate/components/DashboardPlaceholder.jsx';

// FIX 1: Relaxed Zod schema to prevent frontend conflicts
const schema = z.object({
  name: z.string().min(2, "Company name is required"),
  website: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
});

const CompanyPage = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['recruiterProfile'], queryFn: getRecruiterProfile });
  
  const profile = data?.profile || data || {};
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
    if (data) {
      const currentProfile = data.profile || data || {};
      const currentCompany = currentProfile.company || null;
      reset({
        name: currentCompany?.name || '',
        website: currentCompany?.website || '',
        industry: currentCompany?.industry || '',
        location: currentCompany?.location || '',
      });
    }
  }, [data, reset]);

  // Helper to show exact backend errors if they occur
  const handleError = (err) => {
    const backendErrors = err?.response?.data?.errors;
    if (backendErrors && backendErrors.length > 0) {
      toast.error(backendErrors[0].msg);
    } else {
      toast.error(err?.response?.data?.message || 'Action failed');
    }
  };

  const createMut = useMutation({
    mutationFn: (payload) => createCompany(payload),
    onSuccess: () => {
      toast.success('Company created successfully');
      qc.invalidateQueries({ queryKey: ['recruiterProfile'] });
    },
    onError: handleError,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => updateCompany(id, payload),
    onSuccess: () => {
      toast.success('Company updated successfully');
      qc.invalidateQueries({ queryKey: ['recruiterProfile'] });
    },
    onError: handleError,
  });

  const onSubmit = async (values) => {
    // FIX 2: Clean the payload. Remove empty strings to satisfy backend validators
    const payload = {
      name: values.name.trim()
    };

    if (values.website?.trim()) {
      let url = values.website.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
      }
      payload.website = url;
    }

    if (values.industry?.trim()) payload.industry = values.industry.trim();
    if (values.location?.trim()) payload.location = values.location.trim();

    if (company?._id) {
      await updateMut.mutateAsync({ id: company._id, payload });
    } else {
      await createMut.mutateAsync(payload);
    }
  };

  if (isLoading) return <DashboardPlaceholder message="Loading company..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Company Profile</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Company Name *</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('name')} />
            {errors.name && <p className="text-sm text-rose-600 mt-1">{errors.name.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Website</span>
            <input className="mt-2 w-full rounded-lg border px-3 py-2" placeholder="www.example.com" {...register('website')} />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Industry</span>
              <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('industry')} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Location</span>
              <input className="mt-2 w-full rounded-lg border px-3 py-2" {...register('location')} />
            </label>
          </div>

          <button disabled={isSubmitting} className="rounded-lg bg-slate-900 px-6 py-2 text-white font-medium hover:bg-slate-800 transition-colors">
            {isSubmitting ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompanyPage;