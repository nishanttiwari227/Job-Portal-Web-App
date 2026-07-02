import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getRecruiterJobs, getJobApplicants, updateApplicationStatus } from '../services/recruiterApi.js';
import DashboardPlaceholder from '../../candidate/components/DashboardPlaceholder.jsx';

const ApplicantsPage = () => {
  const [selectedJob, setSelectedJob] = React.useState(null);
  const { data: jobsData, isLoading: jobsLoading } = useQuery({ queryKey: ['recruiterJobs'], queryFn: () => getRecruiterJobs({ page: 1, limit: 50 }) });
  const jobs = jobsData?.data?.jobs || [];

  const { data: applicantsData, isLoading: applicantsLoading, refetch } = useQuery({
    queryKey: ['jobApplicants', selectedJob],
    queryFn: () => getJobApplicants({ jobId: selectedJob, page: 1, limit: 50 }),
    enabled: Boolean(selectedJob),
  });

  const updateMut = useMutation({ mutationFn: ({ applicationId, status }) => updateApplicationStatus({ applicationId, status }), onSuccess: () => { toast.success('Status updated'); refetch(); } });

  if (jobsLoading) return <DashboardPlaceholder message="Loading jobs..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Applicants</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-600">Select job</p>
            <select className="mt-2 w-full rounded-lg border px-3 py-2" value={selectedJob || ''} onChange={(e) => setSelectedJob(e.target.value || null)}>
              <option value="">-- select --</option>
              {jobs.map((j) => (
                <option key={j._id} value={j._id}>{j.title}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            {selectedJob ? (
              applicantsLoading ? (
                <DashboardPlaceholder message="Loading applicants..." />
              ) : (
                <div className="space-y-3">
                  {(applicantsData?.data?.applications || []).map((a) => (
                    <div key={a._id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{a.candidate?.name}</p>
                          <p className="text-sm text-slate-600">{a.candidate?.email}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">{a.status}</span>
                          <button onClick={() => updateMut.mutate({ applicationId: a._id, status: 'shortlisted' })} className="rounded-md border px-3 py-1">Shortlist</button>
                          <button onClick={() => updateMut.mutate({ applicationId: a._id, status: 'rejected' })} className="rounded-md border px-3 py-1">Reject</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-slate-500">Select a job to view applicants.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsPage;
