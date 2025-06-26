import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import ApperIcon from '@/components/ApperIcon'
import { clientService } from '@/services/api/clientService'
import { policyService } from '@/services/api/policyService'
import { claimService } from '@/services/api/claimService'

const ClientDetail = () => {
  const { id } = useParams()
  const [client, setClient] = useState(null)
  const [policies, setPolicies] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [clientData, policiesData, claimsData] = await Promise.all([
        clientService.getById(id),
        policyService.getAll(),
        claimService.getAll()
      ])
      
      setClient(clientData)
      setPolicies(policiesData.filter(p => p.clientId === id))
      setClaims(claimsData.filter(c => c.clientId === id))
    } catch (err) {
      setError('Failed to load client details')
      toast.error('Failed to load client details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getRiskBadgeVariant = (score) => {
    if (score <= 3) return 'success'
    if (score <= 6) return 'warning'
    return 'error'
  }

  const getRiskLabel = (score) => {
    if (score <= 3) return 'Low Risk'
    if (score <= 6) return 'Medium Risk'
    return 'High Risk'
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'active'
      case 'Approved': return 'success'
      case 'Rejected': return 'error'
      case 'Pending': return 'warning'
      case 'Expired': return 'expired'
      default: return 'inactive'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="text-gray-500 mt-4 text-lg">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 max-w-md">
            <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Not Found</h3>
            <p className="text-gray-600 mb-4">
              {error || 'The client you are looking for does not exist.'}
            </p>
            <div className="flex space-x-3 justify-center">
              <Link to="/clients">
                <Button variant="secondary" icon="ArrowLeft">
                  Back to Clients
                </Button>
              </Link>
              <Button onClick={loadData} icon="RefreshCw" variant="error">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const activePolicies = policies.filter(p => p.status === 'Active')
  const totalPremiums = policies.reduce((sum, p) => sum + p.premium, 0)
  const pendingClaims = claims.filter(c => c.status === 'Pending')
  const totalClaims = claims.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/clients">
            <Button variant="ghost" size="sm" icon="ArrowLeft">
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {client.name}
            </h1>
            <p className="text-gray-600 mt-1">Client Details & Portfolio</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" icon="Edit">
            Edit Client
          </Button>
          <Button variant="primary" icon="Plus">
            Add Policy
          </Button>
        </div>
      </div>

      {/* Client Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-primary to-accent p-4 rounded-xl text-white shadow-lg">
                <ApperIcon name="User" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
                <p className="text-gray-600">{client.email}</p>
                <p className="text-gray-600">{client.phone}</p>
              </div>
            </div>
            <Badge variant={getRiskBadgeVariant(client.riskScore)} size="md">
              {getRiskLabel(client.riskScore)}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {activePolicies.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Active Policies</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent">
                {formatCurrency(totalPremiums)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Premiums</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-warning to-yellow-600 bg-clip-text text-transparent">
                {pendingClaims.length}
              </div>
              <div className="text-sm text-gray-600 font-medium">Pending Claims</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {formatCurrency(totalClaims)}
              </div>
              <div className="text-sm text-gray-600 font-medium">Total Claims</div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Mail" size={16} className="text-gray-500" />
                  <span>{client.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Phone" size={16} className="text-gray-500" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ApperIcon name="MapPin" size={16} className="text-gray-500" />
                  <span>{client.address}</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Client Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date Joined:</span>
                  <span>{format(new Date(client.dateJoined), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk Score:</span>
                  <span className="font-medium">{client.riskScore}/10</span>
                </div>
                {client.notes && (
                  <div>
                    <span className="text-gray-600">Notes:</span>
                    <p className="text-gray-900 mt-1">{client.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Policies and Claims Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-accent to-blue-600 p-3 rounded-xl text-white shadow-lg">
                  <ApperIcon name="Shield" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Policies</h3>
                  <p className="text-sm text-gray-600">{policies.length} total policies</p>
                </div>
              </div>
              <Button size="sm" variant="primary" icon="Plus">
                Add Policy
              </Button>
            </div>

            <div className="space-y-4">
              {policies.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="Shield" size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No policies yet</p>
                </div>
              ) : (
                policies.map((policy) => (
                  <div
                    key={policy.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{policy.type}</h4>
                        <p className="text-sm text-gray-600">#{policy.policyNumber}</p>
                      </div>
                      <Badge variant={getStatusVariant(policy.status)} size="sm">
                        {policy.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Premium:</span>
                        <p className="font-semibold text-success">{formatCurrency(policy.premium)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Coverage:</span>
                        <p className="font-semibold text-primary">{formatCurrency(policy.coverage)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Start Date:</span>
                        <p>{format(new Date(policy.startDate), 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">End Date:</span>
                        <p>{format(new Date(policy.endDate), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* Claims */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-warning to-orange-600 p-3 rounded-xl text-white shadow-lg">
                  <ApperIcon name="FileText" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Claims</h3>
                  <p className="text-sm text-gray-600">{claims.length} total claims</p>
                </div>
              </div>
              <Button size="sm" variant="primary" icon="Plus">
                Add Claim
              </Button>
            </div>

            <div className="space-y-4">
              {claims.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="FileText" size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No claims yet</p>
                </div>
              ) : (
                claims.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">Claim #{claim.id}</h4>
                        <p className="text-sm text-gray-600">{formatCurrency(claim.amount)}</p>
                      </div>
                      <Badge variant={getStatusVariant(claim.status)} size="sm">
                        {claim.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{claim.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Priority: {claim.priority}</span>
                      <span>{format(new Date(claim.dateSubmitted), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ClientDetail