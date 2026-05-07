import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupUser } from "@/api/auth";
import { Activity, ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation
  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && /\d/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setErrors({ email: "", password: "" });

    // Validate email
    if (!validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address (e.g., xyz@abc.com)",
      }));
      return;
    }

    // Validate password
    if (!validatePassword(password)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters and contain at least one number",
      }));
      return;
    }

    setIsLoading(true);

    try {
      await signupUser(name, email, password);
      setSignupSuccess(true);
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-pure-snow">
      <div className="w-full max-w-md relative">
        {/* SUCCESS STATE */}
        {signupSuccess ? (
          <div className="bg-ash-white/50 p-12 text-center space-y-10 border border-obsidian-blood/5 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center gap-6">
              <div className="p-5 bg-dark-claret/5 border border-dark-claret/10 rounded-full">
                <Activity className="h-12 w-12 text-dark-claret" />
              </div>
              <span className="text-3xl font-black text-obsidian-blood uppercase tracking-tighter">LoadAlert</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-black text-obsidian-blood uppercase tracking-tight">
                Account Verified
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Your credentials have been securely registered.
              </p>
            </div>

            <Button
              variant="default"
              size="lg"
              className="w-full rounded-lg font-black uppercase tracking-widest h-16"
              onClick={() => navigate("/login")}
            >
              Sign In to Dashboard
            </Button>
          </div>
        ) : (
          <>
            {/* BACK LINK */}
            <Link
              to="/"
              className="inline-flex items-center gap-3 text-obsidian-blood/40 hover:text-dark-claret transition-colors mb-12 uppercase text-[10px] font-black tracking-[0.25em]"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Return to Home</span>
            </Link>

            {/* SIGNUP FORM */}
            <div className="bg-ash-white p-12 border border-obsidian-blood/5 shadow-2xl rounded-xl">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Activity className="h-6 w-6 text-dark-claret" />
                  <span className="text-2xl font-black text-obsidian-blood uppercase tracking-tighter">
                    LoadAlert
                  </span>
                </div>
                <h1 className="text-xl font-black text-obsidian-blood uppercase tracking-widest">
                  Create Account
                </h1>
                <p className="text-obsidian-blood/40 text-[10px] font-black uppercase tracking-[0.2em] mt-3">
                  Initialize workload monitoring
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.G. JOHN DOE"
                    className="h-14 bg-pure-snow border-obsidian-blood/10 focus:border-dark-claret rounded-md uppercase text-[10px] font-black tracking-widest placeholder:opacity-20"
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }
                    }}
                    placeholder="YOU@UNIVERSITY.EDU"
                    className={`h-14 bg-pure-snow border-obsidian-blood/10 focus:border-dark-claret rounded-md uppercase text-[10px] font-black tracking-widest placeholder:opacity-20 ${errors.email ? "border-destructive" : ""}`}
                    disabled={isLoading}
                    required
                  />
                  {errors.email && (
                    <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" name="password-label" className="text-[10px] font-black uppercase tracking-widest text-obsidian-blood/40">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors((prev) => ({ ...prev, password: "" }));
                        }
                      }}
                      placeholder="••••••••"
                      className={`h-14 bg-pure-snow border-obsidian-blood/10 focus:border-dark-claret rounded-md tracking-widest placeholder:opacity-20 ${errors.password ? "border-destructive" : ""}`}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-obsidian-blood/20 hover:text-dark-claret transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-[10px] font-bold text-destructive uppercase tracking-tighter">{errors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  variant="default"
                  size="lg" 
                  className="w-full rounded-lg font-black uppercase tracking-[0.3em] h-16 mt-4"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <p className="text-center text-[10px] font-black text-obsidian-blood/40 mt-12 uppercase tracking-widest">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-dark-claret hover:text-obsidian-blood border-b-2 border-dark-claret/20 transition-all pb-1 ml-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;