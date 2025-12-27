
import { AppHeader } from '@/components/layout/AppHeader';
import { getRequests } from '@/server/actions/requests';
import { KanbanBoard } from '@/components/maintenance/KanbanBoard';
import { Plus } from 'lucide-react';

export default async function MaintenancePage() {
  const { data: requests } = await getRequests();

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Maintenance Requests" />

      <div className="p-6">
        {/* Action Bar with Odoo Purple */}
        <div className="flex justify-between items-center mb-6">
            <button className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-dark transition flex items-center gap-2 shadow-md shadow-brand/20">
                <Plus className="w-4 h-4" />
                New Request
            </button>
            
            <div className="flex gap-2 text-sm text-gray-500">
                <span>{requests?.length || 0} Requests</span>
            </div>
        </div>

        {/* Kanban Board */}
        <KanbanBoard initialRequests={requests || []} />
      </div>
    </div>
  );
}
