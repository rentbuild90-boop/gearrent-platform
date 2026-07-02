"use client";

import React, { useState } from "react";
import { AlertOctagon, CheckCircle2 } from "lucide-react";

export default function MaintenanceModePage() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert(`Maintenance mode is now ${isMaintenance ? 'ON' : 'OFF'}`);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/30">
          <AlertOctagon className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Maintenance Mode</h1>
          <p className="text-outline text-sm">Take the application offline for public users during critical updates.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm border border-outline-variant/30 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-background mb-2">System Status</h2>
          {isMaintenance ? (
            <div className="flex items-center gap-2 text-orange-500 font-bold">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              MAINTENANCE MODE ACTIVE
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-500 font-bold">
              <CheckCircle2 className="w-5 h-5" /> ALL SYSTEMS OPERATIONAL
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setIsMaintenance(!isMaintenance)}
            className={`px-8 py-3 rounded-lg font-bold transition-colors ${
              isMaintenance 
                ? "bg-surface-container text-on-background hover:bg-surface-container-highest" 
                : "bg-orange-500 hover:bg-orange-600 text-white"
            }`}
          >
            {isMaintenance ? "Deactivate Maintenance" : "Activate Maintenance"}
          </button>
        </div>
      </div>

      {isMaintenance && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-outline-variant/30">
            <h3 className="font-bold text-on-background">Maintenance Configuration</h3>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Public Message</label>
              <textarea 
                rows="3"
                defaultValue="GearRent is currently undergoing scheduled maintenance to improve our services. We'll be back online shortly."
                className="w-full bg-surface-container text-on-background rounded-lg p-4 outline-none border border-outline-variant/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Estimated Time of Arrival (ETA)</label>
              <input 
                type="text" 
                defaultValue="2 Hours"
                className="w-full max-w-md bg-surface-container text-on-background rounded-lg px-4 py-2 outline-none border border-outline-variant/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Allowed IPs (Whitelist)</label>
              <p className="text-xs text-outline mb-2">Developers accessing the site from these IPs will bypass the maintenance screen.</p>
              <textarea 
                rows="2"
                defaultValue="127.0.0.1, 192.168.1.55"
                className="w-full bg-surface-container text-on-background rounded-lg p-4 outline-none border border-outline-variant/50 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-mono text-sm"
              ></textarea>
            </div>

            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2.5 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Configuration"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
