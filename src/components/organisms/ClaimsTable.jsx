import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ClaimCard from '@/components/molecules/ClaimCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { claimService } from '@/services/api/claimService'
import { clientService } from '@/services/api/clientService'
import { policyService } from '@/services/api/policyService'

const ClaimsTable = ({ filterStatus = 'all', sortBy = 'dateSubmitted' }) => {
  const [claims, setClaims] = useState([])
  const [clients, setClients] = useState([])
  const [policies, setPolicies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [claimsData, clientsData, policiesData] = await Promise.all([
        claimService.getAll(),
        clientService.getAll(),
        policyService.getAll()
      ])
      
      setClaims(claimsData)
      setClients(clientsData)
      setPolicies(policiesData)
    } catch (err) {
      setError('Failed to load claims data')
      toast.error('Failed to load claims data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredClaims = claims.filter(claim => {
    if (filterStatus === 'all') return true
    return claim.status === filterStatus
  })

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    switch (sortBy) {
      case 'dateSubmitted':
        return new Date(b.dateSubmitted) - new Date(a.dateSubmitted)
      case 'amount':
        return b.amount - a.amount
      case 'priority':
        const priorityOrder = { High: 3, Medium: 2, Low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  const getClient = (clientId) => {
    return clients.find(client => client.id === clientId)
  }

  const getPolicy = (policyId) => {
    return policies.find(policy => policy.id === policyId)
  }

  const handleUpdateClaim = async (claimId, newStatus) => {
    try {
      const claim = claims.find(c => c.id === claimId)
      if (!claim) return

      const updatedClaim = { ...claim, status: newStatus }
      await claimService.update(claimId, updatedClaim)
      await loadData()
      
      toast.success(`Claim ${newStatus.toLowerCase()} successfully`)
    } catch (err) {
      toast.error('Failed to update claim')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 mt-4">Loading claims...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
          <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Claims</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData} icon="RefreshCw" variant="error">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (sortedClaims.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 max-w-md mx-auto">
          <ApperIcon name="FileText" size={48} className="text-warning/60 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {filterStatus !== 'all' ? `No ${filterStatus} Claims` : 'No Claims Yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {filterStatus !== 'all'
              ? 'No claims match the selected status filter.' 
              : 'Claims will appear here as they are submitted.'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sortedClaims.map((claim, index) => (
        <motion.div
          key={claim.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ClaimCard
            claim={claim}
            client={getClient(claim.clientId)}
            policy={getPolicy(claim.policyId)}
            onUpdate={handleUpdateClaim}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default ClaimsTable