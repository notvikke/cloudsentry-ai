import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { getRealTimeFindings } from '@/lib/dynamo';
import { DEMO_FINDINGS } from '@/lib/demoData';

export const revalidate = 0; // Disable cache for real-time

export default async function Dashboard() {
  // Fetch real data on server
  const realFindings = await getRealTimeFindings();

  // Pass both datasets to client component which will decide which to show
  return <DashboardWrapper realFindings={realFindings} demoFindings={DEMO_FINDINGS} />;
}
