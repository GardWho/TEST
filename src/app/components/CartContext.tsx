import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "../AuthContext";
import { loadStripe } from "@stripe/stripe-js";

export type CartItem = {
  id: string;
  label: string;
  price: number;
  quantity: number;
  serviceType: "cours" | "travail" | "reeducation" | "education";
};

type CartContextType = {
  items: CartItem[];
  addItem: (label: string, price: number, serviceType: CartItem["serviceType"]) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  deliveryKm: number;
  setDeliveryKm: (km: number) => void;
  totalWithDelivery: number;
  isOpen: boolean;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  proceedToCheckout: () => Promise<void>;
  loading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryKm, setDeliveryKm] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, addCredits, addPurchase } = useAuth();

  const addItem = (label: string, price: number, serviceType: CartItem["serviceType"]) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.label === label && i.price === price && i.serviceType === serviceType);
      if (existing) {
        return prev.map((i) =>
          i.label === label && i.price === price && i.serviceType === serviceType
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          id: `${label}-${Date.now()}-${Math.random()}`,
          label,
          price,
          quantity: 1,
          serviceType,
        },
      ];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const deliveryFees = deliveryKm > 15 ? (deliveryKm - 15) * 0.35 : 0;
  const totalWithDelivery = total + deliveryFees;

  const toggleCart = () => setIsOpen((prev) => !prev);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const proceedToCheckout = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour passer commande.");
      return;
    }
    if (items.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ label: i.label, price: i.price, quantity: i.quantity, serviceType: i.serviceType })),
          deliveryKm,
          userId: user.id,
          userEmail: user.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la création de la session");
      }

      const session = await response.json();

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe n'a pas pu être chargé.");

      const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
      if (error) throw new Error(error.message);
    } catch (err: any) {
      alert(err.message || "Une erreur est survenue lors du paiement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        total,
        deliveryKm,
        setDeliveryKm,
        totalWithDelivery,
        isOpen,
        toggleCart,
        openCart,
        closeCart,
        proceedToCheckout,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};