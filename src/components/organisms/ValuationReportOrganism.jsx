import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import PropTypes from 'prop-types';

const ValuationReportOrganism = ({ totalValue, categoryDistribution, products, stockLevels }) => {
  return (
    <div className="space-y-6">
      {/* Total Value Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Inventory Value</h3>
        <p className="text-4xl font-bold text-primary">${totalValue.toLocaleString()}</p>
        <p className="text-secondary mt-2">Based on current stock levels and unit prices</p>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Value by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(categoryDistribution).map(([category, value], index) => {
              const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ 
                      backgroundColor: `hsl(${index * 45}, 70%, 50%)` 
                    }}></div>
                    <span className="font-medium text-gray-900">{category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">${value.toLocaleString()}</span>
                    <ProgressBar 
                      percentage={percentage} 
                      colorClass="" 
                      style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                      className="w-32"
                    />
                    <span className="text-sm text-secondary w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Top Value Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Value Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {products
              .map(product => {
                const stock = stockLevels.find(s => s.productId === product.id);
                const value = stock ? stock.quantity * product.unitPrice : 0;
                return { ...product, stockValue: value, stockQuantity: stock?.quantity || 0 };
              })
              .sort((a, b) => b.stockValue - a.stockValue)
              .slice(0, 10)
              .map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Package" size={16} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 break-words">{product.name}</h4>
                      <p className="text-sm text-secondary">
                        {product.stockQuantity} units @ ${product.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${product.stockValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-secondary">{product.category}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

ValuationReportOrganism.propTypes = {
  totalValue: PropTypes.number.isRequired,
  categoryDistribution: PropTypes.object.isRequired,
  products: PropTypes.array.isRequired,
  stockLevels: PropTypes.array.isRequired,
};

export default ValuationReportOrganism;