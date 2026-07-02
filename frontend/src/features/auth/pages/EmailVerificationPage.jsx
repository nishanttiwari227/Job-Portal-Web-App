import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthCard from '../../../components/common/AuthCard.jsx';
import { verifyEmail } from '../services/authApi.js';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setIsLoading(false);
      toast.error('Verification token is missing');
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        setStatus('success');
        toast.success('Email verified successfully');
      } catch (error) {
        setStatus('error');
        toast.error(error?.response?.data?.message || 'Verification failed');
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <AuthCard title="Email verification" subtitle="Validate your account token to continue.">
        {isLoading ? (
          <p className="text-sm text-slate-500">Verifying your account now...</p>
        ) : status === 'success' ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-slate-500">Your email has been verified.</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Go to login
            </button>
          </div>
        ) : (
          <div className="space-y-4 text-center">
            <p className="text-sm text-red-600">Verification failed. Please try again.</p>
            <Link to="/register" className="text-sm font-semibold text-slate-900 hover:text-slate-700">
              Return to register
            </Link>
          </div>
        )}
      </AuthCard>
    </div>
  );
};

export default EmailVerificationPage;
