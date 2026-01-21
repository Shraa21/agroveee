import { PageHeader } from "@/components/PageHeader";
import { useAdvisories, useGenerateAdvisory } from "@/hooks/use-advisories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function Advisory() {
  const { data: advisories, isLoading } = useAdvisories();
  const { mutate: generate, isPending: isGenerating } = useGenerateAdvisory();

  return (
    <div className="space-y-8">
      <PageHeader 
        title="AI Advisory" 
        description="Smart insights tailored to your farm."
        action={
          <Button 
            onClick={() => generate({ context: "General checkup" })} 
            disabled={isGenerating}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
            Generate Insights
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-6">
          {advisories && advisories.length > 0 ? (
            advisories.map((advisory, i) => (
              <motion.div
                key={advisory.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{advisory.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">Generated on {new Date(advisory.generatedAt!).toLocaleDateString()}</p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {advisory.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-secondary/10 rounded-2xl border border-dashed">
              <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium">No advisories yet</h3>
              <p className="text-muted-foreground mb-4">Ask our AI for personalized farming advice.</p>
              <Button onClick={() => generate({ context: "Initial analysis" })} variant="outline">
                Get First Insight
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
