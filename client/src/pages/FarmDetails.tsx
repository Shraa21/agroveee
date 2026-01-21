import { useRoute } from "wouter";
import { useFarm } from "@/hooks/use-farms";
import { useFields, useCreateField } from "@/hooks/use-fields";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFieldSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, Plus, MapPin, Ruler, Sprout, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

const fieldFormSchema = insertFieldSchema.omit({ farmId: true }).extend({
  area: z.coerce.number().min(0.1),
});

function CreateFieldDialog({ farmId }: { farmId: number }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createField, isPending } = useCreateField();
  
  const form = useForm({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: { name: "", soilType: "", area: 0 },
  });

  const onSubmit = async (values: any) => {
    await createField({ farmId, ...values });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="shadow-md">
          <Plus className="w-4 h-4 mr-2" /> Add Field
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Field Name</Label>
            <Input {...form.register("name")} placeholder="North Field" />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Soil Type</Label>
            <Input {...form.register("soilType")} placeholder="Loamy, Sandy..." />
            {form.formState.errors.soilType && <p className="text-xs text-destructive">{form.formState.errors.soilType.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Area (acres)</Label>
            <Input type="number" step="0.1" {...form.register("area")} />
            {form.formState.errors.area && <p className="text-xs text-destructive">{form.formState.errors.area.message}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Add Field"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FarmDetails() {
  const [, params] = useRoute("/farms/:id");
  const farmId = parseInt(params?.id || "0");
  const { data: farm, isLoading: loadingFarm } = useFarm(farmId);
  const { data: fields, isLoading: loadingFields } = useFields(farmId);

  if (loadingFarm || loadingFields) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!farm) return <div>Farm not found</div>;

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <Link href="/farms" className="text-sm text-muted-foreground hover:text-primary mb-2 inline-block">← Back to Farms</Link>
        <PageHeader 
          title={farm.name} 
          description="Farm Overview"
          action={<CreateFieldDialog farmId={farm.id} />}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-semibold">{farm.location}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              <Ruler className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Size</p>
              <p className="font-semibold">{farm.size} {farm.sizeUnit}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fields</p>
              <p className="font-semibold">{fields?.length || 0} active</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold mb-4">Fields</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fields?.map((field, idx) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={`/fields/${field.id}`}>
                <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      {field.name}
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Soil Type</span>
                        <span className="font-medium">{field.soilType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Area</span>
                        <span className="font-medium">{field.area} acres</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
