import React from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Select from '@/components/atoms/Select';
import PropTypes from 'prop-types';

const ReportSettingsPanel = ({ settings, setSettings }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

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
        <FormField label="Report Frequency">
          <Select name="reportFrequency" value={settings.reportFrequency} onChange={handleChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </Select>
          <p className="text-sm text-gray-600 mt-1">How often to generate automated reports</p>
        </FormField>

        <FormField label="Backup Frequency">
          <Select name="backupFrequency" value={settings.backupFrequency} onChange={handleChange}>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </Select>
          <p className="text-sm text-gray-600 mt-1">How often to backup your data</p>
        </FormField>
      </div>
    </motion.div>
  );
};

ReportSettingsPanel.propTypes = {
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
};

export default ReportSettingsPanel;