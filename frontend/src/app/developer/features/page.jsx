"use client";

import React, { useState } from "react";
import { ToggleRight, Wallet, MessageSquare, Map, Tag, Users, Zap, Search } from "lucide-react";

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState([
    { id: "ff_wallet", name: "In-App Wallet", desc: "Enable digital wallet for owner payouts", icon: Wallet, enabled: true },
    { id: "ff_chat", name: "Real-time Chat", desc: "Allow users and owners to chat directly", icon: MessageSquare, enabled: true },
    { id: "ff_tracking", name: "Live Fleet Tracking", desc: "Show GPS locations on map", icon: Map, enabled: false },
    { id: "ff_coupons", name: "Promo Codes", desc: "Enable discount coupon system at checkout", icon: Tag, enabled: true },
    { id: "ff_referral", name: "Referral Program", desc: "Reward users for inviting friends", icon: Users, enabled: false },
    { id: "ff_ai", name: "AI Support Bot", desc: "Enable AI assistant for customer support", icon: Zap, enabled: false },
  ]);

  const toggleFlag = (id) => {
    setFlags(flags.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-lime-500/20 p-3 rounded-xl border border-lime-500/30">
            <ToggleRight className="w-6 h-6 text-lime-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-on-background">Feature Flags</h1>
            <p className="text-outline text-sm">Gradually roll out or instantly disable system features.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search features..."
              className="w-full bg-surface-container text-on-background text-sm rounded-lg pl-9 pr-4 py-2 outline-none border border-outline-variant/50 focus:border-lime-500 transition-all"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {flags.map((flag) => (
            <div key={flag.id} className="p-6 border-b border-r border-outline-variant/30 hover:bg-surface-container-lowest/50 transition-colors flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2 rounded-lg ${flag.enabled ? 'bg-lime-500/20 text-lime-500' : 'bg-surface-container-highest text-outline'}`}>
                  <flag.icon className="w-5 h-5" />
                </div>
                
                <button 
                  onClick={() => toggleFlag(flag.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${flag.enabled ? 'bg-lime-500' : 'bg-surface-container-highest'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flag.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              
              <h3 className="font-bold text-on-background text-lg">{flag.name}</h3>
              <p className="text-sm text-outline mt-1 mb-4 flex-1">{flag.desc}</p>
              
              <div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs font-mono text-outline">
                <span>ID: {flag.id}</span>
                <span className={flag.enabled ? 'text-lime-500 font-bold' : ''}>{flag.enabled ? 'ACTIVE' : 'DISABLED'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
