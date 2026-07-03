import { Outlet, Link, useLocation } from 'react-router-dom';

const AdminWorkspace = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/admin', label: 'Overview' },
    { path: '/admin/users', label: 'Manage Users' },
    { path: '/admin/companies', label: 'Companies' },
    { path: '/admin/jobs', label: 'Job Listings' },
    { path: '/admin/applications', label: 'Applications' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <aside className="w-64 bg-white shadow-sm border-r flex flex-col">
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminWorkspace;