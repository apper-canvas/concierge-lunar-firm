import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ 
  message = "Something went wrong", 
  onRetry, 
  icon = "AlertCircle",
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <motion.div
        animate={{ rotate: [0, -10, 10, -10, 0] }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-4"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="w-8 h-8 text-red-600" />
        </div>
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md break-words">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="primary" icon="RotateCcw">
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorState;