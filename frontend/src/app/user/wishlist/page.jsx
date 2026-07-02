"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Star, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { fetchWithCSRF } from "@/lib/api";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await fetchWithCSRF("/api/user/wishlist");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setWishlist(json.data);
        }
      }
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, id) => {
    e.preventDefault();
    try {
      const res = await fetchWithCSRF(`/api/user/wishlist/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWishlist(wishlist.filter(item => item.id !== id));
        toast.success("Removed from Saved Items");
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 md:pb-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Saved Items</h1>
        <p className="text-muted-foreground">Keep track of the equipment you're interested in renting.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-sm">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-1">No saved items</h3>
          <p className="text-muted-foreground mb-6">Start exploring to add equipment to your wishlist.</p>
          <Button asChild>
            <Link href="/user/nearby">Explore Equipment</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {wishlist.map((eq) => (
              <motion.div
                key={eq.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/equipment/${eq.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all group border-border/50 bg-card h-full flex flex-col relative">
                    <div className="absolute top-3 right-3 z-10">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="bg-background/80 backdrop-blur hover:bg-destructive hover:text-destructive-foreground rounded-full h-8 w-8 text-red-500 shadow-sm"
                        onClick={(e) => handleRemove(e, eq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      {eq.image ? (
                        <Image 
                          src={eq.image}
                          alt={eq.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>
                      )}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg line-clamp-1 pr-2">{eq.name}</h3>
                          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
                            <Star className="h-3 w-3 fill-current" />
                            {eq.rating}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
                          <MapPin className="h-3.5 w-3.5" /> {eq.location || "City " + eq.city_id}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto border-t border-border pt-4">
                        <div className="font-bold text-lg text-primary">
                          ₹{eq.price_per_day || eq.pricePerDay}<span className="text-xs font-normal text-muted-foreground">/day</span>
                        </div>
                        <Button size="sm" variant="secondary" className="px-4">View</Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
