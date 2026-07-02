"use client";

import React, { useState } from "react";
import { GlobalModal } from "@/components/GlobalModal";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export function AssignDriverModal({ isOpen, onClose, bookingId }) {
  const [loading, setLoading] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Mock list of available drivers
  const drivers = [
    { id: "d1", name: "Ravi Kumar", rating: 4.8, distance: "2 km away", avatar: "/placeholder-user.jpg" },
    { id: "d2", name: "Amit Singh", rating: 4.5, distance: "5 km away", avatar: "/placeholder-user.jpg" },
    { id: "d3", name: "Vikram Sharma", rating: 4.9, distance: "8 km away", avatar: "/placeholder-user.jpg" },
  ];

  const handleAssign = () => {
    if (!selectedDriver) {
      toast.error("Please select a driver first");
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Driver successfully assigned to booking ${bookingId}`);
      onClose();
    }, 1000);
  };

  return (
    <GlobalModal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Driver"
      description={`Select an available driver to assign to booking ${bookingId}.`}
      primaryActionLabel={loading ? "Assigning..." : "Confirm Assignment"}
      onPrimaryAction={handleAssign}
    >
      <div className="space-y-3">
        {drivers.map(driver => (
          <div 
            key={driver.id}
            onClick={() => setSelectedDriver(driver.id)}
            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
              selectedDriver === driver.id 
                ? 'border-primary bg-primary/5 shadow-sm' 
                : 'border-border hover:border-primary/50 bg-card'
            }`}
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={driver.avatar} />
                <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm">{driver.name}</h4>
                <p className="text-xs text-muted-foreground">⭐ {driver.rating} • {driver.distance}</p>
              </div>
            </div>
            
            {selectedDriver === driver.id && (
              <CheckCircle2 className="h-5 w-5 text-primary" />
            )}
          </div>
        ))}
      </div>
    </GlobalModal>
  );
}
