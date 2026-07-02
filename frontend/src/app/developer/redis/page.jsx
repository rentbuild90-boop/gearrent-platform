"use client";

import React, { useState } from "react";
import { Server, Trash2, Search, Zap, RefreshCw, Key } from "lucide-react";

export default function RedisMonitorPage() {
  const [keys, setKeys] = useState([
    { key: "session:usr_9123", type: "string", size: "256 B", ttl: "12 hours" },
    { key: "cache:equipment:list", type: "json", size: "45 KB", ttl: "5 mins" },
    { key: "rate_limit:ip:192.168.1.5", type: "string", size: "12 B", ttl: "45 secs" },
    { key: "active_drivers:geo", type: "hash", size: "12 KB", ttl: "None" },
  ]);

  const [flushing, setFlushing] = useState(false);

  const handleFlush = () => {
    if(confirm("Are you sure you want to flush the entire Redis database? This will log out all users and clear all cache!")) {
      setFlushing(true);
      setTimeout(() => {
        setKeys([]);
        setFlushing(false);
        alert("Redis DB Flushed Successfully");
      }, 1500);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-red-500/20 p-3 rounded-xl border border-red-500/30">
            <Server className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Redis Monitor</h1>
            <p className="text-outline text-sm">Manage in-memory cache, sessions, and fast-access data.</p>
          </div>
        </div>
        <button 
          onClick={handleFlush}
          disabled={flushing}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {flushing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          {flushing ? "Flushing..." : "Flush All DB"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Memory Usage</p>
          <h3 className="text-3xl font-bold text-on-background">124 <span className="text-xl text-outline">MB</span></h3>
          <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-red-500 h-full w-[12%]"></div>
          </div>
          <p className="text-xs text-outline mt-2">12% of 1 GB Limit</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Total Keys</p>
          <h3 className="text-3xl font-bold text-on-background">4,291</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1"><Zap className="w-3 h-3"/> +125 in last hour</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Hit Rate</p>
          <h3 className="text-3xl font-bold text-on-background">94.2%</h3>
          <p className="text-xs text-emerald-500 font-semibold mt-2 flex items-center gap-1"><Zap className="w-3 h-3"/> Highly optimized</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <p className="text-sm font-semibold text-outline uppercase tracking-wider mb-2">Connected Clients</p>
          <h3 className="text-3xl font-bold text-on-background">18</h3>
          <p className="text-xs text-outline mt-2 flex items-center gap-1">Across 4 nodes</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <h2 className="text-lg font-bold text-on-background">Key Browser</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search keys (e.g. session:*)"
                className="bg-surface-container text-on-background text-sm rounded-lg pl-9 pr-4 py-2 outline-none border border-outline-variant/50 focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all w-64"
              />
            </div>
          </div>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold w-12"></th>
              <th className="p-4 font-semibold">Key Name</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Size</th>
              <th className="p-4 font-semibold">TTL</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {keys.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-outline">No keys found in database.</td>
              </tr>
            ) : keys.map((k, i) => (
              <tr key={i} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4"><Key className="w-4 h-4 text-outline" /></td>
                <td className="p-4 font-mono text-on-background font-semibold">{k.key}</td>
                <td className="p-4">
                  <span className="bg-surface-container px-2 py-1 rounded text-xs text-outline font-mono uppercase">{k.type}</span>
                </td>
                <td className="p-4 text-on-surface-variant">{k.size}</td>
                <td className="p-4 text-on-surface-variant">{k.ttl}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-sky-500 hover:bg-sky-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors">View</button>
                  <button className="text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
