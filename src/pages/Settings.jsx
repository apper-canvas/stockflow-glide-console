import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '../components/ApperIcon'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    companyName: 'StockFlow Pro',
    currency: 'USD',
    timezone: 'UTC',
    lowStockThreshold: 10,
    autoReorder: false,
    emailNotifications: true,
    smsNotifications: false,
    reportFrequency: 'weekly',
    backupFrequency: 'daily'
  })

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'inventory', label: 'Inventory', icon: 'Package' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3' }
  ]

  return (
    <div className="p-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-secondary">Configure your inventory management preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ApperIcon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {activeTab === 'general' && <GeneralSettings settings={settings} setSettings={setSettings} />}
            {activeTab === 'inventory' && <InventorySettings settings={settings} setSettings={setSettings} />}
            {activeTab === 'notifications' && <NotificationSettings settings={settings} setSettings={setSettings} />}
            {activeTab === 'reports' && <ReportSettings settings={settings} setSettings={setSettings} />}
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSettings({
                    companyName: 'StockFlow Pro',
                    currency: 'USD',
                    timezone: 'UTC',
                    lowStockThreshold: 10,
                    autoReorder: false,
                    emailNotifications: true,
                    smsNotifications: false,
                    reportFrequency: 'weekly',
                    backupFrequency: 'daily'
                  })}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset to Defaults
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSaveSettings}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const GeneralSettings = ({ settings, setSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
        <p className="text-secondary">Basic configuration for your inventory system</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="UTC">UTC</option>
              <option value="EST">EST - Eastern Time</option>
              <option value="PST">PST - Pacific Time</option>
              <option value="GMT">GMT - Greenwich Mean Time</option>
            </select>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const InventorySettings = ({ settings, setSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Inventory Settings</h3>
        <p className="text-secondary">Configure inventory management preferences</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
          <input
            type="number"
            value={settings.lowStockThreshold}
            onChange={(e) => setSettings(prev => ({ ...prev, lowStockThreshold: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            min="0"
          />
          <p className="text-sm text-gray-600 mt-1">Default threshold for low stock alerts</p>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Automatic Reordering</h4>
            <p className="text-sm text-gray-600">Automatically create purchase orders when stock is low</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, autoReorder: !prev.autoReorder }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.autoReorder ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.autoReorder ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const NotificationSettings = ({ settings, setSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <p className="text-secondary">Manage how you receive alerts and updates</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive notifications via email</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.emailNotifications ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, smsNotifications: !prev.smsNotifications }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.smsNotifications ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const ReportSettings = ({ settings, setSettings }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Report Settings</h3>
        <p className="text-secondary">Configure automated reports and backups</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report Frequency</label>
          <select
            value={settings.reportFrequency}
            onChange={(e) => setSettings(prev => ({ ...prev, reportFrequency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">How often to generate automated reports</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => setSettings(prev => ({ ...prev, backupFrequency: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <p className="text-sm text-gray-600 mt-1">How often to backup your data</p>
        </div>
      </div>
    </motion.div>
  )
}

export default Settings