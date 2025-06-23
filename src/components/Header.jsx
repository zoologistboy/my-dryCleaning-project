// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Sun, Moon, LogOut, Wallet } from 'lucide-react';


export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dark, setDark] = React.useState(
    () => document.documentElement.classList.contains('dark')
  );

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center fixed top-0 w-full z-10">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          DryCleanPro
        </Link>
        
      </div>

      <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
         

        <button
          onClick={() => setDark(!dark)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
        >
          {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button>

        {/* Conditional Rendering based on login */}
        {user ? (
          // When logged in
          <>
            <Wallet className="w-5 h-5 text-blue-500" />
              <p className="text-1xl text-gray-800 dark:text-white">
                ₦{user?.walletBalance ?? 0}
            </p>
            <span className="text-gray-800 dark:text-gray-100">Hello, {user.fullName.split(" ")[0]}</span>
            <button
                onClick={() => {
                  logout();
                  navigate('/signin');
                }}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Logout
        </button>
          </>
        ) : (
          // When not logged in
          <> 
            <nav className="space-x-4 text-gray-700 dark:text-gray-300 font-medium">
                <Link to="/#services">Services</Link>
                <Link to="/#pricing">Pricing</Link>
                <Link to="/#contactUs">Contact</Link>
            </nav>
            <Link
              to="/signin"
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
