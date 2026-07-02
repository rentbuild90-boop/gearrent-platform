
import { Card, CardContent } from "@/components/ui/card";

export default function MyRatingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold mb-6">My Ratings</h1>
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <p>This is the My Ratings page. UI components will be rendered here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
