import React from 'react';

export default function LoadingSpinner({ fullPage = false }) {
  return (
    <div className={`flex items-center justify-center ${fullPage ? 'h-screen' : 'h-full'}`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}