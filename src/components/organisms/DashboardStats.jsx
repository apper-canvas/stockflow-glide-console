import React from 'react';
import StatCard from '@/components/atoms/StatCard';
import PropTypes from 'prop-types';

const DashboardStats = ({ productsCount, lowStockCount, activeOrdersCount, totalInventoryValue }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Products"
        value={productsCount}
        iconName="Package"
        delay={0}
      />
      <StatCard
        title="Low Stock Items"
        value={lowStockCount}
        iconName="AlertTriangle"
        iconBgClass="bg-warning/10"
        iconColorClass="text-warning"
        delay={0.1}
      />
      <StatCard
        title="Active Orders"
        value={activeOrdersCount}
        iconName="ShoppingCart"
        iconBgClass="bg-info/10"
        iconColorClass="text-info"
        delay={0.2}
      />
      <StatCard
        title="Total Value"
        value={`$${totalInventoryValue.toLocaleString()}`}
        iconName="DollarSign"
        iconBgClass="bg-success/10"
        iconColorClass="text-success"
        delay={0.3}
      />
    </div>
  );
};

DashboardStats.propTypes = {
  productsCount: PropTypes.number.isRequired,
  lowStockCount: PropTypes.number.isRequired,
  activeOrdersCount: PropTypes.number.isRequired,
  totalInventoryValue: PropTypes.number.isRequired,
};

export default DashboardStats;