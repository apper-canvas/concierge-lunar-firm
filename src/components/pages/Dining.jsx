import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SkeletonLoader from '@/components/atoms/SkeletonLoader';
import ErrorState from '@/components/atoms/ErrorState';
import EmptyState from '@/components/atoms/EmptyState';
import SearchBar from '@/components/molecules/SearchBar';
import MenuItemCard from '@/components/molecules/MenuItemCard';
import { menuItemService, orderService } from '@/services';

const Dining = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const categories = [
    { id: 'all', label: 'All Items', icon: 'UtensilsCrossed' },
    { id: 'Breakfast', label: 'Breakfast', icon: 'Coffee' },
    { id: 'Appetizer', label: 'Appetizers', icon: 'Grape' },
    { id: 'Main Course', label: 'Main Course', icon: 'ChefHat' },
    { id: 'Sides', label: 'Sides', icon: 'Salad' },
    { id: 'Dessert', label: 'Desserts', icon: 'Cake' }
  ];

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await menuItemService.getAll();
      setMenuItems(result);
    } catch (err) {
      setError(err.message || 'Failed to load menu items');
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
      );
      
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id && 
          JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      } else {
        return [...prev, { ...item, cartId: Date.now() }];
      }
    });
    
    toast.success(`${item.name} added to cart!`);
  };

  const handleRemoveFromCart = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const handleUpdateCartQuantity = (cartId, newQuantity) => {
    if (newQuantity === 0) {
      handleRemoveFromCart(cartId);
      return;
    }
    
    setCart(prev => prev.map(item =>
      item.cartId === cartId
        ? { ...item, quantity: newQuantity, totalPrice: item.price * newQuantity }
        : item
    ));
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);
    
    try {
      const orderData = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          customizations: item.customizations || []
        })),
        total: getCartTotal(),
        specialInstructions: specialInstructions.trim(),
        room: '1247'
      };

      await orderService.create(orderData);
      toast.success('Order placed successfully! Expected delivery in 45 minutes.');
      setCart([]);
      setShowCart(false);
      setSpecialInstructions('');
    } catch (error) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
        <ErrorState message={error} onRetry={loadMenuItems} />
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
              Room Service Menu
            </h1>
            <p className="text-gray-600">
              Delicious meals delivered to your room
            </p>
          </div>
          
          {cart.length > 0 && (
            <Button
              onClick={() => setShowCart(true)}
              variant="accent"
              icon="ShoppingCart"
              className="relative"
            >
              View Cart ({getCartItemCount()})
              <Badge 
                variant="warning" 
                size="sm"
                className="absolute -top-2 -right-2"
              >
                ${getCartTotal().toFixed(2)}
              </Badge>
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <SearchBar
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={setSearchQuery}
          />
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
              icon={category.icon}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {filteredItems.map((item, index) => (
            <MenuItemCard
              key={item.id}
              menuItem={item}
              onAddToCart={handleAddToCart}
              delay={index * 0.1}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredItems.length === 0 && (
        <EmptyState
          title="No menu items found"
          description="Try adjusting your search or category filter"
          icon="Search"
        />
      )}

      {/* Cart Modal */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowCart(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[80vh] overflow-hidden"
          >
            <Card className="relative">
              <button
                onClick={() => setShowCart(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 z-10"
              >
                <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
              </button>
              
              <div className="mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  Your Order
                </h2>
                <p className="text-gray-600">
                  Review your items before placing the order
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto mb-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.cartId} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                      {item.customizations && item.customizations.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {item.customizations.join(', ')}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateCartQuantity(item.cartId, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                      >
                        <ApperIcon name="Minus" className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateCartQuantity(item.cartId, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
                      >
                        <ApperIcon name="Plus" className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or dietary restrictions..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-primary-600">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Estimated delivery: 45 minutes
                </p>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCart(false)}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  variant="accent"
                  loading={placing}
                  className="flex-1"
                >
                  Place Order
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Floating Cart Button */}
      {cart.length > 0 && !showCart && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-8 right-8 z-40"
        >
          <Button
            onClick={() => setShowCart(true)}
            variant="accent"
            size="lg"
            className="rounded-full shadow-floating relative"
          >
            <ApperIcon name="ShoppingCart" className="w-6 h-6" />
            <Badge 
              variant="warning" 
              size="sm"
              className="absolute -top-2 -right-2"
            >
              {getCartItemCount()}
            </Badge>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Dining;