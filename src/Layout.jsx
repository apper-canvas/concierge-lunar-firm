import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { routes } from '@/config/routes';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Desktop Header */}
      <header className="hidden md:block flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Building2" className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-display font-semibold text-gray-900">
                  Concierge Pro
                </h1>
              </div>
            </div>
            
            <nav className="flex space-x-1">
              {Object.values(routes).map((route) => (
                <NavLink
                  key={route.id}
                  to={route.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center space-x-2">
                        <ApperIcon name={route.icon} className="w-4 h-4" />
                        <span>{route.label}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-primary-50 rounded-lg -z-10"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500">
                Room 1247
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg flex items-center justify-center">
                <ApperIcon name="Building2" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-display font-semibold text-gray-900">
                Concierge Pro
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Room 1247</span>
              <div className="w-6 h-6 bg-gradient-to-br from-accent-400 to-accent-500 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">
          <Outlet />
        </main>
      </div>

{/* Mobile Bottom Navigation */}
      <nav className="md:hidden flex-shrink-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-6 gap-1 px-2 py-1">
          {Object.values(routes).slice(0, 6).map((route) => (
            <NavLink
              key={route.id}
              to={route.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-primary-600'
                }`
              }
            >
              <ApperIcon name={route.icon} className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{route.label.split(' ')[0]}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;