import React from 'react';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const OrderListFilter = ({ selectedStatus, setSelectedStatus, statuses }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setSelectedStatus('all')}
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            selectedStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Orders
        </Button>
        {statuses.map(status => (
          <Button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              selectedStatus === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
};

OrderListFilter.propTypes = {
  selectedStatus: PropTypes.string.isRequired,
  setSelectedStatus: PropTypes.func.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OrderListFilter;