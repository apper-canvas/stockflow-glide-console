import React from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import PropTypes from 'prop-types';

const GeneralSettingsPanel = ({ settings, setSettings }) => {
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
        <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
        <p className="text-secondary">Basic configuration for your inventory system</p>
      </div>

      <div className="space-y-6">
        <FormField label="Company Name">
          <Input
            type="text"
            name="companyName"
            value={settings.companyName}
            onChange={handleChange}
          />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="Currency">
            <Select name="currency" value={settings.currency} onChange={handleChange}>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </Select>
          </FormField>

          <FormField label="Timezone">
            <Select name="timezone" value={settings.timezone} onChange={handleChange}>
              <option value="UTC">UTC</option>
              <option value="EST">EST - Eastern Time</option>
              <option value="PST">PST - Pacific Time</option>
              <option value="GMT">GMT - Greenwich Mean Time</option>
            </Select>
          </FormField>
        </div>
      </div>
    </motion.div>
  );
};

GeneralSettingsPanel.propTypes = {
  settings: PropTypes.object.isRequired,
  setSettings: PropTypes.func.isRequired,
};

export default GeneralSettingsPanel;