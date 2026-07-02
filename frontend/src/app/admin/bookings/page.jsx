"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import bookingsData from "@/mock/bookings.json";

export default function ManageBookingsPage() {
  const columns = [
    { 
      header: "Booking ID", 
      accessorKey: "id",
      cell: (row) => <span className="text-xs font-mono font-medium">{row.id}</span>
    },
    { 
      header: "Equipment", 
      accessorKey: "equipmentName",
      cell: (row) => (
        <div>
          <div className="font-medium">{row.equipmentName}</div>
          <div className="text-xs text-muted-foreground">{row.location}</div>
        </div>
      )
    },
    { 
      header: "Dates", 
      accessorKey: "startDate",
      cell: (row) => (
        <span className="text-sm">
          {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
        </span>
      )
    },
    { 
      header: "Total", 
      accessorKey: "totalPrice",
      cell: (row) => <span className="font-medium">₹{row.totalPrice.toLocaleString()}</span>
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row) => {
        let variant = "outline";
        if (row.status === "Confirmed") variant = "success";
        if (row.status === "In Progress") variant = "secondary";
        if (row.status === "Completed") variant = "default";
        if (row.status === "Cancelled") variant = "destructive";
        
        return (
          <Badge variant={variant === "success" ? "outline" : variant} className={variant === "success" ? "text-green-600 border-green-600" : ""}>
            {row.status}
          </Badge>
        );
      }
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Bookings</h1>
          <p className="text-muted-foreground mt-1">Review all active and historical bookings.</p>
        </div>
      </div>

      <div className="flex-1 mt-6">
        <DataTable 
          data={bookingsData} 
          columns={columns} 
          searchKey="equipmentName" 
          searchPlaceholder="Search by equipment name..."
        />
      </div>
    </div>
  );
}
