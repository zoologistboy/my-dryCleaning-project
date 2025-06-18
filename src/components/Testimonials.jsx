// src/components/Testimonials.jsx
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination } from 'swiper/modules';

export default function Testimonials() {
  const testimonials = [
    {
      quote: "DryCleanPro saved me so much time. Pickup and delivery were right on schedule, and my clothes looked brand new!",
      name: "Sarah A., Lagos",
    },
    {
      quote: "Excellent service and great pricing. I’ve used many laundry apps, but this is by far the most reliable.",
      name: "James O., Abuja",
    },
    {
      quote: "Booking was easy, the driver was polite, and my clothes came back smelling amazing. Highly recommended!",
      name: "Mariam K., Port Harcourt",
    },
  ];

  return (
    <section data-aos="fade-left" data-aos-delay="100" className="py-16 px-6 bg-gray-50 text-center bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold text-blue-700 mb-12">What Our Customers Say</h2>

      <div className="max-w-3xl mx-auto">
        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          pagination={{ clickable: true }}
          loop={true}
        >
          {testimonials.map((t, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-gray-700 italic mb-4">“{t.quote}”</p>
                <div className="text-sm font-semibold text-gray-600">— {t.name}</div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
