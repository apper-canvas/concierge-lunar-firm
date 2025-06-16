import serviceRequestData from '../mockData/serviceRequest.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...serviceRequestData];

const serviceRequestService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new Error('Service request not found');
    }
    return { ...item };
  },

  async create(serviceRequest) {
    await delay(400);
    const newServiceRequest = {
      ...serviceRequest,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    data.unshift(newServiceRequest);
    return { ...newServiceRequest };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Service request not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Service request not found');
    }
    data.splice(index, 1);
    return { success: true };
  }
};

export default serviceRequestService;