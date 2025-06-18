import React from 'react'

const HowWeWork = () => {
  return (
    <section data-aos="zoom-in" data-aos-delay="200" className="py-16 px-6 bg-white text-center bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
  <h2 className="text-3xl font-bold text-blue-700 mb-12">Our Services</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
    {/* Washing */}
    <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <img src="https://cdn-icons-png.flaticon.com/512/869/869636.png" alt="Washing" className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Washing</h3>
      <p className="text-gray-600 text-sm">Fresh, clean laundry done with premium detergents.</p>
    </div>

    {/* Ironing */}
    <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <img src="https://cdn-icons-png.flaticon.com/512/947/947970.png" alt="Ironing" className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Ironing</h3>
      <p className="text-gray-600 text-sm">Professional pressing for a crisp, clean finish.</p>
    </div>

    {/* Dry Cleaning */}
    <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <img src="https://cdn-icons-png.flaticon.com/512/3181/3181885.png" alt="Dry Cleaning" className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Dry Cleaning</h3>
      <p className="text-gray-600 text-sm">Safe and eco-friendly dry cleaning for delicate fabrics.</p>
    </div>

    {/* Pickup & Delivery */}
    <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition">
      <img src="https://cdn-icons-png.flaticon.com/512/3602/3602142.png" alt="Delivery" className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2">Pickup & Delivery</h3>
      <p className="text-gray-600 text-sm">Convenient doorstep pickup and delivery service.</p>
    </div>
  </div>
</section>

  )
}

export default HowWeWork