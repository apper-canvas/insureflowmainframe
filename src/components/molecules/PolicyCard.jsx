import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const PolicyCard = ({ policy, client, onRenew, onEdit }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Active': return 'active'
      case 'Expired': return 'expired'
      case 'Pending': return 'pending'
      default: return 'inactive'
    }
  }

  const isNearExpiry = () => {
    const daysUntilExpiry = Math.ceil((new Date(policy.endDate) - new Date()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group" hover={true}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-accent to-blue-600 p-3 rounded-xl text-white shadow-lg">
              <ApperIcon name="Shield" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{policy.type}</h3>
              <p className="text-sm text-gray-500">#{policy.policyNumber}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isNearExpiry() && (
              <Badge variant="warning" size="xs">
                <ApperIcon name="Clock" size={12} className="mr-1" />
                Expiring Soon
              </Badge>
            )}
            <Badge variant={getStatusVariant(policy.status)}>
              {policy.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Premium</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-success to-green-600 bg-clip-text text-transparent">
              {formatCurrency(policy.premium)}
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">Coverage</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {formatCurrency(policy.coverage)}
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Client:</span>
            <span className="font-medium text-gray-900">{client?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Start Date:</span>
            <span className="font-medium text-gray-900">
              {format(new Date(policy.startDate), 'MMM dd, yyyy')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">End Date:</span>
            <span className="font-medium text-gray-900">
              {format(new Date(policy.endDate), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="secondary" 
            size="sm" 
            icon="Edit" 
            onClick={() => onEdit?.(policy)}
            className="flex-1"
          >
            Edit
          </Button>
          {(policy.status === 'Active' || isNearExpiry()) && (
            <Button 
              variant="primary" 
              size="sm" 
              icon="RefreshCw" 
              onClick={() => onRenew?.(policy)}
              className="flex-1"
            >
              Renew
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default PolicyCard