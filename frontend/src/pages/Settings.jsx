import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Lock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    currency: 'INR',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',

    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: true,
    monthlyReports: true,

    // Privacy Settings
    dataSharing: false,
    analytics: true,
    crashReports: true,

    // Security Settings
    twoFactorAuth: false,
    biometric: false,
    sessionTimeout: '30'
  });

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        // General
        language: user.language || 'en',
        currency: user.currency || 'INR',
        dateFormat: user.dateFormat || 'dd/mm/yyyy',
        timeFormat: user.timeFormat || '24h',

        // Notifications
        emailNotifications: user.notifications?.email ?? true,
        pushNotifications: user.notifications?.push ?? true,
        budgetAlerts: user.notifications?.budget ?? true,
        goalReminders: user.notifications?.goals ?? true,
        weeklyReports: user.notifications?.reports ?? true,
        monthlyReports: user.notifications?.reports ?? true,

        // Privacy
        dataSharing: user.privacy?.dataSharing ?? false,
        analytics: user.privacy?.analytics ?? true,
        crashReports: user.privacy?.crashReports ?? true,

        // Security
        twoFactorAuth: user.security?.twoFactorAuth ?? false,
        biometric: user.security?.biometric ?? false,
        sessionTimeout: user.security?.sessionTimeout || '30'
      }));
    }
  }, [user]);

  const currencies = [
    { code: 'INR', name: 'Indian Rupee (₹)' },
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'JPY', name: 'Japanese Yen (¥)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' },
    { code: 'AUD', name: 'Australian Dollar (A$)' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'data', label: 'Data', icon: Database }
  ];

  const handleSave = async () => {
    try {
      setLoading(true);

      // Update user profile with relevant settings
      const profileData = {
        currency: settings.currency,
        language: settings.language,
        dateFormat: settings.dateFormat,
        timeFormat: settings.timeFormat,
        notifications: {
          email: settings.emailNotifications,
          push: settings.pushNotifications,
          budget: settings.budgetAlerts,
          goals: settings.goalReminders,
          reports: settings.weeklyReports || settings.monthlyReports
        },
        privacy: {
          dataSharing: settings.dataSharing,
          analytics: settings.analytics,
          crashReports: settings.crashReports
        },
        security: {
          twoFactorAuth: settings.twoFactorAuth,
          biometric: settings.biometric,
          sessionTimeout: settings.sessionTimeout
        }
      };

      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };





  const exportData = async () => {
    try {
      toast.loading('Exporting data...');
      const response = await authService.exportData();
      toast.dismiss();

      if (response.success && response.data) {
        const dataStr = JSON.stringify(response.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `expense-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Data exported successfully');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to export data');
    }
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            toast.loading('Importing data...');
            const data = JSON.parse(event.target.result);
            const response = await authService.importData(data);
            toast.dismiss();

            if (response.success) {
              toast.success('Data imported successfully');
              setTimeout(() => window.location.reload(), 1500);
            }
          } catch (error) {
            toast.dismiss();
            toast.error('Failed to import data: ' + (error.message || 'Invalid format'));
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const clearCache = () => {
    if (window.confirm('This will clear all cached data. Continue?')) {
      localStorage.clear();
      toast.success('Cache cleared successfully');
    }
  };

  const TabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">General Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                    className="input-field"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                    className="input-field"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>{currency.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value })}
                    className="input-field"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Format</label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value })}
                    className="input-field"
                  >
                    <option value="12h">12 Hour</option>
                    <option value="24h">24 Hour</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-sm text-gray-500">Toggle between light and dark themes</p>
                  </div>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  style={{ backgroundColor: theme === 'dark' ? '#3B82F6' : '#D1D5DB' }}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>

            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive push notifications on your device' },
                { key: 'budgetAlerts', label: 'Budget Alerts', description: 'Get notified when approaching budget limits' },
                { key: 'goalReminders', label: 'Goal Reminders', description: 'Reminders about your savings goals' },
                { key: 'weeklyReports', label: 'Weekly Reports', description: 'Receive weekly financial summaries' },
                { key: 'monthlyReports', label: 'Monthly Reports', description: 'Receive monthly financial reports' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>

            <div className="space-y-4">
              {[
                { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized data to improve services' },
                { key: 'analytics', label: 'Analytics', description: 'Help us improve the app with usage analytics' },
                { key: 'crashReports', label: 'Crash Reports', description: 'Automatically send crash reports for debugging' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[item.key]}
                      onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="btn-secondary">
                  {settings.twoFactorAuth ? 'Disable' : 'Enable'}
                </button>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Biometric Authentication</p>
                  <p className="text-sm text-gray-500">Use fingerprint or face unlock</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.biometric}
                    onChange={(e) => setSettings({ ...settings, biometric: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout</label>
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                  className="input-field"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="240">4 hours</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>

            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Export Data</p>
                    <p className="text-sm text-gray-500">Download all your financial data</p>
                  </div>
                  <button onClick={exportData} className="btn-secondary inline-flex items-center">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Import Data</p>
                    <p className="text-sm text-gray-500">Import data from backup file</p>
                  </div>
                  <button onClick={importData} className="btn-secondary inline-flex items-center">
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Clear Cache</p>
                    <p className="text-sm text-gray-500">Clear app cache and temporary data</p>
                  </div>
                  <button onClick={clearCache} className="btn-secondary inline-flex items-center">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your app preferences and account settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary mt-4 sm:mt-0 inline-flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <TabContent />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;