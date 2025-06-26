import { forwardRef } from 'react'

const Input = forwardRef(({ 
  label, 
  error, 
  helperText, 
  className = '', 
  required = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-3 py-2.5 border rounded-lg text-sm
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
          ${error 
            ? 'border-error bg-red-50 text-error placeholder-red-400' 
            : 'border-gray-300 bg-white hover:border-gray-400'
          }
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input