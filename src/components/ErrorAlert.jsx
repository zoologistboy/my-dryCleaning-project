import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <div className="p-4 rounded-md bg-red-50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{message || 'An error occurred'}</h3>
          {onRetry && (
            <div className="mt-2">
              <button
                onClick={onRetry}
                className="text-sm text-red-700 underline hover:text-red-600"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}