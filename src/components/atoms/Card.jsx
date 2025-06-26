import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = 'p-6',
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hover ? { 
        scale: 1.01,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      } : {}}
      className={`
        bg-white rounded-xl shadow-card 
        transition-all duration-300 ease-out
        border border-gray-100/50
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card