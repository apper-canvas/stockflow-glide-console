import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    description: '',
    category: '',
    unitPrice: 0,
    unit: 'pcs',
    reorderPoint: 10,
    reorderQuantity: 50
  });

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku || '',
        name: product.name || '',
        description: product.description || '',
        category: product.category || '',
        unitPrice: product.unitPrice || 0,
        unit: product.unit || 'pcs',
        reorderPoint: product.reorderPoint || 10,
        reorderQuantity: product.reorderQuantity || 50
      });
    } else {
      setFormData({
        sku: '', name: '', description: '', category: '', unitPrice: 0,
        unit: 'pcs', reorderPoint: 10, reorderQuantity: 50
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="SKU">
          <Input type="text" name="sku" value={formData.sku} onChange={handleChange} required />
        </FormField>
        <FormField label="Category">
          <Input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </FormField>
      </div>

      <FormField label="Product Name">
        <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </FormField>

      <FormField label="Description">
        <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Unit Price ($)">
          <Input type="number" name="unitPrice" step="0.01" value={formData.unitPrice} onChange={handleChange} required />
        </FormField>
        <FormField label="Unit">
          <Select name="unit" value={formData.unit} onChange={handleChange}>
            <option value="pcs">Pieces</option>
            <option value="kg">Kilograms</option>
            <option value="lbs">Pounds</option>
            <option value="box">Boxes</option>
            <option value="case">Cases</option>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Reorder Point">
          <Input type="number" name="reorderPoint" value={formData.reorderPoint} onChange={handleChange} required />
        </FormField>
        <FormField label="Reorder Quantity">
          <Input type="number" name="reorderQuantity" value={formData.reorderQuantity} onChange={handleChange} required />
        </FormField>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          onClick={onClose}
          className="text-gray-700 bg-gray-200 hover:bg-gray-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-primary text-white hover:bg-primary/90"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {product ? 'Update' : 'Create'} Product
        </Button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  product: PropTypes.object, // Can be null for new products
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProductForm;