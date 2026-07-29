import { Link } from 'react-router-dom'

const footerLinks = [
  {
    title: 'Templates',
    links: [
      { label: 'All Templates', href: '/templates' },
      { label: 'Next.js', href: '/templates?framework=Next.js' },
      { label: 'Gatsby.js', href: '/templates?framework=Gatsby.js' },
      { label: 'Nuxt.js', href: '/templates?framework=Nuxt.js' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Free<span className="text-primary-600">Templates</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              1,000+ free website templates for modern web frameworks.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{group.title}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-sm text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} Free-Templates.cc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
