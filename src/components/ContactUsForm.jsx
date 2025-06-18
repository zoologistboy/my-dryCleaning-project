import React from 'react'

const ContactUsForm = () => {
  return (
    <section data-aos="fade-right" data-aos-delay="200" className="py-16 px-6 bg-gray-50 text-center bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100">
  <h2 className="text-3xl font-bold text-blue-700 mb-8">Contact Us</h2>
  <p className="text-gray-600 max-w-xl mx-auto mb-8">
    Have questions or need support? Reach out to us using the form below. We'll respond within 24 hours.
  </p>

  <form className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-4 text-left">
    <div>
      <label className="block mb-1 font-medium text-gray-700">Name</label>
      <input type="text" placeholder="Your Name" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>
    <div>
      <label className="block mb-1 font-medium text-gray-700">Email</label>
      <input type="email" placeholder="you@example.com" className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
    </div>
    <div>
      <label className="block mb-1 font-medium text-gray-700">Message</label>
      <textarea rows="4" placeholder="Your message..." className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
    </div>
    <button type="submit" className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition">
      Send Message
    </button>
  </form>
</section>

  )
}

export default ContactUsForm