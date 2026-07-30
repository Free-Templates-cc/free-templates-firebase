import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { SEOHead } from '../components/seo/SEOHead'
import { useAuthStore } from '../stores/authStore'
import { createCheckoutSession } from '../lib/api'
import toast from 'react-hot-toast'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: { monthly: '$0', yearly: '$0' },
    description: 'Get started with free templates.',
    features: [
      { name: 'Browse all templates', included: true },
      { name: 'Download free templates', included: true },
      { name: 'Community support', included: true },
      { name: 'Premium template access', included: false },
      { name: 'Priority support', included: false },
      { name: 'Early access to new releases', included: false },
    ],
  },
  {
    name: 'Premium',
    price: { monthly: '$12', yearly: '$99' },
    description: 'Unlock all premium templates.',
    popular: true,
    features: [
      { name: 'Browse all templates', included: true },
      { name: 'Download free templates', included: true },
      { name: 'Download premium templates', included: true },
      { name: 'Priority support', included: true },
      { name: 'Early access to new releases', included: true },
      { name: 'Cancel anytime', included: true },
    ],
  },
]

function PricingCard({
  plan,
  annual,
  user,
  profile,
  isCreatingCheckout,
  onCheckout,
}: {
  plan: (typeof plans)[number]
  annual: boolean
  user: { uid: string } | null
  profile: { subscription?: { tier?: string } } | null
  isCreatingCheckout: boolean
  onCheckout: (planKey: string) => void
}) {
  return (
    <div
      className={`relative rounded-2xl border-2 p-8 ${
        plan.popular
          ? 'border-primary-500 bg-primary-50 dark:border-primary-500 dark:bg-primary-950/20'
          : 'border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900'
      }`}
    >
      {plan.popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-600 px-4 py-1 text-xs font-medium text-white">
          Most Popular
        </span>
      )}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{plan.description}</p>
      <div className="mt-6">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          {annual ? plan.price.yearly : plan.price.monthly}
        </span>
        {plan.name === 'Premium' && (
          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
            /{annual ? 'year' : 'month'}
          </span>
        )}
      </div>

      <ul className="mt-8 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature.name} className="flex items-center gap-3 text-sm">
            {feature.included ? (
              <Check className="h-4 w-4 shrink-0 text-green-500" />
            ) : (
              <X className="h-4 w-4 shrink-0 text-gray-300 dark:text-gray-600" />
            )}
            <span
              className={
                feature.included
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-400 dark:text-gray-500'
              }
            >
              {feature.name}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        {user ? (
          plan.name === 'Premium' ? (
            profile?.subscription?.tier === 'premium' ? (
              <Button variant="outline" size="lg" className="w-full" disabled>
                Current Plan
              </Button>
            ) : (
              <Button
                variant="premium"
                size="lg"
                className="w-full"
                isLoading={isCreatingCheckout}
                onClick={() => {
                  const planKey = annual ? 'premium_yearly' : 'premium_monthly'
                  onCheckout(planKey)
                }}
              >
                Upgrade Now
              </Button>
            )
          ) : (
            <Button variant="outline" size="lg" className="w-full" disabled>
              Current Plan
            </Button>
          )
        ) : (
          <Link
            to={
              plan.name === 'Premium'
                ? `/login?redirect=${encodeURIComponent('/pricing')}`
                : '/templates'
            }
          >
            <Button variant={plan.popular ? 'premium' : 'outline'} size="lg" className="w-full">
              {plan.name === 'Premium' ? 'Sign In to Upgrade' : 'Browse Free Templates'}
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export function PricingPage() {
  const [annual, setAnnual] = useState(false)
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false)
  const { user, profile } = useAuthStore()

  const handleCheckout = async (planKey: string) => {
    if (!user?.uid) {
      toast.error('You must be signed in to subscribe.')
      return
    }
    setIsCreatingCheckout(true)
    try {
      const { url } = await createCheckoutSession(
        user.uid,
        planKey,
        `${window.location.origin}/account?checkout=success`,
        `${window.location.origin}/pricing?checkout=canceled`,
      )
      window.location.href = url
    } catch (err: any) {
      toast.error(err.message || 'Failed to start checkout. Please try again.')
    } finally {
      setIsCreatingCheckout(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SEOHead
        title="Pricing — Free Templates"
        description="Choose the perfect plan for your needs. Free access to hundreds of templates or go Premium for unlimited downloads of all premium templates."
      />

      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Start with free templates. Upgrade when you need more.
        </p>
      </div>

      {/* Toggle */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <span
          className={`text-sm font-medium ${!annual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative h-6 w-11 rounded-full transition-colors ${annual ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${annual ? 'translate-x-5' : ''}`}
          />
        </button>
        <span
          className={`text-sm font-medium ${annual ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
        >
          Yearly <span className="text-green-500">(Save 31%)</span>
        </span>
      </div>

      {/* Plans */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:mx-auto lg:max-w-3xl">
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            annual={annual}
            user={user}
            profile={profile}
            isCreatingCheckout={isCreatingCheckout}
            onCheckout={handleCheckout}
          />
        ))}
      </div>
    </div>
  )
}
