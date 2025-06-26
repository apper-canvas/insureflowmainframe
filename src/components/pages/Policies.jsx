import { useState } from 'react'
import { motion } from 'framer-motion'
import PolicyGrid from '@/components/organisms/PolicyGrid'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'

const Policies = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const statusOptions = [
    { value: 'all', label: 'All Policies', count: 0 },
    { value: 'Active', label: 'Active', count: 0 },
    { value: 'Expired', label: 'Expired', count: 0 },
    { value: 'Pending', label: 'Pending', count: 0 }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Policy Management
          </h1>
          <p className="text-gray-600 mt-1">Track and manage all insurance policies in one place.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" icon="Filter">
            Advanced Filters
          </Button>
          <Button variant="primary" icon="Plus">
            Create Policy
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
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search policies by type, client, or policy number..."
            />
          </div>
          
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
                {option.value !== 'all' && (
                  <Badge 
                    variant={filterStatus === option.value ? 'default' : 'primary'} 
                    size="xs"
                    className={filterStatus === option.value ? 'bg-white/20 text-white' : ''}
                  >
                    {option.count}
                  </Badge>
                )}
              </button>
            ))}
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="Shield" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Policies</p>
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
              <p className="text-sm text-gray-600 font-medium">Active Policies</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-warning to-yellow-600 p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="Clock" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-warning to-yellow-600 bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Expiring Soon</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-lg text-white shadow-lg">
              <ApperIcon name="DollarSign" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                --
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Premiums</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Policy Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <PolicyGrid filterStatus={filterStatus} searchQuery={searchQuery} />
      </motion.div>
    </div>
  )
}

export default Policies