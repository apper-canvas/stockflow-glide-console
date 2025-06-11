import React from 'react';
import PropTypes from 'prop-types';

const SectionHeader = ({ title, description, className = '', action }) => {
  return (
    <div className={`mb-6 flex items-start justify-between ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-secondary">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  action: PropTypes.node,
};

export default SectionHeader;