// src/context/AuthContext.jsx
import { createContext } from 'react';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const expiry = decoded.exp * 1000; // convert to ms
        const now = Date.now();

        if (expiry <= now) {
          logout(); // 🔒 token already expired
        } else {
          const timeout = setTimeout(() => {
            logout(); // ⏳ auto logout on expiry
          }, expiry - now);

          return () => clearTimeout(timeout); // cleanup
        }
      } catch (err) {
        console.error('Invalid token:', err);
        logout();
      }
    }
  }, [token]);

  const login = (userData, accessToken) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', accessToken);
    setUser(userData);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken('');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider
