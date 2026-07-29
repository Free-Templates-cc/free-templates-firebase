/**
 * Firestore Emulator Seed Script
 *
 * Populates the Firebase Emulator with mock template data for local development.
 *
 * Usage:
 *   1. Start the emulators:   firebase emulators:start
 *   2. Run this script:       npx tsx scripts/seed-emulator.ts
 *
 * The script connects to the Firestore emulator on localhost:8080
 * and creates the templates collection with 24 sample templates.
 */

import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID || 'test-project'
const EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST || 'localhost:8080'

// ---------------------------------------------------------------------------
// Mock template data
// ---------------------------------------------------------------------------

interface SeedTemplate {
  name: string
  slug: string
  description: string
  category: string
  framework: string
  priceTier: 'free' | 'premium'
  demoUrl: string
  githubUrl: string
  features: string[]
  tags: string[]
  downloads: number
  published: boolean
}

const TEMPLATES: SeedTemplate[] = [
  {
    name: 'Portfolio Pro',
    slug: 'portfolio-pro',
    description:
      'A modern portfolio template for creative professionals. Features smooth animations, dark mode, and a project showcase with filtering.',
    category: 'Portfolio',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/portfolio-pro',
    githubUrl: 'https://github.com/example/portfolio-pro',
    features: ['Fully responsive', 'Dark mode', 'Smooth animations', 'Project filtering', 'Blog section', 'Contact form'],
    tags: ['portfolio', 'creative', 'nextjs'],
    downloads: 3421,
    published: true,
  },
  {
    name: 'Business Plus',
    slug: 'business-plus',
    description:
      'Corporate template built for startups and small businesses. Includes team pages, testimonials, and a pricing table.',
    category: 'Business',
    framework: 'Gatsby.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/business-plus',
    githubUrl: 'https://github.com/example/business-plus',
    features: ['Team section', 'Testimonials', 'Pricing table', 'Contact form', 'Blog', 'Analytics ready'],
    tags: ['business', 'corporate', 'startup'],
    downloads: 2890,
    published: true,
  },
  {
    name: 'EduLearn',
    slug: 'edulearn',
    description:
      'A clean educational platform template with course listings, instructor profiles, and student dashboards.',
    category: 'Education',
    framework: 'Nuxt.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/edulearn',
    githubUrl: 'https://github.com/example/edulearn',
    features: ['Course listings', 'Instructor profiles', 'Student dashboard', 'Progress tracking', 'Video support', 'Responsive'],
    tags: ['education', 'learning', 'nuxt'],
    downloads: 1756,
    published: true,
  },
  {
    name: 'ConstructPro',
    slug: 'construct-pro',
    description:
      'Bold template for construction and architecture firms. Supports heavy imagery, blueprints, and service showcases.',
    category: 'Agency',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/construct-pro',
    githubUrl: 'https://github.com/example/construct-pro',
    features: ['Project gallery', 'Service pages', 'Testimonials', 'Quote form', 'Blog', 'Map integration'],
    tags: ['construction', 'architecture', 'agency'],
    downloads: 1203,
    published: true,
  },
  {
    name: 'StartupKit',
    slug: 'startup-kit',
    description:
      'A complete startup landing page with feature highlights, investor decks, and early-access waitlist.',
    category: 'SaaS',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/startup-kit',
    githubUrl: 'https://github.com/example/startup-kit',
    features: ['Landing page', 'Waitlist system', 'Feature sections', 'Pricing', 'Blog', 'Analytics'],
    tags: ['startup', 'saas', 'landing'],
    downloads: 4521,
    published: true,
  },
  {
    name: 'DevPortfolio',
    slug: 'dev-portfolio',
    description:
      'Minimal developer portfolio with code-syntax highlighting, project pins, and GitHub integration.',
    category: 'Portfolio',
    framework: 'Vue.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/dev-portfolio',
    githubUrl: 'https://github.com/example/dev-portfolio',
    features: ['Code highlighting', 'GitHub integration', 'Project pins', 'Blog', 'Dark mode', 'Responsive'],
    tags: ['developer', 'portfolio', 'vue'],
    downloads: 3100,
    published: true,
  },
  {
    name: 'AgencyX',
    slug: 'agency-x',
    description:
      'Full-service agency template with case studies, service catalogues, and a dynamic team grid.',
    category: 'Agency',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/agency-x',
    githubUrl: 'https://github.com/example/agency-x',
    features: ['Case studies', 'Service catalogue', 'Team grid', 'Testimonials', 'Blog', 'Contact form'],
    tags: ['agency', 'creative', 'nextjs'],
    downloads: 2100,
    published: true,
  },
  {
    name: 'ShopNow',
    slug: 'shop-now',
    description:
      'E-commerce template with product grids, cart, checkout flow, and inventory management UI.',
    category: 'E-Commerce',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/shop-now',
    githubUrl: 'https://github.com/example/shop-now',
    features: ['Product grid', 'Shopping cart', 'Checkout flow', 'Wishlist', 'Search', 'Responsive'],
    tags: ['ecommerce', 'shop', 'react'],
    downloads: 5300,
    published: true,
  },
  {
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
    downloads: 1980,
    published: true,
  },
  {
    name: 'AppLaunch',
    slug: 'app-launch',
    description:
      'Product launch landing page with countdown, feature highlights, and app store badges.',
    category: 'Landing',
    framework: 'Nuxt.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/app-launch',
    githubUrl: 'https://github.com/example/app-launch',
    features: ['Countdown timer', 'Feature highlights', 'App store badges', 'Email capture', 'Video hero', 'Analytics'],
    tags: ['app', 'launch', 'landing'],
    downloads: 1640,
    published: true,
  },
  {
    name: 'CreativePro',
    slug: 'creative-pro',
    description:
      'Visual storytelling template for designers, photographers, and studios. Heavy imagery, fullscreen layouts.',
    category: 'Portfolio',
    framework: 'React',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/creative-pro',
    githubUrl: 'https://github.com/example/creative-pro',
    features: ['Fullscreen layouts', 'Image heavy', 'Lightbox gallery', 'Dark mode', 'Smooth scroll', 'Responsive'],
    tags: ['creative', 'design', 'photography'],
    downloads: 2800,
    published: true,
  },
  {
    name: 'TechLand',
    slug: 'tech-land',
    description:
      'Technology landing page with animated hero, feature comparison, and API documentation layout.',
    category: 'Landing',
    framework: 'Vue.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/tech-land',
    githubUrl: 'https://github.com/example/tech-land',
    features: ['Animated hero', 'Feature comparison', 'API docs layout', 'Code samples', 'Blog', 'Contact'],
    tags: ['tech', 'landing', 'vue'],
    downloads: 1450,
    published: true,
  },
  {
    name: 'FundRise',
    slug: 'fund-rise',
    description:
      'Crowdfunding campaign template with progress bars, reward tiers, and social proof sections.',
    category: 'SaaS',
    framework: 'Next.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/fund-rise',
    githubUrl: 'https://github.com/example/fund-rise',
    features: ['Progress bars', 'Reward tiers', 'Social proof', 'Email capture', 'Blog', 'Responsive'],
    tags: ['crowdfunding', 'saas', 'nextjs'],
    downloads: 920,
    published: true,
  },
  {
    name: 'LawOffice',
    slug: 'law-office',
    description:
      'Professional template for law firms with practice area pages, attorney profiles, and case results.',
    category: 'Business',
    framework: 'Gatsby.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/law-office',
    githubUrl: 'https://github.com/example/law-office',
    features: ['Practice areas', 'Attorney profiles', 'Case results', 'Testimonials', 'Blog', 'Contact form'],
    tags: ['law', 'legal', 'business'],
    downloads: 780,
    published: true,
  },
  {
    name: 'FitLife',
    slug: 'fit-life',
    description:
      'Fitness & wellness template with class schedules, trainer profiles, and membership plans.',
    category: 'Business',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/fit-life',
    githubUrl: 'https://github.com/example/fit-life',
    features: ['Class schedules', 'Trainer profiles', 'Membership plans', 'Blog', 'Gallery', 'Contact'],
    tags: ['fitness', 'wellness', 'business'],
    downloads: 1150,
    published: true,
  },
  {
    name: 'PhotoFolio',
    slug: 'photo-folio',
    description:
      'Minimal photography portfolio with masonry galleries, lightbox, and client proofing.',
    category: 'Portfolio',
    framework: 'Vue.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/photo-folio',
    githubUrl: 'https://github.com/example/photo-folio',
    features: ['Masonry gallery', 'Lightbox', 'Client proofing', 'Password protected', 'Dark mode', 'Fast'],
    tags: ['photography', 'portfolio', 'vue'],
    downloads: 1980,
    published: true,
  },
  {
    name: 'StoreFront',
    slug: 'store-front',
    description: 'Modern e-commerce store with product variants, reviews, and one-page checkout.',
    category: 'E-Commerce',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/store-front',
    githubUrl: 'https://github.com/example/store-front',
    features: ['Product variants', 'Reviews', 'One-page checkout', 'Wishlist', 'Search', 'Responsive'],
    tags: ['ecommerce', 'store', 'nextjs'],
    downloads: 4200,
    published: true,
  },
  {
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
    downloads: 640,
    published: true,
  },
  {
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
    downloads: 1340,
    published: true,
  },
  {
    name: 'CourseCraft',
    slug: 'course-craft',
    description:
      'Online course platform template with curriculum builder, quizzes, and student progress tracking.',
    category: 'Education',
    framework: 'Gatsby.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/course-craft',
    githubUrl: 'https://github.com/example/course-craft',
    features: ['Curriculum builder', 'Quizzes', 'Progress tracking', 'Student dashboard', 'Forum', 'Responsive'],
    tags: ['education', 'course', 'gatsby'],
    downloads: 820,
    published: true,
  },
  {
    name: 'EventPro',
    slug: 'event-pro',
    description:
      'Conference and event template with speaker listings, schedule grids, and ticket sales integration.',
    category: 'Landing',
    framework: 'Next.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/event-pro',
    githubUrl: 'https://github.com/example/event-pro',
    features: ['Speaker listings', 'Schedule grid', 'Ticket sales', 'Sponsor showcase', 'Countdown', 'Responsive'],
    tags: ['event', 'conference', 'landing'],
    downloads: 2050,
    published: true,
  },
  {
    name: 'ArtistSpace',
    slug: 'artist-space',
    description:
      'Art gallery template with virtual exhibitions, artist bios, and a print shop integration.',
    category: 'Portfolio',
    framework: 'Vue.js',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/artist-space',
    githubUrl: 'https://github.com/example/artist-space',
    features: ['Virtual exhibitions', 'Artist bios', 'Print shop', 'Gallery', 'Newsletter', 'Responsive'],
    tags: ['art', 'gallery', 'portfolio'],
    downloads: 670,
    published: true,
  },
  {
    name: 'RecruitHub',
    slug: 'recruit-hub',
    description:
      'Job board template with listings, company profiles, and applicant tracking system UI.',
    category: 'SaaS',
    framework: 'Nuxt.js',
    priceTier: 'premium',
    demoUrl: 'https://demo.example.com/recruit-hub',
    githubUrl: 'https://github.com/example/recruit-hub',
    features: ['Job listings', 'Company profiles', 'Applicant tracking', 'Search', 'Filtering', 'Responsive'],
    tags: ['recruiting', 'jobs', 'saas'],
    downloads: 930,
    published: true,
  },
  {
    name: 'HealthPlus',
    slug: 'health-plus',
    description:
      'Healthcare provider template with doctor profiles, appointment booking, and telemedicine integration.',
    category: 'Business',
    framework: 'React',
    priceTier: 'free',
    demoUrl: 'https://demo.example.com/health-plus',
    githubUrl: 'https://github.com/example/health-plus',
    features: ['Doctor profiles', 'Appointment booking', 'Telemedicine', 'Blog', 'Testimonials', 'Responsive'],
    tags: ['healthcare', 'medical', 'business'],
    downloads: 1160,
    published: true,
  },
]

