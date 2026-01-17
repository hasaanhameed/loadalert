import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Activity, BarChart3, Calendar, Shield, Zap, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
              <Activity className="h-4 w-4" />
              <span>Student Workload Management</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-foreground">Monitor deadlines.</span>
              <br />
              <span className="text-gradient">Predict stress.</span>
              <br />
              <span className="text-foreground">Stay ahead.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              LoadAlert analyzes your upcoming deadlines and estimated workload to predict 
              high-stress periods so you can plan smarter and avoid last-minute panic.
            </p>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to stay on top
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for students managing heavy workloads.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="glass-card p-6 group hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">LoadAlert</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
