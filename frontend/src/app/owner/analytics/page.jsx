"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MockChart } from "@/components/MockChart";
import chartsData from "@/mock/charts.json";
import { TrendingUp, Users, Package, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function OwnerAnalyticsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Deep dive into your business performance and fleet utilization.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Revenue", value: "₹4,25,000", change: "+15%", icon: TrendingUp },
          { title: "Avg. Utilization", value: "68%", change: "+5%", icon: Activity },
          { title: "Total Clients", value: "42", change: "+12%", icon: Users },
          { title: "Top Equipment", value: "JCB 3DX", change: "28 Bookings", icon: Package },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-sm border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1 text-green-500">
                  {stat.change} this month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[350px]">
          <MockChart 
            title="Revenue vs Target" 
            description="Comparing actual revenue against monthly targets"
            data={chartsData.revenue} 
            valuePrefix="₹"
            height="h-[250px]"
          />
        </div>
        <div className="h-[350px]">
          <MockChart 
            title="Fleet Utilization" 
            description="Percentage of days rented per equipment category"
            data={chartsData.equipmentUsage} 
            height="h-[250px]"
          />
        </div>
      </div>
    </div>
  );
}
