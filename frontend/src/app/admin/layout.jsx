import { AdminSidebar } from "@/components/AdminSidebar";
import { Search, Bell } from "lucide-react";

export default function AdminLayout({ children }) {
  return (
    <div className="bg-background text-on-background min-h-screen flex">
      {/* Navigation Drawer Component */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="md:ml-[280px] flex-1 flex flex-col min-h-screen">
        {/* Top App Bar */}
        <header className="sticky top-0 w-full z-40 border-b border-slate-100 dark:border-slate-800 shadow-sm bg-surface-container-lowest flex justify-between items-center h-16 px-8 max-w-full">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-on-background">Platform Overview</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full p-2 transition-all focus:ring-2 focus:ring-indigo-500/20">
              <Search className="w-5 h-5" />
            </button>
            <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full p-2 transition-all focus:ring-2 focus:ring-indigo-500/20 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Canvas */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
