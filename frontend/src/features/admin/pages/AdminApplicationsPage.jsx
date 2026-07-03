import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

const AdminApplicationsPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminApplications', page],
    queryFn: () => adminApi.getApplications({ page, limit: 10 }),
    keepPreviousData: true
  });

  if (isLoading) return <div>Loading applications...</div>;
  if (isError) return <div className="text-red-500">Failed to load applications.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Applications</h1>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.applications?.map((app) => (
              <tr key={app._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{app.job?.title || 'Unknown Job'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{app.candidate?.email || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    app.status === 'hired' ? 'bg-green-100 text-green-800' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!data?.applications || data.applications.length === 0) && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-between items-center mt-4">
         <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">Previous</button>
         <span className="text-sm text-gray-600">Page {data?.pagination?.page || 1} of {data?.pagination?.totalPages || 1}</span>
         <button disabled={page >= (data?.pagination?.totalPages || 1)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
};

export default AdminApplicationsPage;