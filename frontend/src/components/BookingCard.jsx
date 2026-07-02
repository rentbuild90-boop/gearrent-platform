"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Truck } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BookingCard({ booking }) {
  const router = useRouter();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-secondary text-secondary-foreground border-transparent';
      case 'Pending': return 'bg-accent text-accent-foreground border-transparent';
      case 'In Progress': return 'bg-primary text-primary-foreground border-transparent';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground border-transparent';
      case 'Completed': return 'bg-muted text-muted-foreground border-transparent';
      default: return 'bg-muted text-muted-foreground border-transparent';
    }
  };

  const handleTrack = () => {
    toast.info(`Tracking delivery for ${booking.equipmentName}...`);
  };

  const handleViewDetails = () => {
    toast.success(`Opening details for Booking ${booking.id}`);
  };

  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{booking.equipmentName}</h3>
            <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
          </div>
          <Badge className={`${getStatusColor(booking.status)} uppercase tracking-wider text-xs px-2.5 py-1`}>
            {booking.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{booking.startDate} - {booking.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-primary" suppressHydrationWarning>₹{booking.totalPrice.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end border-t border-border pt-4">
          <Button variant="outline" size="sm" onClick={handleViewDetails}>View Details</Button>
          {(booking.status === 'Confirmed' || booking.status === 'In Progress') && (
            <Button size="sm" onClick={handleTrack}>Track</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}