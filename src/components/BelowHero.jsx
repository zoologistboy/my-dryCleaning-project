import React from 'react'

const BelowHero = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white" data-aos="fade-up" data-aos-delay="100">
  <h2 className="text-3xl font-bold text-blue-700 mb-10">How It Works</h2>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-w-5xl mx-auto">
    <div>
      <img src="https://cdn-icons-png.flaticon.com/512/2622/2622303.png" alt="Schedule" className="w-20 mx-auto mb-4" />
      <h3 className="font-semibold text-lg mb-2">1. Schedule Pickup</h3>
      <p className="text-gray-600">Choose your pickup time online or through the app.</p>
    </div>
    <div>
      <img src="https://cdn-icons-png.flaticon.com/512/9684/9684986.png" alt="Cleaning" className="w-20 mx-auto mb-4" />
      <h3 className="font-semibold text-lg mb-2">2. We Clean</h3>
      <p className="text-gray-600">Our professionals clean, press, and fold your items.</p>
    </div>
    <div>
      <img src="https://cdn-icons-png.flaticon.com/512/4086/4086679.png" alt="Deliver" className="w-20 mx-auto mb-4" />
      <h3 className="font-semibold text-lg mb-2">3. Delivered Fresh</h3>
      <p className="text-gray-600">We deliver your clothes fresh and on time.</p>
    </div>
  </div>
</section>

  )
}

export default BelowHero