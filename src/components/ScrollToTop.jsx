// src/components/ScrollToTop.jsx
import { useEffect, useState } from 'react';
// import { ArrowUpCircle } from 'lucide-react'; // Optional: icon from Lucide

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 200);
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white dark:bg-blue-400 p-3 rounded-full shadow-lg hover:scale-105 transition-all"
      >
      <span className="text-xl font-bold">↑</span>

      </button>
    )
  );
}
