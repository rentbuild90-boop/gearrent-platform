"use client";

import React, { useState, useEffect } from "react";
import { Activity, Server, Cpu, Database, Network, Clock, AlertTriangle } from "lucide-react";

export default function MonitoringDashboard() {
  const [logs, setLogs] = useState([]);
  
  // Mock Real-time stats
  const [cpuUsage, setCpuUsage] = useState(45);
  const [memoryUsage, setMemoryUsage] = useState(62);
  const [activeConnections, setActiveConnections] = useState(128);

  useEffect(() => {
    // Simulate real-time fluctuating stats
    const statsInterval = setInterval(() => {
      setCpuUsage(prev => Math.max(10, Math.min(100, prev + (Math.random() * 20 - 10))));
      setMemoryUsage(prev => Math.max(20, Math.min(98, prev + (Math.random() * 10 - 5))));
      setActiveConnections(prev => Math.max(50, Math.min(500, Math.floor(prev + (Math.random() * 40 - 20)))));
    }, 2000);

    // Simulate incoming logs
    const logInterval = setInterval(() => {
      const messages = [
        "[INFO] POST /api/v1/bookings - 201 Created",
        "[INFO] GET /api/v1/equipment?category=Excavator - 200 OK",
        "[WARN] Rate limit threshold approaching for IP 192.168.1.55",
        "[ERROR] Failed to fetch Geolocation data from Maps API",
        "[INFO] WebSocket connection established (Client: User-441)",
        "[INFO] Database query executed in 45ms"
      ];
      const randomLog = messages[Math.floor(Math.random() * messages.length)];
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1); // HH:MM:SS.mmm
      
      setLogs(prev => {
        const newLogs = [...prev, `${timestamp} ${randomLog}`];
        if (newLogs.length > 50) newLogs.shift();
        return newLogs;
      });
    }, 1500);

    return () => {
      clearInterval(statsInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-rose-500/20 p-3 rounded-xl animate-pulse">
            <Activity className="w-6 h-6 text-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Live Monitoring</h1>
            <p className="text-outline text-sm">Real-time system health and application logs.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-semibold text-green-500">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">CPU Load</h2>
            <Cpu className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-bold text-on-background">{cpuUsage.toFixed(1)}%</div>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${cpuUsage > 80 ? 'bg-rose-500' : 'bg-blue-500'}`} 
              style={{ width: `${cpuUsage}%` }}
            />
          </div>
        </div>

        {/* Memory */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Memory Usage</h2>
            <Database className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-bold text-on-background">{memoryUsage.toFixed(1)}%</div>
            <div className="text-sm text-outline mb-1">/ 16 GB</div>
          </div>
          <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${memoryUsage > 85 ? 'bg-rose-500' : 'bg-purple-500'}`} 
              style={{ width: `${memoryUsage}%` }}
            />
          </div>
        </div>

        {/* Network */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Active Conns</h2>
            <Network className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="text-4xl font-bold text-on-background">{activeConnections}</div>
          <p className="text-xs text-outline font-medium">WebSocket & HTTP connections</p>
        </div>
      </div>

      {/* Live Logs */}
      <div className="bg-[#0f172a] rounded-xl shadow-lg border border-slate-700/50 flex flex-col h-[500px] overflow-hidden">
        <div className="bg-[#1e293b] p-3 border-b border-slate-700/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-mono font-semibold text-slate-300">server.log</span>
          </div>
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] md:text-xs leading-relaxed flex flex-col-reverse">
          {logs.map((log, i) => {
            let colorClass = "text-slate-300";
            if (log.includes("[ERROR]")) colorClass = "text-rose-400 font-bold";
            else if (log.includes("[WARN]")) colorClass = "text-amber-300";
            else if (log.includes("[INFO]")) colorClass = "text-sky-300";

            return (
              <div key={i} className={`whitespace-pre-wrap py-0.5 border-b border-slate-800/30 ${colorClass}`}>
                {log}
              </div>
            );
          })}
          {logs.length === 0 && <div className="text-slate-500 italic">Waiting for log stream...</div>}
        </div>
      </div>
    </div>
  );
}
