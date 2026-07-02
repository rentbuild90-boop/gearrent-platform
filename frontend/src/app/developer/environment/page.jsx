"use client";

import React, { useState } from "react";
import { Box, Eye, EyeOff, Plus, Save, Trash2, Key } from "lucide-react";

export default function EnvironmentVariablesPage() {
  const [showValues, setShowValues] = useState({});

  const toggleShow = (key) => {
    setShowValues(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const groups = [
    {
      title: "Database Configuration",
      vars: [
        { key: "DATABASE_URL", value: "mongodb+srv://admin:****************@cluster0.mongodb.net/gearrent", isSecret: true },
        { key: "REDIS_HOST", value: "redis.internal.gearrent.com", isSecret: false },
        { key: "REDIS_PORT", value: "6379", isSecret: false },
      ]
    },
    {
      title: "Third-Party Services",
      vars: [
        { key: "STRIPE_SECRET_KEY", value: "sk_live_51M****************************************", isSecret: true },
        { key: "STRIPE_WEBHOOK_SECRET", value: "whsec_******************************", isSecret: true },
        { key: "AWS_ACCESS_KEY_ID", value: "AKIAIOSFODNN7EXAMPLE", isSecret: false },
        { key: "AWS_SECRET_ACCESS_KEY", value: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY", isSecret: true },
      ]
    },
    {
      title: "Application Settings",
      vars: [
        { key: "NODE_ENV", value: "production", isSecret: false },
        { key: "JWT_SECRET", value: "c8f2b3e8a4d791c53e8a4d791c5c8f2b", isSecret: true },
        { key: "FRONTEND_URL", value: "https://gearrent.com", isSecret: false },
      ]
    }
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/20 p-3 rounded-xl border border-teal-500/30">
            <Box className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Environment Variables</h1>
            <p className="text-outline text-sm">Manage configuration secrets and system environment settings.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-surface-container hover:bg-surface-container-highest text-on-background px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors border border-outline-variant/50">
            <Plus className="w-4 h-4" /> Add Variable
          </button>
          <button className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group, idx) => (
          <div key={idx} className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/30 bg-surface-container-lowest">
              <h2 className="text-sm font-bold text-on-background">{group.title}</h2>
            </div>
            <div className="p-4 space-y-4">
              {group.vars.map((v, i) => (
                <div key={i} className="flex gap-4 items-start md:items-center flex-col md:flex-row">
                  <div className="w-full md:w-1/3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-surface-container rounded-lg border border-outline-variant/30 font-mono text-sm text-on-background">
                      <Key className="w-4 h-4 text-outline" /> {v.key}
                    </div>
                  </div>
                  <div className="flex-1 w-full relative">
                    <input 
                      type={v.isSecret && !showValues[v.key] ? "password" : "text"}
                      defaultValue={v.value}
                      className="w-full bg-surface-container text-on-background text-sm font-mono rounded-lg pl-4 pr-12 py-2 outline-none border border-outline-variant/50 focus:border-teal-500 transition-all"
                    />
                    {v.isSecret && (
                      <button 
                        onClick={() => toggleShow(v.key)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-background transition-colors"
                      >
                        {showValues[v.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <button className="text-outline hover:text-rose-500 p-2 transition-colors hidden md:block">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
