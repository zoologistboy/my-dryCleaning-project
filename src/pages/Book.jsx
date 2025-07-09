import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shirt, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Clock, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Wallet,
  Truck,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';

// Service images
import washImg from '../assets/images.jpg';
import ironImg from '../assets/ironedBest.jpg';
import drycleanImg from '../assets/illustration.webp';
import foldImg from '../assets/folded.jpg';
import stainImg from '../assets/ironedBest.jpg';
import otherImg from '../assets/otherservices.jpg';
import { ProfileContext } from '../contexts/ProfileContext'; //toloca

const servicesData = [
  {
    id: 'wash',
    name: 'Wash',
    description: 'Professional washing with premium detergents',
    pricePerUnit: 500,
    image: washImg
  },
  {
    id: 'iron',
    name: 'Iron',
    description: 'Expert ironing for crisp, wrinkle-free clothes',
    pricePerUnit: 450,
    image: ironImg
  },
  {
    id: 'dryclean',
    name: 'Dry Clean',
    description: 'Specialized dry cleaning for delicate fabrics',
    pricePerUnit: 600,
    image: drycleanImg
  },
  {
    id: 'fold',
    name: 'Fold',
    description: 'Neat folding and packaging of your laundry',
    pricePerUnit: 100,
    image: foldImg
  },
  {
    id: 'stain',
    name: 'Stain Removal',
    description: 'Advanced treatment for tough stains',
    pricePerUnit: 1000,
    image: stainImg
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Custom service for special requirements',
    pricePerUnit: 800,
    image: otherImg
  }
];

const timeSlots = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM'
];

const deliveryTypes = [
  { id: 'pickup', name: 'Pickup & Delivery', icon: <Truck className="w-5 h-5" /> },
  { id: 'dropoff', name: 'Drop Off', icon: <MapPin className="w-5 h-5" /> }
];

const paymentMethods = [
  { id: 'wallet', name: 'Wallet', icon: <Wallet className="w-5 h-5" /> },
  { id: 'card', name: 'Credit Card', icon: <CreditCard className="w-5 h-5" /> },
  { id: 'cash', name: 'Cash on Delivery', icon: <Truck className="w-5 h-5" /> }
];

