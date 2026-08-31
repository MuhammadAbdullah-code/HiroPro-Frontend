import { redirect } from 'next/navigation';

export default function MisspelledCustomerDashboardPage() {
  redirect('/customer/dashboard');
}
