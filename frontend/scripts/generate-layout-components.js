const fs = require('fs');
const path = require('path');

const layoutDir = path.join(__dirname, '..', 'src', 'components', 'Layout');
if (!fs.existsSync(layoutDir)) fs.mkdirSync(layoutDir, { recursive: true });

const files = {
  'Navbar.jsx': `
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, Search, Menu } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

export function Navbar({ role }) {
  const { theme, setTheme } = useTheme();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur md:px-6">
      <div className="md:hidden flex items-center">
        <Button variant="ghost" size="icon" className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/" className="font-bold text-xl text-primary tracking-tight">GearRent</Link>
      </div>
      
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <div className="relative max-w-md hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search equipment, bookings..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <span className="sr-only">Toggle theme</span>
          {/* Theme icon could go here */}
          <div className="h-5 w-5 rounded-full border border-primary/20 bg-gradient-to-tr from-primary to-accent" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent"></span>
        </Button>
        <Avatar className="h-8 w-8 ml-2 border border-border">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
  `,
  'Sidebar.jsx': `
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Package, Users, FileText, Settings, Heart, MessageSquare, Briefcase, CreditCard, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sidebar({ role }) {
  const pathname = usePathname();
  
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
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-card hidden md:block">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl text-primary tracking-tight">
          <div className="h-8 w-8 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">G</div>
          GearRent
        </Link>
      </div>
      <div className="py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {role} Panel
          </h2>
          <nav className="flex flex-col gap-1">
            {items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-muted/50",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
  `,
  'BottomNav.jsx': `
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Package, Users, FileText, Settings, Heart, MessageSquare, Briefcase, CreditCard, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav({ role }) {
  const pathname = usePathname();
  
  const getNavItems = () => {
    switch(role) {
      case 'user':
        return [
          { name: 'Home', href: '/user', icon: Home },
          { name: 'Explore', href: '/user/nearby', icon: Compass },
          { name: 'Bookings', href: '/user/bookings', icon: FileText },
          { name: 'Saved', href: '/user/wishlist', icon: Heart },
          { name: 'Profile', href: '/user/profile', icon: Settings },
        ];
      case 'owner':
        return [
          { name: 'Home', href: '/owner', icon: Home },
          { name: 'Fleet', href: '/owner/equipment', icon: Package },
          { name: 'Drivers', href: '/owner/drivers', icon: Users },
          { name: 'Wallet', href: '/owner/wallet', icon: CreditCard },
          { name: 'Profile', href: '/owner/profile', icon: Settings },
        ];
      case 'driver':
        return [
          { name: 'Home', href: '/driver', icon: Home },
          { name: 'Jobs', href: '/driver/jobs', icon: Briefcase },
          { name: 'Income', href: '/driver/income', icon: CreditCard },
          { name: 'Profile', href: '/driver/profile', icon: Settings },
        ];
      case 'admin':
        return [
          { name: 'Home', href: '/admin', icon: Home },
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
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background pb-safe pt-1 md:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <nav className="flex justify-around items-center px-2 py-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1", isActive && "text-primary fill-primary/20")} />
              <span className="text-[10px] font-medium leading-none">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
  `
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(layoutDir, filename), content.trim());
}

console.log('Layout components generated.');
