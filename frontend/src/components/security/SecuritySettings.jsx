"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Shield, Fingerprint, GripHorizontal, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { fetchWithCSRF } from "@/lib/api";
import { startRegistration } from "@simplewebauthn/browser";

export function SecuritySettings() {
  const [status, setStatus] = useState({ has_passkey: false, has_pin: false, passkeys: [] });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState("");
  const [pinMode, setPinMode] = useState("setup"); // 'setup', 'change'
  const [oldPin, setOldPin] = useState("");

  const loadStatus = async () => {
    try {
      setLoading(true);
      const res = await fetchWithCSRF("/api/auth/security-status");
      const data = await res.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (err) {
      setError("Failed to load security status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleRegisterPasskey = async () => {
    try {
      setActionLoading(true);
      setError("");
      setSuccess("");
      
      const res = await fetchWithCSRF("/api/auth/passkey/register-challenge", { method: "POST" });
      const challengeData = await res.json();
      
      if (!challengeData.success) {
        throw new Error(challengeData.detail || "Failed to get registration challenge");
      }
      
      const attResp = await startRegistration({ optionsJSON: challengeData.data.options });
      
      const verifyRes = await fetchWithCSRF("/api/auth/passkey/register-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: attResp })
      });
      
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setSuccess("Passkey registered successfully!");
        loadStatus();
      } else {
        throw new Error(verifyData.detail || "Failed to verify passkey");
      }
    } catch (err) {
      setError(err.message || "An error occurred during passkey registration");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSetupPin = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      setError("");
      
      const endpoint = pinMode === "setup" ? "/api/auth/pin/setup" : "/api/auth/pin/change";
      const body = pinMode === "setup" ? { pin } : { old_pin: oldPin, new_pin: pin };
      
      const res = await fetchWithCSRF(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(`Quick PIN ${pinMode === 'setup' ? 'configured' : 'changed'} successfully!`);
        setShowPinSetup(false);
        setPin("");
        setOldPin("");
        loadStatus();
      } else {
        throw new Error(data.detail || "Failed to setup PIN");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisablePin = async () => {
    try {
      setActionLoading(true);
      const res = await fetchWithCSRF("/api/auth/pin/disable", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSuccess("Quick PIN disabled");
        loadStatus();
      }
    } catch (err) {
      setError("Failed to disable PIN");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full">

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 font-medium flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 font-medium flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p>{success}</p>
        </div>
      )}

      <div className="space-y-6">
        <Card className="border-outline-variant/30 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Fingerprint className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Passkey</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Sign in safely with your fingerprint, face, or screen lock.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container rounded-xl">
              <div>
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  Status: 
                  {status.has_passkey 
                    ? <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-xs">Enabled</span>
                    : <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded text-xs">Disabled</span>
                  }
                </h4>
                {status.has_passkey && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {status.passkeys.length} passkey(s) registered
                  </p>
                )}
              </div>
              <button 
                onClick={handleRegisterPasskey}
                disabled={actionLoading}
                className="mt-4 sm:mt-0 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {actionLoading ? "Processing..." : "Add New Passkey"}
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-outline-variant/30 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                <GripHorizontal className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-xl">Quick PIN</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Use a 4-6 digit PIN for quick access to your account.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!showPinSetup ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container rounded-xl">
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    Status: 
                    {status.has_pin 
                      ? <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-xs">Enabled</span>
                      : <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded text-xs">Disabled</span>
                    }
                  </h4>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  {status.has_pin ? (
                    <>
                      <button 
                        onClick={() => { setPinMode("change"); setShowPinSetup(true); }}
                        className="px-4 py-2 bg-surface-container-highest border border-outline-variant/50 text-foreground rounded-lg font-semibold hover:bg-surface-container-highest/80 transition-colors"
                      >
                        Change PIN
                      </button>
                      <button 
                        onClick={handleDisablePin}
                        disabled={actionLoading}
                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        Disable
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => { setPinMode("setup"); setShowPinSetup(true); }}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      Create PIN
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-surface-container rounded-xl border border-outline-variant/30">
                <h4 className="font-bold text-lg mb-4">{pinMode === "setup" ? "Create Quick PIN" : "Change Quick PIN"}</h4>
                <form onSubmit={handleSetupPin} className="space-y-4 max-w-sm">
                  {pinMode === "change" && (
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-muted-foreground">Current PIN</label>
                      <input 
                        type="password" 
                        maxLength={6}
                        required
                        value={oldPin}
                        onChange={(e) => setOldPin(e.target.value)}
                        className="w-full bg-surface-container-lowest text-foreground rounded-lg px-4 py-2 border border-outline-variant/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        placeholder="Enter current PIN"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold mb-1 text-muted-foreground">New PIN (4-6 digits)</label>
                    <input 
                      type="password" 
                      maxLength={6}
                      required
                      pattern="\d{4,6}"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full bg-surface-container-lowest text-foreground rounded-lg px-4 py-2 border border-outline-variant/50 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                      placeholder="Enter new PIN"
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowPinSetup(false)}
                      className="flex-1 px-4 py-2 bg-surface-container-highest border border-outline-variant/50 text-foreground rounded-lg font-semibold hover:bg-surface-container-highest/80 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={actionLoading || pin.length < 4}
                      className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? "Saving..." : "Save PIN"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
