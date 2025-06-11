import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import productService from '../services/api/productService'
import stockLevelService from '../services/api/stockLevelService'
import orderService from '../services/api/orderService'

const MainFeature = () => {
  const [products, setProducts] = useState([])
  const [stockLevels, setStockLevels] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [productsData, stockData, ordersData] = await Promise.all([
        productService.getAll(),
        stockLevelService.getAll(),
        orderService.getAll()
      ])
      setProducts(productsData)
      setStockLevels(stockData)
      setOrders(ordersData)
    } catch (err) {
      setError(err.message || 'Failed to load data')
      toast.error('Failed to load inventory data')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrder = async (productId, quantity) => {
    try {
      const product = products.find(p => p.id === productId)
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
      }
      
      const createdOrder = await orderService.create(newOrder)
      setOrders(prev => [createdOrder, ...prev])
      toast.success('Purchase order created successfully')
    } catch (err) {
      toast.error('Failed to create purchase order')
    }
  }

  const handleStockAdjustment = async (productId, adjustment) => {
    try {
      const stockLevel = stockLevels.find(s => s.productId === productId)
      if (stockLevel) {
        const updatedStock = await stockLevelService.update(stockLevel.id, {
          ...stockLevel,
          quantity: Math.max(0, stockLevel.quantity + adjustment),
          lastUpdated: new Date().toISOString()
        })
        setStockLevels(prev => prev.map(s => s.id === stockLevel.id ? updatedStock : s))
        toast.success('Stock level updated')
      }
    } catch (err) {
      toast.error('Failed to update stock level')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm"
          >
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </motion.div>
        ))}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
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

  const lowStockProducts = products.filter(product => {
    const stock = stockLevels.find(s => s.productId === product.id)
    return stock && stock.quantity <= product.reorderPoint
  })

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Total Products</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" size={24} className="text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Low Stock Items</p>
              <p className="text-2xl font-bold text-warning">{lowStockProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="AlertTriangle" size={24} className="text-warning" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Active Orders</p>
              <p className="text-2xl font-bold text-info">{orders.filter(o => o.status !== 'completed').length}</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingCart" size={24} className="text-info" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Total Value</p>
              <p className="text-2xl font-bold text-success">
                ${stockLevels.reduce((total, stock) => {
                  const product = products.find(p => p.id === stock.productId)
                  return total + (product ? stock.quantity * product.unitPrice : 0)
                }, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="DollarSign" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ApperIcon name="AlertTriangle" size={20} className="text-warning" />
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {lowStockProducts.map((product, index) => {
              const stock = stockLevels.find(s => s.productId === product.id)
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 break-words">{product.name}</h3>
                      <p className="text-sm text-secondary">SKU: {product.sku}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-sm">
                          Current: <span className="font-medium text-warning">{stock?.quantity || 0}</span>
                        </span>
                        <span className="text-sm">
                          Reorder Point: <span className="font-medium">{product.reorderPoint}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCreateOrder(product.id, product.reorderQuantity)}
                        className="px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Reorder
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStockAdjustment(product.id, 10)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                      >
                        Adjust
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <ApperIcon name="ShoppingCart" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
              <p className="text-gray-600">Create your first order to get started</p>
            </div>
          ) : (
            recentOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-secondary capitalize">{order.type} Order</p>
                    <p className="text-sm text-gray-600">
                      {order.items?.length || 0} items • {new Date(order.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-success/10 text-success' :
                      order.status === 'pending' ? 'bg-warning/10 text-warning' :
                      order.status === 'shipped' ? 'bg-info/10 text-info' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {order.status}
                    </span>
                    <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default MainFeature