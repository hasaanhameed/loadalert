import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Home, LayoutDashboard, Calendar, BarChart3, User, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const navLinks = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Deadlines", path: "/deadlines", icon: Calendar },
  { name: "Stress Overview", path: "/stress", icon: BarChart3 },
  { name: "Profile", path: "/profile", icon: User },
];

const privateLinks = [
  { name: "Home", path: "/", icon: Activity },
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Deadlines", path: "/deadlines", icon: Calendar },
  { name: "Stress Overview", path: "/stress", icon: BarChart3 },
  { name: "Profile", path: "/profile", icon: User },
];

export const Navbar = () => {
  const location = useLocation();
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Activity className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <span className="text-lg font-semibold text-foreground">LoadAlert</span>
          </Link>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center gap-1">
              {privateLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={cn(
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Auth Buttons / User Name */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                {user.name}
              </div>
            ) : (
              <>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="heroFilled" size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4 space-y-2">
            {user ? (
              <>
                {/* User Info */}
                <div className="px-4 py-2 mb-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium text-center">
                  {user.name}
                </div>
                
                {/* Navigation Links */}
                {privateLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        isActive
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {link.name}
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="hero" size="sm" className="w-full" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="heroFilled" size="sm" className="w-full" asChild>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
