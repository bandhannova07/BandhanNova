import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Heart,
  Users,
  Award,
  Globe,
  Zap,
  Code,
  Lightbulb,
  Rocket,
  Star,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

/**
 * About Page Component
 */
const About = () => {
  const { t } = useLanguage();

  const stats = [
    { number: '50+', label: 'Projects Completed', icon: Award },
    { number: '25+', label: 'Happy Clients', icon: Users },
    { number: '3+', label: 'Years Experience', icon: Globe },
    { number: '99%', label: 'Client Satisfaction', icon: Star }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace cutting-edge technologies and creative solutions to solve complex problems.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Heart,
      title: 'Quality',
      description: 'We deliver high-quality solutions that exceed expectations and stand the test of time.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work closely with our clients as partners to achieve shared success.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Efficiency',
      description: 'We optimize processes and deliver results quickly without compromising quality.',
      color: 'from-green-500 to-teal-500'
    }
  ];

  const team = [
    {
      name: 'Bandhan Das',
      role: 'Founder & CEO',
      image: '/api/placeholder/300/300',
      bio: 'Visionary leader with 5+ years in tech industry, passionate about creating innovative solutions.',
      skills: ['Leadership', 'Strategy', 'Full-Stack Development']
    },
    {
      name: 'Nova AI',
      role: 'AI Assistant',
      image: '/api/placeholder/300/300',
      bio: 'Advanced AI assistant helping clients with project planning and technical guidance.',
      skills: ['AI/ML', 'Project Planning', 'Technical Support']
    }
  ];

  const milestones = [
    {
      year: '2021',
      title: 'Company Founded',
      description: 'BandhanNova was established with a vision to become a world-class tech company.'
    },
    {
      year: '2022',
      title: 'First Major Project',
      description: 'Successfully delivered our first enterprise-level web application.'
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Launched Nova AI assistant to enhance client experience and project efficiency.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded services globally with multilingual support and international clients.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              About <span className="gradient-text">BandhanNova</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
              We are a passionate tech company dedicated to transforming ideas into powerful digital solutions. 
              Our mission is to become a world-leading technology company by 2030, delivering innovative 
              solutions that make a difference.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/contact'}
              >
                Get in Touch
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/services'}
              >
                Our Services
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Mission */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                To empower businesses and individuals with innovative technology solutions 
                that drive growth, efficiency, and success in the digital age.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                To become a world-leading technology company by 2030, recognized for 
                our innovation, quality, and positive impact on the global tech ecosystem.
              </p>
            </motion.div>

            {/* Values */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Our Values
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Innovation, quality, collaboration, and efficiency guide everything we do. 
                We believe in creating value for our clients and contributing to a better digital future.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Details */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Drives Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our core values shape our culture and guide our decisions every day
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-full flex items-center justify-center mb-6`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Key milestones in our growth story
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary-500 to-secondary-400"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-12`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
                    <div className="text-primary-500 font-bold text-lg mb-2">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                {/* Timeline Dot */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full border-4 border-white dark:border-slate-900"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The passionate individuals behind BandhanNova's success
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-32 h-32 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-16 h-16 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                
                <p className="text-primary-500 font-medium mb-4">
                  {member.role}
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {member.bio}
                </p>
                
                <div className="flex flex-wrap justify-center gap-2">
                  {member.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
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
            <Rocket className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Build the Future Together?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join us on our mission to create innovative technology solutions that make a difference. 
              Let's turn your ideas into reality.
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
                Get in Touch
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
