// components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'large', message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-white/80 text-lg font-medium">{message}</p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl font-bold">
            ST
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SkillTree
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;