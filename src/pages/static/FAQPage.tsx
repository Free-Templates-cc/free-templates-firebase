import { Link } from 'react-router-dom'
import { SEOHead } from '../../components/seo/SEOHead'
import { ChevronDown } from 'lucide-react'
import { useState, type ReactNode } from 'react'

interface FAQ {
  q: string
  a: ReactNode
}

const faqs: FAQ[] = [
  {
    q: 'What is Free Templates?',
    a: 'Free Templates is a marketplace for high-quality website templates built with Next.js, Gatsby, Nuxt, and other modern frameworks. We offer both free and premium templates.',
  },
  {
    q: 'Are the templates really free?',
    a: 'Yes! We offer a selection of free templates that you can download without any account or payment. Premium templates require an active subscription.',
  },
  {
    q: 'What does the Premium subscription include?',
    a: 'Premium members get unlimited access to all premium templates, priority support, and early access to new template releases. Plans start at €12/month or €96/year.',
  },
  {
    q: 'Can I use templates for commercial projects?',
    a: 'Yes. Both free and premium templates can be used for personal and commercial projects. You may not redistribute or resell the templates themselves.',
  },
  {
    q: 'How do I sign up?',
    a: 'Click the "Sign Up" button in the top right corner. You can register with your email address or sign in with Google.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime from your account settings. Your access continues until the end of the current billing period.',
  },
  {
    q: 'How are payments processed?',
    a: 'All payments are processed securely through Stripe. We do not store your payment information on our servers.',
  },
  {
    q: 'I found a bug. How do I report it?',
    a: (
      <>
        Please visit our{' '}
        <Link to="/contact" className="text-primary-600 hover:underline">
          Contact page
        </Link>{' '}
        or email us at{' '}
        <a href="mailto:support@free-templates.cc" className="text-primary-600 hover:underline">
          support@free-templates.cc
        </a>
        .
      </>
    ),
  },
]

export function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SEOHead title="FAQ — Free Templates" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Everything you need to know about Free Templates.
      </p>

      <div className="mt-8 divide-y divide-gray-200 dark:divide-gray-800">
        {faqs.map((faq, i) => (
          <div key={i} className="py-4">
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 text-left"
              aria-expanded={openIndex === i}
              aria-controls={`faq-panel-${i}`}
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white">{faq.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                  openIndex === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div
                id={`faq-panel-${i}`}
                className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400"
              >
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
