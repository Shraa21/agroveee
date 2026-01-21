import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Tractor, 
  Sprout, 
  NotebookPen, 
  Sparkles, 
  LogOut,
  User,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Farms", href: "/farms", icon: Tractor },
    { label: "Activities", href: "/activities", icon: NotebookPen },
    { label: "Advisory", href: "/advisory", icon: Sparkles },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
            A
          </div>
          <span className="font-display font-bold text-2xl text-foreground">Agrove</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div 
                onClick={() => setOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer font-medium
                  ${isActive 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10 translate-x-1" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:translate-x-1"
                  }
                `}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border/50 bg-secondary/20">
        <div className="flex items-center gap-3 mb-4 px-2">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="User" className="w-10 h-10 rounded-full border-2 border-background" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-accent/20 text-accent flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.firstName || "Farmer"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="bg-background shadow-md">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 border-r border-border bg-card/50 backdrop-blur-xl z-40">
        <NavContent />
      </aside>
    </>
  );
}
