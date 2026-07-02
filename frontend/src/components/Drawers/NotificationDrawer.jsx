"use client";

import React from "react";
import { GlobalDrawer } from "@/components/GlobalDrawer";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationDrawer({ isOpen, onClose }) {
  
  const notifications = [
    { id: 1, type: "success", title: "Booking Confirmed", desc: "Your booking for Excavator has been confirmed.", time: "10m ago" },
    { id: 2, type: "info", title: "New Message", desc: "Driver Amit has sent you a message.", time: "1h ago" },
    { id: 3, type: "warning", title: "Payment Pending", desc: "Please complete your payment for booking #1024.", time: "2h ago" },
  ];

  const getIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <GlobalDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Notifications"
      description="You have 3 unread messages."
      showFooter={true}
      primaryActionLabel="Mark all as read"
      secondaryActionLabel="Close"
    >
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {notifications.map(note => (
          <div key={note.id} className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer">
            <div className="mt-0.5 shrink-0">
              {getIcon(note.type)}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">{note.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{note.desc}</p>
            </div>
            <span className="text-[10px] text-muted-foreground whitespace-nowrap">{note.time}</span>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No new notifications</p>
          </div>
        )}
      </div>
    </GlobalDrawer>
  );
}
