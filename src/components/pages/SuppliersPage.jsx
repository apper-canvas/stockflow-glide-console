import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SectionHeader from '@/components/molecules/SectionHeader';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import SupplierCard from '@/components/organisms/SupplierCard';
import SupplierForm from '@/components/organisms/SupplierForm';
import supplierService from '@/services/api/supplierService';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    category: 'all',
    minRating: '',
    sortBy: 'name',
    page: 1,
    limit: 12
  });
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    page: 1
  });

  // Load suppliers and categories
  useEffect(() => {
    loadSuppliers();
    loadCategories();
  }, [filters]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await supplierService.getAll(filters);
      setSuppliers(response.data);
      setPagination({
        total: response.total,
        totalPages: response.totalPages,
        page: response.page
      });
      setError(null);
    } catch (err) {
      setError('Failed to load suppliers');
      console.error('Error loading suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await supplierService.getCategories();
      setCategories(categoriesList);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleAddSupplier = () => {
    setEditingSupplier(null);
    setShowForm(true);
  };

  const handleEditSupplier = (supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleDeleteSupplier = async (supplierId) => {
    if (!window.confirm('Are you sure you want to deactivate this supplier?')) {
      return;
    }

    try {
      await supplierService.delete(supplierId);
      toast.success('Supplier deactivated successfully');
      loadSuppliers();
    } catch (err) {
      toast.error(err.message || 'Failed to deactivate supplier');
    }
  };

  const handleSaveSupplier = async (supplierData) => {
    try {
      if (editingSupplier) {
        await supplierService.update(editingSupplier.id, supplierData);
        toast.success('Supplier updated successfully');
      } else {
        await supplierService.create(supplierData);
        toast.success('Supplier created successfully');
      }
      
      setShowForm(false);
      setEditingSupplier(null);
      loadSuppliers();
    } catch (err) {
      toast.error(err.message || 'Failed to save supplier');
    }
  };

  const handleUpdateRating = async (supplierId, ratings) => {
    try {
      await supplierService.updateRating(supplierId, ratings);
      toast.success('Supplier rating updated');
      loadSuppliers();
    } catch (err) {
      toast.error(err.message || 'Failed to update rating');
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === pagination.page ? 'primary' : 'outline'}
          size="sm"
          onClick={() => handlePageChange(i)}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }

    return (
      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          <ApperIcon name="ChevronLeft" size={16} />
          Previous
        </Button>
        {pages}
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          Next
          <ApperIcon name="ChevronRight" size={16} />
        </Button>
      </div>
    );
  };

  if (loading && suppliers.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Supplier Management"
        subtitle="Manage your suppliers, ratings, and performance metrics"
        icon="Users"
      />

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Suppliers
            </label>
            <Input
              type="text"
              placeholder="Search by name, email, or category..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              icon="Search"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <Select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Rating
            </label>
            <Select
              value={filters.minRating}
              onChange={(e) => handleFilterChange('minRating', e.target.value)}
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="name">Name</option>
              <option value="rating">Rating</option>
              <option value="created">Date Created</option>
              <option value="updated">Last Updated</option>
            </Select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {suppliers.length} of {pagination.total} suppliers
          </div>
          <Button
            variant="primary"
            onClick={handleAddSupplier}
            icon="Plus"
          >
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Suppliers Grid */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <AnimatePresence>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier) => (
            <motion.div
              key={supplier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <SupplierCard
                supplier={supplier}
                onEdit={handleEditSupplier}
                onDelete={handleDeleteSupplier}
                onUpdateRating={handleUpdateRating}
              />
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {/* Empty State */}
      {suppliers.length === 0 && !loading && (
        <div className="text-center py-12">
          <ApperIcon name="Users" size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
          <p className="text-gray-500 mb-4">
            {filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.minRating
              ? 'Try adjusting your filters to see more results.'
              : 'Get started by adding your first supplier.'}
          </p>
          <Button variant="primary" onClick={handleAddSupplier} icon="Plus">
            Add Supplier
          </Button>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && renderPagination()}

      {/* Supplier Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              <SupplierForm
                supplier={editingSupplier}
                onSave={handleSaveSupplier}
                onClose={() => {
                  setShowForm(false);
                  setEditingSupplier(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuppliersPage;