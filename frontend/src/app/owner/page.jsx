"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CreditCard, 
  Package, 
  Users, 
  ArrowUpRight, 
  Clock, 
  Truck,
  Plus
} from "lucide-react";
import { MockChart } from "@/components/MockChart";
import { GoogleMapCard } from "@/components/GoogleMapCard";
import statsData from "@/mock/stats.json";
import chartsData from "@/mock/charts.json";
import { AddEquipmentModal } from "@/components/Modals/AddEquipmentModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function OwnerDashboardPage() {
  const { owner } = statsData;
  const [isAddEqOpen, setIsAddEqOpen] = useState(false);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's what's happening with your fleet today.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setIsAddEqOpen(true)} className="w-full sm:w-auto shadow-sm">
            <Plus className="mr-2 h-4 w-4" /> Add Equipment
          </Button>
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{owner.todayRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12% from yesterday
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{owner.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-500">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +8% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{owner.activeBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {owner.pendingRequests} requests pending
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="shadow-sm border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{owner.totalEquipment}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {owner.activeDrivers} active drivers
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 h-[350px]"
        >
          <MockChart 
            title="Revenue Overview" 
            description="Monthly earnings for the current year"
            data={chartsData.revenue} 
            valuePrefix="₹"
            height="h-[250px]"
          />
        </motion.div>

        {/* Live Vehicle Placeholder */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="h-[350px]"
        >
          <GoogleMapCard
            title="Live Fleet Tracking"
            height="h-[350px]"
            center={{ lat: 26.148, lng: 91.742 }}
            zoom={13}
            markers={[
              { lat: 26.1445, lng: 91.7362, label: "CAT 320", color: "#0F52BA" },
              { lat: 26.1550, lng: 91.7500, label: "Crane", color: "#7c3aed" },
              { lat: 26.1380, lng: 91.7600, label: "Loader", color: "#dc2626" }
            ]}
          />
        </motion.div>

      </div>

      {/* Secondary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-sm border-border">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates on your fleet and bookings.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: "Booking Completed", desc: "JCB 3DX rented by Rajesh Construction", time: "2 hours ago", icon: Package },
                { title: "Payment Received", desc: "₹45,000 credited for Booking #1024", time: "5 hours ago", icon: CreditCard },
                { title: "New Driver Assigned", desc: "Amit Singh assigned to Tata Hitachi", time: "Yesterday", icon: Users },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <activity.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">View All Activities</Button>
          </CardContent>
        </Card>

        {/* Popular Vehicles Chart */}
        <div className="h-full">
          <MockChart 
            title="Equipment Utilization" 
            description="Most booked equipment types this month"
            data={chartsData.equipmentUsage} 
            valuePrefix=""
            height="h-[250px]"
          />
        </div>
      </div>

      <AddEquipmentModal isOpen={isAddEqOpen} onClose={() => setIsAddEqOpen(false)} />
    </div>
  );
}
