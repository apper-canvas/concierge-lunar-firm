import Dashboard from '@/components/pages/Dashboard';
import Services from '@/components/pages/Services';
import Dining from '@/components/pages/Dining';
import LocalGuide from '@/components/pages/LocalGuide';
import MyRequests from '@/components/pages/MyRequests';
import AIConcierge from '@/components/pages/AIConcierge';
import Contact from '@/components/pages/Contact';

export const routes = {
  dashboard: {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'Home',
    component: Dashboard
  },
  services: {
    id: 'services',
    label: 'Services',
    path: '/services',
    icon: 'Bell',
    component: Services
  },
  dining: {
    id: 'dining',
    label: 'Dining',
    path: '/dining',
    icon: 'UtensilsCrossed',
    component: Dining
  },
  localGuide: {
    id: 'localGuide',
    label: 'Local Guide',
    path: '/local-guide',
    icon: 'MapPin',
    component: LocalGuide
  },
  myRequests: {
    id: 'myRequests',
    label: 'My Requests',
    path: '/my-requests',
    icon: 'Clock',
    component: MyRequests
  },
aiConcierge: {
    id: 'aiConcierge',
    label: 'AI Concierge',
    path: '/ai-concierge',
    icon: 'Bot',
    component: AIConcierge
  },
aiConcierge: {
    id: 'aiConcierge',
    label: 'AI Concierge',
    path: '/ai-concierge',
    icon: 'Bot',
    component: Contact
  },
  contact: {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    icon: 'Phone',
    component: Contact
  }
};

export const routeArray = Object.values(routes);
export default routes;