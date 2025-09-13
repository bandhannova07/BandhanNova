import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  User,
  Eye,
  Share2,
  Bookmark,
  Search,
  Filter,
  Tag,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/common/Button';

/**
 * Tech News Page Component
 */
const News = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All News', icon: TrendingUp },
    { id: 'ai', name: 'AI & ML', icon: Tag },
    { id: 'web', name: 'Web Development', icon: Tag },
    { id: 'mobile', name: 'Mobile Apps', icon: Tag },
    { id: 'startup', name: 'Startups', icon: Tag },
    { id: 'tech', name: 'Technology', icon: Tag }
  ];

  // Mock news articles
  const mockArticles = [
    {
      id: 1,
      title: 'The Future of AI in Web Development: Trends to Watch in 2024',
      excerpt: 'Artificial Intelligence is revolutionizing how we build web applications. From automated code generation to intelligent user interfaces, discover the latest trends shaping the future of web development.',
      content: 'Full article content would go here...',
      author: {
        name: 'BandhanNova Team',
        avatar: null,
        role: 'Tech Writers'
      },
      category: 'ai',
      tags: ['AI', 'Web Development', 'Trends', '2024'],
      publishedAt: '2024-01-15T10:00:00Z',
      readTime: '5 min read',
      views: 1250,
      likes: 89,
      image: '/api/placeholder/600/300',
      featured: true,
      isBookmarked: false
    },
    {
      id: 2,
      title: 'React 18 Performance Optimization: Best Practices and Techniques',
      excerpt: 'Learn advanced techniques to optimize your React applications for better performance. This comprehensive guide covers everything from code splitting to concurrent features.',
      content: 'Full article content would go here...',
      author: {
        name: 'Rajesh Kumar',
        avatar: null,
        role: 'Senior Developer'
      },
      category: 'web',
      tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
      publishedAt: '2024-01-14T14:30:00Z',
      readTime: '8 min read',
      views: 892,
      likes: 67,
      image: '/api/placeholder/600/300',
      featured: false,
      isBookmarked: true
    },
    {
      id: 3,
      title: 'Mobile App Development in 2024: Native vs Cross-Platform',
      excerpt: 'Choosing the right approach for mobile app development can make or break your project. Compare the pros and cons of native and cross-platform development.',
      content: 'Full article content would go here...',
      author: {
        name: 'Priya Sharma',
        avatar: null,
        role: 'Mobile Developer'
      },
      category: 'mobile',
      tags: ['Mobile', 'React Native', 'Flutter', 'iOS', 'Android'],
      publishedAt: '2024-01-13T09:15:00Z',
      readTime: '6 min read',
      views: 654,
      likes: 45,
      image: '/api/placeholder/600/300',
      featured: false,
      isBookmarked: false
    },
    {
      id: 4,
      title: 'Startup Success Stories: How BandhanNova Helped Launch 50+ Companies',
      excerpt: 'Discover inspiring stories of startups that grew from ideas to successful businesses with the help of BandhanNova\'s development services and AI tools.',
      content: 'Full article content would go here...',
      author: {
        name: 'David Chen',
        avatar: null,
        role: 'Business Analyst'
      },
      category: 'startup',
      tags: ['Startup', 'Success Stories', 'Business', 'Growth'],
      publishedAt: '2024-01-12T16:45:00Z',
      readTime: '10 min read',
      views: 1456,
      likes: 123,
      image: '/api/placeholder/600/300',
      featured: true,
      isBookmarked: false
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setArticles(mockArticles);
      setLoading(false);
    }, 1000);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading latest tech news...</p>
        </div>
      </div>
    );
  }

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
              Tech <span className="gradient-text">News</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Stay updated with the latest trends, insights, and innovations in technology, 
              web development, and the startup ecosystem
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Search and Filters */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, topics, or tags..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <TrendingUp className="mr-2 w-6 h-6 text-primary-500" />
              Featured Stories
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredArticles.map((article, index) => (
                <motion.article
                  key={article.id}
                  className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-video bg-gradient-to-r from-primary-500 to-secondary-400 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-4xl mb-2">📰</div>
                      <div className="text-sm opacity-80">Featured Article</div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                        {categories.find(cat => cat.id === article.category)?.name}
                      </span>
                      <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {article.author.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(article.publishedAt)}
                          </p>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="small">
                        Read More
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* Regular Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Latest Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <motion.article
                key={article.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5 }}
              >
                <div className="aspect-video bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-2">📄</div>
                    <div className="text-sm opacity-80">Article</div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      {article.views}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {article.author.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(article.publishedAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Bookmark className={`w-4 h-4 ${article.isBookmarked ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                      </button>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Try adjusting your search terms or category filter
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default News;
