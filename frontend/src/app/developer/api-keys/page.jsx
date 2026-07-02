"use client";

import React, { useState } from "react";
import { Key, Eye, EyeOff, Copy, RefreshCw, CheckCircle2 } from "lucide-react";

export default function ApiKeysManagerPage() {
  const [showKeys, setShowKeys] = useState({});

  const toggleShow = (id) => setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));

  const copyToClipboard = (id) => {
    alert("Copied to clipboard!");
  };

  const keys = [
    { id: "key_google_maps", name: "Google Maps API", key: "AIzaSyD-1234567890abcdefghijklmnopqrstuvw", status: "Active", lastUsed: "2 mins ago" },
    { id: "key_twilio", name: "Twilio SMS", key: "SK1234567890abcdefghijklmnopqrstuvw", status: "Active", lastUsed: "15 mins ago" },
    { id: "key_aws", name: "AWS S3 Access", key: "AKIAIOSFODNN7EXAMPLE", status: "Active", lastUsed: "1 hour ago" },
    { id: "key_sendgrid", name: "SendGrid SMTP", key: "SG.1234567890abcdefghijklmnopqrstuvw", status: "Revoked", lastUsed: "30 days ago" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/30">
            <Key className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">API Keys</h1>
            <p className="text-outline text-sm">Manage integration keys for external services.</p>
          </div>
        </div>
        <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors">
          Generate New Key
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low text-outline text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold">Service Name</th>
              <th className="p-4 font-semibold">API Key</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Last Used</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {keys.map((k) => (
              <tr key={k.id} className="border-b border-outline-variant/30 hover:bg-surface-container/30">
                <td className="p-4 font-bold text-on-background">{k.name}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2 max-w-[200px] md:max-w-sm">
                    <input 
                      type={showKeys[k.id] ? "text" : "password"}
                      value={k.key}
                      readOnly
                      className="bg-transparent border-none outline-none font-mono text-on-surface-variant w-full"
                    />
                    <button onClick={() => toggleShow(k.id)} className="text-outline hover:text-on-background">
                      {showKeys[k.id] ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                    <button onClick={() => copyToClipboard(k.id)} className="text-outline hover:text-on-background">
                      <Copy className="w-4 h-4"/>
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  {k.status === 'Active' ? (
                    <span className="bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded text-xs font-bold uppercase flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="bg-rose-500/10 text-rose-500 px-2 py-1 rounded text-xs font-bold uppercase w-max">
                      Revoked
                    </span>
                  )}
                </td>
                <td className="p-4 text-outline">{k.lastUsed}</td>
                <td className="p-4 text-right space-x-2">
                  <button className="text-sky-500 hover:bg-sky-500/10 px-3 py-1.5 rounded text-xs font-semibold transition-colors inline-flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Rotate
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
