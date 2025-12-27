
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Wrench, Users, Settings, Briefcase, LogOut, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/server/actions/auth';
import { useEffect, useState } from 'react';
import { getSession } from '@/server/actions/auth';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Equipment', href: '/equipment', icon: Wrench },
  { name: 'Maintenance', href: '/maintenance', icon: Briefcase },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Teams', href: '/teams', icon: Users, role: ['MANAGER'] }, // Only Manager sees Teams
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getSession().then(setUser);
  }, []);

  async function handleLogout() {
    await logout();
    router.push('/login');
    router.refresh();
  }

  // Filter nav items based on user role
  const filteredNav = NAV_ITEMS.filter(item => {
    if (!item.role) return true;
    return user && item.role.includes(user.role);
  });

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
        {filteredNav.map((item) => {
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
        <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user?.email?.substring(0, 2) || '??'}
                </div>
                <div className="text-sm">
                    <p className="font-medium text-gray-900 truncate w-24" title={user?.email}>
                        {user?.name || user?.email || 'Loading...'}
                    </p>
                    <p className="text-gray-500 text-xs font-semibold">{user?.role || '...'}</p>
                </div>
            </div>
            <button 
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition"
                title="Logout"
            >
                <LogOut className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
}
