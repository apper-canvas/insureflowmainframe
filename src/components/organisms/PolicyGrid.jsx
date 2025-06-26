import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import PolicyCard from '@/components/molecules/PolicyCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { policyService } from '@/services/api/policyService'
import { clientService } from '@/services/api/clientService'

const PolicyGrid = ({ filterStatus = 'all', searchQuery = '' }) => {
  const [policies, setPolicies] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [policiesData, clientsData] = await Promise.all([
        policyService.getAll(),
        clientService.getAll()
      ])
      
      setPolicies(policiesData)
      setClients(clientsData)
    } catch (err) {
      setError('Failed to load policy data')
      toast.error('Failed to load policy data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredPolicies = policies.filter(policy => {
    // Filter by status
    if (filterStatus !== 'all' && policy.status !== filterStatus) {
      return false
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const client = clients.find(c => c.id === policy.clientId)
      return (
        policy.type.toLowerCase().includes(query) ||
        policy.policyNumber.toLowerCase().includes(query) ||
        client?.name.toLowerCase().includes(query)
      )
    }
    
    return true
  })

  const getClient = (clientId) => {
    return clients.find(client => client.id === clientId)
  }

  const handleRenewPolicy = async (policy) => {
    try {
      const renewedPolicy = {
        ...policy,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Active'
      }
      
      await policyService.update(policy.id, renewedPolicy)
      await loadData()
      toast.success('Policy renewed successfully')
    } catch (err) {
      toast.error('Failed to renew policy')
    }
  }

  const handleEditPolicy = (policy) => {
    // This would typically open a modal or navigate to edit form
    toast.info('Edit policy functionality would be implemented here')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Loading policies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Policies</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} icon="RefreshCw" variant="error">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (filteredPolicies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 max-w-md mx-auto">
          <ApperIcon name="Shield" size={48} className="text-primary/60 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery || filterStatus !== 'all' ? 'No Matching Policies' : 'No Policies Yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || filterStatus !== 'all'
              ? 'Try adjusting your filters or search terms.' 
              : 'Start by creating your first policy.'
            }
          </p>
          {!searchQuery && filterStatus === 'all' && (
            <Button variant="primary" icon="Plus">
              Create First Policy
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredPolicies.map((policy, index) => (
        <motion.div
          key={policy.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <PolicyCard
            policy={policy}
            client={getClient(policy.clientId)}
            onRenew={handleRenewPolicy}
            onEdit={handleEditPolicy}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default PolicyGrid