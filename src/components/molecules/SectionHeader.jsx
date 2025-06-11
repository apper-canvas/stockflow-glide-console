import React from 'react';
import PropTypes from 'prop-types';

const SectionHeader = ({ title, description, className = '' }) => {
  return (
    <div className={`mb-6 ${className}`}>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-secondary">{description}</p>
    </div>
  );
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
};

export default SectionHeader;