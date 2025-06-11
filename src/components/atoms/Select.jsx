import React from 'react';

const Select = ({ value, onChange, children, className = '', required, ...props }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      required={required}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;