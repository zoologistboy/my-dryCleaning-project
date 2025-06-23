import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

export default function EmailVerify() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`http://localhost:3550/api/auth/verify/${token}`);

        console.log(res.data);
        
        setStatus('success');
        setMessage(res.data?.message || 'Email verified successfully!');
        localStorage.removeItem('pendingEmail'); // ✅ clean up
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setTimeout(() => navigate('/signin'), 3000);
      } catch (error) {
        setStatus('error');
        // setMessage(error.data?.message || 'Verification failed.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('No token found in URL.');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900 text-center">
      {status === 'loading' ? (
  <>
    <Loader2 className="w-12 h-12 animate-spin text-blue-600 dark:text-blue-400" />
    <p className="mt-4 text-gray-700 dark:text-gray-300">Verifying your email...</p>
  </>
) : status === 'success' ? (
  <>
    <CheckCircle className="w-12 h-12 text-green-600" />
    <h2 className="mt-4 text-xl font-semibold text-green-700">Success!</h2>
    <p className="text-gray-600 dark:text-gray-300">{message}</p>
    <p className="mt-2 text-sm text-gray-500">Redirecting to login...</p>
  </>
) : status === 'error' ? (
  <>
    <XCircle className="w-12 h-12 text-red-600" />
    <h2 className="mt-4 text-xl font-semibold text-red-700">Verification Failed</h2>
    <p className="text-gray-600 dark:text-gray-300">{message}</p>
  </>
) : (
  <>
    <p className="text-gray-500 dark:text-gray-400">Waiting for verification to begin...</p>
  </>
)}

    </div>
  );
}
