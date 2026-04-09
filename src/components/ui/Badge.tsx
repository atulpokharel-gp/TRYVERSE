import { HTMLAttributes } from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'success' | 'danger' | 'outline'
  size?: 'sm' | 'md'
}

export default function Badge({ className, variant = 'default', size = 'sm', children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-medium rounded-full',
        {
          'bg-charcoal-100 text-charcoal-700': variant === 'default',
          'bg-[#C9A84C]/15 text-[#C9A84C] border border-[#C9A84C]/30': variant === 'gold',
          'bg-emerald-100 text-emerald-700': variant === 'success',
          'bg-red-100 text-red-700': variant === 'danger',
          'border border-charcoal-300 text-charcoal-600 bg-transparent': variant === 'outline',
          'text-xs px-2 py-0.5': size === 'sm',
          'text-sm px-3 py-1': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
