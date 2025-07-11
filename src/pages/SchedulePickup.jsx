import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Info, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const timeSlots = [
  '8:00 AM - 10:00 AM',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 2:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM'
];

export default function SchedulePickup() {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Home', details: '123 Main St, Lagos, Nigeria', isDefault: true },
    { id: 2, name: 'Office', details: '456 Business Ave, Lagos, Nigeria', isDefault: false },
    { id: 3, name: 'Other', details: '789 Alternative Rd, Lagos, Nigeria', isDefault: false }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    details: '',
    isDefault: false
  });

  // Set default pickup date to tomorrow and select default address
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPickupDate(tomorrow.toISOString().split('T')[0]);
    
    const defaultAddress = addresses.find(addr => addr.isDefault);
    setSelectedAddress(defaultAddress || addresses[0]);
  }, []);

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.details) {
      toast.error('Please fill all address fields');
      return;
    }

    const newId = Math.max(...addresses.map(a => a.id)) + 1;
    const updatedAddresses = newAddress.isDefault
      ? addresses.map(addr => ({ ...addr, isDefault: false }))
      : [...addresses];

    const addressToAdd = {
      id: newId,
      ...newAddress
    };

    setAddresses([...updatedAddresses, addressToAdd]);
    setSelectedAddress(addressToAdd);
    setNewAddress({ name: '', details: '', isDefault: false });
    setShowAddAddress(false);
    toast.success('Address added successfully');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupDate || !pickupTime) {
      toast.error('Please select both date and time');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select a pickup address');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Pickup scheduled successfully!');
      setTimeout(() => {
        navigate('/orders');
      }, 2000);
    } catch (err) {
      toast.error(err.message || 'Failed to schedule pickup');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Schedule a Pickup</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let us know when to pick up your laundry
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Pickup Details
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pickup Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="pickup-date"
                      min={new Date().toISOString().split('T')[0]}
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="pl-10 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  {pickupDate && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(pickupDate)}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="pickup-time" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Pickup Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="pickup-time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
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
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pickup Address
                </label>
                <div className="space-y-2">
                  {addresses.map((address) => (
                    <div 
                      key={address.id}
                      onClick={() => setSelectedAddress(address)}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAddress?.id === address.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          <MapPin className={`h-5 w-5 ${
                            selectedAddress?.id === address.id
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {address.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {showAddAddress ? (
                  <div className="mt-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Add New Address</h3>
                      <button 
                        onClick={() => setShowAddAddress(false)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Address Name</label>
                        <input
                          type="text"
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                          placeholder="e.g. Home, Office"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Full Address</label>
                        <textarea
                          value={newAddress.details}
                          onChange={(e) => setNewAddress({...newAddress, details: e.target.value})}
                          rows={2}
                          placeholder="Street address, city, state"
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="default-address"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="default-address" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          Set as default address
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save Address
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowAddAddress(true)}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add New Address
                  </button>
                )}
              </div>
              
              <div className="mt-6">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Special Instructions
                </label>
                <textarea
                  id="instructions"
                  rows={3}
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special instructions for our pickup team..."
                  className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="mt-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Pickup Reminder
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <p>
                          Our driver will call you 15 minutes before arriving at your location. 
                          Please ensure your laundry is ready for pickup at the scheduled time.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading || !pickupDate || !pickupTime || !selectedAddress}
                  className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                    loading || !pickupDate || !pickupTime || !selectedAddress ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="inline w-4 h-4 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : 'Schedule Pickup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}