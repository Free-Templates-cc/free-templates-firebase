import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  free: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  premium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  nextjs: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  gatsby: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  nuxt: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  vue: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  react: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
} as const

export type BadgeVariant = keyof typeof badgeVariants

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'free', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
