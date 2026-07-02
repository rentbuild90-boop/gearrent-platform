"use client";

import React from "react";
import { HeartPulse, CheckCircle2, AlertTriangle, Clock } from "lucide-react";

export default function HealthCenterPage() {
  const checks = [
    { name: "Database Connectivity", status: "ok", latency: "12ms", time: "Just now" },
    { name: "Redis Cache", status: "ok", latency: "2ms", time: "Just now" },
    { name: "Payment Gateway API", status: "warning", latency: "850ms", time: "2 mins ago" },
    { name: "Storage Service", status: "ok", latency: "45ms", time: "Just now" },
    { name: "Email SMTP Server", status: "ok", latency: "120ms", time: "5 mins ago" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-rose-500/20 p-3 rounded-xl">
          <HeartPulse className="w-6 h-6 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Health Center</h1>
          <p className="text-outline text-sm">System vitality and latency checks for internal and external services.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-background">Service Health</h2>
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
          </div>
        </div>

        <div className="space-y-4">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-4">
                {check.status === 'ok' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <h3 className="font-semibold text-sm text-on-background">{check.name}</h3>
                  <p className="text-xs text-outline flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3"/> Last checked: {check.time}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${check.status === 'ok' ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {check.latency}
                </div>
                <div className="text-[10px] text-outline uppercase tracking-wider mt-0.5">Latency</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 min-h-[300px] flex items-center justify-center">
        <p className="text-outline font-medium">Health Timeline Chart Placeholder</p>
      </div>
    </div>
  );
}
