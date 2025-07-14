import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';
import { 
  User, Mail, Phone, Wallet, CreditCard, 
  Lock, Loader2, CheckCircle, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserSettings() {//localhost
  const navigate = useNavigate()
  const { user, token } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    }
  });

  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/wallet/balance`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setWalletBalance(response.data.data.balance);
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        toast.error('Failed to load wallet balance');
      }
    };

    if (token && activeTab === 'wallet') {
      fetchWalletBalance();
    }
  }, [token, activeTab]);

  // Update profile
  const onSubmit = async (data) => {
    try {
      setIsUpdating(true);
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/users/update-profile`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await profile(); // Refresh user data
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle wallet top-up
  const handleTopUp = async () => {
    try {
      const amount = parseFloat(topUpAmount);
      if (isNaN(amount)) {
        toast.error('Please enter a valid amount');
        return;
      }

      if (amount < 100) {
        toast.error('Minimum top-up amount is ₦100');
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/wallet/flutterwave/initiate`,
        { amount, paymentMethod: 'card' },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.link) {
        window.location.href = response.data.link;
      } else {
        throw new Error('Failed to get payment link');
      }
    } catch (error) {
      console.error('Top-up error:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount).replace('NGN', '₦');//wallet
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">User Settings</h1>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-medium ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 font-medium ${activeTab === 'wallet' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Wallet
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 font-medium ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="w-5 h-5" /> Profile Information
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    readOnly
                    id="fullName"
                    type="text"
                    {...register('fullName', { required: 'Full name is required' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                  />
                  <User className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    readOnly
                    id="email"
                    type="email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                  />
                  <Mail className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    readOnly
                    placeholder={profile?.phoneNumber}
                    id="phoneNumber"
                    type="tel"
                    {...register('phoneNumber', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{11}$/,
                        message: 'Invalid phone number (must be 11 digits)'
                      }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white pl-10"
                  />
                  <Phone className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                onClick={()=>{navigate("/profile")}}
                  // type="submit"
                  // disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                 click here to edit to your profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                <Wallet className="w-5 h-5" /> Wallet Management
              </h2>
            </div>

            <div className="p-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-gray-600 dark:text-gray-300 text-sm mb-1">Current Balance</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(walletBalance)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => navigate("/wallet")}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <CreditCard className="w-5 h-5" />
                  Top Up Wallet
                </button>

                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Transactions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    View your transaction history to track all wallet activities.
                  </p>
                  <button
                    onClick={() => navigate('/wallet')}
                    className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View Transaction History →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
              <Lock className="w-5 h-5" /> Security Settings
            </h2>
            
            <div className="space-y-6">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Change Password</h3>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Change Password
                </button>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Enable 2FA
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Active Sessions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Manage devices that are logged into your account
                </p>
                <button className="px-4 py-2 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20">
                  Log Out All Devices
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Up Modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-md animate-in fade-in-zoom">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Up Wallet</h2>
                  <button
                    onClick={() => setShowTopUpModal(false)}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

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
                      min="100"
                      step="100"
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
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowTopUpModal(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTopUp}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                    disabled={!topUpAmount || parseFloat(topUpAmount) < 100}
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}