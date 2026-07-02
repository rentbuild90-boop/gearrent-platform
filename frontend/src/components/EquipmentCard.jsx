"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Heart } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function EquipmentCard({ equipment }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border bg-card">
        <div className="relative h-48 w-full bg-muted">
          {equipment.image && (
            <Image
              src={equipment.image}
              alt={equipment.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          <button className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-muted-foreground hover:text-red-500 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-3 flex gap-2">
            <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
              {equipment.category}
            </Badge>
            <Badge variant="default" className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
              {equipment.status}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg line-clamp-1">{equipment.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {equipment.location}
              </div>
            </div>
            <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{equipment.rating}</span>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <div>
              <span className="text-xl font-bold text-primary">₹{equipment.pricePerHour}</span>
              <span className="text-sm text-muted-foreground"> / hour</span>
            </div>
            <div className="text-sm text-muted-foreground">
              ₹{equipment.pricePerDay} / day
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
