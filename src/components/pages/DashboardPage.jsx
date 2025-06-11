import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DashboardStats from '@/components/organisms/DashboardStats';
import DashboardLowStockAlerts from '@/components/organisms/DashboardLowStockAlerts';
import DashboardRecentOrders from '@/components/organisms/DashboardRecentOrders';
import AlertMessage from '@/components/atoms/AlertMessage';
import Spinner from '@/components/atoms/Spinner';

import productService from '@/services/api/productService';
import stockLevelService from '@/services/api/stockLevelService';
import orderService from '@/services/api/orderService';

const DashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, stockData, ordersData] = await Promise.all([
        productService.getAll(),
        stockLevelService.getAll(),
        orderService.getAll()
      ]);
      setProducts(productsData);
      setStockLevels(stockData);
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (productId, quantity) => {
    try {
      const product = products.find(p => p.id === productId);
      const newOrder = {
        orderNumber: `PO-${Date.now()}`,
        type: 'purchase',
        status: 'pending',
        supplierId: 'supplier-1',
        items: [{
          productId,
          productName: product.name,
          quantity,
          unitPrice: product.unitPrice
        }],
        orderDate: new Date().toISOString(),
        expectedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const createdOrder = await orderService.create(newOrder);
      setOrders(prev => [createdOrder, ...prev]);
      toast.success('Purchase order created successfully');
    } catch (err) {
      toast.error('Failed to create purchase order');
    }
  };

  const handleStockAdjustment = async (productId, adjustment) => {
    try {
      const stockLevel = stockLevels.find(s => s.productId === productId);
      if (stockLevel) {
        const updatedStock = await stockLevelService.update(stockLevel.id, {
          ...stockLevel,
          quantity: Math.max(0, stockLevel.quantity + adjustment),
          lastUpdated: new Date().toISOString()
        });
        setStockLevels(prev => prev.map(s => s.id === stockLevel.id ? updatedStock : s));
        toast.success('Stock level updated');
      }
    } catch (err) {
      toast.error('Failed to update stock level');
    }
  };

  const lowStockProducts = products.filter(product => {
    const stock = stockLevels.find(s => s.productId === product.id);
    return stock && stock.quantity <= product.reorderPoint;
  });

  const recentOrders = orders.slice(0, 5);

  const totalInventoryValue = stockLevels.reduce((total, stock) => {
    const product = products.find(p => p.id === stock.productId);
    return total + (product ? stock.quantity * product.unitPrice : 0);
  }, 0);

  if (loading) {
    return (
      <div className="p-6">
        <AlertMessage 
          iconName="Loader" 
          title="Loading Dashboard Data" 
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
          title="Error Loading Data" 
          message={error} 
          actionButton={{ label: 'Retry', onClick: loadData }}
          className="bg-white py-12 text-error"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <DashboardStats
        productsCount={products.length}
        lowStockCount={lowStockProducts.length}
        activeOrdersCount={orders.filter(o => o.status !== 'completed').length}
        totalInventoryValue={totalInventoryValue}
      />
      <DashboardLowStockAlerts
        lowStockProducts={lowStockProducts}
        stockLevels={stockLevels}
        handleCreateOrder={handleCreateOrder}
        handleStockAdjustment={handleStockAdjustment}
      />
      <DashboardRecentOrders
        recentOrders={recentOrders}
      />
    </div>
  );
};

export default DashboardPage;