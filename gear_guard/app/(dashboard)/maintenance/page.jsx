
import { AppHeader } from '@/components/layout/AppHeader';
import { getRequests } from '@/server/actions/requests';
import { getEquipmentList } from '@/server/actions/equipment';
import { getTeams } from '@/server/actions/teams';
import { KanbanBoard } from '@/components/maintenance/KanbanBoard';
import { CreateRequestButton } from '@/components/maintenance/CreateRequestButton';

export default async function MaintenancePage({ searchParams }) {
  const filters = {
    equipmentId: searchParams?.equipmentId,
  };

  const [requestsResult, equipmentResult, teamsResult] = await Promise.all([
    getRequests(filters),
    getEquipmentList(),
    getTeams(),
  ]);

  const requests = requestsResult.data || [];
  const equipment = equipmentResult.data || [];
  const teams = teamsResult.data || [];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Maintenance Requests" />

      <div className="p-6">
        {/* Action Bar with Odoo Purple */}
        <div className="flex justify-between items-center mb-6">
            <CreateRequestButton equipment={equipment} teams={teams} />
            
            <div className="flex gap-2 text-sm text-gray-500">
                <span>{requests.length} Requests</span>
            </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard initialRequests={requests} />
      </div>
    </div>
  );
}
