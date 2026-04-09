import { HTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'dark'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = false, padding = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'rounded-2xl transition-all duration-300',
          {
            'bg-white border border-charcoal-100 shadow-card': variant === 'default',
            'bg-white/5 backdrop-blur-md border border-white/10': variant === 'glass',
            'bg-[#161616] border border-white/8': variant === 'dark',
            'hover:shadow-premium hover:-translate-y-0.5 cursor-pointer': hover,
            'p-0': padding === 'none',
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
