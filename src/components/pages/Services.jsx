import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import ServiceCard from '@/components/molecules/ServiceCard';
import ServiceRequestForm from '@/components/organisms/ServiceRequestForm';
import { serviceRequestService } from '@/services';

const Services = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const serviceCategories = [
    {
      name: 'Housekeeping',
      description: 'Room cleaning, fresh linens, housekeeping supplies, and daily maintenance',
      icon: 'BedSingle',
      color: 'primary'
    },
    {
      name: 'Room Service',
      description: 'Dining delivered to your room, 24/7 availability',
      icon: 'UtensilsCrossed',
      color: 'accent'
    },
    {
      name: 'Maintenance',
      description: 'Technical support, repairs, and room equipment assistance',
      icon: 'Wrench',
      color: 'warning'
    },
    {
      name: 'Concierge',
      description: 'Reservations, recommendations, and local assistance',
      icon: 'Bell',
      color: 'secondary'
    },
    {
      name: 'Transportation',
      description: 'Airport transfers, car service, and local transportation',
      icon: 'Car',
      color: 'info'
    },
    {
      name: 'Spa',
      description: 'Wellness services, massages, and relaxation treatments',
      icon: 'Sparkles',
      color: 'accent'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'Housekeeping', label: 'Housekeeping' },
    { id: 'Room Service', label: 'Room Service' },
    { id: 'Maintenance', label: 'Maintenance' },
    { id: 'Concierge', label: 'Concierge' },
    { id: 'Transportation', label: 'Transportation' },
    { id: 'Spa', label: 'Spa' }
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await serviceRequestService.getAll();
      setRequests(result);
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

  const filteredServices = selectedCategory === 'all' 
    ? serviceCategories 
    : serviceCategories.filter(service => service.name === selectedCategory);

  const getActiveRequests = () => {
    return requests.filter(request => request.status !== 'completed' && request.status !== 'cancelled');
  };

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
        <ErrorState message={error} onRetry={loadRequests} />
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
              Hotel Services
            </h1>
            <p className="text-gray-600">
              Request any service you need during your stay
            </p>
          </div>
          
          {getActiveRequests().length > 0 && (
            <Card className="p-4 bg-primary-50 border-primary-200">
              <div className="flex items-center space-x-2 text-primary-700">
                <ApperIcon name="Clock" className="w-5 h-5" />
                <span className="font-medium">
                  {getActiveRequests().length} active request{getActiveRequests().length !== 1 ? 's' : ''}
                </span>
              </div>
            </Card>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Service Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredServices.map((service, index) => (
            <ServiceCard
              key={service.name}
              service={service}
              onClick={() => handleServiceClick(service)}
              delay={index * 0.1}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredServices.length === 0 && (
        <EmptyState
          title="No services found"
          description="Try selecting a different category to see available services"
          icon="Search"
        />
      )}

      {/* Floating Action Button for Quick Request */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <Button
          onClick={() => setShowRequestForm(true)}
          variant="accent"
          size="lg"
          className="rounded-full shadow-floating w-16 h-16 p-0"
        >
          <ApperIcon name="Plus" className="w-6 h-6" />
        </Button>
      </motion.div>

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

export default Services;