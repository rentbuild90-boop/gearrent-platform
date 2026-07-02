"use client";

import React from "react";
import { DataTable } from "@/components/DataTable";
import citiesData from "@/mock/cities.json";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ManageCitiesPage() {
  const columns = [
    { header: "ID", accessorKey: "id", cell: (row) => <span className="font-mono text-xs">{row.id}</span> },
    { header: "Name", accessorKey: "name", cell: (row) => <span className="font-bold">{row.name}</span> },
    { header: "State", accessorKey: "state" },
    { header: "Country", accessorKey: "country" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Cities</h1>
          <p className="text-muted-foreground mt-1">Review and manage supported platform locations.</p>
        </div>
        <Button className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add City
        </Button>
      </div>

      <div className="flex-1 mt-6">
        <DataTable 
          data={citiesData} 
          columns={columns} 
          searchKey="name" 
          searchPlaceholder="Search cities..."
        />
      </div>
    </div>
  );
}
