import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Star, 
  Users, 
  Code, 
  Smartphone, 
  Gamepad2, 
  Brain,
  Globe,
  Award,
  TrendingUp,
  MessageSquare,
  Play
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

/**
 * Home Page Component
 * Main landing page with hero section, features, and call-to-actions
 */
const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 10000,
    projects: 5000,
    satisfaction: 98
  });

  // Animated counter effect
  useEffect(() => {
    const animateStats = () => {
      const duration = 2000;
      const steps = 60;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        setStats({
          users: Math.floor(10000 * progress),
          projects: Math.floor(5000 * progress),
          satisfaction: Math.floor(98 * progress)
        });
        
        if (currentStep >= steps) {
          clearInterval(interval);
          setStats({ users: 10000, projects: 5000, satisfaction: 98 });
        }
      }, stepDuration);
      
      return () => clearInterval(interval);
    };
    
    const timer = setTimeout(animateStats, 1000);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      icon: Code,
      title: t('services.webDevelopment.title'),
      description: t('services.webDevelopment.description'),
      price: '$500 - $5000+',
      features: ['Responsive Design', 'Modern UI/UX', 'SEO Optimized', 'Fast Loading'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Smartphone,
      title: t('services.appDevelopment.title'),
      description: t('services.appDevelopment.description'),
      price: '$800 - $8000+',
      features: ['Cross-platform', 'Native Performance', 'App Store Ready', 'Push Notifications'],
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Gamepad2,
      title: t('services.gameDevelopment.title'),
      description: t('services.gameDevelopment.description'),
      price: '$300 - $3000+',
      features: ['2D/3D Games', 'Multi-platform', 'Engaging Gameplay', 'Monetization Ready'],
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Brain,
      title: t('services.aiTools.title'),
      description: t('services.aiTools.description'),
      price: '₹100 - ₹1000',
      features: ['Text Generation', 'Image Processing', 'Data Analysis', 'Automation'],
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      role: 'Startup Founder',
      content: 'BandhanNova transformed our idea into a beautiful web application. Their team is professional and delivers on time.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Priya Sharma',
      role: 'E-commerce Owner',
      content: 'The mobile app they built for us increased our sales by 300%. Highly recommended for any business.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Game Developer',
      content: 'Their game development expertise helped us create an engaging mobile game that topped the charts.',
      rating: 5,
      avatar: '/api/placeholder/60/60'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-accent-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="gradient-text">BandhanNova</span>
              <br />
              <span className="text-gray-900 dark:text-white text-3xl md:text-4xl lg:text-5xl">
                {t('hero.title')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/freelance'}
              >
                {t('hero.cta.primary')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/ai-tools'}
              >
                <Play className="mr-2 w-5 h-5" />
                {t('hero.cta.secondary')}
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stats.users.toLocaleString()}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('stats.users')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stats.projects.toLocaleString()}+
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('stats.projects')}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stats.satisfaction}%
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {t('stats.satisfaction')}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('services.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                
                <div className="text-lg font-bold gradient-text mb-4">
                  {service.price}
                </div>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = '/freelance'}
                >
                  {t('services.getStarted')}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: t('features.global.title'),
                description: t('features.global.description')
              },
              {
                icon: Award,
                title: t('features.quality.title'),
                description: t('features.quality.description')
              },
              {
                icon: TrendingUp,
                title: t('features.growth.title'),
                description: t('features.growth.description')
              },
              {
                icon: Users,
                title: t('features.community.title'),
                description: t('features.community.description')
              },
              {
                icon: Brain,
                title: t('features.ai.title'),
                description: t('features.ai.description')
              },
              {
                icon: MessageSquare,
                title: t('features.support.title'),
                description: t('features.support.description')
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
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
              {t('cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = user ? '/freelance' : '/register'}
              >
                {user ? t('cta.startProject') : t('cta.joinNow')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary-500"
                onClick={() => window.location.href = '/contact'}
              >
                {t('cta.contactUs')}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
