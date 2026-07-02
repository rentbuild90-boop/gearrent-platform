"use client";

import React, { useState } from "react";
import { Webhook, Play, Server, Code2 } from "lucide-react";

export default function ApiExplorerPage() {
  const [method, setMethod] = useState("GET");
  const [endpoint, setEndpoint] = useState("/api/v1/equipment");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTest = () => {
    setLoading(true);
    setResponse("");
    setTimeout(() => {
      setResponse(JSON.stringify({
        status: "success",
        data: {
          items: [
            { id: "eq_001", type: "Excavator", status: "available" }
          ]
        },
        meta: { timestamp: new Date().toISOString(), latency_ms: 45 }
      }, null, 2));
      setLoading(false);
    }, 800);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="bg-fuchsia-500/20 p-3 rounded-xl">
          <Webhook className="w-6 h-6 text-fuchsia-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">API Explorer</h1>
          <p className="text-outline text-sm">Test and debug internal API endpoints directly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* Request Area */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
            <h2 className="text-sm font-bold text-on-background flex items-center gap-2"><Server className="w-4 h-4"/> Request Configuration</h2>
          </div>
          <div className="p-6 space-y-6 flex-1 overflow-auto">
            <div className="flex gap-4">
              <select 
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="bg-surface-container font-mono text-on-background border border-outline/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <input 
                type="text" 
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="/api/v1/..."
                className="flex-1 bg-surface-container font-mono text-on-background border border-outline/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button 
                onClick={handleTest}
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? "Testing..." : <><Play className="w-4 h-4" /> Send</>}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Headers (JSON)</label>
              <textarea 
                rows="3"
                defaultValue={'{\n  "Authorization": "Bearer mockup_token",\n  "Content-Type": "application/json"\n}'}
                className="w-full bg-[#1e1e1e] text-green-400 font-mono text-sm border border-outline/30 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                spellCheck="false"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Body (JSON)</label>
              <textarea 
                rows="6"
                placeholder="{}"
                disabled={method === "GET"}
                className="w-full bg-[#1e1e1e] text-green-400 font-mono text-sm border border-outline/30 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                spellCheck="false"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Response Area */}
        <div className="bg-[#0f172a] rounded-xl shadow-lg border border-slate-700/50 flex flex-col overflow-hidden">
          <div className="bg-[#1e293b] p-4 border-b border-slate-700/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Code2 className="w-4 h-4"/> Response Body</h2>
            {response && <div className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">200 OK</div>}
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full text-slate-500 font-mono animate-pulse">Awaiting response...</div>
            ) : response ? (
              <pre className="text-sky-300 font-mono text-sm leading-relaxed">{response}</pre>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-600 font-mono">Hit Send to execute request</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
