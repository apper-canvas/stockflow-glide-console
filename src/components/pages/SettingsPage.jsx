import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import SectionHeader from '@/components/molecules/SectionHeader';
import Button from '@/components/atoms/Button';

import GeneralSettingsPanel from '@/components/organisms/GeneralSettingsPanel';
import InventorySettingsPanel from '@/components/organisms/InventorySettingsPanel';
import NotificationSettingsPanel from '@/components/organisms/NotificationSettingsPanel';
import ReportSettingsPanel from '@/components/organisms/ReportSettingsPanel';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
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
  });

  const defaultSettings = {
    companyName: 'StockFlow Pro',
    currency: 'USD',
    timezone: 'UTC',
    lowStockThreshold: 10,
    autoReorder: false,
    emailNotifications: true,
    smsNotifications: false,
    reportFrequency: 'weekly',
    backupFrequency: 'daily'
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast.success('Settings saved successfully');
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'Settings' },
    { id: 'inventory', label: 'Inventory', icon: 'Package' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3' }
  ];

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettingsPanel settings={settings} setSettings={setSettings} />;
      case 'inventory':
        return <InventorySettingsPanel settings={settings} setSettings={setSettings} />;
      case 'notifications':
        return <NotificationSettingsPanel settings={settings} setSettings={setSettings} />;
      case 'reports':
        return <ReportSettingsPanel settings={settings} setSettings={setSettings} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <SectionHeader 
        title="Settings" 
        description="Configure your inventory management preferences" 
      />

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
            {renderActivePanel()}
            
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={handleResetSettings}
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset to Defaults
                </Button>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-primary text-white hover:bg-primary/90"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;