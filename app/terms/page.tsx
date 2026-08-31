import { FaShieldAlt, FaUserShield, FaFileContract, FaExclamationTriangle, FaCreditCard, FaStar, FaBan, FaEnvelope } from 'react-icons/fa';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <FaFileContract className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[var(--color-text-heading)]">
            Terms & Conditions
          </h1>
        </div>
        <p className="text-sm text-[var(--color-text-muted)] mb-8">
          Last updated: January 1, 2025
        </p>

        <div className="prose prose-lg max-w-none space-y-8 text-[var(--color-text-body)]">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">1. Acceptance of Terms</h2>
            </div>
            <p>
              By accessing or using HirePro ("the Platform"), you agree to be bound by these Terms & Conditions. 
              If you do not agree to these terms, please do not use the Platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaUserShield className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">2. Description of Service</h2>
            </div>
            <p>
              HirePro is a directory and marketplace platform connecting customers with local service providers. 
              We do not provide the services listed on the Platform — we facilitate connections between customers 
              and independent service providers.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaUserShield className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">3. User Accounts</h2>
            </div>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and for all activities 
              that occur under your account. You must notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaFileContract className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">4. Business Listings</h2>
            </div>
            <p>
              Businesses must provide accurate information about their services, licensing, and insurance. False or 
              misleading information may result in immediate removal from the Platform and possible legal action.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaStar className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">5. Reviews and Ratings</h2>
            </div>
            <p>
              Reviews must be honest, accurate, and based on genuine experiences. We prohibit fake reviews, review 
              manipulation, or offering incentives for positive reviews. Violators will be banned from the Platform.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaCreditCard className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">6. Payment Terms</h2>
            </div>
            <p>
              Business subscriptions are billed monthly. All fees are non-refundable. Customers do not pay HirePro 
              for services — payment happens directly between customer and service provider.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaBan className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">7. Limitation of Liability</h2>
            </div>
            <p>
              HirePro is not liable for the quality, safety, or legality of services provided by businesses listed 
              on the Platform. We do not guarantee results and are not party to agreements between customers and 
              service providers.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">8. Termination</h2>
            </div>
            <p>
              We reserve the right to terminate accounts that violate these terms, engage in fraudulent activity, 
              or harm the Platform or its users.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaFileContract className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">9. Changes to Terms</h2>
            </div>
            <p>
              We may update these terms at any time. Continued use of the Platform after changes constitutes 
              acceptance of the new terms.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <FaEnvelope className="w-5 h-5 text-[var(--color-secondary)]" />
              <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mb-0">10. Contact</h2>
            </div>
            <p>
              For questions about these terms, contact us at legal@hirepro.com
            </p>
          </section>

          <div className="border-t border-[var(--color-border)] pt-8 mt-12">
            <p className="text-sm text-[var(--color-text-muted)]">
              Note: This is a template. Before launching, have these terms reviewed by a qualified attorney 
              licensed in your jurisdiction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
