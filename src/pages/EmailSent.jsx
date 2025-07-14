import { useEffect, useState } from 'react';
import axios from 'axios';
import { MailCheck, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmailSent() {
  const navigate = useNavigate();
  const email = localStorage.getItem('pendingEmail');

  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleResend = async () => {
    if (!email) {
      setMessage("No email found. Please sign up again.");
      return setTimeout(() => navigate("/signup"), 3000);
     
    }

    setResending(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/resend-verification`, { email });
      setMessage(res.data?.message || 'Verification email resent!');
      setCooldown(60); // ⏱️ start 60s countdown
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage('✅ Your email is already verified. You can sign in.');
      } else {
        setMessage('❌ Failed to resend verification. Try again.');
      }
    } finally {
      setResending(false);
    }
  };

  // ⏱️ Countdown effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-md text-center space-y-6">
        <MailCheck className="w-12 h-12 text-blue-600 mx-auto" />
        <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Check Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          We’ve sent a verification link to your email. Please check your inbox and spam folder.
        </p>

        {message && <p className="text-sm text-blue-500 dark:text-blue-300">{message}</p>}

        <button
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className={`flex items-center justify-center gap-2 text-sm ${
            resending || cooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:underline'
          }`}
        >
          <RefreshCcw className="w-4 h-4" />
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
        </button>

        <button
          onClick={() => navigate('/signin')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Go to Sign In
        </button>
      </div>
    </div>
  );
}
