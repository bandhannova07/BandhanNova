import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Star, 
  Lock, 
  Crown, 
  MessageSquare,
  Image,
  FileText,
  Code,
  BarChart3,
  Sparkles,
  ArrowRight,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

/**
 * AI Tools Page Component
 * Showcase and access to various AI-powered tools
 */
const AITools = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [activeCategory, setActiveCategory] = useState('all');

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 100,
      currency: '₹',
      period: 'month',
      description: 'Perfect for individuals and small projects',
      features: [
        '10 AI requests per month',
        'Text generation tools',
        'Basic image processing',
        'Email support',
        'Standard processing speed'
      ],
      limitations: [
        'Limited to basic models',
        'No priority support',
        'Standard queue processing'
      ],
      color: 'from-blue-500 to-purple-600',
      popular: false
    },
    {
      id: 'moderate',
      name: 'Moderate',
      price: 500,
      currency: '₹',
      period: 'month',
      description: 'Great for growing businesses and teams',
      features: [
        '100 AI requests per month',
        'Advanced text generation',
        'Image generation & editing',
        'Code assistance tools',
        'Priority support',
        'Faster processing',
        'API access'
      ],
      limitations: [
        'Limited to moderate complexity',
        'Some advanced features locked'
      ],
      color: 'from-green-500 to-teal-600',
      popular: true
    },
    {
      id: 'high-level',
      name: 'High-Level',
      price: 1000,
      currency: '₹',
      period: 'month',
      description: 'Enterprise-grade AI tools for professionals',
      features: [
        'Unlimited AI requests',
        'All AI tools included',
        'Custom model training',
        'Advanced analytics',
        'White-label solutions',
        'Dedicated support',
        'Real-time processing',
        'Custom integrations'
      ],
      limitations: [],
      color: 'from-purple-500 to-pink-600',
      popular: false
    }
  ];

  const aiTools = [
    {
      id: 'text-generator',
      name: 'Text Generator',
      description: 'Generate high-quality content, articles, and copy',
      icon: FileText,
      category: 'content',
      minPlan: 'basic',
      features: ['Blog posts', 'Marketing copy', 'Social media content', 'Product descriptions'],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'image-ai',
      name: 'Image AI',
      description: 'Create, edit, and enhance images with AI',
      icon: Image,
      category: 'visual',
      minPlan: 'moderate',
      features: ['Image generation', 'Background removal', 'Style transfer', 'Upscaling'],
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'code-assistant',
      name: 'Code Assistant',
      description: 'AI-powered coding help and code generation',
      icon: Code,
      category: 'development',
      minPlan: 'moderate',
      features: ['Code completion', 'Bug detection', 'Code review', 'Documentation'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      id: 'chat-bot',
      name: 'Smart ChatBot',
      description: 'Intelligent conversational AI for customer support',
      icon: MessageSquare,
      category: 'communication',
      minPlan: 'basic',
      features: ['Natural conversations', 'Multi-language', 'Context awareness', 'Integration ready'],
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'data-analyzer',
      name: 'Data Analyzer',
      description: 'Advanced data analysis and insights generation',
      icon: BarChart3,
      category: 'analytics',
      minPlan: 'high-level',
      features: ['Pattern recognition', 'Predictive analytics', 'Report generation', 'Visualization'],
      color: 'from-teal-500 to-cyan-600'
    },
    {
      id: 'content-optimizer',
      name: 'Content Optimizer',
      description: 'SEO optimization and content enhancement',
      icon: Sparkles,
      category: 'content',
      minPlan: 'moderate',
      features: ['SEO analysis', 'Keyword optimization', 'Readability check', 'Performance metrics'],
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', count: aiTools.length },
    { id: 'content', name: 'Content', count: aiTools.filter(tool => tool.category === 'content').length },
    { id: 'visual', name: 'Visual', count: aiTools.filter(tool => tool.category === 'visual').length },
    { id: 'development', name: 'Development', count: aiTools.filter(tool => tool.category === 'development').length },
    { id: 'communication', name: 'Communication', count: aiTools.filter(tool => tool.category === 'communication').length },
    { id: 'analytics', name: 'Analytics', count: aiTools.filter(tool => tool.category === 'analytics').length }
  ];

  const filteredTools = activeCategory === 'all' 
    ? aiTools 
    : aiTools.filter(tool => tool.category === activeCategory);

  const canAccessTool = (tool) => {
    if (!user) return false;
    
    const userPlan = user.subscription?.plan || 'free';
    const planHierarchy = ['free', 'basic', 'moderate', 'high-level'];
    const userPlanIndex = planHierarchy.indexOf(userPlan);
    const requiredPlanIndex = planHierarchy.indexOf(tool.minPlan);
    
    return userPlanIndex >= requiredPlanIndex;
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
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-2xl flex items-center justify-center mr-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                AI <span className="gradient-text">Tools</span>
              </h1>
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Supercharge your productivity with our suite of AI-powered tools designed for creators, developers, and businesses
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                Lightning Fast
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-blue-500" />
                Premium Quality
              </div>
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-1 text-green-500" />
                Secure & Private
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your AI Plan
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Flexible pricing plans to match your needs and scale with your growth
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-primary-500 scale-105' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-primary-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-400 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <Crown className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-8">
                  <div className={`w-12 h-12 bg-gradient-to-r ${plan.color} rounded-lg flex items-center justify-center mb-4`}>
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {plan.description}
                  </p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">/{plan.period}</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700 dark:text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="flex items-center text-gray-500 dark:text-gray-400">
                        <X className="w-4 h-4 text-red-500 mr-3 flex-shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    fullWidth
                    size="large"
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {user ? 'Upgrade Now' : 'Get Started'}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore AI Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover powerful AI tools to transform your workflow and boost productivity
            </p>
          </motion.div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${tool.color} rounded-lg flex items-center justify-center`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {!canAccessTool(tool) && (
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-full">
                      <Lock className="w-3 h-3 mr-1" />
                      {tool.minPlan}
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {tool.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {tool.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Star className="w-3 h-3 text-yellow-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button
                  variant={canAccessTool(tool) ? 'primary' : 'outline'}
                  fullWidth
                  disabled={!canAccessTool(tool)}
                  onClick={() => {
                    if (canAccessTool(tool)) {
                      // Navigate to tool
                      window.location.href = `/ai-tools/${tool.id}`;
                    } else {
                      // Show upgrade modal
                      console.log('Show upgrade modal');
                    }
                  }}
                >
                  {canAccessTool(tool) ? 'Use Tool' : `Upgrade to ${tool.minPlan}`}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Supercharge Your Workflow?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and businesses using our AI tools to achieve more in less time
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = user ? '/ai-tools/dashboard' : '/register'}
              >
                {user ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary-500"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AITools;
