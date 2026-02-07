import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Trash2,
  Save,
  Camera,
  Award,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currency: 'INR',
    monthlyBudget: 0,
    notifications: {
      budget: true,
      goals: true,
      reports: true
    }
  });


  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        currency: user.currency || 'INR',
        monthlyBudget: user.monthlyBudget || 0,
        notifications: {
          budget: user.notifications?.budget ?? true,
          goals: user.notifications?.goals ?? true,
          reports: user.notifications?.reports ?? true
        }
      });
    }
  }, [user]);

  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' }
  ];

  const achievements = [
    { name: 'First Transaction', icon: '🎯', date: '2024-01-15', description: 'Added your first transaction' },
    { name: 'Budget Master', icon: '💰', date: '2024-02-01', description: 'Created your first budget' },
    { name: 'Goal Setter', icon: '🏆', date: '2024-02-15', description: 'Set your first savings goal' },
    { name: '30-Day Streak', icon: '🔥', date: '2024-03-01', description: '30 consecutive days of tracking' },
    { name: 'Budget Keeper', icon: '📊', date: '2024-03-15', description: 'Stayed within budget for a month' }
  ];

  const handleSave = async () => {
    try {
      setLoading(true);
      const result = await updateProfile(profileData);
      if (result.success) {
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      await deleteAccount();
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  const TabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  Member since {new Date(user?.createdAt || '2024-01-01').toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className="input-field bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={profileData.currency}
                  onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                  className="input-field"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.symbol} {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monthly Budget Limit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={profileData.monthlyBudget}
                  onChange={(e) => setProfileData({ ...profileData, monthlyBudget: parseFloat(e.target.value) || 0 })}
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</label>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Choose your preferred color scheme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-600 transition-colors"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Email Notifications</h3>
            {['budget', 'goals', 'reports'].map((type) => (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                </div>
                <input
                  type="checkbox"
                  checked={profileData.notifications[type]}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    notifications: {
                      ...profileData.notifications,
                      [type]: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-blue-600 rounded"
                />
              </div>
            ))}
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center justify-between">
              <div className="text-sm font-medium text-red-800 dark:text-red-300">
                Delete Account
              </div>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((ach, index) => (
                <motion.div
                  key={ach.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{ach.icon}</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{ach.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ach.description}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(ach.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile & Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:w-64">
          <div className="card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1">
          <div className="card">
            <TabContent />

            {/* Save Button */}
            {(activeTab === 'profile' || activeTab === 'preferences' || activeTab === 'notifications') && (
              <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center">
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
