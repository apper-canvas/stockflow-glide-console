import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/atoms/StatCard';
import ApperIcon from '@/components/ApperIcon';
import PropTypes from 'prop-types';

const InventoryReportOrganism = ({ products, stockLevels, lowStockProducts }) => {
  const totalStockQuantity = stockLevels.reduce((total, stock) => total + stock.quantity, 0);
  const uniqueCategoriesCount = [...new Set(products.map(p => p.category))].length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={products.length}
          iconName="Package"
          delay={0}
        />
        <StatCard
          title="Total Stock"
          value={totalStockQuantity.toLocaleString()}
          iconName="Boxes"
          iconBgClass="bg-info/10"
          iconColorClass="text-info"
          delay={0.1}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          iconName="AlertTriangle"
          iconBgClass="bg-warning/10"
          iconColorClass="text-warning"
          delay={0.2}
        />
        <StatCard
          title="Categories"
          value={uniqueCategoriesCount}
          iconName="Grid3x3"
          iconBgClass="bg-accent/10"
          iconColorClass="text-accent"
          delay={0.3}
        />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product, index) => {
                const stock = stockLevels.find(s => s.productId === product.id);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-warning/20 rounded-lg bg-warning/5"
                  >
                    <h4 className="font-medium text-gray-900 break-words">{product.name}</h4>
                    <p className="text-sm text-secondary">SKU: {product.sku}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm">
                        Stock: <span className="font-medium text-warning">{stock?.quantity || 0}</span>
                      </span>
                      <span className="text-sm">
                        Reorder: <span className="font-medium">{product.reorderPoint}</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

InventoryReportOrganism.propTypes = {
  products: PropTypes.array.isRequired,
  stockLevels: PropTypes.array.isRequired,
  lowStockProducts: PropTypes.array.isRequired,
};

export default InventoryReportOrganism;