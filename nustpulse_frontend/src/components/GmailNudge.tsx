import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/hooks/useAuth";
import { Mail, BellRing, ArrowRight } from "lucide-react";

const GmailNudge = () => {
  const { user } = useUser();
  const { connectGoogle } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenNudge = sessionStorage.getItem("gmail_nudge_seen");
    
    // Show nudge if user is logged in, has no gmail, and hasn't seen it this session
    if (user && !user.notification_email && !hasSeenNudge) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [user?.notification_email, !!user]);

  const handleDismiss = () => {
    setOpen(false);
    sessionStorage.setItem("gmail_nudge_seen", "true");
  };

  const handleConnect = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      connectGoogle(token);
    }
  };

  if (!user || user.notification_email) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[480px] bg-pure-snow border-obsidian-blood/10 p-0 overflow-hidden rounded-2xl shadow-2xl">
        {/* Themed Header Accent */}
        <div className="h-2 bg-fired-cream w-full" />
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-fired-cream/10 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-pure-snow border-2 border-fired-cream/20 p-4 rounded-2xl shadow-xl">
                <BellRing className="h-8 w-8 text-fired-cream animate-bounce" />
              </div>
            </div>
          </div>

          <DialogHeader className="text-center space-y-3">
            <DialogTitle className="text-3xl font-black text-obsidian-blood uppercase tracking-tighter italic">
              Stay in the Pulse
            </DialogTitle>
            <DialogDescription className="text-xs font-black uppercase tracking-widest text-obsidian-blood/40 leading-relaxed">
              Never miss a deadline again. Connect your Gmail to receive real-time alerts and 3-day deadline reminders.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-10 space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian-blood/[0.02] border border-obsidian-blood/5">
              <div className="h-8 w-8 rounded-lg bg-fired-cream/10 flex items-center justify-center text-fired-cream">
                <Mail className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black text-obsidian-blood uppercase tracking-widest leading-tight">
                Gmail Notifications
              </p>
            </div>
            
            <div className="flex items-center gap-4 p-4 rounded-xl bg-obsidian-blood/[0.02] border border-obsidian-blood/5">
              <div className="h-8 w-8 rounded-lg bg-obsidian-blood/5 flex items-center justify-center text-obsidian-blood">
                <ArrowRight className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-black text-obsidian-blood uppercase tracking-widest leading-tight">
                3-Day Countdown Reminders
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="p-8 pt-0 flex-col sm:flex-row gap-3">
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1 h-14 bg-pure-snow border-obsidian-blood/10 text-obsidian-blood/40 hover:text-obsidian-blood hover:bg-obsidian-blood/5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Maybe Later
          </Button>
          <Button
            onClick={handleConnect}
            className="flex-[1.5] h-14 bg-fired-cream text-obsidian-blood font-black uppercase italic tracking-[0.2em] rounded-xl shadow-lg hover:bg-fired-cream/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Connect Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GmailNudge;
