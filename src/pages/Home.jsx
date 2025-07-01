import { Shirt, Truck, CheckCircle, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    name: 'Professional Cleaning',
    description: 'We use premium detergents and state-of-the-art equipment to ensure your clothes look their best.',
    icon: <Shirt className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Free Pickup & Delivery',
    description: 'We come to you! Schedule a pickup and we\'ll handle the rest, with no extra delivery fees.',
    icon: <Truck className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Quality Guarantee',
    description: 'Not satisfied? We\'ll rewash your items for free or refund your money.',
    icon: <CheckCircle className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Eco-Friendly',
    description: 'We use biodegradable detergents and water-efficient processes to protect the environment.',
    icon: <Shield className="w-8 h-8 text-blue-600" />
  },
  {
    name: 'Fast Turnaround',
    description: 'Most orders completed within 24-48 hours. Express service available for urgent needs.',
    icon: <Star className="w-8 h-8 text-blue-600" />
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Regular Customer',
    content: 'FreshPress has been a lifesaver for my busy schedule. The quality is consistently excellent and the pickup/delivery service is so convenient!',
    rating: 5
  },
  {
    name: 'Michael Adebayo',
    role: 'Business Owner',
    content: 'As someone who wears suits daily, I appreciate their attention to detail with dry cleaning. My clothes always come back looking brand new.',
    rating: 5
  },
  {
    name: 'Amina Mohammed',
    role: 'Mother of Three',
    content: 'With three active kids, laundry was taking over my life. Now I just schedule weekly pickups and magically clean clothes appear at my door!',
    rating: 5
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-blue-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-blue-700 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">Professional Laundry</span>
                  <span className="block text-blue-200">At Your Convenience</span>
                </h1>
                <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Schedule a pickup and we'll handle the rest. Fast, reliable, and professional dry cleaning and laundry services.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/book"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 md:py-4 md:text-lg md:px-10"
                    >
                      Book Now
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/services"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-600 md:py-4 md:text-lg md:px-10"
                    >
                      Our Services
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1600077106724-946750eeaf3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Laundry service"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
              Why Choose Us
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              A better way to do laundry
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
              We combine quality service with convenience to give you back your time.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.name} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
              Process
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </p>
          </div>
          
          <div className="mt-10">
            <div className="relative">
              <div className="hidden md:block absolute top-0 left-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
              
              <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
                <div className="relative text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg font-bold border-2 border-blue-600 dark:border-blue-400">
                      1
                    </div>
                    <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Schedule Pickup
                    </h3>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Book online or via our app. Choose your pickup time and location.
                  </p>
                </div>
                
                <div className="relative text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg font-bold border-2 border-blue-600 dark:border-blue-400">
                      2
                    </div>
                    <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      We Clean Your Clothes
                    </h3>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Our professionals clean your items with care using premium products.
                  </p>
                </div>
                
                <div className="relative text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-lg font-bold border-2 border-blue-600 dark:border-blue-400">
                      3
                    </div>
                    <h3 className="ml-4 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                      Delivery Back to You
                    </h3>
                  </div>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                    Fresh, clean clothes delivered to your door at your convenience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
              Testimonials
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              What our customers say
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-500'}`} 
                      fill={i < testimonial.rating ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300">
                      {testimonial.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to simplify your life?</span>
            <span className="block text-blue-200">Book your first service today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-100">
            Join thousands of satisfied customers who get back hours each week by outsourcing their laundry.
          </p>
          <Link
            to="/signup"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 sm:w-auto"
          >
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}