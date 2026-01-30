import { Pyramid } from 'lucide-react';
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { DashboardNav } from "@/components/dashboard/Nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-screen bg-background text-foreground flex flex-col font-sans">
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 p-2 md:p-4 sticky top-0 z-50" role="banner">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-1 md:gap-3 group flex-shrink-0" aria-label="ALPHA Dashboard">
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-md border border-primary/20">
              <Pyramid className="w-5 h-5 md:w-6 md:h-6 text-primary" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-2xl font-bold text-white font-sans truncate">
                ALPHA
              </span>
              <span className="hidden md:block px-2 py-0.5 text-xs font-semibold text-primary bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full font-sans" aria-label="Version 2.0">
                2.0
              </span>
            </div>
          </Link>
          <div className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg flex-shrink-0">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DashboardNav />
        <main className="flex-1 overflow-auto bg-grid relative p-2 md:p-4 lg:p-6 pb-20 md:pb-6" role="main" aria-label="Dashboard content">
          {children}
        </main>
      </div>
    </div>
  );
}
