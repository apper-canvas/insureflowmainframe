import { useState } from 'react'
import { motion } from 'framer-motion'
import ClientList from '@/components/organisms/ClientList'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const Clients = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'riskScore', label: 'Risk Score' },
    { value: 'dateJoined', label: 'Date Joined' }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Client Management
          </h1>
          <p className="text-gray-600 mt-1">Manage your insurance clients and their information.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" icon="Filter">
            Filter
          </Button>
          <Button variant="primary" icon="Plus">
            Add Client
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search clients by name, email, or phone..."
            />
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

      {/* Client List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ClientList searchQuery={searchQuery} sortBy={sortBy} />
      </motion.div>
    </div>
  )
}

export default Clients