import { clsx } from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-charcoal-900 text-cream-100 hover:bg-charcoal-800 focus:ring-charcoal-500': variant === 'primary',
            'bg-cream-200 text-charcoal-900 hover:bg-cream-300 focus:ring-charcoal-300': variant === 'secondary',
            'bg-transparent text-charcoal-700 hover:bg-charcoal-50 focus:ring-charcoal-300': variant === 'ghost',
            'border border-charcoal-300 bg-transparent text-charcoal-700 hover:bg-charcoal-50 focus:ring-charcoal-300': variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-5 py-2.5 text-base': size === 'md',
            'px-7 py-3.5 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
