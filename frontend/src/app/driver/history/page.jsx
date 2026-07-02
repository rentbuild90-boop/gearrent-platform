"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";

export default function DriverHistoryPage() {
  const [historyData] = useState([
    { id: "JOB-8921", date: "28 Jun 2026", equipment: "JCB 3DX", client: "Rajesh Construction", duration: "8 hours", payout: 850, status: "Completed" },
    { id: "JOB-8915", date: "26 Jun 2026", equipment: "Tata Hitachi ZAXIS", client: "L&T Projects", duration: "9.5 hours", payout: 1100, status: "Completed" },
    { id: "JOB-8902", date: "22 Jun 2026", equipment: "Escorts Hydra", client: "MegaBuilders", duration: "12 hours", payout: 1450, status: "Completed" },
    { id: "JOB-8890", date: "20 Jun 2026", equipment: "JCB 3DX", client: "A1 Logistics", duration: "4 hours", payout: 500, status: "Cancelled" },
  ]);

  const columns = [
    { header: "Job ID", accessorKey: "id", cell: (row) => <span className="font-medium text-muted-foreground">{row.id}</span> },
    { header: "Date", accessorKey: "date" },
    { header: "Equipment", accessorKey: "equipment", cell: (row) => <span className="font-medium">{row.equipment}</span> },
    { header: "Client", accessorKey: "client" },
    { header: "Duration", accessorKey: "duration" },
    { header: "Payout", accessorKey: "payout", cell: (row) => <span className="font-bold text-green-600">₹{row.payout}</span> },
    { header: "Status", accessorKey: "status", cell: (row) => (
        <Badge variant="outline" className={row.status === 'Completed' ? 'bg-green-500/10 text-green-600 border-transparent' : 'bg-destructive/10 text-destructive border-transparent'}>
          {row.status}
        </Badge>
      ) 
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job History</h1>
        <p className="text-muted-foreground mt-1">View your past completed jobs and earnings.</p>
      </div>

      <div className="flex-1 min-h-0 mt-6">
        <DataTable 
          title="Past Jobs"
          columns={columns} 
          data={historyData} 
        />
      </div>
    </div>
  );
}
