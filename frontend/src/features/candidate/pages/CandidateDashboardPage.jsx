import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getCandidateProfile, getApplicationsSummary, getSavedJobsCount, getNotifications } from '../services/candidateDashboardApi.js';
import DashboardCard from '../components/DashboardCard.jsx';
import DashboardSection from '../components/DashboardSection.jsx';
import DashboardPlaceholder from '../components/DashboardPlaceholder.jsx';

const CandidateDashboardPage = () => {
  const { data: profileData, isLoading: profileLoading, error: profileError } = useQuery({
  queryKey: ['candidateProfile'],
  queryFn: getCandidateProfile,
});

const { data: applicationsData, isLoading: applicationsLoading, error: applicationsError } = useQuery({
  queryKey: ['applicationsSummary'],
  queryFn: getApplicationsSummary,
});

const { data: savedJobsData, isLoading: savedJobsLoading, error: savedJobsError } = useQuery({
  queryKey: ['savedJobsCount'],
  queryFn: getSavedJobsCount,
});

const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError } = useQuery({
  queryKey: ['notifications'],
  queryFn: getNotifications,
});

  const isAnyLoading = profileLoading || applicationsLoading || savedJobsLoading || notificationsLoading;
  const hasError = profileError || applicationsError || savedJobsError || notificationsError;

  if (hasError) {
    toast.error('Unable to load dashboard data. Please try again.');
  }

  const profile = profileData?.data?.profile || null;
  const applications = applicationsData?.data?.applications || [];
  const savedJobs = savedJobsData?.data?.savedJobs || [];
  const notifications = notificationsData?.data?.notifications || [];

  const totalApplications = applications.length;
  const activeApplications = applications.filter((item) => item.status === 'applied' || item.status === 'under_review').length;
  const rejectedApplications = applications.filter((item) => item.status === 'rejected').length;
  const shortlistedApplications = applications.filter((item) => item.status === 'shortlisted').length;

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Candidate dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Welcome back{profile?.name ? `, ${profile.name}` : ''}</h1>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard
          title="Applications"
          value={isAnyLoading ? '...' : totalApplications}
          description="Total applications submitted"
        />
        <DashboardCard
          title="Active"
          value={isAnyLoading ? '...' : activeApplications}
          description="Applications in process"
        />
        <DashboardCard
          title="Saved jobs"
          value={isAnyLoading ? '...' : savedJobs.length}
          description="Jobs you saved for later"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <DashboardSection title="Profile overview">
            {isAnyLoading ? (
              <DashboardPlaceholder message="Loading profile details..." />
            ) : profile ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-600">{profile.profile?.headline || 'No headline set yet'}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Location</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{profile.profile?.location || 'Not specified'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Experience</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">
                      {profile.profile?.experience ? `${profile.profile.experience} years` : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <DashboardPlaceholder message="No profile found." />
            )}
          </DashboardSection>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <DashboardSection title="Resume status">
            {isAnyLoading ? (
              <DashboardPlaceholder message="Loading resume status..." />
            ) : profile?.profile?.resume?.publicId ? (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-slate-700">
                <p className="text-sm font-semibold text-slate-900">Resume uploaded</p>
                <p className="mt-2 text-sm text-slate-600">Ready for applications.</p>
              </div>
            ) : (
              <DashboardPlaceholder message="No resume uploaded yet." />
            )}
          </DashboardSection>
        </article>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <DashboardSection title="Application summary">
            {isAnyLoading ? (
              <DashboardPlaceholder message="Loading application data..." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Rejected</p>
                  <p className="mt-2 text-2xl font-semibold text-rose-600">{rejectedApplications}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Shortlisted</p>
                  <p className="mt-2 text-2xl font-semibold text-emerald-600">{shortlistedApplications}</p>
                </div>
              </div>
            )}
          </DashboardSection>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <DashboardSection title="Recent notifications">
            {isAnyLoading ? (
              <DashboardPlaceholder message="Loading notifications..." />
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{notification.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <DashboardPlaceholder message="No recent notifications." />
            )}
          </DashboardSection>
        </article>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;
