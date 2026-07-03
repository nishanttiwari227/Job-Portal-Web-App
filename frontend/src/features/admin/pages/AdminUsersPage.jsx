import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.getUsers({ page, limit: 10 }),
    keepPreviousData: true
  });

  const statusMutation = useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    }
  });

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    if (window.confirm(`Are you sure you want to ${newStatus} ${user.name}?`)) {
      statusMutation.mutate({ id: user._id, status: newStatus });
    }
  };

  if (isLoading) return <div>Loading users...</div>;
  if (isError) return <div className="text-red-500">Failed to load users.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.users?.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleToggleStatus(user)}
                    disabled={statusMutation.isLoading}
                    className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                  >
                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
            {data?.users?.length === 0 && (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
         <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">Previous</button>
         <span className="text-sm text-gray-600">Page {data?.pagination?.page || 1} of {data?.pagination?.totalPages || 1}</span>
         <button disabled={page >= (data?.pagination?.totalPages || 1)} onClick={() => setPage(p => p + 1)} className="px-4 py-2 border rounded-md text-sm disabled:opacity-50 hover:bg-gray-50">Next</button>
      </div>
    </div>
  );
};

export default AdminUsersPage;