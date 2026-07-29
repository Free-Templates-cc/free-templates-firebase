import { Helmet } from 'react-helmet-async'

export function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Helmet><title>Terms of Service — Free Templates</title></Helmet>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: July 29, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Acceptance of Terms</h2>
          <p className="mt-2">By accessing or using Free Templates ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. Description of Service</h2>
          <p className="mt-2">Free Templates provides a marketplace for downloadable website templates. Templates are offered under a free tier (basic templates) and a premium tier (subscription-based access to premium templates).</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. User Accounts</h2>
          <p className="mt-2">You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating an account. You may not use another person's account without permission.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Subscriptions & Payments</h2>
          <p className="mt-2">Premium membership is billed on a monthly or annual basis. Payments are processed securely through Stripe. You may cancel at any time; cancellation takes effect at the end of the current billing period. No refunds are provided for partial billing periods.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. License & Usage</h2>
          <p className="mt-2">Free templates may be used for both personal and commercial projects. Premium templates may be used for unlimited personal and commercial projects while your subscription is active. You may not redistribute, resell, or sub-license templates.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Limitation of Liability</h2>
          <p className="mt-2">The Service is provided "as is" without warranties of any kind. We are not liable for damages arising from the use or inability to use templates downloaded from the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Changes to Terms</h2>
          <p className="mt-2">We reserve the right to modify these terms at any time. Users will be notified of material changes via email or through the Service.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact</h2>
          <p className="mt-2">For questions about these terms, contact us at <a href="mailto:support@free-templates.cc" className="text-primary-600 hover:text-primary-500">support@free-templates.cc</a>.</p>
        </section>
      </div>
    </div>
  )
}
