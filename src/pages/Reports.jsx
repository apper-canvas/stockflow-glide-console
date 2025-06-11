import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'
import productService from '../services/api/productService'
import stockLevelService from '../services/api/stockLevelService'
import orderService from '../services/api/orderService'
import stockMovementService from '../services/api/stockMovementService'

const Reports = () => {
  const [products, setProducts] = useState([])
  const [stockLevels, setStockLevels] = useState([])
  const [orders, setOrders] = useState([])
  const [stockMovements, setStockMovements] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedReport, setSelectedReport] = useState('inventory')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [productsData, stockData, ordersData, movementsData] = await Promise.all([
        productService.getAll(),
        stockLevelService.getAll(),
        orderService.getAll(),
        stockMovementService.getAll()
      ])
      setProducts(productsData)
      setStockLevels(stockData)
      setOrders(ordersData)
      setStockMovements(movementsData)
    } catch (err) {
      setError(err.message || 'Failed to load report data')
      toast.error('Failed to load report data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Reports</h3>
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

  const totalInventoryValue = stockLevels.reduce((total, stock) => {
    const product = products.find(p => p.id === stock.productId)
    return total + (product ? stock.quantity * product.unitPrice : 0)
  }, 0)

  const lowStockProducts = products.filter(product => {
    const stock = stockLevels.find(s => s.productId === product.id)
    return stock && stock.quantity <= product.reorderPoint
  })

  const recentMovements = stockMovements.slice(0, 10)
  const purchaseOrders = orders.filter(o => o.type === 'purchase')
  const salesOrders = orders.filter(o => o.type === 'sales')

  const categoryDistribution = products.reduce((acc, product) => {
    const stock = stockLevels.find(s => s.productId === product.id)
    const value = stock ? stock.quantity * product.unitPrice : 0
    acc[product.category] = (acc[product.category] || 0) + value
    return acc
  }, {})

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-secondary">View comprehensive reports and insights</p>
      </div>

      {/* Report Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'inventory', label: 'Inventory Report', icon: 'Package' },
            { id: 'orders', label: 'Orders Report', icon: 'ShoppingCart' },
            { id: 'movements', label: 'Stock Movements', icon: 'ArrowUpDown' },
            { id: 'valuation', label: 'Stock Valuation', icon: 'DollarSign' }
          ].map(report => (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedReport === report.id 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <ApperIcon name={report.icon} size={16} />
              <span>{report.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-6">
        {selectedReport === 'inventory' && (
          <InventoryReport 
            products={products} 
            stockLevels={stockLevels} 
            lowStockProducts={lowStockProducts}
          />
        )}
        
        {selectedReport === 'orders' && (
          <OrdersReport 
            purchaseOrders={purchaseOrders} 
            salesOrders={salesOrders}
          />
        )}
        
        {selectedReport === 'movements' && (
          <StockMovementsReport 
            movements={recentMovements} 
            products={products}
          />
        )}
        
        {selectedReport === 'valuation' && (
          <ValuationReport 
            totalValue={totalInventoryValue}
            categoryDistribution={categoryDistribution}
            products={products}
            stockLevels={stockLevels}
          />
        )}
      </div>
    </div>
  )
}

const InventoryReport = ({ products, stockLevels, lowStockProducts }) => {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
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
              <p className="text-sm font-medium text-secondary">Total Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {stockLevels.reduce((total, stock) => total + stock.quantity, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Boxes" size={24} className="text-info" />
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
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(products.map(p => p.category))].length}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Grid3x3" size={24} className="text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Low Stock Alert */}
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
              <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockProducts.map((product, index) => {
                const stock = stockLevels.find(s => s.productId === product.id)
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 border border-warning/20 rounded-lg bg-warning/5"
                  >
                    <h4 className="font-medium text-gray-900 break-words">{product.name}</h4>
                    <p className="text-sm text-secondary">SKU: {product.sku}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm">
                        Stock: <span className="font-medium text-warning">{stock?.quantity || 0}</span>
                      </span>
                      <span className="text-sm">
                        Reorder: <span className="font-medium">{product.reorderPoint}</span>
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

const OrdersReport = ({ purchaseOrders, salesOrders }) => {
  const totalPurchaseValue = purchaseOrders.reduce((total, order) => {
    return total + (order.items?.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0) || 0)
  }, 0)

  const totalSalesValue = salesOrders.reduce((total, order) => {
    return total + (order.items?.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0) || 0)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary">Purchase Orders</p>
              <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingCart" size={24} className="text-primary" />
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
              <p className="text-sm font-medium text-secondary">Sales Orders</p>
              <p className="text-2xl font-bold text-gray-900">{salesOrders.length}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={24} className="text-success" />
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
              <p className="text-sm font-medium text-secondary">Purchase Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalPurchaseValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingDown" size={24} className="text-error" />
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
              <p className="text-sm font-medium text-secondary">Sales Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalSalesValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" size={24} className="text-success" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Purchase Order Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['pending', 'confirmed', 'shipped', 'completed'].map(status => {
                const count = purchaseOrders.filter(o => o.status === status).length
                const percentage = purchaseOrders.length > 0 ? (count / purchaseOrders.length) * 100 : 0
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-3 h-3 rounded-full ${
                        status === 'pending' ? 'bg-warning' :
                        status === 'confirmed' ? 'bg-info' :
                        status === 'shipped' ? 'bg-accent' :
                        'bg-success'
                      }`}></span>
                      <span className="capitalize text-gray-700">{status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{count}</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            status === 'pending' ? 'bg-warning' :
                            status === 'confirmed' ? 'bg-info' :
                            status === 'shipped' ? 'bg-accent' :
                            'bg-success'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Sales Order Status</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {['pending', 'confirmed', 'shipped', 'completed'].map(status => {
                const count = salesOrders.filter(o => o.status === status).length
                const percentage = salesOrders.length > 0 ? (count / salesOrders.length) * 100 : 0
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={`w-3 h-3 rounded-full ${
                        status === 'pending' ? 'bg-warning' :
                        status === 'confirmed' ? 'bg-info' :
                        status === 'shipped' ? 'bg-accent' :
                        'bg-success'
                      }`}></span>
                      <span className="capitalize text-gray-700">{status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{count}</span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            status === 'pending' ? 'bg-warning' :
                            status === 'confirmed' ? 'bg-info' :
                            status === 'shipped' ? 'bg-accent' :
                            'bg-success'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const StockMovementsReport = ({ movements, products }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200"
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Stock Movements</h3>
      </div>
      <div className="p-6">
        {movements.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="ArrowUpDown" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No stock movements recorded</p>
          </div>
        ) : (
          <div className="space-y-4">
            {movements.map((movement, index) => {
              const product = products.find(p => p.id === movement.productId)
              return (
                <motion.div
                  key={movement.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      movement.type === 'receipt' ? 'bg-success/10' :
                      movement.type === 'shipment' ? 'bg-error/10' :
                      movement.type === 'transfer' ? 'bg-info/10' :
                      'bg-warning/10'
                    }`}>
                      <ApperIcon 
                        name={
                          movement.type === 'receipt' ? 'ArrowDown' :
                          movement.type === 'shipment' ? 'ArrowUp' :
                          movement.type === 'transfer' ? 'ArrowRightLeft' :
                          'Edit'
                        } 
                        size={18} 
                        className={
                          movement.type === 'receipt' ? 'text-success' :
                          movement.type === 'shipment' ? 'text-error' :
                          movement.type === 'transfer' ? 'text-info' :
                          'text-warning'
                        }
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 break-words">
                        {product?.name || `Product ${movement.productId}`}
                      </h4>
                      <p className="text-sm text-secondary capitalize">
                        {movement.type} • {movement.quantity} units
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(movement.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {movement.fromLocation && movement.toLocation 
                        ? `${movement.fromLocation} → ${movement.toLocation}`
                        : movement.toLocation || movement.fromLocation || 'Warehouse'
                      }
                    </p>
                    {movement.notes && (
                      <p className="text-sm text-gray-600 break-words">{movement.notes}</p>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const ValuationReport = ({ totalValue, categoryDistribution, products, stockLevels }) => {
  return (
    <div className="space-y-6">
      {/* Total Value Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 text-center"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Inventory Value</h3>
        <p className="text-4xl font-bold text-primary">${totalValue.toLocaleString()}</p>
        <p className="text-secondary mt-2">Based on current stock levels and unit prices</p>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Value by Category</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(categoryDistribution).map(([category, value], index) => {
              const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-primary rounded-full" style={{ 
                      backgroundColor: `hsl(${index * 45}, 70%, 50%)` 
                    }}></div>
                    <span className="font-medium text-gray-900">{category}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium">${value.toLocaleString()}</span>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: `hsl(${index * 45}, 70%, 50%)`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-secondary w-12 text-right">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Top Value Products */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Top Value Products</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {products
              .map(product => {
                const stock = stockLevels.find(s => s.productId === product.id)
                const value = stock ? stock.quantity * product.unitPrice : 0
                return { ...product, stockValue: value, stockQuantity: stock?.quantity || 0 }
              })
              .sort((a, b) => b.stockValue - a.stockValue)
              .slice(0, 10)
              .map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Package" size={16} className="text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-gray-900 break-words">{product.name}</h4>
                      <p className="text-sm text-secondary">
                        {product.stockQuantity} units @ ${product.unitPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${product.stockValue.toLocaleString()}
                    </p>
                    <p className="text-sm text-secondary">{product.category}</p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Reports