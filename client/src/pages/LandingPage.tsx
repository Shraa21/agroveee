import { ReactNode } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Leaf, BarChart3, Bot } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
              A
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">Agrove</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/api/login">
              <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                Login / Sign Up
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Smart Farming for the Future
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold font-display leading-[1.1] mb-6">
                Cultivate Smarter, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-600">Grow Better.</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Manage your farm with precision. Track crops, log activities, and get AI-powered advisory to maximize your yield.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/api/login">
                  <Button size="xl" className="h-14 px-8 text-lg rounded-full w-full sm:w-auto">
                    Start Your Farm
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Unsplash placeholder for dashboard UI mockup or farm imagery */}
              {/* farm management digital dashboard */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card aspect-[4/3] group">
                 <img 
                    src="https://pixabay.com/get/gd39c6c7fdd6436e36242e1c93591f7868125c5a1c5406f257f8ba01c8edaa9c333562459fb1c39429e41e703a479ed75be774fe4143ff8ea1f3a82d33f0890ea_1280.jpg" 
                    alt="Farm Dashboard"
                    className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className="text-white">
                       <p className="text-sm font-medium uppercase tracking-wider mb-2">Real-time Insights</p>
                       <h3 className="text-2xl font-bold">Monitor Field Health</h3>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold font-display mb-4">Everything you need to grow</h2>
            <p className="text-lg text-muted-foreground">Comprehensive tools designed for modern farmers to streamline operations and boost productivity.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Leaf className="w-8 h-8 text-primary" />}
              title="Crop Management"
              description="Track sowing dates, varieties, and growth stages for every field in your farm."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-8 h-8 text-accent" />}
              title="Activity Tracking"
              description="Log irrigation, fertilization, and harvesting activities to keep precise records."
            />
            <FeatureCard 
              icon={<Bot className="w-8 h-8 text-blue-600" />}
              title="AI Advisory"
              description="Get intelligent suggestions tailored to your soil type and crop conditions."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">A</div>
            <span className="font-bold text-xl">Agrove</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 Agrove Platform. Built for farmers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: ReactNode, title: string, description: string }) {
  return (
    <div className="bg-card p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="w-14 h-14 rounded-full bg-background border border-border flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
