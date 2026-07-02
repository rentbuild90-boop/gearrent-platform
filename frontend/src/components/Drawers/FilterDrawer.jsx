"use client";

import React, { useState } from "react";
import { GlobalDrawer } from "@/components/GlobalDrawer";
import { Input } from "@/components/ui/input";

export function FilterDrawer({ isOpen, onClose }) {
  const [filters, setFilters] = useState({
    status: "",
    dateRange: "",
  });

  const handleApply = () => {
    // apply logic
    onClose();
  };

  return (
    <GlobalDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Advanced Filters"
      description="Refine your list results."
      primaryActionLabel="Apply Filters"
      secondaryActionLabel="Reset"
      onPrimaryAction={handleApply}
      onSecondaryAction={() => setFilters({ status: "", dateRange: "" })}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select 
            className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range (Optional)</label>
          <div className="flex gap-2">
            <Input type="date" className="flex-1" />
            <span className="self-center text-muted-foreground text-sm">to</span>
            <Input type="date" className="flex-1" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sort By</label>
          <div className="flex flex-wrap gap-2">
            {['Newest', 'Oldest', 'Price: High-Low', 'Price: Low-High'].map(sort => (
              <div key={sort} className="border border-border px-3 py-1.5 rounded-full text-xs cursor-pointer hover:bg-muted transition-colors">
                {sort}
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlobalDrawer>
  );
}
