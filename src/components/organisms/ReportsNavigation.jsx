import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const ReportsNavigation = ({ selectedReport, setSelectedReport }) => {
  const reports = [
    { id: 'inventory', label: 'Inventory Report', icon: 'Package' },
    { id: 'orders', label: 'Orders Report', icon: 'ShoppingCart' },
    { id: 'movements', label: 'Stock Movements', icon: 'ArrowUpDown' },
    { id: 'valuation', label: 'Stock Valuation', icon: 'DollarSign' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        {reports.map(report => (
          <Button
            key={report.id}
            onClick={() => setSelectedReport(report.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
              selectedReport === report.id 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ApperIcon name={report.icon} size={16} />
            <span>{report.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

ReportsNavigation.propTypes = {
  selectedReport: PropTypes.string.isRequired,
  setSelectedReport: PropTypes.func.isRequired,
};

export default ReportsNavigation;