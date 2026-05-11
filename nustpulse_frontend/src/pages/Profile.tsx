import { Navbar } from "@/components/Navbar";
import { User, LogOut, Mail, Bell, BellOff, Save, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateUser } from "@/services/users";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  
  const [notifEnabled, setNotifEnabled] = useState(user?.notifications_enabled ?? true);
  const [saving, setSaving] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const updatedUser = await updateUser({
        notifications_enabled: notifEnabled
      });
      setUser(updatedUser);
      toast.success("Notification preferences updated");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handleConnectGoogle = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Not authenticated");
      
      const res = await api.get(`/api/auth/google/authorize?token=${token}`);
      if (res.data?.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Failed to start Google OAuth", err);
      toast.error("Failed to connect Google account");
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      setSaving(true);
      const updatedUser = await updateUser({
        notification_email: null
      });
      setUser(updatedUser);
      toast.success("Google account disconnected");
    } catch (err) {
      console.error("Failed to disconnect", err);
      toast.error("Failed to disconnect account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-pure-snow pb-20">
      <Navbar />

      <main className="pt-28 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-black text-obsidian-blood uppercase tracking-tighter italic mb-2">Profile</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-obsidian-blood/40">Account Details & Management</p>
          </div>

          {/* Profile Card */}
          <div className="bg-pure-snow border border-obsidian-blood/5 p-10 rounded-2xl shadow-sm mb-8">
            <div className="flex flex-col items-center sm:flex-row sm:items-center gap-10">
              <div className="w-24 h-24 rounded-full bg-fired-cream/10 border-2 border-fired-cream/20 flex items-center justify-center shadow-xl">
                <User className="h-10 w-10 text-fired-cream" />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h2 className="text-3xl font-black text-obsidian-blood uppercase tracking-tight italic leading-none">
                  {user?.name}
                </h2>
                <p className="text-sm font-black text-obsidian-blood/40 uppercase tracking-widest">{user?.lms_username}</p>
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
                  <div className="flex items-center justify-between p-4 rounded-xl bg-obsidian-blood/[0.02] border border-obsidian-blood/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-fired-cream animate-pulse shadow-[0_0_8px_rgba(230,168,142,0.5)]" />
                      <p className="font-bold text-obsidian-blood italic">{user.notification_email}</p>
                    </div>
                    <button 
                      onClick={handleDisconnectGoogle}
                      disabled={saving}
                      className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/30 hover:text-red-500 transition-colors"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectGoogle}
                    className="w-full h-16 bg-pure-snow text-obsidian-blood border border-obsidian-blood/10 rounded-xl text-[10px] font-black uppercase italic tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 group"
                  >
                    <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                    Connect with Gmail
                  </Button>
                )}
              </div>

              {/* Toggle Setting - Only shown if connected */}
              {user?.notification_email && (
                <div className="flex items-center justify-between p-6 rounded-xl bg-obsidian-blood/[0.02] border border-obsidian-blood/5 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className={notifEnabled ? "text-fired-cream" : "text-obsidian-blood/20"}>
                      {notifEnabled ? <Bell className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-black text-obsidian-blood uppercase tracking-tight italic">
                        {notifEnabled ? "Notifications Enabled" : "Notifications Disabled"}
                      </p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-obsidian-blood/30 mt-0.5">
                        {notifEnabled ? "You are receiving real-time alerts" : "Alerts are currently paused"}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      const newVal = !notifEnabled;
                      setNotifEnabled(newVal);
                      updateUser({ notifications_enabled: newVal })
                        .then(updated => setUser(updated))
                        .catch(() => toast.error("Failed to update notification status"));
                    }}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-sm ${notifEnabled ? 'bg-fired-cream' : 'bg-obsidian-blood/10'}`}
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ${notifEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-pure-snow border border-obsidian-blood/5 rounded-2xl overflow-hidden shadow-sm">
            <button
              onClick={() => {
                setUser(null);
                navigate("/");
              }}
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