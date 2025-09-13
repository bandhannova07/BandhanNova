import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  MessageCircle, 
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  Globe,
  Bookmark,
  Flag,
  MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';

/**
 * Community Hub Page Component
 */
const Community = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock community posts data
  const mockPosts = [
    {
      id: 1,
      author: {
        name: 'Rajesh Kumar',
        avatar: null,
        location: 'Mumbai, India',
        verified: true
      },
      content: 'Just launched my first React app using BandhanNova\'s freelance services! The team was amazing and delivered exactly what I needed. Highly recommended! 🚀',
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3,
      tags: ['react', 'freelance', 'success'],
      isLiked: false,
      isBookmarked: false
    },
    {
      id: 2,
      author: {
        name: 'Priya Sharma',
        avatar: null,
        location: 'Delhi, India',
        verified: false
      },
      content: 'Looking for recommendations on the best AI tools for content creation. Has anyone tried BandhanNova\'s AI suite? Would love to hear your experiences!',
      timestamp: '5 hours ago',
      likes: 12,
      comments: 15,
      shares: 2,
      tags: ['ai-tools', 'content', 'question'],
      isLiked: true,
      isBookmarked: true
    },
    {
      id: 3,
      author: {
        name: 'David Chen',
        avatar: null,
        location: 'Singapore',
        verified: true
      },
      content: 'Excited to share that our startup just got featured on TechCrunch! Special thanks to BandhanNova for helping us build our MVP. The journey continues! 💪',
      timestamp: '1 day ago',
      likes: 89,
      comments: 23,
      shares: 12,
      tags: ['startup', 'mvp', 'milestone'],
      isLiked: false,
      isBookmarked: false
    }
  ];

  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = () => {
    if (!user) {
      showNotification('Please login to create posts', 'error');
      return;
    }

    if (!newPost.trim()) {
      showNotification('Please enter some content', 'error');
      return;
    }

    const post = {
      id: Date.now(),
      author: {
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        location: user.location || 'Unknown',
        verified: user.isVerified || false
      },
      content: newPost,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      shares: 0,
      tags: [],
      isLiked: false,
      isBookmarked: false
    };

    setPosts([post, ...posts]);
    setNewPost('');
    showNotification('Post created successfully!', 'success');
  };

  const handleLike = (postId) => {
    if (!user) {
      showNotification('Please login to like posts', 'error');
      return;
    }

    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId) => {
    if (!user) {
      showNotification('Please login to bookmark posts', 'error');
      return;
    }

    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));

    showNotification('Post bookmarked!', 'success');
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'liked') return matchesSearch && post.isLiked;
    if (filter === 'bookmarked') return matchesSearch && post.isBookmarked;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-20">
      {/* Header */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Community <span className="gradient-text">Hub</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
              Connect with fellow developers, share your experiences, and learn from the global BandhanNova community
            </p>
            
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1 text-blue-500" />
                10K+ Members
              </div>
              <div className="flex items-center">
                <MessageCircle className="w-4 h-4 mr-1 text-green-500" />
                500+ Posts
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1 text-purple-500" />
                Global Community
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Create Post */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
            
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={user ? "Share your thoughts with the community..." : "Please login to create posts"}
                disabled={!user}
                rows={3}
                className="w-full p-4 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white resize-none"
              />
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user ? `Posting as ${user.firstName} ${user.lastName}` : 'Login required'}
                </div>
                
                <Button
                  onClick={handleCreatePost}
                  disabled={!user || !newPost.trim()}
                  size="small"
                >
                  <Plus className="mr-2 w-4 h-4" />
                  Post
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts or users..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Posts</option>
                <option value="liked">Liked Posts</option>
                <option value="bookmarked">Bookmarked</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            >
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-400 rounded-full flex items-center justify-center">
                    {post.author.avatar ? (
                      <img src={post.author.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {post.author.name}
                      </h3>
                      {post.author.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {post.author.location} • {post.timestamp}
                    </p>
                  </div>
                </div>
                
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-900 dark:text-white leading-relaxed">
                  {post.content}
                </p>
                
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      post.isLiked 
                        ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-500 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.shares}</span>
                  </button>
                </div>
                
                <button
                  onClick={() => handleBookmark(post.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    post.isBookmarked 
                      ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' 
                      : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                  }`}
                >
                  <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {searchQuery ? 'Try adjusting your search terms' : 'Be the first to share something with the community!'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Community;
