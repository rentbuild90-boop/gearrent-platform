"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { AddEquipmentModal } from "@/components/Modals/AddEquipmentModal";
import { GlobalModal } from "@/components/GlobalModal";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function OwnerEquipmentPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState(null);

  // Mock data for the table
  const [equipmentData, setEquipmentData] = useState([
    { id: "EQ-101", name: "JCB 3DX Excavator", category: "Excavator", price: 5000, status: "Active" },
    { id: "EQ-102", name: "Tata Hitachi ZAXIS", category: "Excavator", price: 6500, status: "In Use" },
    { id: "EQ-103", name: "Escorts Hydra Crane", category: "Crane", price: 4000, status: "Maintenance" },
    { id: "EQ-104", name: "Mahindra EarthMaster", category: "Loader", price: 4500, status: "Active" },
    { id: "EQ-105", name: "ACE Forklift", category: "Forklift", price: 2500, status: "Active" },
  ]);

  const handleDelete = () => {
    setEquipmentData(equipmentData.filter(eq => eq.id !== selectedEq.id));
    toast.success(`${selectedEq.name} deleted successfully`);
    setIsDeleteOpen(false);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <Badge variant="default" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 shadow-none border-none">Active</Badge>;
      case 'In Use': return <Badge variant="default" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 shadow-none border-none">In Use</Badge>;
      case 'Maintenance': return <Badge variant="default" className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 shadow-none border-none">Maintenance</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns = [
    { header: "ID", accessorKey: "id" },
    { header: "Equipment Name", accessorKey: "name", cell: (row) => <div className="font-medium">{row.name}</div> },
    { header: "Category", accessorKey: "category" },
    { header: "Price/Day", accessorKey: "price", cell: (row) => `₹${row.price}` },
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
            <DropdownMenuItem onClick={() => { setIsAddOpen(true); toast.info("Edit mode active"); }}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={() => { setSelectedEq(row); setIsDeleteOpen(true); }}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
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
          <h1 className="text-3xl font-bold tracking-tight">Fleet Management</h1>
          <p className="text-muted-foreground mt-1">Manage your equipment, pricing, and availability.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="w-full sm:w-auto shadow-sm">
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>

      <div className="flex-1 min-h-0">
        <DataTable 
          title="Equipment"
          columns={columns} 
          data={equipmentData} 
        />
      </div>

      {/* Modals */}
      <AddEquipmentModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      
      <GlobalModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
        description={`Are you sure you want to delete ${selectedEq?.name}? This action cannot be undone.`}
        primaryActionLabel="Delete"
        secondaryActionLabel="Cancel"
        onPrimaryAction={handleDelete}
      />
    </div>
  );
}
