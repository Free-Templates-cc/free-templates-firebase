import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'

interface PremiumRouteProps {
  children: React.ReactNode
}

export function PremiumRoute({ children }: PremiumRouteProps) {
  const { user, isLoading, isPremium } = useAuthStore()

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isPremium) {
    return <Navigate to="/pricing" replace />
  }

  return <>{children}</>
}
