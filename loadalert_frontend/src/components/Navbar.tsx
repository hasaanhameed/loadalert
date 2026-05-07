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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-obsidian-blood/5 bg-pure-snow/90 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Activity className="h-5 w-5 text-dark-claret" />
            <span className="text-xl font-black text-obsidian-blood tracking-tighter uppercase">LoadAlert</span>
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
                      "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-200",
                      isActive
                        ? "text-dark-claret border-b-2 border-dark-claret"
                        : "text-muted-foreground hover:text-obsidian-blood hover:bg-ash-white"
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
              <div className="px-4 py-1.5 bg-ash-white border border-obsidian-blood/5 text-obsidian-blood text-[10px] font-black uppercase tracking-widest rounded-md">
                {user.name}
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" className="border-obsidian-blood text-obsidian-blood uppercase tracking-widest text-[10px] font-black hover:bg-ash-white" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-dark-claret hover:bg-obsidian-blood text-pure-snow uppercase tracking-widest text-[10px] font-black px-6" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-abyss-obsidian hover:bg-ash rounded-none transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-obsidian-blood/5 bg-pure-snow shadow-xl">
          <div className="container mx-auto px-6 py-6 space-y-3">
            {user ? (
              <>
                <div className="px-4 py-2 mb-4 bg-ash-white border border-obsidian-blood/5 text-dark-claret text-[10px] font-black uppercase tracking-widest text-center rounded-md">
                  {user.name}
                </div>
                {privateLinks.map((link) => {
                  const isActive = location.pathname === link.path;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-200 rounded-md",
                        isActive
                          ? "text-dark-claret bg-ash-white"
                          : "text-muted-foreground hover:text-obsidian-blood hover:bg-ash-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </>
            ) : (
              <div className="space-y-4 pt-4">
                <Button variant="outline" size="sm" className="w-full border-obsidian-blood text-obsidian-blood uppercase tracking-widest font-black h-12" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button size="sm" className="w-full bg-dark-claret hover:bg-obsidian-blood text-pure-snow uppercase tracking-widest font-black h-12" asChild>
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

export default Navbar;
