import invoicesData from '@/services/mockData/invoices.json'

let invoices = [...invoicesData]

const invoiceService = {
  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    return [...invoices]
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    const invoice = invoices.find(inv => inv.id === id)
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    return { ...invoice }
  },

  async create(invoiceData) {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
      ...invoiceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    invoices.unshift(newInvoice)
    return { ...newInvoice }
  },

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350))
    
    const index = invoices.findIndex(inv => inv.id === id)
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    
    invoices[index] = {
      ...invoices[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    return { ...invoices[index] }
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250))
    
    const index = invoices.findIndex(inv => inv.id === id)
    if (index === -1) {
      throw new Error('Invoice not found')
    }
    
    const deletedInvoice = invoices[index]
    invoices.splice(index, 1)
    return { ...deletedInvoice }
  }
}

export default invoiceService