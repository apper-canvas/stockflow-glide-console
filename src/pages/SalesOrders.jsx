import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import orderService from '../services/api/orderService'
import productService from '../services/api/productService'

const SalesOrders = () => {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateOrder, setShowCreateOrder] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [ordersData, productsData] = await Promise.all([
        orderService.getAll(),
        productService.getAll()
      ])
      setOrders(ordersData.filter(order => order.type === 'sales'))
      setProducts(productsData)
    } catch (err) {
      setError(err.message || 'Failed to load sales orders')
      toast.error('Failed to load sales orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrder = async (orderData) => {
    try {
      const newOrder = await orderService.create({
        ...orderData,
        type: 'sales',
        orderNumber: `SO-${Date.now()}`,
        orderDate: new Date().toISOString(),
        status: 'pending'
      })
      setOrders(prev => [newOrder, ...prev])
      setShowCreateOrder(false)
      toast.success('Sales order created successfully')
    } catch (err) {
      toast.error('Failed to create sales order')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId)
      const updatedOrder = await orderService.update(orderId, {
        ...order,
        status: newStatus
      })
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      toast.success('Order status updated')
    } catch (err) {
      toast.error('Failed to update order status')
    }
  }

  const filteredOrders = orders.filter(order => 
    selectedStatus === 'all' || order.status === selectedStatus
  )

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning'
      case 'confirmed': return 'bg-info/10 text-info'
      case 'shipped': return 'bg-accent/10 text-accent'
      case 'completed': return 'bg-success/10 text-success'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-12 bg-white rounded-lg shadow-sm"
        >
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Orders</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
          <p className="text-secondary">Manage customer orders and fulfillment</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateOrder(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={18} />
          <span>Create Order</span>
        </motion.button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Orders
          </button>
          {['pending', 'confirmed', 'shipped', 'completed'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                selectedStatus === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <ApperIcon name="ShoppingBag" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sales Orders Found</h3>
            <p className="text-gray-600 mb-4">
              {selectedStatus === 'all' ? 'Create your first sales order to get started' : `No ${selectedStatus} orders found`}
            </p>
            {selectedStatus === 'all' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateOrder(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Order
              </motion.button>
            )}
          </motion.div>
        ) : (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-secondary mb-2">
                    Customer: {order.customerId} • {order.items?.length || 0} items
                  </p>
                  <p className="text-sm text-gray-600">
                    Order Date: {new Date(order.orderDate).toLocaleDateString()}
                    {order.expectedDate && (
                      <> • Expected: {new Date(order.expectedDate).toLocaleDateString()}</>
                    )}
                  </p>
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-900">Items:</p>
                    <div className="mt-1 space-y-1">
                      {order.items?.map((item, itemIndex) => (
                        <div key={itemIndex} className="text-sm text-gray-600 break-words">
                          {item.productName || `Product ${item.productId}`} - Qty: {item.quantity} @ ${item.unitPrice ? `$${item.unitPrice.toFixed(2)}` : 'N/A'}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-900">
                      Total: ${order.items?.reduce((total, item) => total + (item.quantity * (item.unitPrice || 0)), 0).toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                      className="px-3 py-1 bg-info text-white text-sm rounded-md hover:bg-info/90 transition-colors"
                    >
                      Confirm
                    </motion.button>
                  )}
                  {order.status === 'confirmed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                      className="px-3 py-1 bg-accent text-white text-sm rounded-md hover:bg-accent/90 transition-colors"
                    >
                      Ship Order
                    </motion.button>
                  )}
                  {order.status === 'shipped' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                      className="px-3 py-1 bg-success text-white text-sm rounded-md hover:bg-success/90 transition-colors"
                    >
                      Complete
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                  >
                    <ApperIcon name="Eye" size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Create Order Modal */}
      {showCreateOrder && (
        <CreateSalesOrderModal
          products={products}
          onSave={handleCreateOrder}
          onClose={() => setShowCreateOrder(false)}
        />
      )}
    </div>
  )
}

const CreateSalesOrderModal = ({ products, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    expectedDate: '',
    items: [{ productId: '', quantity: 1, unitPrice: 0 }]
  })

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const handleItemChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
    
    // Auto-fill product name and price when product is selected
    if (field === 'productId') {
      const product = products.find(p => p.id === value)
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
        }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.items.length === 0 || !formData.customerId) {
      toast.error('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Create Sales Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer ID</label>
              <input
                type="text"
                value={formData.customerId}
                onChange={(e) => setFormData(prev => ({ ...prev, customerId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery</label>
              <input
                type="date"
                value={formData.expectedDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Order Items</label>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors flex items-center space-x-1"
              >
                <ApperIcon name="Plus" size={14} />
                <span>Add Item</span>
              </motion.button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} ({product.sku})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="w-full px-3 py-2 text-error hover:bg-error/10 rounded-md transition-colors flex items-center justify-center"
                        disabled={formData.items.length === 1}
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </motion.button>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm font-medium text-gray-900">
                    Subtotal: ${(item.quantity * (item.unitPrice || 0)).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-right text-lg font-bold text-gray-900">
                  Total: ${formData.items.reduce((total, item) => total + (item.quantity * (item.unitPrice || 0)), 0).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Create Order
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default SalesOrders