// src/components/BookOrderModal.jsx
import { Dialog } from '@headlessui/react';
import { X, ShoppingCart } from 'lucide-react';
import { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

export default function BookOrderModal({ isOpen, onClose }) {
  const { token, user } = useContext(AuthContext);
  const [details, setDetails] = useState({ items: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(
        'http://localhost:3550/api/orders',
        { ...details },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          <ShoppingCart className="inline-block w-6 h-6 mr-2 text-green-500" />
          Book an Order
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Items (e.g. Shirts, Pants)</label>
            <input
              type="text"
              name="items"
              value={details.items}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
            <textarea
              name="notes"
              value={details.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300 bg-gray-100 dark:bg-gray-700"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            {loading ? 'Booking...' : 'Book Now'}
          </button>
        </form>
      </div>
    </Dialog>
  );
}
