"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Settings, Calendar, Package, Truck, LayoutDashboard, DollarSign, Users, Map, Tags } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inventory", href: "/admin/equipment", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Pricing", href: "/admin/pricing", icon: DollarSign },
    { name: "Roles", href: "/admin/roles", icon: Users },
    { name: "Payments Stats", href: "/admin/payments/stats", icon: DollarSign },
    { name: "Allocate Payments", href: "/admin/payments/allocate", icon: DollarSign },
    { name: "Live Tracking", href: "/admin/tracking", icon: Map },
    { name: "Logistics", href: "/admin/logistics", icon: Truck },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <nav className="h-screen w-[280px] fixed left-0 top-0 border-r border-slate-800 shadow-2xl flex flex-col py-6 bg-slate-900 z-50 hidden md:flex">
      <div className="text-white font-extrabold text-2xl px-6 py-8 flex-shrink-0">
        GearRent Admin
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto pb-4">
        <div className="px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Main</div>
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className={`py-3 px-6 flex items-center gap-3 font-medium cursor-pointer transition-colors duration-200 flex-shrink-0 ${
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border-l-4 border-indigo-500" 
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800 border-l-4 border-transparent"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
      <div className="mt-auto px-6 pt-6 border-t border-slate-800 flex items-center gap-4 flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden">
          <img alt="Alex Rivers Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8PlOKtcTU_jHV_tXf6KprSnT5LKZjyLCx2Awn8HHAln_k28MtGvZsbiE08_ydpumipWTNu5UKNu6HxeKC9svRDuQLc9ZOHlJVdexcKLAoD1DejKXxwz3XjCGFX38u9PYGKONx0XL2Qg5jooFZrtM4RrkRag4gZa6eCBdVmwGe3yCE8e-7JDC1FDuq3togxdItS_5stgWMRVMH-wNjpcwStFD9LatXVZYhQXucArTEQF4V2d0jwR7ywToaJfSn5xsp5QK3gXk2MM8"/>
        </div>
        <div>
          <div className="text-sm font-medium text-slate-200">Alex Rivers</div>
          <div className="text-xs text-slate-500">Asset Manager</div>
        </div>
      </div>
    </nav>
  );
}
