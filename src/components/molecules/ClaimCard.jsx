import { motion } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ClaimCard = ({ claim, client, policy, onUpdate }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Approved': return 'success'
      case 'Rejected': return 'error'
      case 'Pending': return 'warning'
      case 'Under Review': return 'info'
      default: return 'default'
    }
  }

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'success'
      default: return 'default'
    }
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
            <div className="bg-gradient-to-br from-warning to-orange-600 p-3 rounded-xl text-white shadow-lg">
              <ApperIcon name="FileText" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Claim #{claim.id}</h3>
              <p className="text-sm text-gray-500">{client?.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getPriorityVariant(claim.priority)} size="xs">
              {claim.priority} Priority
            </Badge>
            <Badge variant={getStatusVariant(claim.status)}>
              {claim.status}
            </Badge>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-3xl font-bold bg-gradient-to-r from-warning to-orange-600 bg-clip-text text-transparent mb-2">
            {formatCurrency(claim.amount)}
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{claim.description}</p>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Policy:</span>
            <span className="font-medium text-gray-900">
              {policy?.type} #{policy?.policyNumber}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Submitted:</span>
            <span className="font-medium text-gray-900">
              {format(new Date(claim.dateSubmitted), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        {claim.status === 'Pending' && (
          <div className="flex space-x-2">
            <Button 
              variant="success" 
              size="sm" 
              icon="Check" 
              onClick={() => onUpdate?.(claim.id, 'Approved')}
              className="flex-1"
            >
              Approve
            </Button>
            <Button 
              variant="error" 
              size="sm" 
              icon="X" 
              onClick={() => onUpdate?.(claim.id, 'Rejected')}
              className="flex-1"
            >
              Reject
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

export default ClaimCard