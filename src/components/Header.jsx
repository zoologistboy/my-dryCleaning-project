// src/components/Header.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';
import { Sun, Moon, LogOut, Wallet, ChevronDown, Settings, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext)
  const navigate = useNavigate();
  const [dark, setDark] = React.useState(
    () => document.documentElement.classList.contains('dark')
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-6 py-4 flex justify-between items-center fixed top-0 w-full z-10">
     {user?  <div className="flex items-center space-x-4">
        <Link to="/dashboard" className="text-2xl font-bold text-blue-600 dark:text-white">
          DryCleanPro
        </Link>
      </div>:  <div className="flex items-center space-x-4">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-white">
          DryCleanPro
        </Link>
      </div>}

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
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-2"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                {profile?.profilePicture ? (
                  <img 
                    src={profile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-white dark:text-gray-200">
                    {profile?.fullName?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <span className="text-gray-800 dark:text-gray-100">
                Hello, {profile?.fullName?.split(" ")[0] || 'User'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                      {profile?.profilePicture ? (
                        <img 
                          src={profile.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm text-white dark:text-gray-200">
                          {profile?.fullName?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {profile?.fullName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ₦{profile?.walletBalance?.toLocaleString() ?? '0'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/profile');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  View Profile
                </button>
                <button
                  onClick={() => {
                    navigate('/wallet/topup');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Top Up Balance
                </button>
                <button
                  onClick={() => {
                    navigate('/settings');
                    setDropdownOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // When not logged in
          <> 
            <nav className="space-x-4 text-gray-700 dark:text-gray-300 font-medium">
                <a href="/#services">Services</a>
                <a href="/#pricing">Pricing</a>
                <a href="/#contactUs">Contact</a>
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