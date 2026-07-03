import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../services/adminApi';

const AdminDashboardPage = () => {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats
  });

  if (isLoading) return <div className="text-gray-500 animate-pulse">Loading overview...</div>;
  if (isError) return <div className="text-red-500">Failed to load statistics.</div>;

  const statCards = [
    { label: 'Total Users', value: stats?.users },
    { label: 'Recruiters', value: stats?.recruiters },
    { label: 'Candidates', value: stats?.candidates },
    { label: 'Companies', value: stats?.companies },
    { label: 'Total Jobs', value: stats?.jobs },
    { label: 'Applications', value: stats?.applications },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;