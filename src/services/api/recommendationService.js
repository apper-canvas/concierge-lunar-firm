import recommendationData from '../mockData/recommendation.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...recommendationData];

const recommendationService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new Error('Recommendation not found');
    }
    return { ...item };
  },

  async getByType(type) {
    await delay(250);
    return data.filter(item => item.type === type).map(item => ({ ...item }));
  },

  async create(recommendation) {
    await delay(400);
    const newRecommendation = {
      ...recommendation,
      id: Date.now().toString()
    };
    data.push(newRecommendation);
    return { ...newRecommendation };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Recommendation not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Recommendation not found');
    }
    data.splice(index, 1);
    return { success: true };
  }
};

export default recommendationService;