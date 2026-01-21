import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateFieldRequest, type UpdateFieldRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFields(farmId: number) {
  return useQuery({
    queryKey: [api.fields.list.path, farmId],
    queryFn: async () => {
      const url = buildUrl(api.fields.list.path, { farmId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch fields");
      return api.fields.list.responses[200].parse(await res.json());
    },
    enabled: !!farmId,
  });
}

export function useField(id: number) {
  return useQuery({
    queryKey: [api.fields.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.fields.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch field");
      return api.fields.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateField() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ farmId, ...data }: CreateFieldRequest) => {
      const url = buildUrl(api.fields.create.path, { farmId });
      const res = await fetch(url, {
        method: api.fields.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to create field");
      return api.fields.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.fields.list.path, data.farmId] });
      queryClient.invalidateQueries({ queryKey: [api.farms.get.path, data.farmId] });
      toast({ title: "Success", description: "Field added successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
