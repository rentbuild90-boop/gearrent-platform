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
            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
          ))}
        </div>
        <p className="text-sm">{review.comment}</p>
      </CardContent>
    </Card>
  );
}