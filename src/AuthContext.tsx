import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabase";

type Purchase = { id: string; date: string; items: { label: string; price: number }[]; total: number; status: "paid" | "pending"; };
type Booking = { id: string; date: string; time: string; service: string; usedCredits: number };
type AppUser = { id: string; email: string; name: string; credits: number; role: string; purchases: Purchase[]; bookings: Booking[] };

type BookingInput = { date: string; time: string; service: string };
type BookingResult = { success: boolean; error?: string };

type AuthContextType = {
  user: AppUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  bookSlot: (booking: BookingInput) => Promise<BookingResult>;
  cancelBooking: (bookingId: string) => Promise<BookingResult>;
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
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, credits, role")
      .eq("id", authUser.id)
      .maybeSingle();

    if (!profile) {
      const newProfile = {
        id: authUser.id,
        email: authUser.email || "",
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name || "Utilisateur",
        credits: 0,
        role: "user",
      };
      const { error: insertError } = await supabase.from("profiles").insert([newProfile]);
      if (insertError) console.error("Erreur création profil:", insertError.message);
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
        setUser({ id: authUser.id, email: authUser.email || "", name: authUser.user_metadata?.full_name || "Utilisateur", credits: 0, role: "user", purchases: [], bookings: [] });
      }
    } else {
      const { data: bookingsData } = await supabase.from("bookings").select("*").eq("user_id", authUser.id);
      const profilData = profile as { id: string; full_name?: string | null; email?: string | null; credits?: number | null; role?: string | null };
      setUser({
        id: profilData.id,
        email: profilData.email || "",
        name: profilData.full_name || "Utilisateur",
        credits: profilData.credits ?? 0,
        role: profilData.role || "user",
        purchases: [],
        bookings: bookingsData || [],
      });
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, credits, role")
      .eq("id", user.id)
      .single();
    if (profile) {
      setUser((prev) =>
        prev
          ? {
              ...prev,
              email: profile.email || prev.email,
              name: profile.full_name || prev.name,
              credits: profile.credits ?? prev.credits,
              role: profile.role || prev.role,
            }
          : prev
      );
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

  const bookSlot = async (booking: BookingInput): Promise<BookingResult> => {
    if (!session) return { success: false, error: "Vous devez être connecté." };
    try {
      const response = await fetch("/api/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(booking),
      });
      let data: any = null;
      try { data = await response.json(); } catch { data = null; }
      if (!response.ok) {
        return { success: false, error: data?.error || `Erreur serveur (${response.status})` };
      }
      setUser((prev) =>
        prev
          ? {
              ...prev,
              credits: data?.credits ?? prev.credits,
              bookings: data?.booking
                ? [
                    ...prev.bookings,
                    {
                      id: data.booking.id,
                      date: data.booking.date,
                      time: data.booking.time,
                      service: data.booking.service,
                      usedCredits: 1,
                    },
                  ]
                : prev.bookings,
            }
          : prev
      );
      return { success: true };
    } catch (err) {
      console.error("Erreur bookSlot:", err);
      return { success: false, error: "Impossible de contacter le serveur." };
    }
  };

  const cancelBooking = async (bookingId: string): Promise<BookingResult> => {
    if (!session) return { success: false, error: "Vous devez être connecté." };
    try {
      const response = await fetch("/api/cancel-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ bookingId }),
      });
      let data: any = null;
      try { data = await response.json(); } catch { data = null; }
      if (!response.ok) {
        return { success: false, error: data?.error || `Erreur serveur (${response.status})` };
      }
      await refreshProfile();
      return { success: true };
    } catch (err) {
      console.error("Erreur cancelBooking:", err);
      return { success: false, error: "Impossible de contacter le serveur." };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        register,
        bookSlot,
        cancelBooking,
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