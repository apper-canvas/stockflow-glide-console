import React from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

function InvoiceListFilter({ filters, onFiltersChange, totalCount, filteredCount }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      dateRange: 'all'
    })
  }

  const hasActiveFilters = filters.search || filters.status !== 'all' || filters.dateRange !== 'all'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ApperIcon name="Search" size={16} className="text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search invoices..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </Select>

          <Select
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="flex items-center gap-2 text-gray-600"
            >
              <ApperIcon name="X" size={16} />
              Clear Filters
            </Button>
          )}
          
          <div className="text-sm text-gray-500">
            {filteredCount === totalCount ? (
              <span>{totalCount} invoice{totalCount !== 1 ? 's' : ''}</span>
            ) : (
              <span>
                {filteredCount} of {totalCount} invoice{totalCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="hover:text-blue-600"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange('status', 'all')}
                  className="hover:text-green-600"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
            
            {filters.dateRange !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Date: {filters.dateRange === 'week' ? 'Past Week' : 
                       filters.dateRange === 'month' ? 'Past Month' : 'Past Quarter'}
                <button
                  onClick={() => handleFilterChange('dateRange', 'all')}
                  className="hover:text-purple-600"
                >
                  <ApperIcon name="X" size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceListFilter