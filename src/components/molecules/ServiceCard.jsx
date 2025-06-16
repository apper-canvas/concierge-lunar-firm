import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const ServiceCard = ({ service, onClick, delay = 0 }) => {
  const getServiceIcon = (category) => {
    const iconMap = {
      'Housekeeping': 'BedSingle',
      'Room Service': 'UtensilsCrossed',
      'Maintenance': 'Wrench',
      'Concierge': 'Bell',
      'Transportation': 'Car',
      'Spa': 'Sparkles'
    };
    return iconMap[category] || 'Bell';
  };

  const getServiceGradient = (category) => {
    const gradientMap = {
      'Housekeeping': 'from-primary-400 to-primary-600',
      'Room Service': 'from-accent-400 to-accent-600',
      'Maintenance': 'from-warning to-orange-500',
      'Concierge': 'from-secondary-400 to-secondary-600',
      'Transportation': 'from-purple-400 to-purple-600',
      'Spa': 'from-pink-400 to-pink-600'
    };
    return gradientMap[category] || 'from-primary-400 to-primary-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer relative overflow-hidden group"
        onClick={onClick}
        padding="none"
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${getServiceGradient(service.name)} opacity-5 group-hover:opacity-10 transition-opacity duration-200`} />
        
        <div className="p-6 relative">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getServiceGradient(service.name)} flex items-center justify-center shadow-lg`}>
              <ApperIcon name={getServiceIcon(service.name)} className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {service.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {service.description}
              </p>
              <div className="flex items-center text-sm text-primary-600 font-medium">
                <span>Request Service</span>
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ServiceCard;