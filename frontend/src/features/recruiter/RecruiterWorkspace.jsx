import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RecruiterSidebar from './components/RecruiterSidebar.jsx';

const RecruiterWorkspace = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-full bg-gray-50 relative">
      
      {/* Mobile Hamburger Button */}
      <div className="md:hidden absolute top-4 left-4 z-30">
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 bg-white rounded-md shadow-sm border border-slate-200 text-slate-600 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Responsive Sidebar Wrapper */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-sm border-r flex flex-col flex-shrink-0 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100">
          <span className="font-semibold text-slate-700">Menu</span>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <RecruiterSidebar />
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 p-4 pt-16 md:p-8 md:pt-8 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterWorkspace;