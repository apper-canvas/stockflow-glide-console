import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PropTypes from 'prop-types';

const StockMovementsReportOrganism = ({ movements, products }) => {
  const getMovementIcon = (type) => {
    switch (type) {
      case 'receipt': return { name: 'ArrowDown', color: 'text-success', bg: 'bg-success/10' };
      case 'shipment': return { name: 'ArrowUp', color: 'text-error', bg: 'bg-error/10' };
      case 'transfer': return { name: 'ArrowRightLeft', color: 'text-info', bg: 'bg-info/10' };
      default: return { name: 'Edit', color: 'text-warning', bg: 'bg-warning/10' };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h3>
      </div>
      <div className="p-6">
        {movements.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="ArrowUpDown" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No stock movements recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {movements.map((movement, index) => {
              const product = products.find(p => p.id === movement.productId);
              const { name: iconName, color: iconColor, bg: iconBg } = getMovementIcon(movement.type);
              return (
                <motion.div
                  key={movement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
                      <ApperIcon name={iconName} size={18} className={iconColor} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 break-words">
                        {product?.name || `Product ${movement.productId}`}
                      </h4>
                      <p className="text-sm text-secondary capitalize">
                        {movement.type} • {movement.quantity} units
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(movement.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {movement.fromLocation && movement.toLocation 
                        ? `${movement.fromLocation} → ${movement.toLocation}`
                        : movement.toLocation || movement.fromLocation || 'Warehouse'
                      }
                    </p>
                    {movement.notes && (
                      <p className="text-sm text-gray-600 break-words">{movement.notes}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

StockMovementsReportOrganism.propTypes = {
  movements: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

export default StockMovementsReportOrganism;