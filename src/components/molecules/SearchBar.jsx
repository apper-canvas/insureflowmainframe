import { useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'

const SearchBar = ({ 
  onSearch, 
  placeholder = "Search clients, policies, claims...", 
  className = '' 
}) => {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    // Debounce search for real-time results
    if (onSearch && e.target.value.length > 2) {
      const timeoutId = setTimeout(() => {
        onSearch(e.target.value)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="
            w-full pl-10 pr-4 py-2.5 
            bg-gradient-to-r from-gray-50 to-white
            border border-gray-200 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200
            text-sm placeholder-gray-500
          "
        />
      </div>
    </motion.form>
  )
}

export default SearchBar