"use client";

import React from "react";
import { DollarSign, ArrowUpRight, Activity } from "lucide-react";

export default function PaymentsStatsPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/20 p-3 rounded-xl">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-on-background">Payment Statistics</h1>
          <p className="text-outline text-sm">Financial overview of the GearRent platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Gross Volume</h2>
            <DollarSign className="w-5 h-5 text-outline" />
          </div>
          <div className="text-4xl font-bold text-on-background">₹1.2Cr</div>
          <p className="text-xs text-green-500 font-semibold flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> +8% vs last month</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Platform Revenue</h2>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className="text-4xl font-bold text-primary">₹18L</div>
          <p className="text-xs text-green-500 font-semibold flex items-center"><ArrowUpRight className="w-3 h-3 mr-1"/> +12% vs last month</p>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Pending Payouts</h2>
            <DollarSign className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-4xl font-bold text-on-background">₹4.5L</div>
          <p className="text-xs text-outline font-semibold">Across 42 owners</p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-outline/50 mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium">Detailed Revenue Charts Placeholder</p>
          <p className="text-outline text-sm">Integrate with Chart.js or Recharts to visualize transaction history over time.</p>
        </div>
      </div>
    </div>
  );
}
