import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateFarmRequest, type UpdateFarmRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useFarms() {
  return useQuery({
    queryKey: [api.farms.list.path],
    queryFn: async () => {
      const res = await fetch(api.farms.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch farms");
      return api.farms.list.responses[200].parse(await res.json());
    },
  });
}

export function useFarm(id: number) {
  return useQuery({
    queryKey: [api.farms.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.farms.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch farm");
      return api.farms.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateFarmRequest) => {
      const res = await fetch(api.farms.create.path, {
        method: api.farms.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create farm");
      }
      return api.farms.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.list.path] });
      toast({ title: "Success", description: "Farm created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateFarm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateFarmRequest) => {
      const url = buildUrl(api.farms.update.path, { id });
      const res = await fetch(url, {
        method: api.farms.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update farm");
      return api.farms.update.responses[200].parse(await res.json());
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [api.farms.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.farms.get.path, id] });
      toast({ title: "Success", description: "Farm updated" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteFarm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.farms.delete.path, { id });
      const res = await fetch(url, { method: api.farms.delete.method, credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete farm");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.farms.list.path] });
      toast({ title: "Success", description: "Farm deleted" });
    },
  });
}
