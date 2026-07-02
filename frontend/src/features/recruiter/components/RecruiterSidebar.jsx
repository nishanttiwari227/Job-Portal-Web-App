import { Link, useLocation } from 'react-router-dom';

const NavItem = ({ to, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;

  return (
    <Link
      to={to}
      className={`block rounded-lg px-4 py-3 text-sm font-medium hover:bg-slate-100 ${
        active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
      }`}
    >
      {label}
    </Link>
  );
};

const RecruiterSidebar = () => (
  <aside className="hidden lg:block w-64 shrink-0">
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-700">Recruiter</h3>
      <nav className="mt-2 space-y-1">
        <NavItem to="/recruiter/company" label="Company" />
        <NavItem to="/recruiter/jobs" label="Jobs" />
        <NavItem to="/recruiter/applicants" label="Applicants" />
        <NavItem to="/recruiter/settings" label="Settings" />
      </nav>
    </div>
  </aside>
);

export default RecruiterSidebar;
