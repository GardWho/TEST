import { Link } from "react-router-dom";
import { useCart } from "../components/CartContext";
import { useState, useEffect } from "react";
import { Trash2, ShoppingBag, MapPin } from "lucide-react";

// Adresse de base du moniteur (à remplacer par la vraie)
const INSTRUCTOR_ADDRESS = "24 rue Minvielle, Bordeaux, France";

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

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Fonction de calcul de distance (simulée pour l'instant)
  const calculateDistance = async (userAddress: string) => {
    setIsCalculating(true);
    try {
      // Simulation : on attend 1s et on génère une distance aléatoire entre 5 et 50 km
      await new Promise(resolve => setTimeout(resolve, 1000));
      const randomKm = Math.floor(Math.random() * 45) + 5;
      setCalculatedKm(randomKm);
      setDeliveryKm(randomKm);
    } catch (error) {
      console.error("Erreur de calcul", error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Pour afficher une adresse fictive si besoin
  const handleAddressSubmit = () => {
    if (address.length > 5) {
      calculateDistance(address);
    } else {
      alert("Veuillez saisir une adresse complète");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5EFE4] pt-32 pb-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white p-12 rounded-sm shadow-sm">
            <ShoppingBag size={64} className="text-[#C09A3C]/30 mx-auto mb-6" />
            <h1 className="text-3xl font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Votre panier est vide</h1>
            <p className="text-[15px] text-[#1C1814]/60 mb-8">Découvrez nos prestations et ajoutez des articles à votre panier.</p>
            <Link to="/prestations" className="inline-block px-8 py-3 bg-[#C09A3C] text-white text-[11px] tracking-[0.25em] uppercase hover:bg-[#1C1814] transition-colors">Découvrir les prestations</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EFE4] pt-32 pb-16 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-normal" style={{ fontFamily: "'Playfair Display', serif" }}>Votre panier</h1>
          <p className="text-[14px] text-[#1C1814]/60 mt-1">{totalItems} article(s)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des articles */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-sm shadow-sm flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-[15px] font-medium text-[#1C1814]">{item.label}</h3>
                  <p className="text-[13px] text-[#1C1814]/50">{item.price} € × {item.quantity}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-medium text-[#C09A3C]">{(item.price * item.quantity).toFixed(2)} €</span>
                  <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full bg-[#F5EFE4] hover:bg-red-50 transition-colors flex items-center justify-center group">
                    <Trash2 size={14} className="text-[#1C1814]/30 group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            ))}
            <button onClick={clearCart} className="text-[12px] text-[#1C1814]/40 hover:text-red-500 transition-colors">Vider le panier</button>
          </div>

          {/* Résumé */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm sticky top-24">
              <h2 className="text-lg font-normal mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Résumé</h2>

{/* ✅ NOUVEAU : Champ adresse avec bouton en dessous */}
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
              <p className="text-[10px] text-[#1C1814]/25 text-center mt-3 tracking-wider">Paiement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}