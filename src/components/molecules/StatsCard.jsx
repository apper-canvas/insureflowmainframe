import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  gradient = false,
  className = '' 
}) => {
  return (
    <Card className={`${className} relative overflow-hidden`} padding="p-6">
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      )}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-xl
            ${gradient 
              ? 'bg-gradient-to-br from-primary to-accent text-white shadow-lg' 
              : 'bg-gray-100 text-gray-600'
            }
          `}>
            <ApperIcon name={icon} size={24} />
          </div>
          {trend && (
            <div className={`
              flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
              ${trend === 'up' 
                ? 'bg-success/10 text-success' 
                : trend === 'down' 
                ? 'bg-error/10 text-error'
                : 'bg-gray-100 text-gray-600'
              }
            `}>
              <ApperIcon 
                name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={12} 
              />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <motion.div 
            className={`
              text-3xl font-bold
              ${gradient 
                ? 'bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent' 
                : 'text-gray-900'
              }
            `}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {value}
          </motion.div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
        </div>
      </div>
    </Card>
  )
}

export default StatsCard