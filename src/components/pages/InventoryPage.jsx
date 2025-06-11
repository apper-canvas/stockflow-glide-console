import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SectionHeader from '@/components/molecules/SectionHeader';
import InventoryFilters from '@/components/organisms/InventoryFilters';
import ProductTable from '@/components/organisms/ProductTable';
import InventoryEmptyState from '@/components/organisms/InventoryEmptyState';
import Modal from '@/components/molecules/Modal';
import ProductForm from '@/components/organisms/ProductForm';
import AlertMessage from '@/components/atoms/AlertMessage';
import Spinner from '@/components/atoms/Spinner';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

import productService from '@/services/api/productService';
import stockLevelService from '@/services/api/stockLevelService';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, stockData] = await Promise.all([
        productService.getAll(),
        stockLevelService.getAll()
      ]);
      setProducts(productsData);
      setStockLevels(stockData);
    } catch (err) {
      setError(err.message || 'Failed to load inventory data');
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      const newProduct = await productService.create(productData);
      setProducts(prev => [newProduct, ...prev]);
      
      const stockLevel = {
        productId: newProduct.id,
        warehouseId: 'warehouse-1',
        quantity: 0,
        reservedQuantity: 0,
        availableQuantity: 0,
        lastUpdated: new Date().toISOString()
      };
      const newStock = await stockLevelService.create(stockLevel);
      setStockLevels(prev => [newStock, ...prev]);
      
      setShowProductModal(false);
      toast.success('Product created successfully');
    } catch (err) {
      toast.error('Failed to create product');
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      const updatedProduct = await productService.update(id, data);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      setEditingProduct(null);
      setShowProductModal(false); // Close modal after update
      toast.success('Product updated successfully');
    } catch (err) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setStockLevels(prev => prev.filter(s => s.productId !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      toast.error('Failed to delete product');
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="p-6">
        <AlertMessage 
          iconName="Loader" 
          title="Loading Inventory" 
          message={<Spinner className="text-primary-dark" />} 
          className="bg-white py-12"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage 
          iconName="AlertCircle" 
          title="Error Loading Inventory" 
          message={error} 
          actionButton={{ label: 'Retry', onClick: loadData }}
          className="bg-white py-12 text-error"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <SectionHeader 
          title="Inventory Management" 
          description="Manage your product catalog and stock levels" 
          className="mb-0"
        />
        <Button
          onClick={openAddProductModal}
          className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={18} />
          <span>Add Product</span>
        </Button>
      </div>

      <InventoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <InventoryEmptyState
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onAddProduct={openAddProductModal}
          />
        ) : (
          <ProductTable
            filteredProducts={filteredProducts}
            stockLevels={stockLevels}
            setEditingProduct={openEditProductModal} // Pass a function to open modal with product
            handleDeleteProduct={handleDeleteProduct}
          />
        )}
      </div>

      {showProductModal && (
        <Modal 
          title={editingProduct ? 'Edit Product' : 'Add New Product'} 
          onClose={closeProductModal}
          className="max-w-md"
        >
          <ProductForm
            product={editingProduct}
            onSave={editingProduct ? 
              (data) => handleUpdateProduct(editingProduct.id, data) : 
              handleCreateProduct
            }
            onClose={closeProductModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default InventoryPage;