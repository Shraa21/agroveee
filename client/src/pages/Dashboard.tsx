import { PageHeader } from "@/components/PageHeader";
import { useFarms } from "@/hooks/use-farms";
import { useAdvisories } from "@/hooks/use-advisories";
import { useActivities } from "@/hooks/use-activities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Tractor, Sprout, NotebookPen, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: farms, isLoading: loadingFarms } = useFarms();
  const { data: advisories } = useAdvisories();
  const { data: activities } = useActivities();

  // Simple stats calculation
  const totalFarms = farms?.length || 0;
  const totalArea = farms?.reduce((acc, farm) => acc + farm.size, 0) || 0;
  // This is a simplification; ideally backend provides aggregate stats
  const recentActivities = activities?.slice(0, 5) || [];
  const unreadAdvisories = advisories?.filter(a => !a.isRead).length || 0;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard" 
        description="Overview of your farming operations."
      />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard 
          title="Total Farms" 
          value={totalFarms} 
          icon={<Tractor className="w-6 h-6 text-primary" />}
          trend="+1 this month"
        />
        <StatsCard 
          title="Total Area" 
          value={`${totalArea.toFixed(1)} ac`} 
          icon={<Sprout className="w-6 h-6 text-green-600" />}
          trend="Across all farms"
        />
        <StatsCard 
          title="Activities" 
          value={activities?.length || 0} 
          icon={<NotebookPen className="w-6 h-6 text-accent" />}
          trend="Logged this season"
        />
        <StatsCard 
          title="Advisories" 
          value={unreadAdvisories} 
          icon={<AlertCircle className="w-6 h-6 text-blue-500" />}
          trend="Unread alerts"
          highlight={unreadAdvisories > 0}
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="h-full border-border/60 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-display">Recent Activities</CardTitle>
              <Link href="/activities" className="text-sm font-medium text-primary hover:underline flex items-center">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-6">
                  {recentActivities.map((activity, i) => (
                    <div key={activity.id} className="flex gap-4 relative">
                      {i !== recentActivities.length - 1 && (
                        <div className="absolute left-[19px] top-8 bottom-[-24px] w-px bg-border" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center shrink-0 border border-border z-10">
                        <NotebookPen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="pb-1">
                        <p className="font-medium text-foreground capitalize">{activity.type}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">{activity.notes || "No notes recorded."}</p>
                        <p className="text-xs text-muted-foreground mt-1">{format(new Date(activity.date), 'MMM d, yyyy')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No activities recorded yet.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Farms List */}
        <motion.div variants={item}>
          <Card className="h-full border-border/60 shadow-sm bg-gradient-to-b from-card to-secondary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-display">My Farms</CardTitle>
              <Link href="/farms" className="text-sm font-medium text-primary hover:underline flex items-center">
                Manage <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {farms && farms.length > 0 ? (
                <div className="space-y-3">
                  {farms.slice(0, 4).map((farm) => (
                    <Link key={farm.id} href={`/farms/${farm.id}`}>
                      <div className="group p-3 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{farm.name}</p>
                          <p className="text-xs text-muted-foreground">{farm.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{farm.size} {farm.sizeUnit}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground mb-4">You haven't added any farms yet.</p>
                  <Link href="/farms">
                    <button className="text-primary font-medium hover:underline">Register your first farm</button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, highlight }: any) {
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
      <Card className={`border-border/60 shadow-sm hover:shadow-md transition-all ${highlight ? 'border-blue-200 bg-blue-50/50' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-100' : 'bg-secondary'}`}>
              {icon}
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold font-display tracking-tight">{value}</h3>
            <p className="text-xs text-muted-foreground">{trend}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
