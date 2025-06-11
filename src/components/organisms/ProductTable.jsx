import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const ProductTable = ({ filteredProducts, stockLevels, setEditingProduct, handleDeleteProduct }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-surface">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Product</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Category</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Stock</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {filteredProducts.map((product, index) => {
            const stock = stockLevels.find(s => s.productId === product.id);
            const isLowStock = stock && stock.quantity <= product.reorderPoint;
            const stockStatus = isLowStock ? 'low stock' : (stock?.quantity > 0 ? 'in stock' : 'out of stock');
            
            return (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Package" size={18} className="text-gray-600" />
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 break-words">{product.name}</div>
                      <div className="text-sm text-secondary">SKU: {product.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                    {product.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`font-medium ${isLowStock ? 'text-warning' : 'text-gray-900'}`}>
                      {stock?.quantity || 0}
                    </span>
                    <span className="text-secondary">{product.unit}</span>
                    {isLowStock && (
                      <ApperIcon name="AlertTriangle" size={16} className="text-warning" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    ${product.unitPrice.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={stockStatus} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      onClick={() => setEditingProduct(product)}
                      className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name="Edit" size={16} />
                    </Button>
                    <Button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-1 text-gray-600 hover:text-error hover:bg-error/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

ProductTable.propTypes = {
  filteredProducts: PropTypes.array.isRequired,
  stockLevels: PropTypes.array.isRequired,
  setEditingProduct: PropTypes.func.isRequired,
  handleDeleteProduct: PropTypes.func.isRequired,
};

export default ProductTable;