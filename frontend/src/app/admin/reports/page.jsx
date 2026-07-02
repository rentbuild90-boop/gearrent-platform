"use client";

import React from "react";
import { MockChart } from "@/components/MockChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar, Filter } from "lucide-react";
import chartsData from "@/mock/charts.json";
import analyticsData from "@/mock/analytics.json";

export default function ReportsPage() {
  // Map analytics.json monthlyRevenue to the format MockChart expects (value instead of revenue)
  const monthlyRevenueData = analyticsData.monthlyRevenue.map(item => ({
    month: item.month,
    value: item.revenue
  }));

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 pb-24 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Reports</h1>
          <p className="text-muted-foreground mt-1">Deep dive into platform analytics and financial reports.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto shadow-sm">
            <Calendar className="mr-2 h-4 w-4" /> This Year
          </Button>
          <Button className="w-full sm:w-auto shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Processed Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(analyticsData.totalRevenue).toLocaleString()}</div>
            <p className="text-xs text-green-500 mt-1 font-medium">{analyticsData.growth} from last year</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalBookings}</div>
            <p className="text-xs text-green-500 mt-1 font-medium">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Rentals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.activeRentals}</div>
            <p className="text-xs text-muted-foreground mt-1 font-medium">Currently on site</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary">Platform Fees Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">₹{(analyticsData.totalRevenue * 0.1).toLocaleString()}</div>
            <p className="text-xs text-primary/80 mt-1 font-medium">10% standard take rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="h-[400px]">
          <MockChart 
            title="Monthly Processed Volume" 
            description="Total transaction value by month"
            data={monthlyRevenueData} 
            valuePrefix="₹"
            height="h-[300px]"
          />
        </div>
        
        <div className="h-[400px]">
          <MockChart 
            title="Bookings by Day of Week" 
            description="Volume of bookings distributed across the week"
            data={chartsData.bookings} 
            valuePrefix=""
            height="h-[300px]"
          />
        </div>
      </div>
      
      <div className="h-[400px]">
        <MockChart 
          title="Equipment Utilization" 
          description="Most rented equipment categories"
          data={chartsData.equipmentUsage} 
          valuePrefix=""
          height="h-[300px]"
        />
      </div>
    </div>
  );
}
