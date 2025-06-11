import React from 'react';
import { motion } from 'framer-motion';
import ToggleSwitch from '@/components/atoms/ToggleSwitch';
import PropTypes from 'prop-types';

const NotificationSettingsPanel = ({ settings, setSettings }) => {
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
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <p className="text-secondary">Manage how you receive alerts and updates</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive notifications via email</p>
          </div>
          <ToggleSwitch
            checked={settings.emailNotifications}
            onChange={() => handleToggleChange('emailNotifications')}
          />
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Receive critical alerts via SMS</p>
          </div>
          <ToggleSwitch
            checked={settings.smsNotifications}
            onChange={() => handleToggleChange('smsNotifications')}
          />
        </div>
      </div>
    </motion.div>
  );
};

NotificationSettingsPanel.propTypes = {
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
};

export default NotificationSettingsPanel;