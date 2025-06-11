import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const PurchaseOrderList = ({ filteredOrders, handleUpdateOrderStatus, onViewOrder }) => {
  if (!filteredOrders || !Array.isArray(filteredOrders)) {
    return <div className="text-center text-gray-500 py-8">No orders available</div>;
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map((order, index) => (
        <motion.div
          key={order?.id || index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
<div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-gray-900">{order?.orderNumber || 'N/A'}</h3>
                <StatusBadge status={order?.status || 'unknown'} />
              </div>
              <p className="text-sm text-secondary mb-2">
                Supplier: {order?.supplierId || 'N/A'} • {order?.items?.length || 0} items
              </p>
<p className="text-sm text-gray-600">
                Order Date: {order?.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                {order?.expectedDate && (
                  <> • Expected: {new Date(order.expectedDate).toLocaleDateString()}</>
                )}
              </p>
              <div className="mt-3">
                <p className="text-sm font-medium text-gray-900">Items:</p>
                <div className="mt-1 space-y-1">
{order?.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="text-sm text-gray-600 break-words">
                      {item?.productName || `Product ${item?.productId || 'Unknown'}`} - Qty: {item?.quantity || 0} @ ${item?.unitPrice ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
<div className="flex items-center space-x-2">
              {order?.status === 'pending' && handleUpdateOrderStatus && (
                <Button
                  onClick={() => handleUpdateOrderStatus(order?.id, 'confirmed')}
                  className="bg-info text-white text-sm hover:bg-info/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Confirm
                </Button>
)}
              {order?.status === 'confirmed' && handleUpdateOrderStatus && (
                <Button
                  onClick={() => handleUpdateOrderStatus(order?.id, 'shipped')}
                  className="bg-accent text-white text-sm hover:bg-accent/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Mark Shipped
                </Button>
)}
              {order?.status === 'shipped' && handleUpdateOrderStatus && (
                <Button
                  onClick={() => handleUpdateOrderStatus(order?.id, 'completed')}
                  className="bg-success text-white text-sm hover:bg-success/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Complete
                </Button>
)}
              {onViewOrder && (
                <Button
                  onClick={() => onViewOrder(order?.id)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
>
                  <ApperIcon name="Eye" size={16} />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

PurchaseOrderList.propTypes = {
  filteredOrders: PropTypes.array.isRequired,
  handleUpdateOrderStatus: PropTypes.func.isRequired,
  onViewOrder: PropTypes.func.isRequired,
};

export default PurchaseOrderList;