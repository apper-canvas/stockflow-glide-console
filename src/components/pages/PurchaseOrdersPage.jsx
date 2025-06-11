import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SectionHeader from '@/components/molecules/SectionHeader';
import OrderListFilter from '@/components/organisms/OrderListFilter';
import PurchaseOrderList from '@/components/organisms/PurchaseOrderList';
import Modal from '@/components/molecules/Modal';
import CreatePurchaseOrderForm from '@/components/organisms/CreatePurchaseOrderForm';
import AlertMessage from '@/components/atoms/AlertMessage';
import Spinner from '@/components/atoms/Spinner';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

import orderService from '@/services/api/orderService';
import productService from '@/services/api/productService';

const PurchaseOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, productsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll()
      ]);
      setOrders(ordersData.filter(order => order.type === 'purchase'));
      setProducts(productsData);
    } catch (err) {
      setError(err.message || 'Failed to load purchase orders');
      toast.error('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await orderService.create({
        ...orderData,
        type: 'purchase',
        orderNumber: `PO-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: 'pending'
      });
      setOrders(prev => [newOrder, ...prev]);
      setShowCreateOrder(false);
      toast.success('Purchase order created successfully');
    } catch (err) {
      toast.error('Failed to create purchase order');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      const updatedOrder = await orderService.update(orderId, {
        ...order,
        status: newStatus
      });
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      toast.success('Order status updated');
    } catch (err) {
      toast.error('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  );

  if (loading) {
    return (
      <div className="p-6">
        <AlertMessage 
          iconName="Loader" 
          title="Loading Purchase Orders" 
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
          title="Error Loading Orders" 
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
          title="Purchase Orders" 
          description="Manage your purchase orders and supplier relationships" 
          className="mb-0"
        />
        <Button
          onClick={() => setShowCreateOrder(true)}
          className="bg-primary text-white hover:bg-primary/90 flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Plus" size={18} />
          <span>Create Order</span>
        </Button>
      </div>

      <OrderListFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        statuses={['pending', 'confirmed', 'shipped', 'completed']}
      />

      {filteredOrders.length === 0 ? (
        <AlertMessage
          iconName="ShoppingCart"
          title="No Purchase Orders Found"
          message={selectedStatus === 'all' ? 'Create your first purchase order to get started' : `No ${selectedStatus} orders found`}
          actionButton={selectedStatus === 'all' ? { label: 'Create Order', onClick: () => setShowCreateOrder(true) } : null}
        />
      ) : (
        <PurchaseOrderList
          filteredOrders={filteredOrders}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {showCreateOrder && (
        <Modal
          title="Create Purchase Order"
          onClose={() => setShowCreateOrder(false)}
          className="max-w-2xl"
        >
          <CreatePurchaseOrderForm
            products={products}
            onSave={handleCreateOrder}
            onClose={() => setShowCreateOrder(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default PurchaseOrdersPage;