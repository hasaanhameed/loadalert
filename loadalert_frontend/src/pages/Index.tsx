import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Activity, BarChart3, Calendar, Shield, Zap, ArrowRight } from "lucide-react";
import { DnaHelix } from "@/components/DnaHelix";

const features = [
  {
    icon: Calendar,
    title: "Track Deadlines",
    description: "Organize all your assignments, projects, and exams in one place.",
  },
  {
    icon: BarChart3,
    title: "Predict Stress",
    description: "AI-powered analysis shows when workload will peak.",
  },
  {
    icon: Shield,
    title: "Stay Ahead",
    description: "Get priority recommendations to tackle tasks efficiently.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description: "Visual breakdowns help you understand your weekly load.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero Section - Strict Obsidian Editorial */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden bg-pure-snow min-h-[80vh] flex items-center">
        {/* Full-height DNA Helix Background */}
        <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 opacity-100 pointer-events-none z-0">
          <DnaHelix />
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 text-center lg:text-left space-y-10 animate-fade-in">
              <h1 className="text-7xl md:text-9xl font-black text-obsidian-blood tracking-tighter leading-[0.85] uppercase">
                Manage <br />
                Pressure.
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium mx-auto lg:mx-0">
                A high-precision workload monitoring system for students who demand excellence.
                Stay ahead of the curve with predictive stress mapping.
              </p>

              <div className="flex justify-center lg:justify-start pt-6">
                <Button size="xl" variant="default" className="font-black uppercase tracking-[0.2em] px-16 h-20 rounded-lg">
                  Get Started
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
                <div className="w-16 h-16 bg-ash-white flex items-center justify-center border border-obsidian-blood/10 transition-all duration-300 group-hover:bg-obsidian-blood group-hover:border-obsidian-blood rounded-xl">
                  <feature.icon className="h-6 w-6 text-obsidian-blood transition-colors group-hover:text-ash-white" />
                </div>
                <h3 className="text-lg font-black text-obsidian-blood uppercase tracking-tight">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 bg-pure-snow border-t border-obsidian-blood/5">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-3">
            <Activity className="h-6 w-6 text-obsidian-blood" />
            <span className="text-2xl font-black text-obsidian-blood uppercase tracking-tighter">LoadAlert</span>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">
            <span>Systems Normal</span>
            <span>v1.0.4</span>
            <span>© 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
