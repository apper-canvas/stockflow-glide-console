import React from 'react';
import AlertMessage from '@/components/atoms/AlertMessage';
import PropTypes from 'prop-types';

const InventoryEmptyState = ({ searchTerm, selectedCategory, onAddProduct }) => {
  const title = "No Products Found";
  const message = searchTerm || selectedCategory !== 'all' 
    ? 'Try adjusting your filters' 
    : 'Add your first product to get started';
  
  const actionButton = (!searchTerm && selectedCategory === 'all') 
    ? { label: 'Add Product', onClick: onAddProduct } 
    : null;

  return (
    <AlertMessage 
      iconName="Package" 
      title={title} 
      message={message} 
      actionButton={actionButton} 
    />
  );
};

InventoryEmptyState.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onAddProduct: PropTypes.func.isRequired,
};

export default InventoryEmptyState;