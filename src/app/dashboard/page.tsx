import { redirect } from 'next/navigation';

export default function DashboardRootPage() {
  // Redirect to the main portfolio page by default
  redirect('/dashboard/portfolio');
}
