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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-obsidian-blood/5 bg-fired-cream">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <Activity className="h-6 w-6 text-pure-snow" />
            <span className="text-xl font-black text-pure-snow tracking-tighter uppercase">LoadAlert</span>
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
                      "px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-md",
                      isActive
                        ? "bg-pure-snow text-obsidian-blood shadow-lg"
                        : "text-ash-white/70 hover:text-pure-snow"
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Desktop Auth Buttons / User Name */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="px-6 py-2 bg-ash-white border border-obsidian-blood/5 text-obsidian-blood text-sm font-black uppercase tracking-widest rounded-lg">
                {user.name}
              </div>
            ) : (
              <>
                <Button variant="default" className="h-12 px-8 uppercase tracking-widest text-xs font-black transition-all duration-300" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button variant="default" className="h-12 px-8 uppercase tracking-widest text-xs font-black shadow-lg transition-all duration-300" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-3 text-pure-snow hover:bg-pure-snow/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-7 w-7" />
            ) : (
              <Menu className="h-7 w-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-obsidian-blood/5 bg-pure-snow shadow-2xl overflow-hidden">
          <div className="container mx-auto px-6 py-10 space-y-6">
            {user ? (
              <>
                <div className="px-6 py-4 bg-obsidian-blood/5 border border-obsidian-blood/10 text-obsidian-blood text-sm font-black uppercase tracking-widest text-center rounded-lg">
                  {user.name}
                </div>
                <div className="space-y-2">
                  {privateLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-5 px-6 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 rounded-md",
                        isActive
                          ? "bg-pure-snow text-obsidian-blood shadow-lg"
                          : "text-ash-white/70 hover:text-pure-snow"
                      )}
                      >
                        <Icon className="h-5 w-5" />
                        {link.name}
                      </Link>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <Button variant="default" className="w-full rounded-lg uppercase tracking-widest font-black h-14 transition-all duration-300" asChild>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button variant="default" className="w-full rounded-lg uppercase tracking-widest font-black h-14 shadow-lg transition-all duration-300" asChild>
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
