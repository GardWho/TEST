import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

type Purchase = { id: string; date: string; items: { label: string; price: number }[]; total: number; status: "paid" | "pending"; };
type Booking = { id: string; date: string; time: string; service: string; usedCredits: number };
type AppUser = { id: string; email: string; name: string; credits: number; role: string; purchases: Purchase[]; bookings: Booking[] };

type AuthContextType = {
  user: AppUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  addCredits: (amount: number) => Promise<void>;
  useCredits: (amount: number) => Promise<boolean>;
  addPurchase: (purchase: Omit<Purchase, "id">) => Promise<void>;
  addBooking: (booking: Omit<Booking, "id">) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      setSession(session);
      if (session?.user) {
        await loadProfile(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!isMounted) return;
        setSession(session);
        if (session?.user) {
          await loadProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (authUser: User) => {
    try {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, credits, role")
        .eq("id", authUser.id)
        .single();

      if (error) {
        // Si le profil n'existe pas, on le crée (avec upsert pour éviter les doublons)
        if (error.code === "PGRST116") {
          const newProfile = {
            id: authUser.id,
            email: authUser.email || "",
            full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Utilisateur",
            credits: 0,
            role: "user",
          };
          const { error: insertError } = await supabase
            .from("profiles")
            .upsert([newProfile], { onConflict: "id" });
          if (insertError) console.error("Erreur upsert profil:", insertError.message);
        } else {
          console.error("Erreur lecture profil:", error.message);
        }
      }

      // Re-lire le profil (maintenant qu'il existe ou a été récupéré)
      const { data: profile2, error: error2 } = await supabase
        .from("profiles")
        .select("id, email, full_name, credits, role")
        .eq("id", authUser.id)
        .single();

      if (error2) {
        setUser({
          id: authUser.id,
          email: authUser.email || "",
          name: authUser.user_metadata?.full_name || "Utilisateur",
          credits: 0,
          role: "user",
          purchases: [],
          bookings: [],
        });
        return;
      }

      const { data: bookingsData } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", authUser.id);

      const profilData = profile2 as {
        id: string;
        full_name?: string | null;
        name?: string | null;
        email?: string | null;
        credits?: number | null;
        role?: string | null;
      };

      const userName = profilData.full_name || profilData.name || "Utilisateur";

      setUser({
        id: profilData.id,
        email: profilData.email || "",
        name: userName,
        credits: profilData.credits ?? 0,
        role: profilData.role || "user",
        purchases: [],
        bookings: bookingsData || [],
      });
    } catch (err) {
      console.error("Erreur inattendue loadProfile:", err);
      setUser({
        id: authUser.id,
        email: authUser.email || "",
        name: authUser.user_metadata?.full_name || "Utilisateur",
        credits: 0,
        role: "user",
        purchases: [],
        bookings: [],
      });
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) throw new Error(error.message);
  };

  // ✅ Utilise la fonction RPC pour un ajout atomique
  const addCredits = async (amount: number) => {
    if (!user) return;
    const { data, error } = await supabase
      .rpc("add_credits", { p_user_id: user.id, p_amount: amount });
    if (error) console.error("Erreur addCredits:", error.message);
    else {
      setUser({ ...user, credits: user.credits + amount });
    }
  };

  // ✅ Utilise la fonction RPC pour un retrait atomique
  const useCredits = async (amount: number): Promise<boolean> => {
    if (!user || user.credits < amount) return false;
    const { data, error } = await supabase
      .rpc("use_credit", { p_user_id: user.id, p_amount: amount });
    if (error) {
      console.error("Erreur useCredits:", error.message);
      return false;
    }
    if (data === true) {
      setUser({ ...user, credits: user.credits - amount });
      return true;
    }
    return false;
  };

  const addPurchase = async (purchase: Omit<Purchase, "id">) => {
    if (!user) return;
    const newPurchase: Purchase = { ...purchase, id: `p-${Date.now()}` };
    setUser({ ...user, purchases: [...user.purchases, newPurchase] });
  };

  const addBooking = async (booking: Omit<Booking, "id">) => {
    if (!user) return;
    const newBooking: Booking = { ...booking, id: `b-${Date.now()}` };
    setUser({ ...user, bookings: [...user.bookings, newBooking] });
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