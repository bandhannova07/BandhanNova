import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Users,
  Headphones,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';

/**
 * Contact Page Component
 */
const Contact = () => {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'hello@bandhannova.com',
      description: 'Send us an email anytime!',
      action: 'mailto:hello@bandhannova.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 98765 43210',
      description: 'Mon-Fri from 9am to 6pm IST',
      action: 'tel:+919876543210'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: 'Kolkata, West Bengal, India',
      description: 'Come say hello at our office',
      action: '#'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: '9:00 AM - 6:00 PM IST',
      description: 'Monday to Friday',
      action: '#'
    }
  ];

  const contactTypes = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'project', label: 'Project Discussion', icon: Users },
    { value: 'support', label: 'Technical Support', icon: Headphones },
    { value: 'partnership', label: 'Partnership', icon: CheckCircle }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    } catch (error) {
      showNotification('Failed to send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
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
              Get in <span className="gradient-text">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Have a question or want to work together? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 text-center hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                
                <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                  {info.content}
                </p>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {info.description}
                </p>
                
                {info.action !== '#' && (
                  <a
                    href={info.action}
                    className="inline-block mt-4 text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Contact Now
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Send us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  What can we help you with?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {contactTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`relative cursor-pointer p-4 border-2 rounded-lg transition-all ${
                        formData.type === type.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="type"
                        value={type.value}
                        checked={formData.type === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col items-center text-center">
                        <type.icon className={`w-6 h-6 mb-2 ${
                          formData.type === type.value 
                            ? 'text-primary-500' 
                            : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.type === type.value
                            ? 'text-primary-700 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {type.label}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="What's this about?"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                  placeholder="Tell us more about your project or inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="large"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  className="px-8 py-4 text-lg"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 w-5 h-5" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Quick answers to questions you may have
            </p>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How long does it take to complete a project?",
                answer: "Project timelines vary based on complexity and requirements. Simple websites take 1-2 weeks, while complex applications can take 2-3 months. We provide detailed timelines during project planning."
              },
              {
                question: "Do you provide ongoing support after project completion?",
                answer: "Yes! We offer various support packages including bug fixes, updates, and maintenance. Our team is always available to help you grow and improve your digital presence."
              },
              {
                question: "What technologies do you work with?",
                answer: "We specialize in modern web technologies including React, Node.js, MongoDB, and cloud platforms. We choose the best technology stack based on your specific project requirements."
              },
              {
                question: "Can you help with existing projects?",
                answer: "Absolutely! We can audit, improve, and maintain existing applications. Whether you need bug fixes, new features, or performance optimization, we're here to help."
              },
              {
                question: "What are your payment terms?",
                answer: "We typically work with a 50% upfront payment and 50% upon completion for smaller projects. For larger projects, we can arrange milestone-based payments to ensure transparency and trust."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
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
              Let's discuss your ideas and create something amazing together
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="large"
                className="text-lg px-8 py-4"
                onClick={() => window.location.href = '/freelance'}
              >
                Start a Project
              </Button>
              
              <Button
                variant="outline"
                size="large"
                className="text-lg px-8 py-4 text-white border-white hover:bg-white hover:text-primary-500"
                onClick={() => window.location.href = '/services'}
              >
                View Services
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