// ---------------------------------------------------------------------------
// Seed logic
// ---------------------------------------------------------------------------

async function seed() {
  // Initialize Firebase Admin — point at emulator
  process.env.FIRESTORE_EMULATOR_HOST = EMULATOR_HOST
  process.env.GCLOUD_PROJECT = PROJECT_ID

  if (getApps().length === 0) {
    initializeApp({
      projectId: PROJECT_ID,
    })
  }

  const db = getFirestore()
  const now = new Date()

  console.log(`🌱 Seeding Firestore emulator at ${EMULATOR_HOST} (project: ${PROJECT_ID})`)
  console.log(`   Templates to create: ${TEMPLATES.length}`)

  // Verify emulator connectivity
  try {
    await db.collection('_health').doc('_check').set({ ok: true }, { merge: true })
    await db.collection('_health').doc('_check').delete()
    console.log('   ✅ Emulator reachable')
  } catch {
    console.error('   ❌ Cannot reach Firestore emulator. Is it running?')
    console.error('      Start it:  firebase emulators:start')
    process.exit(1)
  }

  // Check if data already exists
  const existing = await db.collection('templates').limit(1).get()
  if (!existing.empty) {
    console.log('   ⚠️  Templates collection already has data. Skipping seed.')
    console.log('      Delete the collection in the Emulator UI (http://localhost:4000/firestore) to re-seed.')
    return
  }

  // Seed templates
  const batch = db.batch()
  for (const tpl of TEMPLATES) {
    const ref = db.collection('templates').doc(tpl.slug)
    batch.set(ref, {
      ...tpl,
      mainImage: '',
      previewImages: [],
      downloadUrl: '',
      createdAt: now,
      updatedAt: now,
    })
  }
  await batch.commit()

  console.log(`   ✅ Seeded ${TEMPLATES.length} templates successfully`)
  console.log()
  console.log('📋 Next steps:')
  console.log('   1. Visit http://localhost:4000/firestore to view data')
  console.log('   2. Visit http://localhost:5000 to see the app (with VITE_USE_FIREBASE_EMULATORS=true)')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
