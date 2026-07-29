import { useAuthStore } from '../../stores/authStore'
import { Navigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Shield, FileText, Users, Download } from 'lucide-react'

export function AdminPage() {
  const { isAdmin, isLoading } = useAuthStore()

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  const stats = [
    { label: 'Total Templates', value: '—', icon: FileText },
    { label: 'Total Users', value: '—', icon: Users },
    { label: 'Total Downloads', value: '—', icon: Download },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <div className="flex items-center gap-3">
                <stat.icon className="h-8 w-8 text-primary-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <h2 className="font-semibold text-gray-900 dark:text-white">Template Management</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add, edit, or remove templates. This section requires Firebase setup with Firestore.
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Once Firebase is configured, this panel will allow you to manage all template listings.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
