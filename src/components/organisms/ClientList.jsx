import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ClientCard from '@/components/molecules/ClientCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { clientService } from '@/services/api/clientService'
import { policyService } from '@/services/api/policyService'
import { claimService } from '@/services/api/claimService'

const ClientList = ({ searchQuery = '', sortBy = 'name' }) => {
  const [clients, setClients] = useState([])
  const [policies, setPolicies] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [clientsData, policiesData, claimsData] = await Promise.all([
        clientService.getAll(),
        policyService.getAll(),
        claimService.getAll()
      ])
      
      setClients(clientsData)
      setPolicies(policiesData)
      setClaims(claimsData)
    } catch (err) {
      setError('Failed to load client data')
      toast.error('Failed to load client data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredClients = clients.filter(client => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      client.name.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone.includes(query)
    )
  })

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'riskScore':
        return b.riskScore - a.riskScore
      case 'dateJoined':
        return new Date(b.dateJoined) - new Date(a.dateJoined)
      default:
        return 0
    }
  })

  const getClientPolicies = (clientId) => {
    return policies.filter(policy => policy.clientId === clientId)
  }

  const getClientClaims = (clientId) => {
    return claims.filter(claim => claim.clientId === clientId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Loading clients...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Clients</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} icon="RefreshCw" variant="error">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (sortedClients.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 max-w-md mx-auto">
          <ApperIcon name="Users" size={48} className="text-primary/60 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchQuery ? 'No Matching Clients' : 'No Clients Yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms to find clients.' 
              : 'Start by adding your first client to the system.'
            }
          </p>
          {!searchQuery && (
            <Button variant="primary" icon="Plus">
              Add First Client
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedClients.map((client, index) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ClientCard
            client={client}
            policies={getClientPolicies(client.id)}
            claims={getClientClaims(client.id)}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ClientList