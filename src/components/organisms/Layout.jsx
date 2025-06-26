import { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import NavigationItem from '@/components/molecules/NavigationItem'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/App'

const Layout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const navigationItems = [
    { to: '/', icon: 'LayoutDashboard', label: 'Dashboard' },
    { to: '/clients', icon: 'Users', label: 'Clients' },
    { to: '/policies', icon: 'Shield', label: 'Policies' },
    { to: '/claims', icon: 'FileText', label: 'Claims' },
    { to: '/search', icon: 'Search', label: 'Search' }
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <motion.aside 
        className="hidden lg:flex lg:flex-shrink-0"
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="flex flex-col w-72 bg-white border-r border-gray-200 shadow-lg">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary to-accent">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <ApperIcon name="Shield" size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">InsureFlow</h1>
            </motion.div>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-gray-200">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search everything..."
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
              Main Menu
            </div>
            {navigationItems.map((item) => (
              <NavigationItem key={item.to} {...item} />
            ))}
          </nav>

{/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="space-y-3">
              <LogoutButton />
              <div className="text-xs text-gray-500 text-center">
                © 2024 InsureFlow CRM
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative flex flex-col w-80 max-w-xs h-full bg-white shadow-2xl"
            >
              {/* Mobile Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-primary to-accent">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <ApperIcon name="Shield" size={20} className="text-white" />
                  </div>
                  <h1 className="text-lg font-bold text-white">InsureFlow</h1>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-white/80 hover:text-white transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="p-4 border-b border-gray-200">
                <SearchBar 
                  onSearch={handleSearch}
                  placeholder="Search everything..."
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 px-4 py-4 space-y-1">
                {navigationItems.map((item) => (
                  <NavigationItem key={item.to} {...item} />
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="Menu" size={20} />
            </button>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Shield" size={20} className="text-primary" />
              <h1 className="text-lg font-bold text-gray-900">InsureFlow</h1>
            </div>
            <div className="w-10" /> {/* Spacer for balance */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="h-full"
          >
            {children}
          </motion.div>
</main>
      </div>
    </div>
  )
}

// Logout Component
const LogoutButton = () => {
  const { logout } = useContext(AuthContext)
  const user = useSelector((state) => state.user.user)
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  
  return (
    <div className="space-y-2">
      {user && (
        <div className="text-xs text-gray-600 text-center">
          {user.firstName} {user.lastName}
        </div>
      )}
      <Button
        variant="secondary"
        size="sm"
        icon="LogOut"
        onClick={handleLogout}
        className="w-full"
      >
        Logout
      </Button>
    </div>
  )
}

export default Layout