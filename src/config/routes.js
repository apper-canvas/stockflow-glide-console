import DashboardPage from '@/components/pages/DashboardPage'
import InventoryPage from '@/components/pages/InventoryPage'
import PurchaseOrdersPage from '@/components/pages/PurchaseOrdersPage'
import SalesOrdersPage from '@/components/pages/SalesOrdersPage'
import SuppliersPage from '@/components/pages/SuppliersPage'
import ReportsPage from '@/components/pages/ReportsPage'
import SettingsPage from '@/components/pages/SettingsPage'

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'LayoutDashboard',
component: DashboardPage
  },
  inventory: {
    id: 'inventory',
    label: 'Inventory',
    path: '/inventory',
    icon: 'Package',
component: InventoryPage
  },
  purchaseOrders: {
    id: 'purchaseOrders',
    label: 'Purchase Orders',
    path: '/purchase-orders',
    icon: 'ShoppingCart',
component: PurchaseOrdersPage
  },
salesOrders: {
    id: 'salesOrders',
    label: 'Sales Orders',
    path: '/sales-orders',
    icon: 'ShoppingBag',
    component: SalesOrdersPage
  },
  suppliers: {
    id: 'suppliers',
    label: 'Suppliers',
    path: '/suppliers',
    icon: 'Truck',
    component: SuppliersPage
  },
  reports: {
    id: 'reports',
    label: 'Reports',
    path: '/reports',
    icon: 'BarChart3',
    component: ReportsPage
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: SettingsPage
  }
}

export const routeArray = Object.values(routes)