import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Gamepad2, 
  Calculator,
  Clock,
  Star,
  Send,
  MessageCircle,
  Zap,
  CheckCircle,
  ArrowRight,
  DollarSign
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * Freelance Lab Page Component
 * AI-powered project estimation and freelance services
 */
const FreelanceLab = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const [selectedCategory, setSelectedCategory] = useState('web-apps');
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    category: 'web-apps',
    complexity: 'medium',
    timeline: 'normal',
    features: [],
    budget: 'flexible'
  });
  
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [aiResponse, setAiResponse] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    {
      id: 'web-apps',
      title: 'Web Applications',
      icon: Code,
      description: 'Modern, responsive web applications with cutting-edge technology',
      basePrice: 500,
      maxPrice: 5000,
      features: ['Responsive Design', 'Database Integration', 'User Authentication', 'Admin Panel', 'API Integration'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'mobile-apps',
      title: 'Mobile Applications',
      icon: Smartphone,
      description: 'Cross-platform mobile apps for iOS and Android',
      basePrice: 800,
      maxPrice: 8000,
      features: ['Cross-platform', 'Push Notifications', 'Offline Support', 'App Store Optimization', 'Analytics'],
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'games',
      title: 'Game Development',
      icon: Gamepad2,
      description: '2D/3D games for web, mobile, and desktop platforms',
      basePrice: 300,
      maxPrice: 3000,
      features: ['2D/3D Graphics', 'Physics Engine', 'Multiplayer Support', 'Monetization', 'Cross-platform'],
      color: 'from-orange-500 to-red-600'
    }
  ];

  const complexityMultipliers = {
    simple: 0.7,
    medium: 1.0,
    complex: 1.5,
    enterprise: 2.0
  };

  const timelineMultipliers = {
    rush: 1.2,
    normal: 1.0,
    extended: 0.9,
    flexible: 0.8
  };

  useEffect(() => {
    calculateEstimate();
  }, [projectForm]);

  const calculateEstimate = () => {
    const category = categories.find(cat => cat.id === projectForm.category);
    if (!category) return;

    const basePrice = category.basePrice;
    const complexityMultiplier = complexityMultipliers[projectForm.complexity];
    const timelineMultiplier = timelineMultipliers[projectForm.timeline];
    
    let featureMultiplier = 1 + (projectForm.features.length * 0.1);
    
    const estimate = Math.round(basePrice * complexityMultiplier * timelineMultiplier * featureMultiplier);
    setEstimatedCost(estimate);
  };

  const handleFormChange = (field, value) => {
    setProjectForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureToggle = (feature) => {
    setProjectForm(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const getAIRecommendation = async () => {
    setLoading(true);
    setShowAI(true);
    
    // Simulate AI response
    setTimeout(() => {
      const category = categories.find(cat => cat.id === projectForm.category);
      const responses = [
        `Based on your ${category.title.toLowerCase()} project, I recommend starting with a ${projectForm.complexity} complexity approach. The estimated timeline would be ${projectForm.timeline === 'rush' ? '2-4 weeks' : projectForm.timeline === 'normal' ? '4-8 weeks' : '8-12 weeks'}.`,
        `For optimal results, consider including ${category.features.slice(0, 3).join(', ')} in your initial scope. This will provide a solid foundation for future enhancements.`,
        `The estimated cost of $${estimatedCost} includes development, testing, and deployment. Additional features can be added in future phases to manage budget effectively.`
      ];
      
      setAiResponse(responses.join('\n\n'));
      setLoading(false);
    }, 2000);
  };

  const submitProject = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    // Handle project submission
    console.log('Project submitted:', projectForm);
    // In real app, this would send to backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Freelance <span className="gradient-text">Lab</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Get AI-powered project estimates and connect with our expert developers for your next big idea
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                AI-Powered Estimates
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                Expert Developers
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-blue-500" />
                Quality Guaranteed
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Categories */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Choose Your Project Type
              </h2>
              
              <div className="space-y-4">
                {categories.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      handleFormChange('category', category.id);
                    }}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-slate-600 hover:border-primary-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <category.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {category.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {category.description}
                        </p>
                        <div className="text-sm font-medium text-primary-600 dark:text-primary-400 mt-2">
                          ${category.basePrice} - ${category.maxPrice}+
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Project Form */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Project Details
                </h2>
                <div className="flex items-center space-x-2 text-2xl font-bold gradient-text">
                  <DollarSign className="w-6 h-6" />
                  {estimatedCost.toLocaleString()}
                </div>
              </div>

              <div className="space-y-6">
                {/* Project Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => handleFormChange('title', e.target.value)}
                    placeholder="Enter your project title..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Description
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                    placeholder="Describe your project requirements..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                {/* Complexity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Complexity
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(complexityMultipliers).map(([key, multiplier]) => (
                      <button
                        key={key}
                        onClick={() => handleFormChange('complexity', key)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          projectForm.complexity === key
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-primary-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {key}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {multiplier}x
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeline Preference
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(timelineMultipliers).map(([key, multiplier]) => (
                      <button
                        key={key}
                        onClick={() => handleFormChange('timeline', key)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          projectForm.timeline === key
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-primary-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white capitalize">
                          {key}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {multiplier > 1 ? '+' : multiplier < 1 ? '-' : ''}{Math.abs((1 - multiplier) * 100).toFixed(0)}%
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Additional Features
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categories.find(cat => cat.id === selectedCategory)?.features.map((feature) => (
                      <button
                        key={feature}
                        onClick={() => handleFeatureToggle(feature)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          projectForm.features.includes(feature)
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-slate-600 hover:border-primary-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <CheckCircle className={`w-4 h-4 mr-2 ${
                            projectForm.features.includes(feature) ? 'text-primary-500' : 'text-gray-400'
                          }`} />
                          <span className="text-gray-900 dark:text-white">{feature}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      AI Project Assistant
                    </h3>
                    <Button
                      onClick={getAIRecommendation}
                      loading={loading}
                      icon={MessageCircle}
                      variant="outline"
                    >
                      Get AI Advice
                    </Button>
                  </div>

                  {showAI && (
                    <motion.div
                      className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4 border border-primary-200 dark:border-primary-800"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {loading ? (
                        <div className="flex items-center space-x-3">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            Nova is analyzing your project...
                          </span>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">AI</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">Nova Assistant</span>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {aiResponse}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="border-t border-gray-200 dark:border-slate-600 pt-6">
                  <Button
                    onClick={submitProject}
                    size="large"
                    fullWidth
                    className="justify-center"
                  >
                    {user ? 'Submit Project Request' : 'Login to Submit Project'}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  
                  {!user && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">
                      Create an account to submit your project and get matched with expert developers
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelanceLab;
