"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, ShieldCheck, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AssignDriverModal } from "@/components/Modals/AssignDriverModal";
import { toast } from "sonner";

export default function OwnerDriversPage() {
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [driversData] = useState([
    { id: "D-101", name: "Ravi Kumar", rating: 4.8, status: "Active", trips: 142 },
    { id: "D-102", name: "Amit Singh", rating: 4.5, status: "On Trip", trips: 89 },
    { id: "D-103", name: "Vikram Sharma", rating: 4.9, status: "Offline", trips: 230 },
    { id: "D-104", name: "Suresh Menon", rating: 4.2, status: "Active", trips: 45 },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-none">Active</Badge>;
      case 'On Trip': return <Badge variant="default" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 shadow-none border-none">On Trip</Badge>;
      case 'Offline': return <Badge variant="default" className="bg-slate-500/10 text-slate-600 hover:bg-slate-500/20 shadow-none border-none">Offline</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    { 
      header: "Driver", 
      accessorKey: "name", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{row.name}</div>
        </div>
      )
    },
    { header: "Rating", accessorKey: "rating", cell: (row) => `⭐ ${row.rating}` },
    { header: "Total Trips", accessorKey: "trips" },
    { header: "Status", accessorKey: "status", cell: (row) => getStatusBadge(row.status) },
    { 
      header: "Actions", 
      accessorKey: "actions", 
      sortable: false,
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-muted hover:text-accent-foreground h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => { setSelectedDriver(row); setIsAssignOpen(true); }}>
              <ShieldCheck className="mr-2 h-4 w-4" /> Assign to Job
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Calling driver...")}>
              <Phone className="mr-2 h-4 w-4" /> Call
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Opening message thread...")}>
              <Mail className="mr-2 h-4 w-4" /> Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage your certified drivers and operator assignments.</p>
        </div>
        <Button onClick={() => toast.info("Invite Driver flow triggered")} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Invite Driver
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable 
          title="Drivers"
          columns={columns} 
          data={driversData} 
        />
      </div>

      <AssignDriverModal 
        isOpen={isAssignOpen} 
        onClose={() => setIsAssignOpen(false)} 
        bookingId="New Job" 
      />
    </div>
  );
}
