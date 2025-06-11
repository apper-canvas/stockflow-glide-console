import mockProducts from '../mockData/products.json'

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for products
let products = [...mockProducts]

const productService = {
  async getAll() {
    await delay(300)
    return [...products]
  },

  async getById(id) {
    await delay(200)
    const product = products.find(p => p.id === id)
    if (!product) {
      throw new Error('Product not found')
    }
    return { ...product }
  },

  async create(productData) {
    await delay(400)
    const newProduct = {
      id: Date.now().toString(),
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.unshift(newProduct)
    return { ...newProduct }
  },

  async update(id, productData) {
    await delay(350)
    const index = products.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    const updatedProduct = {
      ...products[index],
      ...productData,
      id,
      updatedAt: new Date().toISOString()
    }
    products[index] = updatedProduct
    return { ...updatedProduct }
  },

  async delete(id) {
    await delay(300)
    const index = products.findIndex(p => p.id === id)
    if (index === -1) {
      throw new Error('Product not found')
    }
    
    products.splice(index, 1)
    return { success: true }
  }
}

export default productService