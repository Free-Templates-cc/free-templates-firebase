/**
 * API layer for templates.
 *
 * Currently returns mock data with realistic structure.
 * Swap the implementations to Firestore queries when the Firebase
 * project is connected — the return types and pagination shapes
 * are designed to remain the same.
 */

import type { Template, TemplateFilters } from '../types'

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const allTemplates: Template[] = [
  {
    id: '1',
    name: 'Portfolio Pro',
    slug: 'portfolio-pro',
    description:
      'A modern portfolio template for creative professionals. Features smooth animations, dark mode, and a project showcase with filtering.',
    category: 'Portfolio',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/portfolio-pro',
    githubUrl: 'https://github.com/example/portfolio-pro',
    features: [
      'Fully responsive',
      'Dark mode',
      'Smooth animations',
      'Project filtering',
      'Blog section',
      'Contact form',
    ],
    tags: ['portfolio', 'creative', 'nextjs'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 3421,
    published: true,
    createdAt: { seconds: 1690000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1690000000, nanoseconds: 0 } as any,
  },
  {
    id: '2',
    name: 'Business Plus',
    slug: 'business-plus',
    description:
      'Corporate template built for startups and small businesses. Includes team pages, testimonials, and a pricing table.',
    category: 'Business',
    framework: 'Gatsby.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/business-plus',
    githubUrl: 'https://github.com/example/business-plus',
    features: [
      'Team section',
      'Testimonials',
      'Pricing table',
      'Contact form',
      'Blog',
      'Analytics ready',
    ],
    tags: ['business', 'corporate', 'startup'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 2890,
    published: true,
    createdAt: { seconds: 1689000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1689000000, nanoseconds: 0 } as any,
  },
  {
    id: '3',
    name: 'EduLearn',
    slug: 'edulearn',
    description:
      'A clean educational platform template with course listings, instructor profiles, and student dashboards.',
    category: 'Education',
    framework: 'Nuxt.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/edulearn',
    githubUrl: 'https://github.com/example/edulearn',
    features: [
      'Course listings',
      'Instructor profiles',
      'Student dashboard',
      'Progress tracking',
      'Video support',
      'Responsive',
    ],
    tags: ['education', 'learning', 'nuxt'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1756,
    published: true,
    createdAt: { seconds: 1688000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1688000000, nanoseconds: 0 } as any,
  },
  {
    id: '4',
    name: 'ConstructPro',
    slug: 'construct-pro',
    description:
      'Bold template for construction and architecture firms. Supports heavy imagery, blueprints, and service showcases.',
    category: 'Agency',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/construct-pro',
    githubUrl: 'https://github.com/example/construct-pro',
    features: [
      'Project gallery',
      'Service pages',
      'Testimonials',
      'Quote form',
      'Blog',
      'Map integration',
    ],
    tags: ['construction', 'architecture', 'agency'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1203,
    published: true,
    createdAt: { seconds: 1687000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1687000000, nanoseconds: 0 } as any,
  },
  {
    id: '5',
    name: 'StartupKit',
    slug: 'startup-kit',
    description:
      'A complete startup landing page with feature highlights, investor decks, and early-access waitlist.',
    category: 'SaaS',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/startup-kit',
    githubUrl: 'https://github.com/example/startup-kit',
    features: [
      'Landing page',
      'Waitlist system',
      'Feature sections',
      'Pricing',
      'Blog',
      'Analytics',
    ],
    tags: ['startup', 'saas', 'landing'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 4521,
    published: true,
    createdAt: { seconds: 1686000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1686000000, nanoseconds: 0 } as any,
  },
  {
    id: '6',
    name: 'DevPortfolio',
    slug: 'dev-portfolio',
    description:
      'Minimal developer portfolio with code-syntax highlighting, project pins, and GitHub integration.',
    category: 'Portfolio',
    framework: 'Vue.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/dev-portfolio',
    githubUrl: 'https://github.com/example/dev-portfolio',
    features: [
      'Code highlighting',
      'GitHub integration',
      'Project pins',
      'Blog',
      'Dark mode',
      'Responsive',
    ],
    tags: ['developer', 'portfolio', 'vue'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 3100,
    published: true,
    createdAt: { seconds: 1685000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1685000000, nanoseconds: 0 } as any,
  },
  {
    id: '7',
    name: 'AgencyX',
    slug: 'agency-x',
    description:
      'Full-service agency template with case studies, service catalogues, and a dynamic team grid.',
    category: 'Agency',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/agency-x',
    githubUrl: 'https://github.com/example/agency-x',
    features: [
      'Case studies',
      'Service catalogue',
      'Team grid',
      'Testimonials',
      'Blog',
      'Contact form',
    ],
    tags: ['agency', 'creative', 'nextjs'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 2100,
    published: true,
    createdAt: { seconds: 1684000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1684000000, nanoseconds: 0 } as any,
  },
  {
    id: '8',
    name: 'ShopNow',
    slug: 'shop-now',
    description:
      'E-commerce template with product grids, cart, checkout flow, and inventory management UI.',
    category: 'E-Commerce',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/shop-now',
    githubUrl: 'https://github.com/example/shop-now',
    features: [
      'Product grid',
      'Shopping cart',
      'Checkout flow',
      'Wishlist',
      'Search',
      'Responsive',
    ],
    tags: ['ecommerce', 'shop', 'react'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 5300,
    published: true,
    createdAt: { seconds: 1683000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1683000000, nanoseconds: 0 } as any,
  },
  {
    id: '9',
    name: 'BlogMind',
    slug: 'blog-mind',
    description:
      'Content-first blog template with rich typography, categories, and newsletter integration.',
    category: 'Blog',
    framework: 'Gatsby.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/blog-mind',
    githubUrl: 'https://github.com/example/blog-mind',
    features: ['Rich typography', 'Categories', 'Newsletter', 'Search', 'Dark mode', 'Fast'],
    tags: ['blog', 'content', 'gatsby'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1980,
    published: true,
    createdAt: { seconds: 1682000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1682000000, nanoseconds: 0 } as any,
  },
  {
    id: '10',
    name: 'AppLaunch',
    slug: 'app-launch',
    description:
      'Product launch landing page with countdown, feature highlights, and app store badges.',
    category: 'Landing',
    framework: 'Nuxt.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/app-launch',
    githubUrl: 'https://github.com/example/app-launch',
    features: [
      'Countdown timer',
      'Feature highlights',
      'App store badges',
      'Email capture',
      'Video hero',
      'Analytics',
    ],
    tags: ['app', 'launch', 'landing'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1640,
    published: true,
    createdAt: { seconds: 1681000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1681000000, nanoseconds: 0 } as any,
  },
  {
    id: '11',
    name: 'CreativePro',
    slug: 'creative-pro',
    description:
      'Visual storytelling template for designers, photographers, and studios. Heavy imagery, fullscreen layouts.',
    category: 'Portfolio',
    framework: 'React',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/creative-pro',
    githubUrl: 'https://github.com/example/creative-pro',
    features: [
      'Fullscreen layouts',
      'Image heavy',
      'Lightbox gallery',
      'Dark mode',
      'Smooth scroll',
      'Responsive',
    ],
    tags: ['creative', 'design', 'photography'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 2800,
    published: true,
    createdAt: { seconds: 1680000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1680000000, nanoseconds: 0 } as any,
  },
  {
    id: '12',
    name: 'TechLand',
    slug: 'tech-land',
    description:
      'Technology landing page with animated hero, feature comparison, and API documentation layout.',
    category: 'Landing',
    framework: 'Vue.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/tech-land',
    githubUrl: 'https://github.com/example/tech-land',
    features: [
      'Animated hero',
      'Feature comparison',
      'API docs layout',
      'Code samples',
      'Blog',
      'Contact',
    ],
    tags: ['tech', 'landing', 'vue'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1450,
    published: true,
    createdAt: { seconds: 1679000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1679000000, nanoseconds: 0 } as any,
  },
  {
    id: '13',
    name: 'FundRise',
    slug: 'fund-rise',
    description:
      'Crowdfunding campaign template with progress bars, reward tiers, and social proof sections.',
    category: 'SaaS',
    framework: 'Next.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/fund-rise',
    githubUrl: 'https://github.com/example/fund-rise',
    features: [
      'Progress bars',
      'Reward tiers',
      'Social proof',
      'Email capture',
      'Blog',
      'Responsive',
    ],
    tags: ['crowdfunding', 'saas', 'nextjs'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 920,
    published: true,
    createdAt: { seconds: 1678000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1678000000, nanoseconds: 0 } as any,
  },
  {
    id: '14',
    name: 'LawOffice',
    slug: 'law-office',
    description:
      'Professional template for law firms with practice area pages, attorney profiles, and case results.',
    category: 'Business',
    framework: 'Gatsby.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/law-office',
    githubUrl: 'https://github.com/example/law-office',
    features: [
      'Practice areas',
      'Attorney profiles',
      'Case results',
      'Testimonials',
      'Blog',
      'Contact form',
    ],
    tags: ['law', 'legal', 'business'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 780,
    published: true,
    createdAt: { seconds: 1677000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1677000000, nanoseconds: 0 } as any,
  },
  {
    id: '15',
    name: 'FitLife',
    slug: 'fit-life',
    description:
      'Fitness & wellness template with class schedules, trainer profiles, and membership plans.',
    category: 'Business',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/fit-life',
    githubUrl: 'https://github.com/example/fit-life',
    features: [
      'Class schedules',
      'Trainer profiles',
      'Membership plans',
      'Blog',
      'Gallery',
      'Contact',
    ],
    tags: ['fitness', 'wellness', 'business'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1150,
    published: true,
    createdAt: { seconds: 1676000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1676000000, nanoseconds: 0 } as any,
  },
  {
    id: '16',
    name: 'PhotoFolio',
    slug: 'photo-folio',
    description:
      'Minimal photography portfolio with masonry galleries, lightbox, and client proofing.',
    category: 'Portfolio',
    framework: 'Vue.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/photo-folio',
    githubUrl: 'https://github.com/example/photo-folio',
    features: [
      'Masonry gallery',
      'Lightbox',
      'Client proofing',
      'Password protected',
      'Dark mode',
      'Fast',
    ],
    tags: ['photography', 'portfolio', 'vue'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1980,
    published: true,
    createdAt: { seconds: 1675000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1675000000, nanoseconds: 0 } as any,
  },
  {
    id: '17',
    name: 'StoreFront',
    slug: 'store-front',
    description: 'Modern e-commerce store with product variants, reviews, and one-page checkout.',
    category: 'E-Commerce',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/store-front',
    githubUrl: 'https://github.com/example/store-front',
    features: [
      'Product variants',
      'Reviews',
      'One-page checkout',
      'Wishlist',
      'Search',
      'Responsive',
    ],
    tags: ['ecommerce', 'store', 'nextjs'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 4200,
    published: true,
    createdAt: { seconds: 1674000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1674000000, nanoseconds: 0 } as any,
  },
  {
    id: '18',
    name: 'DevOpsLab',
    slug: 'devops-lab',
    description:
      'Technical documentation template for DevOps tools, with code blocks, diagrams, and API references.',
    category: 'SaaS',
    framework: 'Nuxt.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/devops-lab',
    githubUrl: 'https://github.com/example/devops-lab',
    features: ['Code blocks', 'Diagrams', 'API reference', 'Search', 'Dark mode', 'Responsive'],
    tags: ['devops', 'documentation', 'nuxt'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 640,
    published: true,
    createdAt: { seconds: 1673000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1673000000, nanoseconds: 0 } as any,
  },
  {
    id: '19',
    name: 'HotelOne',
    slug: 'hotel-one',
    description: 'Hotel & resort template with room booking, amenity showcases, and location maps.',
    category: 'Business',
    framework: 'React',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/hotel-one',
    githubUrl: 'https://github.com/example/hotel-one',
    features: ['Room booking', 'Amenity showcase', 'Location map', 'Gallery', 'Reviews', 'Contact'],
    tags: ['hotel', 'travel', 'business'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1340,
    published: true,
    createdAt: { seconds: 1672000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1672000000, nanoseconds: 0 } as any,
  },
  {
    id: '20',
    name: 'CourseCraft',
    slug: 'course-craft',
    description:
      'Online course platform template with curriculum builder, quizzes, and student progress tracking.',
    category: 'Education',
    framework: 'Gatsby.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/course-craft',
    githubUrl: 'https://github.com/example/course-craft',
    features: [
      'Curriculum builder',
      'Quizzes',
      'Progress tracking',
      'Student dashboard',
      'Forum',
      'Responsive',
    ],
    tags: ['education', 'course', 'gatsby'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 820,
    published: true,
    createdAt: { seconds: 1671000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1671000000, nanoseconds: 0 } as any,
  },
  {
    id: '21',
    name: 'EventPro',
    slug: 'event-pro',
    description:
      'Conference and event template with speaker listings, schedule grids, and ticket sales integration.',
    category: 'Landing',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/event-pro',
    githubUrl: 'https://github.com/example/event-pro',
    features: [
      'Speaker listings',
      'Schedule grid',
      'Ticket sales',
      'Sponsor showcase',
      'Countdown',
      'Responsive',
    ],
    tags: ['event', 'conference', 'landing'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 2050,
    published: true,
    createdAt: { seconds: 1670000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1670000000, nanoseconds: 0 } as any,
  },
  {
    id: '22',
    name: 'ArtistSpace',
    slug: 'artist-space',
    description:
      'Art gallery template with virtual exhibitions, artist bios, and a print shop integration.',
    category: 'Portfolio',
    framework: 'Vue.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/artist-space',
    githubUrl: 'https://github.com/example/artist-space',
    features: [
      'Virtual exhibitions',
      'Artist bios',
      'Print shop',
      'Gallery',
      'Newsletter',
      'Responsive',
    ],
    tags: ['art', 'gallery', 'portfolio'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 670,
    published: true,
    createdAt: { seconds: 1669000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1669000000, nanoseconds: 0 } as any,
  },
  {
    id: '23',
    name: 'RecruitHub',
    slug: 'recruit-hub',
    description:
      'Job board template with listings, company profiles, and applicant tracking system UI.',
    category: 'SaaS',
    framework: 'Nuxt.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/recruit-hub',
    githubUrl: 'https://github.com/example/recruit-hub',
    features: [
      'Job listings',
      'Company profiles',
      'Applicant tracking',
      'Search',
      'Filtering',
      'Responsive',
    ],
    tags: ['recruiting', 'jobs', 'saas'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 930,
    published: true,
    createdAt: { seconds: 1668000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1668000000, nanoseconds: 0 } as any,
  },
  {
    id: '24',
    name: 'HealthPlus',
    slug: 'health-plus',
    description:
      'Healthcare provider template with doctor profiles, appointment booking, and telemedicine integration.',
    category: 'Business',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/health-plus',
    githubUrl: 'https://github.com/example/health-plus',
    features: [
      'Doctor profiles',
      'Appointment booking',
      'Telemedicine',
      'Blog',
      'Testimonials',
      'Responsive',
    ],
    tags: ['healthcare', 'medical', 'business'],
    mainImage: '',
    previewImages: [],
    downloadUrl: '',
    downloads: 1160,
    published: true,
    createdAt: { seconds: 1667000000, nanoseconds: 0 } as any,
    updatedAt: { seconds: 1667000000, nanoseconds: 0 } as any,
  },
]

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface PageData<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Inject placeholder image URLs into a template.
 * Uses deterministic picsum.photos seeds so the same slug always gets the same image.
 */
function injectImages(t: Template): Template {
  return {
    ...t,
    mainImage: t.mainImage || `https://picsum.photos/seed/${t.slug}/640/360`,
    previewImages:
      t.previewImages.length > 0
        ? t.previewImages
        : Array.from(
            { length: 5 },
            (_, i) => `https://picsum.photos/seed/${t.slug}-${i + 1}/640/360`,
          ),
  }
}

/**
 * Simulate network latency so loading states are visible during development.
 */
function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Fetch a paginated, filtered, and sorted list of templates.
 */
export async function fetchTemplates(
  filters: TemplateFilters,
  page = 1,
  pageSize = 9,
): Promise<PageData<Template>> {
  await delay()

  let filtered = [...allTemplates]

  // Search
  if (filters.search) {
    const q = filters.search.toLowerCase()
    filtered = filtered.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    )
  }

  // Category
  if (filters.category) {
    filtered = filtered.filter((t) => t.category === filters.category)
  }

  // Framework
  if (filters.framework) {
    filtered = filtered.filter((t) => t.framework === filters.framework)
  }

  // Price tier
  if (filters.priceTier !== 'all') {
    filtered = filtered.filter((t) => t.priceTier === filters.priceTier)
  }

  // Sort
  switch (filters.sort) {
    case 'popular':
      filtered.sort((a, b) => b.downloads - a.downloads)
      break
    case 'name':
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'newest':
    default:
      filtered.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
      break
  }

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = (page - 1) * pageSize
  const items = filtered.slice(start, start + pageSize).map(injectImages)

  return { items, total, page, pageSize, totalPages }
}

/**
 * Fetch a single template by its slug.
 */
export async function fetchTemplateBySlug(slug: string): Promise<Template | null> {
  await delay(300)
  const found = allTemplates.find((t) => t.slug === slug)
  return found ? injectImages(found) : null
}

/**
 * Fetch a list of related templates (same category, excluding the current one).
 */
export async function fetchRelatedTemplates(
  currentSlug: string,
  category: string,
  limit = 4,
): Promise<Template[]> {
  await delay(250)
  return allTemplates
    .filter((t) => t.slug !== currentSlug && t.category === category)
    .slice(0, limit)
    .map(injectImages)
}

// ---------------------------------------------------------------------------
// Mock download history
// ---------------------------------------------------------------------------

import type { Download } from '../types'

const mockDownloads: Download[] = [
  {
    id: 'dl-1',
    userId: 'mock-user',
    templateId: '2',
    templateName: 'Business Plus',
    templateSlug: 'business-plus',
    templateCategory: 'Business',
    downloadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'dl-2',
    userId: 'mock-user',
    templateId: '4',
    templateName: 'ConstructPro',
    templateSlug: 'construct-pro',
    templateCategory: 'Agency',
    downloadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'dl-3',
    userId: 'mock-user',
    templateId: '6',
    templateName: 'DevPortfolio',
    templateSlug: 'dev-portfolio',
    templateCategory: 'Portfolio',
    downloadedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'dl-4',
    userId: 'mock-user',
    templateId: '8',
    templateName: 'ShopNow',
    templateSlug: 'shop-now',
    templateCategory: 'E-Commerce',
    downloadedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'dl-5',
    userId: 'mock-user',
    templateId: '12',
    templateName: 'TechLand',
    templateSlug: 'tech-land',
    templateCategory: 'Landing',
    downloadedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
  },
]

/**
 * Fetch download history for the current user.
 */
export async function fetchDownloads(userId: string): Promise<Download[]> {
  await delay(350)
  return mockDownloads.filter((d) => d.userId === userId)
}

// ---------------------------------------------------------------------------
// Subscription / Billing Cloud Function helpers
// ---------------------------------------------------------------------------

/**
 * Resolve the URL for an HTTPS Cloud Function, handling emulators.
 */
function getFunctionUrl(name: string): string {
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'test-project'
  const region = 'europe-west1'
  const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true'
  if (useEmulators) {
    return `http://127.0.0.1:5001/${projectId}/${region}/${name}`
  }
  return `https://${region}-${projectId}.cloudfunctions.net/${name}`
}

interface FunctionResponse<T> {
  data?: T
  error?: string
}

async function callFunction<T>(name: string, payload: Record<string, unknown>): Promise<T> {
  const url = getFunctionUrl(name)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body: FunctionResponse<T> = await res.json()
  if (!res.ok || body.error) {
    throw new Error(body.error || `Function returned ${res.status}`)
  }
  return body as T
}

interface CancelSubscriptionResponse {
  canceledAt: string
  currentPeriodEnd: string
  status: string
}

interface CreateCheckoutSessionResponse {
  url: string
}

/** Create a Stripe Checkout Session for subscription purchase. */
export async function createCheckoutSession(
  uid: string,
  plan: string,
  successUrl?: string,
  cancelUrl?: string,
): Promise<CreateCheckoutSessionResponse> {
  return callFunction<CreateCheckoutSessionResponse>('createCheckoutSession', {
    uid,
    plan,
    ...(successUrl ? { successUrl } : {}),
    ...(cancelUrl ? { cancelUrl } : {}),
  })
}

/** Cancel a premium subscription at period end. */
export async function cancelSubscription(uid: string): Promise<CancelSubscriptionResponse> {
  return callFunction<CancelSubscriptionResponse>('cancelSubscription', { uid })
}

interface ReactivateSubscriptionResponse {
  status: string
  currentPeriodEnd: string
}

/** Reactivate a canceled-but-not-expired subscription. */
export async function reactivateSubscription(uid: string): Promise<ReactivateSubscriptionResponse> {
  return callFunction<ReactivateSubscriptionResponse>('reactivateSubscription', { uid })
}

interface BillingPortalResponse {
  url: string
}

/** Create a Stripe Customer Portal session for self-service billing management. */
export async function createBillingPortalSession(uid: string): Promise<BillingPortalResponse> {
  return callFunction<BillingPortalResponse>('createBillingPortalSession', { uid })
}
