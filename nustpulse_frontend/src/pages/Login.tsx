import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/services/auth";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff, Loader2, Fingerprint, Lock, School } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      login(data.access_token);
      setUser(data.user);
      navigate("/deadlines");
    } catch (error) {
      console.error(error);
      toast.error("Verification failed. Please check your LMS credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pure-snow flex items-center justify-center px-6 py-12">
      {/* Background patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-obsidian-blood/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-obsidian-blood/5 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-obsidian-blood/40 hover:text-obsidian-blood transition-all duration-300 mb-10 group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Overview</span>
        </Link>

        <div className="bg-pure-snow border border-obsidian-blood/10 shadow-2xl rounded-2xl p-10 md:p-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl font-black text-obsidian-blood uppercase tracking-tighter italic">NustPulse</span>
            </div>
            <h1 className="text-xl font-black text-obsidian-blood uppercase tracking-tight">Connect Portal</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/60 ml-1 flex items-center gap-2">
                <Fingerprint className="h-3 w-3" /> LMS ID
              </Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name.bscs23seecs"
                className="bg-fired-cream border-obsidian-blood/5 focus:border-obsidian-blood focus:bg-fired-cream h-14 rounded-xl font-medium ring-offset-0 focus-visible:ring-0"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/60 ml-1 flex items-center gap-2">
                <Lock className="h-3 w-3" /> Portal Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your LMS password"
                  className="bg-fired-cream border-obsidian-blood/5 focus:border-obsidian-blood focus:bg-fired-cream h-14 rounded-xl font-medium pr-12 ring-offset-0 focus-visible:ring-0"
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-obsidian-blood/30 hover:text-obsidian-blood transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full h-16 rounded-xl text-[10px] font-black uppercase italic tracking-[0.2em] bg-pure-snow text-obsidian-blood shadow-xl hover:bg-pure-snow/90 hover:scale-[1.01] active:scale-[0.99] border border-obsidian-blood/5 transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Sync & Connect"
                )}
              </Button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-obsidian-blood/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-obsidian-blood/30 leading-relaxed">
              Authenticated via NUST LMS Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
