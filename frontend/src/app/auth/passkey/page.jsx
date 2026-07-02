"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWithCSRF } from "@/lib/api";
import { startAuthentication } from "@simplewebauthn/browser";
import { Fingerprint, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function PasskeyLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePasskeyLogin = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetchWithCSRF("/api/auth/passkey/authenticate-challenge", { method: "POST" });
      const challengeData = await res.json();
      
      if (!challengeData.success) {
        throw new Error(challengeData.detail || "Failed to get authentication challenge");
      }
      
      const authResp = await startAuthentication({ optionsJSON: challengeData.data.options });
      
      const verifyRes = await fetchWithCSRF("/api/auth/passkey/authenticate-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: authResp })
      });
      
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        window.location.href = "/user";
      } else {
        throw new Error(verifyData.detail || "Passkey login failed");
      }
    } catch (err) {
      setError(err.message || "An error occurred during passkey login. Have you registered a passkey on this device?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Automatically trigger passkey prompt on load
    handlePasskeyLogin();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface-container rounded-2xl p-8 border border-outline-variant/30 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-primary/10 rounded-full">
            <Fingerprint className="w-12 h-12 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-foreground mb-2">Sign in with Passkey</h2>
        <p className="text-muted-foreground mb-8">
          Use your device's fingerprint, face scan, or screen lock to sign in securely.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-medium flex items-center gap-3 text-left">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button 
            onClick={handlePasskeyLogin}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Try Again"}
          </button>
          
          <Link 
            href="/auth/login"
            className="w-full bg-surface-container-highest hover:bg-surface-container-highest/80 text-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to other login methods
          </Link>
        </div>
      </div>
    </div>
  );
}
