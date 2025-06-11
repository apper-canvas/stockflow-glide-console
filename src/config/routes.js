import Dashboard from '../pages/Dashboard'
import Inventory from '../pages/Inventory'
import PurchaseOrders from '../pages/PurchaseOrders'
import SalesOrders from '../pages/SalesOrders'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
    component: Dashboard
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
    component: Inventory
  },
  purchaseOrders: {
    id: 'purchaseOrders',
    label: 'Purchase Orders',
    path: '/purchase-orders',
    icon: 'ShoppingCart',
    component: PurchaseOrders
  },
  salesOrders: {
    id: 'salesOrders',
    label: 'Sales Orders',
    path: '/sales-orders',
    icon: 'ShoppingBag',
    component: SalesOrders
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: Reports
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
}

export const routeArray = Object.values(routes)