import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getRecruiterProfile, getRecruiterJobs } from '../services/recruiterDashboardApi.js';
import DashboardCard from '../../candidate/components/DashboardCard.jsx';
import DashboardSection from '../../candidate/components/DashboardSection.jsx';
import DashboardPlaceholder from '../../candidate/components/DashboardPlaceholder.jsx';

const RecruiterDashboardPage = () => {
  const {
    data: profileData,
    isLoading: profileLoading,
    error: profileError,
  } = useQuery({
    queryKey: ['recruiterProfile'],
    queryFn: getRecruiterProfile,
  });

  const {
    data: jobsData,
    isLoading: jobsLoading,
    error: jobsError,
  } = useQuery({
    queryKey: ['recruiterJobs'],
    queryFn: getRecruiterJobs,
  });

  const isAnyLoading = profileLoading || jobsLoading;
  const hasError = Boolean(profileError || jobsError);

  useEffect(() => {
    if (hasError) {
      toast.error('Unable to load recruiter dashboard data. Please try again.');
    }
  }, [hasError]);

  const profile = profileData?.data?.profile || null;
  const jobs = jobsData?.data?.jobs || [];
  const displayedJobs = jobs.slice(0, 5);

  const totalJobs = jobsData?.data?.pagination?.total || 0;
  const activeJobs = jobs.filter((job) => job.status === 'active').length;
  const closedJobs = jobs.filter((job) => job.status === 'closed').length;
  const totalApplications = jobs.reduce((sum, job) => sum + (job.totalApplications || 0), 0);

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Recruiter dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back{profile?.name ? `, ${profile.name}` : ''}</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Total jobs"
          value={isAnyLoading ? '...' : totalJobs}
          description="Jobs posted by your company"
        />
        <DashboardCard
          title="Active jobs"
          value={isAnyLoading ? '...' : activeJobs}
          description="Jobs currently accepting applications"
        />
        <DashboardCard
          title="Closed jobs"
          value={isAnyLoading ? '...' : closedJobs}
          description="Jobs no longer accepting applications"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <DashboardSection title="Company overview">
            {isAnyLoading ? (
              <DashboardPlaceholder message="Loading company details..." />
            ) : profile ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">{profile.headline || 'Recruiter at your company'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Company</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{profile.company?.name || 'Not specified'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{profile.location || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ) : (
              <DashboardPlaceholder message="No recruiter profile found." />
            )}
          </DashboardSection>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <DashboardSection title="Applications received">
            {isAnyLoading ? (
              <DashboardPlaceholder message="Loading applications summary..." />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center">
                <p className="text-3xl font-semibold text-slate-900">{totalApplications}</p>
                <p className="mt-2 text-sm text-slate-500">Total applications across your jobs</p>
              </div>
            )}
          </DashboardSection>
        </article>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <DashboardSection title="Latest job postings">
          {isAnyLoading ? (
            <DashboardPlaceholder message="Loading jobs..." />
          ) : jobs.length > 0 ? (
            <div className="space-y-4">
              {displayedJobs.map((job) => (
                <div key={job._id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{job.title}</p>
                      <p className="text-sm text-slate-500">{job.company?.name || 'Company not specified'}</p>
                    </div>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                      {job.status || 'unknown'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{job.location || 'Location not specified'}</p>
                </div>
              ))}
            </div>
          ) : (
            <DashboardPlaceholder message="No jobs posted yet." />
          )}
        </DashboardSection>
      </article>
    </div>
  );
};

export default RecruiterDashboardPage;