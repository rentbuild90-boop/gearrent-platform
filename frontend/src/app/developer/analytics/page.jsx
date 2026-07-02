"use client";

import React from "react";
import { PieChart, TrendingUp, Users, Database, Globe } from "lucide-react";

export default function AnalyticsPage() {
  const cards = [
    { title: "Total Revenue", value: "₹4.2Cr", trend: "+12.5%", icon: TrendingUp, color: "text-emerald-500" },
    { title: "Active Users", value: "12,492", trend: "+5.2%", icon: Users, color: "text-blue-500" },
    { title: "DB Growth", value: "45 GB", trend: "+1.2 GB/mo", icon: Database, color: "text-purple-500" },
    { title: "API Requests", value: "1.2M/day", trend: "+15%", icon: Globe, color: "text-sky-500" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-500/20 p-3 rounded-xl">
          <PieChart className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Analytics</h1>
          <p className="text-outline text-sm">Deep dive into platform metrics, usage, and growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-semibold text-outline uppercase tracking-wider">{card.title}</h3>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-3xl font-bold text-on-background">{card.value}</p>
              <p className="text-xs text-emerald-500 font-semibold mt-1">{card.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 min-h-[350px] flex items-center justify-center">
           <p className="text-outline font-medium">Revenue Over Time Chart Placeholder</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 min-h-[350px] flex items-center justify-center">
           <p className="text-outline font-medium">User Growth Chart Placeholder</p>
        </div>
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 min-h-[400px] flex items-center justify-center">
           <p className="text-outline font-medium">API Usage Heatmap Placeholder</p>
        </div>
      </div>
    </div>
  );
}
