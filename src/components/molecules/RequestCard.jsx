import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';

const RequestCard = ({ request, delay = 0 }) => {
  const getStatusColor = (status) => {
    const statusMap = {
      'pending': 'warning',
      'in-progress': 'info',
      'completed': 'success',
      'cancelled': 'error'
    };
    return statusMap[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'pending': 'Clock',
      'in-progress': 'Timer',
      'completed': 'CheckCircle',
      'cancelled': 'XCircle'
    };
    return iconMap[status] || 'Clock';
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Housekeeping': 'BedSingle',
      'Room Service': 'UtensilsCrossed',
      'Maintenance': 'Wrench',
      'Concierge': 'Bell'
    };
    return iconMap[category] || 'Bell';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="relative">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <ApperIcon name={getCategoryIcon(request.category)} className="w-5 h-5 text-primary-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900 truncate">
                {request.category}
              </h3>
              <Badge variant={getStatusColor(request.status)} size="sm">
                <ApperIcon name={getStatusIcon(request.status)} className="w-3 h-3 mr-1" />
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-600 mb-2 break-words">
              {request.description}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
              </span>
              {request.urgency && (
                <Badge variant="error" size="sm">
                  <ApperIcon name="AlertTriangle" className="w-3 h-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RequestCard;