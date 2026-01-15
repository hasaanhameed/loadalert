import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Shield, LogOut } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { updateUser, changePassword } from "@/api/users";

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  // Profile info
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [loading, setLoading] = useState(false);

  // Privacy & Security
  const [showSecurity, setShowSecurity] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordChange = async () => {
    setPasswordError("");

    // Frontend validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    try {
      setPasswordLoading(true);

      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      // Reset state on success
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowSecurity(false);
    } catch (err: any) {
      const message =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update password";
    
      setPasswordError(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-12">
      <Navbar />

      <main className="pt-24 px-6">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account settings.</p>
          </div>

          {/* Profile Card */}
          <div className="glass-card p-8 mb-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  {user?.name}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const updatedUser = await updateUser({ name, email });
                    setUser(updatedUser);
                  } catch (err: any) {
                    alert(
                      err.response?.data?.detail ||
                        "Failed to update profile"
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Settings */}
          <div className="glass-card divide-y divide-border/50">
            {/* Privacy & Security */}
            <button
              onClick={() => setShowSecurity((prev) => !prev)}
              className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Privacy & Security
                </p>
                <p className="text-sm text-muted-foreground">
                  Update password and security preferences
                </p>
              </div>
            </button>

            {/* Expandable Password Section */}
            {showSecurity && (
              <div className="px-6 pb-6">
                <div className="glass-card p-6 mt-4">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Change Password
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) =>
                          setCurrentPassword(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Confirm New Password</Label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                      />
                    </div>

                    {passwordError && (
                      <p className="text-sm text-destructive">
                        {passwordError}
                      </p>
                    )}

                    <Button
                      disabled={passwordLoading}
                      onClick={handlePasswordChange}
                    >
                      {passwordLoading
                        ? "Updating..."
                        : "Update Password"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Sign Out */}
            <button
              onClick={() => {
                setUser(null);
                navigate("/");
              }}
              className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left group"
            >
              <div className="p-2 rounded-lg bg-destructive/10">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">Sign Out</p>
                <p className="text-sm text-muted-foreground">
                  Log out of your account
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
