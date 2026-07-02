"use client";

import React from "react";
import { Shield, ShieldAlert, Ban, AlertTriangle, Lock } from "lucide-react";

export default function SecurityDashboardPage() {
  const events = [
    { type: "Failed Login Spike", ip: "45.22.19.102", country: "RU", time: "10 mins ago", status: "blocked" },
    { type: "SQL Injection Attempt", ip: "103.44.2.19", country: "CN", time: "1 hour ago", status: "blocked" },
    { type: "Rate Limit Exceeded", ip: "192.168.1.10", country: "IN", time: "2 hours ago", status: "throttled" },
    { type: "Unusual API Usage", ip: "88.10.4.55", country: "US", time: "5 hours ago", status: "warning" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-rose-500/20 p-3 rounded-xl border border-rose-500/30">
          <Shield className="w-6 h-6 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Security Dashboard</h1>
          <p className="text-outline text-sm">Firewall status, threat detection, and blocked IP management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Active Threats</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">2</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <Ban className="w-10 h-10 text-amber-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">Blocked IPs (24h)</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">142</h3>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex items-center gap-4">
          <Lock className="w-10 h-10 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold text-outline uppercase tracking-wider">SSL Certificate</p>
            <h3 className="text-2xl font-bold text-on-background mt-1">Valid (45d)</h3>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30">
          <h2 className="text-lg font-bold text-on-background">Recent Security Events</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Event Type</th>
              <th className="p-4 font-semibold">IP Address</th>
              <th className="p-4 font-semibold">Geo</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold">Action Taken</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {events.map((event, i) => (
              <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4 font-medium text-on-background flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> {event.type}
                </td>
                <td className="p-4 font-mono text-outline">{event.ip}</td>
                <td className="p-4 text-on-surface-variant">{event.country}</td>
                <td className="p-4 text-outline">{event.time}</td>
                <td className="p-4 text-on-surface-variant">
                  {event.status === 'blocked' && <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded text-xs font-bold uppercase">Blocked</span>}
                  {event.status === 'throttled' && <span className="bg-amber-500/10 text-amber-500 px-2 py-1 rounded text-xs font-bold uppercase">Throttled</span>}
                  {event.status === 'warning' && <span className="bg-sky-500/10 text-sky-500 px-2 py-1 rounded text-xs font-bold uppercase">Logged</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
