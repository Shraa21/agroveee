import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useAdvisories() {
  return useQuery({
    queryKey: [api.advisories.list.path],
    queryFn: async () => {
      const res = await fetch(api.advisories.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch advisories");
      return api.advisories.list.responses[200].parse(await res.json());
    },
  });
}

export function useGenerateAdvisory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: { fieldId?: number; cropId?: number; context?: string }) => {
      const res = await fetch(api.advisories.generate.path, {
        method: api.advisories.generate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to generate advisory");
      return api.advisories.generate.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.advisories.list.path] });
      toast({ title: "Success", description: "New advisory generated" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
}
