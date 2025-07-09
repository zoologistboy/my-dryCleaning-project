import React, { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client';
import { VITE_BASE_URL } from '../config';

export const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(VITE_BASE_URL, {
      withCredentials: true,
      auth: { token: localStorage.getItem('token') }
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

// ✅ ADD THIS HOOK:
export const useSocket = () => useContext(SocketContext);
