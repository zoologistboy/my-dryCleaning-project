// src/pages/admin/OrdersPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DataTable from '../../components/DataTable';
// import OrderStatusFilter from '../../components/orders/StatusFilter';
import { Search, Filter, Download } from 'lucide-react';

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '30days',
    search: ''
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const query = new URLSearchParams(filters).toString();
        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/orders?${query}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters, token]);

  const handleStatusChange = async (orderId, newStatus) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    // Refresh orders after update
    setFilters({...filters});
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex gap-4 p-4 bg-white rounded-lg shadow">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>
        {/* <OrderStatusFilter 
          value={filters.status}
          onChange={(status) => setFilters({...filters, status})}
        /> */}
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <Filter className="w-4 h-4" />
          Date Range
        </button>
      </div>

      <DataTable
        headers={['ID', 'Customer', 'Date', 'Amount', 'Status', 'Actions']}
        data={orders.map(order => ({
          id: order._id.slice(-6).toUpperCase(),
          customer: order.user?.name,
          date: new Date(order.createdAt).toLocaleDateString(),
          amount: `₦${order.totalAmount.toLocaleString()}`,
          status: order.status,
          rawData: order
        }))}
        renderActions={(order) => (
          <div className="flex gap-2">
            <select
              value={order.rawData.status}
              onChange={(e) => handleStatusChange(order.rawData._id, e.target.value)}
              className="text-xs border rounded p-1"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button 
              onClick={() => window.location.href = `/admin/orders/${order.rawData._id}`}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              View
            </button>
          </div>
        )}
      />
    </div>
  );
}