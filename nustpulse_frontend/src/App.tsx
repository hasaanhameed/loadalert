import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Deadlines from "./pages/Deadlines";
import UniversalPulse from "./pages/UniversalPulse";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

import GmailNudge from "./components/GmailNudge";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <UserProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GmailNudge />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deadlines"
                element={
                  <ProtectedRoute>
                    <Deadlines />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/universal-pulse"
                element={
                  <ProtectedRoute>
                    <UniversalPulse />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
