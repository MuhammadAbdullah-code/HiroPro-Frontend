import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign Up - HirePro',
  description: 'Create your HirePro account to connect with trusted local businesses.',
  robots: {
    index: false,
    follow: false
  }
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
