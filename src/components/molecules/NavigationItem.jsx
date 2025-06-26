import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const NavigationItem = ({ to, icon, label, badge }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `
        group flex items-center px-4 py-3 text-sm font-medium rounded-lg
        transition-all duration-200 ease-out relative
        ${isActive 
          ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }
      `}
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="activeNavItem"
              className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 rounded-lg"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
          <div className="relative flex items-center w-full">
            <ApperIcon 
              name={icon} 
              size={20} 
              className={`mr-3 transition-transform duration-200 ${
                isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
              }`}
            />
            <span className={`
              flex-1 transition-colors duration-200
              ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}
            `}>
              {label}
            </span>
            {badge && (
              <span className={`
                ml-auto px-2 py-1 text-xs font-medium rounded-full
                ${isActive 
                  ? 'bg-white/20 text-white' 
                  : 'bg-primary/10 text-primary'
                }
              `}>
                {badge}
              </span>
            )}
          </div>
        </>
      )}
    </NavLink>
  )
}

export default NavigationItem