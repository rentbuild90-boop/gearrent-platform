import { Card, CardContent } from "@/components/ui/card";
import { Bell, CreditCard, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function NotificationCard({ notification }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'payment': return <CreditCard className="h-5 w-5 text-secondary" />;
      case 'booking': return <CalendarCheck className="h-5 w-5 text-primary" />;
      default: return <Bell className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <Card className={cn("mb-3 border-border transition-colors hover:bg-muted/50", notification.read ? "bg-card" : "bg-primary/5")}>
      <CardContent className="p-4 flex gap-4 items-start">
        <div className="mt-1">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold">{notification.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
          <span className="text-xs text-muted-foreground block mt-2" suppressHydrationWarning>
            {new Date(notification.date).toLocaleString()}
          </span>
        </div>
        {!notification.read && <div className="h-2 w-2 bg-primary rounded-full mt-2" />}
      </CardContent>
    </Card>
  );
}