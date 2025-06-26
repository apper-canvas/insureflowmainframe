import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Chart from "react-apexcharts";
import { policyService } from "@/services/api/policyService";
import { clientService } from "@/services/api/clientService";
import { claimService } from "@/services/api/claimService";
import ApperIcon from "@/components/ApperIcon";
import Policies from "@/components/pages/Policies";
import Claims from "@/components/pages/Claims";
import StatsCard from "@/components/molecules/StatsCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import LoadingSpinner from "@/components/atoms/LoadingSpinner";
import Button from "@/components/atoms/Button";
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

  // Calculate premium trends by month
  const premiumTrends = React.useMemo(() => {
    const monthlyData = {};
    policies.forEach(policy => {
      const month = format(new Date(policy.startDate), 'MMM yyyy');
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += policy.premium;
    });
    
    return Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => new Date(a.month) - new Date(b.month))
      .slice(-6); // Last 6 months
  }, [policies]);

  // Calculate policy duration distribution
  const policyDurations = React.useMemo(() => {
    const durationData = {};
    policies.forEach(policy => {
      const startDate = new Date(policy.startDate);
      const endDate = new Date(policy.endDate);
      const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24 * 365)); // Years
      const type = policy.type;
      
      if (!durationData[type]) {
        durationData[type] = { total: 0, count: 0 };
      }
      durationData[type].total += duration;
      durationData[type].count += 1;
    });
    
    return Object.entries(durationData).map(([type, data]) => ({
      type,
      avgDuration: Math.round(data.total / data.count * 10) / 10
    }));
  }, [policies]);

  // Calculate claim resolution times
  const claimResolutionTimes = React.useMemo(() => {
    const resolutionData = {};
    claims.forEach(claim => {
      const status = claim.status;
      if (claim.dateResolved) {
        const submitDate = new Date(claim.dateSubmitted);
        const resolveDate = new Date(claim.dateResolved);
        const days = Math.ceil((resolveDate - submitDate) / (1000 * 60 * 60 * 24));
        
        if (!resolutionData[status]) {
          resolutionData[status] = { total: 0, count: 0 };
        }
        resolutionData[status].total += days;
        resolutionData[status].count += 1;
      }
    });
    
    return Object.entries(resolutionData).map(([status, data]) => ({
      status,
      avgDays: Math.round(data.total / data.count),
      count: data.count
    }));
  }, [claims]);

  // Chart options
  const premiumChartOptions = {
    chart: {
      type: 'area',
      toolbar: { show: false },
      sparkline: { enabled: false }
    },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.3,
        opacityTo: 0.1
      }
    },
    colors: ['#3B82F6'],
    xaxis: {
      categories: premiumTrends.map(t => t.month),
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value)
      }
    },
    grid: { show: true, strokeDashArray: 3 },
    tooltip: {
      y: { formatter: (value) => formatCurrency(value) }
    }
  };

  const durationChartOptions = {
    chart: { type: 'donut' },
    labels: policyDurations.map(d => d.type),
    colors: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444'],
    legend: { position: 'bottom' },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Avg Years',
              formatter: () => {
                const avg = policyDurations.reduce((sum, d) => sum + d.avgDuration, 0) / policyDurations.length;
                return Math.round(avg * 10) / 10;
              }
            }
          }
        }
      }
    }
  };

  const resolutionChartOptions = {
    chart: {
      type: 'bar',
      toolbar: { show: false }
    },
    colors: ['#10B981'],
    xaxis: {
      categories: claimResolutionTimes.map(r => r.status),
      labels: { style: { fontSize: '12px' } }
    },
    yaxis: {
      title: { text: 'Days' },
      labels: { formatter: (value) => Math.round(value) }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    },
    grid: { show: true, strokeDashArray: 3 },
    tooltip: {
      y: { formatter: (value) => `${value} days` }
    }
  };

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

      {/* Charts Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Analytics & Insights
            </h2>
            <p className="text-gray-600 mt-1">Visual breakdown of key business metrics</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Premium Trends Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl text-white shadow-lg">
                    <ApperIcon name="TrendingUp" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Premium Trends</h3>
                    <p className="text-sm text-gray-600">Monthly premium collection over time</p>
                  </div>
                </div>
                <Badge variant="info">
                  {premiumTrends.length} Months
                </Badge>
              </div>
              
              {premiumTrends.length > 0 ? (
                <div className="h-80">
                  <Chart
                    options={premiumChartOptions}
                    series={[{
                      name: 'Monthly Premiums',
                      data: premiumTrends.map(t => t.total)
                    }]}
                    type="area"
                    height="100%"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="BarChart3" size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No premium data available</p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Policy Duration Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-3 rounded-xl text-white shadow-lg">
                    <ApperIcon name="PieChart" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Policy Durations</h3>
                    <p className="text-sm text-gray-600">Average duration by policy type</p>
                  </div>
                </div>
                <Badge variant="secondary">
                  {policyDurations.length} Types
                </Badge>
              </div>
              
              {policyDurations.length > 0 ? (
                <div className="h-80">
                  <Chart
                    options={durationChartOptions}
                    series={policyDurations.map(d => d.avgDuration)}
                    type="donut"
                    height="100%"
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="PieChart" size={32} className="text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No duration data available</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Claim Resolution Times - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl text-white shadow-lg">
                  <ApperIcon name="Clock" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Claim Resolution Times</h3>
                  <p className="text-sm text-gray-600">Average processing time by claim status</p>
                </div>
              </div>
              <Badge variant="success">
                {claimResolutionTimes.reduce((sum, r) => sum + r.count, 0)} Claims
              </Badge>
            </div>
            
            {claimResolutionTimes.length > 0 ? (
              <div className="h-64">
                <Chart
                  options={resolutionChartOptions}
                  series={[{
                    name: 'Average Days',
                    data: claimResolutionTimes.map(r => r.avgDays)
                  }]}
                  type="bar"
                  height="100%"
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="BarChart3" size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No resolution data available</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard