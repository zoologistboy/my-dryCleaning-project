import { useSearchParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Loader2, AlertCircle, CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const [verificationState, setVerificationState] = useState({
    isLoading: true,
    error: null,
    isVerified: false,
    paymentDetails: null
  });

  const status = searchParams.get('status');
  const txRef = searchParams.get('tx_ref');
  const transactionId = searchParams.get('transaction_id');//await
  const errorMessage = searchParams.get('message');

  // useEffect(() => {
  //   const verifyPayment = async () => {
  //     try {
  //       // Basic parameter validation
  //       if (!status || !txRef || !transactionId) {
  //         throw new Error('Missing payment verification parameters');
  //       }

  //       // Validate status value
  //       const validStatuses = ['successful', 'failed', 'pending'];
  //       if (!validStatuses.includes(status)) {
  //         throw new Error('Invalid payment status');
  //       }

  //       // API validation
  //       const headers = { Authorization: `Bearer ${token}` };
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_BASE_URL}/api/wallet/flutterwave/verify`,
  //         { 
  //           params: { transaction_id: transactionId },
  //           headers 
  //         }
  //       );

  //       if (response.data.success) {
  //         // Refresh user data if payment was successful
  //         if (status === 'successful') {
  //           await profile();
  //           toast.success('Payment completed successfully!');
  //         }
          
  //         setVerificationState({
  //           isLoading: false,
  //           error: null,
  //           isVerified: true,
  //           paymentDetails: response.data.data
  //         });
  //       } else {
  //         throw new Error(response.data.message || 'Payment verification failed');
  //       }
  //     } catch (error) {
  //       console.error('Payment verification error:', error);
  //       setVerificationState({
  //         isLoading: false,
  //         error: error.response?.data?.message || error.message,
  //         isVerified: false,
  //         paymentDetails: null
  //       });
        
  //       toast.error(error.response?.data?.message || 'Payment verification failed');
  //     }
  //   };

  //   // If there's an error message in URL params, show it immediately
  //   if (errorMessage) {
  //     setVerificationState({
  //       isLoading: false,
  //       error: errorMessage,
  //       isVerified: false,
  //       paymentDetails: null
  //     });
  //     toast.error(errorMessage);
  //     return;
  //   }

  //   verifyPayment();

  //   // Timeout fallback
  //   const timer = setTimeout(() => {
  //     if (verificationState.isLoading) {
  //       setVerificationState({
  //         isLoading: false,
  //         error: 'Verification timed out',
  //         isVerified: false,
  //         paymentDetails: null
  //       });
  //       toast.error('Payment verification timed out');
  //     }
  //   }, 15000); // 15 second timeout

  //   return () => clearTimeout(timer);
  // }, [status, txRef, transactionId, token, profile, errorMessage]);

useEffect(() => {
  const verifyPayment = async () => {
    try {
      // Basic parameter validation
      if (!status || !txRef || !transactionId) {
        throw new Error('Missing payment verification parameters');
      }

      // Validate status value from URL (optional)
      const validStatuses = ['successful', 'failed', 'pending'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid payment status');
      }

      // API call to backend for verification
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/wallet/flutterwave/verify`,
        {
          params: { transaction_id: transactionId },
          headers,
        }
      );

      // console.log(response.data);
      

      if (response.data.status === "success") {
        // Refresh user data
        await profile;
        

        // Notify success
        toast.success(response.data.message);

        setVerificationState({
          isLoading: false,
          error: null,
          isVerified: true,
          paymentDetails: {
            ...(response.data.data || {}),
            amount: response.data.amount,
            message: response.data.message
          },
        });
        // navigate("/wallet")
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationState({
        isLoading: false,
        error: error.response?.data?.message || error.message,
        isVerified: false,
        paymentDetails: null,
      });

      toast.error(error.response?.data?.message || 'Payment verification failed');
    }
  };

  // Handle immediate error in query (e.g., ?error=Some+error)
  if (errorMessage) {
    setVerificationState({
      isLoading: false,
      error: errorMessage,
      isVerified: false,
      paymentDetails: null,
    });
    toast.error(errorMessage);
    return;
  }

  verifyPayment();

  // Fallback timeout in case API hangs
  const timer = setTimeout(() => {
    if (verificationState.isLoading) {
      setVerificationState({
        isLoading: false,
        error: 'Verification timed out',
        isVerified: false,
        paymentDetails: null,
      });
      toast.error('Payment verification timed out');
    }
  }, 15000); // 15 seconds

  return () => clearTimeout(timer);
}, [status, txRef, transactionId, token, profile, errorMessage]);


  const getStatusDetails = () => {
    if (verificationState.isLoading) {
      return {
        icon: <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />,
        title: 'Processing Payment',
        message: 'We are verifying your payment details...',
        bgColor: 'bg-blue-50 dark:bg-blue-900/30',
        textColor: 'text-blue-800 dark:text-blue-200'
      };
    }

    if (verificationState.error) {
      return {
        icon: <XCircle className="w-16 h-16 text-red-500" />,
        title: 'Verification Failed',
        message: verificationState.error,
        bgColor: 'bg-red-50 dark:bg-red-900/30',
        textColor: 'text-red-800 dark:text-red-200'
      };
    }

    switch (status) {
      case 'successful':
        return {
          icon: <CheckCircle className="w-16 h-16 text-green-500" />,
          title: 'Payment Successful!',
          message: 'Your wallet has been topped up successfully.',
          bgColor: 'bg-green-50 dark:bg-green-900/30',
          textColor: 'text-green-800 dark:text-green-200'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-16 h-16 text-red-500" />,
          title: 'Payment Failed',
          message: errorMessage || 'The payment could not be completed. Please try again.',
          bgColor: 'bg-red-50 dark:bg-red-900/30',
          textColor: 'text-red-800 dark:text-red-200'
        };
      case 'pending':
        return {
          icon: <Clock className="w-16 h-16 text-yellow-500" />,
          title: 'Payment Pending',
          message: 'Your payment is being processed. Please check back later.',
          bgColor: 'bg-yellow-50 dark:bg-yellow-900/30',
          textColor: 'text-yellow-800 dark:text-yellow-200'
        };
      default:
        return {
          icon: <AlertCircle className="w-16 h-16 text-gray-500" />,
          title: 'Payment Status Unknown',
          message: 'We could not determine the payment status. Please check your transaction history.',
          bgColor: 'bg-gray-50 dark:bg-gray-800',
          textColor: 'text-gray-800 dark:text-gray-200'
        };
    }
  };

  const statusDetails = getStatusDetails();

  if (!verificationState.isVerified && !verificationState.error) {
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <button
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Wallet
        </button>

        <div className={`${statusDetails.bgColor} rounded-xl p-8 text-center`}>
          <div className="flex justify-center mb-6">
            {statusDetails.icon}
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${statusDetails.textColor}`}>
            {statusDetails.title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {statusDetails.message}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Transaction Details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`font-medium capitalize ${statusDetails.textColor}`}>
                {status || 'processing'}
              </span>
            </div>
            {txRef && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Reference:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {txRef}
                </span>
              </div>
            )}
            {transactionId && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {transactionId}
                </span>
              </div>
            )}
            {verificationState.paymentDetails?.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Intl.NumberFormat('en-NG', {
                    style: 'currency',
                    currency: verificationState.paymentDetails?.currency || 'NGN'
                  }).format(verificationState.paymentDetails.amount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}