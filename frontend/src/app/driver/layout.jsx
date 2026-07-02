
import { Sidebar } from "@/components/Layout/Sidebar";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Navbar } from "@/components/Layout/Navbar";

export default function DriverLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar role="driver" />
      </div>
      <div className="flex-1 flex flex-col md:ml-64 mb-16 md:mb-0">
        <Navbar role="driver" />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
          {children}
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav role="driver" />
      </div>
    </div>
  );
}
