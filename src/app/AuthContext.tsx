import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  id: string;
  email: string;
  name: string;
  credits: number;
  purchases: Purchase[];
  bookings: Booking[];
};

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

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => boolean;
  addPurchase: (purchase: Omit<Purchase, "id">) => void;
  addBooking: (booking: Omit<Booking, "id">) => void;
  isAuthenticated: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simule une base de données utilisateurs (localStorage)
const STORAGE_KEY = "users_db";
const getUsers = (): Record<string, { password: string; user: User }> => {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
};
const saveUsers = (users: Record<string, { password: string; user: User }>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const record = users[email];
    if (!record || record.password !== password) {
      throw new Error("Email ou mot de passe incorrect");
    }
    setUser(record.user);
    localStorage.setItem(`current_user`, JSON.stringify(record.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("current_user");
  };

  const register = async (name: string, email: string, password: string) => {
    const users = getUsers();
    if (users[email]) throw new Error("Cet email est déjà utilisé");
    const newUser: User = {
      id: email,
      email,
      name,
      credits: 0,
      purchases: [],
      bookings: [],
    };
    users[email] = { password, user: newUser };
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(`current_user`, JSON.stringify(newUser));
  };

  const addCredits = (amount: number) => {
    if (!user) return;
    const updated = { ...user, credits: user.credits + amount };
    setUser(updated);
    updateUserInStorage(updated);
  };

  const useCredits = (amount: number): boolean => {
    if (!user || user.credits < amount) return false;
    const updated = { ...user, credits: user.credits - amount };
    setUser(updated);
    updateUserInStorage(updated);
    return true;
  };

  const addPurchase = (purchase: Omit<Purchase, "id">) => {
    if (!user) return;
    const newPurchase: Purchase = { ...purchase, id: `p-${Date.now()}` };
    const updated = { ...user, purchases: [...user.purchases, newPurchase] };
    setUser(updated);
    updateUserInStorage(updated);
  };

  const addBooking = (booking: Omit<Booking, "id">) => {
    if (!user) return;
    const newBooking: Booking = { ...booking, id: `b-${Date.now()}` };
    const updated = { ...user, bookings: [...user.bookings, newBooking] };
    setUser(updated);
    updateUserInStorage(updated);
  };

  const updateUserInStorage = (updatedUser: User) => {
    const users = getUsers();
    if (users[updatedUser.email]) {
      users[updatedUser.email].user = updatedUser;
      saveUsers(users);
      localStorage.setItem(`current_user`, JSON.stringify(updatedUser));
    }
  };

  // Restaurer la session au chargement
  useState(() => {
    const saved = localStorage.getItem("current_user");
    if (saved) setUser(JSON.parse(saved));
  });

  return (
    <AuthContext.Provider
      value={{
        user,
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