import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Pages
import LandingPage from "@/pages/LandingPage";
import Dashboard from "@/pages/Dashboard";
import FarmsList from "@/pages/FarmsList";
import FarmDetails from "@/pages/FarmDetails";
import FieldDetails from "@/pages/FieldDetails";
import Activities from "@/pages/Activities";
import Advisory from "@/pages/Advisory";
import NotFound from "@/pages/not-found";

function PrivateRoutes() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 lg:ml-72 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/farms" component={FarmsList} />
            <Route path="/farms/:id" component={FarmDetails} />
            <Route path="/fields/:id" component={FieldDetails} />
            <Route path="/activities" component={Activities} />
            <Route path="/advisory" component={Advisory} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <PrivateRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
