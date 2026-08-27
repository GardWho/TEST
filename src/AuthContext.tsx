import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient, User, Session } from "@supabase/supabase-js";
import { config } from "./config.ts";

// ✅ Utilisation des valeurs depuis config.ts (généré automatiquement)
const supabase = createClient(
  config.supabaseUrl,
  config.supabaseAnonKey
);

type Purchase = {
  id: string;
  date: string;
  items: { label: string; price: number }[];
  total: number;
  status: "paid" | "pending";
};

type Booking = {
  id: string;
  date: string;
  time: string;
  service: string;
  usedCredits: number;
};

type AppUser = {
  id: string;
  email: string;
  name: string;
  credits: number;
  purchases: Purchase[];
  bookings: Booking[];
};

type AuthContextType = {
  user: AppUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => boolean;
  addPurchase: (purchase: Omit<Purchase, "id">) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_DATA_KEY = "user_data";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserData = (userId: string): AppUser | null => {
    const raw = localStorage.getItem(`${USER_DATA_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : null;
  };

  const saveUserData = (userData: AppUser) => {
    localStorage.setItem(`${USER_DATA_KEY}_${userData.id}`, JSON.stringify(userData));
  };

  const createUserData = (user: User): AppUser => ({
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.full_name || user.user_metadata?.name || "Utilisateur",
    credits: 0,
    purchases: [],
    bookings: [],
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const userData = getUserData(session.user.id) || createUserData(session.user);
        setUser(userData);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          const userData = getUserData(session.user.id) || createUserData(session.user);
          setUser(userData);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });
    if (error) throw new Error(error.message);
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const updated = { ...user, credits: user.credits + amount };
    setUser(updated);
    saveUserData(updated);
  };

  const useCredits = (amount: number): boolean => {
    if (!user || user.credits < amount) return false;
    const updated = { ...user, credits: user.credits - amount };
    setUser(updated);
    saveUserData(updated);
    return true;
  };

  const addPurchase = (purchase: Omit<Purchase, "id">) => {
    if (!user) return;
    const newPurchase: Purchase = { ...purchase, id: `p-${Date.now()}` };
    const updated = { ...user, purchases: [...user.purchases, newPurchase] };
    setUser(updated);
    saveUserData(updated);
  };

  const addBooking = (booking: Omit<Booking, "id">) => {
    if (!user) return;
    const newBooking: Booking = { ...booking, id: `b-${Date.now()}` };
    const updated = { ...user, bookings: [...user.bookings, newBooking] };
    setUser(updated);
    saveUserData(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        register,
        addCredits,
        useCredits,
        addPurchase,
        addBooking,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};