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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
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

  const handleViewOrder = async (orderId) => {
    try {
      setLoading(true);
      const order = await orderService.getById(orderId);
      setSelectedOrder(order);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

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
          onViewOrder={handleViewOrder}
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

      {showOrderDetails && selectedOrder && (
        <Modal
          title={`Purchase Order Details - ${selectedOrder.orderNumber}`}
          onClose={() => {
            setShowOrderDetails(false);
            setSelectedOrder(null);
          }}
          className="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-medium">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date:</span>
                    <span>{new Date(selectedOrder.orderDate).toLocaleDateString()}</span>
                  </div>
                  {selectedOrder.expectedDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Date:</span>
                      <span>{new Date(selectedOrder.expectedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Supplier Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Supplier ID:</span>
                    <span>{selectedOrder.supplierId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Items:</span>
                    <span>{selectedOrder.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-medium">
                      ${selectedOrder.items?.reduce((total, item) => 
                        total + (item.quantity * (item.unitPrice || 0)), 0
                      ).toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.productName || `Product ${item.productId}`}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          ${item.unitPrice?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          ${((item.quantity || 0) * (item.unitPrice || 0)).toFixed(2)}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                          No items found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedOrder.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedOrder.notes}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PurchaseOrdersPage;