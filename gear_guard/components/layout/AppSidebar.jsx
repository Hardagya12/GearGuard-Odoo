
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Wrench, Users, Settings, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Maintenance', href: '/maintenance', icon: Briefcase },
  { name: 'Teams', href: '/teams', icon: Users },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white h-screen border-r border-gray-200 flex flex-col fixed left-0 top-0 z-10">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="flex items-center gap-2 text-brand font-bold text-xl">
           <Wrench className="w-6 h-6" />
           <span>GearGuard</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-brand text-white shadow-md shadow-brand/20" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-brand"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-white text-xs font-bold">
                JD
            </div>
            <div className="text-sm">
                <p className="font-medium text-gray-900">John Doe</p>
                <p className="text-gray-500 text-xs">Manager</p>
            </div>
        </div>
      </div>
    </div>
  );
}
