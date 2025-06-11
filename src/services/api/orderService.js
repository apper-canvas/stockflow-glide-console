import mockOrders from '../mockData/orders.json'

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for orders
let orders = [...mockOrders]

const orderService = {
  async getAll() {
    await delay(300)
    return [...orders]
  },

  async getById(id) {
    await delay(200)
    const order = orders.find(o => o.id === id)
    if (!order) {
      throw new Error('Order not found')
    }
    return { ...order }
  },

  async getByType(type) {
    await delay(250)
    return orders.filter(o => o.type === type).map(o => ({ ...o }))
  },

  async create(orderData) {
    await delay(500)
    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    orders.unshift(newOrder)
    return { ...newOrder }
  },

  async update(id, orderData) {
    await delay(400)
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    
    const updatedOrder = {
      ...orders[index],
      ...orderData,
      id,
      updatedAt: new Date().toISOString()
    }
    orders[index] = updatedOrder
    return { ...updatedOrder }
  },

  async delete(id) {
    await delay(300)
    const index = orders.findIndex(o => o.id === id)
    if (index === -1) {
      throw new Error('Order not found')
    }
    
    orders.splice(index, 1)
    return { success: true }
  }
}

export default orderService