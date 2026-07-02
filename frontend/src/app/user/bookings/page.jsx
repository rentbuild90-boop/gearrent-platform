"use client";

import React, { useState, useEffect } from "react";
import { BookingCard } from "@/components/BookingCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { fetchWithCSRF } from "@/lib/api";
import { Loader2 } from "lucide-react";

export default function MyBookingsPage() {
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await fetchWithCSRF("/api/bookings/my-bookings");
        const data = await res.json();
        if (res.ok && data?.data) {
          const formatted = data.data.map(b => ({
            id: b.id,
            equipmentName: b.equipment_name || `Equipment #${b.equipment_id}`,
            status: b.status,
            startDate: new Date(b.start_date).toLocaleDateString(),
            endDate: new Date(b.end_date).toLocaleDateString(),
            location: b.pickup_location || "Guwahati",
            totalPrice: b.total_price || 0,
          }));
          setBookingsData(formatted);
        }
      } catch (err) {
        console.error("Failed to load bookings", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  // Map backend statuses to the UI tabs
  const activeBookings = bookingsData.filter(b => b.status === "IN_PROGRESS" || b.status === "ACTIVE" || b.status === "In Progress");
  const upcomingBookings = bookingsData.filter(b => b.status === "CONFIRMED" || b.status === "PENDING" || b.status === "Confirmed" || b.status === "Pending");
  const completedBookings = bookingsData.filter(b => b.status === "COMPLETED" || b.status === "Completed");
  const canceledBookings = bookingsData.filter(b => b.status === "CANCELLED" || b.status === "Cancelled");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="pb-24 md:pb-8"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Bookings</h1>
        <p className="text-muted-foreground">Manage your past, present, and upcoming equipment rentals.</p>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-4 mb-6">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center items-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <TabsContent value="active" className="space-y-4 outline-none">
          {activeBookings.length > 0 ? (
            activeBookings.map(b => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <BookingCard booking={b} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              No active bookings found.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4 outline-none">
          {upcomingBookings.length > 0 ? (
            upcomingBookings.map(b => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <BookingCard booking={b} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              No upcoming bookings found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 outline-none">
          {completedBookings.length > 0 ? (
            completedBookings.map(b => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <BookingCard booking={b} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              No completed bookings found.
            </div>
          )}
        </TabsContent>

        <TabsContent value="canceled" className="space-y-4 outline-none">
          {canceledBookings.length > 0 ? (
            canceledBookings.map(b => (
              <motion.div key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <BookingCard booking={b} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground bg-card rounded-xl border border-border">
              No canceled bookings found.
            </div>
          )}
        </TabsContent>
          </>
        )}
      </Tabs>
    </motion.div>
  );
}
