"use client";

import React, { useState } from "react";
import { Send, Search } from "lucide-react";

export default function AllocatePaymentsPage() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleAllocate = (e) => {
    e.preventDefault();
    alert(`Successfully allocated ₹${amount} to ${recipient} for: ${reason}`);
    setRecipient("");
    setAmount("");
    setReason("");
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/20 p-3 rounded-xl">
          <Send className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Allocate Payments</h1>
          <p className="text-outline text-sm">Manually allocate funds to an Owner or Driver for bonuses, settlements, or disputes.</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30">
        <form onSubmit={handleAllocate} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-on-background mb-2">Recipient (User ID or Email)</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
              <input 
                type="text" 
                required
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Search for an Owner or Driver..."
                className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-background mb-2">Amount (₹)</label>
            <input 
              type="number" 
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 5000"
              className="w-full md:w-1/3 bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-background mb-2">Reason for Allocation</label>
            <textarea 
              required
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why these funds are being manually allocated..."
              className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
            ></textarea>
          </div>
          
          <div className="pt-6 border-t border-outline-variant/30 flex justify-end">
            <button 
              type="submit"
              className="bg-primary text-on-primary px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              <Send className="w-4 h-4" /> Process Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
