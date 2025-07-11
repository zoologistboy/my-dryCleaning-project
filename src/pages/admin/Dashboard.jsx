import React, { useContext, useEffect, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { AuthContext } from '../../contexts/AuthContext';
import { ProfileContext } from '../../contexts/ProfileContext';
import StatsCard from '../../components/StatsCard';
import DataTable from '../../components/DataTable';
import RevenueChart from '../../components/RevenueChart';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import DashboardLayout from '../../components/DashboardLayout';
import {
  ShoppingBag, DollarSign, Users, AlertCircle,
  Clock, Settings, Check, X, Truck,
  UserPlus, Package, BarChart2, RefreshCw,
  Star, Box, CreditCard
} from 'lucide-react';

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const [data, setData] = useState({
    stats: null,
    recentOrders: [],
    staffPerformance: null,
    lowStockItems: [],
    recentTransactions: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = {
        'Authorization': `Bearer ${token}`,//active users
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      };

      const endpoints = [
        '/api/admin/stats',
        '/api/admin/orders?limit=5',
        '/api/admin/staff/performance',
        '/api/admin/inventory/low-stock?threshold=5',
        '/api/admin/transactions?limit=5'
      ];

      const responses = await Promise.all(
        endpoints.map(async (url) => {
          const res = await fetch(`${import.meta.env.VITE_BASE_URL}${url}`, {
            headers,
            cache: 'no-store'
          });
          
          
          

          const text = await res.text();
          // console.log(text);
          
          if (!res.ok) {
            throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}\n${text}`);
          }

          try {
            return JSON.parse(text);
          } catch (jsonErr) {
            console.error(`Error parsing JSON from ${url}:`, text);
            throw new Error(`Invalid JSON from ${url}`);
          }
        })
      );

      // ✅ Extract `.data` field from each response
      setData({
        stats: responses[0].data,
        recentOrders: responses[1].data,
        staffPerformance: responses[2].data,
        lowStockItems: responses[3].data,
        recentTransactions: responses[4].data
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [token]);

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    const handlers = {
      'order_update': (order) => {
        setData(prev => ({
          ...prev,
          recentOrders: [order, ...prev.recentOrders.slice(0, 4)]
        }));
      },
      'stats_update': (stats) => {
        setData(prev => ({ ...prev, stats: { ...prev.stats, ...stats } }));
      },
      'inventory_update': (inventory) => {
        setData(prev => ({ ...prev, lowStockItems: inventory }));
      }
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <ErrorAlert message={error} onRetry={fetchAllData} />;

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Business Overview</h1>
          <button
            onClick={fetchAllData}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
          >
            <RefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Orders"
            value={data.stats.totalOrders}
            trend={data.stats.orderTrend}
            icon={<ShoppingBag className="w-5 h-5" />}
          />
          <StatsCard
            title="Monthly Revenue"
            value={`₦${data.stats.monthlyRevenue}`}
            trend={data.stats.revenueTrend}
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Active Users"
            value={data.stats?.totalUsers}
            trend={data.stats.userTrend}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Staff Rating"
            value={`${data.staffPerformance?.avgRating || 0}/5`}
            trend={data.staffPerformance?.trend}
            icon={<Star className="w-5 h-5" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ActionCard
            icon={<Package className="w-6 h-6 text-blue-500" />}
            title="Manage Orders"
            onClick={() => window.location.href = '/admin/orders'}
          />
          <ActionCard
            icon={<Users className="w-6 h-6 text-green-500" />}
            title="Manage Users"
            onClick={() => window.location.href = '/admin/users'}
          />
          <ActionCard
            icon={<UserPlus className="w-6 h-6 text-purple-500" />}
            title="Add Staff"
            onClick={() => window.location.href = '/admin/users/staff'}
          />
          <ActionCard
            icon={<Box className="w-6 h-6 text-orange-500" />}
            title="Restock"
            onClick={() => window.location.href = '/admin/inventory/restock'}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* <RevenueChart
              data={data?.stats?.revenueData}
              title="Revenue Analytics"
            /> */}
            <DataTable
              title="Recent Transactions"
              headers={['Date', 'User', 'Amount', 'Type', 'Status']}
              data={data.recentTransactions.map(tx => ({
                date: new Date(tx.createdAt).toLocaleDateString(),
                user: tx.user?.fullName || 'N/A',
                amount: `₦${tx.amount.toLocaleString()}`,
                type: tx.type,
                status: tx.status,
                rawData: tx
              }))}
              onRowClick={(tx) => window.location.href = `/admin/transactions/${tx.rawData._id}`}
            />
          </div>

          <div className="space-y-6">
            <DataTable
              title="Recent Orders"
              headers={['ID', 'Customer', 'Status', 'Amount']}
              data={data.recentOrders.map(order => ({
                id: order._id.slice(-6).toUpperCase(),
                customer: order.user?.fullName || 'N/A',
                status: order.status,
                amount: `₦${order.totalAmount.toLocaleString()}`,
                rawData: order
              }))}
              statusIcons={{
                pending: <Clock className="w-3 h-3" />,
                processing: <Settings className="w-3 h-3" />,
                completed: <Check className="w-3 h-3" />,
                cancelled: <X className="w-3 h-3" />,
                delivered: <Truck className="w-3 h-3" />
              }}
              onRowClick={(order) => window.location.href = `/admin/orders/${order.rawData._id}`}
            />

            <DataTable
              title="Low Stock Items"
              headers={['Item', 'Stock', 'Threshold']}
              data={data.lowStockItems.map(item => ({
                item: item.name,
                stock: item.currentStock,
                threshold: item.threshold,
                unit: item.unit,
                rawData: item
              }))}
              onRowClick={(item) => window.location.href = `/admin/inventory/${item.rawData._id}`}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const ActionCard = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 p-4 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50"
  >
    {icon}
    <span>{title}</span>
  </button>
);

