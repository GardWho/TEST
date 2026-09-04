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
  refreshProfile: () => Promise<void>;
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
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, credits, role")
      .eq("id", authUser.id)
      .maybeSingle();

    if (!profile) {
      // Créer un profil avec 0 crédit (jamais d'upsert qui écrase)
      const newProfile = {
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Utilisateur",
        credits: 0,
        role: "user",
      };
      const { error: insertError } = await supabase.from("profiles").insert([newProfile]);
      if (insertError) console.error("Erreur création profil:", insertError.message);
      // Relecture pour être sûr
      const { data: created } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      if (created) {
        setUser({
          id: created.id,
          email: created.email || "",
          name: created.full_name || "Utilisateur",
          credits: created.credits ?? 0,
          role: created.role || "user",
          purchases: [],
          bookings: [],
        });
      } else {
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
    } else {
      const { data: bookingsData } = await supabase.from("bookings").select("*").eq("user_id", authUser.id);
      // ✅ Typage correct : seulement full_name, jamais name
      const profilData = profile as { id: string; full_name?: string | null; email?: string | null; credits?: number | null; role?: string | null };
      const userName = profilData.full_name || "Utilisateur";
      setUser({
        id: profilData.id,
        email: profilData.email || "",
        name: userName,
        credits: profilData.credits ?? 0,
        role: profilData.role || "user",
        purchases: [],
        bookings: bookingsData || [],
      });
    }
  };

  // Recharger le profil (après un achat ou une réservation côté backend)
  const refreshProfile = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, credits, role")
      .eq("id", user.id)
      .single();
    if (profile) {
      setUser({
        id: profile.id,
        email: profile.email || "",
        name: profile.full_name || "Utilisateur",
        credits: profile.credits ?? 0,
        role: profile.role || "user",
        purchases: user.purchases,
        bookings: user.bookings,
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

  // Utilise la fonction RPC add_credits (atomique) pour éviter les crédits illimités
  const addCredits = async (amount: number) => {
    if (!user) return;
    const { error } = await supabase
      .rpc("add_credits", { p_user_id: user.id, p_amount: amount });
    if (error) console.error("Erreur addCredits:", error.message);
    await refreshProfile();
  };

  // Utilise la fonction RPC use_credit (atomique) pour éviter de débiter 2 fois
  const useCredits = async (amount: number): Promise<boolean> => {
    if (!user || user.credits < amount) return false;
    const { data: success, error } = await supabase
      .rpc("use_credit", { p_user_id: user.id, p_amount: amount });
    if (error) {
      console.error("Erreur useCredits:", error.message);
      return false;
    }
    if (success === true) {
      await refreshProfile();
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
        refreshProfile,
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