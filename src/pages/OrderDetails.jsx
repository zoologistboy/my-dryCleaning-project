import { useParams } from 'react-router-dom';
import { Shirt, Clock, Check, X, Truck, MapPin, Calendar, CreditCard } from 'lucide-react';

const statusStages = [
  { id: 'pending', name: 'Order Received', icon: <Clock className="w-5 h-5" /> },
  { id: 'processing', name: 'Processing', icon: <Shirt className="w-5 h-5" /> },
  { id: 'completed', name: 'Completed', icon: <Check className="w-5 h-5" /> },
  { id: 'delivered', name: 'Delivered', icon: <Truck className="w-5 h-5" /> }
];

export default function OrderDetails() {
  const { id } = useParams();
  
  // In a real app, you would fetch this data based on the order ID
  const order = {
    id: id || 'ORD-12345',
    date: '2023-06-15',
    deliveryDate: '2023-06-17',
    status: 'delivered',
    tracking: 'DEL-98765',
    address: '123 Main St, Lagos, Nigeria',
    paymentMethod: 'card',
    items: [
      { name: 'Wash & Fold', quantity: '5kg', price: 25.00 },
      { name: 'Ironing', quantity: '3 items', price: 15.00 },
      { name: 'Stain Removal', quantity: '1 item', price: 5.00 }
    ],
    subtotal: 45.00,
    deliveryFee: 5.00,
    discount: 0.00,
    total: 50.00,
    specialInstructions: 'Please use hypoallergenic detergent',
    currentStatus: 'delivered',
    statusHistory: [
      { status: 'pending', date: '2023-06-15 10:30 AM' },
      { status: 'processing', date: '2023-06-16 9:15 AM' },
      { status: 'completed', date: '2023-06-17 11:45 AM' },
      { status: 'delivered', date: '2023-06-17 3:20 PM' }
    ]
  };

  const currentStatusIndex = statusStages.findIndex(stage => stage.id === order.currentStatus);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h1>
          <p className="text-gray-600 dark:text-gray-300">Order #{order.id}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Order Status</h2>
            
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              <div 
                className="absolute left-4 top-0 h-full w-0.5 bg-blue-500" 
                style={{ height: `${(currentStatusIndex / (statusStages.length - 1)) * 100}%` }}
              ></div>
              
              <ul className="space-y-8">
                {statusStages.map((stage, index) => (
                  <li key={stage.id} className="relative">
                    <div className={`absolute left-4 top-4 flex items-center justify-center w-6 h-6 rounded-full ${
                      index <= currentStatusIndex
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {stage.icon}
                    </div>
                    <div className="ml-12">
                      <h3 className={`text-sm font-medium ${
                        index <= currentStatusIndex
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {stage.name}
                      </h3>
                      {index <= currentStatusIndex && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {order.statusHistory.find(h => h.status === stage.id)?.date || ''}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {order.tracking && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Tracking Information</h2>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <div className="flex items-center">
                  <Truck className="w-5 h-5 text-blue-500 dark:text-blue-400 mr-3" />
                  <div>
                    <p className="font-medium">Tracking Number: {order.tracking}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Your order was delivered on {new Date(order.deliveryDate).toLocaleDateString()}
                    </p>
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
                {order.items.map((item, index) => (
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
                {order.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Discount</span>
                    <span className="text-green-600 dark:text-green-400">-₦{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-gray-200 dark:border-gray-700 pt-3">
                  <span>Total</span>
                  <span>₦{order.total.toFixed(2)}</span>
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
                    <p className="text-gray-900 dark:text-white">{order.address}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Delivery Date</h3>
                  <div className="mt-1 flex items-start">
                    <Calendar className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-900 dark:text-white">
                      {new Date(order.deliveryDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Method</h3>
                  <div className="mt-1 flex items-start">
                    <CreditCard className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                    <p className="text-gray-900 dark:text-white capitalize">
                      {order.paymentMethod === 'card' ? 'Credit Card' : order.paymentMethod}
                    </p>
                  </div>
                </div>
                
                {order.specialInstructions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Special Instructions</h3>
                    <p className="mt-1 text-gray-900 dark:text-white">{order.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <button
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Reorder These Items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}