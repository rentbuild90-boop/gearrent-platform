"use client";

import React, { useState } from "react";
import { Cloud, Download, Trash2, Clock, CheckCircle2, RotateCcw } from "lucide-react";

export default function BackupCenterPage() {
  const [backingUp, setBackingUp] = useState(false);

  const backups = [
    { id: "bkp_104", type: "Full Database", size: "4.2 GB", time: "2 hours ago", status: "success" },
    { id: "bkp_103", type: "Uploads (Images)", size: "12.5 GB", time: "1 day ago", status: "success" },
    { id: "bkp_102", type: "Full Database", size: "4.1 GB", time: "1 day ago", status: "success" },
    { id: "bkp_101", type: "Configuration", size: "2.1 MB", time: "2 days ago", status: "success" },
  ];

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      alert("Manual backup completed successfully.");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500/20 p-3 rounded-xl border border-indigo-500/30">
            <Cloud className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Backup Center</h1>
            <p className="text-outline text-sm">Automated and manual snapshots of critical system data.</p>
          </div>
        </div>
        <button 
          onClick={handleBackup}
          disabled={backingUp}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {backingUp ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Cloud className="w-5 h-5" />}
          {backingUp ? "Creating Snapshot..." : "Trigger Manual Backup"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Next Automated Backup</p>
          <h3 className="text-3xl font-bold text-on-background">04:00 AM</h3>
          <p className="text-xs text-outline mt-2">UTC (in 4 hours)</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Total Snapshot Size</p>
          <h3 className="text-3xl font-bold text-on-background">48.5 GB</h3>
          <p className="text-xs text-outline mt-2">Across 14 retained backups</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center gap-3">
          <h3 className="font-bold text-on-background text-sm">Retention Policy</h3>
          <p className="text-sm text-outline">Keep daily backups for <span className="font-bold text-on-surface-variant">7 days</span></p>
          <p className="text-sm text-outline">Keep weekly backups for <span className="font-bold text-on-surface-variant">4 weeks</span></p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30">
          <h2 className="text-lg font-bold text-on-background">Recent Snapshots</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Size</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {backups.map((bkp) => (
              <tr key={bkp.id} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4 font-mono text-outline">{bkp.id}</td>
                <td className="p-4 font-medium text-on-background flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {bkp.type}
                </td>
                <td className="p-4 text-on-surface-variant font-mono">{bkp.size}</td>
                <td className="p-4 text-outline flex items-center gap-2"><Clock className="w-4 h-4"/> {bkp.time}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-sky-500 hover:bg-sky-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1"><RotateCcw className="w-3 h-3"/> Restore</button>
                  <button className="text-outline hover:bg-surface-container-highest px-3 py-1.5 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1"><Download className="w-3 h-3"/> Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
