import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import StatsCard from '@/components/molecules/StatsCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { clientService } from '@/services/api/clientService'
import { policyService } from '@/services/api/policyService'
import { claimService } from '@/services/api/claimService'
import { format } from 'date-fns'

const Dashboard = () => {
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
      setError('Failed to load dashboard data')
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Calculate metrics
  const totalClients = clients.length
  const activePolicies = policies.filter(p => p.status === 'Active').length
  const pendingClaims = claims.filter(c => c.status === 'Pending').length
  const totalPremiums = policies.reduce((sum, p) => sum + p.premium, 0)

  // Get expiring policies (within 30 days)
  const expiringPolicies = policies.filter(policy => {
    const daysUntilExpiry = Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0 && policy.status === 'Active'
  })

  // Get recent claims
  const recentClaims = claims
    .sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted))
    .slice(0, 5)

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="text-gray-500 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 max-w-md">
            <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadData} icon="RefreshCw" variant="error">
              Retry Loading
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your insurance business.</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" icon="Download">
            Export Report
          </Button>
          <Button variant="primary" icon="Plus">
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatsCard
            title="Total Clients"
            value={totalClients}
            icon="Users"
            trend="up"
            trendValue="12%"
            gradient={true}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatsCard
            title="Active Policies"
            value={activePolicies}
            icon="Shield"
            trend="up"
            trendValue="8%"
            gradient={true}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <StatsCard
            title="Pending Claims"
            value={pendingClaims}
            icon="FileText"
            trend={pendingClaims > 5 ? "up" : "down"}
            trendValue={pendingClaims > 5 ? "High" : "Normal"}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <StatsCard
            title="Total Premiums"
            value={formatCurrency(totalPremiums)}
            icon="DollarSign"
            trend="up"
            trendValue="15%"
            gradient={true}
          />
        </motion.div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expiring Policies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-warning to-orange-600 p-3 rounded-xl text-white shadow-lg">
                  <ApperIcon name="Clock" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Expiring Soon</h3>
                  <p className="text-sm text-gray-600">Policies expiring within 30 days</p>
                </div>
              </div>
              <Badge variant="warning">
                {expiringPolicies.length} Policies
              </Badge>
            </div>
            
            <div className="space-y-3">
              {expiringPolicies.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="CheckCircle" size={32} className="text-success mx-auto mb-2" />
                  <p className="text-gray-600">No policies expiring soon</p>
                </div>
              ) : (
                expiringPolicies.slice(0, 5).map((policy) => {
                  const client = clients.find(c => c.id === policy.clientId)
                  const daysLeft = Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24))
                  
                  return (
                    <div key={policy.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                      <div>
                        <p className="font-medium text-gray-900">{client?.name}</p>
                        <p className="text-sm text-gray-600">{policy.type} - #{policy.policyNumber}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="warning" size="xs">
                          {daysLeft} days left
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(policy.endDate), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            
            {expiringPolicies.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full">
                  View All {expiringPolicies.length} Expiring Policies
                </Button>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent Claims */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-info to-blue-600 p-3 rounded-xl text-white shadow-lg">
                  <ApperIcon name="Activity" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recent Claims</h3>
                  <p className="text-sm text-gray-600">Latest claim submissions</p>
                </div>
              </div>
              <Badge variant="info">
                {claims.length} Total
              </Badge>
            </div>
            
            <div className="space-y-3">
              {recentClaims.length === 0 ? (
                <div className="text-center py-8">
                  <ApperIcon name="FileText" size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No recent claims</p>
                </div>
              ) : (
                recentClaims.map((claim) => {
                  const client = clients.find(c => c.id === claim.clientId)
                  const getStatusVariant = (status) => {
                    switch (status) {
                      case 'Approved': return 'success'
                      case 'Rejected': return 'error'
                      case 'Pending': return 'warning'
                      default: return 'info'
                    }
                  }
                  
                  return (
                    <div key={claim.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div>
                        <p className="font-medium text-gray-900">{client?.name}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(claim.amount)}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={getStatusVariant(claim.status)} size="xs">
                          {claim.status}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(claim.dateSubmitted), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            
            {claims.length > 5 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="w-full">
                  View All Claims
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard