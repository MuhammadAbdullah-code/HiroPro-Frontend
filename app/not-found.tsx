import Link from 'next/link';
import { FaHome, FaSearch } from 'react-icons/fa';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-white)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-[var(--color-primary)] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-[var(--color-text-heading)] mb-4">
          Page Not Found
        </h2>
        <p className="text-[var(--color-text-body)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-[var(--color-secondary)] text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            <FaHome />
            Go Home
          </Link>
          <Link
            href="/businesses"
            className="flex items-center gap-2 px-6 py-3 border-2 border-[var(--color-border)] text-[var(--color-text-heading)] rounded-lg hover:bg-[var(--color-bg-light)] transition-colors"
          >
            <FaSearch />
            Browse Businesses
          </Link>
        </div>
      </div>
    </div>
  );
}
