import { Helmet } from 'react-helmet-async'

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Privacy Policy — Free Templates</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Last updated: July 29, 2026</p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            1. Information We Collect
          </h2>
          <p className="mt-2">
            We collect information you provide when creating an account: name, email address, and
            profile photo (if using Google OAuth). We also collect usage data such as templates
            viewed and downloaded.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            2. How We Use Your Information
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>To provide and maintain the Service</li>
            <li>To process subscription payments (via Stripe)</li>
            <li>To send service-related communications</li>
            <li>To improve and personalize the Service</li>
            <li>To detect and prevent abuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            3. Payment Processing
          </h2>
          <p className="mt-2">
            We use Stripe for payment processing. Stripe collects and processes your payment
            information according to their own privacy policy. We do not store credit card numbers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Data Storage</h2>
          <p className="mt-2">
            Your data is stored securely using Firebase (Google Cloud Platform). We implement
            industry-standard security measures to protect your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            5. Third-Party Services
          </h2>
          <p className="mt-2">
            We use the following third-party services: Firebase (authentication, database, storage),
            Stripe (payment processing), and Google Analytics (anonymous usage tracking). Each has
            its own privacy policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
          <p className="mt-2">
            You may access, update, or delete your account information at any time through your
            account settings. You may request data export or account deletion by contacting us.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Cookies</h2>
          <p className="mt-2">
            We use essential cookies for authentication and session management. Analytics cookies
            are used only with your consent. You can manage cookie preferences in your browser
            settings.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact</h2>
          <p className="mt-2">
            For privacy-related inquiries, contact us at{' '}
            <a
              href="mailto:privacy@free-templates.cc"
              className="text-primary-600 hover:text-primary-500"
            >
              privacy@free-templates.cc
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  )
}
