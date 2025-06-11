import React from 'react';

const Input = ({ type = 'text', value, onChange, placeholder, className = '', min, step, required, ...props }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
      min={min}
      step={step}
      required={required}
      {...props}
    />
  );
};

export default Input;