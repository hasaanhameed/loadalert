import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Activity, Home, LayoutDashboard, Calendar, BarChart3, User, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

const privateLinks = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "My Deadlines", path: "/deadlines", icon: Calendar },
  { name: "Universal Pulse", path: "/universal-pulse", icon: Activity },
  { name: "Profile", path: "/profile", icon: User },
];

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("gmail_nudge_seen");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-obsidian-blood/5 bg-fired-cream transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center group">
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
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="w-10 h-10 bg-pure-snow text-obsidian-blood rounded-full flex items-center justify-center shadow-xl border-2 border-pure-snow/20 transition-transform hover:scale-105 cursor-pointer outline-none">
                      <User className="h-5 w-5" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-pure-snow border-obsidian-blood/5 rounded-xl shadow-2xl p-2 mt-2">
                    <DropdownMenuLabel className="px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40 mb-1">Account</p>
                      <p className="text-xs font-black text-obsidian-blood truncate">{user.name}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-obsidian-blood/5" />
                    <DropdownMenuItem 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer focus:bg-obsidian-blood/5 focus:text-obsidian-blood transition-colors"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="h-4 w-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest">View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-obsidian-blood/5" />
                    <DropdownMenuItem 
                      className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer focus:bg-red-50 text-red-500 focus:text-red-600 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-[11px] font-black uppercase tracking-widest">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
