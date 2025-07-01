import { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import StatsCard from '../../components/StatsCard';
import RecentOrdersTable from '../../components/RecentOrdersTable';
import RevenueChart from '../../components/RevenueChart';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    // Initial data fetch
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data));

    fetch('/api/admin/orders?limit=5')
      .then(res => res.json())
      .then(data => setRecentOrders(data));

    // Real-time updates
    socket.on('order_update', (order) => {
      setRecentOrders(prev => [order, ...prev.slice(0, 4)]);
    });

    return () => socket.off('order_update');
  }, []);

  if (!stats) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders} 
          trend={stats.orderTrend} 
          icon={<ClipboardListIcon className="h-6 w-6" />}
        />
        <StatsCard 
          title="Revenue (Monthly)" 
          value={`₦${stats.monthlyRevenue.toLocaleString()}`} 
          trend={stats.revenueTrend}
          icon={<CurrencyDollarIcon className="h-6 w-6" />}
        />
        <StatsCard 
          title="Active Users" 
          value={stats.activeUsers} 
          icon={<UsersIcon className="h-6 w-6" />}
        />
        <StatsCard 
          title="Low Stock Items" 
          value={stats.lowStockCount} 
          isUrgent={stats.lowStockCount > 0}
          icon={<ExclamationIcon className="h-6 w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Revenue (Last 6 Months)</h2>
          <RevenueChart data={stats.revenueData} />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <RecentOrdersTable orders={recentOrders} />
        </div>
      </div>
    </div>
  );
}