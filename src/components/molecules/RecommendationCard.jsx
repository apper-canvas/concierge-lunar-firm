import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const RecommendationCard = ({ recommendation, onClick, delay = 0 }) => {
  const getTypeColor = (type) => {
    const typeMap = {
      'Restaurant': 'accent',
      'Attraction': 'primary',
      'Park': 'success',
      'Entertainment': 'secondary',
      'Cafe': 'warning'
    };
    return typeMap[type] || 'default';
  };

  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance}km`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card 
        className="cursor-pointer group overflow-hidden"
        onClick={onClick}
        padding="none"
        hover
      >
        <div className="relative">
          <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
            <img 
              src={recommendation.image} 
              alt={recommendation.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge variant={getTypeColor(recommendation.type)} size="sm">
                {recommendation.type}
              </Badge>
            </div>
          </div>
          
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors duration-200">
                {recommendation.name}
              </h3>
              <div className="flex items-center space-x-1 text-sm text-gray-600 ml-2">
                <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{recommendation.rating}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">
              {recommendation.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-500">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-1" />
                <span>{formatDistance(recommendation.distance)} away</span>
              </div>
<div className="flex items-center space-x-2">
                {recommendation.contact_phone && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`tel:${recommendation.contact_phone}`);
                    }}
                  >
                    <ApperIcon name="Phone" className="w-4 h-4" />
                  </motion.button>
                )}
                {recommendation.contact_website && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(recommendation.contact_website, '_blank');
                    }}
                  >
                    <ApperIcon name="ExternalLink" className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;