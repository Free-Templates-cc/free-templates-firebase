import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Page not found</p>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-8">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back Home
        </Button>
      </Link>
    </div>
  )
}
