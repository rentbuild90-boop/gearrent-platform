"use client";

import React from "react";
import { Cpu, HardDrive, Database, Activity, Wifi, Layers, Clock, Users } from "lucide-react";

export default function SystemOverviewPage() {
  const stats = [
    { name: "CPU Utilization", value: "42%", icon: Cpu, color: "text-sky-500", bg: "bg-sky-500/10" },
    { name: "Memory Usage", value: "8.2 GB", icon: HardDrive, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { name: "Network I/O", value: "124 MB/s", icon: Wifi, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { name: "Active Queries", value: "3,291", icon: Database, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Uptime", value: "45d 12h", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Online Users", value: "1,842", icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
    { name: "API Latency", value: "45ms", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Services", value: "8/8 Online", icon: Layers, color: "text-teal-500", bg: "bg-teal-500/10" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-sky-500/20 p-3 rounded-xl">
          <Cpu className="w-6 h-6 text-sky-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">System Overview</h1>
          <p className="text-outline text-sm">High-level metrics for the entire infrastructure.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4 hover:border-outline transition-colors">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-outline uppercase tracking-wider">{stat.name}</p>
              <h3 className="text-2xl font-bold text-on-background mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 min-h-[300px] flex items-center justify-center">
          <p className="text-outline font-medium">Resource Utilization Chart Placeholder (Recharts)</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 min-h-[300px] flex flex-col gap-4">
          <h3 className="font-bold text-on-background">System Events</h3>
          <div className="flex-1 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-start gap-3 p-3 bg-surface-container rounded-lg">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5" />
                <div>
                  <p className="text-sm font-semibold text-on-background">Database Backup Completed</p>
                  <p className="text-xs text-outline">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
