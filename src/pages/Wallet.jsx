import { useState, useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
// import { useAuth } from '../contexts/AuthContext';
import PaymentConfirmation from '../pages/PaymentConfirmation';
import { 
  Wallet, CreditCard, Clock, Check, X, Plus, ArrowUpRight, 
  ArrowDownLeft, Loader2, AlertCircle, CheckCircle 
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner'; //proceed to payment
// import useWallet from '../components/useWallet';

export default function WalletPage() {
  // const { balance, transactions, loading, pagination, setPagination, fetchWalletData } = useWallet(token);
  const { user, token } = useContext(AuthContext);//successful
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();//You will be redirected to Flutterwave to complete your payment securely.
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  });

  // Check for payment verification status
  useEffect(() => {
    const status = searchParams.get('status');
    const verified = searchParams.get('verified');

    if (status === 'success') {
      toast.success('Payment successful! Wallet topped up');
      fetchWalletData();
    } else if (status === 'failed') {
      toast.error('Payment failed. Please try again');
    }

    if (verified === 'success') {
      toast.success('Payment verified! Wallet topped up');
      fetchWalletData();
    } else if (verified === 'failed') {
      toast.error('Payment verification failed');
    } else if (verified === 'already') {
      toast.info('Payment already processed');
    } else if (verified === 'error') {
      toast.error('Error verifying payment');
    }
  }, [searchParams]);

  useEffect(() => {
  if (!processingPayment) {
    setShowTopUpModal(false);
    setTopUpAmount('');
  }
}, [processingPayment]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true);
           const headers = {
              Authorization: `Bearer ${token}`
            };

      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/wallet/balance`,{headers}),
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/wallet/transactions?page=${pagination.page}&limit=${pagination.limit}`,{headers})
      ]);

      console.log(balanceRes);
      console.log(transactionsRes);
      
      

      setBalance(balanceRes.data.data.balance);
      setTransactions(transactionsRes.data.data);
      setPagination(prev => ({
        ...prev,
        total: transactionsRes.data.meta.total,
        hasMore: transactionsRes.data.meta.hasMore
      }));
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, [pagination.page, token]);

  // Handle top up submission
 const handleTopUp = async (e) => {
  e.preventDefault();
  try {
    const amount = parseFloat(topUpAmount);
    
    // Validation
    if (isNaN(amount) || amount < 100) {
      toast.error('Amount must be at least ₦100');
      return;
    }

    setProcessingPayment(true);
    
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/wallet/flutterwave/initiate`,
      { amount, paymentMethod: 'card' },
      { headers }
    );
    console.log(response.data.link);
    window.location.href = response.data.link;

    // if (response.data === "success") {
    //   window.location.href = response.data.link;
    // } else {
    //   throw new Error(response.data.message || 'Failed to get payment link');
    // }

  } catch (error) {
    console.error('Top up error:', error);
    setProcessingPayment(false);
    
    toast.error(
      error.response?.data?.message || 
      error.message || 
      'Failed to initiate payment'
    );
    
    // Log detailed error in development
    if (import.meta.env.DEV) {
      console.log('Full error details:', {
        config: error.config,
        response: error.response
      });
    }
  }
};

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount).replace('NGN', '₦');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Transaction icon based on type
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'topup':
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case 'payment':
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case 'refund':
        return <ArrowDownLeft className="w-5 h-5 text-blue-500" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-500" />;
    }
  };

  // Transaction status badge
  const TransactionStatus = ({ status }) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallet</h1>
          <button
            onClick={() => setShowTopUpModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={processingPayment}
          >
            {processingPayment ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Top Up
              </>
            )}
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-600 dark:text-gray-300 text-sm mb-1">Current Balance</h2>
              {loading ? (
                <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(balance)}
                </p>
              )}
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Top Up Modal */}
        {/* {showTopUpModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Up Wallet</h2>
                  <button
                    onClick={() => {
                      setShowTopUpModal(false);
                      setProcessingPayment(false);
                    }}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleTopUp}>
                  <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount (₦)
                    </label>
                    <input
                      type="number"
                      id="amount"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter amount"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        You will be redirected to Flutterwave to complete your payment securely.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTopUpModal(false);
                        setProcessingPayment(false);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      disabled={processingPayment}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2"
                      disabled={processingPayment}
                    >
                      {processingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Proceed to Payment
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )} */}
        {showTopUpModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md animate-in fade-in-zoom">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Up Wallet</h2>
          <button
            onClick={() => !processingPayment && setShowTopUpModal(false)}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
            disabled={processingPayment}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleTopUp}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (₦)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                ₦
              </span>
              <input
                type="number"
                id="amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
                min="100" // Minimum top-up amount
                step="100" // Increment by 100 Naira
                required
                disabled={processingPayment}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Minimum amount: ₦100
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 dark:text-gray-300">
                You will be redirected to Flutterwave to complete your payment securely.
                {processingPayment && (
                  <span className="block mt-1 text-blue-600 dark:text-blue-400">
                    Redirecting to payment gateway...
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowTopUpModal(false)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
              disabled={processingPayment}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={processingPayment || !topUpAmount}
            >
              {processingPayment ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Proceed to Payment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
)}

        {/* Transactions Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h2>
          </div>

          {loading ? (
            <div className="p-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-6 text-center">
              <Wallet className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions yet</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <div 
                  key={transaction._id} 
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(`/transactions/${transaction._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {transaction.type === 'topup' ? 'Wallet Top Up' : transaction.type}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${transaction.type === 'topup' || transaction.type === 'refund' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {transaction.type === 'topup' || transaction.type === 'refund' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </p>
                      <div className="mt-1 flex justify-end">
                        <TransactionStatus status={transaction.status} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {pagination.hasMore && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Load more transactions
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}