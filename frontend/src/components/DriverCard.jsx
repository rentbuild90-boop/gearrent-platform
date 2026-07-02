"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Briefcase, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function DriverCard({ driver }) {
  const statusColor = driver.status === "Available" ? "bg-secondary text-secondary-foreground" : driver.status === "On Job" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";
  
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/10">
                <AvatarImage src={driver.photo} alt={driver.name} />
                <AvatarFallback>{driver.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{driver.name}</h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{driver.rating}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={statusColor}>
              {driver.status}
            </Badge>
          </div>
          
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Experience</span>
              <div className="flex items-center text-sm font-medium">
                <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                {driver.experience}
              </div>
            </div>
            {driver.assignedEquipment && (
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Assigned To</span>
                <div className="flex items-center text-sm font-medium">
                  <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                  {driver.assignedEquipment}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}