// src/pages/dashboard/CustomerDashboard.jsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, Wallet, BadgePercent, Shirt } from 'lucide-react'; // replaced Hanger with Shirt
import axios from 'axios';

export default function CustomerDashboard() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user || !token || user.role !== "user") {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      navigate('/signin');
    } else {
      axios
        .get('http://localhost:3550/api/orders/mine', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data.orders;
          setOrders(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error('Error fetching orders:', err);
          setOrders([]);
        });
    }
  }, [user, token, navigate]);

  const orderCount = Array.isArray(orders) ? orders.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Customer Dashboard
        </h1>
        
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4">
            <Wallet className="w-10 h-10 text-blue-500" />
            <div>
              <h2 className="text-gray-600 dark:text-gray-300">Wallet Balance</h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ₦{user?.walletBalance ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4">
            <BadgePercent className="w-10 h-10 text-green-500" />
            <div>
              <h2 className="text-gray-600 dark:text-gray-300">Loyalty Points</h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {user?.loyaltyPoints ?? 0} pts
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4">
            <Shirt className="w-10 h-10 text-indigo-500" />
            <div>
              <h2 className="text-gray-600 dark:text-gray-300">Total Orders</h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {orderCount}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Recent Orders
          </h3>
          <div className="overflow-auto rounded-lg shadow">
            <table className="min-w-full text-sm bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="text-left p-3">Order ID</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {orderCount === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center p-6 text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-3">#{order._id.slice(-6)}</td>
                      <td className="p-3 capitalize">{order.status}</td>
                      <td className="p-3">₦{order.total ?? 0}</td>
                      <td className="p-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
