// src/components/Header.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun, Moon, LogOut, Wallet, ChevronDown, Settings, User, Menu
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { ProfileContext } from '../contexts/ProfileContext';

export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const { profile } = useContext(ProfileContext);
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-md px-4 md:px-6 py-4 fixed top-0 w-full z-50">
      <div className="flex justify-between items-center">
        {/* Brand */}
        <Link to={user ? "/dashboard" : "/"} className="text-2xl font-bold text-blue-600 dark:text-white">
          DryCleanPro
        </Link>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Right-side controls (desktop only) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>

          {/* Authenticated Menu */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button className="flex items-center gap-2" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-white dark:text-gray-200">
                      {profile?.fullName?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                <span className="text-gray-800 dark:text-gray-100 hidden sm:inline">
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
                          <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-white dark:text-gray-200">
                            {profile?.fullName?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">{profile?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">₦{profile?.walletBalance?.toLocaleString() ?? '0'}</p>
                      </div>
                    </div>
                  </div>

                  <button onClick={() => { navigate('/profile'); setDropdownOpen(false); }} className="dropdown-item">
                    <User className="w-4 h-4 mr-2" /> View Profile
                  </button>
                  <button onClick={() => { navigate('/wallet'); setDropdownOpen(false); }} className="dropdown-item">
                    <Wallet className="w-4 h-4 mr-2" /> Top Up Balance
                  </button>
                  <button onClick={() => { navigate('/settings'); setDropdownOpen(false); }} className="dropdown-item">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </button>
                  <button onClick={handleLogout} className="dropdown-item text-red-600">
                    <LogOut className="w-4 h-4 mr-2" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <nav className="space-x-4 text-gray-700 dark:text-gray-300 font-medium hidden md:block">
                <a href="/#services">Services</a>
                <a href="/#pricing">Pricing</a>
                <a href="/#contactUs">Contact</a>
              </nav>
              <Link to="/signin" className="btn-primary">Sign In</Link>
              <Link to="/signup" className="btn-secondary">Sign Up</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 space-y-3 text-gray-700 dark:text-gray-300">
          <div className="flex justify-end">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
              {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
            </button>
          </div>
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block">Profile</Link>
              <Link to="/wallet" onClick={() => setMobileMenuOpen(false)} className="block">Top Up</Link>
              <Link to="/settings" onClick={() => setMobileMenuOpen(false)} className="block">Settings</Link>
              <button onClick={handleLogout} className="block text-red-600">Logout</button>
            </>
          ) : (
            <>
              <a href="/#services" className="block">Services</a>
              <a href="/#pricing" className="block">Pricing</a>
              <a href="/#contactUs" className="block">Contact</a>
              <Link to="/signin" className="btn-primary block text-center">Sign In</Link>
              <Link to="/signup" className="btn-secondary block text-center">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
