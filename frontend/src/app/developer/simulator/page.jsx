"use client";

import React, { useState } from "react";
import { Fingerprint, User, Shield, Package, Crown, LogIn, ArrowRight } from "lucide-react";

export default function UserSimulatorPage() {
  const [loadingRole, setLoadingRole] = useState(null);

  const roles = [
    { id: "customer", name: "Standard User", desc: "Regular customer who rents equipment", icon: User, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "owner", name: "Equipment Owner", desc: "Provider of heavy machinery", icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "driver", name: "Verified Driver", desc: "Machine operator looking for jobs", icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "admin", name: "System Admin", desc: "Standard administrative access", icon: Crown, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const handleSimulate = (roleId) => {
    setLoadingRole(roleId);
    setTimeout(() => {
      setLoadingRole(null);
      alert(`Successfully authenticated as mock ${roleId}. (In a real app, this would set JWT tokens and redirect)`);
    }, 1000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-pink-500/20 p-3 rounded-xl border border-pink-500/30">
          <Fingerprint className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">User Simulator</h1>
          <p className="text-outline text-sm">Instantly impersonate different user roles for testing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {roles.map(role => (
          <div key={role.id} className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col h-[280px]">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${role.bg}`}>
              <role.icon className={`w-6 h-6 ${role.color}`} />
            </div>
            <h3 className="text-lg font-bold text-on-background">{role.name}</h3>
            <p className="text-sm text-outline mt-2 mb-6 flex-1">{role.desc}</p>
            
            <button 
              onClick={() => handleSimulate(role.id)}
              disabled={loadingRole !== null}
              className={`w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors ${
                loadingRole === role.id 
                  ? "bg-primary text-on-primary" 
                  : "bg-surface-container hover:bg-primary hover:text-on-primary text-on-background"
              }`}
            >
              {loadingRole === role.id ? "Authenticating..." : <><LogIn className="w-4 h-4" /> Login as {role.name}</>}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 mt-8">
        <h3 className="text-lg font-bold text-on-background mb-4">Custom Impersonation</h3>
        <p className="text-sm text-outline mb-4">Enter a specific User ID or Email to simulate a specific account.</p>
        
        <div className="flex gap-4 max-w-md">
          <input 
            type="text" 
            placeholder="User ID or Email"
            className="flex-1 bg-surface-container text-on-background rounded-lg px-4 py-2 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
            Simulate <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
