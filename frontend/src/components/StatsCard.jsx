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
            <span className={`text-sm font-medium ${trend.startsWith('+') ? 'text-secondary' : 'text-destructive'}`}>
              {trend}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}