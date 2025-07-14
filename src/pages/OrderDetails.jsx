import { useParams } from 'react-router-dom';
import { Shirt, Clock, Check, X, Truck, MapPin, Calendar, CreditCard, Loader2, Wallet } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from '../contexts/AuthContext';

const statusStages = [
  { id: 'pending', name: 'Order Received', icon: <Clock className="w-5 h-5" /> },
  { id: 'processing', name: 'Processing', icon: <Shirt className="w-5 h-5" /> },
  { id: 'completed', name: 'Completed', icon: <Check className="w-5 h-5" /> },
  { id: 'delivered', name: 'Delivered', icon: <Truck className="w-5 h-5" /> },
  { id: 'cancelled', name: 'Cancelled', icon: <X className="w-5 h-5" /> }
];

export default function OrderDetails() {
  const { token} = useContext(AuthContext)//wallet
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {//localhost
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setOrder(response.data.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
        toast.error(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Order</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Order Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusStages.findIndex(stage => stage.id === order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h1>
          <p className="text-gray-600 dark:text-gray-300">Order #{order._id}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Status</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div 
                className="absolute left-4 top-0 h-full w-0.5 bg-blue-500" 
                style={{ 
                  height: currentStatusIndex >= 0 
                    ? `${((currentStatusIndex + 0.5) / (statusStages.length - 1)) * 100}%` 
                    : '0%' 
                }}
              ></div>
              
              <ul className="space-y-8">
                {statusStages.map((stage, index) => {
                  const isCompleted = index < currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  
                  return (
                    <li key={stage.id} className="relative">
                      <div className={`absolute left-4 top-4 flex items-center justify-center w-6 h-6 rounded-full ${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isCurrent 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {stage.icon}
                      </div>
                      <div className="ml-12">
                        <h3 className={`text-sm font-medium ${
                          isCompleted || isCurrent
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {stage.name}
                        </h3>
                        {(isCompleted || isCurrent) && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {order.statusHistory?.find(h => h.status === stage.id)?.date || 
                              (isCurrent ? 'In progress' : '')}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          {order.trackingNumber && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tracking Information</h2>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium">Tracking Number: {order.trackingNumber}</p>
                    {order.status === 'delivered' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Delivered on {new Date(order.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                {order.services.map((service, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.quantity} {service.quantity > 1 ? 'items' : 'item'}
                      </p>
                    </div>
                    <p className="font-medium">₦{(service.pricePerUnit * service.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                  <span>₦{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                  <span>₦0.00</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Discount</span>
                    <span className="text-green-600 dark:text-green-400">-₦{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Total</span>
                  <span>₦{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delivery Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Address</h3>
                  <div className="mt-1 flex items-start">
                    <MapPin className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Date</h3>
                  <div className="mt-1 flex items-start">
                    <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-900 dark:text-white">
                      {order.deliveryDate 
                        ? new Date(order.deliveryDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'To be scheduled'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</h3>
                  <div className="mt-1 flex items-start">
                    {order.paymentMethod === 'card' ? (
                      <CreditCard className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    ) : order.paymentMethod === 'wallet' ? (
                      <Wallet className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    ) : (
                      <Truck className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    )}
                    <p className="text-gray-900 dark:text-white capitalize">
                      {order.paymentMethod === 'card' ? 'Credit Card' : 
                       order.paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                    {order.isPaid ? 'Payment completed' : 'Payment pending'}
                  </p>
                </div>
                
                {order.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Special Instructions</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 flex flex-col sm:flex-row gap-3">
              <button
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reorder These Items
              </button>
              {order.status === 'pending' && (
                <button
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}