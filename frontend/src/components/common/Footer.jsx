import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube,
  Github,
  Heart,
  ArrowUp
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * Footer Component
 * Main footer with company info, links, and social media
 */
const Footer = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: t('footer.company'),
      links: [
        { name: t('footer.about'), href: '/about' },
        { name: t('footer.careers'), href: '/careers' },
        { name: t('footer.team'), href: '/team' },
        { name: t('footer.investors'), href: '/investors' },
        { name: t('footer.press'), href: '/press' }
      ]
    },
    {
      title: t('footer.services'),
      links: [
        { name: t('footer.webDevelopment'), href: '/services/web-development' },
        { name: t('footer.appDevelopment'), href: '/services/app-development' },
        { name: t('footer.gameDevelopment'), href: '/services/game-development' },
        { name: t('footer.aiTools'), href: '/ai-tools' },
        { name: t('footer.consulting'), href: '/services/consulting' }
      ]
    },
    {
      title: t('footer.resources'),
      links: [
        { name: t('footer.blog'), href: '/blog' },
        { name: t('footer.documentation'), href: '/docs' },
        { name: t('footer.tutorials'), href: '/tutorials' },
        { name: t('footer.community'), href: '/community' },
        { name: t('footer.support'), href: '/support' }
      ]
    },
    {
      title: t('footer.legal'),
      links: [
        { name: t('footer.privacy'), href: '/privacy' },
        { name: t('footer.terms'), href: '/terms' },
        { name: t('footer.cookies'), href: '/cookies' },
        { name: t('footer.security'), href: '/security' },
        { name: t('footer.compliance'), href: '/compliance' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/bandhannova', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/bandhannova', color: 'hover:text-blue-400' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/bandhannova', color: 'hover:text-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/bandhannova', color: 'hover:text-blue-700' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/@bandhannova', color: 'hover:text-red-600' },
    { name: 'GitHub', icon: Github, href: 'https://github.com/bandhannova', color: 'hover:text-gray-900 dark:hover:text-white' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: t('footer.email'),
      value: 'hello@bandhannova.com',
      href: 'mailto:hello@bandhannova.com'
    },
    {
      icon: Phone,
      label: t('footer.phone'),
      value: '+91 98765 43210',
      href: 'tel:+919876543210'
    },
    {
      icon: MapPin,
      label: t('footer.address'),
      value: 'Kolkata, West Bengal, India',
      href: 'https://maps.google.com/?q=Kolkata,West+Bengal,India'
    }
  ];

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {/* Logo */}
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">BN</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold gradient-text">BandhanNova</h3>
                  <p className="text-sm text-gray-400">{t('tagline')}</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t('footer.description')}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((item, index) => (
                  <motion.a
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-colors group"
                    whileHover={{ x: 5 }}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    <item.icon className="w-4 h-4 text-primary-400 group-hover:text-primary-300" />
                    <div>
                      <div className="text-xs text-gray-400">{item.label}</div>
                      <div className="text-sm">{item.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a
                      href={link.href}
                      className="text-gray-300 hover:text-primary-400 transition-colors text-sm"
                      whileHover={{ x: 5 }}
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          className="mt-12 pt-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="max-w-md mx-auto text-center lg:text-left lg:max-w-none lg:flex lg:items-center lg:justify-between">
            <div className="lg:flex-1">
              <h4 className="text-xl font-semibold mb-2">
                {t('footer.newsletter.title')}
              </h4>
              <p className="text-gray-300 mb-4 lg:mb-0">
                {t('footer.newsletter.description')}
              </p>
            </div>
            <div className="lg:ml-8 lg:flex-shrink-0">
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1 px-4 py-2 bg-slate-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
                  required
                />
                <motion.button
                  type="submit"
                  className="btn btn-primary whitespace-nowrap"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('footer.newsletter.subscribe')}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Social Media Links */}
        <motion.div
          className="mt-8 pt-8 border-t border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h4 className="text-lg font-semibold mb-3 text-center sm:text-left">
                {t('footer.followUs')}
              </h4>
              <div className="flex items-center space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 bg-slate-800 rounded-lg text-gray-400 ${social.color} transition-all duration-300 hover:bg-slate-700`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <social.icon className="w-5 h-5" />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-400 hover:text-primary-400 transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm">{t('footer.backToTop')}</span>
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 md:mb-0">
              <p className="flex items-center">
                © {new Date().getFullYear()} BandhanNova. {t('footer.allRightsReserved')}
                <Heart className="w-4 h-4 text-red-500 mx-2" />
                {t('footer.madeWithLove')}
              </p>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-xs">
                {t('footer.version')} 1.0.0
              </span>
              <span className="text-xs">
                {t('footer.lastUpdated')}: {new Date().toLocaleDateString()}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
