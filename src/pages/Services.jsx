import { Shirt, Zap, Shield, Truck, Star } from 'lucide-react';

const services = [
  {
    name: 'Wash & Fold',
    description: 'Professional washing, drying, and folding of your clothes',
    price: '₦1,500 per 5kg',
    features: [
      'Gentle machine wash',
      'Premium detergents',
      'Low-temperature drying',
      'Neat folding'
    ],
    icon: <Shirt className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Dry Cleaning',
    description: 'Specialized cleaning for delicate fabrics and formal wear',
    price: 'From ₦2,500 per item',
    features: [
      'Expert stain removal',
      'Eco-friendly solvents',
      'Professional pressing',
      'Garment bag packaging'
    ],
    icon: <Zap className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Ironing',
    description: 'Professional pressing for wrinkle-free clothes',
    price: 'From ₦500 per item',
    features: [
      'Steam ironing',
      'Special attention to collars and cuffs',
      'Hanging or folding options',
      'Same-day service available'
    ],
    icon: <Shield className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Stain Removal',
    description: 'Targeted treatment for tough stains',
    price: 'From ₦1,000 per item',
    features: [
      'Specialized stain treatments',
      'Pre-treatment assessment',
      'Safe for all fabric types',
      'Odor removal included'
    ],
    icon: <Star className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Bulk Laundry',
    description: 'Economical solution for large quantities',
    price: '₦10,000 per month (up to 20kg weekly)',
    features: [
      'Weekly pickup and delivery',
      'Volume discounts',
      'Priority processing',
      'Dedicated account manager'
    ],
    icon: <Truck className="w-8 h-8 text-blue-600" />
  }
];

const benefits = [
  {
    title: 'Fast Turnaround',
    description: 'Most orders completed within 24-48 hours',
    icon: <Clock className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Eco-Friendly',
    description: 'We use biodegradable detergents and conserve water',
    icon: <Shield className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Quality Guarantee',
    description: "100% satisfaction or we'll rewash for free",
    icon: <Star className="w-6 h-6 text-blue-600" />
  },
  {
    title: 'Free Pickup & Delivery',
    description: 'Convenient service at no extra cost',
    icon: <Truck className="w-6 h-6 text-blue-600" />
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Our Services
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Professional cleaning services tailored to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-4">
                    {service.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {service.name}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                  {service.price}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="flex-shrink-0 h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700">
                <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Book This Service
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8 sm:p-10">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Why Choose FreshPress?
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                We go the extra mile to ensure your complete satisfaction
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}