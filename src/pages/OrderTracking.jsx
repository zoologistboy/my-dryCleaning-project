import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Package,
  CheckCircle,
  Clock,
  RefreshCw,
  Truck,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

const statusStages = [
  { id: 'pending', label: 'Pending', icon: <Clock className="w-5 h-5" /> },
  { id: 'processing', label: 'Processing', icon: <RefreshCw className="w-5 h-5" /> },
  { id: 'in-progress', label: 'In Progress', icon: <Truck className="w-5 h-5" /> },
  { id: 'completed', label: 'Completed', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-5 h-5" /> }
];

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:3550/api/orders/${orderId}`);
        console.log(response.data.data);
        
        setOrder(response.data.data);
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Order not found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  const currentStatusIndex = statusStages.findIndex(stage => stage.id === order.status);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <Package className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order #{order._id}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Order Status
              </h2>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                
                <div className="space-y-6">
                  {statusStages.map((stage, index) => {
                    const isCompleted = index < currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const isPending = index > currentStatusIndex;
                    
                    return (
                      <div key={stage.id} className="relative flex items-start">
                        <div className={`absolute left-4 top-5 -ml-0.5 w-0.5 h-12 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                        }`}></div>
                        
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          isCompleted 
                            ? 'bg-green-500 text-white' 
                            : isCurrent 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-300'
                        }`}>
                          {React.cloneElement(stage.icon, { className: 'w-4 h-4' })}
                        </div>
                        
                        <div className="ml-4">
                          <h3 className={`text-sm font-medium ${
                            isCompleted || isCurrent
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {stage.label}
                          </h3>
                          {isCurrent && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              Your order is currently being {stage.id.replace('-', ' ')}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Order Details
              </h2>

              <div className="space-y-4">
                {order.services.map((service, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-900 dark:text-white font-medium">{service.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-900 dark:text-white">
                        ₦{service.pricePerUnit * service.quantity}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.quantity} × ₦{service.pricePerUnit}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <div className="flex justify-between">
                  <p className="text-gray-600 dark:text-gray-300">Subtotal</p>
                  <p className="text-gray-900 dark:text-white">₦{order.totalAmount}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <p className="text-gray-600 dark:text-gray-300">Delivery</p>
                  <p className="text-gray-900 dark:text-white">₦0</p>
                </div>
                <div className="flex justify-between mt-4 font-bold text-lg">
                  <p className="text-gray-900 dark:text-white">Total</p>
                  <p className="text-gray-900 dark:text-white">₦{order.totalAmount}</p>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Delivery Address
                  </h3>
                  <p className="text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Estimated Delivery
                  </h3>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(order.deliveryDate).toLocaleDateString()} • {order.deliveryTime}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Payment Method
                  </h3>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {order.paymentMethod === 'card' ? 'Credit Card' : 
                     order.paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {order.isPaid ? 'Paid' : 'Payment on delivery'}
                  </p>
                </div>

                {order.notes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Special Instructions
                    </h3>
                    <p className="text-gray-900 dark:text-white">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}