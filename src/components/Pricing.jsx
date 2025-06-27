import React from 'react'

const Pricing = () => {
  return (
  <section data-aos="zoom-in-up" data-aos-delay="150" className="py-16 px-6 bg-white text-center bg-white dark:bg-gray-900 border dark:border-gray-700 shadow dark:shadow-md p-6 rounded-lg">
  <h2 className="text-3xl font-bold text-blue-700 mb-12">Simple, Transparent Pricing</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {/* Basic */}
    <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">Basic</h3>
      <p className="text-blue-600 text-3xl font-bold mb-4">₦1,000</p>
      <ul className="text-gray-600 text-sm space-y-2 mb-4">
        <li>Washing Only</li>
        <li>Pickup in 24 hours</li>
        <li>2kg laundry limit</li>
      </ul>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Select Plan
      </button>
    </div>

    {/* Standard */}
    <div className="border-2 border-blue-600 rounded-lg p-6 shadow-lg bg-blue-50">
      <h3 className="text-xl font-semibold mb-2">Standard</h3>
      <p className="text-blue-600 text-3xl font-bold mb-4">₦2,500</p>
      <ul className="text-gray-700 text-sm space-y-2 mb-4">
        <li>Wash + Iron</li>
        <li>Same-day Pickup</li>
        <li>Up to 5kg laundry</li>
      </ul>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Most Popular
      </button>
    </div>

    {/* Premium */}
    <div className="border rounded-lg p-6 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2">Premium</h3>
      <p className="text-blue-600 text-3xl font-bold mb-4">₦5,000</p>
      <ul className="text-gray-600 text-sm space-y-2 mb-4">
        <li>Dry Clean, Wash + Iron</li>
        <li>Express Pickup</li>
        <li>10kg laundry included</li>
      </ul>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
        Select Plan
      </button>
    </div>
  </div>
</section>

  )
}

export default Pricing