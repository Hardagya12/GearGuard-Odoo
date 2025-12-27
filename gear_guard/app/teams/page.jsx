
import { AppHeader } from '@/components/layout/AppHeader';
import { getTeams } from '@/server/actions/teams';
import { Users, Wrench } from 'lucide-react';

export default async function TeamsPage() {
  const { data: teams } = await getTeams();

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Maintenance Teams" />

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams?.map((team) => (
            <div 
              key={team.id} 
              className="bg-white rounded-lg border-2 border-gray-200 hover:border-brand transition-all hover:shadow-lg p-6 cursor-pointer group"
            >
              {/* Team Header with Purple Accent */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-white shadow-md">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand transition-colors">
                      {team.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-brand" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Members</span>
                  </div>
                  <p className="text-2xl font-bold text-brand">
                    {team._count?.members || 0}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase">Equipment</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {team._count?.maintainedEquipment || 0}
                  </p>
                </div>
              </div>

              {/* View Details Link */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="text-sm font-medium text-brand hover:text-brand-dark transition-colors">
                  View Details →
                </button>
              </div>
            </div>
          ))}

          {(!teams || teams.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No teams found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
