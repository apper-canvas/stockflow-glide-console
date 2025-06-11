import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import PropTypes from 'prop-types';

const DashboardRecentOrders = ({ recentOrders }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center">
            <ApperIcon name="ShoppingCart" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600">Create your first order to get started</p>
          </div>
        ) : (
          recentOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-secondary capitalize">{order.type} Order</p>
                  <p className="text-sm text-gray-600">
                    {order.items?.length || 0} items • {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={order.status} />
                  <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

DashboardRecentOrders.propTypes = {
  recentOrders: PropTypes.array.isRequired,
};

export default DashboardRecentOrders;