
import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-medical-500 rounded-full animate-rotate-center"></div>
          </div>
          <div className="mt-4 text-center">
            <h3 className="text-lg font-medium text-gray-900">{message}</h3>
            <p className="mt-1 text-sm text-gray-500">This may take a few moments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
