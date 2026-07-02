"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Navigation2, MapPin, Clock, CreditCard, ShieldAlert, Phone, User } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import { toast } from "sonner";

export default function DriverDashboardPage() {
  const [isOnline, setIsOnline] = useState(true);

  const toggleStatus = (checked) => {
    setIsOnline(checked);
    if (checked) {
      toast.success("You are now online and visible for jobs.");
    } else {
      toast.info("You are now offline.");
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header & Status Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className={`h-16 w-16 border-4 ${isOnline ? 'border-green-500' : 'border-slate-300'}`}>
              <AvatarImage src="/placeholder-user.jpg" alt="Driver" />
              <AvatarFallback className="bg-muted">
                <User className="h-8 w-8 text-muted-foreground" />
              </AvatarFallback>
            </Avatar>
            <div className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-card ${isOnline ? 'bg-green-500' : 'bg-slate-400'}`}></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Hi, Ravi Kumar</h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              ⭐ 4.8 Rating • 142 Trips
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-xl">
          <span className={`text-sm font-semibold ${isOnline ? 'text-green-600' : 'text-muted-foreground'}`}>
            {isOnline ? 'ONLINE' : 'OFFLINE'}
          </span>
          <Switch 
            checked={isOnline} 
            onCheckedChange={toggleStatus}
            className={isOnline ? 'bg-green-500' : ''}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings Card */}
        <Card className="shadow-sm border-border bg-gradient-to-br from-primary/10 via-background to-background">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4 text-primary" /> Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight mt-2">₹1,450</div>
            <p className="text-sm text-muted-foreground mt-2">
              Across 2 completed jobs today
            </p>
          </CardContent>
        </Card>

        {/* Hours Online Card */}
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-blue-500" /> Hours Online
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight mt-2">4h 12m</div>
            <p className="text-sm text-muted-foreground mt-2">
              Since 8:00 AM
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Job Tracker (only show if online for demo) */}
      {isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-primary/50 shadow-md shadow-primary/5 overflow-hidden">
            <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
              <div>
                <span className="bg-white/20 text-xs px-2 py-1 rounded font-medium uppercase tracking-wider mb-1 inline-block">Active Job</span>
                <h3 className="font-bold text-lg">JCB 3DX Excavator</h3>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Estimated Payout</p>
                <p className="font-bold text-xl">₹850</p>
              </div>
            </div>
            
            <div className="p-0">
              <div className="h-[200px] relative">
                <GoogleMapCard
                  title=""
                  showCard={false}
                  height="h-[200px]"
                  center={{ lat: 26.1445, lng: 91.7362 }}
                  zoom={14}
                  markers={[
                    { lat: 26.1445, lng: 91.7362, label: "You", color: "#16a34a" },
                    { lat: 26.1550, lng: 91.7500, label: "Site B", color: "#0F52BA" }
                  ]}
                />
                <div className="absolute inset-0 pointer-events-none border-t border-b border-border/50"></div>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent hidden md:block">
                {/* Timeline visually replacing standard list on desktop, simplified for both here */}
              </div>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1 bg-primary/20 p-1.5 rounded-full h-fit">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Pickup</p>
                    <p className="font-medium">Equipment Depot, Andheri East</p>
                    <p className="text-sm text-muted-foreground">Contact: Manager (+91 98765 43210)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1 bg-destructive/20 p-1.5 rounded-full h-fit">
                    <MapPin className="h-4 w-4 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Dropoff / Site</p>
                    <p className="font-medium">Metro Construction Site, Bandra Kurla Complex</p>
                    <p className="text-sm text-muted-foreground">Expected by: 1:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <Button className="w-full text-md h-12" onClick={() => toast.info("Opening navigation...")}>
                  <Navigation2 className="mr-2 h-5 w-5" /> Navigate
                </Button>
                <Button variant="outline" className="w-full text-md h-12 border-primary text-primary hover:bg-primary/5" onClick={() => toast.success("Job started!")}>
                  Start Job
                </Button>
              </div>
              <div className="mt-3 flex gap-2">
                 <Button variant="ghost" className="flex-1 text-muted-foreground">
                   <Phone className="mr-2 h-4 w-4" /> Call Client
                 </Button>
                 <Button variant="ghost" className="flex-1 text-destructive">
                   <ShieldAlert className="mr-2 h-4 w-4" /> SOS Issue
                 </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Recommended Jobs / Upcoming if offline */}
      {!isOnline && (
        <Card className="shadow-sm border-border bg-muted/30">
          <CardContent className="p-8 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-2">You are currently offline</h3>
            <p className="text-muted-foreground mb-6">Go online to receive new job assignments and start earning.</p>
            <Button onClick={() => toggleStatus(true)} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Go Online Now
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
