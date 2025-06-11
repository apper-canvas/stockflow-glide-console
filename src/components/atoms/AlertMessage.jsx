import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const AlertMessage = ({ iconName, title, message, actionButton, className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 bg-white rounded-lg shadow-sm ${className}`}
    >
      {iconName && <ApperIcon name={iconName} className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{message}</p>
      {actionButton && (
        <Button
          onClick={actionButton.onClick}
          className="bg-primary text-white hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {actionButton.label}
        </Button>
      )}
    </motion.div>
  );
};

export default AlertMessage;