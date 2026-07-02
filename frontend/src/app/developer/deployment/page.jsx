"use client";

import React, { useState } from "react";
import { Rocket, Play, RotateCcw, Trash2, GitCommit, CheckCircle2, XCircle, Clock } from "lucide-react";

export default function DeploymentCenterPage() {
  const [deploying, setDeploying] = useState(false);

  const deployments = [
    { id: "dep_9012", status: "success", env: "Production", branch: "main", hash: "a1b2c3d", time: "2 hours ago", author: "Rajeev Kumar" },
    { id: "dep_9011", status: "success", env: "Staging", branch: "dev", hash: "f8e7d6c", time: "5 hours ago", author: "System" },
    { id: "dep_9010", status: "failed", env: "Production", branch: "main", hash: "9x8y7z6", time: "1 day ago", author: "Rajeev Kumar" },
    { id: "dep_9009", status: "success", env: "Production", branch: "main", hash: "1a2b3c4", time: "3 days ago", author: "Amit Singh" },
  ];

  const handleDeploy = () => {
    setDeploying(true);
    setTimeout(() => {
      setDeploying(false);
      alert("Deployment triggered successfully!");
    }, 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-fuchsia-500/20 p-3 rounded-xl">
            <Rocket className="w-6 h-6 text-fuchsia-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Deployment Center</h1>
            <p className="text-outline text-sm">Manage CI/CD pipelines, environments, and rollbacks.</p>
          </div>
        </div>
        <button 
          onClick={handleDeploy}
          disabled={deploying}
          className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          {deploying ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          {deploying ? "Deploying..." : "Trigger Deploy"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <h3 className="text-sm font-semibold text-outline uppercase tracking-wider mb-4">Production Environment</h3>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="font-bold text-on-background text-lg">Healthy</p>
              <p className="text-sm text-outline">Last deployed 2 hours ago</p>
            </div>
          </div>
          <p className="text-xs font-mono text-outline bg-surface-container p-2 rounded">Commit: a1b2c3d (main)</p>
        </div>
        
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
          <h3 className="text-sm font-semibold text-outline uppercase tracking-wider mb-4">Staging Environment</h3>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="font-bold text-on-background text-lg">Healthy</p>
              <p className="text-sm text-outline">Last deployed 5 hours ago</p>
            </div>
          </div>
          <p className="text-xs font-mono text-outline bg-surface-container p-2 rounded">Commit: f8e7d6c (dev)</p>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col justify-center gap-3">
          <button className="w-full py-2 bg-surface-container hover:bg-surface-container-highest text-on-background rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Restart Services
          </button>
          <button className="w-full py-2 bg-surface-container hover:bg-surface-container-highest text-on-background rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2">
            <Trash2 className="w-4 h-4" /> Clear Build Cache
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30">
          <h2 className="text-lg font-bold text-on-background">Deployment History</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Environment</th>
              <th className="p-4 font-semibold">Commit</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Time</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {deployments.map(dep => (
              <tr key={dep.id} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4">
                  {dep.status === "success" 
                    ? <span className="flex items-center gap-2 text-emerald-500 font-medium"><CheckCircle2 className="w-4 h-4"/> Success</span>
                    : <span className="flex items-center gap-2 text-rose-500 font-medium"><XCircle className="w-4 h-4"/> Failed</span>
                  }
                </td>
                <td className="p-4 font-medium text-on-background">{dep.env}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-outline">
                    <GitCommit className="w-4 h-4" />
                    <span className="font-mono">{dep.hash}</span>
                    <span className="bg-surface-container px-2 py-0.5 rounded text-xs">{dep.branch}</span>
                  </div>
                </td>
                <td className="p-4 text-on-surface-variant">{dep.author}</td>
                <td className="p-4 text-outline flex items-center gap-2"><Clock className="w-4 h-4"/> {dep.time}</td>
                <td className="p-4 text-right">
                  <button className="text-sky-500 hover:bg-sky-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors">
                    Rollback
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
