import { PageHeader } from "@/components/PageHeader";
import { useActivities } from "@/hooks/use-activities";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, NotebookPen } from "lucide-react";

export default function Activities() {
  const { data: activities, isLoading } = useActivities();

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Activity Log" 
        description="History of all farming operations."
      />

      <div className="space-y-4 max-w-4xl">
        {activities && activities.length > 0 ? (
          activities.map((activity) => (
            <Card key={activity.id} className="overflow-hidden">
              <div className="flex items-stretch">
                <div className="w-2 bg-primary shrink-0" />
                <CardContent className="p-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <StatusBadge type={activity.type} />
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(activity.date), "MMMM d, yyyy")}
                        </span>
                      </div>
                      <p className="font-medium text-lg">{activity.notes || "Activity Logged"}</p>
                      {activity.details && Object.keys(activity.details as object).length > 0 && (
                        <div className="mt-2 text-sm bg-secondary/30 p-2 rounded-md inline-block">
                           <pre className="font-sans text-xs">{JSON.stringify(activity.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No activities found. Start logging your work!
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ type }: { type: string }) {
  const colorMap: Record<string, string> = {
    sowing: "bg-green-100 text-green-700",
    harvesting: "bg-amber-100 text-amber-700",
    irrigation: "bg-blue-100 text-blue-700",
    fertilization: "bg-purple-100 text-purple-700",
    scouting: "bg-gray-100 text-gray-700",
  };

  return (
    <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${colorMap[type.toLowerCase()] || "bg-gray-100 text-gray-800"}`}>
      {type}
    </span>
  );
}
