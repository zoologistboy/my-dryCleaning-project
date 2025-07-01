import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Clock, Check, X, Truck } from 'lucide-react';

const statusIcons = {
  pending: <Clock className="w-4 h-4 text-yellow-500" />,
  processing: <Shirt className="w-4 h-4 text-blue-500" />,
  completed: <Check className="w-4 h-4 text-green-500" />,
  cancelled: <X className="w-4 h-4 text-red-500" />,
  delivered: <Truck className="w-4 h-4 text-purple-500" />
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // const res = await api.get('/orders');
        // Mock data
        const mockOrders = [
          {
            id: 'ORD-12345',
            date: '2023-06-15',
            items: ['Wash & Fold (5kg)', 'Ironing (3 items)'],
            status: 'delivered',
            total: 45.00,
            tracking: 'DEL-98765'
          },
          {
            id: 'ORD-12344',
            date: '2023-06-10',
            items: ['Dry Clean (2 items)'],
            status: 'completed',
            total: 30.00,
            tracking: 'DEL-98764'
          },
          {
            id: 'ORD-12343',
            date: '2023-06-05',
            items: ['Wash & Fold (3kg)', 'Stain Removal (1 item)'],
            status: 'cancelled',
            total: 28.00,
            tracking: null
          }
        ];
        setOrders(mockOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order History</h1>
          <Link 
            to="/book"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Shirt className="w-4 h-4" />
            New Order
          </Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                All Orders
              </button>
              {['pending', 'processing', 'completed', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setActiveTab(status)}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm capitalize ${
                    activeTab === status
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {status}
                </button>
              ))}
            </nav>
          </div>
          
          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <Shirt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No orders found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {activeTab === 'all' 
                  ? "You haven't placed any orders yet." 
                  : `You don't have any ${activeTab} orders.`}
              </p>
              <div className="mt-6">
                <Link
                  to="/book"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Shirt className="-ml-1 mr-2 h-5 w-5" />
                  Place New Order
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-600">
                            {statusIcons[order.status]}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.items.join(', ')}
                          </p>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          ₦{order.total.toFixed(2)}
                        </p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          order.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : order.status === 'processing'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : order.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : order.status === 'delivered'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {order.status}
                        </span>
                        {order.tracking && (
                          <Link
                            to={`/orders/${order.id}`}
                            className="mt-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Track Order
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}