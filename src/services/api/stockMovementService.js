import mockStockMovements from '../mockData/stockMovements.json'

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for stock movements
let stockMovements = [...mockStockMovements]

const stockMovementService = {
  async getAll() {
    await delay(300)
    return [...stockMovements]
  },

  async getById(id) {
    await delay(200)
    const movement = stockMovements.find(m => m.id === id)
    if (!movement) {
      throw new Error('Stock movement not found')
    }
    return { ...movement }
  },

  async getByProductId(productId) {
    await delay(250)
    return stockMovements.filter(m => m.productId === productId).map(m => ({ ...m }))
  },

  async create(movementData) {
    await delay(400)
    const newMovement = {
      id: Date.now().toString(),
      ...movementData,
      timestamp: new Date().toISOString()
    }
    stockMovements.unshift(newMovement)
    return { ...newMovement }
  },

  async update(id, movementData) {
    await delay(350)
    const index = stockMovements.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Stock movement not found')
    }
    
    const updatedMovement = {
      ...stockMovements[index],
      ...movementData,
      id
    }
    stockMovements[index] = updatedMovement
    return { ...updatedMovement }
  },

  async delete(id) {
    await delay(300)
    const index = stockMovements.findIndex(m => m.id === id)
    if (index === -1) {
      throw new Error('Stock movement not found')
    }
    
    stockMovements.splice(index, 1)
    return { success: true }
  }
}

export default stockMovementService