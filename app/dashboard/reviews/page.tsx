"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getReviews } from "@/module/review/actions";
import { formatDistanceToNow } from "date-fns";

export default function ReviewsPage() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      return await getReviews();
    },
  });
  if(isLoading) {
    return <div>Loading reviews...</div>;
  }
  return (
    <div className="space-y-4">
        <div>
        <h1 className="text-2xl font-bold">Review History</h1>
        <p className="text-muted-foreground">Here you can see your review history.</p>
    </div>
    {
        reviews?.length === 0 ? (
            <Card>
            <CardContent className="flex flex-col items-center justify-center space-y-2 py-10">
                <div className="flex flex-col items-center justify-center space-y-2 py-10">
                    <p className="text-muted-foreground">No reviews found.</p>
                </div>
            </CardContent>
            </Card>
        ) : (
            <div className="grid gap-4">
  {reviews?.map((review) => (
    <Card
      key={review.id}
      className="hover:shadow-md transition-shadow"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {review.prTitle}
              </CardTitle>

              {review.status === "completed" && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </Badge>
              )}

              {review.status === "failed" && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  Failed
                </Badge>
              )}
              {
                review.status === "pending" && (
                  <Badge variant="secondary" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Pending
                  </Badge>
                )
              } 
            </div>
            <CardDescription>
  {review.repository.fullName} PR #{review.prNumber}
</CardDescription>
</div>

<Button
  variant="ghost"
  size="icon"
  render={
    <a
      href={review.prUrl}
      target="_blank"
      rel="noopener noreferrer"
    />
  }
>
  <ExternalLink className="h-4 w-4" />
</Button>
</div>
</CardHeader>

<CardContent>
  <div className="space-y-4">
    <div className="text-sm text-muted-foreground">
      {formatDistanceToNow(new Date(review.createdAt), {
        addSuffix: true,
      })}
    </div>

    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div className="bg-muted p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-xs">
          {review.review.substring(0, 300)}...
        </pre>
      </div>
    </div>

<Button
  variant="outline"
  render={
    <a
      href={review.prUrl}
      target="_blank"
      rel="noopener noreferrer"
    />
  }
>
  View Full Review on GitHub
</Button>
  </div>
</CardContent>
</Card>
))}
</div>
        )
    }
    </div>
  )
}