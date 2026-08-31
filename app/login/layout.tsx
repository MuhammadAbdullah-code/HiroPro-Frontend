import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Log In - HirePro',
  description: 'Log in to your HirePro account to manage your requests and bookings.',
  robots: {
    index: false,
    follow: false
  }
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
