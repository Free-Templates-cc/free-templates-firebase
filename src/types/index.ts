import type { Timestamp } from 'firebase/firestore'

type PriceTier = 'free' | 'premium'
type Framework = 'Next.js' | 'Gatsby.js' | 'Nuxt.js' | 'Vue.js' | 'React'
type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete'
type UserRole = 'user' | 'admin'

export interface Template {
  id: string
  name: string
  slug: string
  description: string
  category: string
  framework: Framework
  priceTier: PriceTier
  demoUrl?: string
  githubUrl?: string
  features: string[]
  tags: string[]
  mainImage: string
  previewImages: string[]
  downloadUrl: string
  downloads: number
  published: boolean
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface UserProfile {
  uid: string
  displayName: string
  email: string
  photoURL?: string
  role: UserRole
  subscription: UserSubscription
  downloadCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface UserSubscription {
  status: SubscriptionStatus
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  tier: 'free' | 'premium'
  currentPeriodEnd?: Timestamp
  canceledAt?: Timestamp
}

export interface Download {
  id: string
  userId: string
  templateId: string
  templateName: string
  templateSlug: string
  templateCategory: string
  downloadedAt: string
  priceTier?: PriceTier
}

export interface TemplateFilters {
  search: string
  category: string
  framework: string
  priceTier: PriceTier | 'all'
  sort: 'newest' | 'popular' | 'name'
}
