
import { AppHeader } from '@/components/layout/AppHeader';
import { getEquipmentList } from '@/server/actions/equipment';
import { getTeams } from '@/server/actions/teams';
import { EquipmentActions } from '@/components/equipment/EquipmentActions';
import { Filter } from 'lucide-react';

export default async function EquipmentPage() {
  const [equipmentResult, teamsResult] = await Promise.all([
      getEquipmentList(),
      getTeams()
  ]);

  const equipmentList = equipmentResult.data || [];
  const teams = teamsResult.data || [];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Equipment" />

      <div className="p-6">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
                <EquipmentActions teams={teams} />
                
                <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                </button>
            </div>
            
            <div className="flex gap-2 text-sm text-gray-500">
                <span>1-{equipmentList.length} of {equipmentList.length}</span>
            </div>
        </div>

        {/* Equipment Table (Odoo Style: White Card, Clean Lines) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Serial Number</th>
                        <th className="px-6 py-3">Department</th>
                        <th className="px-6 py-3">Team</th>
                        <th className="px-6 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {equipmentList.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors cursor-pointer text-gray-700">
                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                            <td className="px-6 py-4">{item.serialNumber}</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                    {item.department || '-'}
                                </span>
                            </td>
                            <td className="px-6 py-4">{item.maintenanceTeam?.name || '-'}</td>
                            <td className="px-6 py-4">
                                <StatusBadge status={item.status} />
                            </td>
                        </tr>
                    ))}
                    {equipmentList.length === 0 && (
                        <tr>
                            <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                No equipment found. Create one to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
    const styles = {
        ACTIVE: "bg-green-100 text-green-700",
        UNDER_MAINTENANCE: "bg-amber-100 text-amber-700",
        SCRAPPED: "bg-red-100 text-red-700",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium uppercase ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {status?.replace('_', ' ')}
        </span>
    );
}
