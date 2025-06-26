import { useState } from 'react'
import { motion } from 'framer-motion'
import ClaimsTable from '@/components/organisms/ClaimsTable'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const Claims = () => {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('dateSubmitted')

  const statusOptions = [
    { value: 'all', label: 'All Claims' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Under Review', label: 'Under Review' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' }
  ]

  const sortOptions = [
    { value: 'dateSubmitted', label: 'Date Submitted' },
    { value: 'amount', label: 'Amount' },
    { value: 'priority', label: 'Priority' }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Claims Management
          </h1>
          <p className="text-gray-600 mt-1">Review and process insurance claims efficiently.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" icon="Download">
            Export Claims
          </Button>
          <Button variant="primary" icon="Plus">
            File New Claim
          </Button>
        </div>
      </div>

      {/* Controls */}
      <motion.div 
        className="bg-white rounded-xl shadow-card border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {statusOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setFilterStatus(option.value)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200
                  ${filterStatus === option.value
                    ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <span>{option.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="ArrowUpDown" size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-warning to-yellow-600 p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="Clock" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-warning to-yellow-600 bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Pending Claims</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-info to-blue-600 p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="Eye" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-info to-blue-600 bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Under Review</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-success to-green-600 p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="CheckCircle" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-error to-red-600 p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="DollarSign" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-error to-red-600 bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Amount</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Claims Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ClaimsTable filterStatus={filterStatus} sortBy={sortBy} />
      </motion.div>
    </div>
  )
}

export default Claims