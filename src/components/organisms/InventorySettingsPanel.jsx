import React from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import PropTypes from 'prop-types';

const InventorySettingsPanel = ({ settings, setSettings }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleToggleChange = (name) => {
    setSettings(prev => ({ ...prev, [name]: !prev[name] }));
  };

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
        <FormField label="Low Stock Threshold">
          <Input
            type="number"
            name="lowStockThreshold"
            value={settings.lowStockThreshold}
            onChange={handleChange}
            min="0"
          />
          <p className="text-sm text-gray-600 mt-1">Default threshold for low stock alerts</p>
        </FormField>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Automatic Reordering</h4>
            <p className="text-sm text-gray-600">Automatically create purchase orders when stock is low</p>
          </div>
          <ToggleSwitch
            checked={settings.autoReorder}
            onChange={() => handleToggleChange('autoReorder')}
          />
        </div>
      </div>
    </motion.div>
  );
};

InventorySettingsPanel.propTypes = {
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
};

export default InventorySettingsPanel;