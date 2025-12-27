
import { AppHeader } from '@/components/layout/AppHeader';
import { MaintenanceCalendar } from '@/components/maintenance/MaintenanceCalendar';
import { getRequests } from '@/server/actions/requests';

export default async function CalendarPage() {
  // Fetch all Corrective and Preventive requests that have a scheduled date
  const { data: requests } = await getRequests();
  
  // Filter for only requests with scheduledDate
  const scheduledRequests = requests?.filter(r => r.scheduledDate) || [];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Preventive Schedule" />

      <div className="p-6 h-full">
        <MaintenanceCalendar requests={scheduledRequests} />
      </div>
    </div>
  );
}
