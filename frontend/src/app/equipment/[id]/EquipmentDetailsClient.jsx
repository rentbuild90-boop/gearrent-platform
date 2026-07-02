"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Star, Share2, Heart, Shield, CheckCircle2, ChevronLeft, Calendar } from "lucide-react";
import { GoogleMapCard } from "@/components/GoogleMapCard";

export function EquipmentDetailsClient({ equipment, owner }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [days, setDays] = useState(0);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      toast.success("Added to favorites");
    } else {
      toast.info("Removed from favorites");
    }
  };

  const handleBookNow = () => {
    toast.success("Booking initiated! Redirecting to your bookings...");
    setTimeout(() => {
       router.push("/user/bookings");
    }, 1500);
  };

  const handleContactOwner = () => {
    toast.success("Opening chat with " + owner.name);
    setTimeout(() => {
       router.push("/user/chat");
    }, 1000);
  };

  const simulateDateSelection = () => {
    setDays(3);
    toast.success("Selected 3 days rental period.");
  };

  const serviceFee = days > 0 ? 500 : 0;
  const total = (equipment.pricePerDay * days) + serviceFee;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/equipment">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Link href="/" className="font-bold text-xl text-primary hidden md:block">GearRent</Link>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" onClick={toggleFavorite}>
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 max-w-6xl animate-in fade-in duration-500">
        
        {/* Title and Badges */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary">{equipment.category}</Badge>
            <Badge variant="outline" className={equipment.status === "Available" ? "text-green-500 border-green-500/20 bg-green-500/10" : "text-amber-500 border-amber-500/20 bg-amber-500/10"}>
              {equipment.status}
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{equipment.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{equipment.rating}</span>
              <span>({equipment.reviewsCount} reviews)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {equipment.location}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Image Gallery */}
            <div className="relative h-[300px] md:h-[450px] w-full rounded-2xl overflow-hidden bg-muted border border-border">
              {equipment.image ? (
                <Image 
                  src={equipment.image}
                  alt={equipment.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
              )}
            </div>

            {/* Description & Features Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">About this equipment</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {equipment.description} This machine is perfectly suited for heavy-duty professional tasks. 
                    Maintained directly by the owner with strict adherence to safety and performance standards.
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-5 border border-border">
                  <h4 className="font-semibold flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-primary" />
                    GearRent Protection
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Every booking is covered by our comprehensive damage protection and 24/7 support. 
                    Cancel up to 24 hours before the rental starts for a full refund.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="features" className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {equipment.features?.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Regular Maintenance</span>
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>Safety Certified</span>
                  </li>
                </ul>
              </TabsContent>

              <TabsContent value="location" className="mt-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Equipment Location
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  This equipment is currently located at <strong>{equipment.location || "Guwahati, Assam"}</strong>.
                  Coordinate your pickup or delivery with the owner.
                </p>
                <div className="h-[350px] rounded-xl overflow-hidden border border-border">
                  <GoogleMapCard
                    title=""
                    showCard={false}
                    height="h-[350px]"
                    center={{
                      lat: equipment.latitude ? parseFloat(equipment.latitude) : 26.1445,
                      lng: equipment.longitude ? parseFloat(equipment.longitude) : 91.7362,
                    }}
                    zoom={15}
                    markers={[{
                      lat: equipment.latitude ? parseFloat(equipment.latitude) : 26.1445,
                      lng: equipment.longitude ? parseFloat(equipment.longitude) : 91.7362,
                      label: equipment.name,
                      color: "#0F52BA"
                    }]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="text-4xl font-bold">{equipment.rating}</div>
                  <div>
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className={`h-5 w-5 ${i <= Math.round(parseFloat(equipment.rating)) ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Based on {equipment.reviewsCount} reviews</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {/* Mock Review */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">John Doe</p>
                        <p className="text-xs text-muted-foreground">October 2023</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm">Excellent equipment, ran perfectly for our 3-day project. The owner was very communicative.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column: Booking Widget & Owner Info */}
          <div className="space-y-6">
            
            {/* Booking Card */}
            <Card className="border-border sticky top-24 shadow-lg">
              <CardHeader className="pb-4 border-b border-border">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-3xl font-bold">₹{equipment.pricePerDay}</span>
                    <span className="text-muted-foreground"> / day</span>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    ₹{equipment.pricePerHour} / hr
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                
                {/* Date Picker Mock */}
                <div 
                  className="grid grid-cols-2 gap-2 p-1 border border-border rounded-lg bg-background cursor-pointer hover:border-primary transition-colors"
                  onClick={simulateDateSelection}
                >
                  <div className="p-2 border-r border-border">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Start Date</label>
                    <div className="flex items-center gap-2 mt-1 text-sm font-medium">
                      <Calendar className="h-4 w-4" /> {days > 0 ? "Oct 12, 2023" : "Add dates"}
                    </div>
                  </div>
                  <div className="p-2">
                    <label className="text-xs font-bold uppercase text-muted-foreground">End Date</label>
                    <div className="flex items-center gap-2 mt-1 text-sm font-medium">
                      <Calendar className="h-4 w-4" /> {days > 0 ? "Oct 15, 2023" : "Add dates"}
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="w-full text-lg h-12" disabled={equipment.status !== "Available" || days === 0} onClick={handleBookNow}>
                  {equipment.status === "Available" ? "Book Now" : "Currently Unavailable"}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground">
                  You won't be charged yet.
                </p>

                {/* Price Breakdown Placeholder */}
                <div className={`pt-4 space-y-2 text-sm border-t border-border mt-4 transition-all ${days > 0 ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                  <div className="flex justify-between">
                    <span className="underline decoration-muted-foreground/30 underline-offset-4">₹{equipment.pricePerDay} x {days} days</span>
                    <span>₹{equipment.pricePerDay * days}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="underline decoration-muted-foreground/30 underline-offset-4">Service Fee</span>
                    <span>₹{serviceFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-border mt-2">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            {owner && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-14 w-14 border border-border">
                      <AvatarImage src={owner.photo} />
                      <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{owner.name}</h3>
                      <p className="text-sm text-muted-foreground">{owner.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 mb-4 text-sm">
                    <div>
                      <div className="font-semibold flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {owner.rating}
                      </div>
                      <span className="text-muted-foreground text-xs">Rating</span>
                    </div>
                    <div>
                      <div className="font-semibold">{owner.totalEquipment}</div>
                      <span className="text-muted-foreground text-xs">Machines</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={handleContactOwner}>
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
