import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  padding = 'default',
  shadow = 'default',
  onClick,
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-card',
    lg: 'shadow-floating'
  };

  const baseClasses = `bg-white rounded-lg border border-gray-100 ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`;

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={onClick ? { scale: 0.98 } : {}}
        className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''} transition-all duration-200 hover:shadow-lg`}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;