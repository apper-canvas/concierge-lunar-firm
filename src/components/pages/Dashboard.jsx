import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import ServiceCard from '@/components/molecules/ServiceCard';
import RequestCard from '@/components/molecules/RequestCard';
import ServiceRequestForm from '@/components/organisms/ServiceRequestForm';
import { serviceRequestService } from '@/services';

const Dashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const serviceCategories = [
    {
      name: 'Housekeeping',
      description: 'Room cleaning, fresh linens, and amenities',
      icon: 'BedSingle'
    },
    {
      name: 'Room Service',
      description: 'Dining delivered to your room',
      icon: 'UtensilsCrossed'
    },
    {
      name: 'Maintenance',
      description: 'Technical support and repairs',
      icon: 'Wrench'
    },
{
      name: 'AI Concierge',
      description: '24/7 AI assistant for instant help',
      icon: 'Bot'
    }
  ];

  const quickActions = [
    {
      label: 'Call Front Desk',
      icon: 'Phone',
      action: () => window.open('tel:+1-555-0123'),
      color: 'primary'
    },
    {
      label: 'Order Dining',
      icon: 'UtensilsCrossed',
      action: () => navigate('/dining'),
      color: 'accent'
},
    {
      label: 'AI Chat',
      icon: 'Bot',
      action: () => navigate('/ai-concierge'),
      color: 'info'
    },
    {
      label: 'Local Guide',
      icon: 'MapPin',
      action: () => navigate('/local-guide'),
      color: 'secondary'
    }
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceRequestService.getAll();
      setRequests(result.slice(0, 3)); // Show only recent 3 requests
    } catch (err) {
      setError(err.message || 'Failed to load requests');
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = (service) => {
    setSelectedService(service.name);
    setShowRequestForm(true);
  };

  const handleRequestSuccess = () => {
    loadRequests();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <SkeletonLoader count={1} variant="text" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonLoader count={4} variant="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadRequests} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Welcome to your stay
            </h1>
            <p className="text-gray-600">
              Your personal concierge service at your fingertips
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <ApperIcon name="MapPin" className="w-4 h-4" />
              <span>Room 1247</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>Jan 15-18, 2024</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="cursor-pointer text-center group"
                onClick={action.action}
                hover
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-gradient-to-br from-${action.color}-400 to-${action.color}-600 flex items-center justify-center`}>
                  <ApperIcon name={action.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {action.label}
                </h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Categories */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Request Services
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceCategories.map((service, index) => (
              <ServiceCard
                key={service.name}
                service={service}
                onClick={() => handleServiceClick(service)}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>

        {/* Recent Requests */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold text-gray-900">
              Recent Requests
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/my-requests')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {requests.length === 0 ? (
              <Card className="text-center py-8">
                <ApperIcon name="Inbox" className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No requests yet</h3>
                <p className="text-sm text-gray-500">
                  Your service requests will appear here
                </p>
              </Card>
            ) : (
              requests.map((request, index) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  delay={index * 0.1}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Service Request Form Modal */}
      {showRequestForm && (
        <ServiceRequestForm
          selectedCategory={selectedService}
          onClose={() => setShowRequestForm(false)}
          onSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;