import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, className = '', onClick, type = 'button', whileHover, whileTap, disabled }) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
      whileHover={whileHover}
      whileTap={whileTap}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

export default Button;