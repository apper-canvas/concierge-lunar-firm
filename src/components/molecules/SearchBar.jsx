import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  value, 
  onChange,
  suggestions = [],
  onSuggestionClick,
  className = ''
}) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleSuggestionClick = (suggestion) => {
    onSuggestionClick(suggestion);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setFocused(false);
                setShowSuggestions(false);
              }, 200);
            }}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white
              transition-all duration-200 focus:outline-none focus:ring-2 
              focus:ring-primary-500 focus:border-transparent
              ${focused ? 'shadow-lg' : 'shadow-sm'}
            `}
          />
        </div>
      </form>

      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-floating border border-gray-200 z-50 max-h-60 overflow-y-auto"
        >
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <motion.button
                key={index}
                whileHover={{ backgroundColor: '#f3f4f6' }}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <ApperIcon name="Search" className="w-4 h-4 text-gray-400" />
                <span>{suggestion}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;