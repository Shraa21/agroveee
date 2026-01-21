import { useRoute } from "wouter";
import { useField } from "@/hooks/use-fields";
import { useCrops, useCreateCrop } from "@/hooks/use-crops";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCropSchema } from "@shared/schema";
import { z } from "zod";
import { Loader2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { AddActivityDialog } from "@/components/AddActivityDialog";
import { format } from "date-fns";

const cropFormSchema = insertCropSchema.omit({ fieldId: true }).extend({
  sowingDate: z.coerce.date(),
  expectedHarvestDate: z.coerce.date().optional(),
});

function CreateCropDialog({ fieldId }: { fieldId: number }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createCrop, isPending } = useCreateCrop();
  
  const form = useForm({
    resolver: zodResolver(cropFormSchema),
    defaultValues: { name: "", variety: "", sowingDate: new Date(), status: "active" },
  });

  const onSubmit = async (values: any) => {
    await createCrop({ fieldId, ...values });
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Crop
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Crop Cycle</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Crop Name</Label>
            <Input {...form.register("name")} placeholder="Wheat, Corn..." />
            {form.formState.errors.name && <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Variety</Label>
            <Input {...form.register("variety")} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Sowing Date</Label>
            <Input type="date" {...form.register("sowingDate")} />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Adding..." : "Add Crop"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function FieldDetails() {
  const [, params] = useRoute("/fields/:id");
  const fieldId = parseInt(params?.id || "0");
  const { data: field, isLoading: loadingField } = useField(fieldId);
  const { data: crops, isLoading: loadingCrops } = useCrops(fieldId);

  if (loadingField || loadingCrops) return <div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>;
  if (!field) return <div>Field not found</div>;

  return (
    <div className="space-y-8">
      <div>
        <Link href={`/farms/${field.farmId}`} className="text-sm text-muted-foreground hover:text-primary mb-2 inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Farm
        </Link>
        <PageHeader 
          title={field.name} 
          description={`${field.soilType} soil • ${field.area} acres`}
          action={
            <div className="flex gap-2">
              <AddActivityDialog fieldId={fieldId} />
              <CreateCropDialog fieldId={fieldId} />
            </div>
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold font-display mb-4">Current Crops</h3>
          {crops && crops.length > 0 ? (
            <div className="space-y-4">
              {crops.map((crop) => (
                <Card key={crop.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{crop.name}</CardTitle>
                      <StatusBadge status={crop.status} />
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-1 text-muted-foreground">
                    <p>Variety: {crop.variety || "N/A"}</p>
                    <p>Sowed: {format(new Date(crop.sowingDate), 'MMM d, yyyy')}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-xl bg-secondary/10">
              <p className="text-muted-foreground">No crops planted yet.</p>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-xl font-bold font-display mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link href="/advisory">
                <span className="text-2xl">🤖</span>
                <span>Get Advisory</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" asChild>
              <Link href="/activities">
                <span className="text-2xl">📝</span>
                <span>View Activities</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
