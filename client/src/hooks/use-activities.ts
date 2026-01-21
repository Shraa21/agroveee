import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateActivityRequest } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useActivities(filters?: { fieldId?: number; cropId?: number }) {
  return useQuery({
    queryKey: [api.activities.list.path, filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.fieldId) params.append("fieldId", filters.fieldId.toString());
      if (filters?.cropId) params.append("cropId", filters.cropId.toString());
      
      const url = `${api.activities.list.path}?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch activities");
      return api.activities.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateActivityRequest) => {
      const res = await fetch(api.activities.create.path, {
        method: api.activities.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to log activity");
      return api.activities.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.activities.list.path] });
      toast({ title: "Success", description: "Activity logged" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
