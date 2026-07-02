const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, '..', 'src', 'components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });

const files = {
  'OwnerCard.jsx': `
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export function OwnerCard({ owner }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={owner.photo} alt={owner.name} />
              <AvatarFallback>{owner.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{owner.name}</h3>
              <p className="text-sm text-muted-foreground font-medium">{owner.company}</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md mb-2">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{owner.rating}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Location</span>
              <div className="flex items-center text-sm font-medium">
                <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                {owner.location}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Inventory</span>
              <div className="flex items-center text-sm font-medium">
                <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                {owner.totalEquipment} Equipments
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
  `,
  'DriverCard.jsx': `
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Briefcase, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function DriverCard({ driver }) {
  const statusColor = driver.status === "Available" ? "bg-secondary text-secondary-foreground" : driver.status === "On Job" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground";
  
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/10">
                <AvatarImage src={driver.photo} alt={driver.name} />
                <AvatarFallback>{driver.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{driver.name}</h3>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{driver.rating}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline" className={statusColor}>
              {driver.status}
            </Badge>
          </div>
          
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Experience</span>
              <div className="flex items-center text-sm font-medium">
                <Briefcase className="h-4 w-4 mr-1 text-muted-foreground" />
                {driver.experience}
              </div>
            </div>
            {driver.assignedEquipment && (
              <div className="flex flex-col gap-1 items-end">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Assigned To</span>
                <div className="flex items-center text-sm font-medium">
                  <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                  {driver.assignedEquipment}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
  `,
  'BookingCard.jsx': `
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Truck } from "lucide-react";

export function BookingCard({ booking }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-secondary text-secondary-foreground';
      case 'Pending': return 'bg-accent text-accent-foreground';
      case 'In Progress': return 'bg-primary text-primary-foreground';
      case 'Cancelled': return 'bg-destructive text-destructive-foreground';
      case 'Completed': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{booking.equipmentName}</h3>
            <p className="text-sm text-muted-foreground">Booking ID: {booking.id}</p>
          </div>
          <Badge className={\`\${getStatusColor(booking.status)} uppercase tracking-wider text-xs\`}>
            {booking.status}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{booking.startDate} - {booking.endDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Truck className="h-4 w-4 text-primary" />
            <span className="text-primary">₹{booking.totalPrice.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex gap-2 justify-end border-t border-border pt-4">
          <Button variant="outline" size="sm">View Details</Button>
          {(booking.status === 'Confirmed' || booking.status === 'In Progress') && (
            <Button size="sm">Track</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
  `,
  'StatsCard.jsx': `
import { Card, CardContent } from "@/components/ui/card";

export function StatsCard({ title, value, icon: Icon, description, trend }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="p-2 bg-primary/10 text-primary rounded-full">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <h2 className="text-3xl font-bold">{value}</h2>
          {trend && (
            <span className={\`text-sm font-medium \${trend.startsWith('+') ? 'text-secondary' : 'text-destructive'}\`}>
              {trend}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
  `,
  'NotificationCard.jsx': `
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
          <span className="text-xs text-muted-foreground block mt-2">
            {new Date(notification.date).toLocaleString()}
          </span>
        </div>
        {!notification.read && <div className="h-2 w-2 bg-primary rounded-full mt-2" />}
      </CardContent>
    </Card>
  );
}
  `,
  'ReviewCard.jsx': `
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function ReviewCard({ review }) {
  return (
    <Card className="bg-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{review.userName.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{review.userName}</p>
            <p className="text-xs text-muted-foreground">{review.date}</p>
          </div>
        </div>
        <div className="flex gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={\`h-4 w-4 \${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}\`} />
          ))}
        </div>
        <p className="text-sm">{review.comment}</p>
      </CardContent>
    </Card>
  );
}
  `
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(componentsDir, filename), content.trim());
}

console.log('Components generated.');
