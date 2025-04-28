import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";

export function MarketCardSkeleton() {
  return (
    <Card className="flex flex-col bg-card-bg border-card-border rounded-lg">
      <div className="animate-pulse">
        <CardHeader>
          <Badge
            variant="secondary"
            className="mb-2 bg-progress-background h-4 w-full"
          />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-progress-background rounded-full" />
            <CardTitle className="bg-progress-background h-6 w-1/3" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="bg-progress-background h-4 w-1/4" />
              <span className="bg-progress-background h-4 w-1/4" />
            </div>
            <Progress
              value={0}
              className="h-2 bg-progress-background [&>*]:bg-progress-background"
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
