import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState, useEffect } from "react";
import { Trash2, ShoppingBag, MapPin, X } from "lucide-react";

// Adresse de base du moniteur
const INSTRUCTOR_ADDRESS = "24 rue Minvielle, Bordeaux, France";

// Composant Toast (notification)
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Disparaît après 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-8 right-8 z-50 max-w-sm animate-slide-up">
      <div className="bg-[#1C1814] text-[#F5EFE4] px-6 py-4 rounded-sm shadow-lg flex items-center gap-4 border-l-4 border-[#C09A3C]">
        <span className="text-[13px] tracking-wide">✓ {message}</span>
        <button onClick={onClose} className="text-[#F5EFE4]/50 hover:text-[#F5EFE4] transition-colors">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export function PanierPage() {
  const {
    items,
    removeItem,
    clearCart,
    total,
    deliveryKm,
    setDeliveryKm,
    totalWithDelivery,
    proceedToCheckout,
    loading,
  } = useCart();

  const [address, setAddress] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedKm, setCalculatedKm] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // ✅ Calcul réel de la distance via le backend
  const calculateRealDistance = async (userAddress: string) => {
    setIsCalculating(true);
    setCalculatedKm(null);
    
    try {
      const response = await fetch('/api/calculate-distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: userAddress }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du calcul");
      }

      setCalculatedKm(data.distanceKm);
      setDeliveryKm(data.distanceKm);
      
    } catch (error: any) {
      console.error("Erreur de calcul:", error);
      alert(error.message || "Erreur lors du calcul de la distance.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleAddressSubmit = () => {
    if (address.length > 5) {
      calculateRealDistance(address);
    } else {
      alert("Veuillez saisir une adresse complète.");
    }
  };

  // Afficher une notification quand un article est ajouté
  useEffect(() => {
    if (items.length > 0) {
      const lastItem = items[items.length - 1];
      if (lastItem) {
        setToastMessage(`"${lastItem.label}" ajouté au panier`);
      }
    }
  }, [items.length]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE4] pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 rounded-sm shadow-sm">
            <ShoppingBag size={64} className="text-[#C09A3C]/30 mx-auto mb-6" />
            <h1 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Votre panier est vide
            </h1>
            <p className="text-[15px] text-[#1C1814]/60 mb-8">
              Découvrez nos prestations et ajoutez des articles à votre panier.
            </p>
            <Link
              to="/prestations"
              className="inline-block px-8 py-3 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors"
            >
              Découvrir les prestations
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] pt-32 pb-16 px-8">
      {/* Toast notification */}
      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>
            Votre panier
          </h1>
          <p className="text-[14px] text-[#1C1814]/60 mt-1">{totalItems} article(s)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-sm shadow-sm flex items-center gap-4"
              >
                <div className="flex-1">
                  <h3 className="text-[15px] font-medium text-[#1C1814]">{item.label}</h3>
                  <p className="text-[13px] text-[#1C1814]/50">
                    {item.price} € × {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-medium text-[#C09A3C]">
                    {(item.price * item.quantity).toFixed(2)} €
                  </span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-8 h-8 rounded-full bg-[#F5EFE4] hover:bg-red-50 transition-colors flex items-center justify-center group"
                  >
                    <Trash2
                      size={14}
                      className="text-[#1C1814]/30 group-hover:text-red-500 transition-colors"
                    />
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={clearCart}
              className="text-[12px] text-[#1C1814]/40 hover:text-red-500 transition-colors"
            >
              Vider le panier
            </button>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
              <h2 className="text-lg font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Résumé
              </h2>

              {/* Champ adresse avec calcul réel */}
              <div className="mb-4">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#1C1814]/40 block mb-2 flex items-center gap-2">
                  <MapPin size={14} className="text-[#C09A3C]" />
                  Lieu d'intervention
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: 12 rue de Paris, 33000 Bordeaux"
                  className="w-full border border-[#C09A3C]/10 rounded-sm px-3 py-2 text-[14px] outline-none focus:border-[#C09A3C] transition-colors bg-[#F8F3EC]"
                />
                <button
                  onClick={handleAddressSubmit}
                  disabled={isCalculating || address.length < 5}
                  className="w-full mt-2 px-4 py-2 bg-[#C09A3C] text-white text-[10px] tracking-[0.2em] uppercase hover:bg-[#1C1814] transition-colors disabled:opacity-50"
                >
                  {isCalculating ? "Calcul en cours..." : "Calculer la distance"}
                </button>
                {calculatedKm !== null && (
                  <p className="text-[12px] text-[#1C1814]/60 mt-2">
                    Distance estimée : <span className="font-medium">{calculatedKm} km</span>
                    {calculatedKm > 15 && (
                      <span className="text-[#C09A3C] block mt-1">
                        Frais de déplacement : +{((calculatedKm - 15) * 0.50).toFixed(2)} €
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Totaux */}
              <div className="space-y-2 pt-4 border-t border-[#C09A3C]/10">
                <div className="flex justify-between text-[14px] text-[#1C1814]/60">
                  <span>Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                {deliveryKm > 15 && (
                  <div className="flex justify-between text-[14px] text-[#C09A3C]">
                    <span>Frais de déplacement</span>
                    <span>{((deliveryKm - 15) * 0.50).toFixed(2)} €</span>
                  </div>
                )}
                <div className="flex justify-between text-[20px] font-medium pt-4 border-t border-[#C09A3C]/15">
                  <span className="text-[#1C1814]">Total</span>
                  <span className="text-[#C09A3C]">{totalWithDelivery.toFixed(2)} €</span>
                </div>
              </div>

              {/* Bouton paiement */}
              <button
                onClick={proceedToCheckout}
                disabled={loading}
                className="w-full mt-6 py-3 bg-[#1C1814] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#C09A3C] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? "Traitement..." : `Payer ${totalWithDelivery.toFixed(2)} €`}
              </button>
              <p className="text-[10px] text-[#1C1814]/25 text-center mt-3 tracking-wider">
                Paiement sécurisé
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}