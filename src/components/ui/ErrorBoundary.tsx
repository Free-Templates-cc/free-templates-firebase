import { Component, type ReactNode, type ErrorInfo } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
            Something went wrong
          </h2>
          <p className="mt-2 max-w-md text-sm text-gray-600 dark:text-gray-400">
            An unexpected error occurred. Please try again or contact support if the issue persists.
          </p>
          {this.state.error && (
            <details className="mt-4 max-w-md text-left">
              <summary className="cursor-pointer text-xs text-gray-500 dark:text-gray-400">
                Error details
              </summary>
              <pre className="mt-2 overflow-auto rounded-lg bg-gray-100 p-3 text-xs text-red-600 dark:bg-gray-800 dark:text-red-400">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <Button onClick={this.handleRetry} className="mt-6">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
