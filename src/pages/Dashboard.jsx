import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';
import { 
  LogOut, Wallet, BadgePercent, Shirt, Bell, Plus, X, Check, 
  Calendar, Clock, AlertCircle, Truck, Home, CreditCard, User, Settings 
} from 'lucide-react';
import axios from 'axios';
import dryCleanIllustration from '../assets/illustration.webp';
import laundryBasket from '../assets/images.jpg';
import service1 from '../assets/images.jpg';
import service2 from '../assets/hanged.jpg';
import service3 from '../assets/ironed.jpg';
import service4 from '../assets/ironedBest.jpg';
import service5 from '../assets/otherservices.jpg';
import service6 from '../assets/folded.jpg';

export default function CustomerDashboard() {
  const { profile } = useContext(ProfileContext);
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const notificationRef = useRef(null)

  const handleClickOutside = (event) => {
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Service images mapping
  const serviceImages = {
    'Wash': service1,
    'Iron': service2,
    'Dry Clean': service3,
    'Fold': service4,
    'Stain Removal': service5,
    'Other': service6
  };

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

    const statusIcons = {
      pending: <Clock className="w-3 h-3" />,
      processing: <Settings className="w-3 h-3" />,
      completed: <Check className="w-3 h-3" />,
      cancelled: <X className="w-3 h-3" />,
      delivered: <Truck className="w-3 h-3" />
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize flex items-center gap-1 ${statusColors[status]}`}>
        {statusIcons[status]}
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

  // Format date
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:block w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
          <img src={laundryBasket} alt="Logo" className="h-10 mr-2" />
          {/* <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DryCleanPro</h1> */}
        </div>

        {/* DryCleanPro */}
        {/* welcome back */}
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/orders')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Shirt className="w-5 h-5" />
                <span>My Orders</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/wallet')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => navigate('/schedule')}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Pickup</span>
              </button>
            </li>
          </ul>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <BadgePercent className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Loyalty Status</p>
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  {calculateLoyaltyLevel(user?.loyaltyPoints)} Member
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full" 
                style={{ width: `${Math.min(100, (user?.loyaltyPoints || 0) / 10)}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1 text-right text-gray-500 dark:text-gray-300">
              {user?.loyaltyPoints || 0} / 1000 pts
            </p>
          </div>
        </nav>
      </aside>

      {/* Mobile sidebar backdrop */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-md z-50 transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <img src={laundryBasket} alt="Logo" className="h-10 mr-2" />
            <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DryCleanPro</h1>
          </div>
          <button onClick={() => setShowMobileMenu(false)} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => {
                  navigate('/dashboard');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  navigate('/orders');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Shirt className="w-5 h-5" />
                <span>My Orders</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  navigate('/wallet');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Wallet className="w-5 h-5" />
                <span>Wallet</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  navigate('/profile');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  navigate('/schedule');
                  setShowMobileMenu(false);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Calendar className="w-5 h-5" />
                <span>Schedule Pickup</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setShowMobileMenu(true)}
              className="md:hidden mr-4 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            {/* <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Welcome back, {user?.firstName || 'Customer'}!
            </h1> */}
          </div>

          {/* DryCleanPro */}
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
          <div ref={notificationRef}>
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
                {/* Dropdown content */}
              </div>
            )}
          </div>
          </div>

            {/* <div className="relative">
              <button 
                className="flex items-center space-x-2 focus:outline-none"
                onClick={() => navigate('/profile')}
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <span className="hidden md:inline">{user?.firstName}</span>
              </button>
            </div> */}
          </div>

          {/* Notifications dropdown */}
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
                  user.notifications.slice(0, 5).map((notification, index) => (
                    <div 
                      key={index}
                      className={`p-3 border-b border-gray-100 dark:border-gray-700 ${!notification.seen ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1 rounded-full ${!notification.seen ? 'bg-blue-100 dark:bg-blue-900' : 'bg-gray-100 dark:bg-gray-600'}`}>
                          {notification.type === 'order' ? (
                            <Shirt className="w-4 h-4" />
                          ) : notification.type === 'payment' ? (
                            <CreditCard className="w-4 h-4" />
                          ) : (
                            <AlertCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
              {user?.notifications?.length > 5 && (
                <div className="p-2 text-center border-t border-gray-200 dark:border-gray-700">
                  <button 
                    onClick={() => navigate('/notifications')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-6 text-white mb-6 relative overflow-hidden">
            <div className="relative z-10 max-w-lg">
              <h2 className="text-2xl font-bold mb-2">Need your clothes cleaned?</h2>
              <p className="mb-4">Schedule a pickup and we'll handle the rest. Fast, reliable, and professional dry cleaning services.</p>
              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={() => navigate('/book')}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Order
                </button>
                <button 
                  onClick={() => navigate('/schedule')}
                  className="px-4 py-2 bg-transparent border border-white rounded-lg font-medium hover:bg-blue-600"
                >
                  Schedule Pickup
                </button>
              </div>
            </div>
            <img 
              src={dryCleanIllustration} 
              alt="Dry cleaning service" 
              className="absolute right-0 top-0 h-full object-cover opacity-20 md:opacity-40" 
            />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Wallet Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-gray-600 dark:text-gray-300 text-sm">Wallet Balance</h2>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  ₦{profile?.walletBalance?.toLocaleString() ?? '0'}
                </p>
              </div>
              <button 
                onClick={() => navigate('/wallet/topup')}
                className="p-2 bg-blue-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-gray-600"
                title="Top Up"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Loyalty Points Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <BadgePercent className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <h2 className="text-gray-600 dark:text-gray-300 text-sm">Loyalty Points</h2>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {user?.loyaltyPoints ?? 0} pts
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {calculateLoyaltyLevel(user?.loyaltyPoints)} Level
                </p>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-full">
                <Shirt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-gray-600 dark:text-gray-300 text-sm">Total Orders</h2>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {orderCount}
                </p>
              </div>
            </div>

            {/* Next Pickup Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <Truck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-gray-600 dark:text-gray-300 text-sm">Next Pickup</h2>
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  {orders.find(o => o.status === 'processing') ? 'Scheduled' : 'None'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Service Booking */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                Quick Book Service
              </h3>
              <button 
                onClick={() => navigate('/book')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View all services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['Wash', 'Iron', 'Dry Clean', 'Fold', 'Stain Removal', 'Other'].map((service) => (
                <button
                  key={service}
                  onClick={() => navigate(`/book?service=${service.toLowerCase().replace(' ', '-')}`)}
                  className="group relative overflow-hidden rounded-lg shadow hover:shadow-md transition-all"
                >
                  <img 
                    src={serviceImages[service]} 
                    alt={service} 
                    className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white text-sm font-medium">
                    {service}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Orders Section */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-white">
                Recent Orders
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 text-sm rounded-full ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                  All
                </button>
                {['pending', 'processing', 'completed', 'delivered'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveTab(status)}
                    className={`px-3 py-1 text-sm rounded-full capitalize ${activeTab === status ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
                {filteredOrders.length === 0 ? (
                  <div className="text-center p-8">
                    <Shirt className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activeTab === 'all' ? 
                        "You haven't placed any orders yet." : 
                        `You don't have any ${activeTab} orders.`}
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => navigate('/book')}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" />
                        New Order
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Order
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Items
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Total
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredOrders.slice(0, 5).map((order) => (
                          <tr 
                            key={order._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                            onClick={() => viewOrderDetails(order._id)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                #{order._id.slice(-6).toUpperCase()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {order.services.slice(0, 2).map(s => s.name).join(', ')}
                                {order.services.length > 2 && ` +${order.services.length - 2} more`}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <StatusBadge status={order.status} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              ₦{order.totalAmount?.toFixed(2) ?? 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                              {formatDate(order.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                {order.status === 'pending' && (
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cancelOrder(order._id);
                                    }}
                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400 flex items-center gap-1 text-xs"
                                  >
                                    <X className="w-3 h-3" /> Cancel
                                  </button>
                                )}
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    reorder(order._id);
                                  }}
                                  className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 flex items-center gap-1 text-xs"
                                >
                                  <Check className="w-3 h-3" /> Reorder
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filteredOrders.length > 5 && (
                      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-right">
                        <button 
                          onClick={() => navigate('/orders')}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          View all orders →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}