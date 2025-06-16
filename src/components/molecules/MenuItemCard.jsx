import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const MenuItemCard = ({ menuItem, onAddToCart, delay = 0 }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState([]);

  const handleCustomizationToggle = (customization) => {
    setSelectedCustomizations(prev => 
      prev.includes(customization)
        ? prev.filter(c => c !== customization)
        : [...prev, customization]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...menuItem,
      quantity,
      customizations: selectedCustomizations,
      totalPrice: menuItem.price * quantity
    });
    setQuantity(1);
    setSelectedCustomizations([]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="overflow-hidden" padding="none">
        <div className="aspect-video bg-gradient-to-br from-accent-100 to-accent-200 overflow-hidden">
          <img 
            src={menuItem.image} 
            alt={menuItem.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-lg">
              {menuItem.name}
            </h3>
            <span className="text-lg font-bold text-primary-600 ml-2">
              ${menuItem.price.toFixed(2)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-4 break-words">
            {menuItem.description}
          </p>
          
          {menuItem.customizations && menuItem.customizations.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Customizations:</h4>
              <div className="space-y-2">
                {menuItem.customizations.map((customization, index) => (
                  <motion.label
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCustomizations.includes(customization)}
                      onChange={() => handleCustomizationToggle(customization)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-600">{customization}</span>
                  </motion.label>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
              >
                <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
              >
                <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <Button 
              onClick={handleAddToCart}
              variant="accent"
              size="sm"
              icon="Plus"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MenuItemCard;