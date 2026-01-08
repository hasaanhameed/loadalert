import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Bell, Shield, LogOut } from "lucide-react";

const Profile = () => {
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
                <h2 className="text-xl font-semibold text-foreground">John Doe</h2>
                <p className="text-muted-foreground">john.doe@university.edu</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  defaultValue="John Doe"
                  className="bg-muted/50 border-border/50 focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="john.doe@university.edu"
                  className="bg-muted/50 border-border/50 focus:border-primary"
                />
              </div>

              <Button variant="heroFilled" className="mt-4">
                Save Changes
              </Button>
            </div>
          </div>

          {/* Settings Links */}
          <div className="glass-card divide-y divide-border/50">
            <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left group">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                  Notification Settings
                </p>
                <p className="text-sm text-muted-foreground">
                  Manage deadline reminders and alerts
                </p>
              </div>
            </button>

            <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left group">
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

            <button className="w-full p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors text-left group">
              <div className="p-2 rounded-lg bg-destructive/10">
                <LogOut className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-destructive">Sign Out</p>
                <p className="text-sm text-muted-foreground">Log out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
