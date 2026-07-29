import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '../../lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  includeHome?: boolean
}

export function Breadcrumbs({ items, className, includeHome = true }: BreadcrumbsProps) {
  const allItems = includeHome ? [{ label: 'Home', href: '/' }, ...items] : items

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      <ol className="flex items-center gap-1">
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1

          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-400" aria-hidden="true" />}

              {isLast ? (
                <span className="font-medium text-gray-900 dark:text-white" aria-current="page">
                  {item.href ? (
                    <Link to={item.href} className="hover:text-primary-600">
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </span>
              ) : (
                <Link
                  to={item.href || '#'}
                  className="text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {i === 0 && includeHome ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-3.5 w-3.5" />
                      <span className="sr-only">Home</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
