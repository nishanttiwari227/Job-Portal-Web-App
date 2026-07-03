import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

const AdminCompaniesPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminCompanies', page],
    queryFn: () => adminApi.getCompanies({ page, limit: 10 }),
    keepPreviousData: true
  });

  if (isLoading) return <div>Loading companies...</div>;
  if (isError) return <div className="text-red-500">Failed to load companies.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Companies</h1>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        {/* Added overflow-x-auto wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.companies?.map((company) => (
                <tr key={company._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.userId?.email || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.location || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(company.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!data?.companies || data.companies.length === 0) && (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No companies found.</td>
                </tr>
              )}
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

export default AdminCompaniesPage;