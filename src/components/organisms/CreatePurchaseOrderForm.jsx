import React, { useState } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';
import Label from '@/components/atoms/Label';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

const CreatePurchaseOrderForm = ({ products, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    expectedDate: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }]
  });

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
    
// Auto-fill product name and price when product is selected
    if (field === 'productId') {
      const product = products?.find(p => p.id === value);
      if (product) {
        setFormData(prev => ({
          ...prev,
          items: prev.items.map((item, i) =>
            i === index ? { 
              ...item, 
              productId: value,
              productName: product.name,
              unitPrice: product.unitPrice 
            } : item
          )
        }));
      }
    }
  };

const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.items.length === 0 || !formData.supplierId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Validate that all items have required fields
    const invalidItems = formData.items.some(item => 
      !item.productId || item.quantity <= 0 || item.unitPrice <= 0
    );
    
    if (invalidItems) {
      toast.error('Please complete all item details');
      return;
    }
    
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Supplier ID">
          <Input type="text" value={formData.supplierId} onChange={(e) => setFormData(prev => ({ ...prev, supplierId: e.target.value }))} required />
        </FormField>
        <FormField label="Expected Date">
          <Input type="date" value={formData.expectedDate} onChange={(e) => setFormData(prev => ({ ...prev, expectedDate: e.target.value }))} />
        </FormField>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <Label>Order Items</Label>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleAddItem}
            className="px-3 py-1 bg-primary text-white text-sm hover:bg-primary/90 flex items-center space-x-1"
          >
            <ApperIcon name="Plus" size={14} />
            <span>Add Item</span>
          </Button>
        </div>

        <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FormField label="Product">
                  <Select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    required
>
                    <option value="">Select Product</option>
                    {products?.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.sku})
                      </option>
                    ))}
                  </Select>
                </FormField>
                <FormField label="Quantity">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                    required
                  />
                </FormField>
                <FormField label="Unit Price ($)">
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    required
                  />
                </FormField>
                <div className="flex items-end">
                  <Button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="w-full px-3 py-2 text-error hover:bg-error/10 flex items-center justify-center"
                    disabled={formData.items.length === 1}
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          onClick={onClose}
          className="text-gray-700 bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </Button>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-primary text-white hover:bg-primary/90"
        >
          Create Order
        </Button>
      </div>
    </form>
  );
};

CreatePurchaseOrderForm.propTypes = {
  products: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CreatePurchaseOrderForm;