"use client";

import React, { useState } from "react";
import { GlobalModal } from "@/components/GlobalModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

export function AddEquipmentModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    // Mock save delay
    setTimeout(() => {
      setLoading(false);
      toast.success("Equipment added successfully!");
      onClose();
    }, 1000);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Equipment"
      description="Enter the details of the new machinery you want to list. Pricing will be determined automatically by the platform."
      primaryActionLabel={loading ? "Saving..." : "Add Equipment"}
      onPrimaryAction={handleSave}
      maxWidth="sm:max-w-[600px]"
    >
      <form className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
        <div className="space-y-4">
          <h4 className="text-sm font-semibold border-b pb-1">Basic Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Equipment Name <span className="text-destructive">*</span></label>
              <Input placeholder="e.g. Caterpillar 320" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
              <select className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option>Excavator</option>
                <option>Crane</option>
                <option>Loader</option>
                <option>Forklift</option>
                <option>Bulldozer</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Brand / Make <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              <Input placeholder="e.g. Caterpillar, JCB" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Model Year <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              <Input type="number" placeholder="e.g. 2022" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-semibold border-b pb-1">Registration & Specs</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Registration Number <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              <Input placeholder="e.g. MH 12 AB 1234" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity / Tonnage <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              <Input placeholder="e.g. 20 Tons" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Chassis / Serial Number <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
              <Input placeholder="Enter chassis number" />
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium">Operating Location <span className="text-destructive">*</span></label>
          <Input placeholder="City, State (e.g. Mumbai, Maharashtra)" />
        </div>

        <div className="space-y-2 pt-2">
          <label className="text-sm font-medium">Vehicle Images <span className="text-muted-foreground text-xs font-normal">(Optional)</span></label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors">
            <Upload className="h-6 w-6 mb-2" />
            <span className="text-sm text-center">Click to upload or drag and drop<br/>(RC Book, Insurance, Vehicle Photos)</span>
          </div>
        </div>
      </form>
    </GlobalModal>
  );
}
