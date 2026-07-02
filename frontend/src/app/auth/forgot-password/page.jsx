"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Lock, Eye, EyeOff, ArrowRight, ShieldAlert } from "lucide-react";
import { fetchWithCSRF } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithCSRF("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.detail || data.message || "Failed to send recovery code");
        setLoading(false);
        return;
      }
      setLoading(false);
      setStep(2);
    } catch (err) {
      console.error("Error sending OTP", err);
      setError("Network error while sending recovery code");
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetchWithCSRF("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.detail || data.message || "Failed to reset password");
        setLoading(false);
        return;
      }
      setLoading(false);
      alert("Password successfully reset!");
      window.location.href = "/auth/login";
    } catch (err) {
      console.error("Error resetting password", err);
      setError("Network error while resetting password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-lg relative overflow-hidden">
        <Link href="/auth/login" className="absolute top-6 left-6 text-outline hover:text-on-background transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <div className="text-center mt-6 mb-8">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-on-background mb-2">Reset Password</h1>
          <p className="text-outline text-sm">
            {step === 1 ? "Enter your email address to receive a recovery code." : "Enter the code and set your new password."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Registered Email Address</label>
              <div className="flex bg-surface-container rounded-xl overflow-hidden border border-outline-variant/50 focus-within:border-rose-500 focus-within:ring-1 focus-within:ring-rose-500 transition-all">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-transparent text-on-background px-4 py-3 outline-none"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-on-background hover:bg-on-background/90 text-background py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Recovery Code"} <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">Recovery Code (6 digits)</label>
              <input 
                type="text" 
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full bg-surface-container text-on-background text-center tracking-widest text-xl font-bold rounded-xl px-4 py-3 outline-none border border-outline-variant/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-on-background mb-2">New Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full bg-surface-container text-on-background rounded-xl pl-10 pr-12 py-3 outline-none border border-outline-variant/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-background transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

