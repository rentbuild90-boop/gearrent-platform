"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fetchWithCSRF } from "@/lib/api";
import { Mail, Lock, Code2, Terminal, ArrowRight, ShieldAlert, ChevronRight } from "lucide-react";

export default function DeveloperLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchWithCSRF("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.detail || data.message || "Authentication failed");
      } else {
        window.location.href = "/developer"; // Redirect to developer dashboard
      }
    } catch (err) {
      setError("Failed to establish connection to secure gateway.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-[#a9b1d6] font-sans flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Matrix/Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
      
      {/* Ambient Neon Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        {/* Terminal Window Wrapper */}
        <div className="bg-[#0f1423] rounded-2xl border border-emerald-500/20 shadow-2xl shadow-emerald-950/20 overflow-hidden">
          {/* Terminal Title Bar */}
          <div className="bg-[#0b0e1a] px-6 py-4 border-b border-emerald-500/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <span className="text-xs text-outline font-mono ml-2">secure_gateway_login.sh</span>
            </div>
            <div className="bg-emerald-500/10 px-2 py-0.5 rounded text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-bold border border-emerald-500/20">
              <Code2 className="w-3 h-3" /> DEV_MODE
            </div>
          </div>

          {/* Terminal Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Logo and Greeting */}
            <div className="text-center">
              <div className="inline-flex bg-emerald-500/10 p-4 rounded-full border border-emerald-500/20 mb-4 shadow-inner shadow-emerald-500/10">
                <Terminal className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Developer Console Access</h1>
              <p className="text-outline text-sm font-mono">Authenticate to establish secure session.</p>
            </div>

            {/* Error Message Box */}
            {error && (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-red-950/30 border border-red-500/20 rounded-xl p-4 flex gap-3 text-red-400 text-sm font-mono"
              >
                <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-red-300">SYSTEM_ERROR:</span> {error}
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    placeholder="dev@gearrent.internal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#080b13] text-white rounded-xl pl-12 pr-4 py-3.5 outline-none border border-emerald-500/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">Security Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-outline absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#080b13] text-white rounded-xl pl-12 pr-4 py-3.5 outline-none border border-emerald-500/10 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all font-mono placeholder:text-slate-700"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 mt-6 shadow-lg shadow-emerald-500/10 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Authenticating..." : (
                  <>
                    Initialize Connection <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Footer / Links */}
            <div className="pt-4 border-t border-emerald-500/10 flex items-center justify-between text-xs font-mono text-outline">
              <Link href="/auth/role" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3 rotate-180" /> Back to Accounts
              </Link>
              <span>Node: localhost:3000</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
