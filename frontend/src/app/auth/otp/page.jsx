"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { fetchWithCSRF } from "@/lib/api";

function OTPForm() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [activeOTPIndex, setActiveOTPIndex] = useState(0);
  const [timer, setTimer] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [activeOTPIndex]);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOnChange = (e, index) => {
    const { value } = e.target;
    if (!/^[0-9]*$/.test(value)) return;

    const newOTP = [...otp];
    newOTP[index] = value.substring(value.length - 1);
    setOtp(newOTP);

    if (value && index < 5) {
      setActiveOTPIndex(index + 1);
    }
    
    // Auto submit if all filled
    if (value && index === 5 && newOTP.every(v => v !== "")) {
      verifyOTP(newOTP.join(''));
    }
  };

  const handleOnKeyDown = (e, index) => {
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

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, 6).split("");
    if (pastedData.length === 0 || !/^[0-9]+$/.test(pastedData.join(''))) return;
    
    const newOTP = [...otp];
    pastedData.forEach((val, i) => {
      newOTP[i] = val;
    });
    setOtp(newOTP);
    setActiveOTPIndex(Math.min(pastedData.length, 5));
    
    if (pastedData.length === 6) {
      verifyOTP(pastedData.join(''));
    }
  };

  const verifyOTP = async (code) => {
    setIsVerifying(true);
    setError("");
    try {
      const response = await fetchWithCSRF("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ phone, code, purpose: "LOGIN" })
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        setError(data.detail || data.message || "Invalid OTP");
        setIsVerifying(false);
      } else {
        setIsVerifying(false);
        setIsVerified(true);
      }
    } catch (err) {
      console.error("Error verifying OTP", err);
      setError("Network error while verifying OTP");
      setIsVerifying(false);
    }
  };

  const resendOTP = async () => {
    if (timer === 0 && phone) {
      setTimer(59);
      try {
        await fetchWithCSRF("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ phone, purpose: "LOGIN" })
        });
      } catch (err) {
        console.error("Error resending OTP", err);
      }
    }
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-surface-container-lowest p-12 rounded-3xl border border-outline-variant/30 shadow-lg text-center"
        >
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-on-background mb-2">Verified Successfully!</h2>
          <p className="text-outline mb-8">Your identity has been confirmed.</p>
          <Link href="/user" className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Go to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-lg relative overflow-hidden">
        <Link href="/auth/login" className="absolute top-6 left-6 text-outline hover:text-on-background transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        
        <div className="text-center mt-6 mb-8">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-on-background mb-2">Check your phone</h1>
          <p className="text-outline text-sm">We've sent a 6-digit security code to {phone ? <span className="font-bold">{phone}</span> : "your registered mobile number"}.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center gap-2 sm:gap-3 mb-8">
          {otp.map((_, index) => (
            <input
              key={index}
              ref={index === activeOTPIndex ? inputRef : null}
              type="text"
              className="w-12 h-14 sm:w-14 sm:h-16 bg-surface-container text-on-background text-2xl font-bold text-center rounded-xl border border-outline-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              onChange={(e) => handleOnChange(e, index)}
              onKeyDown={(e) => handleOnKeyDown(e, index)}
              onPaste={handlePaste}
              value={otp[index]}
              disabled={isVerifying}
            />
          ))}
        </div>

        <button 
          onClick={() => verifyOTP(otp.join(''))}
          disabled={isVerifying || otp.some(v => v === "")}
          className="w-full bg-primary hover:bg-primary/90 text-on-primary py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mb-6 disabled:opacity-50"
        >
          {isVerifying ? "Verifying code..." : "Verify Code"}
        </button>

        <div className="text-center text-sm font-medium">
          <p className="text-outline mb-2">Didn't receive the code?</p>
          <button 
            onClick={resendOTP}
            disabled={timer > 0}
            className={`transition-colors ${timer > 0 ? 'text-outline/50 cursor-not-allowed' : 'text-primary hover:underline'}`}
          >
            {timer > 0 ? `Resend Code in 00:${timer.toString().padStart(2, '0')}` : "Resend Code Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <OTPForm />
    </Suspense>
  );
}

