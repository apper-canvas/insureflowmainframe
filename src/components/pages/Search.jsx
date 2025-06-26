import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import SearchBar from '@/components/molecules/SearchBar'
import ClientCard from '@/components/molecules/ClientCard'
import PolicyCard from '@/components/molecules/PolicyCard'
import ClaimCard from '@/components/molecules/ClaimCard'
import LoadingSpinner from '@/components/atoms/LoadingSpinner'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import ApperIcon from '@/components/ApperIcon'
import { clientService } from '@/services/api/clientService'
import { policyService } from '@/services/api/policyService'
import { claimService } from '@/services/api/claimService'

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [clients, setClients] = useState([])
  const [policies, setPolicies] = useState([])
  const [claims, setClaims] = useState([])
  const [allClients, setAllClients] = useState([])
  const [allPolicies, setAllPolicies] = useState([])
  const [allClaims, setAllClaims] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')

  const loadAllData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [clientsData, policiesData, claimsData] = await Promise.all([
        clientService.getAll(),
        policyService.getAll(),
        claimService.getAll()
      ])
      
      setAllClients(clientsData)
      setAllPolicies(policiesData)
      setAllClaims(claimsData)
    } catch (err) {
      setError('Failed to load search data')
      toast.error('Failed to load search data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery !== query) {
      setQuery(urlQuery)
    }
  }, [searchParams])

  const performSearch = (searchQuery) => {
    if (!searchQuery.trim()) {
      setClients([])
      setPolicies([])
      setClaims([])
      return
    }

    const normalizedQuery = searchQuery.toLowerCase()

    // Search clients
    const matchingClients = allClients.filter(client =>
      client.name.toLowerCase().includes(normalizedQuery) ||
      client.email.toLowerCase().includes(normalizedQuery) ||
      client.phone.includes(normalizedQuery) ||
      client.address.toLowerCase().includes(normalizedQuery)
    )

    // Search policies
    const matchingPolicies = allPolicies.filter(policy => {
      const client = allClients.find(c => c.id === policy.clientId)
      return (
        policy.type.toLowerCase().includes(normalizedQuery) ||
        policy.policyNumber.toLowerCase().includes(normalizedQuery) ||
        client?.name.toLowerCase().includes(normalizedQuery)
      )
    })

    // Search claims
    const matchingClaims = allClaims.filter(claim => {
      const client = allClients.find(c => c.id === claim.clientId)
      const policy = allPolicies.find(p => p.id === claim.policyId)
      return (
        claim.description.toLowerCase().includes(normalizedQuery) ||
        claim.status.toLowerCase().includes(normalizedQuery) ||
        client?.name.toLowerCase().includes(normalizedQuery) ||
        policy?.type.toLowerCase().includes(normalizedQuery)
      )
    })

    setClients(matchingClients)
    setPolicies(matchingPolicies)
    setClaims(matchingClaims)
  }

  useEffect(() => {
    if (allClients.length > 0 && allPolicies.length > 0 && allClaims.length > 0) {
      performSearch(query)
    }
  }, [query, allClients, allPolicies, allClaims])

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    setSearchParams(searchQuery ? { q: searchQuery } : {})
  }

  const getClientPolicies = (clientId) => {
    return allPolicies.filter(policy => policy.clientId === clientId)
  }

  const getClientClaims = (clientId) => {
    return allClaims.filter(claim => claim.clientId === clientId)
  }

  const getClient = (clientId) => {
    return allClients.find(client => client.id === clientId)
  }

  const getPolicy = (policyId) => {
    return allPolicies.find(policy => policy.id === policyId)
  }

  const totalResults = clients.length + policies.length + claims.length

  const filteredData = () => {
    switch (activeFilter) {
      case 'clients':
        return { clients, policies: [], claims: [] }
      case 'policies':
        return { clients: [], policies, claims: [] }
      case 'claims':
        return { clients: [], policies: [], claims }
      default:
        return { clients, policies, claims }
    }
  }

  const { clients: filteredClients, policies: filteredPolicies, claims: filteredClaims } = filteredData()
  const filteredTotal = filteredClients.length + filteredPolicies.length + filteredClaims.length

  const filterOptions = [
    { value: 'all', label: 'All Results', count: totalResults },
    { value: 'clients', label: 'Clients', count: clients.length },
    { value: 'policies', label: 'Policies', count: policies.length },
    { value: 'claims', label: 'Claims', count: claims.length }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="text-gray-500 mt-4 text-lg">Loading search data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Global Search
        </h1>
        <p className="text-gray-600 mt-1">Search across all clients, policies, and claims in your system.</p>
      </div>

      {/* Search Controls */}
      <motion.div 
        className="bg-white rounded-xl shadow-card border border-gray-100 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-4">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search everything - clients, policies, claims..."
            className="max-w-2xl"
          />
          
          {query && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setActiveFilter(option.value)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${activeFilter === option.value
                      ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  <span>{option.label}</span>
                  <Badge 
                    variant={activeFilter === option.value ? 'default' : 'primary'} 
                    size="xs"
                    className={activeFilter === option.value ? 'bg-white/20 text-white' : ''}
                  >
                    {option.count}
                  </Badge>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Search Results */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-xl p-8 max-w-md mx-auto">
            <ApperIcon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadAllData} icon="RefreshCw" variant="error">
              Try Again
            </Button>
          </div>
        </div>
      )}

      {!query && !error && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 max-w-md mx-auto">
            <ApperIcon name="Search" size={48} className="text-primary/60 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Your Search</h3>
            <p className="text-gray-600">
              Enter keywords to search across all clients, policies, and claims in your system.
            </p>
          </div>
        </div>
      )}

      {query && !error && filteredTotal === 0 && (
        <div className="text-center py-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 max-w-md mx-auto">
            <ApperIcon name="SearchX" size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              No matches found for "{query}". Try different keywords or check your spelling.
            </p>
          </div>
        </div>
      )}

      {query && !error && filteredTotal > 0 && (
        <div className="space-y-8">
          {/* Results Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6"
          >
            <div className="flex items-center space-x-3">
              <ApperIcon name="Search" size={24} className="text-primary" />
              <div>
                <h3 className="font-semibold text-gray-900">
                  {filteredTotal} result{filteredTotal !== 1 ? 's' : ''} found for "{query}"
                </h3>
                <p className="text-sm text-gray-600">
                  {activeFilter === 'all' 
                    ? `${clients.length} clients, ${policies.length} policies, ${claims.length} claims`
                    : `Showing ${filterOptions.find(f => f.value === activeFilter)?.label.toLowerCase()}`
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Clients Results */}
          {filteredClients.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name="Users" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Clients ({filteredClients.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClients.map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    policies={getClientPolicies(client.id)}
                    claims={getClientClaims(client.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Policies Results */}
          {filteredPolicies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name="Shield" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Policies ({filteredPolicies.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPolicies.map((policy) => (
                  <PolicyCard
                    key={policy.id}
                    policy={policy}
                    client={getClient(policy.clientId)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* Claims Results */}
          {filteredClaims.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3">
                <ApperIcon name="FileText" size={20} className="text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Claims ({filteredClaims.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredClaims.map((claim) => (
                  <ClaimCard
                    key={claim.id}
                    claim={claim}
                    client={getClient(claim.clientId)}
                    policy={getPolicy(claim.policyId)}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search