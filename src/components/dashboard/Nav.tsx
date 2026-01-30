"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TrendingUp, GanttChart, BarChart, Target, BookUser, Landmark, Grid3x3, Newspaper, Eye, BarChart3, Menu, X, Building2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/dashboard/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/wall-street", label: "Wall Street", icon: Building2 },
  { href: "/dashboard/stop-loss", label: "Stop Loss", icon: Shield },
  { href: "/dashboard/heatmap", label: "Heatmap", icon: Grid3x3 },
  { href: "/dashboard/charts", label: "Charts", icon: BarChart3 },
  { href: "/dashboard/search", label: "Watchlist", icon: Eye },
  { href: "/dashboard/news", label: "News", icon: Newspaper },
  { href: "/dashboard/predictions", label: "Predictions", icon: GanttChart },
  { href: "/dashboard/advisor", label: "AI Advisor", icon: BookUser },
  { href: "/dashboard/goals", label: "Goals", icon: Target },
  { href: "/dashboard/accounts", label: "Accounts", icon: Landmark },
];

// Mobile: Show only key items
const mobileNavItems = [
  { href: "/dashboard/portfolio", label: "Portfolio", icon: TrendingUp },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart },
  { href: "/dashboard/wall-street", label: "Wall St", icon: Building2 },
  { href: "/dashboard/stop-loss", label: "Risk", icon: Shield },
  { href: "/dashboard/advisor", label: "Advisor", icon: BookUser },
];

export function DashboardNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex bg-background/80 backdrop-blur-md border-r border-white/10 p-4 flex-col items-center gap-4 overflow-visible" role="navigation" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center justify-center p-3 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                  isActive
                    ? "bg-primary/20 backdrop-blur-md border border-primary/30 text-primary"
                    : "bg-white/10 backdrop-blur-md border border-white/20 text-gray-400 hover:bg-white/20 hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
                title={label}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </Link>
            );
          })}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-white/10 z-50" role="navigation" aria-label="Mobile navigation">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={label}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="text-[10px] font-medium font-sans" aria-hidden="true">{label}</span>
              </Link>
            );
          })}
          
          {/* More Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button 
                className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px] text-muted-foreground hover:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                aria-label="More navigation options"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
                <span className="text-[10px] font-medium font-sans" aria-hidden="true">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] bg-background border-t border-white/10">
              <SheetHeader>
                <SheetTitle className="text-white font-sans">All Pages</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {navItems.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-colors no-underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                        isActive
                          ? "bg-primary/20 border-primary/30 text-primary"
                          : "bg-white/10 border-white/20 text-gray-400 hover:bg-white/20 hover:text-white"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <Icon className="w-6 h-6" aria-hidden="true" />
                      <span className="text-sm font-medium font-sans">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </>
  );
}
