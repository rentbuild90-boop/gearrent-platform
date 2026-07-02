
import { Sidebar } from "@/components/Layout/Sidebar";
import { BottomNav } from "@/components/Layout/BottomNav";
import { Navbar } from "@/components/Layout/Navbar";

export default function OwnerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar role="owner" />
      </div>
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 mb-16 md:mb-0">
        <Navbar role="owner" />
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/20">
          {children}
        </main>
      </div>
      <div className="md:hidden">
        <BottomNav role="owner" />
      </div>
    </div>
  );
}
