const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '' 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary/10 to-blue-100 text-primary border border-primary/20',
    success: 'bg-gradient-to-r from-success/10 to-green-100 text-success border border-success/20',
    warning: 'bg-gradient-to-r from-warning/10 to-yellow-100 text-warning border border-warning/20',
    error: 'bg-gradient-to-r from-error/10 to-red-100 text-error border border-error/20',
    info: 'bg-gradient-to-r from-info/10 to-blue-100 text-info border border-info/20',
    active: 'bg-gradient-to-r from-emerald-50 to-green-100 text-emerald-700 border border-emerald-200',
    inactive: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200',
    pending: 'bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-700 border border-amber-200',
    expired: 'bg-gradient-to-r from-red-50 to-pink-100 text-red-700 border border-red-200'
  }

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  }

  return (
    <span className={`
      inline-flex items-center font-medium rounded-full
      transition-all duration-200
      ${variants[variant]}
      ${sizes[size]}
      ${className}
    `}>
      {children}
    </span>
  )
}

export default Badge