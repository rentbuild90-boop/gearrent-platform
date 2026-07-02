"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchWithCSRF } from "@/lib/api";
import { Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Fingerprint, GripHorizontal } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone' or 'email'
  const [loginOptions, setLoginOptions] = useState(null);
  
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkOptions = async (identifier) => {
    if (!identifier || identifier.length < 5) return;
    try {
      const res = await fetchWithCSRF(`/api/auth/login-options?identifier=${encodeURIComponent(identifier)}`);
      const data = await res.json();
      if (data.success) {
        setLoginOptions(data.data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const stored = localStorage.getItem("gearrent_identifier");
    if (stored) {
      if (stored.includes("@")) {
        setLoginMethod("email");
        setEmail(stored);
      } else {
        setPhone(stored);
      }
      checkOptions(stored);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (loginMethod === "email") {
        const res = await fetchWithCSRF("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.detail || data.message || "Login failed");
        } else {
          window.location.href = "/user"; // Redirect to dashboard
        }
      } else {
        // Phone login - send OTP
        const res = await fetchWithCSRF("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone, purpose: "LOGIN" }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setError(data.detail || data.message || "Failed to send OTP");
        } else {
          // Pass phone via sessionStorage or URL params (here just simple query param)
          window.location.href = `/auth/otp?phone=${encodeURIComponent(phone)}`;
        }
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Left Banner */}
      <div className="hidden md:flex md:w-1/2 bg-surface-container-lowest border-r border-outline-variant/30 flex-col justify-center items-center p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
        <div className="z-10 text-center max-w-md">
          <h1 className="text-4xl font-black bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent mb-6">
            GearRent
          </h1>
          <p className="text-on-background text-2xl font-bold mb-4">Welcome back!</p>
          <p className="text-outline text-lg">
            Sign in to access your dashboard, manage bookings, and track equipment.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-3xl font-bold text-on-background mb-2">Log in</h2>
            <p className="text-outline">Enter your credentials to continue</p>
          </div>

          <div className="flex bg-surface-container p-1 rounded-xl mb-6">
             <button 
               onClick={() => setLoginMethod('phone')}
               className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${loginMethod === 'phone' ? 'bg-surface-container-lowest shadow-sm text-on-background' : 'text-outline hover:text-on-background'}`}
             >
               Phone Number
             </button>
             <button 
               onClick={() => setLoginMethod('email')}
               className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${loginMethod === 'email' ? 'bg-surface-container-lowest shadow-sm text-on-background' : 'text-outline hover:text-on-background'}`}
             >
               Email Address
             </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4 mb-6" onSubmit={handleLogin}>
            {loginMethod === 'phone' ? (
              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Phone Number</label>
                <div className="flex bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <div className="flex items-center justify-center bg-surface-container-low px-3 border-r border-outline-variant/50">
                    <select className="bg-transparent text-on-background text-sm font-semibold outline-none cursor-pointer">
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+61">🇦🇺 +61</option>
                    </select>
                  </div>
                  <input 
                    type="tel" 
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={() => checkOptions(phone)}
                    required={loginMethod === "phone"}
                    className="w-full bg-transparent text-on-background px-4 py-3 outline-none"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => checkOptions(email)}
                    required={loginMethod === "email"}
                    className="w-full bg-surface-container-lowest text-on-background rounded-xl pl-10 pr-4 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-on-background">Password</label>
                <Link href="/auth/forgot-password" className="text-sm font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={loginMethod === "email"} // Only required for email login? Wait, does phone login require password here?
                  className="w-full bg-surface-container-lowest text-on-background rounded-xl pl-10 pr-12 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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

            <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-6 block text-center disabled:opacity-50">
              {loading ? "Please wait..." : loginMethod === "phone" ? "Send OTP" : "Sign In"} <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="relative flex items-center py-4 mb-6">
            <div className="flex-grow border-t border-outline-variant/50"></div>
            <span className="flex-shrink-0 mx-4 text-outline text-xs uppercase tracking-widest font-semibold">Or continue with</span>
            <div className="flex-grow border-t border-outline-variant/50"></div>
          </div>

          {loginOptions && (loginOptions.has_passkey || loginOptions.has_pin) && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              {loginOptions.has_passkey && (
               <Link href="/auth/passkey" className="flex flex-col items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-highest p-4 rounded-xl transition-colors border border-outline-variant/30 text-on-background font-semibold text-sm">
                 <Fingerprint className="w-6 h-6 text-primary" />
                 Passkey
               </Link>
              )}
              {loginOptions.has_pin && (
               <Link href={`/auth/pin?identifier=${encodeURIComponent(loginMethod === 'phone' ? phone : email)}`} className="flex flex-col items-center justify-center gap-2 bg-surface-container hover:bg-surface-container-highest p-4 rounded-xl transition-colors border border-outline-variant/30 text-on-background font-semibold text-sm">
                 <GripHorizontal className="w-6 h-6 text-emerald-500" />
                 Quick PIN
               </Link>
              )}
            </div>
          )}

          <button className="w-full flex items-center justify-center gap-3 bg-surface-container-lowest hover:bg-surface-container p-3 rounded-xl transition-colors border border-outline-variant/50 text-on-background font-bold mb-8">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <p className="text-center text-outline text-sm">
            Don't have an account? <Link href="/auth/register" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
