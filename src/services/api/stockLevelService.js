import mockStockLevels from '../mockData/stockLevels.json'

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for stock levels
let stockLevels = [...mockStockLevels]

const stockLevelService = {
  async getAll() {
    await delay(300)
    return [...stockLevels]
  },

  async getById(id) {
    await delay(200)
    const stockLevel = stockLevels.find(s => s.id === id)
    if (!stockLevel) {
      throw new Error('Stock level not found')
    }
    return { ...stockLevel }
  },

  async getByProductId(productId) {
    await delay(250)
    const stockLevel = stockLevels.find(s => s.productId === productId)
    return stockLevel ? { ...stockLevel } : null
  },

  async create(stockData) {
    await delay(400)
    const newStockLevel = {
      id: Date.now().toString(),
      ...stockData,
      lastUpdated: new Date().toISOString()
    }
    stockLevels.unshift(newStockLevel)
    return { ...newStockLevel }
  },

  async update(id, stockData) {
    await delay(350)
    const index = stockLevels.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Stock level not found')
    }
    
    const updatedStockLevel = {
      ...stockLevels[index],
      ...stockData,
      id,
      lastUpdated: new Date().toISOString()
    }
    stockLevels[index] = updatedStockLevel
    return { ...updatedStockLevel }
  },

  async delete(id) {
    await delay(300)
    const index = stockLevels.findIndex(s => s.id === id)
    if (index === -1) {
      throw new Error('Stock level not found')
    }
    
    stockLevels.splice(index, 1)
    return { success: true }
  }
}

export default stockLevelService