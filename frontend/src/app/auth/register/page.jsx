"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, Lock, Phone, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Upload, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchWithCSRF } from "@/lib/api";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form State
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // OTP State
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRef = useRef(null);

  // Focus effect for OTP
  useEffect(() => {
    if (step === 2) {
      inputRef.current?.focus();
    }
  }, [activeOTPIndex, step]);

  // Timer effect for OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  // --- Handlers ---
  const handleNextStep1 = async (e) => {
    e.preventDefault();
    setError("");
    if (phone.length > 5) {
      try {
        const response = await fetchWithCSRF("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone, purpose: "REGISTER" })
        });
        
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          setError(data.detail || data.message || "Failed to send OTP");
          return;
        }
        
        setStep(2);
        setTimer(59);
      } catch (err) {
        console.error("Error sending OTP", err);
        setError("Network error while sending OTP");
      }
    }
  };

  const handleOnChangeOTP = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1);
    setOtp(newOTP);

    if (value && index < 5) setActiveOTPIndex(index + 1);
    
    // Auto submit if all filled
    if (value && index === 5 && newOTP.every(v => v !== "")) {
      verifyOTP(newOTP.join(""));
    }
  };

  const handleOnKeyDownOTP = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOTP = [...otp];
      if (otp[index]) {
        newOTP[index] = "";
        setOtp(newOTP);
      } else if (index > 0) {
        newOTP[index - 1] = "";
        setOtp(newOTP);
        setActiveOTPIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveOTPIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveOTPIndex(index + 1);
    }
  };

  const verifyOTP = async (codeOverride = null) => {
    setIsVerifying(true);
    setError("");
    try {
      const code = codeOverride || otp.join("");
      
      const nameParts = name.trim().split(" ");
      const first_name = nameParts[0] || "";
      const last_name = nameParts.slice(1).join(" ") || "";

      const response = await fetchWithCSRF("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          first_name, 
          last_name, 
          email, 
          phone, 
          password, 
          otp: code 
        })
      });
      
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.detail || data.message || "Registration failed");
        setIsVerifying(false);
        return;
      }
      
      setIsVerifying(false);
      setStep(3); // Go to Profile Step
    } catch (err) {
      console.error("Error registering user", err);
      setError("Network error while registering");
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    if (timer === 0) {
      setTimer(59);
      try {
        await fetchWithCSRF("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone, purpose: "REGISTER" })
        });
      } catch (err) {
        console.error("Error resending OTP", err);
      }
    }
  };

  const handleComplete = (e) => {
    e.preventDefault();
    window.location.href = "/auth/role"; // Redirect to Role selection or Dashboard after completion
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-surface-container-highest">
          <div 
            className="h-full bg-gradient-to-r from-primary to-sky-400 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent mb-2">
            GearRent
          </h1>
          {step === 1 && <h2 className="text-xl font-bold text-on-background mb-1">Create an account</h2>}
          {step === 2 && <h2 className="text-xl font-bold text-on-background mb-1">Verify Phone</h2>}
          {step === 3 && <h2 className="text-xl font-bold text-on-background mb-1">Complete Profile</h2>}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <motion.form 
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleNextStep1}
              className="space-y-4 mb-6"
            >
              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-surface-container text-on-background rounded-xl pl-10 pr-4 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Phone Number</label>
                <div className="flex bg-surface-container rounded-xl overflow-hidden border border-outline-variant/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
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
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full bg-transparent text-on-background px-4 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-surface-container text-on-background rounded-xl pl-10 pr-4 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full bg-surface-container text-on-background rounded-xl pl-10 pr-12 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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

              <div className="pt-2">
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors block text-center shadow-md shadow-primary/20">
                  Verify Phone Number <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              <p className="text-center text-outline text-sm pt-4">
                Already have an account? <Link href="/auth/login" className="text-primary font-bold hover:underline">Log in</Link>
              </p>
            </motion.form>
          )}

          {/* STEP 2: OTP Inline */}
          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 flex flex-col items-center"
            >
              <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <p className="text-on-background font-semibold mb-1">Enter 6-digit code</p>
              <p className="text-outline text-sm mb-6 text-center">We sent a security code to <span className="font-bold text-on-background">{phone}</span></p>

              <div className="flex justify-center gap-2 mb-8">
                {otp.map((_, index) => (
                  <input
                    key={index}
                    ref={index === activeOTPIndex ? inputRef : null}
                    type="text"
                    className="w-10 h-12 sm:w-12 sm:h-14 bg-surface-container text-on-background text-xl font-bold text-center rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    onChange={(e) => handleOnChangeOTP(e, index)}
                    onKeyDown={(e) => handleOnKeyDownOTP(e, index)}
                    value={otp[index]}
                    disabled={isVerifying}
                  />
                ))}
              </div>

              <button 
                onClick={verifyOTP}
                disabled={isVerifying || otp.some(v => v === "")}
                className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-6 disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "Confirm OTP"}
              </button>

              <div className="text-center text-sm font-medium">
                <button 
                  onClick={resendOTP}
                  disabled={timer > 0}
                  className={`transition-colors ${timer > 0 ? 'text-outline/50 cursor-not-allowed' : 'text-primary hover:underline'}`}
                >
                  {timer > 0 ? `Resend Code in 00:${timer.toString().padStart(2, '0')}` : "Resend Code Now"}
                </button>
                <div className="mt-4">
                  <button onClick={() => setStep(1)} className="text-outline hover:text-on-background text-xs underline">Change phone number</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Profile Setup */}
          {step === 3 && (
            <motion.form 
              key="step3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleComplete}
              className="space-y-6 mb-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant text-outline relative cursor-pointer hover:border-primary hover:text-primary transition-colors group overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-primary mt-3 cursor-pointer">Upload Photo (Optional)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Location / City</label>
                <input 
                  type="text" 
                  placeholder="e.g. New York, NY"
                  className="w-full bg-surface-container text-on-background rounded-xl px-4 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-on-background mb-2">Short Bio</label>
                <textarea 
                  rows="3"
                  placeholder="Tell us a bit about yourself..."
                  className="w-full bg-surface-container text-on-background rounded-xl px-4 py-3 outline-none border border-outline-variant/50 focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none text-sm"
                ></textarea>
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors block text-center shadow-md shadow-primary/20">
                  <CheckCircle2 className="w-5 h-5" /> Complete Registration
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

