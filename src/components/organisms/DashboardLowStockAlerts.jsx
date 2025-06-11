import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const DashboardLowStockAlerts = ({ lowStockProducts, stockLevels, handleCreateOrder, handleStockAdjustment }) => {
  if (lowStockProducts.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
          <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {lowStockProducts.map((product, index) => {
          const stock = stockLevels.find(s => s.productId === product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 break-words">{product.name}</h3>
                  <p className="text-sm text-secondary">SKU: {product.sku}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm">
                      Current: <span className="font-medium text-warning">{stock?.quantity || 0}</span>
                    </span>
                    <span className="text-sm">
                      Reorder Point: <span className="font-medium">{product.reorderPoint}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => handleCreateOrder(product.id, product.reorderQuantity)}
                    className="bg-primary text-white text-sm hover:bg-primary/90"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Reorder
                  </Button>
                  <Button
                    onClick={() => handleStockAdjustment(product.id, 10)}
                    className="bg-gray-200 text-gray-700 text-sm hover:bg-gray-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Adjust
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

DashboardLowStockAlerts.propTypes = {
  lowStockProducts: PropTypes.array.isRequired,
  stockLevels: PropTypes.array.isRequired,
  handleCreateOrder: PropTypes.func.isRequired,
  handleStockAdjustment: PropTypes.func.isRequired,
};

export default DashboardLowStockAlerts;