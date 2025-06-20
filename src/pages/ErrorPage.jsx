// src/pages/NotFound.jsx
import { useNavigate } from 'react-router-dom';
import { Shirt } from 'lucide-react'; // dry cleaning-themed icon
// import notFoundImage from '../assets/404-drycleaning.png'; // Add a relevant image to this path

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
      <div className="space-y-6 max-w-md">
        <Shirt className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto" />
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Oops! We couldn’t find the page you were looking for. Maybe it’s at the cleaners? 🧺
        </p>
           <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921822.png"
            alt="404"
            className="w-full max-w-xs mx-auto"
          />
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
