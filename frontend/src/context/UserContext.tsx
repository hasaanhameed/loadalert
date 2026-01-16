import { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Storage key for user data
const USER_DATA_KEY = "user_data";

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on app start
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_DATA_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem(USER_DATA_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  // Wrapper to persist user data when it changes
  const persistUser = (newUser: User | null) => {
    if (newUser) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUser));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser: persistUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
};