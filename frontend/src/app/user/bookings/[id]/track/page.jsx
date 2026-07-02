"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation2, Package, CheckCircle, Truck, Phone, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchWithCSRF } from "@/lib/api";
import { loadBestMap, createLeafletMap } from "@/lib/mapLoader";

const PICKUP  = { lat: 26.1445, lng: 91.7362, label: "Pickup",  color: "#16a34a" };
const DROPOFF = { lat: 26.1550, lng: 91.7500, label: "Site",    color: "#dc2626" };
const DRIVER  = { lat: 26.149,  lng: 91.742,  label: "Driver",  color: "#0F52BA" };

const STEPS = [
  { id: "confirmed",  label: "Booking Confirmed",   icon: CheckCircle, done: true  },
  { id: "dispatched", label: "Equipment Dispatched", icon: Package,     done: true  },
  { id: "en_route",   label: "Driver En Route",      icon: Truck,       done: true  },
  { id: "delivered",  label: "Delivered",            icon: MapPin,      done: false },
];

export default function TrackBookingPage() {
  const params    = useParams();
  const bookingId = params?.id;
  const mapRef    = useRef(null);
  const mapInst   = useRef(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!bookingId) return;
    fetchWithCSRF(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((d) => { if (d?.data) setBooking(d.data); })
      .catch(() => {});
  }, [bookingId]);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    loadBestMap(apiKey).then((engine) => {
      if (!mapRef.current) return;

      if (engine === "leaflet" && window.L) {
        mapInst.current = createLeafletMap(mapRef.current, {
          center: { lat: 26.148, lng: 91.742 },
          zoom: 14,
          markers: [PICKUP, DROPOFF, DRIVER],
          routePoints: [PICKUP, DRIVER, DROPOFF],
        });
        return;
      }

      if (engine === "google" && window.google?.maps) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: 26.148, lng: 91.742 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: "poi",    elementType: "labels",        stylers: [{ visibility: "off" }] },
            { featureType: "transit",                               stylers: [{ visibility: "off" }] },
            { featureType: "water",  elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
          ],
        });
        mapInst.current = map;

        new window.google.maps.Polyline({
          path: [PICKUP, DRIVER, DROPOFF].map((p) => ({ lat: p.lat, lng: p.lng })),
          geodesic: true, strokeColor: "#0F52BA", strokeOpacity: 0.8, strokeWeight: 4, map,
        });

        [PICKUP, DROPOFF, DRIVER].forEach((pt) => {
          new window.google.maps.Marker({
            position: { lat: pt.lat, lng: pt.lng }, map, title: pt.label,
            label: { text: pt.label, color: "#ffffff", fontWeight: "bold", fontSize: "10px" },
            icon: {
              path: "M -18,-28 L 18,-28 A 8,8 0 0,1 26,-20 L 26,-20 A 8,8 0 0,1 18,-12 L 5,-12 L 0,0 L -5,-12 L -18,-12 A 8,8 0 0,1 -26,-20 L -26,-20 A 8,8 0 0,1 -18,-28 z",
              fillColor: pt.color, fillOpacity: 0.95, strokeColor: "#ffffff",
              strokeWeight: 1.5, scale: 1,
              labelOrigin: new window.google.maps.Point(0, -20),
            },
          });
        });
      }
    });

    return () => {
      if (mapInst.current?.remove) { mapInst.current.remove(); mapInst.current = null; }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-2 pt-2">
        <Button variant="ghost" size="sm" asChild className="gap-1 text-muted-foreground hover:text-foreground">
          <Link href="/user/bookings"><ChevronLeft className="h-4 w-4" /> Back to Bookings</Link>
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold tracking-tight">
          Live Tracking
          {booking && (
            <span className="ml-3 text-base font-normal text-muted-foreground">
              #{booking.booking_code || `BKG-${bookingId}`}
            </span>
          )}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {booking?.equipment_name || "Equipment"} · Real-time route map
        </p>
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl overflow-hidden border border-border shadow-lg relative"
        style={{ height: "360px" }}
      >
        <div ref={mapRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute top-3 left-3 z-[500] flex items-center gap-2 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full shadow text-xs font-semibold border border-border">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          Live Tracking
        </div>
      </motion.div>

      {/* Route info */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-2 rounded-full mt-0.5">
              <MapPin className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-0.5">Pickup</p>
              <p className="text-sm font-medium">{booking?.pickup_location || "Guwahati, Assam"}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-2 rounded-full mt-0.5">
              <Navigation2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wide mb-0.5">Dropoff</p>
              <p className="text-sm font-medium">{booking?.dropoff_location || "Site, Guwahati"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Timeline */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border bg-muted/30">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Truck className="h-4 w-4 text-primary" /> Delivery Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div key={step.id} className="relative flex items-start gap-4 pl-10">
                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10
                      ${step.done ? "bg-primary border-primary text-primary-foreground" : "bg-background border-border text-muted-foreground"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="pt-1">
                      <p className={`font-medium text-sm ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                      </p>
                      {step.done && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {idx === 0 ? "Confirmed" : idx === 1 ? "10 mins ago" : "En route · ~5 km away"}
                        </p>
                      )}
                    </div>
                    {idx === 2 && step.done && (
                      <Badge className="ml-auto text-xs bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20">
                        In Transit
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Driver card */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">R</div>
            <div>
              <p className="font-semibold">Rajan Kumar</p>
              <p className="text-sm text-muted-foreground">Driver · ★ 4.9 · 243 trips</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-full gap-2">
            <Phone className="h-4 w-4" /> Call
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
