
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
      <h1 className="text-4xl font-bold">GearGuard</h1>
      <p className="text-xl">The Ultimate Maintenance Tracker</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/equipment" className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
          <h2 className="text-2xl font-semibold mb-2">Equipment &rarr;</h2>
          <p>Track assets, ownership, and technical details.</p>
        </Link>

        <Link href="/teams" className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
          <h2 className="text-2xl font-semibold mb-2">Teams &rarr;</h2>
          <p>Manage specialized maintenance teams.</p>
        </Link>

        <Link href="/maintenance" className="p-6 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition">
          <h2 className="text-2xl font-semibold mb-2">Requests &rarr;</h2>
          <p>Handle corrective and preventive maintenance jobs.</p>
        </Link>
      </div>
    </main>
  );
}
