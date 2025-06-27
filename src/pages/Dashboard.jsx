import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';
import { LogOut, Wallet, BadgePercent, Shirt, Bell, Plus, X, Check } from 'lucide-react';
// import { Settings } from '@mui/icons-material';
      import { faCoffee } from '@fortawesome/free-solid-svg-icons';
      import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

export default function CustomerDashboard() {
  const {profile} = useContext(ProfileContext)
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch orders on component mount
  useEffect(() => {
    if (!user || !token || user.role !== "user") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate('/signin');
    } else {
      fetchOrders();
    }
  }, [user, token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:3550/api/orders/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(Array.isArray(res.data.orders) ? res.data.orders : []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status === activeTab;
  });

  const orderCount = orders.length;
  const unreadNotifications = user?.notifications?.filter(n => !n.seen).length || 0;

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}>
        {status}
      </span>
    );
  };

  // Cancel order function
  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(`http://localhost:3550/api/orders/${orderId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders(); // Refresh orders
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    }
  };

  // Reorder function
  const reorder = (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (order) {
      navigate('/book', { state: { services: order.services } });
    }
  };

  // Mark notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.patch('http://localhost:3550/api/notifications/mark-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // In a real app, you would update the user context or refetch user data
      setShowNotifications(false);
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  // Calculate loyalty level
  const calculateLoyaltyLevel = (points) => {
    if (points >= 1000) return 'Gold';
    if (points >= 500) return 'Silver';
    return 'Bronze';
  };

  // View order details
  const viewOrderDetails = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Customer Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-4 top-16 w-72 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700">
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-medium">Notifications</h3>
                <button 
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Mark all as read
                </button>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {user?.notifications?.length > 0 ? (
                  user.notifications.map((notification, index) => (
                    <div 
                      key={index}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 ${!notification.seen ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
            </div>
          )}

          {/* <button
            onClick={() => logout().then(() => navigate('/signin'))}
            className="flex items-center gap-1 text-red-600 hover:text-red-800 dark:hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Wallet Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4">
            <Wallet className="w-10 h-10 text-blue-500" />
            <div className="flex-1">
              <h2 className="text-gray-600 dark:text-gray-300">Wallet Balance</h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
               ₦{profile?.walletBalance?.toLocaleString() ?? '0'}
                {/* <p className="text-xs text-gray-500 dark:text-gray-400">
                        ₦{profile?.walletBalance?.toLocaleString() ?? '0'} */}
              </p>
            </div>
            <button 
              onClick={() => navigate('/wallet/topup')}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Top Up
            </button>
          </div>

          {/* Loyalty Points Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4">
            <BadgePercent className="w-10 h-10 text-green-500" />
            <div>
              <h2 className="text-gray-600 dark:text-gray-300">Loyalty Points</h2>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                {user?.loyaltyPoints ?? 0} pts
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {calculateLoyaltyLevel(user?.loyaltyPoints)} Level
              </p>
            </div>
          </div>

          {/* Orders Card */}
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

        {/* Quick Service Booking */}
        <section className="mt-8">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-4">
            Quick Book Service
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Wash', 'Iron', 'Dry Clean', 'Fold', 'Stain Removal', 'Other'].map((service) => (
              <button
                key={service}
                onClick={() => navigate(`/book?service=${service.toLowerCase().replace(' ', '-')}`)}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <Shirt className="w-6 h-6 mb-2 text-indigo-500" />
                <span className="text-sm">{service}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Orders Section */}
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
              My Orders
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 text-sm rounded ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
              >
                All
              </button>
              {['pending', 'processing', 'completed', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`px-3 py-1 text-sm rounded capitalize ${activeTab === status ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-auto rounded-lg shadow">
              <table className="min-w-full text-sm bg-white dark:bg-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Services</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Total</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-6 text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.slice(0, 5).map((order) => (
                      <tr
                        key={order._id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => viewOrderDetails(order._id)}
                      >
                        <td className="p-3">#{order._id.slice(-6)}</td>
                        <td className="p-3">
                          {order.services.slice(0, 2).map(s => s.name).join(', ')}
                          {order.services.length > 2 && '...'}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="p-3">₦{order.totalAmount?.toFixed(2) ?? 0}</td>
                        <td className="p-3">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 space-x-2">
                          {order.status === 'pending' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelOrder(order._id);
                              }}
                              className="text-xs text-red-600 hover:underline flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Cancel
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              reorder(order._id);
                            }}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" /> Reorder
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}