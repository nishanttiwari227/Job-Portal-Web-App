import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';

const AuthenticatedLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthenticatedLayout;