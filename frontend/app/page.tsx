import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import DashboardWrapper from '@/components/dashboard/DashboardWrapper';
import { DEMO_FINDINGS } from '@/lib/demoData';



export default function Dashboard() {
  // Pass demo findings as initial fallback; real findings fetched client-side
  return <DashboardWrapper realFindings={[]} demoFindings={DEMO_FINDINGS} />;
}
