import { FaCookie, FaShieldAlt, FaCog, FaChartLine, FaBullhorn, FaGlobe, FaEnvelope, FaClock } from 'react-icons/fa';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <FaCookie className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-heading)]">
            Cookie Policy
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Last updated: January 1, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-8 text-[var(--color-text-body)]">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaCookie className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">What Are Cookies?</h2>
            </div>
            <p>
              Cookies are small text files stored on your device when you visit our website. They help us provide 
              a better user experience by remembering your preferences and understanding how you use our platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">Types of Cookies We Use</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Essential Cookies</h3>
                <p>
                  Required for the platform to function. These enable core features like authentication, security, 
                  and session management. You cannot opt out of these cookies.
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Authentication tokens</li>
                  <li>Security tokens</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Preference Cookies</h3>
                <p>
                  Remember your settings and preferences to provide a personalized experience.
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Theme preferences (light/dark mode)</li>
                  <li>Language settings</li>
                  <li>Location preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Analytics Cookies</h3>
                <p>
                  Help us understand how visitors use the platform so we can improve it.
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Google Analytics</li>
                  <li>Page views and navigation patterns</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-[var(--color-text-heading)] mb-2">Marketing Cookies</h3>
                <p>
                  Used to deliver relevant advertisements and track campaign effectiveness.
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Google Ads</li>
                  <li>Facebook Pixel</li>
                  <li>Retargeting campaigns</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaGlobe className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">Third-Party Cookies</h2>
            </div>
            <p>
              We use services from third parties that may set their own cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li><strong>Google Analytics:</strong> Website traffic and behavior analysis</li>
              <li><strong>Google OAuth:</strong> Social login functionality</li>
              <li><strong>Payment Processors:</strong> Secure payment processing</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaCog className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">Managing Cookies</h2>
            </div>
            <p>
              You can control cookies through your browser settings. Note that blocking certain cookies may affect 
              your experience on HirePro.
            </p>
            
            <div className="mt-4 space-y-2">
              <p><strong>Browser Controls:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and Website Data</li>
                <li><strong>Edge:</strong> Settings → Cookies and Site Permissions</li>
              </ul>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">Cookie Duration</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period (typically 30-365 days)</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaCog className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">Updates to This Policy</h2>
            </div>
            <p>
              We may update this Cookie Policy periodically. Check this page for the latest information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-4">Contact</h2>
            <p>
              Questions about our use of cookies? Contact us at privacy@hirepro.com
            </p>
          </section>

          <div className="border-t border-[var(--color-border)] pt-8 mt-12">
            <p className="text-sm text-[var(--color-text-muted)]">
              Note: This is a template. Ensure compliance with GDPR (EU), CCPA (California), and other applicable 
              privacy laws. Consider implementing a cookie consent banner for EU visitors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
