import React from 'react'
import StatusBadge from '@/components/atoms/StatusBadge'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

function InvoiceList({ invoices, onStatusUpdate, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success'
      case 'pending':
        return 'warning'
      case 'overdue':
        return 'error'
      case 'draft':
        return 'secondary'
      default:
        return 'secondary'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['draft', 'pending', 'paid', 'overdue']
    return allStatuses.filter(status => status !== currentStatus)
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <ApperIcon name="FileText" size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
        <p className="text-gray-500 mb-6">
          No invoices match your current filters. Try adjusting your search criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Issue Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {invoice.customerName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoice.customerEmail}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(invoice.issueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(invoice.dueDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatCurrency(invoice.totalAmount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge
                    status={invoice.status}
                    variant={getStatusColor(invoice.status)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <div className="relative group">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <ApperIcon name="MoreVertical" size={16} />
                      </Button>
                      <div className="invisible group-hover:visible absolute right-0 top-8 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                        <div className="py-1">
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            View Details
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Edit Invoice
                          </button>
                          <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            Download PDF
                          </button>
                          <div className="border-t border-gray-200 my-1"></div>
                          {getStatusOptions(invoice.status).map((status) => (
                            <button
                              key={status}
                              onClick={() => onStatusUpdate(invoice.id, status)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 capitalize"
                            >
                              Mark as {status}
                            </button>
                          ))}
                          <div className="border-t border-gray-200 my-1"></div>
                          <button
                            onClick={() => onDelete(invoice.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete Invoice
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InvoiceList