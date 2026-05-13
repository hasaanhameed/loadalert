import { Navbar } from "@/components/Navbar";
import { User, LogOut, Mail, Bell, BellOff, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useUsers } from "@/hooks/useUsers";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const Profile = () => {
  const { user, setUser } = useUser();
  const { updateProfile, isUpdatingProfile } = useUsers();
  const { connectGoogle } = useAuth();
  const navigate = useNavigate();

  const [notifEnabled, setNotifEnabled] = useState(user?.notifications_enabled ?? true);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    try {
      await api.post("/users/me/test-email");
      alert("Test email sent! Check your inbox (including Spam/Promotions).");
    } catch (err) {
      console.error("Failed to send test email", err);
      alert("Failed to send test email. Check your connection.");
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSignOut = () => {
    setUser(null);
    sessionStorage.removeItem("gmail_nudge_seen");
    navigate("/");
  };

  // Refresh user data on mount to get latest connection status
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        console.error("Failed to refresh user", err);
      }
    };
    fetchUser();
  }, []);

  // Update local toggle state when user data changes
  useEffect(() => {
    if (user) {
      setNotifEnabled(user.notifications_enabled);
    }
  }, [user]);

  const handleConnectGoogle = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      connectGoogle(token);
    }
  };

  const handleDisconnectGoogle = () => {
    updateProfile({
      notification_email: null,
      notifications_enabled: false
    }, {
      onSuccess: (data) => {
        setUser(data);
      }
    });
  };

  const handleToggleNotifications = () => {
    const newVal = !notifEnabled;
    setNotifEnabled(newVal);
    updateProfile({
      notifications_enabled: newVal
    }, {
      onSuccess: (data) => {
        setUser(data);
      }
    });
  };

  return (
    <div className="min-h-screen bg-pure-snow pb-20">
      <Navbar />

      <main className="pt-28 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8 md:mb-12 text-center sm:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-obsidian-blood uppercase tracking-tighter italic mb-2">Profile</h1>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-blood/40">Account Details & Management</p>
          </div>

          {/* Profile Card */}
          <div className="bg-pure-snow border border-obsidian-blood/5 p-6 md:p-10 rounded-2xl shadow-sm mb-8">
            <div className="flex flex-col items-center sm:flex-row gap-6 md:gap-10">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-fired-cream/10 border-2 border-fired-cream/20 flex items-center justify-center shadow-xl">
                <User className="h-8 w-8 md:h-10 md:w-10 text-fired-cream" />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-2xl md:text-3xl font-black text-obsidian-blood uppercase tracking-tight italic leading-none">
                  {user?.name}
                </h2>
                <p className="text-xs md:text-sm font-black text-obsidian-blood/40 uppercase tracking-widest">{user?.lms_username}</p>
              </div>
            </div>
          </div>

          {/* Notification Settings Section */}
          <div className="bg-pure-snow border border-obsidian-blood/5 rounded-2xl overflow-hidden shadow-sm mb-6">
            <div className="p-8 border-b border-obsidian-blood/5 bg-fired-cream">
              <h3 className="text-xs font-black text-pure-snow uppercase tracking-[0.2em]">Alert Preferences</h3>
            </div>

            <div className="p-8 space-y-8">
              {/* Email Setting - Google OAuth Version */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-fired-cream/10 text-fired-cream">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-obsidian-blood uppercase tracking-tight italic">Notification Email</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">Where we send your deadline alerts</p>
                  </div>
                </div>

                {user?.notification_email ? (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-obsidian-blood/[0.02] border border-obsidian-blood/5 gap-4">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-2 h-2 rounded-full bg-fired-cream animate-pulse shadow-[0_0_8px_rgba(230,168,142,0.5)] shrink-0" />
                      <p className="font-bold text-obsidian-blood italic break-all text-xs md:text-sm">{user.notification_email}</p>
                    </div>
                    <button
                      onClick={handleDisconnectGoogle}
                      disabled={isUpdatingProfile}
                      className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-obsidian-blood/30 hover:text-red-500 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectGoogle}
                    className="w-full h-14 bg-pure-snow border-2 border-obsidian-blood/5 text-obsidian-blood font-black uppercase italic tracking-[0.2em] rounded-xl shadow-sm hover:border-fired-cream/50 hover:bg-fired-cream/5 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
                    Connect with Gmail
                  </Button>
                )}
              </div>

              {/* Notification Toggle - Only visible when connected */}
              {user?.notification_email && (
                <div className="pt-8 border-t border-obsidian-blood/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg transition-colors",
                      notifEnabled ? "bg-fired-cream/10 text-fired-cream" : "bg-obsidian-blood/5 text-obsidian-blood/40"
                    )}>
                      {notifEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-obsidian-blood uppercase tracking-tight italic">Notifications Enabled</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">
                        {notifEnabled ? "You are receiving real-time alerts" : "Alerts are currently paused"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleNotifications}
                    disabled={isUpdatingProfile}
                    className={cn(
                      "w-14 h-8 rounded-full p-1 transition-all duration-300 relative",
                      notifEnabled ? "bg-fired-cream" : "bg-obsidian-blood/10"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 bg-pure-snow rounded-full shadow-lg transition-all duration-300 flex items-center justify-center",
                      notifEnabled ? "ml-6" : "ml-0"
                    )}>
                      {isUpdatingProfile && <Loader2 className="h-3 w-3 animate-spin text-fired-cream" />}
                    </div>
                  </button>
                </div>
              )}

              {/* Test Email Button - Only visible when connected */}
              {user?.notification_email && (
                <div className="pt-8 border-t border-obsidian-blood/5">
                  <Button
                    onClick={handleTestEmail}
                    disabled={isSendingTest}
                    className="w-full h-12 bg-pure-snow border border-obsidian-blood/10 text-obsidian-blood font-black uppercase italic tracking-widest text-[10px] rounded-xl hover:bg-fired-cream/5 hover:border-fired-cream/30 transition-all flex items-center justify-center gap-2 group"
                  >
                    {isSendingTest ? (
                      <Loader2 className="h-4 w-4 animate-spin text-fired-cream" />
                    ) : (
                      <Mail className="h-4 w-4 text-fired-cream group-hover:scale-110 transition-transform" />
                    )}
                    Send Test Email
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-pure-snow border border-obsidian-blood/5 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={handleSignOut}
              className="w-full p-8 flex items-center gap-6 hover:bg-obsidian-blood/5 transition-all text-left group border-l-4 border-l-transparent hover:border-l-red-500"
            >
              <div className="p-3 rounded-xl bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                <LogOut className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-lg font-black text-red-500 uppercase tracking-tight italic">Sign Out</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40 group-hover:text-obsidian-blood/60">
                  Securely log out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}