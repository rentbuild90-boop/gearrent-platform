"use client";

import React, { useState } from "react";
import { History, Search, Download, ShieldAlert, Key, UserCheck } from "lucide-react";

export default function AuditLogsPage() {
  const audits = [
    { id: "au_901", user: "Rajeev Kumar", role: "Superadmin", action: "Flushed Redis Cache", ip: "192.168.1.10", time: "10 mins ago", icon: ShieldAlert, color: "text-rose-500", bg: "bg-rose-500/10" },
    { id: "au_900", user: "Amit Singh", role: "Developer", action: "Updated Env Variable: STRIPE_KEY", ip: "10.0.0.45", time: "1 hour ago", icon: Key, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "au_899", user: "System", role: "Automated", action: "Database Backup Completed", ip: "localhost", time: "2 hours ago", icon: History, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "au_898", user: "Priya Sharma", role: "Support", action: "Approved KYC for User_1234", ip: "192.168.1.55", time: "5 hours ago", icon: UserCheck, color: "text-sky-500", bg: "bg-sky-500/10" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600">
            <History className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Audit Logs</h1>
            <p className="text-outline text-sm">Security log of all administrative and developer actions.</p>
          </div>
        </div>
        <button className="bg-surface-container hover:bg-surface-container-highest text-on-background px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors border border-outline-variant/50">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center flex-wrap gap-4 bg-surface-container-lowest">
          <div className="relative flex-1 min-w-[250px] max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search user, IP, or action..."
              className="w-full bg-surface-container text-on-background text-sm rounded-lg pl-9 pr-4 py-2 outline-none border border-outline-variant/50 focus:border-primary transition-all"
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Action</th>
              <th className="p-4 font-semibold">IP Address</th>
              <th className="p-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {audits.map((log) => (
              <tr key={log.id} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-on-background text-xs">
                      {log.user.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-on-background">{log.user}</p>
                      <p className="text-[10px] text-outline uppercase">{log.role}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${log.bg}`}><log.icon className={`w-4 h-4 ${log.color}`} /></div>
                    <span className="font-medium text-on-background">{log.action}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-outline text-xs">{log.ip}</td>
                <td className="p-4 text-outline">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
