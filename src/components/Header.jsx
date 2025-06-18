import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react'; // 👈 Icon imports

export default function Header() {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
      scrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'
    } px-6 py-4 flex justify-between items-center`}>
      <h1 className="text-2xl font-bold text-blue-600 dark:text-white">DryCleanPro</h1>

      <nav className="flex items-center gap-4 text-gray-700 dark:text-gray-300 font-medium">
        <a href="#">Home</a>
        <a href="#">Services</a>
        <a href="#">Pricing</a>
        <a href="#">Contact</a>

        {/* Theme toggle button */}
        <button
          onClick={() => setIsDark(prev => !prev)}
          className="ml-4 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-gray-700 transition"
          aria-label="Toggle dark mode"
        >
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-500" />}
        </button>
      </nav>
    </header>
  );
}
