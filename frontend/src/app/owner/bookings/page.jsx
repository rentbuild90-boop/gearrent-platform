"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, FileText, CheckCircle, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function OwnerBookingsPage() {
  const [bookingsData] = useState([
    { id: "BKG-101", equipment: "JCB 3DX", client: "Rajesh Construction", date: "30 Jun - 05 Jul", amount: 25000, status: "Ongoing" },
    { id: "BKG-102", equipment: "Tata Crane", client: "L&T Projects", date: "28 Jun - 29 Jun", amount: 12000, status: "Completed" },
    { id: "BKG-103", equipment: "Escorts Hydra", client: "MegaBuilders", date: "02 Jul - 10 Jul", amount: 45000, status: "Upcoming" },
    { id: "BKG-104", equipment: "ACE Forklift", client: "A1 Logistics", date: "25 Jun - 26 Jun", amount: 5000, status: "Cancelled" },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ongoing': return <Badge variant="default" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 shadow-none border-none">Ongoing</Badge>;
      case 'Upcoming': return <Badge variant="default" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 shadow-none border-none">Upcoming</Badge>;
      case 'Completed': return <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-none">Completed</Badge>;
      case 'Cancelled': return <Badge variant="default" className="bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border-none">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    { header: "Booking ID", accessorKey: "id", cell: (row) => <span className="font-medium">{row.id}</span> },
    { header: "Equipment", accessorKey: "equipment" },
    { header: "Client", accessorKey: "client" },
    { header: "Dates", accessorKey: "date" },
    { header: "Amount", accessorKey: "amount", cell: (row) => `₹${row.amount.toLocaleString()}` },
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
            <DropdownMenuItem onClick={() => toast.info("Opening invoice...")}>
              <FileText className="mr-2 h-4 w-4" /> View Invoice
            </DropdownMenuItem>
            {row.status === 'Upcoming' && (
              <>
                <DropdownMenuItem className="text-green-600 focus:text-green-600 focus:bg-green-500/10" onClick={() => toast.success("Booking confirmed!")}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Confirm
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => toast.error("Booking cancelled.")}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground mt-1">Track and manage your equipment rentals.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable 
          title="All Bookings"
          columns={columns} 
          data={bookingsData} 
        />
      </div>
    </div>
  );
}
