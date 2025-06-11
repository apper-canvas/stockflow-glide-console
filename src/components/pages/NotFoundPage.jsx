import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <ApperIcon name="Package" className="w-24 h-24 text-gray-300 mx-auto" />
        </motion.div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist in our inventory system.
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-primary text-white hover:bg-primary/90 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="Home" size={20} />
            <span>Go to Dashboard</span>
          </Button>
          
          <Button
            onClick={() => navigate(-1)}
            className="w-full text-gray-700 bg-gray-200 hover:bg-gray-300 flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ApperIcon name="ArrowLeft" size={20} />
            <span>Go Back</span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

NotFoundPage.propTypes = {
  // No direct props, uses useNavigate
};

export default NotFoundPage;