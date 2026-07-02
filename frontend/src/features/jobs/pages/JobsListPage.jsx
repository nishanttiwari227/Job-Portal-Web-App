import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listJobs } from '../services/jobsApi.js';
import { Link } from 'react-router-dom';

const JobsListPage = () => {
  const { data, isLoading } = useQuery({ queryKey: ['jobs', { page: 1 }], queryFn: () => listJobs({ page: 1 }) });

  if (isLoading) return <div className="p-4">Loading...</div>;

  const jobs = data?.data?.jobs || [];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Jobs</h2>
      <div className="space-y-3">
        {jobs.map((job) => (
          <Link key={job._id} to={`/jobs/${job.slug}`} className="block p-4 border rounded hover:shadow">
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm text-gray-500">{job.company?.name} • {job.location}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default JobsListPage;
