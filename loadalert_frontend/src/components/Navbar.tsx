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
  { name: "Home", path: "/", icon: Home },
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
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-obsidian-blood/5 bg-fired-cream transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-black text-pure-snow tracking-tighter uppercase italic">NustPulse</span>
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
                        : "text-pure-snow hover:text-white"
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
              <div className="flex items-center gap-4 pl-6 border-l border-pure-snow/10">
                <span className="text-xs font-black uppercase tracking-widest text-pure-snow hidden lg:block">{user.name}</span>
                <div className="w-10 h-10 bg-pure-snow text-obsidian-blood rounded-full flex items-center justify-center shadow-xl border-2 border-pure-snow/20 transition-transform hover:scale-105 cursor-pointer">
                  <User className="h-5 w-5" />
                </div>
              </div>
            ) : (
              <Button
                variant="default"
                className="h-full py-3 px-10 uppercase tracking-[0.25em] text-xs font-black italic bg-pure-snow text-obsidian-blood hover:bg-pure-snow/90 hover:scale-105 active:scale-95 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-lg border border-pure-snow/20"
                asChild
              >
                <Link to="/login">Login</Link>
              </Button>
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
                            : "text-pure-snow hover:text-white"
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
                <Button
                  variant="default"
                  className="w-full h-14 rounded-xl bg-pure-snow text-obsidian-blood font-black italic uppercase tracking-widest text-[10px] shadow-xl"
                  asChild
                >
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
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
