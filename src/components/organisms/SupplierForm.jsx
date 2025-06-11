import React, { useState, useEffect } from 'react';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import PropTypes from 'prop-types';

const SupplierForm = ({ supplier, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    companyType: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA'
    },
    primaryContact: {
      name: '',
      title: '',
      email: '',
      phone: ''
    },
    paymentTerms: 'Net 30',
    currency: 'USD',
    minimumOrder: '',
    leadTime: '',
    certifications: [],
    categories: [],
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [certificationsInput, setCertificationsInput] = useState('');
  const [categoriesInput, setCategoriesInput] = useState('');

  // Predefined options
  const companyTypes = [
    'Manufacturing', 'Technology', 'Electronics', 'Logistics', 
    'Raw Materials', 'Chemicals', 'Textiles', 'Food & Beverage',
    'Automotive', 'Construction', 'Healthcare', 'Other'
  ];

  const paymentTermsOptions = [
    'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Net 90',
    'Cash on Delivery', '2/10 Net 30', 'Due on Receipt'
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CNY'];

  const countries = [
    'USA', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan',
    'China', 'Australia', 'India', 'Brazil', 'Mexico', 'Other'
  ];

  useEffect(() => {
    if (supplier) {
      setFormData({
        ...supplier,
        minimumOrder: supplier.minimumOrder?.toString() || '',
        leadTime: supplier.leadTime?.toString() || ''
      });
      setCertificationsInput(supplier.certifications?.join(', ') || '');
      setCategoriesInput(supplier.categories?.join(', ') || '');
    }
  }, [supplier]);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.companyType) newErrors.companyType = 'Company type is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Address validation
    if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
    if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
    if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
    if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'ZIP code is required';

    // Primary contact validation
    if (!formData.primaryContact.name.trim()) newErrors['primaryContact.name'] = 'Contact name is required';
    if (!formData.primaryContact.email.trim()) newErrors['primaryContact.email'] = 'Contact email is required';
    if (formData.primaryContact.email && !emailRegex.test(formData.primaryContact.email)) {
      newErrors['primaryContact.email'] = 'Please enter a valid email address';
    }

    // Numeric validations
    if (formData.minimumOrder && isNaN(parseFloat(formData.minimumOrder))) {
      newErrors.minimumOrder = 'Minimum order must be a valid number';
    }
    if (formData.leadTime && isNaN(parseInt(formData.leadTime))) {
      newErrors.leadTime = 'Lead time must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleArrayInputChange = (value, field) => {
    if (field === 'certifications') {
      setCertificationsInput(value);
      const array = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({ ...prev, certifications: array }));
    } else if (field === 'categories') {
      setCategoriesInput(value);
      const array = value.split(',').map(item => item.trim()).filter(item => item);
      setFormData(prev => ({ ...prev, categories: array }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        minimumOrder: parseFloat(formData.minimumOrder) || 0,
        leadTime: parseInt(formData.leadTime) || 0
      };
      
      await onSave(submitData);
    } catch (error) {
      console.error('Error saving supplier:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {supplier ? 'Edit Supplier' : 'Add New Supplier'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" size={24} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Company Name *"
              error={errors.name}
              required
            >
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter company name"
                error={!!errors.name}
              />
            </FormField>

            <FormField
              label="Company Type *"
              error={errors.companyType}
              required
            >
              <Select
                name="companyType"
                value={formData.companyType}
                onChange={handleChange}
                error={!!errors.companyType}
              >
                <option value="">Select company type</option>
                {companyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Email *"
              error={errors.email}
              required
            >
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                error={!!errors.email}
              />
            </FormField>

            <FormField
              label="Phone *"
              error={errors.phone}
              required
            >
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                error={!!errors.phone}
              />
            </FormField>

            <FormField
              label="Website"
              error={errors.website}
            >
              <Input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                error={!!errors.website}
              />
            </FormField>

            <FormField
              label="Tax ID"
              error={errors.taxId}
            >
              <Input
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
                placeholder="Enter tax ID"
                error={!!errors.taxId}
              />
            </FormField>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <FormField
                label="Street Address *"
                error={errors['address.street']}
                required
              >
                <Input
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Enter street address"
                  error={!!errors['address.street']}
                />
              </FormField>
            </div>

            <FormField
              label="City *"
              error={errors['address.city']}
              required
            >
              <Input
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Enter city"
                error={!!errors['address.city']}
              />
            </FormField>

            <FormField
              label="State/Province *"
              error={errors['address.state']}
              required
            >
              <Input
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                placeholder="Enter state or province"
                error={!!errors['address.state']}
              />
            </FormField>

            <FormField
              label="ZIP/Postal Code *"
              error={errors['address.zipCode']}
              required
            >
              <Input
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="Enter ZIP code"
                error={!!errors['address.zipCode']}
              />
            </FormField>

            <FormField
              label="Country"
              error={errors['address.country']}
            >
              <Select
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                error={!!errors['address.country']}
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </Select>
            </FormField>
          </div>
        </div>

        {/* Primary Contact */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Primary Contact</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Contact Name *"
              error={errors['primaryContact.name']}
              required
            >
              <Input
                name="primaryContact.name"
                value={formData.primaryContact.name}
                onChange={handleChange}
                placeholder="Enter contact name"
                error={!!errors['primaryContact.name']}
              />
            </FormField>

            <FormField
              label="Title"
              error={errors['primaryContact.title']}
            >
              <Input
                name="primaryContact.title"
                value={formData.primaryContact.title}
                onChange={handleChange}
                placeholder="Enter job title"
                error={!!errors['primaryContact.title']}
              />
            </FormField>

            <FormField
              label="Contact Email *"
              error={errors['primaryContact.email']}
              required
            >
              <Input
                type="email"
                name="primaryContact.email"
                value={formData.primaryContact.email}
                onChange={handleChange}
                placeholder="Enter contact email"
                error={!!errors['primaryContact.email']}
              />
            </FormField>

            <FormField
              label="Contact Phone"
              error={errors['primaryContact.phone']}
            >
              <Input
                type="tel"
                name="primaryContact.phone"
                value={formData.primaryContact.phone}
                onChange={handleChange}
                placeholder="Enter contact phone"
                error={!!errors['primaryContact.phone']}
              />
            </FormField>
          </div>
        </div>

        {/* Business Terms */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Business Terms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Payment Terms"
              error={errors.paymentTerms}
            >
              <Select
                name="paymentTerms"
                value={formData.paymentTerms}
                onChange={handleChange}
                error={!!errors.paymentTerms}
              >
                {paymentTermsOptions.map(term => (
                  <option key={term} value={term}>{term}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Currency"
              error={errors.currency}
            >
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                error={!!errors.currency}
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Minimum Order Value"
              error={errors.minimumOrder}
            >
              <Input
                type="number"
                name="minimumOrder"
                value={formData.minimumOrder}
                onChange={handleChange}
                placeholder="Enter minimum order value"
                error={!!errors.minimumOrder}
                min="0"
                step="0.01"
              />
            </FormField>

            <FormField
              label="Lead Time (days)"
              error={errors.leadTime}
            >
              <Input
                type="number"
                name="leadTime"
                value={formData.leadTime}
                onChange={handleChange}
                placeholder="Enter lead time in days"
                error={!!errors.leadTime}
                min="0"
              />
            </FormField>
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          <div className="space-y-4">
            <FormField
              label="Certifications"
              error={errors.certifications}
              help="Enter certifications separated by commas (e.g., ISO 9001, ISO 14001)"
            >
              <Input
                name="certifications"
                value={certificationsInput}
                onChange={(e) => handleArrayInputChange(e.target.value, 'certifications')}
                placeholder="ISO 9001, ISO 14001, CE"
                error={!!errors.certifications}
              />
            </FormField>

            <FormField
              label="Categories"
              error={errors.categories}
              help="Enter product/service categories separated by commas"
            >
              <Input
                name="categories"
                value={categoriesInput}
                onChange={(e) => handleArrayInputChange(e.target.value, 'categories')}
                placeholder="Electronics, Components, Manufacturing"
                error={!!errors.categories}
              />
            </FormField>

            <FormField
              label="Notes"
              error={errors.notes}
            >
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter any additional notes about this supplier"
                error={!!errors.notes}
                rows={3}
              />
            </FormField>
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 -mx-6 -mb-6">
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              loading={loading}
            >
              {supplier ? 'Update Supplier' : 'Create Supplier'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

SupplierForm.propTypes = {
  supplier: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default SupplierForm;