import React from 'react'

const Faq = () => {
  return (
   <section data-aos="fade-up" data-aos-delay="300" className="py-16 px-6 bg-white text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
  <h2 className="text-3xl font-bold text-blue-700 mb-10">Frequently Asked Questions</h2>
  <div className="max-w-3xl mx-auto space-y-6 text-left">
    <div className="border-l-4 border-blue-600 pl-4">
      <h4 className="text-lg font-semibold text-gray-800">How do I schedule a pickup?</h4>
      <p className="text-gray-600">You can book a pickup through our website or mobile app by selecting your preferred time and entering your address.</p>
    </div>
    <div className="border-l-4 border-blue-600 pl-4">
      <h4 className="text-lg font-semibold text-gray-800">What areas do you service?</h4>
      <p className="text-gray-600">We currently serve major cities like Lagos, Abuja, and Port Harcourt, with more coming soon.</p>
    </div>
    <div className="border-l-4 border-blue-600 pl-4">
      <h4 className="text-lg font-semibold text-gray-800">What payment methods are accepted?</h4>
      <p className="text-gray-600">We accept bank transfers, debit cards, and mobile payments. Payment is due after your clothes are delivered.</p>
    </div>
  </div>
</section>

  )
}

export default Faq