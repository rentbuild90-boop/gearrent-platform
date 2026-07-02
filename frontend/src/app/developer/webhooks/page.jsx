"use client";

import React, { useState } from "react";
import { Webhook, RefreshCcw, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function WebhooksPage() {
  const hooks = [
    { id: "evt_912", event: "payment.succeeded", status: "200 OK", time: "2 mins ago" },
    { id: "evt_911", event: "booking.created", status: "200 OK", time: "15 mins ago" },
    { id: "evt_910", event: "kyc.verified", status: "500 ERROR", time: "1 hour ago" },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 h-[calc(100vh-2rem)] flex flex-col">
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="bg-sky-500/20 p-3 rounded-xl border border-sky-500/30">
          <Webhook className="w-6 h-6 text-sky-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Webhook Tester</h1>
          <p className="text-outline text-sm">Monitor incoming webhooks from Stripe and Razorpay.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low flex justify-between items-center">
            <h2 className="text-sm font-bold text-on-background">Recent Events</h2>
            <button className="text-sky-500 hover:text-sky-400 p-1"><RefreshCcw className="w-4 h-4" /></button>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {hooks.map((hook, i) => (
              <div key={i} className={`p-4 rounded-lg cursor-pointer mb-2 border ${i === 0 ? 'bg-sky-500/10 border-sky-500/50' : 'bg-surface-container border-outline-variant/30 hover:bg-surface-container-highest'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-outline">{hook.id}</span>
                  <span className="text-[10px] text-outline">{hook.time}</span>
                </div>
                <div className="font-bold text-sm text-on-background">{hook.event}</div>
                <div className={`mt-2 text-xs font-bold flex items-center gap-1 ${hook.status.includes('200') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {hook.status.includes('200') ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />} {hook.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-[#0a0a0a] rounded-xl shadow-sm border border-slate-800 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-[#111] flex items-center justify-between">
            <div className="text-sm font-bold text-slate-300">Payload Data</div>
            <div className="text-xs text-sky-400 font-mono">POST /api/webhooks/stripe</div>
          </div>
          <div className="flex-1 overflow-auto p-6 font-mono text-sm space-y-6">
             <div>
              <p className="text-slate-500 mb-2">// Headers</p>
              <pre className="text-amber-300 bg-[#1a1a1a] p-4 rounded-lg">
{`{
  "stripe-signature": "t=1690000000,v1=abc123def456...",
  "content-type": "application/json"
}`}
              </pre>
             </div>
             <div>
              <p className="text-slate-500 mb-2">// Body</p>
              <pre className="text-emerald-400 bg-[#1a1a1a] p-4 rounded-lg">
{`{
  "id": "evt_912",
  "object": "event",
  "api_version": "2023-10-16",
  "created": 1690000000,
  "data": {
    "object": {
      "id": "pi_3MtwBwLkdIwHu7ix28a3tqPa",
      "object": "payment_intent",
      "amount": 450000,
      "currency": "inr",
      "status": "succeeded"
    }
  },
  "type": "payment_intent.succeeded"
}`}
              </pre>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
