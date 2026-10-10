import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Purchase = { id: string; date: string; items: { label: string; price: number }[]; total: number; status: "paid" | "pending"; };
type Booking = { id: string; date: string; time: string; service: string; usedCredits: number };
type AppUser = {
  id: string;
  email: string;
  name: string;
  credits: number;
  role: string;
  purchases: Purchase[];
  bookings: Booking[];
};

type BookingInput = { date: string; time: string; service: string };
type BookingResult = { success: boolean; error?: string };

type AuthContextType = {
  user: AppUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  bookSlot: (booking: BookingInput) => Promise<BookingResult>;
  cancelBooking: (bookingId: string) => Promise<BookingResult>;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.user) setUser({ ...data.user, purchases: [], bookings: [] });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur de connexion');
    setUser({ ...data.user, purchases: [], bookings: [] });
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erreur lors de l'inscription");
    // On ne connecte pas automatiquement — l'utilisateur doit se connecter après
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  const refreshProfile = async () => {
    const res = await fetch('/api/me', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setUser({ ...data.user, purchases: user?.purchases || [], bookings: user?.bookings || [] });
    }
  };

  const bookSlot = async (booking: BookingInput): Promise<BookingResult> => {
    try {
      const response = await fetch("/api/create-booking", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data?.error || `Erreur serveur (${response.status})` };
      if (user) setUser({ ...user, credits: data.credits ?? user.credits });
      return { success: true };
    } catch (err) {
      return { success: false, error: "Impossible de contacter le serveur." };
    }
  };

  const cancelBooking = async (bookingId: string): Promise<BookingResult> => {
    try {
      const response = await fetch("/api/cancel-booking", {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await response.json();
      if (!response.ok) return { success: false, error: data?.error || `Erreur serveur (${response.status})` };
      await refreshProfile();
      return { success: true };
    } catch (err) {
      return { success: false, error: "Impossible de contacter le serveur." };
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshProfile, bookSlot, cancelBooking, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};