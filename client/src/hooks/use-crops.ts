import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateCropRequest, type UpdateCropRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useCrops(fieldId: number) {
  return useQuery({
    queryKey: [api.crops.list.path, fieldId],
    queryFn: async () => {
      const url = buildUrl(api.crops.list.path, { fieldId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch crops");
      return api.crops.list.responses[200].parse(await res.json());
    },
    enabled: !!fieldId,
  });
}

export function useCreateCrop() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ fieldId, ...data }: CreateCropRequest) => {
      const url = buildUrl(api.crops.create.path, { fieldId });
      const res = await fetch(url, {
        method: api.crops.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to add crop");
      return api.crops.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.crops.list.path, data.fieldId] });
      toast({ title: "Success", description: "Crop added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateCrop() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateCropRequest) => {
      const url = buildUrl(api.crops.update.path, { id });
      const res = await fetch(url, {
        method: api.crops.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update crop");
      return api.crops.update.responses[200].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.crops.list.path, data.fieldId] });
      queryClient.invalidateQueries({ queryKey: [api.crops.get.path, data.id] });
      toast({ title: "Success", description: "Crop updated" });
    },
  });
}
