// src/components/AddBalanceModal.jsx
import { Dialog } from '@headlessui/react';
import { X, CreditCard } from 'lucide-react';
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function AddBalanceModal({ isOpen, onClose }) {
  const { token, user, login } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:3550/api/wallet/add',
        { amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // update user in context with new balance
      const updatedUser = { ...user, walletBalance: res.data.newBalance };
      login(updatedUser, token);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add balance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          <CreditCard className="inline-block w-6 h-6 mr-2 text-blue-500" />
          Add Balance
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Amount (₦)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>
      </div>
    </Dialog>
  );
}

