import { EquipmentCard } from "@/components/EquipmentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import equipmentData from "@/mock/equipment.json";
import Link from "next/link";

export default function EquipmentListingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="container mx-auto flex gap-3 items-center">
          <Link href="/" className="font-bold text-xl text-primary hidden md:block mr-4">GearRent</Link>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search equipment..." className="pl-9 bg-muted/50" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-6 flex gap-6">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6 animate-in slide-in-from-left-8 duration-500">
          <div>
            <h3 className="font-semibold mb-3">Categories</h3>
            <div className="space-y-2">
              {["Excavator", "Bulldozer", "Crane", "Loader", "Dump Truck"].map(c => (
                <label key={c} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                  {c}
                </label>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Price Range (per day)</h3>
            <div className="space-y-4">
              <input type="range" className="w-full" />
              <div className="flex items-center gap-2">
                <Input type="number" placeholder="Min" className="h-8 text-sm" />
                <span>-</span>
                <Input type="number" placeholder="Max" className="h-8 text-sm" />
              </div>
            </div>
          </div>
        </aside>

        {/* Equipment Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Available Equipment</h1>
            <span className="text-sm text-muted-foreground">{equipmentData.length} results found</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {equipmentData.map(eq => (
              <Link href={`/equipment/${eq.id}`} key={eq.id}>
                <EquipmentCard equipment={eq} />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
