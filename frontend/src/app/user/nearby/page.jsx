"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, Star, Navigation2, X, ChevronRight, List, Map, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { fetchWithCSRF } from "@/lib/api";
import { loadBestMap, createLeafletMap } from "@/lib/mapLoader";
import equipmentMock from "@/mock/equipment.json";

const CATEGORIES = ["All", "Excavator", "Crane", "Loader", "Bulldozer", "Drill", "Compactor"];

const SORT_OPTIONS = [
  { label: "Nearest",    value: "nearest"  },
  { label: "Price ↑",   value: "price_asc" },
  { label: "Price ↓",   value: "price_desc"},
  { label: "Top Rated", value: "rating"    },
];

export default function NearbyPage() {
  const [selectedEq,   setSelectedEq]   = useState(null);
  const [searchQuery,  setSearchQuery]   = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,       setSortBy]        = useState("nearest");
  const [viewMode,     setViewMode]      = useState("map"); // "map" | "list"
  const [equipmentList, setEquipmentList] = useState([]);
  const [engine,       setEngine]        = useState(null);

  const mapRef        = useRef(null);
  const googleMapRef  = useRef(null);
  const leafletMapRef = useRef(null);
  const gMarkersRef   = useRef([]);
  const lMarkersRef   = useRef([]);
  const engineRef     = useRef(null);
  // Track last filter state for smarter marker refresh
  const lastFilterRef = useRef("");

  // ── Fetch equipment ──────────────────────────────────────────────
  useEffect(() => {
    async function fetchEquipment() {
      try {
        const res  = await fetchWithCSRF("/api/equipment");
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.data?.length > 0) setEquipmentList(data.data);
        else setEquipmentList(equipmentMock);
      } catch {
        setEquipmentList(equipmentMock);
      }
    }
    fetchEquipment();
  }, []);

  // ── Computed display list ────────────────────────────────────────
  const mapped = equipmentList.map((eq, idx) => ({
    id:          eq.id,
    name:        eq.name,
    brand:       eq.brand || "",
    rating:      parseFloat(eq.rating) || 4.8,
    reviewCount: eq.review_count || eq.reviewsCount || 0,
    location:    "Guwahati, Assam",
    pricePerDay: eq.price_per_day || eq.pricePerDay || 15000,
    status:      eq.status || "AVAILABLE",
    lat: eq.latitude  ? parseFloat(eq.latitude)  : 26.1445 + (idx * 0.007) - 0.003,
    lng: eq.longitude ? parseFloat(eq.longitude) : 91.7362 + (idx * 0.011) - 0.005,
    distance: (1.2 + idx * 0.8).toFixed(1),
  }));

  const filtered = mapped
    .filter((eq) => {
      const matchSearch   = eq.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === "All" || eq.name.toLowerCase().includes(activeCategory.toLowerCase());
      return matchSearch && matchCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price_desc") return b.pricePerDay - a.pricePerDay;
      if (sortBy === "rating")     return b.rating - a.rating;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  // ── Load map engine ──────────────────────────────────────────────
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
    loadBestMap(apiKey).then((result) => {
      engineRef.current = result;
      setEngine(result);
    });
  }, []);

  // ── Sync markers whenever filter changes ─────────────────────────
  useEffect(() => {
    if (!engine || !mapRef.current || viewMode !== "map") return;

    const filterKey = filtered.map((e) => e.id).join(",");
    if (filterKey === lastFilterRef.current) return;
    lastFilterRef.current = filterKey;

    const center = { lat: 26.1445, lng: 91.7362 };

    const onMarkerClick = (eq) => {
      setSelectedEq(eq);
      if (engineRef.current === "google" && googleMapRef.current) googleMapRef.current.panTo({ lat: eq.lat, lng: eq.lng });
      if (engineRef.current === "leaflet" && leafletMapRef.current) leafletMapRef.current.panTo([eq.lat, eq.lng]);
    };

    // ── Leaflet ──────────────────────────────────────────────────
    if (engine === "leaflet" && window.L) {
      lMarkersRef.current.forEach((m) => leafletMapRef.current?.removeLayer(m));
      lMarkersRef.current = [];

      if (!leafletMapRef.current) {
        delete window.L.Icon.Default.prototype._getIconUrl;
        window.L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
        leafletMapRef.current = window.L.map(mapRef.current, { center: [center.lat, center.lng], zoom: 13, zoomControl: false });
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19,
        }).addTo(leafletMapRef.current);
        window.L.control.zoom({ position: "topright" }).addTo(leafletMapRef.current);
      }

      filtered.forEach((eq) => {
        const isSelected = selectedEq?.id === eq.id;
        const color = isSelected ? "#7c3aed" : "#18181b"; // Dark for better visibility
        const icon = window.L.divIcon({
          className: "",
          html: `<div style="background:${color};color:#fff;font-size:14px;font-weight:800;padding:6px 12px;border-radius:24px;white-space:nowrap;width:max-content;box-shadow:0 4px 12px rgba(0,0,0,0.4);border:2px solid rgba(255,255,255,0.95);cursor:pointer;position:relative;transform:translateX(-50%);">
            ₹${parseInt(eq.pricePerDay).toLocaleString()}
            <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:9px solid ${color};"></div>
          </div>`,
          iconAnchor: [0, 42],
        });
        const m = window.L.marker([eq.lat, eq.lng], { icon }).addTo(leafletMapRef.current).on("click", () => onMarkerClick(eq));
        lMarkersRef.current.push(m);
      });
      return;
    }

    // ── Google Maps ──────────────────────────────────────────────
    if (engine === "google" && window.google?.maps) {
      if (!googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center, zoom: 13, disableDefaultUI: true, zoomControl: false,
          styles: [
            { featureType: "poi",    elementType: "labels",        stylers: [{ visibility: "off" }] },
            { featureType: "transit",                               stylers: [{ visibility: "off" }] },
            { featureType: "water",  elementType: "geometry.fill", stylers: [{ color: "#b9d3c2" }] },
          ],
        });
      }
      const map = googleMapRef.current;
      gMarkersRef.current.forEach((m) => m.setMap(null));
      gMarkersRef.current = [];

      filtered.forEach((eq) => {
        const isSelected = selectedEq?.id === eq.id;
        const color = isSelected ? "#7c3aed" : "#18181b"; // Dark for better visibility
        const marker = new window.google.maps.Marker({
          position: { lat: eq.lat, lng: eq.lng }, map, title: eq.name,
          label: { text: `₹${parseInt(eq.pricePerDay).toLocaleString()}`, color: "#ffffff", fontWeight: "bold", fontSize: "14px" },
          icon: {
            path: "M -32,-43 L 32,-43 A 14,14 0 0,1 46,-29 L 46,-29 A 14,14 0 0,1 32,-15 L 10,-15 L 0,0 L -10,-15 L -32,-15 A 14,14 0 0,1 -46,-29 L -46,-29 A 14,14 0 0,1 -32,-43 z",
            fillColor: color, fillOpacity: 0.95, strokeColor: "#ffffff", strokeWeight: 2, scale: 1,
            labelOrigin: new window.google.maps.Point(0, -29),
          },
        });
        marker.addListener("click", () => onMarkerClick(eq));
        gMarkersRef.current.push(marker);
      });
    }
  }, [engine, filtered.length, searchQuery, activeCategory, sortBy, viewMode]);

  // ── Locate me ────────────────────────────────────────────────────
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const pos = { lat: coords.latitude, lng: coords.longitude };
        if (engineRef.current === "google" && googleMapRef.current) {
          googleMapRef.current.setCenter(pos); googleMapRef.current.setZoom(15);
        } else if (engineRef.current === "leaflet" && leafletMapRef.current) {
          leafletMapRef.current.setView([pos.lat, pos.lng], 15);
        }
      },
      () => {
        if (engineRef.current === "leaflet" && leafletMapRef.current) {
          leafletMapRef.current.setView([26.1445, 91.7362], 13);
        }
      }
    );
  };

  // ── Cleanup ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (leafletMapRef.current?.remove) { leafletMapRef.current.remove(); leafletMapRef.current = null; }
    };
  }, []);

  return (
    <div className="relative h-[calc(100vh-64px)] -mx-4 md:-mx-6 -mt-4 md:-mt-6 -mb-16 md:mb-0 flex flex-col overflow-hidden">

      {/* ── Top controls bar ─────────────────────────────────────── */}
      <div className="relative z-[500] bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        {/* Search row */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              className="w-full pl-9 pr-4 py-2 rounded-full bg-muted/60 border-none focus-visible:ring-1 focus-visible:ring-primary text-sm"
              placeholder="Search excavators, cranes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          {/* Map / List toggle */}
          <div className="flex bg-muted rounded-full p-0.5 shrink-0">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${viewMode === "map" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Map className="h-3.5 w-3.5" /> Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${viewMode === "list" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 px-3 pb-3 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/60 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="shrink-0 w-px" />
          {/* Sort dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-7 pr-3 py-1 rounded-full text-xs font-semibold border border-border bg-muted/60 text-muted-foreground appearance-none cursor-pointer hover:border-primary/50 focus:outline-none"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <SlidersHorizontal className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ── Main area ────────────────────────────────────────────── */}
      <div className="flex-1 relative overflow-hidden">

        {/* MAP VIEW */}
        <div className={`absolute inset-0 ${viewMode === "map" ? "block" : "hidden"}`}>
          <div ref={mapRef} className="absolute inset-0 w-full h-full" />

          {/* Locate me button */}
          <Button
            size="icon"
            className="absolute bottom-6 right-4 z-[500] rounded-full h-12 w-12 shadow-lg bg-background text-foreground hover:bg-muted border border-border"
            onClick={handleLocateMe}
            title="Center on my location"
          >
            <Navigation2 className="h-5 w-5" />
          </Button>

          {/* Results count pill */}
          <div className="absolute top-3 left-3 z-[500] bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-semibold border border-border shadow">
            {filtered.length} equipment found
          </div>

          {/* Bottom sheet card */}
          <AnimatePresence>
            {selectedEq && (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="absolute bottom-4 left-2 right-2 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-sm z-[600]"
              >
                <Card className="overflow-hidden border-border/50 shadow-2xl bg-background/97 backdrop-blur-xl">
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 z-10 bg-background/60 backdrop-blur rounded-full h-8 w-8"
                      onClick={() => setSelectedEq(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="flex h-28 w-full bg-gradient-to-br from-slate-700 to-slate-900 items-center justify-center text-slate-300">
                      <span className="font-bold text-sm tracking-wide uppercase px-4 text-center">{selectedEq.name}</span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-base line-clamp-1">{selectedEq.name}</h3>
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded text-xs font-bold shrink-0 mt-0.5">
                        <Star className="h-3 w-3 fill-current" /> {selectedEq.rating.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                      <MapPin className="h-3 w-3" /> {selectedEq.location} · {selectedEq.distance} km away
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-lg text-primary">
                        ₹{parseInt(selectedEq.pricePerDay).toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground">/day</span>
                      </div>
                      <Button asChild size="sm" className="rounded-full px-5">
                        <Link href={`/equipment/${selectedEq.id}`}>
                          Book now <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* LIST VIEW */}
        <AnimatePresence>
          {viewMode === "list" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 overflow-y-auto bg-background p-4 space-y-3"
            >
              {filtered.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <MapPin className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No equipment found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                filtered.map((eq) => (
                  <motion.div
                    key={eq.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                  >
                    <Card
                      className={`border-border hover:border-primary/40 hover:shadow-md transition-all cursor-pointer ${selectedEq?.id === eq.id ? "border-primary ring-1 ring-primary/30" : ""}`}
                      onClick={() => { setSelectedEq(eq); setViewMode("map"); }}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shrink-0 text-slate-300">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-sm truncate">{eq.name}</h3>
                            <div className="flex items-center gap-0.5 text-yellow-500 shrink-0 text-xs font-bold">
                              <Star className="h-3 w-3 fill-current" /> {eq.rating.toFixed(1)}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0" /> {eq.location} · {eq.distance} km
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-bold text-primary text-sm">
                              ₹{parseInt(eq.pricePerDay).toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/day</span>
                            </span>
                            <Badge variant="outline" className={`text-[10px] px-1.5 ${eq.status === "AVAILABLE" ? "text-green-600 border-green-500/30" : "text-amber-600 border-amber-500/30"}`}>
                              {eq.status === "AVAILABLE" ? "Available" : "Busy"}
                            </Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
