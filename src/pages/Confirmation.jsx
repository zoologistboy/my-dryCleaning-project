import { CheckCircle, Truck, Clock, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Confirmation() {
  
  // In a real app, you would get this data from location state or API
  const order = {
    id: 'ORD-12345',
    date: new Date(),
    deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    items: [
      { name: 'Wash & Fold', quantity: '5kg', price: 25.00 },
      { name: 'Ironing', quantity: '3 items', price: 15.00 }
    ],
    subtotal: 40.00,
    deliveryFee: 5.00,
    total: 45.00,
    address: '123 Main St, Lagos, Nigeria'
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Thank you for your order. We've received it and will process it shortly.
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Order #{order.id} • {order.date.toLocaleDateString()}
            </p>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.quantity}</p>
                  </div>
                  <p className="font-medium">₦{item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal</span>
                <span>₦{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Delivery Fee</span>
                <span>₦{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span>
                <span>₦{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Delivery Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Truck className="flex-shrink-0 h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Expected Delivery</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {order.deliveryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="flex-shrink-0 h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Delivery Address</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {order.address}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="flex-shrink-0 h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Order Status</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Your order is being processed
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="flex-shrink-0 h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">Need Help?</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Call us at +234 800 123 4567 or email support@freshpress.com
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/30">
            <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to="/orders"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 text-center"
              >
                View Order History
              </Link>
              <Link
                to="/book"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                Place Another Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}