import { useSearchParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';

export default function PaymentVerificationGuard({ children }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext)
  const [verificationState, setVerificationState] = useState({
    isLoading: true,
    error: null,
    isVerified: false
  });

  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');
  const errorMessage = searchParams.get('message');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Basic parameter validation
        if (!status || !txRef || !transactionId) {
          throw new Error('Missing payment verification parameters');
        }

        // Validate status value
        const validStatuses = ['successful', 'failed', 'pending'];
        if (!validStatuses.includes(status)) {
          throw new Error('Invalid payment status');
        }

        // API validation
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/wallet/flutterwave/verify`,
          { 
            params: { transaction_id: transactionId },
            headers 
          }
        );

        if (response.data.success) {
          // Refresh user data if payment was successful
          if (status === 'successful') {
            await profile();
            toast.success('Payment verified successfully!');
          }
          
          setVerificationState({
            isLoading: false,
            error: null,
            isVerified: true
          });
        } else {
          throw new Error(response.data.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setVerificationState({
          isLoading: false,
          error: error.response?.data?.message || error.message,
          isVerified: false
        });
        
        // Redirect with error message if verification fails
        navigate('/wallet', { 
          replace: true,
          state: { 
            error: error.response?.data?.message || error.message 
          }
        });
      }
    };

    // If there's an error message in URL params, show it immediately
    if (errorMessage) {
      setVerificationState({
        isLoading: false,
        error: errorMessage,
        isVerified: false
      });
      return;
    }

    verifyPayment();

    // Timeout fallback
    const timer = setTimeout(() => {
      if (verificationState.isLoading) {
        setVerificationState({
          isLoading: false,
          error: 'Verification timed out',
          isVerified: false
        });
        navigate('/wallet', { replace: true });
      }
    }, 15000); // 15 second timeout

    return () => clearTimeout(timer);
  }, [status, txRef, transactionId, navigate, token, profile, errorMessage]);

  if (verificationState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
            Verifying Payment Details
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            Please wait while we confirm your transaction...
          </p>
        </div>
      </div>
    );
  }

  if (verificationState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4">
          <XCircle className="w-12 h-12 text-red-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
            Verification Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            {verificationState.error}
          </p>
          <button
            onClick={() => navigate('/wallet')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  if (!verificationState.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4">
          <AlertCircle className="w-12 h-12 text-yellow-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">
            Payment Not Verified
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center">
            We couldn't verify your payment. Please check your transaction history.
          </p>
          <button
            onClick={() => navigate('/wallet')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Wallet
          </button>
        </div>
      </div>
    );
  }

  return children;
}