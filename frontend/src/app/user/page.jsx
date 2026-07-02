"use client";

import React, { useState, useEffect } from "react";
import { StatsCard } from "@/components/StatsCard";
import { BookingCard } from "@/components/BookingCard";
import { NotificationCard } from "@/components/NotificationCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, CheckCircle, Compass, Heart, Search, MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { fetchWithCSRF } from "@/lib/api";
import SetupPrompt from "@/components/security/SetupPrompt";

import bookingsMock from "@/mock/bookings.json";
import notificationsMock from "@/mock/notifications.json";
import equipmentMock from "@/mock/equipment.json";

export default function UserDashboard() {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        
        // 1. Fetch Profile
        const profileRes = await fetchWithCSRF("/api/user/profile");
        const profileData = await profileRes.json().catch(() => ({}));
        if (profileRes.ok && profileData.success) {
          setProfile(profileData.data);
        } else {
          // Fallback if not logged in (e.g. for testing / account of ID 5)
          setProfile({
            id: 5,
            first_name: "Bistu",
            last_name: "Paul",
            email: "paul@gmail.com",
            phone: "8761006911"
          });
        }

        // 2. Fetch Bookings
        const bookingsRes = await fetchWithCSRF("/api/bookings/my-bookings");
        const bookingsDataResponse = await bookingsRes.json().catch(() => ({}));
        if (bookingsRes.ok && bookingsDataResponse.data) {
          setBookings(bookingsDataResponse.data);
        }

        // 3. Fetch Notifications
        const notificationsRes = await fetchWithCSRF("/api/notifications");
        const notificationsDataResponse = await notificationsRes.json().catch(() => ({}));
        if (notificationsRes.ok && notificationsDataResponse.data) {
          setNotifications(notificationsDataResponse.data);
        }

        // 4. Fetch Recommended Equipment
        const equipRes = await fetchWithCSRF("/api/equipment?limit=4");
        const equipDataResponse = await equipRes.json().catch(() => ({}));
        if (equipRes.ok && equipDataResponse.data && equipDataResponse.data.length > 0) {
          setRecommended(equipDataResponse.data);
        } else {
          // Fallback to mock catalog
          setRecommended(equipmentMock.slice(0, 4));
        }

      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Format stats from real bookings
  const activeCount = bookings.filter(b => 
    ["ACTIVE", "IN_PROGRESS", "CONFIRMED", "PAID"].includes(b.status.toUpperCase())
  ).length;

  const completedCount = bookings.filter(b => 
    ["COMPLETED", "CLOSED"].includes(b.status.toUpperCase())
  ).length;

  const spentAmount = bookings.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0);
  
  // Format spent amount for display (e.g. ₹1.2L or ₹75.5K)
  const formatSpent = (amt) => {
    if (amt >= 100000) {
      return `₹${(amt / 100000).toFixed(1)}L`;
    } else if (amt >= 1000) {
      return `₹${(amt / 1000).toFixed(1)}K`;
    }
    return `₹${amt}`;
  };

  // Map backend bookings to BookingCard expectations
  const userBookings = bookings.length > 0 
    ? bookings.slice(0, 3).map(b => ({
        id: b.id,
        equipmentName: b.equipment_name || `Equipment #${b.equipment_id}`,
        startDate: new Date(b.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        endDate: new Date(b.end_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(),
        location: b.pickup_location || "Guwahati, Assam",
        totalPrice: b.total_amount
      }))
    : bookingsMock.slice(0, 3); // Mock fallback if no bookings in DB

  // Map backend notifications to NotificationCard expectations
  const userNotifications = notifications.length > 0
    ? notifications.slice(0, 4).map(n => ({
        id: n.id,
        title: n.title,
        message: n.message,
        date: n.created_at,
        isRead: n.is_read
      }))
    : notificationsMock.slice(0, 4);

  // Map recommended equipment
  const recommendedMapped = recommended.map((eq, idx) => ({
    id: eq.id,
    name: eq.name,
    rating: eq.rating || "4.8",
    location: eq.location || "Guwahati, Assam",
    pricePerDay: eq.price_per_day || eq.pricePerDay || 15000,
    image: eq.image || `/images/eq-${(idx % 3) + 1}.jpg`
  }));

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const welcomeName = profile ? profile.first_name : "Bistu";

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="pb-24 md:pb-8"
    >
      <motion.div variants={item} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">Welcome back, {welcomeName}! 👋</h1>
          <p className="text-muted-foreground mt-2">Here's an overview of your rentals and activity.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="rounded-full shadow-lg hover:shadow-xl transition-all">
            <Link href="/user/nearby">
              <Compass className="mr-2 h-4 w-4" /> Explore Nearby
            </Link>
          </Button>
        </div>
      </motion.div>

      <SetupPrompt />

      {/* Quick Stats */}
      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Active" value={activeCount || "2"} icon={Clock} />
        <StatsCard title="Completed" value={completedCount || "15"} icon={CheckCircle} />
        <StatsCard title="Saved" value="8" icon={Heart} />
        <StatsCard title="Spent" value={spentAmount > 0 ? formatSpent(spentAmount) : "₹1.2L"} icon={FileText} />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Main Content: Recent Activity & Recommendations */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div variants={item}>
            <Card className="border-border shadow-sm overflow-hidden">
              <CardHeader className="bg-muted/30 border-b border-border pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">Active Bookings</CardTitle>
                  <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80">
                    <Link href="/user/bookings">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4 bg-card">
                {userBookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold tracking-tight">Recommended for You</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/equipment">See more</Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedMapped.map((eq) => (
                <Link href={`/equipment/${eq.id}`} key={eq.id}>
                  <Card className="overflow-hidden hover:shadow-md transition-all group border-border/50">
                    <div className="relative h-40 w-full overflow-hidden bg-muted">
                      {eq.image && (
                        <div className="relative w-full h-full bg-slate-800 flex items-center justify-center text-slate-400">
                          <span className="font-bold text-sm tracking-wide uppercase px-4 text-center">{eq.name}</span>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-background/90 backdrop-blur rounded-full p-1.5">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold truncate pr-2">{eq.name}</h3>
                        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 px-1.5 py-0.5 rounded text-xs font-bold shrink-0">
                          <Star className="h-3 w-3 fill-current" />
                          {eq.rating}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                        <MapPin className="h-3 w-3" /> {eq.location}
                      </p>
                      <div className="font-bold text-primary">
                        ₹{eq.pricePerDay.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/day</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar: Notifications */}
        <motion.div variants={item} className="space-y-6">
          <Card className="border-border shadow-sm h-full max-h-[600px] flex flex-col">
            <CardHeader className="bg-muted/30 pb-4 border-b border-border">
              <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-4 space-y-1">
              {userNotifications.map(notification => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </CardContent>
          </Card>
        </motion.div>
        
      </div>
    </motion.div>
  );
}
