import { Outlet } from 'react-router-dom';
import CandidateSidebar from './components/CandidateSidebar.jsx';

const CandidateWorkspace = () => (
  <div className="lg:flex lg:gap-6">
    <CandidateSidebar />
    <div className="mt-6 flex-1 lg:mt-0">
      <Outlet />
    </div>
  </div>
);

export default CandidateWorkspace;
