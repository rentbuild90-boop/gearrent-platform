"use client";

import React from "react";
import { Users, RefreshCw, DollarSign, Flag, ChevronRight, HeadphonesIcon, UserCircle, Truck, ArrowRight, ArrowUp } from "lucide-react";
import statsData from "@/mock/stats.json";

export default function AdminDashboardPage() {
  const { admin } = statsData;

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Metrics Card: Total Users */}
      <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Total Users</h2>
          <Users className="w-5 h-5 text-outline" />
        </div>
        <div className="text-4xl font-bold text-primary">{(admin.activeUsers + admin.activeOwners + admin.activeDrivers).toLocaleString()}</div>
        <div className="grid grid-cols-3 gap-2 mt-auto pt-2 border-t border-surface-variant">
          <div>
            <div className="text-xs font-semibold text-outline mb-1">Renters</div>
            <div className="text-2xl font-semibold text-on-background">{admin.activeUsers}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-outline mb-1">Owners</div>
            <div className="text-2xl font-semibold text-on-background">{admin.activeOwners}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-outline mb-1">Drivers</div>
            <div className="text-2xl font-semibold text-on-background">{admin.activeDrivers}</div>
          </div>
        </div>
      </div>

      {/* Metrics Card: Active Rentals */}
      <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Active Rentals</h2>
          <RefreshCw className="w-5 h-5 text-secondary" />
        </div>
        <div className="text-4xl font-bold text-on-background">{admin.totalBookings.toLocaleString()}</div>
        <div className="mt-auto flex items-center gap-2">
          <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-semibold text-xs flex items-center gap-1">
            <ArrowUp className="w-3.5 h-3.5" /> 12%
          </span>
          <span className="text-base text-outline">vs last week</span>
        </div>
      </div>

      {/* Metrics Card: Revenue */}
      <div className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-xl p-6 shadow-sm relative overflow-hidden flex flex-col gap-4">
        {/* Decorative background blur */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl"></div>
        <div className="relative z-10 flex justify-between items-center">
          <h2 className="text-sm font-semibold text-on-primary/80 uppercase tracking-wider">Monthly Revenue</h2>
          <DollarSign className="w-5 h-5 text-on-primary/80" />
        </div>
        <div className="relative z-10 text-4xl font-bold">₹{(admin.totalRevenue / 100000).toFixed(1)}L</div>
        {/* Mini Bar Chart */}
        <div className="relative z-10 mt-auto flex items-end gap-2 h-12 pt-4 border-t border-white/20">
          <div className="w-full bg-white/30 h-[40%] rounded-t-sm"></div>
          <div className="w-full bg-white/40 h-[60%] rounded-t-sm"></div>
          <div className="w-full bg-white/50 h-[50%] rounded-t-sm"></div>
          <div className="w-full bg-white/60 h-[80%] rounded-t-sm"></div>
          <div className="w-full bg-white h-[100%] rounded-t-sm"></div>
          <div className="w-full bg-white/80 h-[90%] rounded-t-sm"></div>
        </div>
      </div>

      {/* Main Content: Map */}
      <div className="col-span-12 xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex flex-col overflow-hidden min-h-[400px]">
        <div className="p-6 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest z-10 relative">
          <h2 className="text-sm font-semibold text-on-background">Live Fleet Distribution</h2>
          <div className="flex gap-2">
            <span className="bg-surface-container text-on-surface font-semibold text-xs px-3 py-1 rounded-full border border-outline-variant/50">India</span>
            <span className="bg-surface text-outline font-semibold text-xs px-3 py-1 rounded-full border border-outline-variant/30 cursor-pointer hover:bg-surface-container">Global</span>
          </div>
        </div>
        <div className="flex-1 relative bg-surface-container-low">
          <img alt="Map" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqCFuUr7sLPHxLkAb_zusfWm9N4uRuvKDNEtXcATwYBQwbw5eIG6pC9MV_fTS-qUfczRICjtEJnbgrMq4bkXG4TPBqsLI6SJkRB5g8Okmn80T3O0fM5HK6-RSmqtRMdj6x48doP9nvkJRkOfF1ohwM3Xy5wF7zHkmZ_Pd9Cb7q6pS_OFMFvLKgwKAfwfCKNhiWSTZoIPrk7dHMUTaJK-mDMbLW0ojiXjsj7C7v232iVvGUfqF7Ujq0aM8u8pBnD2_WopP-TNbrY4"/>
          {/* Simulated Map Pins */}
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-primary rounded-full ring-4 ring-primary/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-secondary rounded-full ring-4 ring-secondary/20"></div>
          <div className="absolute top-1/4 left-2/3 w-3 h-3 bg-error rounded-full ring-4 ring-error/20"></div>
          <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-primary rounded-full"></div>
        </div>
      </div>

      {/* Side Panel: Alerts & Tickets */}
      <div className="col-span-12 xl:col-span-4 flex flex-col gap-6">
        
        {/* Flagged Items Alert */}
        <div className="bg-error-container/20 rounded-xl p-4 border border-error/20 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Flag className="w-5 h-5 text-error" />
            <h2 className="text-sm font-semibold text-on-error-container">Flagged Listings (3)</h2>
          </div>
          <div className="flex flex-col gap-2">
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-error/10 flex justify-between items-center cursor-pointer hover:bg-surface-container-low transition-colors">
              <div>
                <div className="text-sm font-semibold text-on-background">Excavator CAT 320 - Suspicious Price</div>
                <div className="text-base text-outline text-xs">User: ID-49201</div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </div>
            <div className="bg-surface-container-lowest p-2 rounded-lg border border-error/10 flex justify-between items-center cursor-pointer hover:bg-surface-container-low transition-colors">
              <div>
                <div className="text-sm font-semibold text-on-background">JCB Backhoe - Reported Broken</div>
                <div className="text-base text-outline text-xs">User: ID-88219</div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 flex-1 flex flex-col">
          <div className="p-4 border-b border-surface-variant flex justify-between items-center">
            <h2 className="text-sm font-semibold text-on-background">High Priority Tickets</h2>
            <span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full font-semibold text-xs">12 Open</span>
          </div>
          <div className="flex flex-col p-2">
            
            {/* Ticket Item */}
            <div className="p-2 flex gap-4 items-start hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                <HeadphonesIcon className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-semibold text-on-background">Insurance Claim #892</div>
                  <div className="text-xs font-semibold text-outline">10m</div>
                </div>
                <div className="text-base text-on-surface-variant text-sm line-clamp-1">Customer reporting damage to JCB during rental period.</div>
              </div>
            </div>

            {/* Ticket Item */}
            <div className="p-2 flex gap-4 items-start hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-semibold text-on-background">KYC Verification Failed</div>
                  <div className="text-xs font-semibold text-outline">1h</div>
                </div>
                <div className="text-base text-on-surface-variant text-sm line-clamp-1">Owner account blocked due to mismatched ID documents.</div>
              </div>
            </div>

            {/* Ticket Item */}
            <div className="p-2 flex gap-4 items-start hover:bg-surface-container-low rounded-lg cursor-pointer transition-colors">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-on-surface-variant" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-semibold text-on-background">Delayed Logistics</div>
                  <div className="text-xs font-semibold text-outline">3h</div>
                </div>
                <div className="text-base text-on-surface-variant text-sm line-clamp-1">Courier tracking stalled for heavy machine transport.</div>
              </div>
            </div>

          </div>
          <div className="mt-auto p-4 border-t border-surface-variant">
            <button className="w-full text-sm font-semibold text-primary flex items-center justify-center gap-1 hover:text-primary-container transition-colors">
              View All Tickets <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
