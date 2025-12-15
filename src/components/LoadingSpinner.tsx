import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg z-10">
      <div className="w-16 h-16 border-4 border-dashed border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingSpinner;