"use client";

import React, { useState } from "react";
import { Server, Settings, AlertOctagon, Key, RefreshCw, HardDrive, Shield } from "lucide-react";

export default function SystemConfigPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("System is currently undergoing scheduled maintenance. Please check back in a few minutes.");
  
  const [envVars, setEnvVars] = useState([
    { key: "NEXT_PUBLIC_API_URL", value: "https://api.gearrent.com/v1", isSecret: false },
    { key: "DATABASE_URL", value: "mongodb+srv://admin:********@cluster.mongodb.net/gearrent", isSecret: true },
    { key: "STRIPE_SECRET_KEY", value: "sk_test_************************", isSecret: true },
    { key: "REDIS_URL", value: "redis://10.0.0.5:6379", isSecret: false },
  ]);

  const handleClearCache = (type) => {
    alert(`${type} cache cleared successfully!`);
  };

  const handleSaveMaintenance = () => {
    alert(`Maintenance mode is now ${maintenanceMode ? 'ACTIVE' : 'INACTIVE'}.`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-slate-500/20 p-3 rounded-xl">
          <Server className="w-6 h-6 text-slate-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">System Configuration</h1>
          <p className="text-outline text-sm">Manage core system behaviors, environment variables, and caches.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column */}
        <div className="space-y-8">
          
          {/* Maintenance Mode */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-4">
              <AlertOctagon className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-bold text-on-background">Maintenance Mode</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/30">
                <div>
                  <div className="font-semibold text-on-background text-sm">Toggle Maintenance State</div>
                  <div className="text-xs text-outline mt-1">When active, users will see the maintenance screen. Admins can still log in.</div>
                </div>
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-rose-500' : 'bg-outline-variant'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-outline mb-1">Public Display Message</label>
                <textarea 
                  rows="3"
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  disabled={!maintenanceMode}
                  className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                ></textarea>
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={handleSaveMaintenance}
                  className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >Apply Changes</button>
              </div>
            </div>
          </div>

          {/* Cache Management */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-2 mb-4">
              <HardDrive className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-on-background">Cache Management</h2>
            </div>
            <p className="text-sm text-outline mb-6">Flush specific layers of the caching architecture to resolve data staleness.</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/30 hover:border-amber-500/50 transition-colors group">
                <div>
                  <div className="font-semibold text-sm text-on-background flex items-center gap-2">Redis Data Cache</div>
                  <div className="text-xs text-outline mt-1">Clears session data, rate limiters, and cached queries.</div>
                </div>
                <button 
                  onClick={() => handleClearCache('Redis')}
                  className="p-2 text-outline group-hover:text-amber-500 group-hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" /> FLUSH
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/30 hover:border-amber-500/50 transition-colors group">
                <div>
                  <div className="font-semibold text-sm text-on-background flex items-center gap-2">Next.js Edge Cache</div>
                  <div className="text-xs text-outline mt-1">Invalidates static generated pages and edge cache responses.</div>
                </div>
                <button 
                  onClick={() => handleClearCache('Edge')}
                  className="p-2 text-outline group-hover:text-amber-500 group-hover:bg-amber-500/10 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" /> PURGE
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Environment Variables */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-4 flex-shrink-0">
              <Key className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-on-background">Environment Variables</h2>
            </div>
            <div className="bg-amber-500/10 text-amber-600 border border-amber-500/30 p-3 rounded-lg flex items-start gap-2 mb-6 flex-shrink-0">
              <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-xs font-medium leading-relaxed">
                Changes to environment variables require a full server restart to take effect. Secret values are masked.
              </p>
            </div>

            <div className="flex-1 overflow-auto rounded-lg border border-outline-variant/30 bg-[#0f172a]">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#1e293b] border-b border-slate-700/50 text-slate-400 text-xs font-semibold uppercase tracking-wider sticky top-0">
                    <th className="p-4">Key</th>
                    <th className="p-4">Value</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-xs">
                  {envVars.map((env, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="p-4 text-sky-400 font-bold">{env.key}</td>
                      <td className={`p-4 ${env.isSecret ? 'text-slate-500' : 'text-slate-300'} break-all`}>
                        {env.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pt-6 mt-4 flex justify-end flex-shrink-0">
              <button className="bg-surface-container text-on-surface px-4 py-2 rounded-lg text-sm font-semibold hover:bg-surface-container-highest transition-colors">
                Add Variable
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
