import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import SectionHeader from '@/components/molecules/SectionHeader'
import InvoiceListFilter from '@/components/organisms/InvoiceListFilter'
import InvoiceList from '@/components/organisms/InvoiceList'
import Modal from '@/components/molecules/Modal'
import CreateInvoiceForm from '@/components/organisms/CreateInvoiceForm'
import AlertMessage from '@/components/atoms/AlertMessage'
import Spinner from '@/components/atoms/Spinner'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import invoiceService from '@/services/api/invoiceService'

function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    dateRange: 'all'
  })

  useEffect(() => {
    loadInvoices()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [invoices, filters])

  async function loadInvoices() {
    try {
      setLoading(true)
      setError(null)
      const data = await invoiceService.getAll()
      setInvoices(data)
    } catch (err) {
      setError('Failed to load invoices. Please try again.')
      console.error('Error loading invoices:', err)
    } finally {
      setLoading(false)
    }
  }

  function applyFilters() {
    let filtered = [...invoices]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(invoice =>
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customerName.toLowerCase().includes(searchLower) ||
        invoice.customerEmail.toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === filters.status)
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (filters.dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3)
          break
      }
      
      if (filters.dateRange !== 'all') {
        filtered = filtered.filter(invoice => 
          new Date(invoice.issueDate) >= filterDate
        )
      }
    }

    setFilteredInvoices(filtered)
  }

  async function handleCreateInvoice(invoiceData) {
    try {
      const newInvoice = await invoiceService.create(invoiceData)
      setInvoices(prev => [newInvoice, ...prev])
      setShowCreateModal(false)
      toast.success('Invoice created successfully!')
    } catch (err) {
      toast.error('Failed to create invoice. Please try again.')
      console.error('Error creating invoice:', err)
    }
  }

  async function handleUpdateInvoiceStatus(invoiceId, newStatus) {
    try {
      const updatedInvoice = await invoiceService.update(invoiceId, { status: newStatus })
      setInvoices(prev =>
        prev.map(invoice =>
          invoice.id === invoiceId ? updatedInvoice : invoice
        )
      )
      toast.success('Invoice status updated successfully!')
    } catch (err) {
      toast.error('Failed to update invoice status. Please try again.')
      console.error('Error updating invoice status:', err)
    }
  }

  async function handleDeleteInvoice(invoiceId) {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return
    }

    try {
      await invoiceService.delete(invoiceId)
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId))
      toast.success('Invoice deleted successfully!')
    } catch (err) {
      toast.error('Failed to delete invoice. Please try again.')
      console.error('Error deleting invoice:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Spinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
<SectionHeader
        title="Invoices"
        subtitle="Manage customer invoices and billing"
        action={
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
          >
            <ApperIcon name="Plus" size={16} />
            Create Invoice
          </Button>
        }
      />

      {error && (
        <AlertMessage
          type="error"
          title="Error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <InvoiceListFilter
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={invoices.length}
        filteredCount={filteredInvoices.length}
      />

      <InvoiceList
        invoices={filteredInvoices}
        onStatusUpdate={handleUpdateInvoiceStatus}
        onDelete={handleDeleteInvoice}
      />

      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Invoice"
          size="large"
        >
          <CreateInvoiceForm
            onSubmit={handleCreateInvoice}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  )
}

export default InvoicesPage