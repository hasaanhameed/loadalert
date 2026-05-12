import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Activity, BarChart3, Calendar, Shield, Zap, ArrowRight, Bell, Globe, Layout } from "lucide-react";
import { DnaHelix } from "@/components/DnaHelix";
import { useUser } from "@/context/UserContext";

const features = [
  {
    icon: Activity,
    title: "LMS Pulse Sync",
    description: "Directly synchronize your university LMS portal. One-click updates for all academic assignments.",
  },
  {
    icon: Layout,
    title: "Agenda View",
    description: "A detailed daily breakdown of your academic load. Track exactly what's due and when with zero friction.",
  },
  {
    icon: Globe,
    title: "Global Stream",
    description: "Access a universal feed of deadlines. Discover and pin assignments to your personal workspace instantly.",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description: "Never miss a deadline again. Get high-precision Gmail notifications as your due dates approach.",
  },
];

const Index = () => {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section - Strict Obsidian Editorial */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-pure-snow min-h-[80vh] flex items-center">
        {/* Full-height DNA Helix Background - Hidden on mobile */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 opacity-100 pointer-events-none z-0 hidden lg:block">
          <DnaHelix />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in">
              <h1 className="text-7xl md:text-9xl font-black text-obsidian-blood tracking-tighter leading-[0.85] uppercase">
                Nust <br />
                Pulse.
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                Your Academic Pulse, <span className="text-obsidian-blood font-black">Synchronized.</span> <br className="hidden md:block" />
                The high-precision portal for NUST students to auto-sync LMS deadlines.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <Button size="lg" className="h-14 px-10 text-xs font-black uppercase tracking-[0.2em] bg-fired-cream text-obsidian-blood border-0 shadow-lg hover:bg-fired-cream/80 hover:scale-105 active:scale-95 transition-all duration-300 group" asChild>
                  <Link to="/login" className="flex items-center gap-3">
                    Plug Into LMS <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Spacer for the helix animation on large screens */}
            <div className="flex-1 w-full relative hidden lg:block" />
          </div>
        </div>
      </section>

      {/* Features Section - Pure Obsidian Grid */}
      <section className="py-40 px-6 bg-ash-white/30 border-y border-obsidian-blood/5">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-32 space-y-6 text-center lg:text-left">
            <h2 className="text-5xl font-black text-obsidian-blood tracking-tighter uppercase leading-none">
              Precision <br />
              Architecture.
            </h2>
            <div className="h-1 w-24 bg-obsidian-blood mx-auto lg:mx-0" />
            <p className="text-xl text-muted-foreground font-medium max-w-2xl">
              Every component is engineered to provide maximum clarity during your most intense academic periods.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group space-y-6 text-center lg:text-left"
              >
                <div className="w-16 h-16 bg-ash-white flex items-center justify-center border border-obsidian-blood/10 transition-all duration-300 hover:bg-obsidian-blood hover:border-obsidian-blood rounded-xl group/icon mx-auto lg:mx-0 cursor-default">
                  <feature.icon className="h-6 w-6 text-obsidian-blood transition-colors group-hover/icon:text-ash-white" />
                </div>
                <h3 className="text-lg font-black text-obsidian-blood uppercase tracking-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Minimalist Footer */}
      <footer className="py-24 px-6 bg-pure-snow border-t border-obsidian-blood/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="flex items-center">
              <span className="text-5xl font-black text-obsidian-blood uppercase tracking-tighter italic">NustPulse</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed font-medium">
              The high-precision academic monitoring system for NUST. Synchronizing your portal, automating your deadlines, and mastering your focus.
            </p>
            <div className="pt-12 border-t border-obsidian-blood/5 w-full flex justify-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/30">
                © 2026 NustPulse • v1.0.0 • Built for NUST
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
