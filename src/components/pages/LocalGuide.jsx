import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import RecommendationCard from '@/components/molecules/RecommendationCard';
import { recommendationService } from '@/services';

const LocalGuide = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('distance');

  const types = [
    { id: 'all', label: 'All Places', icon: 'MapPin' },
    { id: 'Restaurant', label: 'Restaurants', icon: 'UtensilsCrossed' },
    { id: 'Attraction', label: 'Attractions', icon: 'Camera' },
    { id: 'Park', label: 'Parks', icon: 'Trees' },
    { id: 'Entertainment', label: 'Entertainment', icon: 'Music' },
    { id: 'Cafe', label: 'Cafes', icon: 'Coffee' }
  ];

  const sortOptions = [
    { id: 'distance', label: 'Distance' },
    { id: 'rating', label: 'Rating' },
    { id: 'name', label: 'Name' }
  ];

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await recommendationService.getAll();
      setRecommendations(result);
    } catch (err) {
      setError(err.message || 'Failed to load recommendations');
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationClick = (recommendation) => {
    // Could open a detailed view or external map
    toast.info(`Opening details for ${recommendation.name}`);
  };

  const filteredAndSortedRecommendations = recommendations
    .filter(item => {
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return a.distance - b.distance;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <SkeletonLoader count={1} variant="text" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} variant="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadRecommendations} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Local Guide
            </h1>
            <p className="text-gray-600">
              Discover the best places around your hotel
            </p>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              <span>Within 2km of hotel</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 max-w-md">
            <SearchBar
              placeholder="Search places..."
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={setSearchQuery}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort by:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {types.map((type) => (
            <Button
              key={type.id}
              variant={selectedType === type.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedType(type.id)}
              className="whitespace-nowrap"
              icon={type.icon}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredAndSortedRecommendations.map((recommendation, index) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onClick={() => handleRecommendationClick(recommendation)}
              delay={index * 0.1}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedRecommendations.length === 0 && (
        <EmptyState
          title="No places found"
          description="Try adjusting your search or filter criteria"
          icon="Search"
        />
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6"
      >
        <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
          Need More Help?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start"
            icon="Phone"
            onClick={() => window.open('tel:+1-555-0123')}
          >
            Call Concierge
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            icon="MessageSquare"
            onClick={() => toast.info('Chat feature coming soon!')}
          >
            Live Chat
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            icon="Car"
            onClick={() => toast.info('Transportation booking coming soon!')}
          >
            Book Transportation
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LocalGuide;