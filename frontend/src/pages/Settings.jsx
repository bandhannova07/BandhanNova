import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  Trash2,
  Download,
  Upload,
  Save,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

/**
 * Settings Page Component
 */
const Settings = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, availableLanguages } = useLanguage();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    projectUpdates: true,
    communityUpdates: true,
    aiToolUpdates: true
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || ''
      });
      setPreferences({
        emailNotifications: user.preferences?.emailNotifications ?? true,
        pushNotifications: user.preferences?.pushNotifications ?? true,
        marketingEmails: user.preferences?.marketingEmails ?? false,
        projectUpdates: user.preferences?.projectUpdates ?? true,
        communityUpdates: user.preferences?.communityUpdates ?? true,
        aiToolUpdates: user.preferences?.aiToolUpdates ?? true
      });
    }
  }, [user]);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'language', label: 'Language', icon: Globe }
  ];

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileData);
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('Passwords do not match', 'error');
      return;
    }

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
      showNotification('Password changed successfully!', 'success');
    } catch (error) {
      showNotification('Failed to change password', 'error');
    }
  };

  const handlePreferencesSave = async () => {
    try {
      await updateProfile({ preferences });
      showNotification('Preferences updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update preferences', 'error');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      showNotification('Account deleted successfully', 'success');
      window.location.href = '/';
    } catch (error) {
      showNotification('Failed to delete account', 'error');
    }
  };

  const exportData = () => {
    const data = {
      profile: user,
      preferences,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bandhannova-data-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Data exported successfully!', 'success');
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            value={profileData.firstName}
            onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            value={profileData.lastName}
            onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={profileData.email}
          disabled
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-600 text-gray-500 dark:text-gray-400"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Phone
        </label>
        <input
          type="tel"
          value={profileData.phone}
          onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Location
        </label>
        <input
          type="text"
          value={profileData.location}
          onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          value={profileData.bio}
          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          placeholder="Tell us about yourself..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Website
        </label>
        <input
          type="url"
          value={profileData.website}
          onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
          placeholder="https://your-website.com"
        />
      </div>

      <Button onClick={handleProfileSave}>
        <Save className="mr-2 w-4 h-4" />
        Save Changes
      </Button>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
          <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Security Settings
          </h3>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          Keep your account secure by regularly updating your password.
        </p>
      </div>

      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          {showPasswordForm ? <EyeOff className="mr-2 w-4 h-4" /> : <Eye className="mr-2 w-4 h-4" />}
          Change Password
        </Button>

        {showPasswordForm && (
          <motion.div
            className="space-y-4 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              />
            </div>

            <Button onClick={handlePasswordChange}>
              Update Password
            </Button>
          </motion.div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Data Management
        </h3>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={exportData}
          >
            <Download className="mr-2 w-4 h-4" />
            Export My Data
          </Button>

          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="mr-2 w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Email Notifications
        </h3>
        
        {Object.entries({
          emailNotifications: 'General email notifications',
          projectUpdates: 'Project status updates',
          communityUpdates: 'Community activity',
          aiToolUpdates: 'AI tools and features',
          marketingEmails: 'Marketing and promotional emails'
        }).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">{label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences[key]}
                onChange={(e) => setPreferences(prev => ({ ...prev, [key]: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Push Notifications
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">Browser notifications</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.pushNotifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, pushNotifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
          </label>
        </div>
      </div>

      <Button onClick={handlePreferencesSave}>
        <Save className="mr-2 w-4 h-4" />
        Save Preferences
      </Button>
    </div>
  );

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTheme(value)}
              className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-all ${
                theme === value
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${theme === value ? 'text-primary-500' : 'text-gray-500'}`} />
              <span className={`text-sm font-medium ${theme === value ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLanguageTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Language Preference
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`p-4 border-2 rounded-lg flex items-center space-x-3 transition-all ${
                language === lang.code
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="text-left">
                <div className={`font-medium ${language === lang.code ? 'text-primary-700 dark:text-primary-300' : 'text-gray-900 dark:text-white'}`}>
                  {lang.name}
                </div>
                <div className={`text-sm ${language === lang.code ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {lang.nativeName}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to access settings
          </h1>
          <Button onClick={() => window.location.href = '/login'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
            <SettingsIcon className="mr-3 w-8 h-8" />
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="mr-3 w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'security' && renderSecurityTab()}
              {activeTab === 'notifications' && renderNotificationsTab()}
              {activeTab === 'appearance' && renderAppearanceTab()}
              {activeTab === 'language' && renderLanguageTab()}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        type="confirm"
      >
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Are you absolutely sure?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </p>
          
          <div className="flex space-x-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
