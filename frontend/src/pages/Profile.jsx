import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  Shield,
  Award,
  Activity,
  Settings
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

/**
 * User Profile Page Component
 */
const Profile = () => {
  const { user, updateProfile, isLoading } = useAuth();
  const { showNotification } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    skills: [],
    experience: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        skills: user.skills || [],
        experience: user.experience || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      skills
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success');
    } catch (error) {
      showNotification('Failed to update profile', 'error');
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || '',
        website: user.website || '',
        skills: user.skills || [],
        experience: user.experience || ''
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return <Loading type="page" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please log in to view your profile
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-white" />
                )}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {user.email}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </div>
                {user.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </div>
                )}
              </div>

              <div className="flex justify-center md:justify-start space-x-4">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "primary"}
                >
                  {isEditing ? (
                    <>
                      <X className="mr-2 w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit3 className="mr-2 w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/settings'}
                >
                  <Settings className="mr-2 w-4 h-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Details */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Profile Details
              </h2>
              {isEditing && (
                <Button onClick={handleSave} size="small">
                  <Save className="mr-2 w-4 h-4" />
                  Save Changes
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    First Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.firstName || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Last Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white">{user.lastName || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-2" />
                  <p className="text-gray-900 dark:text-white">{user.email}</p>
                  {user.isEmailVerified && (
                    <Shield className="w-4 h-4 text-green-500 ml-2" />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="text-gray-900 dark:text-white">{user.phone || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <p className="text-gray-900 dark:text-white">{user.location || 'Not provided'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-gray-900 dark:text-white">{user.bio || 'No bio provided'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Enter skills separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">No skills added</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats & Activity */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Account Stats */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="mr-2 w-5 h-5" />
                Account Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Projects</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user.projectsCount || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">AI Tools Used</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user.aiToolsUsed || 0}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Community Posts</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user.communityPosts || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Award className="mr-2 w-5 h-5" />
                Subscription
              </h3>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {user.subscription?.plan || 'Free'} Plan
                </h4>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {user.subscription?.plan === 'free' 
                    ? 'Upgrade to access premium features'
                    : 'Enjoy all premium features'
                  }
                </p>
                
                <Button
                  variant="outline"
                  size="small"
                  fullWidth
                  onClick={() => window.location.href = '/ai-tools'}
                >
                  {user.subscription?.plan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
