import { Outlet } from 'react-router-dom';

const AppLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <main className="mx-auto max-w-7xl px-4 py-6">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
