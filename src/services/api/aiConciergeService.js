import aiConciergeMockData from '../mockData/aiConcierge.json';

class AIConciergeService {
  constructor() {
    this.sessions = new Map();
    this.responses = aiConciergeMockData.responses;
    this.contextKeywords = aiConciergeMockData.contextKeywords;
  }

  async createSession() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sessionId = `session-${Date.now()}`;
    const session = {
      id: sessionId,
      createdAt: new Date(),
      messages: [],
      context: {}
    };
    
    this.sessions.set(sessionId, session);
    return session;
  }

  async getSession(sessionId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.sessions.get(sessionId);
  }

  async sendMessage(sessionId, message) {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Add user message to session
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    // Analyze message for context
    const context = this.analyzeMessage(message);
    session.context = { ...session.context, ...context };

    // Generate AI response
    const response = this.generateResponse(message, session.context);
    
    // Add AI response to session
    session.messages.push({
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestions: response.suggestions
    });

    return response;
  }

  analyzeMessage(message) {
    const context = {};
    const lowerMessage = message.toLowerCase();

    // Detect intent categories
    for (const [category, keywords] of Object.entries(this.contextKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        context.category = category;
        break;
      }
    }

    // Extract time references
    const timePatterns = {
      tonight: /tonight|this evening/i,
      tomorrow: /tomorrow/i,
      weekend: /weekend|saturday|sunday/i,
      specific_time: /(\d{1,2}):?(\d{2})?\s?(am|pm|AM|PM)/
    };

    for (const [timeType, pattern] of Object.entries(timePatterns)) {
      if (pattern.test(message)) {
        context.timePreference = timeType;
        break;
      }
    }

    return context;
  }

  generateResponse(message, context) {
    const category = context.category || 'general';
    const categoryResponses = this.responses[category] || this.responses.general;
    
    // Select appropriate response based on context
    let response;
    if (context.timePreference && categoryResponses.timeSpecific) {
      const timeResponses = categoryResponses.timeSpecific[context.timePreference];
      if (timeResponses) {
        response = timeResponses[Math.floor(Math.random() * timeResponses.length)];
      }
    }
    
    if (!response) {
      response = categoryResponses.general[Math.floor(Math.random() * categoryResponses.general.length)];
    }

    // Generate contextual suggestions
    const suggestions = this.generateSuggestions(category, context);

    return {
      content: response,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      category,
      confidence: 0.85 + Math.random() * 0.15
    };
  }

  generateSuggestions(category, context) {
    const baseSuggestions = {
      dining: [
        'Show me fine dining options',
        'What about casual restaurants?',
        'I need dietary restrictions accommodated',
        'Book a table for tonight'
      ],
      local: [
        'What are the top attractions?',
        'Find family-friendly activities',
        'Show me nightlife options',
        'I need transportation directions'
      ],
      spa: [
        'Show available spa treatments',
        'Book a massage appointment',
        'What are your spa packages?',
        'Check spa availability for couples'
      ],
      transportation: [
        'Book airport transfer',
        'Arrange car service',
        'Get directions to downtown',
        'Find parking information'
      ],
      room_service: [
        'Show room service menu',
        'Order dinner to my room',
        'What are the breakfast options?',
        'Place a beverage order'
      ],
      events: [
        'Find concert tickets',
        'Show theater performances',
        'Book sports event tickets',
        'Find art gallery openings'
      ]
    };

    return baseSuggestions[category] || [
      'Tell me about hotel amenities',
      'Help with restaurant reservations',
      'Find local attractions',
      'Assist with room service'
    ];
  }

  async getAllSessions() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Array.from(this.sessions.values());
  }

  async deleteSession(sessionId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.sessions.delete(sessionId);
  }

  async getConversationHistory(sessionId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const session = this.sessions.get(sessionId);
    return session ? session.messages : [];
  }
}

export default new AIConciergeService();