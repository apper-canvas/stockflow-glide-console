import React from 'react';

const ProgressBar = ({ percentage, colorClass = 'bg-primary', className = '' }) => {
  return (
    <div className={`w-20 h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full transition-all duration-300 ${colorClass}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;