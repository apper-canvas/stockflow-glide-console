import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PropTypes from 'prop-types';

const Modal = ({ title, onClose, children, className = '', enableOverlayClose = true }) => {
  const handleOverlayClick = (e) => {
    if (enableOverlayClose && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleOverlayClick}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto ${className}`}
      >
        <div className="flex items-center justify-between mb-4 p-6 pb-0">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>
        <div className="p-6 pt-0">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  enableOverlayClose: PropTypes.bool,
};

export default Modal;