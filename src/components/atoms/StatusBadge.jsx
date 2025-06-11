import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const getStatusColor = (statusText) => {
    switch (statusText) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'confirmed': return 'bg-info/10 text-info';
      case 'shipped': return 'bg-accent/10 text-accent';
      case 'completed': return 'bg-success/10 text-success';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(status)} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;