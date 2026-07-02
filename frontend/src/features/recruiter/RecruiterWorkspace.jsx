import { Outlet } from 'react-router-dom';
import RecruiterSidebar from './components/RecruiterSidebar.jsx';

const RecruiterWorkspace = () => (
  <div className="lg:flex lg:gap-6">
    <RecruiterSidebar />
    <div className="mt-6 flex-1 lg:mt-0">
      <Outlet />
    </div>
  </div>
);

export default RecruiterWorkspace;
