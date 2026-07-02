"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Package, Users, FileText, Settings, Heart, MessageSquare, Briefcase, CreditCard, PieChart, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { fetchWithCSRF } from "@/lib/api";

export function Sidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchWithCSRF("/api/user/profile")
      .then((r) => r.json())
      .then((d) => { if (d?.success) setProfile(d.data); })
      .catch(() => {});
  }, []);
  
  const getNavItems = () => {
    switch(role) {
      case 'user':
        return [
          { name: 'Dashboard', href: '/user', icon: Home },
          { name: 'Nearby', href: '/user/nearby', icon: Compass },
          { name: 'Bookings', href: '/user/bookings', icon: FileText },
          { name: 'Wishlist', href: '/user/wishlist', icon: Heart },
          { name: 'Messages', href: '/user/chat', icon: MessageSquare },
          { name: 'Settings', href: '/user/settings', icon: Settings },
        ];
      case 'owner':
        return [
          { name: 'Dashboard', href: '/owner', icon: Home },
          { name: 'Equipment', href: '/owner/equipment', icon: Package },
          { name: 'Bookings', href: '/owner/bookings', icon: FileText },
          { name: 'Drivers', href: '/owner/drivers', icon: Users },
          { name: 'Wallet', href: '/owner/wallet', icon: CreditCard },
          { name: 'Analytics', href: '/owner/analytics', icon: PieChart },
          { name: 'Settings', href: '/owner/settings', icon: Settings },
        ];
      case 'driver':
        return [
          { name: 'Dashboard', href: '/driver', icon: Home },
          { name: 'Jobs', href: '/driver/jobs', icon: Briefcase },
          { name: 'History', href: '/driver/history', icon: FileText },
          { name: 'Income', href: '/driver/income', icon: CreditCard },
          { name: 'Profile', href: '/driver/profile', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin', icon: Home },
          { name: 'Users', href: '/admin/users', icon: Users },
          { name: 'Equipment', href: '/admin/equipment', icon: Package },
          { name: 'Bookings', href: '/admin/bookings', icon: FileText },
          { name: 'Reports', href: '/admin/reports', icon: PieChart },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };
  
  const items = getNavItems();
  
  return (
    <motion.aside 
      initial={{ width: 256 }}
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "fixed inset-y-0 left-0 z-[1000] border-r hidden md:flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)]",
        role === 'admin' 
          ? "bg-slate-950 text-slate-50 border-slate-800 dark:shadow-[4px_0_24px_-12px_rgba(255,255,255,0.05)]" 
          : "bg-background/80 backdrop-blur-xl border-border/50 text-foreground dark:shadow-[4px_0_24px_-12px_rgba(255,255,255,0.05)]"
      )}
    >
      <div className="flex h-16 shrink-0 items-center border-b border-border/50 px-6 relative">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain rounded-sm shrink-0" />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className={cn(
                "font-semibold text-sm tracking-wide whitespace-nowrap",
                role === 'admin' ? "text-slate-50" : "text-foreground"
              )}
            >
              GEAR RENT
            </motion.span>
          )}
        </Link>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute -right-4 top-4 h-8 w-8 rounded-full border border-border bg-background shadow-sm hover:bg-muted z-50 hidden lg:flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
        <div className="px-3">
          {!isCollapsed && (
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 px-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70"
            >
              {role} Portal
            </motion.h2>
          )}
          
          <nav className="flex flex-col gap-1.5 relative">
            {items.map((item) => {
              const isRootItem = item.href === `/${role}`;
              const isActive = isRootItem 
                ? pathname === item.href 
                : (pathname === item.href || pathname.startsWith(item.href + '/'));
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    isActive ? "text-primary" : (role === 'admin' ? "text-slate-400 hover:text-slate-50" : "text-muted-foreground hover:text-foreground"),
                    isCollapsed ? "justify-center" : "gap-3"
                  )}
                  title={isCollapsed ? item.name : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-bg"
                      className="absolute inset-0 rounded-xl bg-primary/10 dark:bg-primary/20 border border-primary/20"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <item.icon className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200 relative z-10",
                    isActive ? "text-primary" : (role === 'admin' ? "text-slate-400 group-hover:scale-110" : "text-muted-foreground group-hover:scale-110"),
                    !isActive && (role === 'admin' ? "group-hover:text-slate-50" : "group-hover:text-foreground")
                  )} />
                  
                  {!isCollapsed && (
                    <span className="relative z-10 whitespace-nowrap">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      
      {/* Profile summary at bottom */}
      {!isCollapsed && (
        <div className={cn("p-4 border-t shrink-0", role === 'admin' ? "border-slate-800" : "border-border/50")}>
          <div
            className={cn(
              "flex items-center gap-3 p-2 rounded-xl transition-colors cursor-pointer",
              role === 'admin' ? "hover:bg-slate-800/50" : "hover:bg-muted/50"
            )}
            onClick={() => router.push(`/${role}/profile`)}
          >
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
              {profile?.first_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className={cn("text-sm font-medium truncate", role === 'admin' ? "text-slate-50" : "")}>
                {profile ? `${profile.first_name} ${profile.last_name}` : "User"}
              </p>
              <p className={cn("text-xs truncate capitalize", role === 'admin' ? "text-slate-400" : "text-muted-foreground")}>
                {profile?.email || `${role} account`}
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.aside>
  );
}