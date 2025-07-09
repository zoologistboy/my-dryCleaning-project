import { CheckCircle, Clock, MapPin, Wallet, CreditCard, Truck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const paymentIcons = {
  wallet: <Wallet className="w-5 h-5" />,
  card: <CreditCard className="w-5 h-5" />,
  cash: <Truck className="w-5 h-5" />
};

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/book-service');
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col items-center text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Order Confirmed!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Your order has been placed successfully
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Order ID: #{order._id}
              </p>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                {order.services.map((service, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-gray-900 dark:text-white">{service.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.quantity} × ₦{service.pricePerUnit}
                      </p>
                    </div>
                    <p className="text-gray-900 dark:text-white">
                      ₦{service.pricePerUnit * service.quantity}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
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

            <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Time</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(order.deliveryDate).toLocaleDateString()} • {order.deliveryTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Address</p>
                    <p className="text-gray-900 dark:text-white">{order.deliveryAddress}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex items-center justify-center">
                    {paymentIcons[order.paymentMethod]}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="text-gray-900 dark:text-white capitalize">
                      {order.paymentMethod === 'card' ? 'Credit Card' : 
                       order.paymentMethod === 'wallet' ? 'Wallet' : 'Cash on Delivery'}
                    </p>
                    {order.paymentMethod === 'wallet' && user && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Remaining balance: ₦{(user.walletBalance - order.totalAmount).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={() => navigate('/orders')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                View My Orders
              </button>
              <button
                onClick={() => navigate('/book-service')}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md transition-colors"
              >
                Place Another Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}