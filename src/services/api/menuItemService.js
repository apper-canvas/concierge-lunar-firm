import menuItemData from '../mockData/menuItem.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let data = [...menuItemData];

const menuItemService = {
  async getAll() {
    await delay(300);
    return [...data];
  },

  async getById(id) {
    await delay(200);
    const item = data.find(item => item.id === id);
    if (!item) {
      throw new Error('Menu item not found');
    }
    return { ...item };
  },

  async getByCategory(category) {
    await delay(250);
    return data.filter(item => item.category === category).map(item => ({ ...item }));
  },

  async create(menuItem) {
    await delay(400);
    const newMenuItem = {
      ...menuItem,
      id: Date.now().toString()
    };
    data.push(newMenuItem);
    return { ...newMenuItem };
  },

  async update(id, updates) {
    await delay(300);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Menu item not found');
    }
    data[index] = { ...data[index], ...updates };
    return { ...data[index] };
  },

  async delete(id) {
    await delay(250);
    const index = data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Menu item not found');
    }
    data.splice(index, 1);
    return { success: true };
  }
};

export default menuItemService;