"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWithCSRF } from "@/lib/api";
import { ArrowLeft, Loader2, GripHorizontal, AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function PinLoginPage() {
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // If identifier is passed in the URL (from the login page)
    const urlId = searchParams.get("identifier");
    if (urlId) {
      setIdentifier(urlId);
    } else {
      // If not in URL, check local storage (remembered device)
      const stored = localStorage.getItem("gearrent_identifier");
      if (stored) {
        setIdentifier(stored);
      }
    }
  }, [searchParams]);

  const handlePinLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      
      if (!identifier) {
        throw new Error("Please enter your phone number or email first.");
      }

      if (!pin || pin.length < 4) {
        throw new Error("Please enter a valid PIN.");
      }
      
      const res = await fetchWithCSRF("/api/auth/pin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, pin })
      });
      
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("gearrent_identifier", identifier);
        window.location.href = "/user";
      } else {
        throw new Error(data.detail || "Invalid PIN or account locked");
      }
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container rounded-2xl p-8 border border-outline-variant/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-emerald-500/10 rounded-full">
            <GripHorizontal className="w-12 h-12 text-emerald-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Login with Quick PIN</h2>
        <p className="text-muted-foreground mb-8 text-center">
          Enter your registered 4-6 digit Quick PIN
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handlePinLogin} className="space-y-4">
          {!searchParams.get("identifier") && !localStorage.getItem("gearrent_identifier") && (
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Email or Phone</label>
              <input 
                type="text"
                placeholder="name@example.com or 9876543210"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full bg-surface-container-lowest text-on-background rounded-xl px-4 py-3 outline-none border border-outline-variant/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-on-background mb-2">Quick PIN</label>
            <input 
              type="password"
              placeholder="••••"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required
              className="w-full bg-surface-container-lowest text-on-background rounded-xl px-4 py-3 outline-none border border-outline-variant/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-center tracking-widest text-2xl font-bold"
            />
          </div>

          <button 
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login"}
          </button>
        </form>
        
        <Link 
          href="/auth/login"
          className="w-full bg-surface-container-highest hover:bg-surface-container-highest/80 text-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to other login methods
        </Link>
      </div>
    </div>
  );
}
