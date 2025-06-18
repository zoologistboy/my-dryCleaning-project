// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gray-100 dark:bg-gray-900 text-center py-4 text-sm text-gray-600 dark:text-gray-300 shadow-inner">
  &copy; {new Date().getFullYear()} DryCleanPro. All rights reserved.
</footer>

  );
}
