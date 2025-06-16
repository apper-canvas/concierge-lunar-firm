import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon,
  disabled = false,
  required = false,
  className = '',
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloat = focused || hasValue;

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}
        
        <input
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          placeholder={!label ? placeholder : ''}
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg bg-white
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${icon ? 'pl-12' : ''}
            ${type === 'password' ? 'pr-12' : ''}
            ${error ? 'border-error focus:ring-error' : ''}
            ${label ? 'pt-6' : ''}
          `}
          {...props}
        />

        {label && (
          <motion.label
            initial={false}
            animate={{
              y: shouldFloat ? -8 : 8,
              scale: shouldFloat ? 0.85 : 1,
              color: focused ? '#1a5f7a' : error ? '#f44336' : '#6b7280'
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none origin-left font-medium"
          >
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </motion.label>
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={handleTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default Input;