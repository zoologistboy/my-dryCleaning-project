import React from 'react';

const Hero = () => {
  return (
    <section data-aos="fade-up" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Text Content */}
        <div className="lg:w-1/2 text-left animate-fadeIn">
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-blue-700 dark:text-blue-400 mb-6">
            Professional Dry Cleaning,<br className="hidden sm:block" />
            Delivered to Your Door
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md">
            Fast. Reliable. Affordable. Book in minutes and enjoy fresh, clean clothes without lifting a finger.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300">
            Book Now
          </button>
        </div>

        {/* Image */}
        <div className="lg:w-1/2 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
            alt="Dry cleaning delivery"
            className="w-full max-w-sm drop-shadow-xl transition duration-300 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
