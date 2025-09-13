import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, 
  Smartphone, 
  Gamepad2, 
  Globe,
  Database,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Check
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

/**
 * Services Page Component
 * Showcase of all BandhanNova services
 */
const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies',
      icon: Code,
      features: [
        'Responsive Design',
        'Modern Frameworks (React, Vue, Angular)',
        'Progressive Web Apps (PWA)',
        'E-commerce Solutions',
        'Content Management Systems',
        'API Development & Integration'
      ],
      technologies: ['React', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
      pricing: '$500 - $5000+',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'mobile-development',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications',
      icon: Smartphone,
      features: [
        'iOS & Android Development',
        'Cross-platform Solutions',
        'React Native & Flutter',
        'App Store Optimization',
        'Push Notifications',
        'Offline Functionality'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      pricing: '$800 - $8000+',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'game-development',
      title: 'Game Development',
      description: '2D/3D games for web, mobile, and desktop platforms',
      icon: Gamepad2,
      features: [
        '2D & 3D Game Development',
        'Unity & Unreal Engine',
        'Mobile Game Optimization',
        'Multiplayer Integration',
        'Monetization Strategies',
        'Game Analytics'
      ],
      technologies: ['Unity', 'Unreal Engine', 'C#', 'JavaScript', 'Blender'],
      pricing: '$300 - $3000+',
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'web-design',
      title: 'Web Design & UI/UX',
      description: 'Beautiful, user-centered design solutions',
      icon: Globe,
      features: [
        'UI/UX Design',
        'Prototyping & Wireframing',
        'Brand Identity Design',
        'Responsive Design',
        'User Research',
        'Design Systems'
      ],
      technologies: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision'],
      pricing: '$200 - $2000+',
      color: 'from-pink-500 to-rose-600'
    },
    {
      id: 'backend-development',
      title: 'Backend Development',
      description: 'Scalable server-side solutions and APIs',
      icon: Database,
      features: [
        'RESTful API Development',
        'Database Design & Optimization',
        'Cloud Infrastructure',
        'Microservices Architecture',
        'Authentication & Security',
        'Performance Optimization'
      ],
      technologies: ['Node.js', 'Python', 'MongoDB', 'PostgreSQL', 'AWS'],
      pricing: '$400 - $4000+',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      id: 'consulting',
      title: 'Tech Consulting',
      description: 'Strategic technology guidance and solutions',
      icon: Shield,
      features: [
        'Technology Strategy',
        'Architecture Planning',
        'Code Review & Audit',
        'Performance Analysis',
        'Security Assessment',
        'Team Training'
      ],
      technologies: ['Various based on needs'],
      pricing: '$100 - $500/hour',
      color: 'from-teal-500 to-cyan-600'
    }
  ];

  const process = [
    {
      step: 1,
      title: 'Discovery',
      description: 'We understand your requirements and goals'
    },
    {
      step: 2,
      title: 'Planning',
      description: 'Create detailed project roadmap and timeline'
    },
    {
      step: 3,
      title: 'Development',
      description: 'Build your solution with regular updates'
    },
    {
      step: 4,
      title: 'Testing',
      description: 'Thorough testing and quality assurance'
    },
    {
      step: 5,
      title: 'Deployment',
      description: 'Launch and provide ongoing support'
    }
  ];

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
              Our <span className="gradient-text">Services</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Comprehensive technology solutions to bring your ideas to life and grow your business
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                Fast Delivery
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-blue-500" />
                Expert Team
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1 text-green-500" />
                Quality Assured
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-slate-700 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center mb-4`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>
                
                <div className="text-lg font-bold gradient-text mb-4">
                  {service.pricing}
                </div>
                
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-xs text-gray-600 dark:text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => window.location.href = '/freelance'}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
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
              Our Development Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A proven methodology that ensures successful project delivery
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.step}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {step.description}
                </p>
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
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Let's discuss your requirements and create something amazing together
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/freelance'}
              >
                Start a Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary-500"
                onClick={() => window.location.href = '/contact'}
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
