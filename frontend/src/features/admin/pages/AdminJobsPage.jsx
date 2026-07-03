import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

const AdminJobsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminJobs', page],
    queryFn: () => adminApi.getJobs({ page, limit: 10 }),
    keepPreviousData: true
  });

  if (isLoading) return <div>Loading jobs...</div>;
  if (isError) return <div className="text-red-500">Failed to load jobs.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Job Listings</h1>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {/* Added overflow-x-auto wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recruiter</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.jobs?.map((job) => (
                <tr key={job._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.company?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.recruiterId?.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-4">
         <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">Previous</button>
         <span className="text-sm text-gray-600">Page {data?.pagination?.page || 1} of {data?.pagination?.totalPages || 1}</span>
         <button disabled={page >= (data?.pagination?.totalPages || 1)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
};

export default AdminJobsPage;