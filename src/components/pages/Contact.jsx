import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const Contact = () => {
  const [messageForm, setMessageForm] = useState({
    subject: '',
    message: '',
    urgency: false
  });
  const [sending, setSending] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const contactOptions = [
    {
      title: 'Front Desk',
      description: '24/7 assistance for check-in, check-out, and general inquiries',
      phone: '+1 (555) 123-4567',
      email: 'frontdesk@hotel.com',
      hours: '24/7',
      icon: 'Phone',
      color: 'primary'
    },
{
      title: 'AI Concierge',
      description: '24/7 AI-powered assistance for reservations, recommendations, and personalized service',
      phone: '+1 (555) 123-4568',
      email: 'concierge@hotel.com',
      hours: '24/7',
      icon: 'Bot',
      color: 'secondary',
      aiEnabled: true
    },
    {
      title: 'Room Service',
      description: 'Dining orders and in-room dining assistance',
      phone: '+1 (555) 123-4569',
      email: 'roomservice@hotel.com',
      hours: '6 AM - 11 PM',
      icon: 'UtensilsCrossed',
      color: 'accent'
    },
    {
      title: 'Housekeeping',
      description: 'Room cleaning, amenities, and maintenance requests',
      phone: '+1 (555) 123-4570',
      email: 'housekeeping@hotel.com',
      hours: '7 AM - 7 PM',
      icon: 'BedSingle',
      color: 'info'
    },
    {
      title: 'Emergency',
      description: 'Medical emergencies, safety concerns, and urgent assistance',
      phone: '911',
      emergency: '+1 (555) 123-4571',
      hours: '24/7',
      icon: 'AlertTriangle',
      color: 'error'
    }
  ];

  const faqItems = [
    {
      question: 'What time is check-in and check-out?',
      answer: 'Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request and subject to availability.'
    },
    {
      question: 'Is Wi-Fi available throughout the hotel?',
      answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the hotel, including all guest rooms, public areas, and meeting spaces.'
    },
    {
      question: 'What amenities are included in my stay?',
      answer: 'Your stay includes access to the fitness center, business center, concierge services, and complimentary Wi-Fi. Room service is available 6 AM - 11 PM.'
    },
    {
      question: 'How do I request additional amenities?',
      answer: 'You can request additional amenities through the hotel app, by calling housekeeping, or by speaking with front desk staff. Common requests include extra towels, pillows, and toiletries.'
    },
    {
      question: 'Is parking available?',
      answer: 'Yes, we offer both valet and self-parking options. Valet parking is $35/night and self-parking is $25/night. Electric vehicle charging stations are available.'
    },
    {
      question: 'Can I extend my stay?',
      answer: 'Extensions are subject to availability. Please contact the front desk as early as possible to request an extension. Additional nights will be charged at the current rate.'
    }
  ];

  const handleContactClick = (contact) => {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`);
    }
  };

  const handleEmailClick = (email) => {
    window.open(`mailto:${email}`);
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    
    if (!messageForm.subject.trim() || !messageForm.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSending(true);
    
    try {
      // Simulate sending message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setMessageForm({ subject: '', message: '', urgency: false });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (field, value) => {
    setMessageForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Contact & Support
        </h1>
        <p className="text-gray-600">
          We're here to help make your stay exceptional
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Options */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
            Quick Contact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {contactOptions.map((contact, index) => (
              <motion.div
                key={contact.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
<Card className="h-full hover:shadow-lg transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-${contact.color}-400 to-${contact.color}-600 flex items-center justify-center flex-shrink-0 relative`}>
                      <ApperIcon name={contact.icon} className="w-6 h-6 text-white" />
                      {contact.aiEnabled && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 rounded-full flex items-center justify-center">
                          <ApperIcon name="Sparkles" className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {contact.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 break-words">
                        {contact.description}
                      </p>
                      
                      <div className="space-y-2">
                        {contact.phone && (
                          <button
                            onClick={() => handleContactClick(contact)}
                            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                          >
                            <ApperIcon name="Phone" className="w-4 h-4" />
                            <span>{contact.phone}</span>
                          </button>
                        )}
                        {contact.emergency && (
                          <button
                            onClick={() => window.open(`tel:${contact.emergency}`)}
                            className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
                          >
                            <ApperIcon name="Phone" className="w-4 h-4" />
                            <span>Hotel Emergency: {contact.emergency}</span>
                          </button>
                        )}
                        {contact.email && (
                          <button
                            onClick={() => handleEmailClick(contact.email)}
                            className="flex items-center space-x-2 text-sm text-primary-600 hover:text-primary-700 transition-colors duration-200"
                          >
                            <ApperIcon name="Mail" className="w-4 h-4" />
                            <span>{contact.email}</span>
                          </button>
                        )}
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <ApperIcon name="Clock" className="w-4 h-4" />
                          <span>{contact.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="cursor-pointer" onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}>
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 break-words flex-1">
                        {faq.question}
                      </h3>
                      <ApperIcon 
                        name={expandedFaq === index ? "ChevronUp" : "ChevronDown"} 
                        className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4"
                      />
                    </div>
                    
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 pt-3 border-t border-gray-100"
                      >
                        <p className="text-gray-600 break-words">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Form */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h2 className="text-xl font-display font-semibold text-gray-900 mb-6">
                Send a Message
              </h2>
              
              <form onSubmit={handleMessageSubmit} className="space-y-4">
                <Input
                  label="Subject"
                  value={messageForm.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  required
                  placeholder="What can we help you with?"
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={messageForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    required
                    placeholder="Please describe your inquiry or request..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="urgency"
                    checked={messageForm.urgency}
                    onChange={(e) => handleInputChange('urgency', e.target.checked)}
                    className="rounded border-gray-300 text-accent-500 focus:ring-accent-500"
                  />
                  <label htmlFor="urgency" className="text-sm text-gray-700">
                    Mark as urgent
                  </label>
                </div>
                
                <Button
                  type="submit"
                  variant="primary"
                  loading={sending}
                  className="w-full"
                  icon="Send"
                >
                  Send Message
                </Button>
              </form>
            </Card>

            {/* Hotel Info */}
            <Card className="mt-6 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
              <div className="text-center">
                <h3 className="font-display font-semibold text-gray-900 mb-2">
                  Hotel Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="MapPin" className="w-4 h-4" />
                    <span>123 Luxury Ave, Downtown</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Phone" className="w-4 h-4" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Mail" className="w-4 h-4" />
                    <span>info@hotel.com</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;