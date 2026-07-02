"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Package, Users, FileText, Settings, Heart, MessageSquare, Briefcase, CreditCard, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function BottomNav({ role }) {
  const pathname = usePathname();
  
  const getNavItems = () => {
    switch(role) {
      case 'user':
        return [
          { name: 'Home', href: '/user', icon: Home, exact: true },
          { name: 'Explore', href: '/user/nearby', icon: Compass },
          { name: 'Bookings', href: '/user/bookings', icon: FileText },
          { name: 'Saved', href: '/user/wishlist', icon: Heart },
          { name: 'Profile', href: '/user/settings', icon: Settings },
        ];
      case 'owner':
        return [
          { name: 'Home', href: '/owner', icon: Home, exact: true },
          { name: 'Fleet', href: '/owner/equipment', icon: Package },
          { name: 'Drivers', href: '/owner/drivers', icon: Users },
          { name: 'Wallet', href: '/owner/wallet', icon: CreditCard },
          { name: 'Settings', href: '/owner/settings', icon: Settings },
        ];
      case 'driver':
        return [
          { name: 'Home', href: '/driver', icon: Home, exact: true },
          { name: 'Jobs', href: '/driver/jobs', icon: Briefcase },
          { name: 'Income', href: '/driver/income', icon: CreditCard },
          { name: 'Settings', href: '/driver/profile', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Home', href: '/admin', icon: Home, exact: true },
          { name: 'Users', href: '/admin/users', icon: Users },
          { name: 'Fleet', href: '/admin/equipment', icon: Package },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      default:
        return [];
    }
  };
  
  const items = getNavItems();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-border bg-background/90 backdrop-blur-lg pb-safe pt-2 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <nav className="flex justify-around items-center px-2 py-1">
        {items.map((item) => {
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);
            
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center p-2 rounded-xl transition-colors duration-300 w-16",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-primary/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <item.icon className={cn("h-[22px] w-[22px] mb-1 transition-all duration-300", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium leading-none">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}