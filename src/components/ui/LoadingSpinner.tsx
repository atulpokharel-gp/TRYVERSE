import { clsx } from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'dark' | 'light' | 'gold'
  className?: string
  label?: string
}

export default function LoadingSpinner({
  size = 'md',
  color = 'dark',
  className,
  label = 'Loading…',
}: LoadingSpinnerProps) {
  return (
    <div
      className={clsx('inline-flex flex-col items-center justify-center gap-3', className)}
      role="status"
      aria-label={label}
    >
      <div
        className={clsx(
          'rounded-full border-2 border-t-transparent animate-spin',
          {
            'w-4 h-4': size === 'sm',
            'w-8 h-8': size === 'md',
            'w-12 h-12': size === 'lg',
            'border-charcoal-900': color === 'dark',
            'border-white': color === 'light',
            'border-[#C9A84C]': color === 'gold',
          }
        )}
      />
      {size !== 'sm' && (
        <span
          className={clsx('text-xs', {
            'text-charcoal-500': color === 'dark',
            'text-white/60': color === 'light',
            'text-[#C9A84C]': color === 'gold',
          })}
        >
          {label}
        </span>
      )}
    </div>
  )
}
