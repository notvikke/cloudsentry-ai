import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { getRealTimeFindings } from '@/lib/dynamo';
import { DEMO_FINDINGS } from '@/lib/demoData';

export const revalidate = 0; // Disable cache for real-time

export default function Dashboard() {
  // Pass demo findings as initial fallback; real findings fetched client-side
  return <DashboardWrapper realFindings={[]} demoFindings={DEMO_FINDINGS} />;
}
