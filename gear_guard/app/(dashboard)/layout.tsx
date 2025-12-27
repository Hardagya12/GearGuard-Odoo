
import { AppSidebar } from "@/components/layout/AppSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen transition-all duration-300">
         {/* Main content area */}
         {children}
      </div>
    </div>
  );
}
