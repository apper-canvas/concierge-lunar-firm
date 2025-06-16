import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import { serviceRequestService } from '@/services';

const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  const statusOptions = [
    { id: 'all', label: 'All Requests', count: 0 },
    { id: 'pending', label: 'Pending', count: 0 },
    { id: 'in-progress', label: 'In Progress', count: 0 },
    { id: 'completed', label: 'Completed', count: 0 },
    { id: 'cancelled', label: 'Cancelled', count: 0 }
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
      'Concierge': 'Bell',
      'Transportation': 'Car',
      'Spa': 'Sparkles'
    };
    return iconMap[category] || 'Bell';
  };

  const getStatusCounts = () => {
    const counts = {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      'in-progress': requests.filter(r => r.status === 'in-progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
      cancelled: requests.filter(r => r.status === 'cancelled').length
    };
    return counts;
  };

  const filteredRequests = selectedStatus === 'all' 
    ? requests 
    : requests.filter(request => request.status === selectedStatus);

  const handleCancelRequest = async (requestId) => {
    try {
      await serviceRequestService.update(requestId, { status: 'cancelled' });
      toast.success('Request cancelled successfully');
      loadRequests();
    } catch (error) {
      toast.error('Failed to cancel request');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <SkeletonLoader count={1} variant="text" />
          <div className="space-y-4">
            <SkeletonLoader count={5} variant="list" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorState message={error} onRetry={loadRequests} />
      </div>
    );
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              My Requests
            </h1>
            <p className="text-gray-600">
              Track the status of your service requests
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Room 1247
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex space-x-2 overflow-x-auto pb-4 scrollbar-hide">
          {statusOptions.map((status) => (
            <Button
              key={status.id}
              variant={selectedStatus === status.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedStatus(status.id)}
              className="whitespace-nowrap"
            >
              {status.label}
              {statusCounts[status.id] > 0 && (
                <Badge variant="secondary" size="sm" className="ml-2">
                  {statusCounts[status.id]}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Requests List */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="relative">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ApperIcon name={getCategoryIcon(request.category)} className="w-6 h-6 text-primary-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {request.category}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {request.urgency && (
                          <Badge variant="error" size="sm">
                            <ApperIcon name="AlertTriangle" className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <Badge variant={getStatusColor(request.status)}>
                          <ApperIcon name={getStatusIcon(request.status)} className="w-3 h-3 mr-1" />
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-3 break-words">
                      {request.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>
                          {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
                        </span>
                        <span>Room {request.room}</span>
                      </div>
                      
                      {request.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelRequest(request.id)}
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRequests.length === 0 && (
        <EmptyState
          title={selectedStatus === 'all' ? "No requests yet" : `No ${selectedStatus} requests`}
          description={selectedStatus === 'all' 
            ? "Your service requests will appear here once you submit them" 
            : `You don't have any ${selectedStatus} requests at the moment`}
          icon="Inbox"
          actionLabel={selectedStatus === 'all' ? "Request Service" : undefined}
          onAction={selectedStatus === 'all' ? () => window.location.href = '/services' : undefined}
        />
      )}

      {/* Request Summary */}
      {requests.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6"
        >
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-4">
            Request Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {statusCounts.pending}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {statusCounts['in-progress']}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {statusCounts.completed}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {statusCounts.all}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyRequests;