"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function OwnerCard({ owner }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={owner.photo} alt={owner.name} />
              <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{owner.name}</h3>
              <p className="text-sm text-muted-foreground font-medium">{owner.company}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md mb-2">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{owner.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Location</span>
              <div className="flex items-center text-sm font-medium">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                {owner.location}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Inventory</span>
              <div className="flex items-center text-sm font-medium">
                <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                {owner.totalEquipment} Equipments
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}