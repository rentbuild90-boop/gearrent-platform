"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { fetchWithCSRF } from "@/lib/api";
import { ShieldAlert, Fingerprint, GripHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupPrompt() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSecurityStatus = async () => {
      try {
        const res = await fetchWithCSRF("/api/auth/security-status");
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            // Show prompt if neither is enabled and user hasn't dismissed it
            const dismissed = sessionStorage.getItem("dismiss_security_prompt"); // use session storage so it pops up once per session if not set up
            if (!data.data.has_passkey && !data.data.has_pin && dismissed !== "true") {
              setShow(true);
            }
          }
        }
      } catch (err) {
        console.error("Error checking security status", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSecurityStatus();
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem("dismiss_security_prompt", "true");
    setShow(false);
  };

  if (loading || !show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-surface-container border border-outline-variant/30 rounded-2xl p-8 w-full max-w-md relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-sky-400 to-emerald-400"></div>
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-highest transition-colors text-outline"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center mt-2">
            <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
              <ShieldAlert className="w-10 h-10" />
            </div>
            
            <h3 className="text-2xl font-bold text-on-background mb-2">Faster Login</h3>
            <p className="text-outline text-sm mb-8">
              Enable Passkey or Quick PIN to sign in without typing passwords or waiting for OTPs ever again.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
              <Link 
                href="/user/profile?tab=security"
                onClick={handleDismiss}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-5 py-3 rounded-xl font-bold transition-colors w-full"
              >
                <Fingerprint className="w-5 h-5" />
                Enable Passkey
              </Link>
              <Link 
                href="/user/profile?tab=security"
                onClick={handleDismiss}
                className="flex items-center justify-center gap-2 bg-surface-container-highest hover:bg-surface-container-highest/80 text-on-background px-5 py-3 rounded-xl font-bold border border-outline-variant/50 transition-colors w-full"
              >
                <GripHorizontal className="w-5 h-5 text-emerald-500" />
                Create Quick PIN
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
