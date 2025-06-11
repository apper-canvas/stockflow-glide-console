import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/atoms/StatCard';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import PropTypes from 'prop-types';

const OrdersReportOrganism = ({ purchaseOrders, salesOrders }) => {
  const totalPurchaseValue = purchaseOrders.reduce((total, order) => {
    return total + (order.items?.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0) || 0)
  }, 0);

  const totalSalesValue = salesOrders.reduce((total, order) => {
    return total + (order.items?.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0) || 0)
  }, 0);

  const statusColors = {
    pending: 'bg-warning',
    confirmed: 'bg-info',
    shipped: 'bg-accent',
    completed: 'bg-success',
  };

  const renderOrderStatusBreakdown = (orders, title, delay) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {['pending', 'confirmed', 'shipped', 'completed'].map(status => {
            const count = orders.filter(o => o.status === status).length;
            const percentage = orders.length > 0 ? (count / orders.length) * 100 : 0;
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-3 h-3 rounded-full ${statusColors[status]}`}></span>
                  <span className="capitalize text-gray-700">{status}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{count}</span>
                  <ProgressBar percentage={percentage} colorClass={statusColors[status]} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Purchase Orders"
          value={purchaseOrders.length}
          iconName="ShoppingCart"
          delay={0}
        />
        <StatCard
          title="Sales Orders"
          value={salesOrders.length}
          iconName="ShoppingBag"
          iconBgClass="bg-success/10"
          iconColorClass="text-success"
          delay={0.1}
        />
        <StatCard
          title="Purchase Value"
          value={`$${totalPurchaseValue.toLocaleString()}`}
          iconName="TrendingDown"
          iconBgClass="bg-error/10"
          iconColorClass="text-error"
          delay={0.2}
        />
        <StatCard
          title="Sales Value"
          value={`$${totalSalesValue.toLocaleString()}`}
          iconName="TrendingUp"
          iconBgClass="bg-success/10"
          iconColorClass="text-success"
          delay={0.3}
        />
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderOrderStatusBreakdown(purchaseOrders, 'Purchase Order Status', 0.4)}
        {renderOrderStatusBreakdown(salesOrders, 'Sales Order Status', 0.5)}
      </div>
    </div>
  );
};

OrdersReportOrganism.propTypes = {
  purchaseOrders: PropTypes.array.isRequired,
  salesOrders: PropTypes.array.isRequired,
};

export default OrdersReportOrganism;