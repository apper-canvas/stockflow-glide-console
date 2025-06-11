import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ title, value, iconName, iconBgClass = 'bg-primary/10', iconColorClass = 'text-primary', className = '', delay = 0, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-white rounded-lg p-6 shadow-sm border border-gray-200 ${className}`}
      {...props}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClass}`}>
          <ApperIcon name={iconName} size={24} className={iconColorClass} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;