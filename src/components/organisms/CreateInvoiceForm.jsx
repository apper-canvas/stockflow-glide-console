import React, { useState } from 'react'
import FormField from '@/components/molecules/FormField'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

function CreateInvoiceForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'draft',
    items: [{ productName: '', quantity: 1, unitPrice: 0 }],
    taxRate: 8.5,
    notes: ''
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'quantity' || field === 'unitPrice' ? parseFloat(value) || 0 : value
    }
    setFormData(prev => ({
      ...prev,
      items: newItems
    }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0 }]
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }))
    }
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice)
    }, 0)
    
    const taxAmount = subtotal * (formData.taxRate / 100)
    const totalAmount = subtotal + taxAmount

    return { subtotal, taxAmount, totalAmount }
  }

  const { subtotal, taxAmount, totalAmount } = calculateTotals()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const processedItems = formData.items.map((item, index) => ({
      id: (index + 1).toString(),
      ...item,
      total: item.quantity * item.unitPrice
    }))

    const invoiceData = {
      ...formData,
      items: processedItems,
      subtotal,
      taxAmount,
      totalAmount
    }

    onSubmit(invoiceData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Customer Name" id="customerName" required>
          <Input
            id="customerName"
            type="text"
            value={formData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </FormField>

        <FormField label="Customer Email" id="customerEmail" required>
          <Input
            id="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={(e) => handleInputChange('customerEmail', e.target.value)}
            placeholder="customer@example.com"
            required
          />
        </FormField>

        <FormField label="Issue Date" id="issueDate" required>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) => handleInputChange('issueDate', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Due Date" id="dueDate" required>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Status" id="status">
          <Select
            id="status"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </Select>
        </FormField>

        <FormField label="Tax Rate (%)" id="taxRate">
          <Input
            id="taxRate"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.taxRate}
            onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value) || 0)}
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            Add Item
          </Button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg">
            <div className="md:col-span-5">
              <FormField label="Product Name" id={`item-${index}-name`} required>
                <Input
                  id={`item-${index}-name`}
                  type="text"
                  value={item.productName}
                  onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </FormField>
            </div>

            <div className="md:col-span-2">
              <FormField label="Quantity" id={`item-${index}-quantity`} required>
                <Input
                  id={`item-${index}-quantity`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="md:col-span-3">
              <FormField label="Unit Price" id={`item-${index}-price`} required>
                <Input
                  id={`item-${index}-price`}
                  type="number"
                  step="0.01"
                  min="0"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                  required
                />
              </FormField>
            </div>

            <div className="md:col-span-2 flex items-end">
              <div className="w-full">
                <div className="text-sm font-medium text-gray-700 mb-2">Total</div>
                <div className="text-lg font-semibold text-gray-900">
                  ${(item.quantity * item.unitPrice).toFixed(2)}
                </div>
              </div>
              {formData.items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => removeItem(index)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax ({formData.taxRate}%):</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <FormField label="Notes" id="notes">
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          placeholder="Add any additional notes or payment terms..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </FormField>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Create Invoice
        </Button>
      </div>
    </form>
  )
}

export default CreateInvoiceForm