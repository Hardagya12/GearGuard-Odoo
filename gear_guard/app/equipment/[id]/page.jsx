
import { AppHeader } from '@/components/layout/AppHeader';
import { getEquipmentById } from '@/server/actions/equipment';
import { Wrench, Calendar, MapPin, Users, AlertCircle } from 'lucide-react';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function EquipmentDetailPage({ params }) {
  const { id } = params;
  const result = await getEquipmentById(id);

  if (!result.success) {
    notFound();
  }

  const equipment = result.data;
  const openRequests = equipment.requests?.filter(r => r.stage !== 'REPAIRED' && r.stage !== 'SCRAP') || [];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Equipment Details" />

      <div className="p-6 space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{equipment.name}</h1>
              <p className="text-gray-500">SN: {equipment.serialNumber}</p>
            </div>
            <StatusBadge status={equipment.status} />
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <DetailItem icon={MapPin} label="Location" value={equipment.location || 'Not set'} />
            <DetailItem icon={Users} label="Department" value={equipment.department || 'Not set'} />
            <DetailItem icon={Wrench} label="Team" value={equipment.maintenanceTeam?.name || 'Not assigned'} />
            <DetailItem icon={Calendar} label="Purchase Date" value={equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : 'N/A'} />
          </div>
        </div>

        {/* Smart Button - Maintenance Requests */}
        <div className="bg-white rounded-lg border-2 border-purple-200 overflow-hidden">
          <div className="bg-gradient-to-r from-brand to-brand-dark px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-lg">Maintenance Requests</h3>
            </div>
            <span className="bg-white text-brand font-bold px-3 py-1 rounded-full text-sm">
              {openRequests.length}
            </span>
          </div>

          <div className="p-6">
            {equipment.requests && equipment.requests.length > 0 ? (
              <div className="space-y-3">
                {equipment.requests.map(request => (
                  <Link 
                    key={request.id}
                    href={`/maintenance`}
                    className="block p-4 border border-gray-200 rounded-lg hover:border-brand hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.subject}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <RequestTypeBadge type={request.type} />
                        <RequestStageBadge stage={request.stage} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No maintenance requests yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-brand mt-0.5" />
      <div>
        <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    ACTIVE: "bg-green-100 text-green-700 border-green-200",
    UNDER_MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-200",
    SCRAPPED: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 ${styles[status] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function RequestTypeBadge({ type }) {
  const color = type === 'CORRECTIVE' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700';
  return <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>{type}</span>;
}

function RequestStageBadge({ stage }) {
  const colors = {
    NEW: 'bg-purple-100 text-purple-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    REPAIRED: 'bg-green-100 text-green-700',
    SCRAP: 'bg-gray-100 text-gray-700',
  };
  return <span className={`px-2 py-1 rounded text-xs font-medium ${colors[stage] || colors.NEW}`}>{stage.replace('_', ' ')}</span>;
}
