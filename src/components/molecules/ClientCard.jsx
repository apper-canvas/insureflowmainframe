import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'

const ClientCard = ({ client, policies = [], claims = [] }) => {
  const activePolicies = policies.filter(p => p.status === 'Active')
  const pendingClaims = claims.filter(c => c.status === 'Pending')
  
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group cursor-pointer" hover={true}>
        <Link to={`/clients/${client.id}`} className="block">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl text-white shadow-lg">
                <ApperIcon name="User" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors duration-200">
                  {client.name}
                </h3>
                <p className="text-sm text-gray-500">{client.email}</p>
              </div>
            </div>
            <Badge variant={getRiskBadgeVariant(client.riskScore)}>
              {getRiskLabel(client.riskScore)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {activePolicies.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">Active Policies</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border border-amber-100">
              <div className="text-2xl font-bold bg-gradient-to-r from-warning to-yellow-600 bg-clip-text text-transparent">
                {pendingClaims.length}
              </div>
              <div className="text-xs text-gray-600 font-medium">Pending Claims</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={14} />
              <span>Joined {format(new Date(client.dateJoined), 'MMM yyyy')}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Phone" size={14} />
              <span>{client.phone}</span>
            </div>
          </div>
        </Link>
      </Card>
    </motion.div>
  )
}

export default ClientCard