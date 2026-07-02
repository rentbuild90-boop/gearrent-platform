"use client";

import React from "react";
import { Layers, Play, Square, RotateCcw, Box, HeartPulse } from "lucide-react";

export default function ServiceManagerPage() {
  const services = [
    { name: "Frontend App", type: "Next.js", status: "Running", uptime: "45d 12h", memory: "1.2 GB", cpu: "12%" },
    { name: "Core API", type: "FastAPI", status: "Running", uptime: "45d 12h", memory: "850 MB", cpu: "8%" },
    { name: "Background Workers", type: "Celery", status: "Running", uptime: "12d 4h", memory: "450 MB", cpu: "2%" },
    { name: "Cache Store", type: "Redis", status: "Running", uptime: "120d 5h", memory: "125 MB", cpu: "1%" },
    { name: "Primary DB", type: "MongoDB", status: "Running", uptime: "200d 1h", memory: "4.5 GB", cpu: "15%" },
    { name: "Load Balancer", type: "Nginx", status: "Running", uptime: "200d 1h", memory: "50 MB", cpu: "1%" },
    { name: "Search Engine", type: "Elasticsearch", status: "Stopped", uptime: "-", memory: "-", cpu: "-" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-teal-500/20 p-3 rounded-xl">
          <Layers className="w-6 h-6 text-teal-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Service Manager</h1>
          <p className="text-outline text-sm">Monitor and control individual microservices and daemons.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {services.map((svc, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${svc.status === 'Running' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  <Box className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-on-background">{svc.name}</h3>
                  <p className="text-xs text-outline font-mono">{svc.type}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${svc.status === 'Running' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                {svc.status === 'Running' && <HeartPulse className="w-3 h-3" />}
                {svc.status}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-surface-container p-2 rounded text-center">
                <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Uptime</p>
                <p className="text-xs font-semibold text-on-surface-variant">{svc.uptime}</p>
              </div>
              <div className="bg-surface-container p-2 rounded text-center">
                <p className="text-[10px] text-outline uppercase tracking-wider mb-1">Memory</p>
                <p className="text-xs font-semibold text-on-surface-variant">{svc.memory}</p>
              </div>
              <div className="bg-surface-container p-2 rounded text-center">
                <p className="text-[10px] text-outline uppercase tracking-wider mb-1">CPU</p>
                <p className="text-xs font-semibold text-on-surface-variant">{svc.cpu}</p>
              </div>
            </div>

            <div className="mt-auto flex gap-2 pt-4 border-t border-outline-variant/30 opacity-0 group-hover:opacity-100 transition-opacity">
              {svc.status === 'Running' ? (
                <>
                  <button className="flex-1 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                    <Square className="w-3 h-3" /> Stop
                  </button>
                  <button className="flex-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                    <RotateCcw className="w-3 h-3" /> Restart
                  </button>
                </>
              ) : (
                <button className="flex-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white py-1.5 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors">
                  <Play className="w-3 h-3" /> Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
