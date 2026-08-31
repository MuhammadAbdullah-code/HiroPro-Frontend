import { FaShieldAlt, FaInfoCircle, FaShareAlt, FaCookie, FaUserCheck, FaLock, FaDatabase, FaGlobe, FaEnvelope } from 'react-icons/fa';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <FaShieldAlt className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-heading)]">
            Privacy Policy
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Last updated: January 1, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-8 text-[var(--color-text-body)]">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaInfoCircle className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">1. Information We Collect</h2>
            </div>
            <p>
              We collect information you provide directly (name, email, phone), information collected automatically 
              (usage data, cookies, IP address), and information from third parties (Google OAuth, payment processors).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaDatabase className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">2. How We Use Your Information</h2>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and improve our services</li>
              <li>To communicate with you about your account and services</li>
              <li>To process payments and prevent fraud</li>
              <li>To send marketing communications (with your consent)</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaShareAlt className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">3. Information Sharing</h2>
            </div>
            <p>
              We do not sell your personal information. We share information with service providers (hosting, analytics), 
              when legally required, or with your consent (e.g., sharing your contact info with businesses you request 
              quotes from).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaCookie className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">4. Cookies and Tracking</h2>
            </div>
            <p>
              We use cookies for authentication, preferences, and analytics. You can control cookies through your 
              browser settings. See our Cookie Policy for details.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaUserCheck className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">5. Your Rights</h2>
            </div>
            <p>
              You have the right to access, correct, delete, or export your personal data. You can opt out of 
              marketing communications at any time. Contact privacy@hirepro.com to exercise these rights.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaLock className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">6. Data Security</h2>
            </div>
            <p>
              We use industry-standard security measures including encryption, secure servers, and access controls. 
              However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaDatabase className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">7. Data Retention</h2>
            </div>
            <p>
              We retain your data as long as your account is active or as needed to provide services. You can request 
              deletion at any time, subject to legal retention requirements.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaUserCheck className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">8. Children's Privacy</h2>
            </div>
            <p>
              Our services are not directed to children under 13. We do not knowingly collect data from children.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaGlobe className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">9. International Users</h2>
            </div>
            <p>
              If you access HirePro from outside the United States, your data may be transferred to and processed 
              in the US or other countries.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">10. Contact</h2>
            </div>
            <p>
              For privacy questions, contact privacy@hirepro.com
            </p>
          </section>

          <div className="border-t border-[var(--color-border)] pt-8 mt-12">
            <p className="text-sm text-[var(--color-text-muted)]">
              Note: This is a template. Before launching, have this policy reviewed by a qualified attorney and 
              ensure GDPR/CCPA compliance if applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
