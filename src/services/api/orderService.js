import orderData from '../mockData/order.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...orderData];

const orderService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new Error('Order not found');
    }
    return { ...item };
  },

  async create(order) {
    await delay(400);
    const newOrder = {
      ...order,
      id: Date.now().toString(),
      status: 'pending',
      deliveryTime: new Date(Date.now() + 45 * 60000).toISOString() // 45 minutes from now
    };
    data.unshift(newOrder);
    return { ...newOrder };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Order not found');
    }
    data.splice(index, 1);
    return { success: true };
  }
};

export default orderService;