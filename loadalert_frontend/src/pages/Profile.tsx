import { Navbar } from "@/components/Navbar";
import { User, LogOut, Mail } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

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
                <p className="text-sm font-black text-obsidian-blood/40 uppercase tracking-widest">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Notification Sync Section */}
          <div className="bg-pure-snow border border-obsidian-blood/5 rounded-2xl overflow-hidden shadow-sm mb-6">
            <div className="p-8 border-b border-obsidian-blood/5 bg-fired-cream">
              <h3 className="text-xs font-black text-pure-snow uppercase tracking-[0.2em]">Alert Preferences</h3>
            </div>
            
            <div className="p-8 flex items-center justify-between gap-6 group hover:bg-obsidian-blood/[0.02] transition-all">
              <div className="flex items-center gap-6">
                <div className="p-3 rounded-xl bg-fired-cream/10 text-fired-cream group-hover:scale-110 transition-transform">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-lg font-black text-obsidian-blood uppercase tracking-tight italic">Gmail Integration</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">Push notifications for LMS updates</p>
                </div>
              </div>
              
              <button className="h-10 px-8 rounded-lg bg-fired-cream text-obsidian-blood text-[10px] font-black uppercase tracking-widest hover:bg-fired-cream/80 transition-all shadow-lg active:scale-95">
                Connect
              </button>
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