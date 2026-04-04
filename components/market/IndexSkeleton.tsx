import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function IndexSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-1">
        <div className="h-4 w-24 rounded bg-muted animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="h-7 w-32 rounded bg-muted animate-pulse mb-2" />
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
      </CardContent>
    </Card>
  );
}
