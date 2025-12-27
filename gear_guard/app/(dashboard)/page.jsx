
import Link from 'next/link';
import { getDashboardStats } from '@/server/actions/requests';
import { TeamWorkloadChart, RequestTypeChart } from '@/components/dashboard/DashboardCharts';
import { Wrench, Users, Briefcase } from 'lucide-react';

export default async function Home() {
  const { data: stats } = await getDashboardStats();
  const teamStats = stats?.teamStats || [];
  const typeStats = stats?.typeStats || [];

  return (
    <main className="p-8 space-y-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
           <p className="text-gray-500">Overview of your maintenance operations</p>
        </div>
        <div className="flex gap-3">
             <Link href="/maintenance" className="bg-brand text-white px-4 py-2 rounded-lg shadow-sm hover:bg-brand-dark transition font-medium">
                Manage Requests
             </Link>
        </div>
      </div>

      {/* Quick Links / Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/equipment" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition">
                  <Wrench className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Equipment</h2>
          </div>
          <p className="text-sm text-gray-500">Track assets, ownership, and technical details.</p>
        </Link>
        
        <Link href="/teams" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group">
          <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition">
                  <Users className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Teams</h2>
          </div>
          <p className="text-sm text-gray-500">Manage specialized maintenance teams.</p>
        </Link>
        
        <Link href="/maintenance" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition group">
            <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg group-hover:bg-amber-100 transition">
                    <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Requests</h2>
            </div>
          <p className="text-sm text-gray-500">Handle corrective and preventive maintenance jobs.</p>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Team Workload */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Active Requests by Team</h3>
              {teamStats.length > 0 ? (
                  <TeamWorkloadChart data={teamStats} />
              ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">
                      No active requests
                  </div>
              )}
          </div>

          {/* Request Types */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Request Composition</h3>
              {typeStats.length > 0 ? (
                  <RequestTypeChart data={typeStats} />
              ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm italic">
                      No data available
                  </div>
              )}
          </div>
      </div>
    </main>
  );
}
