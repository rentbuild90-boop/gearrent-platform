"use client";

import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Bell, Search, Settings, User, LogOut, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { fetchWithCSRF } from "@/lib/api";

export function Navbar({ role }) {
  const { theme, setTheme } = useTheme();
  const { scrollY } = useScroll();
  const router = useRouter();
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  // Fetch profile and notifications
  useEffect(() => {
    fetchWithCSRF("/api/user/profile")
      .then((r) => r.json())
      .then((d) => { if (d?.success) setProfile(d.data); })
      .catch(() => {});

    fetchWithCSRF("/api/notifications")
      .then((r) => r.json())
      .then((d) => { if (d?.success && d.data) setNotifications(d.data.slice(0, 5)); })
      .catch(() => {});
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  const handleLogout = async () => {
    try {
      await fetchWithCSRF("/api/auth/logout", { method: "POST" });
    } catch (_) {}
    toast.success("Logged out successfully");
    router.push("/auth/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/user/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setSearchOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const displayName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : "User";
  const displayInitial = profile?.first_name?.charAt(0)?.toUpperCase() || "U";
  const displayEmail = profile?.email || "";

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 z-[1000] flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-lg md:px-6 shadow-sm"
    >
      {/* Logo */}
      <div className="flex items-center shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="h-8 w-auto object-contain rounded-sm" />
          <span className="font-semibold text-sm tracking-wide text-foreground hidden sm:block">GEAR RENT</span>
        </Link>
      </div>

      {/* Desktop search */}
      <form onSubmit={handleSearch} className="w-full flex-1 md:w-auto md:flex-none ml-4">
        <div className="relative max-w-md hidden md:block group">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment, bookings..."
            className="w-full rounded-full border border-input bg-muted/50 pl-10 pr-4 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 md:gap-2 ml-auto">
        {/* Mobile search toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          onClick={() => setSearchOpen((v) => !v)}
        >
          {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <span className="sr-only">Toggle theme</span>
          {mounted && theme === "dark" ? (
            <Sun className="h-5 w-5 text-amber-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
          )}
        </Button>

        {/* Notifications dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "relative rounded-full" })}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
            ) : (
              <>
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-3 cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      <span className={`font-medium text-sm ${!n.is_read ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 pl-4">{n.message}</p>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="justify-center text-primary text-sm cursor-pointer">
                  <Link href="/user/notifications">View all notifications</Link>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "relative h-9 w-9 rounded-full ml-1 p-0 border border-border" })}>
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{displayInitial}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{displayName}</p>
                  <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${role}/profile`)}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${role}/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive/10 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile search bar (slide-down) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-16 left-0 right-0 p-3 bg-background/95 backdrop-blur border-b border-border shadow-md z-[1000] md:hidden"
          >
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchRef}
                autoFocus
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search equipment, bookings..."
                className="w-full rounded-full border border-input bg-muted/50 pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}