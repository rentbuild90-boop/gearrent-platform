"use client";

import React, { useState } from "react";
import { Map, Navigation, Truck, UserCircle, Search, Filter } from "lucide-react";

export default function LiveTrackingPage() {
  const [activeTab, setActiveTab] = useState("all");

  const activeVehicles = [
    { id: "V-8291", type: "Excavator", status: "In Transit", driver: "Rajeev Kumar", location: "Mumbai, MH", eta: "45 mins" },
    { id: "V-9102", type: "JCB Backhoe", status: "Working", driver: "Suresh P.", location: "Pune, MH", eta: "N/A" },
    { id: "V-4412", type: "Crane", status: "Idle", driver: "Amit Singh", location: "Thane, MH", eta: "N/A" },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar List */}
      <div className="w-[350px] bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col z-10 shadow-lg">
        <div className="p-6 border-b border-outline-variant/30">
          <h1 className="text-xl font-bold text-on-background mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" /> Live Fleet
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search vehicles or drivers..."
              className="w-full bg-surface-container text-on-background border border-outline/30 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div className="flex border-b border-outline-variant/30 px-2">
          <button 
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-outline'}`}
          >All</button>
          <button 
            onClick={() => setActiveTab("transit")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'transit' ? 'border-primary text-primary' : 'border-transparent text-outline'}`}
          >In Transit</button>
          <button 
            onClick={() => setActiveTab("working")}
            className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeTab === 'working' ? 'border-primary text-primary' : 'border-transparent text-outline'}`}
          >Working</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg p-4 hover:border-primary/50 cursor-pointer transition-colors shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-sm text-on-background">{vehicle.id} • {vehicle.type}</div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                  vehicle.status === 'In Transit' ? 'bg-primary/20 text-primary' : 
                  vehicle.status === 'Working' ? 'bg-green-500/20 text-green-600' : 'bg-outline-variant text-outline'
                }`}>{vehicle.status}</span>
              </div>
              <div className="text-xs text-on-surface-variant flex items-center gap-2 mb-1">
                <UserCircle className="w-3.5 h-3.5" /> Driver: {vehicle.driver}
              </div>
              <div className="text-xs text-outline flex items-center gap-2">
                <Map className="w-3.5 h-3.5" /> {vehicle.location} {vehicle.eta !== 'N/A' && `• ETA: ${vehicle.eta}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative bg-surface-container-low">
        {/* We use an image as a placeholder for a real map component (like Google Maps or Mapbox) */}
        <img 
          alt="Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyqCFuUr7sLPHxLkAb_zusfWm9N4uRuvKDNEtXcATwYBQwbw5eIG6pC9MV_fTS-qUfczRICjtEJnbgrMq4bkXG4TPBqsLI6SJkRB5g8Okmn80T3O0fM5HK6-RSmqtRMdj6x48doP9nvkJRkOfF1ohwM3Xy5wF7zHkmZ_Pd9Cb7q6pS_OFMFvLKgwKAfwfCKNhiWSTZoIPrk7dHMUTaJK-mDMbLW0ojiXjsj7C7v232iVvGUfqF7Ujq0aM8u8pBnD2_WopP-TNbrY4"
        />
        
        <div className="absolute top-4 right-4 bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant/30 flex p-1">
          <button className="p-2 text-on-surface hover:bg-surface-container transition-colors rounded"><Filter className="w-5 h-5"/></button>
        </div>

        {/* Vehicle Pins */}
        <div className="absolute top-1/3 left-1/3 group cursor-pointer">
          <div className="w-8 h-8 bg-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-surface-container-lowest shadow-xl border border-outline-variant/30 rounded-lg p-3 w-48 hidden group-hover:block z-20">
            <div className="text-xs font-bold text-on-background mb-1">V-8291 • In Transit</div>
            <div className="text-[10px] text-outline">Speed: 45 km/h</div>
            <div className="text-[10px] text-outline">Heading to Site B</div>
          </div>
        </div>

        <div className="absolute top-1/2 left-2/3 group cursor-pointer">
          <div className="w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10">
            <Truck className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
