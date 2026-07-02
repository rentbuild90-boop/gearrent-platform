"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import equipmentData from "@/mock/equipment.json";

export default function ManageEquipmentPage() {
  const columns = [
    { 
      header: "Equipment", 
      accessorKey: "name", 
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded overflow-hidden shrink-0">
            <img src={row.image} alt={row.name} className="h-full w-full object-cover" />
          </div>
          <div className="font-medium">{row.name}</div>
        </div>
      )
    },
    { header: "Category", accessorKey: "category" },
    { header: "Location", accessorKey: "location" },
    { 
      header: "Owner ID", 
      accessorKey: "ownerId",
      cell: (row) => <span className="text-xs text-muted-foreground font-mono">{row.ownerId}</span>
    },
    { 
      header: "Status", 
      accessorKey: "status",
      cell: (row) => {
        let variant = "default";
        if (row.status === "Available") variant = "success";
        if (row.status === "Maintenance") variant = "destructive";
        if (row.status === "In Use") variant = "secondary";
        
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
          <h1 className="text-3xl font-bold tracking-tight">Manage Equipment</h1>
          <p className="text-muted-foreground mt-1">Review all equipment listings across the platform.</p>
        </div>
      </div>

      <div className="flex-1 mt-6">
        <DataTable 
          data={equipmentData} 
          columns={columns} 
          searchKey="name" 
          searchPlaceholder="Search equipment..."
        />
      </div>
    </div>
  );
}
