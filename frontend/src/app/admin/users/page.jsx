"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ownersData from "@/mock/owners.json";
import driversData from "@/mock/drivers.json";

export default function ManageUsersPage() {
  const [activeTab, setActiveTab] = useState("owners");

  const ownerColumns = [
    { header: "Name", accessorKey: "name", cell: (row) => <div className="font-medium">{row.name}</div> },
    { header: "Company", accessorKey: "company" },
    { header: "Location", accessorKey: "location" },
    { header: "Equipment", accessorKey: "totalEquipment" },
    { 
      header: "Rating", 
      accessorKey: "rating",
      cell: (row) => <Badge variant="outline" className="bg-primary/5">⭐ {row.rating}</Badge>
    },
  ];

  const driverColumns = [
    { header: "Name", accessorKey: "name", cell: (row) => <div className="font-medium">{row.name}</div> },
    { header: "Vehicle Class", accessorKey: "vehicleClass" },
    { header: "Location", accessorKey: "location" },
    { header: "Completed Jobs", accessorKey: "completedJobs" },
    { 
      header: "Rating", 
      accessorKey: "rating",
      cell: (row) => <Badge variant="outline" className="bg-primary/5">⭐ {row.rating}</Badge>
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
          <p className="text-muted-foreground mt-1">Review and manage platform owners and drivers.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="owners">Owners</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="owners" className="flex-1 mt-0">
          <DataTable 
            data={ownersData} 
            columns={ownerColumns} 
            searchKey="name" 
            searchPlaceholder="Search owners by name..."
          />
        </TabsContent>
        
        <TabsContent value="drivers" className="flex-1 mt-0">
          <DataTable 
            data={driversData} 
            columns={driverColumns} 
            searchKey="name" 
            searchPlaceholder="Search drivers by name..."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
