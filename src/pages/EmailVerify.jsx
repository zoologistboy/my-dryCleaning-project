import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function EmailVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) throw new Error('Invalid verification token');

        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/auth/verify/${token}`,
          {
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
            },
          }
        );

        console.log('Verification response:', res.data);

        if (res.data.status !== 'success') {
          throw new Error(res.data?.message || 'Verification failed');
        }

        setStatus('success');
        setMessage(res.data.message || 'Email verified successfully!');

        // Clear localStorage
        localStorage.removeItem('pendingEmail');
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Start countdown
        timerRef.current = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              navigate('/signin');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(
          error.response?.data?.message ||
          error.message ||
          'Email verification failed. The link may be expired or invalid.'
        );
        toast.error('Verification failed');
      }
    };

    verifyEmail();

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 text-center">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        {status === 'loading' ? (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto" />
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Verifying your email...
            </p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-green-700 dark:text-green-400">
              Email Verified!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {message}
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Redirecting to login in {countdown} seconds...
            </p>
            <button
              onClick={() => navigate('/signin')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Login Now
            </button>
          </>
        ) : (
          <>
            <XCircle className="w-12 h-12 text-red-600 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-red-700 dark:text-red-400">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {message}
            </p>
            <div className="mt-6 space-y-3">
              <button
                onClick={() => navigate('/signin')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