export default function BookService() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); //profile
  const { profile } = useContext(ProfileContext)
  const [selectedServices, setSelectedServices] = useState([]);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [expandedService, setExpandedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quantities, setQuantities] = useState({});

  const toggleService = (service) => {
    if (selectedServices.some(s => s.id === service.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
      setQuantities(prev => {
        const newQuantities = {...prev};
        delete newQuantities[service.id];
        return newQuantities;
      });
    } else {
      setSelectedServices([...selectedServices, service]);
      setQuantities(prev => ({
        ...prev,
        [service.id]: 1
      }));
    }
  };

  const handleQuantityChange = (serviceId, value) => {
    const numValue = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [serviceId]: Math.max(1, numValue)
    }));
  };

  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => {
      const quantity = quantities[service.id] || 1;
      return total + (service.pricePerUnit * quantity);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        services: selectedServices.map(service => ({
          id: service.id,
          name: service.name,
          pricePerUnit: service.pricePerUnit,
          quantity: quantities[service.id] || 1,
          description: service.description
        })),
        deliveryType,
        deliveryAddress: address,
        deliveryDate,
        deliveryTime,
        paymentMethod,
        notes: specialInstructions,
        totalAmount: calculateTotal()
      };

      const response = await axios.post('http://localhost:3550/api/orders', orderData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response);
      

      // Update user wallet balance if payment was from wallet
      if (paymentMethod === 'wallet' && user) {
        const updatedUser = {
          ...user,
          walletBalance: user.walletBalance - calculateTotal()
        };
        profile(updatedUser);
      }

      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data.data._id}`);
    } catch (error) {
      console.error("Order submission error:", error);
      const errorMessage = error.response?.data?.message || 'Failed to place order';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set default delivery date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Book Your Laundry Service</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Professional cleaning at your convenience
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services Selection */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shirt className="w-6 h-6 text-blue-600" />
                  Select Services
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {servicesData.map((service) => (
                    <div 
                      key={service.id}
                      className={`border rounded-lg overflow-hidden transition-all duration-200 ${
                        selectedServices.some(s => s.id === service.id) 
                          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                      }`}
                    >
                      <div className="flex">
                        <div className="w-1/3">
                          <img 
                            src={service.image} 
                            alt={service.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {service.name}
                            </h3>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              ₦{service.pricePerUnit}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
                            className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center"
                          >
                            {expandedService === service.id ? (
                              <>
                                <span>Less details</span>
                                <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                <span>More details</span>
                                <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </button>
                          
                          {expandedService === service.id && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              {service.description}
                            </p>
                          )}
                          
                          {selectedServices.some(s => s.id === service.id) && (
                            <div className="mt-2 flex items-center">
                              <label htmlFor={`quantity-${service.id}`} className="mr-2 text-sm">Quantity:</label>
                              <input
                                type="number"
                                id={`quantity-${service.id}`}
                                min="1"
                                value={quantities[service.id] || 1}
                                onChange={(e) => handleQuantityChange(service.id, e.target.value)}
                                className="w-16 p-1 border rounded text-center"
                              />
                            </div>
                          )}
                          
                          <button
                            type="button"
                            onClick={() => toggleService(service)}
                            className={`mt-3 w-full py-2 px-3 rounded-md text-sm font-medium ${
                              selectedServices.some(s => s.id === service.id)
                                ? 'bg-blue-600 text-white hover:bg-blue-700'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                          >
                            {selectedServices.some(s => s.id === service.id) ? 'Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-blue-600" />
                  Delivery Details
                </h2>
                
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Delivery Type
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {deliveryTypes.map((type) => (
                      <div 
                        key={type.id}
                        onClick={() => setDeliveryType(type.id)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          deliveryType === type.id
                            ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="mr-3 text-blue-600 dark:text-blue-400">
                          {type.icon}
                        </div>
                        <span className="font-medium">{type.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="delivery-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="delivery-date"
                        min={new Date().toISOString().split('T')[0]}
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="delivery-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Delivery Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="delivery-time"
                        value={deliveryTime}
                        onChange={(e) => setDeliveryTime(e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter your full address"
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    id="instructions"
                    rows={3}
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special instructions for our team..."
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h2>
                
                {selectedServices.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No services selected yet
                  </p>
                ) : (
                  <div>
                    <div className="space-y-3 mb-4">
                      {selectedServices.map((service) => {
                        const quantity = quantities[service.id] || 1;
                        const serviceTotal = service.pricePerUnit * quantity;
                        
                        return (
                          <div key={service.id} className="flex justify-between">
                            <div className="flex items-center">
                              <Check className="w-4 h-4 text-green-500 mr-2" />
                              <div>
                                <span className="text-gray-700 dark:text-gray-300">{service.name}</span>
                                <span className="block text-xs text-gray-500">
                                  {quantity} × ₦{service.pricePerUnit}
                                </span>
                              </div>
                            </div>
                            <span className="font-medium">₦{serviceTotal}</span>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₦{calculateTotal()}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Payment Method */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center p-3 rounded-lg cursor-pointer ${
                          paymentMethod === method.id
                            ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <div className="mr-3 text-blue-600 dark:text-blue-400">
                          {method.icon}
                        </div>
                        <span className="font-medium">{method.name}</span>
                        {method.id === 'wallet' && user && (
                          <span className="ml-auto text-sm">
                            ₦{user.walletBalance}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={
                    selectedServices.length === 0 || 
                    !deliveryDate || 
                    !deliveryTime || 
                    !address ||
                    (paymentMethod === 'wallet' && user?.walletBalance < calculateTotal()) ||
                    isSubmitting
                  }
                  className={`mt-6 w-full py-3 px-4 rounded-md font-medium flex items-center justify-center ${
                    selectedServices.length === 0 || 
                    !deliveryDate || 
                    !deliveryTime || 
                    !address ||
                    (paymentMethod === 'wallet' && user?.walletBalance < calculateTotal()) ||
                    isSubmitting
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
                
                {selectedServices.length === 0 && (
                  <p className="mt-2 text-sm text-red-500 text-center">
                    Please select at least one service
                  </p>
                )}
                {selectedServices.length > 0 && (!deliveryDate || !deliveryTime || !address) && (
                  <p className="mt-2 text-sm text-red-500 text-center">
                    Please fill all delivery details
                  </p>
                )}
                {paymentMethod === 'wallet' && user?.walletBalance < calculateTotal() && (
                  <p className="mt-2 text-sm text-red-500 text-center">
                    Insufficient wallet balance
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}