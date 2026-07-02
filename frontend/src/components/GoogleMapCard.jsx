"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation2 } from "lucide-react";
import { loadBestMap, createLeafletMap } from "@/lib/mapLoader";

/**
 * GoogleMapCard — renders a real interactive map.
 * Tries Google Maps first; automatically falls back to
 * Leaflet + OpenStreetMap if the key is missing/invalid.
 *
 * Props:
 *   title       string   — card header title (default "Live Location")
 *   height      string   — Tailwind height class (default "h-64")
 *   center      {lat,lng}
 *   zoom        number
 *   markers     Array<{lat,lng,label,color?}>
 *   routePoints Array<{lat,lng}> — draws a polyline through these
 *   showCard    boolean  — wrap in Card UI (default true)
 */
export function GoogleMapCard({
  title = "Live Location",
  height = "h-64",
  center = { lat: 26.1445, lng: 91.7362 },
  zoom = 13,
  markers = [],
  routePoints = [],
  showCard = true,
}) {
  const containerRef   = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef     = useRef([]);
  const engineRef      = useRef(null); // "google" | "leaflet"
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

    loadBestMap(apiKey).then((result) => {
      engineRef.current = result;
      setEngine(result);
    });
  }, []);

  // Initialise / refresh map whenever engine or data changes
  useEffect(() => {
    if (!engine || !containerRef.current) return;

    // ── Leaflet ──────────────────────────────────────────────────────
    if (engine === "leaflet") {
      // Destroy previous Leaflet instance if any
      if (mapInstanceRef.current && mapInstanceRef.current.remove) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      mapInstanceRef.current = createLeafletMap(containerRef.current, {
        center,
        zoom,
        markers,
        routePoints,
      });
      return;
    }

    // ── Google Maps ──────────────────────────────────────────────────
    if (engine === "google" && window.google?.maps) {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new window.google.maps.Map(containerRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: true,
          styles: [
            { featureType: "poi",     elementType: "labels",            stylers: [{ visibility: "off" }] },
            { featureType: "road",    elementType: "labels.icon",       stylers: [{ visibility: "off" }] },
            { featureType: "transit",                                    stylers: [{ visibility: "off" }] },
            { featureType: "water",   elementType: "geometry.fill",     stylers: [{ color: "#b9d3c2" }] },
          ],
        });
      } else {
        mapInstanceRef.current.setCenter(center);
        mapInstanceRef.current.setZoom(zoom);
      }

      const map = mapInstanceRef.current;

      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];

      // Draw route polyline
      if (routePoints.length > 1) {
        new window.google.maps.Polyline({
          path: routePoints.map((p) => ({ lat: p.lat, lng: p.lng })),
          geodesic: true,
          strokeColor: "#0F52BA",
          strokeOpacity: 0.8,
          strokeWeight: 4,
          map,
        });
      }

      // Add markers
      markers.forEach((point) => {
        if (point.lat == null || point.lng == null) return;
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(point.lat), lng: parseFloat(point.lng) },
          map,
          title: point.label || "",
          label: point.label
            ? { text: point.label, color: "#ffffff", fontWeight: "bold", fontSize: "11px" }
            : undefined,
          icon: {
            path: "M -20,-30 L 20,-30 A 8,8 0 0,1 28,-22 L 28,-22 A 8,8 0 0,1 20,-14 L 6,-14 L 0,0 L -6,-14 L -20,-14 A 8,8 0 0,1 -28,-22 L -28,-22 A 8,8 0 0,1 -20,-30 z",
            fillColor: point.color || "#0F52BA",
            fillOpacity: 0.95,
            strokeColor: "#ffffff",
            strokeWeight: 1.5,
            scale: 1,
            labelOrigin: new window.google.maps.Point(0, -22),
          },
        });
        markersRef.current.push(marker);
      });
    }
  }, [engine, center.lat, center.lng, zoom, markers, routePoints]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current?.remove) mapInstanceRef.current.remove();
    };
  }, []);

  const mapDiv = (
    <div
      ref={containerRef}
      className={`w-full ${height}`}
      style={{ minHeight: "160px", background: "#e5e3df" }}
    />
  );

  if (!showCard) {
    return (
      <div className={`w-full ${height} relative`} style={{ minHeight: "160px" }}>
        <div ref={containerRef} className="absolute inset-0 w-full h-full" style={{ background: "#e5e3df" }} />
      </div>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden flex flex-col h-full">
      {title && (
        <CardHeader className="bg-muted/30 border-b border-border py-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Navigation2 className="h-4 w-4 text-primary" /> {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0 flex-1 relative" style={{ minHeight: "160px" }}>
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: "#e5e3df" }}
        />
      </CardContent>
    </Card>
  );
}
