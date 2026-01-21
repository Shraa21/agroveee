import { PageHeader } from "@/components/PageHeader";
import { CreateFarmDialog } from "@/components/CreateFarmDialog";
import { useFarms } from "@/hooks/use-farms";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function FarmsList() {
  const { data: farms, isLoading, error } = useFarms();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Error loading farms. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Farms" 
        description="Manage your registered farms and fields."
        action={<CreateFarmDialog />}
      />

      {farms && farms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm, index) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/farms/${farm.id}`}>
                <Card className="group h-full cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-300 overflow-hidden">
                  <div className="h-32 bg-secondary/30 relative overflow-hidden">
                    {/* Placeholder pattern or image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                       <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-2xl">
                          🏡
                       </div>
                    </div>
                  </div>
                  <CardHeader className="pt-4 pb-2">
                    <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">
                      {farm.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {farm.location}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm py-2 border-t border-border/50 mt-2">
                      <span className="text-muted-foreground">Total Size</span>
                      <span className="font-medium bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">
                        {farm.size} {farm.sizeUnit}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-secondary/10 py-3 text-sm font-medium text-primary flex justify-between items-center group-hover:bg-primary/5 transition-colors">
                    View Details
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl bg-secondary/5">
          <h3 className="text-xl font-semibold mb-2">No farms yet</h3>
          <p className="text-muted-foreground mb-6">Register your first farm to get started.</p>
          <CreateFarmDialog />
        </div>
      )}
    </div>
  );
}
