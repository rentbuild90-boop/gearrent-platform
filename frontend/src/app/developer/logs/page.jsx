"use client";

import React, { useState } from "react";
import { FileText, Download, Search, Filter, Server, Monitor, Database } from "lucide-react";

export default function LogsViewerPage() {
  const [activeTab, setActiveTab] = useState("backend");

  const logsData = {
    backend: [
      { time: "12:45:01", level: "INFO", message: "Starting FastAPI server on port 8000" },
      { time: "12:45:02", level: "INFO", message: "Connected to MongoDB at mongodb://localhost:27017" },
      { time: "12:46:15", level: "WARN", message: "Slow query detected in Bookings.find() (450ms)" },
      { time: "12:48:30", level: "ERROR", message: "Failed to send email to user_8912: Connection timeout" },
      { time: "12:50:00", level: "INFO", message: "Processed 14 background jobs from queue" },
    ],
    frontend: [
      { time: "12:40:01", level: "INFO", message: "Next.js server started in production mode" },
      { time: "12:41:22", level: "WARN", message: "Missing prop 'id' in component ProfileCard" },
      { time: "12:45:00", level: "INFO", message: "Cache revalidation successful for /equipment" },
      { time: "12:55:10", level: "ERROR", message: "Uncaught ReferenceError: window is not defined" },
    ]
  };

  const logs = logsData[activeTab] || [];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col space-y-6">
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700/50 p-3 rounded-xl border border-slate-600">
            <FileText className="w-6 h-6 text-slate-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Logs Viewer</h1>
            <p className="text-outline text-sm">Aggregated system logs across all services.</p>
          </div>
        </div>
        <button className="bg-surface-container hover:bg-surface-container-highest text-on-background px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col flex-1 overflow-hidden">
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low flex-shrink-0">
          <button 
            onClick={() => setActiveTab('backend')}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'backend' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
          >
            <Server className="w-4 h-4" /> Backend API
          </button>
          <button 
            onClick={() => setActiveTab('frontend')}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'frontend' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
          >
            <Monitor className="w-4 h-4" /> Frontend (Next.js)
          </button>
          <button 
            onClick={() => setActiveTab('redis')}
            className={`px-6 py-4 text-sm font-bold flex items-center gap-2 transition-colors border-b-2 ${activeTab === 'redis' ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-background'}`}
          >
            <Database className="w-4 h-4" /> Redis / Mongo
          </button>
        </div>

        <div className="p-4 bg-surface-container-lowest border-b border-outline-variant/30 flex gap-4 flex-shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..."
              className="w-full bg-surface-container text-on-background text-sm rounded-lg pl-9 pr-4 py-2 outline-none border border-outline-variant/50 focus:border-primary transition-all"
            />
          </div>
          <button className="bg-surface-container hover:bg-surface-container-highest text-on-background px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors border border-outline-variant/50">
            <Filter className="w-4 h-4" /> Filter Level
          </button>
        </div>

        <div className="flex-1 overflow-auto bg-[#0a0a0a] p-4 font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-slate-500 flex items-center justify-center h-full">No logs available for this service.</div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-4 hover:bg-[#1a1a1a] px-2 py-1 rounded transition-colors">
                  <span className="text-slate-500 w-20 flex-shrink-0">{log.time}</span>
                  <span className={`w-16 flex-shrink-0 font-bold ${
                    log.level === 'INFO' ? 'text-sky-400' :
                    log.level === 'WARN' ? 'text-amber-400' : 'text-rose-400'
                  }`}>{log.level}</span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
